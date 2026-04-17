import { eq } from 'drizzle-orm';
import { createDb, stats } from '@dsa-sync/database';
import { config } from '../config/env.js';

const db = createDb(config.databaseUrl);

export async function updateStats(userId, platform, difficulty) {
  const existing = await db.query.stats.findFirst({
    where: eq(stats.userId, userId),
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let streak = existing?.streak || 0;
  let lastDate = existing?.lastSolvedDate ? new Date(existing.lastSolvedDate) : null;
  
  if (lastDate) {
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    const diffTime = today.getTime() - lastDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Solved on consecutive day
      streak++;
    } else if (diffDays > 1) {
      // Streak broken
      streak = 1;
    } else if (diffDays === 0) {
      // Already solved today, keep current streak
      streak = existing.streak;
    }
  } else {
    // First time solving
    streak = 1;
  }

  const updates = {
    totalSolved: (existing?.totalSolved || 0) + 1,
    streak,
    lastSolvedDate: now,
  };

  if (difficulty === 'easy') updates.easyCount = (existing?.easyCount || 0) + 1;
  if (difficulty === 'medium') updates.mediumCount = (existing?.mediumCount || 0) + 1;
  if (difficulty === 'hard') updates.hardCount = (existing?.hardCount || 0) + 1;

  if (platform === 'leetcode') updates.leetcodeCount = (existing?.leetcodeCount || 0) + 1;
  if (platform === 'gfg') updates.gfgCount = (existing?.gfgCount || 0) + 1;
  if (platform === 'codingninjas') updates.cnCount = (existing?.cnCount || 0) + 1;

  if (existing) {
    await db.update(stats).set(updates).where(eq(stats.userId, userId));
  } else {
    await db.insert(stats).values({ userId, ...updates });
  }
}
