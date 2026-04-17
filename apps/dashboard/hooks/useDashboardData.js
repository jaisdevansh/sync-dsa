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
    const cleanup = fetchData();
    const interval = setInterval(() => fetchData(true), 5 * 60 * 1000);
    return () => {
      cleanup?.();
      clearInterval(interval);
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    username: data?.username,
    repoName: data?.repoName,
    stats: data?.stats || {
      totalSolved: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
      leetcodeCount: 0,
      gfgCount: 0,
      cnCount: 0,
      streak: 0,
    },
    submissions: data?.recentSubmissions || [],
  };
}
