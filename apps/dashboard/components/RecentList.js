'use client';

import { useState, useCallback, memo, useMemo } from 'react';


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

const SubmissionRow = memo(function SubmissionRow({ sub, index, isExpanded, onToggle, style }) {
  const diff = DIFF_STYLES[sub.difficulty] || DIFF_STYLES.medium;
  const plat = PLAT_STYLES[sub.platform] || { color: '#6b7280', label: sub.platform, icon: '⚪' };
  const langColor = LANG_COLORS[sub.language?.toLowerCase()] || '#6b7280';

  return (
    <div style={style} className="px-1 py-1">
      <div
        className="rounded-xl overflow-hidden transition-all duration-200 border border-white/5 h-full flex items-center"
        style={{ 
           borderColor: isExpanded ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
           background: isExpanded ? 'rgba(99,102,241,0.05)' : 'transparent'
        }}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none w-full">
          <span className="text-xs text-gray-600 font-mono w-5 shrink-0 text-right">{index + 1}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{sub.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-medium" style={{ color: plat.color }}>{plat.icon} {plat.label}</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs font-mono" style={{ color: langColor }}>{sub.language}</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-600">{formatDate(sub.createdAt)}</span>
            </div>
          </div>
          <span
            className="badge shrink-0"
            style={{ background: diff.bg, border: `1px solid ${diff.border}`, color: diff.color }}
          >
            {diff.label}
          </span>
          <svg
            className="w-4 h-4 shrink-0 transition-transform duration-300"
            style={{ color: '#4b5563', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
});

const RecentList = memo(function RecentList({ submissions = [], totalCount }) {
  const [expandedSub, setExpandedSub] = useState(null);

  const Row = useCallback(({ index, style }) => {
    const sub = submissions[index];
    return (
      <SubmissionRow 
        sub={sub} 
        index={index} 
        style={style} 
        isExpanded={expandedSub?.id === sub.id} 
        onToggle={() => setExpandedSub(expandedSub?.id === sub.id ? null : sub)}
      />
    );
  }, [submissions, expandedSub]);

  const handleExport = useCallback(() => {
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
  }, [submissions]);

  return (
    <div className="glass-card p-6 flex flex-col" style={{ height: '600px' }}>
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Submissions Log</h3>
          <p className="text-xs text-gray-500 mt-1">
            Virtualized viewport: {submissions.length} items
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-t border-white/5 pt-4">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <span className="text-4xl mb-4">🧊</span>
            <p className="text-sm">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {submissions.map((sub, idx) => (
              <SubmissionRow 
                key={sub.id || idx}
                sub={sub} 
                index={idx} 
                isExpanded={expandedSub?.id === sub.id} 
                onToggle={() => setExpandedSub(expandedSub?.id === sub.id ? null : sub)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Code Viewer Modal */}
      {expandedSub && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setExpandedSub(null)} />
          <div className="glass-card w-full max-w-4xl max-h-[80vh] flex flex-col relative z-10 overflow-hidden shadow-2xl border-white/10">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div>
                <h3 className="text-white font-bold">{expandedSub.title}</h3>
                <p className="text-xs text-gray-500 uppercase">{expandedSub.platform} · {expandedSub.language}</p>
              </div>
              <button 
                onClick={() => setExpandedSub(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white"
              >✕</button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-black/40">
              {expandedSub.code ? (
                <pre className="code-block text-gray-300 p-4 rounded-xl bg-black/60 border border-white/5">
                  <code>{expandedSub.code}</code>
                </pre>
              ) : (
                <div className="text-center py-20 text-gray-500">
                   <p>Code only available for the 50 most recent submissions</p>
                   <p className="text-xs mt-2">View older code directly on GitHub</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default RecentList;
