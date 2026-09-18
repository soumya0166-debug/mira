import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function HomeDashboard({ onNavigateTab, onSelectGame }) {
  const { setActiveTab } = useApp();
  const [isPlayingAnanyaVoice, setIsPlayingAnanyaVoice] = useState(false);
  const [callingFamily, setCallingFamily] = useState(null);

  // Daily routine tasks with interactive check state
  const [dayTasks, setDayTasks] = useState([
    { id: 1, title: 'Morning tea & garden breathing', time: 'Completed at 7:30 AM', done: true },
    { id: 2, title: 'Gentle veranda walk', time: 'Completed at 9:15 AM', done: true },
    { id: 3, title: 'Afternoon story with MIRA', time: 'Coming up at 4:00 PM', done: false }
  ]);

  const toggleTask = (id) => {
    setDayTasks(tasks => tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handlePlayAnanyaVoice = () => {
    setIsPlayingAnanyaVoice(true);
    audioService.speak(
      "Good morning Baba! Hope you had peaceful rest. Don't forget to take your ginger tea on the veranda.",
      'en'
    );
    setTimeout(() => setIsPlayingAnanyaVoice(false), 4500);
  };

  const completedCount = dayTasks.filter(t => t.done).length;

  return (
    <div className="stitch-container">
      {/* 1. Warm Top Greeting Card */}
      <section className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--stitch-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              Good morning, Deben Dadu 🌿
            </h1>
            <p style={{ margin: '0.25rem 0 0', fontSize: '1.05rem', color: 'var(--stitch-on-surface-variant)', fontWeight: 500 }}>
              Tuesday, 18 September · Shillong
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--stitch-surface-container)',
              color: 'var(--stitch-on-surface)',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              flexShrink: 0
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--stitch-turmeric)' }}>
              wb_sunny
            </span>
            <span>22°C</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem', color: 'var(--stitch-secondary)', fontWeight: 600 }}>
            Pleasant & sunny pine morning breeze
          </span>
        </div>

        {/* Audio Note from Family Member */}
        <button
          onClick={handlePlayAnanyaVoice}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-surface-container-low)',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            transition: 'background-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-secondary-fixed)',
                color: 'var(--stitch-on-secondary-fixed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                {isPlayingAnanyaVoice ? 'volume_up' : 'play_arrow'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
                Voice note from Ananya
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--stitch-on-surface-variant)', fontStyle: 'italic', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                “Good morning Baba, hope you had peaceful rest”
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-on-surface-variant)', flexShrink: 0 }}>
            {isPlayingAnanyaVoice ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </section>

      {/* 2. Hero Daily Recommendation */}
      <section className="stitch-card" style={{ position: 'relative', overflow: 'hidden', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--stitch-secondary-container)',
              color: 'var(--stitch-on-secondary-container)',
              fontSize: '0.95rem',
              fontWeight: 700
            }}
          >
            Today's Gentle Activity
          </span>
          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--stitch-secondary)' }}>
            spa
          </span>
        </div>

        {/* Tactile Visual Memory Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '180px',
            borderRadius: '1rem',
            overflow: 'hidden',
            margin: '0.5rem 0 1rem',
            backgroundColor: 'var(--stitch-surface-container)'
          }}
        >
          <img
            src="/assets/tea_cups.png"
            alt="Traditional Assam clay tea cups on woven bamboo mat"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/veranda_tea.png';
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0, 54, 41, 0.85) 0%, rgba(0,0,0,0) 60%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0.85rem'
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Tea Garden Memories of Tezpur
            </span>
          </div>
        </div>

        {/* Activity Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--stitch-on-surface)', margin: 0 }}>
            Remember the Morning Tea Objects
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--stitch-on-surface-variant)', margin: '0.25rem 0 0.75rem' }}>
            A gentle 5-minute memory walk together with MIRA.
          </p>
        </div>

        {/* Soft attribute pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--stitch-surface-container-high)',
              color: 'var(--stitch-on-surface-variant)',
              fontSize: '0.95rem',
              fontWeight: 600
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>timer</span>
            5 minutes
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--stitch-surface-container-high)',
              color: 'var(--stitch-on-surface-variant)',
              fontSize: '0.95rem',
              fontWeight: 600
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>psychology</span>
            Calm pace
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--stitch-surface-container-high)',
              color: 'var(--stitch-on-surface-variant)',
              fontSize: '0.95rem',
              fontWeight: 600
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--stitch-primary)' }}>favorite</span>
            Memory & Joy
          </span>
        </div>

        {/* Primary Action Tactile Terracotta Button */}
        <button
          onClick={() => {
            if (onSelectGame) onSelectGame('heritage-memory-match');
            if (onNavigateTab) onNavigateTab('games');
            else setActiveTab('games');
          }}
          className="stitch-btn-terracotta"
          style={{ width: '100%', height: '62px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>play_circle</span>
          <span style={{ letterSpacing: '0.04em' }}>START ACTIVITY</span>
        </button>
      </section>

      {/* 3. Your Circle & Day Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--stitch-primary)', margin: '0 0.25rem' }}>
          Your Circle & Day
        </h3>

        {/* Card 1: My Memories */}
        <div
          onClick={() => {
            if (onNavigateTab) onNavigateTab('memories');
            else setActiveTab('memories');
          }}
          className="stitch-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '1rem', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src="/assets/granddaughter_pooja.png"
                alt="Pooja memory"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = '/assets/veranda_tea.png'; }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--stitch-tertiary-container)',
                  border: '2px solid #ffffff'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                  My Memories
                </span>
                <span
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--stitch-tertiary-fixed)',
                    color: 'var(--stitch-tertiary)',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  3 new
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: 'var(--stitch-on-surface-variant)' }}>
                Photos from Ananya's visit to Umiam Lake
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--stitch-primary)' }}>
            chevron_right
          </span>
        </div>

        {/* Card 2: Call Family */}
        <div className="stitch-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-primary)' }}>
                perm_phone_msg
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                Call Family
              </span>
            </div>
            <span style={{ fontSize: '0.95rem', color: 'var(--stitch-on-surface-variant)', marginTop: '0.2rem' }}>
              Ananya & Kabir on quick dial
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => {
                setCallingFamily('Voice Call');
                audioService.speak('Calling daughter Ananya in Guwahati...', 'en');
                setTimeout(() => setCallingFamily(null), 3000);
              }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-primary)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 54, 41, 0.25)'
              }}
              title="Call Ananya"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>call</span>
            </button>
            <button
              onClick={() => {
                setCallingFamily('Video Call');
                audioService.speak('Starting video call with Ananya and grandson Kabir...', 'en');
                setTimeout(() => setCallingFamily(null), 3000);
              }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-secondary)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(35, 104, 104, 0.25)'
              }}
              title="Video Call Family"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>videocam</span>
            </button>
          </div>
        </div>

        {callingFamily && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              backgroundColor: '#ecfdf5',
              border: '1px solid #10b981',
              color: '#065f46',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>ring_volume</span>
            <span>Connecting {callingFamily} with Ananya...</span>
          </div>
        )}

        {/* Card 3: My Day Schedule */}
        <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-primary)' }}>
                calendar_today
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                My Day
              </span>
            </div>
            <span style={{ fontSize: '0.95rem', color: 'var(--stitch-secondary)', fontWeight: 600 }}>
              {completedCount} of {dayTasks.length} completed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {dayTasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: task.done ? 'var(--stitch-surface-container-low)' : 'var(--stitch-surface)',
                  border: '1px solid rgba(226, 220, 208, 0.6)',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: task.done ? 'var(--stitch-primary)' : 'transparent',
                    border: task.done ? 'none' : '2px solid var(--stitch-outline-variant)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {task.done ? (
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--stitch-outline)' }}>schedule</span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--stitch-on-surface)',
                      textDecoration: task.done ? 'line-through' : 'none',
                      opacity: task.done ? 0.8 : 1
                    }}
                  >
                    {task.title}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--stitch-on-surface-variant)' }}>
                    {task.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Talk to MIRA anytime */}
        <div
          onClick={() => {
            if (onNavigateTab) onNavigateTab('mira');
            else setActiveTab('mira');
          }}
          className="stitch-card"
          style={{
            backgroundColor: 'var(--stitch-surface-container-low)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-primary-fixed)',
                color: 'var(--stitch-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>graphic_eq</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
                Talk to MIRA anytime
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--stitch-on-surface-variant)' }}>
                Assamese · Khasi · English
              </span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '1rem', color: 'var(--stitch-on-surface-variant)', lineHeight: 1.4 }}>
            Ask me about family memories, hear old folk songs, or just have a quiet chat.
          </p>

          <button
            className="stitch-btn-forest"
            style={{ width: '100%', height: '54px', marginTop: '0.25rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>mic</span>
            <span>Tap to Speak</span>
          </button>
        </div>
      </section>
    </div>
  );
}
