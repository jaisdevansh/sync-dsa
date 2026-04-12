'use client';

export default function PlatformStats({ stats }) {
  const platforms = [
    { name: 'LeetCode', count: stats.leetcodeCount, color: 'bg-orange-500' },
    { name: 'GeeksforGeeks', count: stats.gfgCount, color: 'bg-green-500' },
    { name: 'CodingNinjas', count: stats.cnCount, color: 'bg-red-500' },
  ];

  const difficulties = [
    { name: 'Easy', count: stats.easyCount, color: 'bg-green-500' },
    { name: 'Medium', count: stats.mediumCount, color: 'bg-yellow-500' },
    { name: 'Hard', count: stats.hardCount, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Platform Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">By Platform</h3>
        <div className="space-y-3">
          {platforms.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{platform.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{platform.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">By Difficulty</h3>
        <div className="space-y-3">
          {difficulties.map((diff) => (
            <div key={diff.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${diff.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{diff.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{diff.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
