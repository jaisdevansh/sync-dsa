'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];
const PLATFORMS = ['all', 'leetcode', 'gfg', 'codingninjas'];

const diffColors = {
  all: { active: '#6366f1', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)' },
  easy: { active: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)' },
  medium: { active: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)' },
  hard: { active: '#f43f5e', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.4)' },
};
const platColors = {
  all: { active: '#6366f1' },
  leetcode: { active: '#f97316' },
  gfg: { active: '#22c55e' },
  codingninjas: { active: '#a855f7' },
};

const FilterBar = memo(function FilterBar({ filters, onFilterChange }) {
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounced update for search
  const debouncedSearch = useCallback(
    debounce((val) => {
      onFilterChange((prev) => ({ ...prev, search: val }));
    }, 300),
    [onFilterChange]
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    debouncedSearch(val);
  };

  const setDifficulty = (d) => onFilterChange((prev) => ({ ...prev, difficulty: d }));
  const setPlatform = (p) => onFilterChange((prev) => ({ ...prev, platform: p }));

  return (
    <div className="glass-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search problems..."
            value={localSearch}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl text-white placeholder-gray-600 outline-none focus:ring-1 transition-all bg-white/5 border border-white/10 focus:border-indigo-500/50"
          />
        </div>

        {/* Difficulty pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {DIFFICULTIES.map((d) => {
            const active = filters.difficulty === d;
            const c = diffColors[d];
            return (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200"
                style={{
                  background: active ? c.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? c.border : 'rgba(255,255,255,0.07)'}`,
                  color: active ? c.active : '#6b7280',
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {d === 'all' ? '✦ All' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Platform pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {PLATFORMS.map((p) => {
            const active = filters.platform === p;
            const c = platColors[p];
            const label = { all: '✦ All', leetcode: 'LeetCode', gfg: 'GFG', codingninjas: 'CN' }[p];
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: active ? `rgba(${p === 'leetcode' ? '249,115,22' : p === 'gfg' ? '34,197,94' : p === 'codingninjas' ? '168,85,247' : '99,102,241'},0.12)` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? c.active + '66' : 'rgba(255,255,255,0.07)'}`,
                  color: active ? c.active : '#6b7280',
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default FilterBar;
