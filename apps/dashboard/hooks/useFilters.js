'use client';

import { useState, useMemo } from 'react';

export function useFilters(submissions = []) {
  const [filters, setFilters] = useState({
    difficulty: 'all',
    platform: 'all',
    search: '',
  });

  const filteredSubmissions = useMemo(() => {
    const { difficulty, platform, search } = filters;
    const searchLower = search.toLowerCase();

    return submissions.filter((s) => {
      const diffOk = difficulty === 'all' || s.difficulty === difficulty;
      const platOk = platform === 'all' || s.platform === platform;
      const searchOk = !search || s.title.toLowerCase().includes(searchLower);
      return diffOk && platOk && searchOk;
    });
  }, [submissions, filters]);

  return {
    filters,
    setFilters,
    filteredSubmissions,
  };
}
