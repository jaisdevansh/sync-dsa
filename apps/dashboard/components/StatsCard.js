'use client';

import { memo } from 'react';

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
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    glow: 'rgba(245,158,11,0.25)',
    textAccent: '#fcd34d',
    suffix: ' days',
    isStreak: true,
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

function SingleCard({ config, stats }) {
  const value = stats?.[config.key] ?? 0;
  const pct = config.getMax
    ? Math.round((value / config.getMax(stats)) * 100)
    : Math.min(value * 10, 100);

  return (
    <div
      className="glass-card p-5 relative overflow-hidden cursor-default group transition-all duration-300"
      style={{ '--glow': config.glow }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
        e.currentTarget.style.boxShadow = `0 0 32px ${config.glow}, 0 8px 32px rgba(0,0,0,0.5)`;
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = '';
      }}
    >
      {/* Background gradient blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
        style={{ background: config.gradient }} />

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 shrink-0"
        style={{ background: config.gradient, boxShadow: `0 4px 12px ${config.glow}` }}>
        {config.icon}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1 mb-1">
        <span className="text-3xl font-black text-white leading-none">
          {config.isStreak && value > 0 ? value : value}
        </span>
        {config.suffix && <span className="text-sm font-medium mb-1" style={{ color: config.textAccent }}>{config.suffix}</span>}
      </div>

      <p className="text-xs font-medium text-gray-500 mb-4">{config.label}</p>

      {/* Progress bar */}
      <div className="progress-bar w-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: config.gradient }}
        />
      </div>
    </div>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cardConfigs.map(cfg => (
          <SingleCard key={cfg.key} config={cfg} stats={stats} />
        ))}
      </div>

      {/* Compact difficulty breakdown bar */}
      <div className="glass-card mt-4 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-xs font-semibold text-gray-500 shrink-0 uppercase tracking-wider">Difficulty Split</span>
        <div className="flex-1 flex gap-1 w-full sm:w-auto">
          <div className="h-2 rounded-l-full" style={{ width: `${easyPct}%`, background: 'linear-gradient(90deg,#10b981,#34d399)', minWidth: easyPct > 0 ? '4px' : '0' }} />
          <div className="h-2" style={{ width: `${medPct}%`, background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', minWidth: medPct > 0 ? '4px' : '0' }} />
          <div className="h-2 rounded-r-full" style={{ width: `${hardPct}%`, background: 'linear-gradient(90deg,#f43f5e,#fb7185)', minWidth: hardPct > 0 ? '4px' : '0' }} />
        </div>
        <div className="flex items-center gap-4 text-xs shrink-0">
          <span className="text-emerald-400 font-semibold">E&nbsp;{stats.easyCount || 0}</span>
          <span className="text-amber-400 font-semibold">M&nbsp;{stats.mediumCount || 0}</span>
          <span className="text-rose-400 font-semibold">H&nbsp;{stats.hardCount || 0}</span>
        </div>
      </div>
    </section>
  );
});

export default StatsCard;
