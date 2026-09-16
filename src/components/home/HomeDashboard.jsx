import React from 'react';
import { Play, ArrowRight, Heart, Sparkles, Clock, CheckCircle2, Brain, Mic, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_GAMES } from '../games/GamesHub';

export default function HomeDashboard({ onNavigateTab, onSelectGame }) {
  const { t, patient, memories, routines, gameSessions, preferredLanguage, isOnline, offlineActivitiesCount, pendingCount } = useApp();

  // Gentle greeting based on time of day
  const hour = new Date().getHours();
  let greetingTime = t.home?.greetingMorning || 'Good Morning,';
  if (hour >= 12 && hour < 17) greetingTime = t.home?.greetingAfternoon || 'Good Afternoon,';
  else if (hour >= 17) greetingTime = t.home?.greetingEvening || 'Good Evening,';

  const patientName = patient?.preferredName || 'Radha Dadi';

  // Recommended activity for today
  const recommendedGame = ALL_GAMES[0]; // Heritage Memory Match

  // Today's Routine summary
  const nextRoutine = routines?.find(r => !r.completedToday) || routines?.[0];

  // Today's Cherished Memory spark
  const featuredMemory = memories?.[0];

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* 1. Mandatory Non-Medical Disclaimer Header */}
      <div
        style={{
          padding: '0.65rem 1rem',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderRadius: '14px',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid #fde68a'
        }}
      >
        <ShieldAlert size={18} style={{ flexShrink: 0 }} />
        <span>{t.disclaimerText || 'Non-medical wellness platform for gentle cognitive engagement and memory assistance.'}</span>
      </div>

      {/* Offline-First Readiness Status Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.65rem 1rem',
          borderRadius: '16px',
          backgroundColor: isOnline ? '#f0fdf4' : '#eff6ff',
          border: `1px solid ${isOnline ? '#bbf7d0' : '#bfdbfe'}`,
          color: isOnline ? '#15803d' : '#1d4ed8',
          marginBottom: '1.25rem',
          fontSize: '0.95rem',
          fontWeight: 600
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>{isOnline ? '🟢' : '🔵'}</span>
        <span>
          {isOnline
            ? `Today's cognitive activities are ready • ${offlineActivitiesCount || 18} activities cached & ready offline`
            : `${t.common?.offlineActive || 'Offline mode active'} — ${t.common?.offlineNotice || 'All games, routines & memories work immediately. Progress will sync automatically later.'}`}
        </span>
      </div>

      {/* 2. Warm Elderly Greeting */}
      <div style={{ marginBottom: '1.75rem', textAlign: 'left' }}>
        <h1 style={{ margin: '0 0 0.35rem', color: 'var(--text-main)', fontSize: '2.2rem', fontWeight: 800 }}>
          {greetingTime} {patientName} 🌸
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.15rem' }}>
          {t.home?.greetingSubtitle || 'Today is peaceful and serene. How would you like to spend your morning?'}
        </p>
      </div>

      {/* 3. Today's Recommended Activity Card with "Start Today's Activity" */}
      <div
        className="mira-card"
        style={{
          padding: '1.75rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #0e4a42 0%, #166534 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 8px 24px rgba(14, 74, 66, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '0.3rem 0.8rem',
                borderRadius: '14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              {t.home?.todayRecommendation || "Today's Recommended Activity"}
            </span>
            <h2 style={{ margin: '0.5rem 0 0.35rem', fontSize: '1.75rem', color: '#ffffff' }}>
              {t.games?.game1Title || recommendedGame.title}
            </h2>
            <p style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0', maxWidth: '500px' }}>
              {t.games?.game1Desc || recommendedGame.desc}
            </p>
          </div>
          <span style={{ fontSize: '3.5rem' }}>{recommendedGame.icon}</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (onSelectGame) onSelectGame(recommendedGame.id);
              else if (onNavigateTab) onNavigateTab('games');
            }}
            style={{
              padding: '0.85rem 1.75rem',
              backgroundColor: '#ffffff',
              color: '#0e4a42',
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Play size={20} fill="#0e4a42" /> {t.home?.startTodayActivity || "Start Today's Activity"}
          </button>
          <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            {t.home?.gentlePacing || 'Gentle Pacing • No Rush • Culturally Calming'}
          </span>
        </div>
      </div>

      {/* 4. Quick MIRA Shortcut Button */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('mira')}
        className="mira-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f0fdf4',
          borderColor: '#86efac',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-teal)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}
          >
            🎙️
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--primary-teal)', marginBottom: '0.2rem' }}>
              {t.home?.miraShortcut || 'Talk to MIRA Memory Assistant'}
            </strong>
            <span style={{ fontSize: '0.9rem', color: '#166534' }}>
              {t.home?.miraShortcutDesc || 'Tap here to ask: "What is my routine today?" or "Tell me about my family"'}
            </span>
          </div>
        </div>
        <ArrowRight size={22} style={{ color: 'var(--primary-teal)' }} />
      </div>

      {/* 5. Two-Column Row: Today's Routine + Memory Reminders */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}
      >
        {/* Daily Routine Summary */}
        <div className="mira-card" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)', fontWeight: 700 }}>
              <Clock size={18} />
              <span>{t.home?.routineHydration || t.routine?.title || 'Routine & Hydration'}</span>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('routines')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {t.home?.viewAll || 'View All'}
            </button>
          </div>

          {nextRoutine ? (
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{nextRoutine.title}</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-teal)', fontWeight: 700 }}>{nextRoutine.time}</span>
              </div>
              <p style={{ margin: '0.35rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {nextRoutine.description}
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>{t.routine?.completed || 'All scheduled routines for today are completed!'}</p>
          )}
        </div>

        {/* Memory Reminders Spark */}
        <div className="mira-card" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c2410c', fontWeight: 700 }}>
              <Heart size={18} />
              <span>{t.home?.memorySpark || 'Memory Spark'}</span>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('memories')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {t.home?.openVault || 'Open Vault'}
            </button>
          </div>

          {featuredMemory ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  flexShrink: 0
                }}
              >
                📸
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {featuredMemory.title}
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {featuredMemory.year} • {featuredMemory.category}
                </span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>{t.memory?.emptyDesc || 'Your private memory album is ready.'}</p>
          )}
        </div>
      </div>

      {/* 6. Today's Progress & Recent Activity */}
      <div
        className="mira-card"
        style={{
          padding: '1.5rem',
          borderRadius: '20px',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)', fontWeight: 700 }}>
            <Sparkles size={18} />
            <span>{t.home?.todayProgress || "Today's Engagement & Participation"}</span>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('wellness')}
            style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            {t.home?.viewProgress || 'View Progress'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '16px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-teal)', display: 'block' }}>
              {gameSessions?.length || 3}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>{t.home?.activitiesCompleted || 'Activities Completed'}</span>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '16px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1d4ed8', display: 'block' }}>
              5 {t.progress?.days || 'Days'}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>{t.home?.dailyStreak || 'Daily Streak'}</span>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '16px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', display: 'block' }}>
              94%
            </span>
            <span style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>{t.home?.routineAdherence || 'Routine Adherence'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
