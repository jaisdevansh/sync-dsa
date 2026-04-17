'use client';

export default function LoadingScreen() {
  const cards = [1, 2, 3, 4];
  return (
    <div className="min-h-screen bg-mesh">
      {/* Fake header */}
      <div className="border-b border-white/5 px-8 py-4" style={{ background: 'rgba(3,7,18,0.85)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl shimmer" />
            <div className="space-y-2">
              <div className="w-24 h-4 rounded shimmer" />
              <div className="w-16 h-3 rounded shimmer" />
            </div>
          </div>
          <div className="w-32 h-9 rounded-xl shimmer" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="w-20 h-3 rounded shimmer" />
              <div className="w-14 h-8 rounded shimmer" />
              <div className="w-full h-1.5 rounded-full shimmer" />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-6 lg:col-span-2 h-64">
            <div className="w-32 h-4 rounded shimmer mb-6" />
            <div className="w-full h-44 rounded-lg shimmer" />
          </div>
          <div className="glass-card p-6 h-64">
            <div className="w-24 h-4 rounded shimmer mb-6" />
            <div className="w-40 h-40 rounded-full shimmer mx-auto" />
          </div>
        </div>

        {/* Heatmap skeleton */}
        <div className="glass-card p-6">
          <div className="w-28 h-4 rounded shimmer mb-4" />
          <div className="w-full h-20 rounded-lg shimmer" />
        </div>

        {/* List skeleton */}
        <div className="glass-card p-6 space-y-3">
          <div className="w-36 h-4 rounded shimmer mb-2" />
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/4">
              <div className="flex-1 space-y-2">
                <div className="w-48 h-4 rounded shimmer" />
                <div className="w-32 h-3 rounded shimmer" />
              </div>
              <div className="w-16 h-6 rounded-full shimmer" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
