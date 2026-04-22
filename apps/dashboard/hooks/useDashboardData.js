'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (isSilent = false) => {
    const controller = new AbortController();
    if (!isSilent) setLoading(true);
    
    try {
      const result = await api.getDashboardData({ signal: controller.signal });
      setData(result);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, []);

  useEffect(() => {
    // 1. Handle JWT from URL (for extension deep-linking)
    if (typeof window !== 'undefined') {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://sync-dsa-2ha0.onrender.com/api';
      const params = new URLSearchParams(window.location.search);
      const urlJwt = params.get('jwt');
      if (urlJwt) {
        localStorage.setItem('github_token', urlJwt);
        // Clean URL without reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }

    // 2. Initial fetch
    fetchData();

    // 3. Polling interval
    const interval = setInterval(() => fetchData(true), 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    username: data?.username || 'Hunter',
    repoName: data?.repoName || 'sync-dsa',
    stats: (data?.stats && typeof data.stats === 'object') ? data.stats : {
      totalSolved: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
      leetcodeCount: 0,
      gfgCount: 0,
      cnCount: 0,
      streak: 0,
    },
    submissions: Array.isArray(data?.recentSubmissions) ? data.recentSubmissions : [],
  };
}
