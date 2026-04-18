'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function Dashboard() {
  const { username, repoName, stats, submissions, loading, error } = useDashboardData();
  const { filters, setFilters, filteredSubmissions } = useFilters(submissions);

  return (
    <div className="min-h-screen bg-mesh pb-20 overflow-x-hidden selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
        {error && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6 text-center"
          >
            <div className="glass-card p-10 max-w-md ring-1 ring-red-500/20 shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)]">
              <div className="text-5xl mb-6">🏜️</div>
              <h2 className="text-xl font-bold text-white mb-2">Sync Interrupted</h2>
              <p className="text-sm text-gray-400 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-red-500/25 transition-all active:scale-95"
              >Re-establish Connection</button>
            </div>
          </motion.div>
        )}
        
        {!loading && !error && (
          <motion.div key="dashboard" initial="hidden" animate="show" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Header username={username} repoName={repoName} />
            </motion.div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {/* Top Stats Overview */}
              <motion.div variants={itemVariants}>
                <StatsCard stats={stats} />
              </motion.div>

              {/* Analytics & Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8 flex flex-col">
                  <motion.div variants={itemVariants} className="flex-1 flex flex-col">
                    <ChartsSection submissions={submissions} stats={stats} />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <HeatMap submissions={submissions} />
                  </motion.div>
                </div>
                
                <div className="space-y-8">
                  <motion.div variants={itemVariants}>
                    <FilterBar filters={filters} onFilterChange={setFilters} />
                  </motion.div>
                  <motion.div variants={itemVariants} className="sticky top-8">
                    <InsightsPanel submissions={submissions} stats={stats} />
                  </motion.div>
                </div>
              </div>

              {/* Problem Log (Virtualized) */}
              <motion.div variants={itemVariants}>
                <RecentList 
                  submissions={filteredSubmissions} 
                  totalCount={submissions.length} 
                />
              </motion.div>
            </main>

            <motion.footer variants={itemVariants} className="max-w-7xl mx-auto px-8 text-center mt-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.25em]">
                Automated Sync · {repoName}
              </p>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
