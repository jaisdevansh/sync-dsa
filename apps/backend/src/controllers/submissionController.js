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

    // 4. Update Stats
    await statsService.updateStats(userId, submission.platform, submission.difficulty);

    // 5. GitHub Sync
    try {
      const githubToken = decrypt(user.githubToken);
      await githubService.pushToGitHub({
        token: githubToken,
        repoName: user.repoName,
        username: user.githubUsername,
        submission,
      });
      
      return response.success(reply, {
        githubSynced: true,
        submissionId: newSubmission.id,
      }, 201);
    } catch (ghError) {
      logger.error(`[Submission] GitHub Sync failed for user ${userId}:`, ghError.message);
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
