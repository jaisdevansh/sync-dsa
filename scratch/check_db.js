
import { createDb, users, submissions } from '../packages/database/src/index.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../apps/backend/.env') });

const db = createDb(process.env.DATABASE_URL);

async function check() {
  try {
    const allUsers = await db.select().from(users);
    console.log('--- USERS ---');
    console.log(allUsers.map(u => ({ id: u.id, username: u.githubUsername, repo: u.repoName, hasToken: !!u.githubToken })));

    const lastSubmissions = await db.select().from(submissions).limit(5);
    console.log('\n--- LAST 5 SUBMISSIONS ---');
    console.log(lastSubmissions.map(s => ({ id: s.id, userId: s.userId, platform: s.platform, title: s.title, createdAt: s.createdAt })));
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    process.exit(0);
  }
}

check();
