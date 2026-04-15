'use client';

import { useState } from 'react';

export default function RecentList({ submissions }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const difficultyColors = {
    easy: 'bg-green-900/30 text-green-400 border-green-800',
    medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    hard: 'bg-red-900/30 text-red-400 border-red-800',
  };

  const platformColors = {
    leetcode: 'text-orange-400',
    gfg: 'text-green-400',
    codingninjas: 'text-red-400',
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Submissions</h3>
      <div className="space-y-3">
        {submissions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No submissions yet</p>
        ) : (
          submissions.map((sub, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-800 hover:border-gray-700 transition-all overflow-hidden"
            >
              {/* Header - Always visible */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{sub.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium ${platformColors[sub.platform]}`}>
                      {sub.platform}
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-400">{sub.language}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      difficultyColors[sub.difficulty]
                    }`}
                  >
                    {sub.difficulty}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Code Preview - Expandable */}
              {expandedIndex === index && sub.code && (
                <div className="border-t border-gray-800 bg-gray-950 p-4">
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    <code>{sub.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
