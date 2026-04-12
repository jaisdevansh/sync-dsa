// Central API handler with retry logic
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // ms
};

/**
 * Make API request with retry logic
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<object>} Response data
 */
async function apiRequest(endpoint, options = {}, retryCount = 0) {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Retry logic
    if (retryCount < API_CONFIG.MAX_RETRIES) {
      const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
      await sleep(delay);
      return apiRequest(endpoint, options, retryCount + 1);
    }
    
    throw error;
  }
}

/**
 * Submit solution to backend
 * @param {object} data - Submission data
 * @param {string} jwt - Auth token
 * @returns {Promise<object>} Response
 */
async function submitSolution(data, jwt) {
  return apiRequest('/submission/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Get user stats
 * @param {string} jwt - Auth token
 * @returns {Promise<object>} User stats
 */
async function getUserStats(jwt) {
  return apiRequest('/stats/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });
}

/**
 * Exchange OAuth code for JWT
 * @param {string} code - OAuth code
 * @returns {Promise<object>} Auth response
 */
async function exchangeCode(code) {
  return apiRequest('/auth/github/callback', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { submitSolution, getUserStats, exchangeCode };
}
