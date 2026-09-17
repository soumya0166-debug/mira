import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, MapPin, CheckCircle2, ArrowRight, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { getGameContent } from '../../i18n/gameTranslations';
import audioService from '../../services/audioService';
import SpeakButton from '../common/SpeakButton';

export default function PictureRecognitionGame({ onNextActivity }) {
  const { t, activeUserId, language, voiceEnabled } = useApp();
  const [difficulty, setDifficulty] = useState('easy');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);

  // Dynamic landmarks according to selected regional language
  const landmarks = getGameContent('picture-recognition', language) || [];

  const getQuestionCount = (diff = difficulty) => {
    if (diff === 'easy') return Math.min(3, landmarks.length);
    if (diff === 'medium') return Math.min(4, landmarks.length);
    return landmarks.length;
  };

  const startNewGame = (diff = difficulty) => {
    setDifficulty(diff);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setErrors(0);
    setIsCompleted(false);
    setAdaptiveInfo(null);
    setStartTime(Date.now());
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, [language]);

  const totalQuestions = getQuestionCount(difficulty);
  const currentLandmark = landmarks[currentIdx] || landmarks[0];

  // Auto-announce clue when landmark changes if voice is enabled
  useEffect(() => {
    if (currentLandmark && voiceEnabled && !isCompleted) {
      const clueText = `${currentLandmark.clue}. Which landmark in ${currentLandmark.state} is this?`;
      const timer = setTimeout(() => {
        audioService.speakText(clueText, language);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, language, isCompleted, voiceEnabled]);

  const handleSelect = (option) => {
    if (selectedOption !== null || !currentLandmark) return;
    setSelectedOption(option);

    const isCorrect = option === currentLandmark.name;
    let nextErrors = errors;
    if (isCorrect) {
      setScore(s => s + Math.round(100 / totalQuestions));
      audioService.playSuccessChime();
      if (voiceEnabled) {
        audioService.speakText(`Correct! It is ${currentLandmark.name}.`, language);
      }
    } else {
      nextErrors = errors + 1;
      setErrors(nextErrors);
      audioService.playSoftClick();
      if (voiceEnabled) {
        audioService.speakText(`Good try! That was ${currentLandmark.name}.`, language);
      }
    }

    setTimeout(() => {
      if (currentIdx + 1 < totalQuestions) {
        setCurrentIdx(idx => idx + 1);
        setSelectedOption(null);
      } else {
        finishGame(isCorrect ? score + Math.round(100 / totalQuestions) : score, nextErrors);
      }
    }, 1400);
  };

  const finishGame = async (finalScore, finalErrors = errors) => {
    setIsCompleted(true);
    const elapsedMs = Date.now() - (startTime || Date.now());
    const durationSeconds = Math.max(1, Math.round(elapsedMs / 1000));
    const responseTimeMs = Math.round(elapsedMs / Math.max(1, totalQuestions));
    const accuracy = Math.max(0, Math.min(100, Math.round(((totalQuestions - finalErrors) / Math.max(1, totalQuestions)) * 100)));

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    if (voiceEnabled) {
      audioService.speakText('Splendid job! You identified our cherished North Eastern landmarks.', language);
    }

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'picture-recognition',
      gameType: 'picture-recognition',
      difficulty,
      score: accuracy,
      accuracy,
      responseTimeMs,
      responseTime: responseTimeMs,
      errors: finalErrors,
      durationSeconds,
      sessionDuration: durationSeconds,
      moves: totalQuestions
    });

    if (result && result.recommendation) {
      setAdaptiveInfo(result.recommendation);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="mira-card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-teal)', fontWeight: 700 }}>
              Game 7 of 8 • Cultural Landmarks & Visual Association
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-main)' }}>
                {t.games?.game7Title || 'Heritage Picture Recognition'}
              </h2>
              <SpeakButton
                text={`${t.games?.game7Title || 'Heritage Picture Recognition'}. ${t.games?.game7Desc || 'Identify celebrated landmarks of our 8 states.'}`}
                lang={language}
                variant="icon"
                size={18}
                title="Hear game instructions"
              />
            </div>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game7Desc || 'Identify cherished places and heritage sanctuaries across our 8 North Eastern states.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Difficulty:</span>
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => startNewGame(d)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '20px',
                  border: difficulty === d ? '2px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                  backgroundColor: difficulty === d ? 'var(--primary-teal)' : 'var(--card-bg)',
                  color: difficulty === d ? '#ffffff' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {d} ({getQuestionCount(d)} places)
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Landmark <strong>{currentIdx + 1}</strong> of {totalQuestions}</span>
          <span>Score: <strong>{score}</strong></span>
        </div>
      </div>

      {/* Landmark Card and Options */}
      {!isCompleted && currentLandmark && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center' }}>
          {/* Landmark Visual Presentation */}
          <div
            style={{
              padding: '2rem 1.5rem',
              borderRadius: '20px',
              backgroundColor: '#f8fafc',
              border: '2px solid var(--primary-teal)',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{currentLandmark.icon}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#e2e8f0', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>
              <MapPin size={16} /> {currentLandmark.state}, North East India
            </div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
              "{currentLandmark.clue}"
            </p>
            <div style={{ marginTop: '1rem' }}>
              <SpeakButton
                text={`${currentLandmark.clue}. In ${currentLandmark.state}, North East India.`}
                lang={language}
                variant="pill"
                label="🔊 Hear Clue"
                title="Hear landmark clue"
              />
            </div>
          </div>

          <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Which famous landmark is described above?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {currentLandmark.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentLandmark.name;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  disabled={selectedOption !== null}
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderRadius: '16px',
                    border: isSelected
                      ? isCorrectOpt
                        ? '3px solid #16a34a'
                        : '3px solid #dc2626'
                      : '1.5px solid var(--border-subtle)',
                    backgroundColor: isSelected
                      ? isCorrectOpt
                        ? '#dcfce7'
                        : '#fee2e2'
                      : 'var(--card-bg)',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: 'var(--text-main)',
                    cursor: selectedOption === null ? 'pointer' : 'default',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ flex: 1 }}>{opt}</span>
                  {/* Option audio button for illiterate elderly users */}
                  <SpeakButton
                    text={opt}
                    lang={language}
                    variant="option"
                    size={18}
                    title={`Hear option ${opt}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion View */}
      {isCompleted && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏔️🏛️✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem', fontSize: '1.4rem' }}>
            Splendid Regional Heritage Knowledge!
          </h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1.05rem' }}>
            You identified the scenic places of North East India with warmth and recognition.
          </p>

          {adaptiveInfo && (
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'left', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Brain size={18} />
                <span>AI Adaptive Recommendation</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>
                {adaptiveInfo.rationale} Next pacing level: <strong>{adaptiveInfo.nextDifficulty}</strong>.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => startNewGame(adaptiveInfo?.nextDifficulty || difficulty)}
              className="mira-btn-primary"
              style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={18} /> Play Again
            </button>
            {onNextActivity && (
              <button
                onClick={onNextActivity}
                className="mira-btn-secondary"
                style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Next Cognitive Activity</span> <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
