export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">DSA Auto Sync</h1>
          <p className="text-xl text-gray-300">
            Automatically sync your coding solutions to GitHub
          </p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Solve 5 problems to unlock your dashboard
          </h2>
          <p className="text-gray-400">
            Install the Chrome extension and start solving problems on LeetCode or GeeksforGeeks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-lg hover:border-gray-700 transition-all">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold text-white">Auto Detect</div>
            <div className="text-gray-400">Detects accepted submissions</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-lg hover:border-gray-700 transition-all">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-white">Instant Sync</div>
            <div className="text-gray-400">Pushes to GitHub instantly</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-lg hover:border-gray-700 transition-all">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-white">Track Progress</div>
            <div className="text-gray-400">View stats and streaks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
