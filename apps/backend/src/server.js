import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from './config/env.js';
import { authRoutes } from './routes/auth.js';
import { submissionRoutes } from './routes/submission.js';
import { statsRoutes } from './routes/stats.js';
import { errorHandler } from './utils/error-handler.js';
import { rateLimit } from './utils/rate-limit.js';
import { logger } from './utils/logger.js';
import { runMigrations } from './db/migrate.js';

// Import worker to start it alongside the server
import './services/workerService.js';

const fastify = Fastify({
  logger: config.nodeEnv === 'development',
  requestIdLogLabel: 'reqId',
});

// Run migrations on startup
await runMigrations();

// Register plugins
await fastify.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
});

await fastify.register(jwt, {
  secret: config.jwtSecret,
});

// Global middleware
fastify.setErrorHandler(errorHandler);
fastify.addHook('preHandler', rateLimit);

// Routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(submissionRoutes, { prefix: '/api/submission' });
await fastify.register(statsRoutes, { prefix: '/api/stats' });

// Health check
fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// Keepalive endpoint (for cron jobs)
fastify.get('/keepalive', async () => ({ 
  status: 'alive', 
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}));

// Start server
try {
  await fastify.listen({ port: config.port, host: '0.0.0.0' });
  logger.info(`🚀 Server running on port ${config.port}`);
  logger.info(`🔄 Worker running (processing submissions queue)`);
  logger.info(`📝 Environment: ${config.nodeEnv}`);
  
  // Self-ping to keep Render service alive (free tier sleeps after 15 min)
  if (config.nodeEnv === 'production') {
    const BACKEND_URL = process.env.BACKEND_URL || 'https://dsa-sync-backend.onrender.com';
    
    // Ping every 25 seconds to keep service always active
    setInterval(async () => {
      try {
        await fetch(`${BACKEND_URL}/keepalive`);
        logger.info('⏰ Keepalive ping sent (25s interval)');
      } catch (error) {
        logger.error('⏰ Keepalive ping failed:', error.message);
      }
    }, 25 * 1000); // Every 25 seconds
    
    logger.info('⏰ Auto-keepalive enabled (25 second interval)');
  }
} catch (err) {
  logger.error('Failed to start server:', err);
  process.exit(1);
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await fastify.close();
  process.exit(0);
});
