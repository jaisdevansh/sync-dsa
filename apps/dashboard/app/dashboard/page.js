'use client';

import { useEffect, useState } from 'react';
import { getUserStats } from '../../lib/api';
import StatsCard from '../../components/StatsCard';
import PlatformStats from '../../components/PlatformStats';
import RecentList from '../../components/RecentList';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const jwt = new URLSearchParams(window.location.search).get('jwt');
      
      if (!jwt) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const result = await getUserStats(jwt);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">DSA Dashboard</h1>
              <p className="text-gray-400 mt-1">@{data.username}</p>
            </div>
            <a
              href={`https://github.com/${data.username}/${data.repoName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Solved"
            value={data.stats.totalSolved}
            icon="🎯"
            color="blue"
          />
          <StatsCard
            title="Streak"
            value={`${data.stats.streak} 🔥`}
            icon="⚡"
            color="orange"
          />
          <StatsCard
            title="Easy"
            value={data.stats.easyCount}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Hard"
            value={data.stats.hardCount}
            icon="💪"
            color="purple"
          />
        </div>

        {/* Platform & Difficulty Stats */}
        <PlatformStats stats={data.stats} />

        {/* Recent Submissions */}
        <div className="mt-8">
          <RecentList submissions={data.recentSubmissions} />
        </div>
      </main>
    </div>
  );
}
