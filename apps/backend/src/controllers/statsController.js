import { createDb, submissions } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { desc } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

const db = createDb(config.databaseUrl);

// Simple in-memory cache
const statsCache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

export async function getUserStats(request, reply) {
  const userId = request.user.userId;
  const now = Date.now();

  // Check cache
  const cached = statsCache.get(userId);
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    logger.info(`🎯 Cache hit for user stats: ${userId}`);
    return cached.data;
  }

  logger.info(`🔍 Fetching fresh stats for user: ${userId}`);

  const [user, userStats, allSubmissions] = await Promise.all([
    db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    }),
    db.query.stats.findFirst({
      where: (stats, { eq }) => eq(stats.userId, userId),
    }),
    db.query.submissions.findMany({
      where: (submissions, { eq }) => eq(submissions.userId, userId),
      orderBy: [desc(submissions.createdAt)],
      limit: 1000, // Fetch top 1000 as per request to avoid "missing questions"
    }),
  ]);

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  const submissionsWithCode = allSubmissions.map((s) => ({
    title: s.title,
    platform: s.platform,
    difficulty: s.difficulty,
    language: s.language,
    code: s.code || null,
    filePath: s.filePath,
    createdAt: s.createdAt,
  }));

  const responseData = {
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

  // Update cache
  statsCache.set(userId, {
    timestamp: now,
    data: responseData,
  });

  return responseData;
}
