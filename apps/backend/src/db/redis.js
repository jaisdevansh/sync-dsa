import { Redis } from 'ioredis';
import { config } from '../config/env.js';

export const connection = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: {
    rejectUnauthorized: false,
  },
});
