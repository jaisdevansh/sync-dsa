import { createDb, submissions } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { desc } from 'drizzle-orm';
import { decrypt } from '../utils/crypto.js';

const db = createDb(config.databaseUrl);

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
    }),
  ]);

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  // Don't fetch from GitHub - only use code from database
  const submissionsWithCode = recentSubmissions.map((s) => ({
    title: s.title,
    platform: s.platform,
    difficulty: s.difficulty,
    language: s.language,
    code: s.code || null,
    filePath: s.filePath,
    createdAt: s.createdAt,
  }));

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
