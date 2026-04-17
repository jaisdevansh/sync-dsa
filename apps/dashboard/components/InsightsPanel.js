'use client';

import { memo, useMemo } from 'react';

function generateInsights(submissions, stats) {
  const insights = [];
  if (!submissions || !submissions.length) return insights;

  const total = stats.totalSolved || 0;
  const easy = stats.easyCount || 0;
  const med = stats.mediumCount || 0;
  const hard = stats.hardCount || 0;
  const streak = stats.streak || 0;

  // Weekday analysis
  const weekdayCounts = Array(7).fill(0);
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  submissions.forEach((s) => weekdayCounts[new Date(s.createdAt).getDay()]++);
  const peakDay = weekdayCounts.indexOf(Math.max(...weekdayCounts));
  if (weekdayCounts[peakDay] > 0) {
    insights.push({
      icon: '📅',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.08)',
      border: 'rgba(139,92,246,0.15)',
      text: `You're most productive on <strong>${DAYS[peakDay]}s</strong> with ${weekdayCounts[peakDay]} solutions`,
    });
  }

  // Strength
  const dominant = easy >= med && easy >= hard ? 'Easy' : med >= hard ? 'Medium' : 'Hard';
  const dominantColor = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#f43f5e' }[dominant];
  insights.push({
    icon: '💡',
    color: dominantColor,
    bg: `rgba(${dominant === 'Easy' ? '16,185,129' : dominant === 'Medium' ? '245,158,11' : '244,63,94'},0.08)`,
    border: `rgba(${dominant === 'Easy' ? '16,185,129' : dominant === 'Medium' ? '245,158,11' : '244,63,94'},0.15)`,
    text: `Your strength is <strong>${dominant}</strong> problems — ${dominant === 'Hard' ? 'You\'re pushing limits! 🔥' : 'try leveling up to harder ones'}`,
  });

  // Hard problems
  if (hard === 0) {
    insights.push({
      icon: '🎯',
      color: '#f43f5e',
      bg: 'rgba(244,63,94,0.08)',
      border: 'rgba(244,63,94,0.15)',
      text: "You haven't solved any <strong>Hard</strong> problems yet — challenge yourself!",
    });
  } else if (hard >= 5) {
    insights.push({
      icon: '🏆',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.15)',
      text: `Impressive! You've cracked <strong>${hard} Hard</strong> problems — top-tier performance`,
    });
  }

  // Streak
  if (streak >= 7) {
    insights.push({
      icon: '🔥',
      color: '#f97316',
      bg: 'rgba(249,115,22,0.08)',
      border: 'rgba(249,115,22,0.15)',
      text: `<strong>${streak}-day streak!</strong> You're on fire — keep the consistency going`,
    });
  } else if (streak === 0) {
    insights.push({
      icon: '⚡',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.08)',
      border: 'rgba(99,102,241,0.15)',
      text: 'Start your streak today — solve one problem to light the fire 🔥',
    });
  }

  // Platform diversity
  const platforms = [stats.leetcodeCount, stats.gfgCount, stats.cnCount].filter(Boolean).length;
  if (platforms === 1) {
    insights.push({
      icon: '🌐',
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.08)',
      border: 'rgba(6,182,212,0.15)',
      text: 'You\'re solving on <strong>1 platform</strong> — try GFG or CodingNinjas for diverse problems',
    });
  } else if (platforms === 3) {
    insights.push({
      icon: '🌟',
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.08)',
      border: 'rgba(6,182,212,0.15)',
      text: 'You\'re active on <strong>all 3 platforms</strong> — excellent diversity in your practice',
    });
  }

  // Milestone
  const milestones = [10, 25, 50, 100, 200, 500];
  const next = milestones.find((m) => m > total);
  if (next) {
    insights.push({
      icon: '🚀',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.15)',
      text: `<strong>${next - total} more problems</strong> to hit the ${next} milestone — you're almost there!`,
    });
  }

  return insights.slice(0, 5);
}

const InsightsPanel = memo(function InsightsPanel({ submissions, stats }) {
  const insights = useMemo(() => generateInsights(submissions, stats), [submissions, stats]);

  if (!insights.length) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>✨</div>
        <h3 className="text-sm font-semibold text-white">Smart Insights</h3>
        <span className="text-xs text-gray-600 ml-1">— AI-powered analysis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map((ins, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200 cursor-default"
            style={{ background: ins.bg, border: `1px solid ${ins.border}` }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span className="text-lg shrink-0 mt-0.5">{ins.icon}</span>
            <p
              className="text-xs text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: ins.text.replace(/<strong>/g, `<strong style="color:${ins.color}">`) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default InsightsPanel;
