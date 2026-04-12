import './services/workerService.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

logger.info('🔄 Worker started');
logger.info(`📦 Processing submissions queue`);
logger.info(`🔗 Redis: ${config.redisUrl.split('@')[1] || 'connected'}`);

// Keep worker alive by logging activity every 25 seconds
if (config.nodeEnv === 'production') {
  setInterval(() => {
    logger.info('⏰ Worker keepalive - still processing queue');
  }, 25 * 1000); // Every 25 seconds
  
  logger.info('⏰ Worker auto-keepalive enabled (25 second interval)');
}

process.on('SIGTERM', () => {
  logger.info('👋 Worker shutting down...');
  process.exit(0);
});
