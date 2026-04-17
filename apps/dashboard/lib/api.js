const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('github_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('github_token');
          if (typeof window !== 'undefined') window.location.href = '/';
        }
        throw new Error(result.error?.message || 'Request failed');
      }

      // Handle the { success: true, data: ... } format
      return result.success ? result.data : result;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  }

  async getDashboardData(options = {}) {
    return this.request('/stats/me', options);
  }

  async syncSubmission(data, options = {}) {
    return this.request('/submission', {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }
}

export const api = new ApiService();
