import { z } from 'zod';
import { createDb, users } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { encrypt } from '../utils/crypto.js';
import { eq } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = createDb(config.databaseUrl);

const callbackSchema = z.object({
  code: z.string(),
});

export async function handleGitHubCallback(request, reply) {
  // Handle both query params (from GitHub redirect) and body (from extension POST)
  const codeData = request.method === 'GET' ? request.query : request.body;
  const { code } = callbackSchema.parse(codeData);

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: config.githubClientId,
      client_secret: config.githubClientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return reply.status(400).send({ error: 'Failed to get access token' });
  }

  // Get user info
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const userData = await userResponse.json();
  const githubUsername = userData.login;

  // Encrypt token
  const encryptedToken = encrypt(accessToken);
  const repoName = 'dsa-solutions';

  // Find or create user
  let user = await db.query.users.findFirst({
    where: eq(users.githubUsername, githubUsername),
  });

  if (user) {
    await db
      .update(users)
      .set({ githubToken: encryptedToken })
      .where(eq(users.id, user.id));
  } else {
    const [newUser] = await db
      .insert(users)
      .values({
        githubUsername,
        githubToken: encryptedToken,
        repoName,
      })
      .returning();
    user = newUser;
  }

  // ✅ FIX: Await JWT generation
  const jwt = await reply.jwtSign({ userId: user.id });

  // If it's a GET request (from GitHub redirect), show a success page
  if (request.method === 'GET') {
    // Read HTML template
    const templatePath = join(__dirname, '../views/success.html');
    let html = readFileSync(templatePath, 'utf-8');
    
    // Replace placeholders
    html = html.replace(/{{USERNAME}}/g, githubUsername);
    html = html.replace(/{{JWT}}/g, jwt);
    
    return reply.type('text/html').send(html);
  }

  // If it's a POST request (from extension), return JSON
  return { jwt, username: githubUsername };
}
