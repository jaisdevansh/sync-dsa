'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { getUserStats } from '../../lib/api';
import StatsCard from '../../components/StatsCard';
import ChartsSection from '../../components/ChartsSection';
import HeatMap from '../../components/HeatMap';
import InsightsPanel from '../../components/InsightsPanel';
import RecentList from '../../components/RecentList';
import FilterBar from '../../components/FilterBar';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ difficulty: 'all', platform: 'all', search: '' });

  const fetchData = useCallback(async () => {
    try {
      const jwt = new URLSearchParams(window.location.search).get('jwt');
      if (!jwt) { setError('No authentication token found'); setLoading(false); return; }
      const result = await getUserStats(jwt);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredSubmissions = data?.recentSubmissions?.filter((s) => {
    const diffOk = filters.difficulty === 'all' || s.difficulty === filters.difficulty;
    const platOk = filters.platform === 'all' || s.platform === filters.platform;
    const searchOk = !filters.search || s.title.toLowerCase().includes(filters.search.toLowerCase());
    return diffOk && platOk && searchOk;
  }) ?? [];

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="glass-card p-10 text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Error</h2>
          <p className="text-sm text-gray-400">{error}</p>
          <p className="text-xs text-gray-600 mt-3">Open the dashboard from the Chrome extension.</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-mesh">
      <Header username={data.username} repoName={data.repoName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <StatsCard stats={data.stats} />

        {/* Charts */}
        <ChartsSection submissions={data.recentSubmissions} stats={data.stats} />

        {/* Heatmap */}
        <HeatMap submissions={data.recentSubmissions} />

        {/* Insights */}
        <InsightsPanel submissions={data.recentSubmissions} stats={data.stats} />

        {/* Filter Bar */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Submissions List */}
        <RecentList submissions={filteredSubmissions} totalCount={data.recentSubmissions?.length ?? 0} />
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-white/5 mt-8">
        <p className="text-center text-xs text-gray-600">
          DSA Sync — <span className="text-indigo-500">@{data.username}</span> · Built to track greatness
        </p>
      </footer>
    </div>
  );
}
