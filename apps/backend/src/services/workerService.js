import { Worker } from 'bullmq';
import { connection } from '../db/redis.js';
import { githubService } from './githubService.js';
import { logger } from '../utils/logger.js';

export const submissionWorker = new Worker(
  'submissions',
  async (job) => {
    const { userId, submission, githubToken, repoName, githubUsername } = job.data;

    logger.info(`🔄 Job ${job.id}: ${submission.title}`);

    try {
      await githubService.pushToGitHub({
        token: githubToken,
        repoName,
        username: githubUsername,
        submission,
      });

      logger.info(`✅ Pushed: ${submission.title}`);
    } catch (error) {
      logger.error(`❌ Failed: ${submission.title} - ${error.message}`);
      throw error;
    }
  },
  {
    connection,
    concurrency: 2, // Reduce concurrency to save Redis commands
    limiter: {
      max: 5, // Max 5 jobs per duration
      duration: 60000, // Per minute
    },
  }
);

submissionWorker.on('completed', (job) => {
  logger.info(`✅ Job ${job.id} completed`);
});

submissionWorker.on('failed', (job, err) => {
  logger.error(`❌ Job ${job?.id} failed:`, err.message);
});
