'use client';

export default function RecentList({ submissions }) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const platformColors = {
    leetcode: 'text-orange-600',
    gfg: 'text-green-600',
    codingninjas: 'text-red-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
      <div className="space-y-3">
        {submissions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No submissions yet</p>
        ) : (
          submissions.map((sub, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{sub.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium ${platformColors[sub.platform]}`}>
                    {sub.platform}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{sub.language}</span>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  difficultyColors[sub.difficulty]
                }`}
              >
                {sub.difficulty}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
