import { z } from 'zod';
import { createDb, submissions, users } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { submissionQueue } from '../services/queueService.js';
import { updateStats } from '../services/statsService.js';
import { decrypt } from '../utils/crypto.js';
import { and, eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

const db = createDb(config.databaseUrl);

const submissionSchema = z.object({
  title: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  code: z.string().min(1),
  language: z.string().min(1),
  platform: z.enum(['leetcode', 'gfg', 'codingninjas']),
});

export async function handleSubmission(request, reply) {
  const userId = request.user.userId;
  const submission = submissionSchema.parse(request.body);

  logger.info(`📥 Submission received: ${submission.title} from user ${userId}`);

  // Get user and check for duplicate
  const [user, existingSubmission] = await Promise.all([
    db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    }),
    db.query.submissions.findFirst({
      where: (submissions, { and, eq }) =>
        and(
          eq(submissions.userId, userId),
          eq(submissions.title, submission.title),
          eq(submissions.platform, submission.platform)
        ),
    }),
  ]);

  if (!user) {
    logger.error(`❌ User ${userId} not found`);
    return reply.status(404).send({ error: 'User not found' });
  }

  // Skip if already submitted
  if (existingSubmission) {
    logger.info(`⏭️ Skipping duplicate: ${submission.title}`);
    return reply.status(200).send({
      success: true,
      message: 'Already submitted',
      submissionId: existingSubmission.id,
    });
  }

  // Create file path
  const filePath = `${submission.platform}/${submission.difficulty}/${submission.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

  // Insert submission
  const [newSubmission] = await db
    .insert(submissions)
    .values({
      userId,
      platform: submission.platform,
      title: submission.title,
      difficulty: submission.difficulty,
      language: submission.language,
      filePath,
    })
    .returning();

  logger.info(`💾 Submission saved to DB: ${newSubmission.id}`);

  // Update stats
  await updateStats(userId, submission.platform, submission.difficulty);

  // Queue GitHub push
  const githubToken = decrypt(user.githubToken);
  await submissionQueue.add('push-to-github', {
    userId,
    submission,
    githubToken,
    repoName: user.repoName,
    githubUsername: user.githubUsername,
  });

  logger.info(`📤 Job queued for GitHub push: ${submission.title}`);

  return reply.status(200).send({
    success: true,
    submissionId: newSubmission.id,
  });
}
