import React, { useState } from 'react';
import { Puzzle, Sparkles, Brain, CheckCircle, ArrowLeft } from 'lucide-react';
import MemoryMatchGame from './MemoryMatchGame';
import SequenceRecallGame from './SequenceRecallGame';
import ObjectRecallGame from './ObjectRecallGame';
import PatternRecognitionGame from './PatternRecognitionGame';
import AttentionChallengeGame from './AttentionChallengeGame';
import DailyRecallGame from './DailyRecallGame';
import PictureRecognitionGame from './PictureRecognitionGame';
import SimpleLanguageRecallGame from './SimpleLanguageRecallGame';
import { useApp } from '../../context/AppContext';
import { getGameMetadata } from '../../i18n/gameTranslations';
import SpeakButton from '../common/SpeakButton';

export const ALL_GAMES = [
  {
    id: 'memory-match',
    title: 'Heritage Memory Match',
    subtitle: 'Cultural Visual Memory',
    category: 'Visual Recall',
    icon: '🦏',
    badge: 'North Eastern Heritage',
    desc: 'Match pairs of North Eastern cultural treasures: Rhino, Hornbill, Eri Silk, and Loktak Lake.'
  },
  {
    id: 'sequence-recall',
    title: 'Rhythm Sequence Recall',
    subtitle: 'Sensory Auditory Rhythm',
    category: 'Working Memory',
    icon: '🥁',
    badge: 'Traditional Percussion',
    desc: 'Repeat peaceful light and drum rhythm patterns from Bihu Dhol, Manipuri Pung, and Garo Dama.'
  },
  {
    id: 'object-recall',
    title: 'Everyday Object Recall',
    subtitle: 'Keepsake Association',
    category: 'Memory Retention',
    icon: '🧺',
    badge: 'Familiar Items',
    desc: 'Observe everyday items from our homesteads, then recall which ones were present.'
  },
  {
    id: 'pattern-recognition',
    title: 'Tribal Weave Pattern',
    subtitle: 'Geometric Handloom Weaves',
    category: 'Cognitive Logic',
    icon: '🧵',
    badge: 'Textile Geometry',
    desc: 'Complete traditional weave border sequences inspired by Phanek, Puan, and Gamosa patterns.'
  },
  {
    id: 'attention-challenge',
    title: 'Nature Attention Challenge',
    subtitle: 'Gentle Visual Focus',
    category: 'Visual Attention',
    icon: '🌸',
    badge: 'Forest Harmony',
    desc: 'Find the unique bird or wild orchid in a tranquil, timer-free natural setting.'
  },
  {
    id: 'daily-recall',
    title: 'Daily Life Recall',
    subtitle: 'Temporal Orientation',
    category: 'Routine Orientation',
    icon: '☀️',
    badge: 'Daily Rhythms',
    desc: 'Gentle orientation reflections regarding morning Assam tea, seasons, and loved ones.'
  },
  {
    id: 'picture-recognition',
    title: 'Heritage Picture Recognition',
    subtitle: '8 States Sanctuaries',
    category: 'Spatial Knowledge',
    icon: '🏔️',
    badge: '8 Sister States',
    desc: 'Identify celebrated landmarks: Kaziranga, Majuli, Living Root Bridges, and Ujjayanta Palace.'
  },
  {
    id: 'language-recall',
    title: 'Regional Language Recall',
    subtitle: 'Mother Tongue Connection',
    category: 'Linguistic Recall',
    icon: '🗣️',
    badge: '10 Regional Tongues',
    desc: 'Connect heartwarming greetings and expressions across Assamese, Meitei, Khasi, Mizo, and Bengali.'
  }
];

export default function GamesHub({ initialGameId, onBackToHub }) {
  const { t, gameSessions, language } = useApp();
  const [selectedGameId, setSelectedGameId] = useState(initialGameId || null);

  const handleNextActivity = (currentId) => {
    const currentIndex = ALL_GAMES.findIndex(g => g.id === currentId);
    const nextIndex = (currentIndex + 1) % ALL_GAMES.length;
    setSelectedGameId(ALL_GAMES[nextIndex].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If a specific game is active
  if (selectedGameId) {
    return (
      <div>
        <button
          onClick={() => {
            setSelectedGameId(null);
            if (onBackToHub) onBackToHub();
          }}
          className="mira-btn-secondary"
          style={{
            marginBottom: '1.25rem',
            padding: '0.5rem 1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}
        >
          <ArrowLeft size={18} /> {t.games?.backToHub || 'Back to Games Hub'}
        </button>

        {selectedGameId === 'memory-match' && (
          <MemoryMatchGame onNextActivity={() => handleNextActivity('memory-match')} />
        )}
        {selectedGameId === 'sequence-recall' && (
          <SequenceRecallGame onNextActivity={() => handleNextActivity('sequence-recall')} />
        )}
        {selectedGameId === 'object-recall' && (
          <ObjectRecallGame onNextActivity={() => handleNextActivity('object-recall')} />
        )}
        {selectedGameId === 'pattern-recognition' && (
          <PatternRecognitionGame onNextActivity={() => handleNextActivity('pattern-recognition')} />
        )}
        {selectedGameId === 'attention-challenge' && (
          <AttentionChallengeGame onNextActivity={() => handleNextActivity('attention-challenge')} />
        )}
        {selectedGameId === 'daily-recall' && (
          <DailyRecallGame onNextActivity={() => handleNextActivity('daily-recall')} />
        )}
        {selectedGameId === 'picture-recognition' && (
          <PictureRecognitionGame onNextActivity={() => handleNextActivity('picture-recognition')} />
        )}
        {selectedGameId === 'language-recall' && (
          <SimpleLanguageRecallGame onNextActivity={() => handleNextActivity('language-recall')} />
        )}
      </div>
    );
  }

  const hubTitle = t.games?.title || 'Personalized Cognitive Activities';
  const hubSubtitle = t.games?.subtitle || 'Gentle, culturally rooted activities for memory, focus, and joy. No rush or clinical stress.';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
            <Brain size={18} />
            <span>8 Culturally Tailored Activities • Adaptive Pacing</span>
          </div>
          <SpeakButton
            text={`${hubTitle}. ${hubSubtitle}`}
            lang={language}
            variant="pill"
            label="🔊 Read Overview"
          />
        </div>
        <h1 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontSize: '2rem' }}>
          {hubTitle}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0, maxWidth: '700px' }}>
          {hubSubtitle}
        </p>
      </div>

      {/* AI Adaptive Engine Info Banner */}
      <div
        className="mira-card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ fontSize: '2rem' }}>🤖✨</div>
        <div style={{ flex: 1 }}>
          <strong style={{ display: 'block', color: '#166534', fontSize: '1rem', marginBottom: '0.2rem' }}>
            {t.games?.aiAdaptivePacing || 'AI Adaptive Pacing Active'}
          </strong>
          <span style={{ fontSize: '0.9rem', color: '#15803d' }}>
            {t.games?.aiAdaptivePacingDesc || 'Activities dynamically adapt between Gentle (Easy), Comfortable (Medium), and Engaging (Hard) based on your natural focus.'}
          </span>
        </div>
      </div>

      {/* Grid of 8 Games */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {ALL_GAMES.map((game, index) => {
          const meta = getGameMetadata(game.id, language) || {};
          const gameTitle = meta.title || t.games?.[`game${index + 1}Title`] || game.title;
          const gameDesc = meta.desc || t.games?.[`game${index + 1}Desc`] || game.desc;
          const gameBadge = meta.badge || game.badge;
          const gameCategory = meta.category || game.category;

          return (
            <div
              key={game.id}
              className="mira-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                borderRadius: '20px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.75rem' }}>{game.icon}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '12px'
                      }}
                    >
                      {gameBadge}
                    </span>
                    <SpeakButton
                      text={`${gameTitle}. ${gameDesc}`}
                      lang={language}
                      variant="icon"
                      size={16}
                      title={`Listen to ${gameTitle}`}
                    />
                  </div>
                </div>

                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-teal)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t.games?.activityLabel || 'Activity'} {index + 1} • {gameCategory}
                </span>
                <h3 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>
                  {gameTitle}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.45 }}>
                  {gameDesc}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {t.games?.difficultyPill || 'Easy • Medium • Hard'}
                </span>
                <button
                  onClick={() => {
                    setSelectedGameId(game.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mira-btn-primary"
                  style={{
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.9rem',
                    borderRadius: '14px',
                    fontWeight: 600
                  }}
                >
                  {t.games?.playActivity || t.games?.startPlaying || 'Play Activity'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
