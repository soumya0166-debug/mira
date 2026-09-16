import React from 'react';
import { 
  Activity, 
  Sparkles, 
  CalendarCheck, 
  Puzzle, 
  Heart, 
  TrendingUp, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Disclaimer from '../common/Disclaimer';

export default function CognitiveScoreDashboard() {
  const { cognitiveScore, t, patient } = useApp();

  // 7-Day Trend Mock Data
  const trendData = [
    { day: 'Mon', score: 78 },
    { day: 'Tue', score: 82 },
    { day: 'Wed', score: 80 },
    { day: 'Thu', score: 85 },
    { day: 'Fri', score: 84 },
    { day: 'Sat', score: 90 },
    { day: 'Sun', score: cognitiveScore.overall }
  ];

  // SVG dimensions for trend chart
  const width = 540;
  const height = 180;
  const padding = 35;

  const minScore = 60;
  const maxScore = 100;

  const points = trendData.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (trendData.length - 1);
    const y = height - padding - ((d.score - minScore) / (maxScore - minScore)) * (height - 2 * padding);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ marginBottom: '0.35rem' }}>{t.wellness.title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          {t.wellness.subtitle}
        </p>
      </div>

      {/* Mandatory Non-Diagnostic Wellness Disclaimer */}
      <Disclaimer />

      {/* Main Score Hero Card */}
      <div 
        className="mira-card mira-card-accent" 
        style={{
          marginBottom: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem 1.5rem',
          position: 'relative'
        }}
      >
        <span 
          className="badge" 
          style={{
            backgroundColor: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fde68a',
            marginBottom: '1rem',
            fontWeight: 700
          }}
        >
          <ShieldCheck size={16} /> {t.wellness.nonDiagBadge}
        </span>

        {/* Circular Dial Representation */}
        <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '1rem' }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Background Ring */}
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="var(--pink-200)"
              strokeWidth="12"
            />
            {/* Value Ring */}
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="var(--wine-700)"
              strokeWidth="12"
              strokeDasharray={427}
              strokeDashoffset={427 - (427 * cognitiveScore.overall) / 100}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>

          {/* Center Text */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--wine-900)', lineHeight: 1 }}>
              {cognitiveScore.overall}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              out of 100
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.3rem', color: 'var(--wine-900)', margin: '0 0 0.4rem' }}>
          {t.wellness.overallIndex}
        </h3>

        <p style={{ color: 'var(--wine-800)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
          {t.wellness.encouragement}
        </p>

        {/* Streak Pill */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#ffffff',
            padding: '0.5rem 1.2rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--pink-200)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🔥</span>
          <span style={{ fontWeight: 700, color: 'var(--wine-900)' }}>
            {cognitiveScore.streakDays} {t.wellness.days} {t.wellness.streakDays}
          </span>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
        {t.wellness.breakdown}
      </h2>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {/* Memory Engagement */}
        <div className="mira-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🌸</span>
            <span className="badge badge-wine" style={{ fontSize: '0.85rem' }}>
              {cognitiveScore.memoryScore}%
            </span>
          </div>
          <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.35rem', color: 'var(--wine-900)' }}>
            {t.wellness.memoryEngagement}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Active browsing, photo reactions, and listening to familiar stories.
          </p>
        </div>

        {/* Routine Consistency */}
        <div className="mira-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem' }}>📅</span>
            <span className="badge badge-wine" style={{ fontSize: '0.85rem' }}>
              {cognitiveScore.routineScore}%
            </span>
          </div>
          <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.35rem', color: 'var(--wine-900)' }}>
            {t.wellness.routineConsistency}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            {cognitiveScore.completedRoutinesCount} of {cognitiveScore.totalRoutinesCount} daily health & hydration items marked.
          </p>
        </div>

        {/* Game Activity */}
        <div className="mira-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🧩</span>
            <span className="badge badge-wine" style={{ fontSize: '0.85rem' }}>
              {cognitiveScore.gameScore}%
            </span>
          </div>
          <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.35rem', color: 'var(--wine-900)' }}>
            {t.wellness.gameActivity}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Participation in card matching, attention sequences, and word recall.
          </p>
        </div>
      </div>

      {/* Trend Curve Chart */}
      <div className="mira-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--wine-900)', margin: '0 0 0.2rem' }}>
              {t.wellness.trend7Days}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Visualizing daily engagement and cognitive stimulation consistency.
            </p>
          </div>
          <span className="badge badge-wine" style={{ fontSize: '0.8rem' }}>
            <TrendingUp size={14} /> +6% this week
          </span>
        </div>

        {/* SVG Line & Area Chart */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            style={{ width: '100%', maxHeight: '200px', display: 'block' }}
          >
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbc6d5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[70, 80, 90, 100].map((val) => {
              const y = height - padding - ((val - minScore) / (maxScore - minScore)) * (height - 2 * padding);
              return (
                <g key={val}>
                  <line 
                    x1={padding} 
                    y1={y} 
                    x2={width - padding} 
                    y2={y} 
                    stroke="var(--ivory-border)" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={padding - 8} 
                    y={y + 4} 
                    fontSize="10" 
                    fill="#9ca3af" 
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#trendGrad)" />

            {/* Line */}
            <path d={pathD} fill="none" stroke="var(--wine-700)" strokeWidth="3" strokeLinecap="round" />

            {/* Data Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="var(--wine-700)" strokeWidth="3" />
                <text 
                  x={p.x} 
                  y={height - 10} 
                  fontSize="12" 
                  fill="var(--text-muted)" 
                  textAnchor="middle"
                  fontWeight={i === points.length - 1 ? 'bold' : 'normal'}
                >
                  {p.day}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
