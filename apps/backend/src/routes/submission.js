import { authenticate } from '../middleware/authMiddleware.js';
import { handleSubmission } from '../controllers/submissionController.js';

export async function submissionRoutes(fastify) {
  fastify.post('/submit', {
    preHandler: authenticate,
    handler: handleSubmission,
  });
}
