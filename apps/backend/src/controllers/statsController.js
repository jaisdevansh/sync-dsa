import { createDb, submissions } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { desc } from 'drizzle-orm';
import { decrypt } from '../utils/crypto.js';

const db = createDb(config.databaseUrl);

// Fetch code from GitHub if not in database
async function fetchCodeFromGitHub(user, filePath) {
  try {
    const token = decrypt(user.githubToken);
    const response = await fetch(
      `https://api.github.com/repos/${user.githubUsername}/${user.repoName}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const code = Buffer.from(data.content, 'base64').toString('utf-8');
    return code;
  } catch (error) {
    console.error('Failed to fetch code from GitHub:', error);
    return null;
  }
}

export async function getUserStats(request, reply) {
  const userId = request.user.userId;

  const [user, userStats, recentSubmissions] = await Promise.all([
    db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    }),
    db.query.stats.findFirst({
      where: (stats, { eq }) => eq(stats.userId, userId),
    }),
    db.query.submissions.findMany({
      where: (submissions, { eq }) => eq(submissions.userId, userId),
      orderBy: [desc(submissions.createdAt)],
      limit: 10,
    }),
  ]);

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  // Fetch code from GitHub for submissions that don't have code
  const submissionsWithCode = await Promise.all(
    recentSubmissions.map(async (s) => {
      let code = s.code;
      
      // If code is not in database, fetch from GitHub (but limit size)
      if (!code || code.trim() === '') {
        code = await fetchCodeFromGitHub(user, s.filePath);
        // Limit code size to prevent huge responses
        if (code && code.length > 5000) {
          code = code.substring(0, 5000) + '\n\n// ... (code truncated)';
        }
      }
      
      return {
        title: s.title,
        platform: s.platform,
        difficulty: s.difficulty,
        language: s.language,
        code: code || null,
        filePath: s.filePath,
        createdAt: s.createdAt,
      };
    })
  );

  return {
    username: user.githubUsername,
    repoName: user.repoName,
    stats: userStats || {
      totalSolved: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
      leetcodeCount: 0,
      gfgCount: 0,
      cnCount: 0,
      streak: 0,
    },
    recentSubmissions: submissionsWithCode,
  };
}
