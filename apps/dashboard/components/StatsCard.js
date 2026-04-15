'use client';

export default function StatsCard({ title, value, icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 hover:shadow-xl hover:border-gray-700 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`${colors[color]} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
