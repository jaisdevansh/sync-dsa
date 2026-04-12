const requests = new Map();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 30;

export function rateLimit(req, reply, done) {
  const key = req.ip;
  const now = Date.now();
  
  const userRequests = requests.get(key) || [];
  const recentRequests = userRequests.filter(time => now - time < WINDOW_MS);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return reply.status(429).send({ error: 'Too many requests' });
  }
  
  recentRequests.push(now);
  requests.set(key, recentRequests);
  
  done();
}
