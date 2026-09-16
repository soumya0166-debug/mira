import React from 'react';

/**
 * 6-Axis Radar Chart for CDR-Inspired Cognitive Functional Screening
 * Domains: Memory (M), Orientation (O), Judgment (JPS), Community (CA), Home & Hobbies (HH), Personal Care (PC)
 * Scale: 0 (center) to 3 (outer boundary)
 */
export default function CognitiveRadarChart({ assessment, size = 320 }) {
  if (!assessment) return null;

  const domains = [
    { key: 'memory', code: 'M', label: 'Memory', score: assessment.memory_score ?? assessment.memory ?? 0 },
    { key: 'orientation', code: 'O', label: 'Orientation', score: assessment.orientation_score ?? assessment.orientation ?? 0 },
    { key: 'judgment_problem_solving', code: 'JPS', label: 'Judgment', score: assessment.judgment_score ?? assessment.judgment_problem_solving ?? 0 },
    { key: 'community_affairs', code: 'CA', label: 'Community', score: assessment.community_score ?? assessment.community_affairs ?? 0 },
    { key: 'home_hobbies', code: 'HH', label: 'Home & Hobbies', score: assessment.home_hobbies_score ?? assessment.home_hobbies ?? 0 },
    { key: 'personal_care', code: 'PC', label: 'Personal Care', score: assessment.personal_care_score ?? assessment.personal_care ?? 0 }
  ];

  const center = size / 2;
  const radius = size * 0.38;
  const maxScore = 3.0;
  const angleStep = (Math.PI * 2) / domains.length;

  // Grid levels (0.5, 1.0, 2.0, 3.0)
  const gridLevels = [0.5, 1.0, 2.0, 3.0];

  // Helper to get coordinates for a domain index and score
  const getCoordinates = (index, value) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / maxScore) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Generate points for polygon
  const polygonPoints = domains
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.score);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible', maxWidth: '100%', height: 'auto' }}
      >
        <defs>
          <radialGradient id="radarAreaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#831843" stopOpacity="0.25" />
          </radialGradient>
        </defs>

        {/* Concentric Grid Polygons */}
        {gridLevels.map((lvl) => {
          const ringPoints = domains
            .map((_, i) => {
              const { x, y } = getCoordinates(i, lvl);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <g key={lvl}>
              <polygon
                points={ringPoints}
                fill={lvl === 3 ? '#faf5ff' : 'none'}
                stroke="#e2e8f0"
                strokeWidth={lvl === 3 ? '1.5' : '1'}
                strokeDasharray={lvl === 3 ? 'none' : '3 3'}
              />
              {/* Level label */}
              <text
                x={center + 6}
                y={center - (lvl / maxScore) * radius + 4}
                fontSize="9"
                fill="#94a3b8"
                fontWeight="600"
              >
                {lvl}
              </text>
            </g>
          );
        })}

        {/* Spoke lines from center to outer ring */}
        {domains.map((_, i) => {
          const { x, y } = getCoordinates(i, maxScore);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon Fill */}
        <polygon
          points={polygonPoints}
          fill="url(#radarAreaGrad)"
          stroke="var(--wine-700, #831843)"
          strokeWidth="2.5"
          style={{ transition: 'all 0.5s ease' }}
        />

        {/* Data Points and Domain Labels */}
        {domains.map((d, i) => {
          const { x, y } = getCoordinates(i, d.score);
          const outer = getCoordinates(i, maxScore + 0.65);

          return (
            <g key={d.key}>
              {/* Score circle */}
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="#ffffff"
                stroke="var(--wine-700, #831843)"
                strokeWidth="2.5"
                style={{ transition: 'all 0.5s ease' }}
              />

              {/* Axis Label */}
              <text
                x={outer.x}
                y={outer.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fontWeight="700"
                fill="var(--wine-900, #4c0519)"
              >
                {d.label}
              </text>

              {/* Score Badge text */}
              <text
                x={outer.x}
                y={outer.y + 13}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#e11d48"
              >
                {d.score.toFixed(1)} / 3
              </text>
            </g>
          );
        })}

        {/* Center zero indicator */}
        <circle cx={center} cy={center} r="3" fill="#cbd5e1" />
      </svg>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          0.0 = Center (No impairment)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#831843', display: 'inline-block' }}></span>
          3.0 = Outer edge (Severe)
        </span>
      </div>
    </div>
  );
}
