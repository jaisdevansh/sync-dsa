import { eq } from 'drizzle-orm';
import { createDb, stats } from '@dsa-sync/database';
import { config } from '../config/env.js';

const db = createDb(config.databaseUrl);

export async function updateStats(userId, platform, difficulty) {
  const existing = await db.query.stats.findFirst({
    where: eq(stats.userId, userId),
  });

  const now = new Date();
  const lastSolved = existing?.lastSolvedDate;
  
  let streak = existing?.streak || 0;
  if (lastSolved) {
    const daysDiff = Math.floor(
      (now.getTime() - lastSolved.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff === 1) streak++;
    else if (daysDiff > 1) streak = 1;
  } else {
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
