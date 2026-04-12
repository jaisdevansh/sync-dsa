import { authenticate } from '../middleware/authMiddleware.js';
import { getUserStats } from '../controllers/statsController.js';

export async function statsRoutes(fastify) {
  fastify.get('/me', {
    preHandler: authenticate,
    handler: getUserStats,
  });
}
