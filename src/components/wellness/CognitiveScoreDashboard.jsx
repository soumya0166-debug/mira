import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  CalendarCheck, 
  Puzzle, 
  Heart, 
  TrendingUp, 
  Info,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  PlusCircle,
  Calendar,
  History,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Disclaimer from '../common/Disclaimer';
import CognitiveRadarChart from './CognitiveRadarChart';
import CDRAssessmentModal from './CDRAssessmentModal';
import { MANDATORY_DISCLAIMER, getObservedLevel } from '../../services/cdrScoringEngine';

export default function CognitiveScoreDashboard() {
  const { 
    cognitiveScore, 
    t, 
    patient, 
    cdrAssessments, 
    latestCDRAssessment, 
    cdrTrend,
    gameSessions = []
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Active screening data to display (either user-selected from history or latest)
  const activeAssessment = selectedHistoryItem || latestCDRAssessment || {
    memory_score: 0,
    orientation_score: 0,
    judgment_score: 0,
    community_score: 0,
    home_hobbies_score: 0,
    personal_care_score: 0,
    total_score: 0.0,
    observed_level: 'Not yet assessed',
    assessment_date: null
  };

  const levelInfo = getObservedLevel(activeAssessment.total_score);

  // 6 Domain items for table & card layout
  const domainItems = [
    { name: 'Memory', code: 'M', score: activeAssessment.memory_score ?? activeAssessment.memory ?? 0, icon: '🧠', desc: 'Recent recall, appointments & conversations' },
    { name: 'Orientation', code: 'O', score: activeAssessment.orientation_score ?? activeAssessment.orientation ?? 0, icon: '🧭', desc: 'Awareness of time, place & calendar' },
    { name: 'Judgment & Problem Solving', code: 'JPS', score: activeAssessment.judgment_score ?? activeAssessment.judgment_problem_solving ?? 0, icon: '⚖️', desc: 'Decisions, safety & daily reasoning' },
    { name: 'Community Affairs', code: 'CA', score: activeAssessment.community_score ?? activeAssessment.community_affairs ?? 0, icon: '🏘️', desc: 'Shopping, social visits & transport' },
    { name: 'Home & Hobbies', code: 'HH', score: activeAssessment.home_hobbies_score ?? activeAssessment.home_hobbies ?? 0, icon: '🏡', desc: 'Crafts, chores, music & interests' },
    { name: 'Personal Care', code: 'PC', score: activeAssessment.personal_care_score ?? activeAssessment.personal_care ?? 0, icon: '🧼', desc: 'Dressing, hygiene & independent meals' }
  ];

  // 7-Day Trend computed dynamically from real sessions and activities
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[d.getDay()];
    
    // Find real sessions on this date
    const daySessions = (gameSessions || []).filter(s => (s.date === dateStr || (s.completedAt && s.completedAt.startsWith(dateStr))));
    
    let dayScore = 0;
    if (i === 6) {
      // Today
      dayScore = cognitiveScore.hasRealActivity ? cognitiveScore.overall : (daySessions.length > 0 ? Math.round(daySessions.reduce((a, s) => a + Number(s.score || 0), 0) / daySessions.length) : 0);
    } else if (daySessions.length > 0) {
      dayScore = Math.round(daySessions.reduce((a, s) => a + Number(s.score || 0), 0) / daySessions.length);
    }
    
    return {
      day: dayLabel,
      score: Math.max(0, Math.min(100, dayScore)),
      hasData: daySessions.length > 0 || (i === 6 && cognitiveScore.hasRealActivity)
    };
  });

  // SVG dimensions for daily engagement chart (Clamped 0 to 100)
  const width = 540;
  const height = 180;
  const padding = 35;
  const minScore = 0;
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
      {/* Header with New Screening Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
            Cognitive Wellness & Functional Screening
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', margin: 0 }}>
            CDR-inspired multi-domain functional screening, longitudinal change monitoring & daily cognitive stimulation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--wine-700)',
            color: '#ffffff',
            padding: '0.7rem 1.35rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <PlusCircle size={18} /> Record New Screening
        </button>
      </div>

      {/* Mandatory Non-Diagnostic Screening Disclaimer */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '0.85rem',
          padding: '0.85rem 1.15rem',
          marginBottom: '1.5rem',
          fontSize: '0.86rem',
          color: '#92400e',
          lineHeight: 1.45
        }}
      >
        <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
        <div>
          <strong style={{ color: '#78350f' }}>Important Screening Protocol:</strong>{' '}
          {MANDATORY_DISCLAIMER}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: CDR-INSPIRED SCREENING HERO CARD & SUMMARY                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div 
        className="mira-card mira-card-accent" 
        style={{
          marginBottom: '2rem',
          padding: '2rem 1.75rem',
          position: 'relative',
          backgroundColor: '#ffffff',
          border: '1px solid var(--pink-200)',
          borderRadius: '1.25rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span 
            className="badge" 
            style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            CDR-Inspired Cognitive Functional Screening
          </span>

          {activeAssessment.assessment_date && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} /> Evaluated on: {new Date(activeAssessment.assessment_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
              Screening Result (Sum of Boxes)
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--wine-900)', lineHeight: 1 }}>
                {activeAssessment.total_score.toFixed(1)}
              </span>
              <span style={{ fontSize: '1.35rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                / 18
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.05rem', color: 'var(--wine-900)', fontWeight: 600 }}>
                Observed Level:{' '}
              </span>
              <span 
                className="badge"
                style={{
                  backgroundColor: levelInfo.bg,
                  color: levelInfo.color,
                  borderColor: levelInfo.border,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.85rem'
                }}
              >
                {activeAssessment.observed_level} cognitive/functional difficulty
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.45, margin: 0 }}>
              {levelInfo.description}
            </p>
          </div>

          {/* Quick Score Range Guide Bar */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--wine-900)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Research Reference Ranges
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                <span>0.0</span>
                <span>No observed difficulty</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0284c7', fontWeight: activeAssessment.total_score > 0 && activeAssessment.total_score <= 4.0 ? 'bold' : 'normal' }}>
                <span>0.5 – 4.0</span>
                <span>Very mild difficulty</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d97706', fontWeight: activeAssessment.total_score >= 4.5 && activeAssessment.total_score <= 9.0 ? 'bold' : 'normal' }}>
                <span>4.5 – 9.0</span>
                <span>Mild difficulty</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ea580c', fontWeight: activeAssessment.total_score >= 9.5 && activeAssessment.total_score <= 15.5 ? 'bold' : 'normal' }}>
                <span>9.5 – 15.5</span>
                <span>Moderate difficulty</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontWeight: activeAssessment.total_score >= 16.0 ? 'bold' : 'normal' }}>
                <span>16.0 – 18.0</span>
                <span>Severe difficulty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: 6-DOMAIN DASHBOARD REPRESENTATION & RADAR CHART          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left: 6-Domain Score Breakdown */}
        <div className="mira-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--wine-900)', margin: '0 0 0.4rem' }}>
            Domain Assessment Breakdown
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
            Sum of individual scores across the 6 cognitive and functional domains (0 to 3 each).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {domainItems.map((item) => (
              <div 
                key={item.code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.75rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--wine-900)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span 
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: item.score === 0 ? '#16a34a' : item.score <= 1.0 ? '#0284c7' : '#dc2626',
                      backgroundColor: '#ffffff',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid #e2e8f0',
                      display: 'inline-block'
                    }}
                  >
                    {item.score.toFixed(1)} / 3
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summation Footer Table Box */}
          <div 
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '2px dashed var(--pink-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OVERALL SCORE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--wine-900)' }}>
                {activeAssessment.total_score.toFixed(1)} / 18
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OBSERVED LEVEL</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: levelInfo.color }}>
                {activeAssessment.observed_level}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Radar Chart Visualization */}
        <div className="mira-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--wine-900)', margin: '0 0 0.35rem' }}>
              Cognitive Profile (Radar View)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Multi-axial radar map illustrating functional balance and areas for memory support.
            </p>
          </div>

          <CognitiveRadarChart assessment={activeAssessment} size={300} />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: LONGITUDINAL MONITORING & CHANGE TRACKING               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="mira-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <History size={20} color="var(--wine-700)" />
              <h2 style={{ fontSize: '1.25rem', color: 'var(--wine-900)', margin: 0 }}>
                Longitudinal Monitoring & Trends
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Tracking cognitive and functional changes over time across recorded intervals.
            </p>
          </div>

          {/* Trend Status Pill */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#f8fafc',
              border: `1.5px solid ${cdrTrend.color}`,
              color: cdrTrend.color,
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            <TrendingUp size={16} />
            Trend: {cdrTrend.status}
          </div>
        </div>

        {/* Trend Summary Description Box */}
        <div 
          style={{
            backgroundColor: '#f1f5f9',
            padding: '0.85rem 1.15rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            color: '#334155'
          }}
        >
          <strong>Observation Summary:</strong> {cdrTrend.summary}
        </div>

        {/* Month over Month Progression Bar Chart */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--wine-900)', marginBottom: '0.75rem' }}>
            Score Progression Over Recorded Screenings
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(4, cdrAssessments.length)}, 1fr)`, gap: '0.75rem' }}>
            {cdrAssessments.map((item, idx) => {
              const isCurrent = activeAssessment.id === item.id;
              const dateLabel = item.month_label || new Date(item.assessment_date).toLocaleString('default', { month: 'short' });
              return (
                <div 
                  key={item.id || idx}
                  onClick={() => setSelectedHistoryItem(item)}
                  style={{
                    backgroundColor: isCurrent ? '#fff1f2' : '#f8fafc',
                    border: isCurrent ? '2px solid var(--wine-700)' : '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '0.85rem 0.65rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {dateLabel}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--wine-900)' }}>
                    {item.total_score.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {item.observed_level}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historical Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--wine-900)' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--wine-900)' }}>Assessor</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--wine-900)' }}>Scores (M / O / JPS / CA / HH / PC)</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--wine-900)' }}>Sum of Boxes</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--wine-900)' }}>Observed Level</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--wine-900)' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {cdrAssessments.map((item, idx) => {
                const isSelected = activeAssessment.id === item.id;
                return (
                  <tr 
                    key={item.id || idx}
                    onClick={() => setSelectedHistoryItem(item)}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isSelected ? '#fff1f2' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                      {new Date(item.assessment_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                      {item.assessor || 'Caregiver'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {item.memory_score.toFixed(1)} / {item.orientation_score.toFixed(1)} / {item.judgment_score.toFixed(1)} / {item.community_score.toFixed(1)} / {item.home_hobbies_score.toFixed(1)} / {item.personal_care_score.toFixed(1)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--wine-900)' }}>
                      {item.total_score.toFixed(1)} / 18
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span 
                        className="badge" 
                        style={{
                          fontSize: '0.78rem',
                          backgroundColor: '#f1f5f9',
                          color: '#334155'
                        }}
                      >
                        {item.observed_level}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '240px' }}>
                      {item.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 4: DAILY ENGAGEMENT ACTIVITY (Routine & Memory Stimulation) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <h2 style={{ fontSize: '1.25rem', color: 'var(--wine-900)', marginBottom: '1rem' }}>
        Daily Engagement & Activity Index
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

      {/* 7-Day Longitudinal Daily Engagement Trend Chart */}
      <div className="mira-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--wine-900)', fontSize: '1.15rem' }}>
              7-Day Activity & Cognitive Pacing Trend (0–100)
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Calculated dynamically from real completed activities, memory reflections, and game scores.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 700 }}>
              Today: {cognitiveScore.overall} / 100
            </span>
          </div>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', maxHeight: '200px' }}>
            <defs>
              <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--wine-700)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--wine-700)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines for 0, 25, 50, 75, 100 */}
            {[0, 25, 50, 75, 100].map(val => {
              const yVal = height - padding - ((val - minScore) / (maxScore - minScore)) * (height - 2 * padding);
              return (
                <g key={val}>
                  <line x1={padding} y1={yVal} x2={width - padding} y2={yVal} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x={padding - 8} y={yVal + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{val}</text>
                </g>
              );
            })}

            {/* Filled Area */}
            <path d={areaD} fill="url(#scoreAreaGrad)" />

            {/* Trend Line */}
            <path d={pathD} fill="none" stroke="var(--wine-700)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Points & Labels */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r={p.hasData ? 5 : 3} fill={p.hasData ? "var(--wine-700)" : "#94a3b8"} stroke="#ffffff" strokeWidth="2" />
                <text x={p.x} y={height - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-main)">
                  {p.day}
                </text>
                {p.hasData && (
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--wine-900)">
                    {p.score}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Clear Medical Disclaimer Notice */}
        <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#92400e' }}>
          <ShieldCheck size={18} style={{ color: '#d97706', flexShrink: 0 }} />
          <span><strong>MIRA/PCPS is not a medical diagnosis.</strong> Scores represent daily engagement and recreational cognitive stimulation levels.</span>
        </div>
      </div>

      {/* Modal for Recording New Screening */}
      <CDRAssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
