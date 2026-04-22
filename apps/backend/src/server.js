import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import { config } from './config/env.js';
import { authRoutes } from './routes/auth.js';
import { submissionRoutes } from './routes/submission.js';
import { statsRoutes } from './routes/stats.js';
import { errorHandler } from './utils/error-handler.js';
import { rateLimit } from './utils/rate-limit.js';
import { logger } from './utils/logger.js';
import { runMigrations } from './db/migrate.js';

const fastify = Fastify({
  logger: {
    level: config.nodeEnv === 'development' ? 'debug' : 'info',
    transport: config.nodeEnv === 'development' ? { target: 'pino-pretty' } : undefined,
  },
  requestIdLogLabel: 'reqId',
});

// Run migrations on startup
await runMigrations();

// Register plugins
await fastify.register(compress, { global: true });
await fastify.register(helmet, { contentSecurityPolicy: false });
await fastify.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
});

await fastify.register(jwt, {
  secret: config.jwtSecret,
});

// Global middleware
fastify.setErrorHandler(errorHandler);
fastify.addHook('onRequest', async (request, reply) => {
  logger.info(`Incoming ${request.method} request to ${request.url}`);
});
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
  logger.info(`📝 Environment: ${config.nodeEnv}`);
  logger.info(`✅ Queue enabled - Background processing active`);
  
  // Self-ping to keep Render service alive (only in production)
  if (config.nodeEnv === 'production') {
    const BACKEND_URL = process.env.BACKEND_URL || 'https://sync-dsa-2ha0.onrender.com';
    
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
  } else {
    logger.info('⏰ Auto-keepalive disabled (development mode)');
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
