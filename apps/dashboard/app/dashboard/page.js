'use client';

import dynamic from 'next/dynamic';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useFilters } from '../../hooks/useFilters';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';

// --- Lazy Components ---
const StatsCard = dynamic(() => import('../../components/StatsCard'), { ssr: false });
const ChartsSection = dynamic(() => import('../../components/ChartsSection'), { ssr: false });
const HeatMap = dynamic(() => import('../../components/HeatMap'), { ssr: false });
const InsightsPanel = dynamic(() => import('../../components/InsightsPanel'), { ssr: false });
const RecentList = dynamic(() => import('../../components/RecentList'), { ssr: false });
const FilterBar = dynamic(() => import('../../components/FilterBar'), { ssr: false });

export default function Dashboard() {
  // 1. Centralized Data Fetching
  const { 
    username, 
    repoName, 
    stats, 
    submissions, 
    loading, 
    error 
  } = useDashboardData();

  // 2. Specialized Filtering Logic
  const { 
    filters, 
    setFilters, 
    filteredSubmissions 
  } = useFilters(submissions);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center p-6 text-center">
        <div className="glass-card p-10 max-w-md">
          <div className="text-5xl mb-6">🏜️</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-500 transition-all"
          >Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh pb-20">
      <Header username={username} repoName={repoName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-700">
        {/* Top Stats Overview */}
        <StatsCard stats={stats} />

        {/* Analytics & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ChartsSection submissions={submissions} stats={stats} />
            <HeatMap submissions={submissions} />
          </div>
          
          <div className="space-y-8">
            <InsightsPanel submissions={submissions} stats={stats} />
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Problem Log (Virtualized) */}
        <RecentList 
          submissions={filteredSubmissions} 
          totalCount={submissions.length} 
        />
      </main>

      <footer className="max-w-7xl mx-auto px-8 text-center mt-12 opacity-50">
        <p className="text-[10px] text-gray-700 uppercase tracking-[0.2em]">
          Automated Sync · {repoName} · Established 2026
        </p>
      </footer>
    </div>
  );
}
