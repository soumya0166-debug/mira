import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function GuardianDashboard() {
  const { setActiveTab } = useApp();
  const [showSummaryShared, setShowSummaryShared] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Gentle & Slow (Recommended)');
  const [isRecordingReassurance, setIsRecordingReassurance] = useState(false);

  const weeklyData = [
    { day: 'M', height: 45, note: 'Gentle start' },
    { day: 'T', height: 65, note: '' },
    { day: 'W', height: 95, note: 'Peak Wed', isPeak: true },
    { day: 'T', height: 0, note: 'Rest' },
    { day: 'F', height: 70, note: '' },
    { day: 'S', height: 0, note: '' },
    { day: 'Sun', height: 80, note: 'Today: Active', isToday: true }
  ];

  const handleShareSummary = () => {
    setShowSummaryShared(true);
    audioService.speak("Weekly summary report generated and sent to Dr. Phukan's clinic in Guwahati.", 'en');
    setTimeout(() => setShowSummaryShared(false), 4000);
  };

  const handleRecordReassurance = () => {
    setIsRecordingReassurance(true);
    audioService.speak("Recording reassurance message from Ananya... 'Baba, I will call you at 5pm after work. Have some ginger tea!'", 'en');
    setTimeout(() => setIsRecordingReassurance(false), 4000);
  };

  return (
    <div className="stitch-container">
      {/* 1. Status & Profile Header Banner */}
      <section className="stitch-card" style={{ backgroundColor: 'var(--stitch-surface-container-low)', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--stitch-primary)',
                  flexShrink: 0
                }}
              >
                <img
                  src="/assets/deben_baba.png"
                  alt="Deben Baruah"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--stitch-secondary)' }}>
                  Caregiver Companion
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--stitch-on-surface)', margin: 0 }}>
                  Deben Baruah (Baba)
                </h2>
              </div>
            </div>

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-surface-container)',
                color: 'var(--stitch-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>spa</span>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--stitch-surface-container)',
              alignSelf: 'flex-start',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--stitch-on-surface)'
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-secondary)'
              }}
            />
            <span>Baba was active 25m ago · Shillong Home</span>
          </div>
        </div>
      </section>

      {/* 2. Today's Engagement Highlights */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--stitch-primary)', margin: 0 }}>
            Today's Highlights
          </h2>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--stitch-secondary)' }}>
            Calm & Steady
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Metric 1: Cognitive Activities */}
          <div className="stitch-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '1rem',
                backgroundColor: 'var(--stitch-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>psychology</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--stitch-on-surface-variant)' }}>
                  Cognitive Activities
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--stitch-primary)' }}>
                  2 Done
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--stitch-on-surface)' }}>
                Remember Objects · Afternoon Tea Routine
              </p>
              <div style={{ width: '100%', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--stitch-surface-container-highest)', overflow: 'hidden', marginTop: '0.25rem' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '9999px', backgroundColor: 'var(--stitch-primary)' }} />
              </div>
            </div>
          </div>

          {/* Metric 2: Family Moments */}
          <div className="stitch-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '1rem',
                backgroundColor: 'var(--stitch-tertiary-container)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>favorite</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--stitch-on-surface-variant)' }}>
                  Family Moments
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--stitch-tertiary)' }}>
                  3 Shared
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--stitch-on-surface)' }}>
                Voice note from Ananya · Loved Kaziranga photo
              </p>
              <div style={{ width: '100%', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--stitch-surface-container-highest)', overflow: 'hidden', marginTop: '0.25rem' }}>
                <div style={{ width: '80%', height: '100%', borderRadius: '9999px', backgroundColor: 'var(--stitch-tertiary-container)' }} />
              </div>
            </div>
          </div>

          {/* Metric 3: Routine Adherence */}
          <div className="stitch-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '1rem',
                backgroundColor: 'var(--stitch-secondary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>calendar_today</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--stitch-on-surface-variant)' }}>
                  Routine Adherence
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--stitch-secondary)' }}>
                  85% Complete
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--stitch-on-surface)' }}>
                Breakfast, Morning Veranda Walk · Hydration
              </p>
              <div style={{ width: '100%', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--stitch-surface-container-highest)', overflow: 'hidden', marginTop: '0.25rem' }}>
                <div style={{ width: '85%', height: '100%', borderRadius: '9999px', backgroundColor: 'var(--stitch-secondary)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Weekly Vitality & Rhythm Chart */}
      <section className="stitch-card" style={{ backgroundColor: 'var(--stitch-surface-container-low)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--stitch-primary)', margin: 0 }}>
              Weekly Vitality
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: 'var(--stitch-on-surface-variant)' }}>
              Gentle rhythm of daily connection
            </p>
          </div>
          <span
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--stitch-surface-container)',
              color: 'var(--stitch-primary)',
              fontSize: '0.9rem',
              fontWeight: 700
            }}
          >
            7 Days
          </span>
        </div>

        {/* 7-Day Bar Chart */}
        <div style={{ width: '100%', paddingTop: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', alignItems: 'flex-end', height: '150px', padding: '0 4px' }}>
            {weeklyData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '38px',
                    height: `${item.height}%`,
                    backgroundColor: item.height > 0 ? (item.isPeak ? 'var(--stitch-primary-container)' : 'var(--stitch-primary)') : 'var(--stitch-surface-container-highest)',
                    borderRadius: '8px',
                    transition: 'height 0.3s ease'
                  }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.isToday ? 'var(--stitch-primary)' : 'var(--stitch-on-surface-variant)' }}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 4px 0', fontSize: '0.8rem', color: 'var(--stitch-on-surface-variant)' }}>
            <span>Gentle start</span>
            <span style={{ color: 'var(--stitch-primary)', fontWeight: 700 }}>Peak Wed</span>
            <span style={{ color: 'var(--stitch-secondary)', fontWeight: 700 }}>Today: Active</span>
          </div>
        </div>

        {/* Observation Note */}
        <div
          style={{
            backgroundColor: 'var(--stitch-surface-container-lowest)',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            border: '1px solid rgba(226, 220, 208, 0.7)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--stitch-primary)', flexShrink: 0, marginTop: '2px' }}>
            psychology
          </span>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--stitch-on-surface)', lineHeight: 1.45 }}>
            Baba showed strong recognition during family photograph memory games today. Responded with deep joy and smile to Ananya's tea recording.
          </p>
        </div>

        {/* Memory Anchor Photo */}
        <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '1rem', overflow: 'hidden' }}>
          <img
            src="/assets/veranda_house.png"
            alt="Assam Tea Garden Veranda"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = '/assets/veranda_tea.png'; }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(21, 29, 25, 0.85) 0%, transparent 70%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0.75rem'
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 600 }}>
              Memory Anchor: Assam Tea Garden Veranda · Recognized instantly
            </span>
          </div>
        </div>

        {/* Informational engagement disclaimer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--stitch-on-surface-variant)', fontSize: '0.85rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span>
          <span>Informational engagement indicator — not a clinical medical diagnosis. MIRA supports everyday well-being.</span>
        </div>
      </section>

      {/* 4. Calm Reminders Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--stitch-primary)', margin: 0 }}>
            Calm Reminders
          </h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--stitch-secondary)', fontWeight: 600 }}>
            3 Pending
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Reminder 1: Evening Check-In */}
          <div className="stitch-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-secondary)', marginTop: '2px' }}>
              call
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                  Evening Check-In
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
                  5:00 PM
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: 'var(--stitch-on-surface-variant)' }}>
                Ananya's scheduled evening video check-in with Baba.
              </p>
            </div>
          </div>

          {/* Reminder 2: Hydration & Rest */}
          <div className="stitch-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-tertiary)', marginTop: '2px' }}>
              water_drop
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                  Hydration & Rest
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--stitch-tertiary)' }}>
                  Gentle
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: 'var(--stitch-on-surface-variant)' }}>
                Afternoon warm water and 20-minute veranda rest reminder pending.
              </p>
            </div>
          </div>

          {/* Reminder 3: Upcoming Milestone */}
          <div className="stitch-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-primary)', marginTop: '2px' }}>
              cake
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                  Upcoming Milestone
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
                  In 3 Days
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: 'var(--stitch-on-surface-variant)' }}>
                Grandson Kabir's birthday in 3 days. Ready to record a sweet blessing voice note?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Caregiver Actions Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--stitch-primary)', margin: '0 0.25rem' }}>
          Caregiver Actions
        </h3>

        {/* Action 1: Add New Memory or Voice Note */}
        <button
          onClick={() => {
            setActiveTab('memories');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="stitch-btn-terracotta"
          style={{ width: '100%', height: '56px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>add_circle</span>
          <span>Add New Memory or Voice Note</span>
        </button>

        {/* Action 2: Customize Cognitive Difficulty */}
        <button
          onClick={() => setShowDifficultyModal(true)}
          style={{
            height: '52px',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-surface-container)',
            color: 'var(--stitch-on-surface)',
            border: '1px solid rgba(226, 220, 208, 0.8)',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--stitch-secondary)' }}>
            tune
          </span>
          <span>Customize Cognitive Difficulty</span>
        </button>

        {/* Action 3: Share Weekly Summary with Dr. Phukan */}
        <button
          onClick={handleShareSummary}
          style={{
            height: '52px',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-surface-container)',
            color: 'var(--stitch-on-surface)',
            border: '1px solid rgba(226, 220, 208, 0.8)',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--stitch-primary)' }}>
            share
          </span>
          <span>Share Weekly Summary with Dr. Phukan</span>
        </button>

        {showSummaryShared && (
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
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
            <span>Weekly vitality report successfully shared with Dr. Phukan.</span>
          </div>
        )}

        {/* Action 4: Voice Companion Ready Reassurance Card */}
        <div
          className="stitch-card"
          style={{
            backgroundColor: 'var(--stitch-surface-container-low)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>support_agent</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
                Voice Companion Ready
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--stitch-on-surface-variant)' }}>
                Tap to speak or record reassurance
              </span>
            </div>
          </div>

          <button
            onClick={handleRecordReassurance}
            className="stitch-btn-forest"
            style={{ minHeight: '44px', padding: '0 1.25rem', borderRadius: '9999px', fontSize: '0.95rem' }}
          >
            <span>{isRecordingReassurance ? 'Recording...' : 'Speak'}</span>
          </button>
        </div>
      </section>

      {/* Cognitive Difficulty Modal */}
      {showDifficultyModal && (
        <div
          onClick={() => setShowDifficultyModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              maxWidth: '440px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--stitch-primary)' }}>
                Customize Cognitive Difficulty
              </h3>
              <button
                onClick={() => setShowDifficultyModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--stitch-outline)' }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--stitch-on-surface-variant)' }}>
              Tune question complexity and timer constraints to suit Baba's comfort level today.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                'Gentle & Slow (Recommended)',
                'Standard Daily Pace',
                'Engaging Challenge (Extra Questions)'
              ].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedDifficulty(tier)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '1rem',
                    textAlign: 'left',
                    backgroundColor: selectedDifficulty === tier ? 'var(--stitch-surface-container)' : 'transparent',
                    border: selectedDifficulty === tier ? '2px solid var(--stitch-primary)' : '1px solid rgba(226, 220, 208, 0.7)',
                    color: 'var(--stitch-on-surface)',
                    fontWeight: selectedDifficulty === tier ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {tier}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowDifficultyModal(false);
                audioService.speak(`Difficulty adjusted to ${selectedDifficulty}`, 'en');
              }}
              className="stitch-btn-forest"
              style={{ width: '100%', height: '50px', borderRadius: '1rem', marginTop: '0.5rem' }}
            >
              Save Preference
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
