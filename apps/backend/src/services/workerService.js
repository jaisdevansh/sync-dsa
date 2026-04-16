import { Worker } from 'bullmq';
import { connection } from '../db/redis.js';
import { githubService } from './githubService.js';
import { logger } from '../utils/logger.js';

export const submissionWorker = new Worker(
  'submissions',
  async (job) => {
    const { userId, submission, githubToken, repoName, githubUsername } = job.data;

    logger.info(`🔄 Processing job ${job.id} for user ${userId}`);
    logger.info(`📝 Title: ${submission.title}`);
    logger.info(`🏷️ Platform: ${submission.platform}`);
    logger.info(`💻 Language: ${submission.language}`);
    logger.info(`📄 Code length: ${submission.code?.length || 0} chars`);

    try {
      await githubService.pushToGitHub({
        token: githubToken,
        repoName,
        username: githubUsername,
        submission,
      });

      logger.info(`✅ Successfully pushed ${submission.title} to GitHub for user ${userId}`);
    } catch (error) {
      logger.error(`❌ Failed to push ${submission.title} for user ${userId}:`, error.message);
      logger.error(`❌ Error stack:`, error.stack);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

submissionWorker.on('completed', (job) => {
  logger.info(`✅ Job ${job.id} completed`);
});

submissionWorker.on('failed', (job, err) => {
  logger.error(`❌ Job ${job?.id} failed:`, err.message);
});
