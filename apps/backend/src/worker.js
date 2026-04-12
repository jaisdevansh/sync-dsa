import './services/workerService.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

logger.info('🔄 Worker started');
logger.info(`📦 Processing submissions queue`);
logger.info(`🔗 Redis: ${config.redisUrl.split('@')[1] || 'connected'}`);

process.on('SIGTERM', () => {
  logger.info('👋 Worker shutting down...');
  process.exit(0);
});
