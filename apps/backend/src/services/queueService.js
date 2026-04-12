import { Queue } from 'bullmq';
import { connection } from '../db/redis.js';

export const submissionQueue = new Queue('submissions', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});
