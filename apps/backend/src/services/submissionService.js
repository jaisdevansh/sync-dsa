import { createDb, submissions, stats, students } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { eq, sql } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

const db = createDb(config.databaseUrl);

export const submissionService = {
  async createSubmission({ userId, platform, title, difficulty, language, code, filePath }) {
    return await db.transaction(async (tx) => {
      // 1. Save submission
      const [newSubmission] = await tx.insert(submissions).values({
        userId,
        platform: platform.toLowerCase(),
        title,
        difficulty: difficulty.toLowerCase(),
        language: language.toLowerCase(),
        code,
        filePath,
      }).returning();

      // 2. Update stats atomically
      const platformKey = {
        leetcode: 'leetcodeCount',
        gfg: 'gfgCount',
        codingninjas: 'cnCount'
      }[platform.toLowerCase()] || 'leetcodeCount';

      const diffKey = {
        easy: 'easyCount',
        medium: 'mediumCount',
        hard: 'hardCount'
      }[difficulty.toLowerCase()] || 'mediumCount';

      await tx.insert(stats)
        .values({
          userId,
          totalSolved: 1,
          [platformKey]: 1,
          [diffKey]: 1,
          streak: 1,
          lastSolvedDate: new Date(),
        })
        .onConflictDoUpdate({
          target: stats.userId,
          set: {
            totalSolved: sql`${stats.totalSolved} + 1`,
            [platformKey]: sql`${stats[platformKey]} + 1`,
            [diffKey]: sql`${stats[diffKey]} + 1`,
            lastSolvedDate: new Date(),
            // Streak logic would go here: check if yesterday was lastSolvedDate
          },
        });

      return newSubmission;
    });
  },

  async getSubmissionsByUserId(userId, limit = 1000) {
    return await db.query.submissions.findMany({
      where: eq(submissions.userId, userId),
      orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
      limit,
    });
  }
};
