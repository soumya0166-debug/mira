import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Bell, 
  Volume2, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';
import AddReminderModal from './AddReminderModal';
import SpeakButton from '../common/SpeakButton';

export default function RoutineSchedule() {
  const { routines, toggleRoutine, addRoutine, mode, t, language, voiceEnabled } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const completedCount = routines.filter((r) => r.completedToday).length;
  const progressPercent = routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0;

  const periods = [
    { id: 'morning', title: t.routine.morning, icon: '🌅' },
    { id: 'afternoon', title: t.routine.afternoon, icon: '☀️' },
    { id: 'evening', title: t.routine.evening, icon: '🌇' },
    { id: 'night', title: t.routine.night, icon: '🌙' }
  ];

  const handlePlayChime = () => {
    audioService.playReminderChime();
  };

  return (
    <div>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.35rem' }}>{t.routine.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
            {t.routine.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <SpeakButton 
            text={`${t.routine.title}. ${t.routine.progressToday}: ${completedCount} of ${routines.length} completed.`} 
            label="Listen to Schedule" 
            variant="senior" 
          />

          <button 
            onClick={handlePlayChime} 
            className="btn-secondary"
            title="Play gentle reminder chime"
          >
            <Volume2 size={18} /> {t.routine.playChime}
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="btn-primary"
          >
            <Plus size={18} /> {t.routine.addReminder}
          </button>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div 
        className="mira-card mira-card-accent" 
        style={{ marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--wine-900)' }}>
            <Calendar size={18} style={{ color: 'var(--wine-700)' }} />
            {t.routine.progressToday}: {completedCount} / {routines.length} completed
          </span>
          <span className="badge badge-wine">
            {progressPercent}%
          </span>
        </div>

        {/* Progress track */}
        <div 
          style={{
            height: '10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--pink-200)',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: 'var(--wine-700)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Routine Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {periods.map((period) => {
          const items = routines.filter((r) => r.period === period.id);
          if (items.length === 0) return null;

          return (
            <section key={period.id}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  marginBottom: '1rem',
                  borderBottom: '1.5px solid var(--ivory-border)',
                  paddingBottom: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{period.icon}</span>
                <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--text-main)' }}>{period.title}</h2>
                <span className="badge badge-wine" style={{ marginLeft: 'auto' }}>
                  {items.filter((i) => i.completedToday).length} / {items.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item) => {
                  const isDone = item.completedToday;

                  return (
                    <article
                      key={item.id}
                      className="mira-card"
                      style={{
                        padding: '1.1rem 1.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        backgroundColor: isDone ? 'var(--sage-bg)' : '#ffffff',
                        borderColor: isDone ? '#bbf7d0' : 'var(--ivory-border)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Left: Icon & Info */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                        <span 
                          style={{
                            fontSize: '1.8rem',
                            backgroundColor: isDone ? '#dcfce7' : 'var(--pink-50)',
                            borderRadius: '12px',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {item.icon}
                        </span>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span 
                              style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: isDone ? 'var(--sage-green)' : 'var(--wine-700)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Clock size={14} /> {item.time}
                            </span>
                            <span className="badge badge-wine" style={{ fontSize: '0.7rem' }}>
                              {item.category}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <h3 
                              style={{
                                fontSize: '1.1rem',
                                margin: 0,
                                color: isDone ? '#166534' : 'var(--wine-900)',
                                textDecoration: isDone ? 'line-through' : 'none'
                              }}
                            >
                              {item.title}
                            </h3>
                            <SpeakButton 
                              text={`${item.title}. Scheduled for ${item.time}. ${item.instructions || ''}`} 
                              variant="icon" 
                            />
                          </div>

                          {item.instructions && (
                            <p style={{ fontSize: '0.88rem', color: isDone ? '#15803d' : 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                              {item.instructions}
                            </p>
                          )}

                          {isDone && item.completedAt && (
                            <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600, display: 'inline-block', marginTop: '0.25rem' }}>
                              ✓ Completed at {item.completedAt}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Tactile Checkoff Toggle */}
                      <button
                        onClick={() => {
                          toggleRoutine(item.id);
                          if (voiceEnabled) {
                            audioService.speak(
                              !isDone 
                                ? `${item.title} completed` 
                                : `${item.title} marked as pending`, 
                              language
                            );
                          }
                        }}
                        className={isDone ? 'btn-secondary' : 'btn-primary'}
                        style={{
                          backgroundColor: isDone ? '#dcfce7' : 'var(--wine-700)',
                          color: isDone ? '#166534' : '#ffffff',
                          borderColor: isDone ? '#86efac' : 'transparent',
                          minWidth: '130px',
                          fontSize: '0.9rem',
                          flexShrink: 0
                        }}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 size={20} />
                            <span>{t.routine.completedBadge}</span>
                          </>
                        ) : (
                          <>
                            <Circle size={20} />
                            <span>{t.routine.markComplete}</span>
                          </>
                        )}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      <AddReminderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={addRoutine} 
      />
    </div>
  );
}
