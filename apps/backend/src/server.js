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

// Import worker to start it alongside the server
import './services/workerService.js';

const fastify = Fastify({
  logger: config.nodeEnv === 'development',
  requestIdLogLabel: 'reqId',
});

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

// Start server
try {
  await fastify.listen({ port: config.port, host: '0.0.0.0' });
  logger.info(`🚀 Server running on port ${config.port}`);
  logger.info(`🔄 Worker running (processing submissions queue)`);
  logger.info(`📝 Environment: ${config.nodeEnv}`);
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
