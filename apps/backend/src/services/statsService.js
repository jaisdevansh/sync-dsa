import { createDb, submissions, stats, users } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { eq, desc, sql } from 'drizzle-orm';

const db = createDb(config.databaseUrl);

// Stats logic
export const statsService = {
  async getDashboardData(userId) {
    // 1. Fetch user & stats
    const [user, userStats] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { githubUsername: true, repoName: true }
      }),
      db.query.stats.findFirst({
        where: eq(stats.userId, userId),
      })
    ]);

    if (!user) return null;

    // 2. Fetch optimized submissions (no code for old ones)
    const submissionsData = await db.select({
      id: submissions.id,
      title: submissions.title,
      platform: submissions.platform,
      difficulty: submissions.difficulty,
      language: submissions.language,
      createdAt: submissions.createdAt,
      // Optimized code fetching (only latest 50)
      code: sql`case when ${submissions.id} in (
          SELECT id FROM ${submissions} 
          WHERE user_id = ${userId} 
          ORDER BY created_at DESC LIMIT 50
      ) then ${submissions.code} else null end`
    })
    .from(submissions)
    .where(eq(submissions.userId, userId))
    .orderBy(desc(submissions.createdAt))
    .limit(1000);

    return {
      user: {
        username: user.githubUsername,
        repoName: user.repoName,
      },
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
      submissions: submissionsData
    };
  },

  async updateStats(userId, platform, difficulty) {
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

    await db.insert(stats)
      .values({
        userId,
        totalSolved: 1,
        [platformKey]: 1,
        [diffKey]: 1,
        streak: 1,
        lastSolvedDate: sql`CURRENT_TIMESTAMP`,
      })
      .onConflictDoUpdate({
        target: stats.userId,
        set: {
          totalSolved: sql`${stats.totalSolved} + 1`,
          [platformKey]: sql`${stats[platformKey]} + 1`,
          [diffKey]: sql`${stats[diffKey]} + 1`,
          lastSolvedDate: sql`CURRENT_TIMESTAMP`,
          // PostgreSQL streak logic:
          // - Solved TODAY already  → keep current streak (no double-count)
          // - Solved YESTERDAY      → extend streak by 1
          // - Gap of 2+ days        → reset to 1
          streak: sql`
            CASE
              WHEN ${stats.lastSolvedDate}::date = CURRENT_DATE
                THEN ${stats.streak}
              WHEN ${stats.lastSolvedDate}::date = CURRENT_DATE - INTERVAL '1 day'
                THEN ${stats.streak} + 1
              ELSE 1
            END
          `,
        },
      });
  }
};
