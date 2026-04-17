'use client';

import { memo, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts';

// ── helpers ──────────────────────────────────────────────────────────────────
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function getLast30Days(submissions) {
  const byDate = {};
  submissions.forEach((s) => {
    const d = new Date(s.createdAt);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    byDate[key] = (byDate[key] || 0) + 1;
  });

  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    days.push({ date: key, solved: byDate[key] || 0 });
  }
  return days;
}

function getWeeklyActivity(submissions) {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = Array(7).fill(0);
  submissions.forEach((s) => { counts[new Date(s.createdAt).getDay()]++; });
  return DAYS.map((d, i) => ({ day: d, solved: counts[i] }));
}

// ── custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, suffix = 'solved' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-xs border border-white/10">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-white font-bold text-sm">{payload[0].value} <span className="text-gray-400 font-normal">{suffix}</span></p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-xs border border-white/10">
      <p className="font-bold text-white">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }}>{payload[0].value} problems</p>
    </div>
  );
};

// ── section wrapper ───────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
const ChartsSection = memo(function ChartsSection({ submissions = [], stats }) {
  const lineData = useMemo(() => getLast30Days(submissions), [submissions]);
  const weekData = useMemo(() => getWeeklyActivity(submissions), [submissions]);

  const diffPie = useMemo(() => [
    { name: 'Easy', value: stats?.easyCount || 0, fill: '#10b981' },
    { name: 'Medium', value: stats?.mediumCount || 0, fill: '#f59e0b' },
    { name: 'Hard', value: stats?.hardCount || 0, fill: '#f43f5e' },
  ].filter((d) => d.value > 0), [stats]);

  const platformPie = useMemo(() => [
    { name: 'LeetCode', value: stats?.leetcodeCount || 0, fill: '#f97316' },
    { name: 'GFG', value: stats?.gfgCount || 0, fill: '#22c55e' },
    { name: 'CodingNinjas', value: stats?.cnCount || 0, fill: '#a855f7' },
  ].filter((d) => d.value > 0), [stats]);

  const axisStyle = { fill: '#6b7280', fontSize: 11, fontFamily: 'Inter' };
  const gridStyle = { stroke: 'rgba(255,255,255,0.04)' };

  if (!submissions.length) {
    return (
      <div className="glass-card p-10 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-gray-500 text-sm">Solve more problems to unlock charts</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Row 1 — Line + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Line Chart */}
        <ChartCard
          title="30-Day Activity"
          subtitle="Daily problems solved"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <CartesianGrid stroke={gridStyle.stroke} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false}
                interval="preserveStartEnd" />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="solved"
                stroke="url(#lineGrad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#030712', strokeWidth: 2 }}
                filter="url(#glow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Difficulty Donut */}
        <ChartCard title="Difficulty Mix" subtitle="Easy / Medium / Hard">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={diffPie}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {diffPie.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2 — Weekly + Platform */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Bar */}
        <ChartCard title="Weekly Pattern" subtitle="Problems by day of week">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridStyle.stroke} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="solved" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Platform Donut */}
        <ChartCard title="Platform Distribution" subtitle="Where you grind the most">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={platformPie}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {platformPie.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
});

export default ChartsSection;
