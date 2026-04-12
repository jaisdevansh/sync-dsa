import { handleGitHubCallback } from '../controllers/authController.js';
import { config } from '../config/env.js';

export async function authRoutes(fastify) {
  // Redirect to GitHub OAuth
  fastify.get('/github', async (request, reply) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&scope=repo`;
    return reply.redirect(redirectUri);
  });

  // GitHub OAuth callback - handles GET from GitHub
  fastify.get('/github/callback', handleGitHubCallback);
  
  // Extension endpoint - handles POST from extension with code
  fastify.post('/github/exchange', handleGitHubCallback);
}
