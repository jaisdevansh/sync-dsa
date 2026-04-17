import { logger } from './utils/logger.js';

logger.info('🔄 Worker started');
logger.info('✅ The background worker process has been DEPRECATED.');
logger.info('🚀 DSA Auto Sync now pushes code directly to GitHub synchronously for better reliability.');
logger.info('🛑 You can safely close this terminal process (`npm run dev:worker`) as it is no longer needed.');

// Exit cleanly
process.exit(0);
