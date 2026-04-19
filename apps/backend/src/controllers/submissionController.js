import { createDb, submissions, users } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { githubService } from '../services/githubService.js';
import { statsService } from '../services/statsService.js';
import { decrypt } from '../utils/crypto.js';
import { response } from '../utils/response.js';
import { submissionSchema } from '../schemas/index.js';
import { logger } from '../utils/logger.js';

const db = createDb(config.databaseUrl);

export async function handleSubmission(request, reply) {
  const userId = request.user.userId;
  
  // 1. Validation
  const validation = submissionSchema.safeParse(request.body);
  if (!validation.success) {
    return response.error(reply, validation.error.message, 400, 'VALIDATION_ERROR');
  }
  const submission = validation.data;

  logger.info(`📥 ${submission.platform}: ${submission.title} (${submission.difficulty})`);

  try {
    // 2. Data consistency check
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

    if (!user) return response.error(reply, 'User not found', 404, 'USER_NOT_FOUND');

    if (existingSubmission) {
      logger.info(`⏭️ Duplicate: ${submission.title}`);
      return response.success(reply, {
        message: 'Already submitted',
        submissionId: existingSubmission.id,
      });
    }

    // 3. Process Submission
    const filePath = githubService.getFilePath(submission);

    const [newSubmission] = await db
      .insert(submissions)
      .values({
        userId,
        platform: submission.platform,
        title: submission.title,
        difficulty: submission.difficulty,
        language: submission.language,
        code: submission.code,
        filePath,
      })
      .returning();

    logger.info(`💾 Saved to DB: ${submission.title} (ID: ${newSubmission.id})`);

    // 4. Update Stats
    await statsService.updateStats(userId, submission.platform, submission.difficulty);

    // 5. GitHub Sync
    try {
      const githubToken = decrypt(user.githubToken);
      logger.info(`🔄 Pushing to GitHub: ${submission.title}`);
      
      await githubService.pushToGitHub({
        token: githubToken,
        repoName: user.repoName,
        username: user.githubUsername,
        submission,
      });
      
      logger.info(`✅ Pushed to GitHub: ${submission.title}`);
      
      return response.success(reply, {
        githubSynced: true,
        submissionId: newSubmission.id,
      }, 201);
    } catch (ghError) {
      logger.error(`❌ GitHub Sync failed for ${submission.title}:`, ghError.message);
      return response.success(reply, {
        githubSynced: false,
        error: ghError.message,
        submissionId: newSubmission.id,
      }, 201);
    }

  } catch (error) {
    logger.error(`[SubmissionController] Crash for user ${userId}:`, error);
    // Exposing the exact error to the client to debug API issues like encryption mismatches
    return response.error(reply, error.message || 'Internal server error');
  }
}
