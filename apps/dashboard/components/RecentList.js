'use client';

import { useState, useCallback, memo } from 'react';

const DIFF_STYLES = {
  easy:   { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  color: '#34d399', label: 'Easy' },
  medium: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  color: '#fbbf24', label: 'Medium' },
  hard:   { bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.3)',   color: '#fb7185', label: 'Hard'  },
};
const PLAT_STYLES = {
  leetcode:     { color: '#f97316', label: 'LeetCode',     icon: '🟠' },
  gfg:          { color: '#22c55e', label: 'GFG',          icon: '🟢' },
  codingninjas: { color: '#a855f7', label: 'CodingNinjas', icon: '🟣' },
};
const LANG_COLORS = {
  python: '#3b82f6', javascript: '#f59e0b', cpp: '#8b5cf6', java: '#f97316',
  c: '#06b6d4', typescript: '#6366f1', go: '#10b981', rust: '#f43f5e',
};

function formatDate(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const SubmissionRow = memo(function SubmissionRow({ sub, index, isExpanded, onToggle }) {
  const diff = DIFF_STYLES[sub.difficulty] || DIFF_STYLES.medium;
  const plat = PLAT_STYLES[sub.platform] || { color: '#6b7280', label: sub.platform, icon: '⚪' };
  const langColor = LANG_COLORS[sub.language?.toLowerCase()] || '#6b7280';
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sub.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sub.code]);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{ border: `1px solid ${isExpanded ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)'}` }}
    >
      {/* Row Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        style={{ background: isExpanded ? 'rgba(99,102,241,0.05)' : 'transparent' }}
        onClick={onToggle}
        onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
        onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
      >
        {/* Index */}
        <span className="text-xs text-gray-600 font-mono w-5 shrink-0 text-right">{index + 1}</span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white truncate">{sub.title}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-medium" style={{ color: plat.color }}>{plat.icon} {plat.label}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs font-mono" style={{ color: langColor }}>{sub.language}</span>
            {sub.createdAt && (
              <>
                <span className="text-gray-700">·</span>
                <span className="text-xs text-gray-600">{formatDate(sub.createdAt)}</span>
              </>
            )}
          </div>
        </div>

        {/* Difficulty badge */}
        <span
          className="badge shrink-0"
          style={{ background: diff.bg, border: `1px solid ${diff.border}`, color: diff.color }}
        >
          {diff.label}
        </span>

        {/* Expand arrow */}
        <svg
          className="w-4 h-4 shrink-0 transition-transform duration-300"
          style={{ color: '#4b5563', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Code */}
      {isExpanded && (
        <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
          {sub.code ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: langColor }}>
                    {sub.language?.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600">solution</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.1)',
                    border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'}`,
                    color: copied ? '#34d399' : '#a5b4fc',
                  }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre
                className="code-block text-gray-300 overflow-x-auto max-h-80 p-4 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <code>{sub.code}</code>
              </pre>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs text-gray-600">Code not available for this submission</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

const PAGE_SIZE = 20;

const RecentList = memo(function RecentList({ submissions = [], totalCount }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [page, setPage] = useState(1);

  const visibleSubs = submissions.slice(0, page * PAGE_SIZE);
  const hasMore = visibleSubs.length < submissions.length;

  const toggle = useCallback((i) => {
    setExpandedIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">All Submissions</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {visibleSubs.length} of {submissions.length}
            {submissions.length !== totalCount && ` (filtered from ${totalCount})`}
          </p>
        </div>
        {submissions.length > 0 && (
          <button
            onClick={() => {
              const csv = [
                'Title,Platform,Difficulty,Language,Date',
                ...submissions.map((s) =>
                  `"${s.title}","${s.platform}","${s.difficulty}","${s.language}","${formatDate(s.createdAt)}"`
                ),
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'dsa-submissions.csv'; a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#a5b4fc',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
          >
            ⬇ Export CSV
          </button>
        )}
      </div>

      {/* List */}
      {submissions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm text-gray-500">No submissions match your filters</p>
          <p className="text-xs text-gray-600 mt-1">Try adjusting the difficulty or platform filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleSubs.map((sub, i) => (
            <SubmissionRow
              key={`${sub.title}-${i}`}
              sub={sub}
              index={i}
              isExpanded={expandedIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#a5b4fc',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Load more ({submissions.length - visibleSubs.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
});

export default RecentList;
