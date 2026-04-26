'use client';

import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const cardConfigs = [
  {
    key: 'totalSolved',
    label: 'Total Solved',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.25)',
    textAccent: '#a5b4fc',
    getMax: (s) => Math.max(s?.totalSolved || 0, 1),
  },
  {
    key: 'streak',
    label: 'Day Streak',
    icon: '🔥',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    glow: 'rgba(249,115,22,0.25)',
    textAccent: '#fdba74',
    suffix: ' days',
    isStreak: true,
  },
  {
    key: 'easyCount',
    label: 'Easy',
    icon: '🌱',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    glow: 'rgba(16,185,129,0.2)',
    textAccent: '#6ee7b7',
    getMax: (s) => Math.max(s?.totalSolved || 0, 1),
  },
  {
    key: 'mediumCount',
    label: 'Medium',
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #eab308, #f59e0b)',
    glow: 'rgba(234,179,8,0.2)',
    textAccent: '#fde68a',
    getMax: (s) => Math.max(s?.totalSolved || 0, 1),
  },
  {
    key: 'hardCount',
    label: 'Hard',
    icon: '💪',
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    glow: 'rgba(244,63,94,0.2)',
    textAccent: '#fca5a5',
    getMax: (s) => Math.max(s?.totalSolved || 0, 1),
  },
];

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;
    
    let totalDuration = 1000;
    let incrementTime = (totalDuration / end);
    incrementTime = incrementTime < 10 ? 10 : incrementTime;
    
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <>{displayValue}</>;
};

function SingleCard({ config, stats }) {
  const value = stats?.[config.key] ?? 0;
  const pct = config.getMax
    ? Math.round((value / config.getMax(stats)) * 100)
    : Math.min(value * 10, 100);

  return (
    <motion.div
      className="glass-card p-5 relative overflow-hidden group cursor-default"
      style={{ '--glow': config.glow }}
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: `0 0 40px ${config.glow}, 0 20px 40px rgba(0,0,0,0.4)`,
        borderColor: 'rgba(255,255,255,0.15)'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Background gradient blob */}
      <motion.div 
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: config.gradient }} 
      />

      {/* Icon */}
      <motion.div 
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: config.gradient, boxShadow: `0 4px 12px ${config.glow}` }}
      >
        {config.icon}
      </motion.div>

      {/* Value */}
      <div className="flex items-end gap-1 mb-1">
        <span className="text-3xl font-black text-white leading-none tracking-tight">
          {value > 0 ? <AnimatedNumber value={value} /> : 0}
        </span>
        {config.suffix && <span className="text-sm font-medium mb-1" style={{ color: config.textAccent }}>{config.suffix}</span>}
      </div>

      <p className="text-xs font-medium text-gray-500 mb-4 tracking-wide">{config.label}</p>

      {/* Progress bar */}
      <div className="progress-bar w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{ background: config.gradient }}
        />
      </div>
    </motion.div>
  );
}

const StatsCard = memo(function StatsCard({ stats }) {
  if (!stats) return null;
  const total = stats.totalSolved || 1;
  const easyPct = Math.round(((stats.easyCount || 0) / total) * 100);
  const medPct = Math.round(((stats.mediumCount || 0) / total) * 100);
  const hardPct = Math.round(((stats.hardCount || 0) / total) * 100);

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {cardConfigs.map(cfg => (
          <SingleCard key={cfg.key} config={cfg} stats={stats} />
        ))}
      </div>

      {/* Compact difficulty breakdown bar */}
      <motion.div 
        className="glass-card mt-5 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-xs font-semibold text-gray-500 shrink-0 uppercase tracking-widest">Difficulty Split</span>
        <div className="flex-1 flex gap-1 w-full sm:w-auto h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
          <motion.div 
            className="h-full rounded-full" 
            initial={{ width: 0 }} animate={{ width: `${easyPct}%` }} transition={{ duration: 1, delay: 0.5 }}
            style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }} 
          />
          <motion.div 
            className="h-full rounded-full" 
            initial={{ width: 0 }} animate={{ width: `${medPct}%` }} transition={{ duration: 1, delay: 0.6 }}
            style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)' }} 
          />
          <motion.div 
            className="h-full rounded-full" 
            initial={{ width: 0 }} animate={{ width: `${hardPct}%` }} transition={{ duration: 1, delay: 0.7 }}
            style={{ background: 'linear-gradient(90deg,#f43f5e,#fb7185)' }} 
          />
        </div>
        <div className="flex items-center gap-4 text-xs shrink-0 font-medium tracking-wide">
          <span className="text-emerald-400">E&nbsp;{stats.easyCount || 0}</span>
          <span className="text-amber-400">M&nbsp;{stats.mediumCount || 0}</span>
          <span className="text-rose-400">H&nbsp;{stats.hardCount || 0}</span>
        </div>
      </motion.div>
    </section>
  );
});

export default StatsCard;
