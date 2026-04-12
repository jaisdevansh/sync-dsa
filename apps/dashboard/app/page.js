export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">DSA Auto Sync</h1>
          <p className="text-xl text-gray-600">
            Automatically sync your coding solutions to GitHub
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Solve 5 problems to unlock your dashboard
          </h2>
          <p className="text-gray-600">
            Install the Chrome extension and start solving problems on LeetCode or GeeksforGeeks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold text-gray-800">Auto Detect</div>
            <div className="text-gray-600">Detects accepted submissions</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-gray-800">Instant Sync</div>
            <div className="text-gray-600">Pushes to GitHub instantly</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-800">Track Progress</div>
            <div className="text-gray-600">View stats and streaks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
