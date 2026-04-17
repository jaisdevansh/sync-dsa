export default function Home() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
      <div className="text-center max-w-2xl w-full">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
            ⚡
          </div>
        </div>

        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">DSA Auto Sync</h1>
        <p className="text-lg text-gray-400 mb-10">
          Your premium coding analytics dashboard. Track every solution, every streak, every win.
        </p>

        {/* Main card */}
        <div className="glass-card p-10 mb-6 text-center"
          style={{ boxShadow: '0 0 60px rgba(99,102,241,0.1)' }}>
          <div className="text-6xl mb-5">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Install the Extension to get started
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Solve problems on LeetCode, GeeksforGeeks, or CodingNinjas.<br />
            Your solutions sync to GitHub automatically and appear here.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: 'Auto Detect', desc: 'Captures accepted submissions instantly', color: '#6366f1' },
            { icon: '⚡', title: 'Instant Sync', desc: 'Pushes to GitHub in real-time', color: '#8b5cf6' },
            { icon: '📊', title: 'Rich Analytics', desc: 'Charts, heatmaps & smart insights', color: '#06b6d4' },
          ].map((f) => (
            <div key={f.title} className="glass-card p-5 text-left transition-all duration-200"
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = `${f.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = ''; }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{f.title}</div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-700 mt-8">
          Open your dashboard from the Chrome extension after solving 5+ problems
        </p>
      </div>
    </div>
  );
}
