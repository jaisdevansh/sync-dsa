'use client';

import { memo, useMemo, useState, useEffect, useRef } from 'react';

const LEVELS = [
  { min: 0, max: 0, bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.06)' },
  { min: 1, max: 1, bg: 'rgba(99,102,241,0.25)', border: 'rgba(99,102,241,0.3)' },
  { min: 2, max: 3, bg: 'rgba(99,102,241,0.5)', border: 'rgba(99,102,241,0.5)' },
  { min: 4, max: 6, bg: 'rgba(99,102,241,0.75)', border: 'rgba(99,102,241,0.7)' },
  { min: 7, max: Infinity, bg: '#6366f1', border: '#818cf8' },
];

function getLevel(count) {
  return LEVELS.find((l) => count >= l.min && count <= l.max) || LEVELS[0];
}

function buildGrid(submissions) {
  // Build a map of date → count for last 365 days
  const countMap = {};
  submissions.forEach((s) => {
    const d = new Date(s.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    countMap[key] = (countMap[key] || 0) + 1;
  });

  const today = new Date();
  // Start from 52 weeks ago, aligned to Sunday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const weeks = [];
  let current = new Date(startDate);

  while (current <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      const isFuture = current > today;
      week.push({
        date: key,
        display: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        count: isFuture ? -1 : (countMap[key] || 0),
        isFuture,
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const HeatMap = memo(function HeatMap({ submissions = [] }) {
  const [tooltip, setTooltip] = useState(null);
  const scrollRef = useRef(null);
  const weeks = useMemo(() => buildGrid(submissions), [submissions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [weeks]);

  const totalThisYear = useMemo(() => {
    const yearStart = new Date().getFullYear();
    return submissions.filter((s) => new Date(s.createdAt).getFullYear() === yearStart).length;
  }, [submissions]);

  // Build month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDay = week.find((d) => !d.isFuture);
      if (firstDay) {
        const m = new Date(firstDay.date).getMonth();
        if (m !== lastMonth) { labels.push({ wi, label: MONTHS[m] }); lastMonth = m; }
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Contribution Heatmap</h3>
          <p className="text-xs text-gray-500 mt-0.5">{totalThisYear} problems solved this year</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span>Less</span>
          {LEVELS.map((l, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: l.bg, border: `1px solid ${l.border}` }} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2" ref={scrollRef}>
        <div className="inline-flex flex-col gap-1" style={{ minWidth: 'max-content' }}>
          {/* Month labels */}
          <div className="flex gap-1 pl-8">
            {weeks.map((_, wi) => {
              const found = monthLabels.find((m) => m.wi === wi);
              return (
                <div key={wi} className="w-3 text-center" style={{ fontSize: 9, color: '#6b7280' }}>
                  {found ? found.label : ''}
                </div>
              );
            })}
          </div>

          {/* Grid rows (day 0=Sun … 6=Sat) */}
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div key={day} className="flex items-center gap-1">
              <span className="w-7 text-right pr-1 shrink-0" style={{ fontSize: 9, color: '#6b7280' }}>
                {day % 2 === 1 ? WEEKDAYS[day] : ''}
              </span>
              {weeks.map((week, wi) => {
                const cell = week[day];
                if (!cell || cell.isFuture) {
                  return <div key={wi} className="w-3 h-3 rounded-sm opacity-0" />;
                }
                const level = getLevel(cell.count);
                return (
                  <div
                    key={wi}
                    className="heat-cell w-3 h-3 rounded-sm relative"
                    style={{ background: level.bg, border: `1px solid ${level.border}` }}
                    onMouseEnter={() => setTooltip({ x: wi, y: day, cell })}
                    onMouseLeave={() => setTooltip(null)}
                    title={`${cell.display}: ${cell.count} problem${cell.count !== 1 ? 's' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Height Tooltip Area to prevent layout shift / flickering */}
      <div className="h-6 mt-3 text-center text-xs text-gray-400 pointer-events-none flex items-center justify-center">
        {tooltip ? (
          <span className="animate-in fade-in slide-in-from-bottom-1 duration-200">
            <span className="text-indigo-400 font-bold">{tooltip.cell.count} submissions</span>
            {' '}on <span className="text-gray-300">{tooltip.cell.display}</span>
          </span>
        ) : (
          <span className="opacity-0">Hover to view</span>
        )}
      </div>
    </div>
  );
});

export default HeatMap;
