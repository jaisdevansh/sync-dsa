import { ZodError } from 'zod';

export function errorHandler(error, request, reply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation Error',
      details: error.errors,
    });
  }

  if (error.statusCode === 401) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  request.log.error(error);

  return reply.status(error.statusCode || 500).send({
    error: error.message || 'Internal Server Error',
  });
}
