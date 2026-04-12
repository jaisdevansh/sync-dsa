export async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}

export function extractUserId(request) {
  return request.user?.userId;
}
