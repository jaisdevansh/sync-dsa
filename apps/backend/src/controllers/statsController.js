import { statsService } from '../services/statsService.js';
import { response } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Simple in-memory cache
const statsCache = new Map();
const CACHE_TTL = 30 * 1000;

export async function getUserStats(request, reply) {
  const userId = request.user.userId;
  const now = Date.now();

  const cached = statsCache.get(userId);
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return response.success(reply, cached.data);
  }

  try {
    const data = await statsService.getDashboardData(userId);
    
    if (!data) {
      return response.error(reply, 'User content not found', 404, 'USER_NOT_FOUND');
    }

    const formattedData = {
      username: data.user.username,
      repoName: data.user.repoName,
      stats: data.stats,
      recentSubmissions: data.submissions,
    };

    statsCache.set(userId, {
      timestamp: now,
      data: formattedData,
    });

    return response.success(reply, formattedData);
  } catch (error) {
    logger.error(`[StatsController] Error fetching data for ${userId}:`, error);
    return response.error(reply, 'Failed to retrieve dashboard data');
  }
}
