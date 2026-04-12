import { Worker } from 'bullmq';
import { connection } from '../db/redis.js';
import { githubService } from './githubService.js';
import { logger } from '../utils/logger.js';

export const submissionWorker = new Worker(
  'submissions',
  async (job) => {
    const { userId, submission, githubToken, repoName, githubUsername } = job.data;

    try {
      await githubService.pushToGitHub({
        token: githubToken,
        repoName,
        username: githubUsername,
        submission,
      });

      logger.info(`✅ Pushed ${submission.title} to GitHub for user ${userId}`);
    } catch (error) {
      logger.error(`❌ Failed to push ${submission.title}:`, error);
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
