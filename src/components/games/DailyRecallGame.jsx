import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Calendar, Sun, ArrowRight, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { getGameContent } from '../../i18n/gameTranslations';
import audioService from '../../services/audioService';
import SpeakButton from '../common/SpeakButton';

export default function DailyRecallGame({ onNextActivity }) {
  const { t, activeUserId, language, voiceEnabled } = useApp();
  const [difficulty, setDifficulty] = useState('easy');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Dynamic questions according to active regional language
  const questions = getGameContent('daily-recall', language) || [];

  const startNewGame = (diff = difficulty) => {
    setDifficulty(diff);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsCompleted(false);
    setAdaptiveInfo(null);
    setStartTime(Date.now());
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, [language]);

  const currentQ = questions[currentIdx] || questions[0];

  // Auto-announce question when it changes if voice is enabled
  useEffect(() => {
    if (currentQ && voiceEnabled && !isCompleted) {
      const qText = `${currentQ.question}. ${currentQ.hint ? currentQ.hint : ''}`;
      const timer = setTimeout(() => {
        audioService.speakText(qText, language);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, language, isCompleted, voiceEnabled]);

  const handleSelect = (index) => {
    if (selectedAnswer !== null || !currentQ) return;
    setSelectedAnswer(index);

    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      setScore(s => s + 25);
      audioService.playSuccessChime();
      if (voiceEnabled) {
        audioService.speakText('Wonderful! That is correct.', language);
      }
    } else {
      audioService.playSoftClick();
      if (voiceEnabled) {
        audioService.speakText('Good try! Let us move to the next question.', language);
      }
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(idx => idx + 1);
        setSelectedAnswer(null);
      } else {
        finishGame(isCorrect ? score + 25 : score);
      }
    }, 1400);
  };

  const finishGame = async (finalScore) => {
    setIsCompleted(true);
    const durationSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const accuracy = Math.round((finalScore / 100) * 100);

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    if (voiceEnabled) {
      audioService.speakText('Splendid job! You completed all daily orientation questions.', language);
    }

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'daily-recall',
      gameType: 'daily-recall',
      difficulty,
      score: finalScore,
      accuracy,
      durationSeconds,
      moves: questions.length
    });

    if (result && result.recommendation) {
      setAdaptiveInfo(result.recommendation);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Top Header */}
      <div className="mira-card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-teal)', fontWeight: 700 }}>
              Game 6 of 8 • Temporal Orientation & Daily Rhythms
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-main)' }}>
                {t.games?.game6Title || 'Daily Life Recall'}
              </h2>
              <SpeakButton
                text={`${t.games?.game6Title || 'Daily Life Recall'}. ${t.games?.game6Desc || 'Gentle orientation reflections.'}`}
                lang={language}
                variant="icon"
                size={18}
                title="Hear game instructions"
              />
            </div>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game6Desc || 'Gentle orientation and everyday memory questions for peace and clarity.'}
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
                {d}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Question <strong>{currentIdx + 1}</strong> of {questions.length}</span>
          <span>Score: <strong>{score}</strong></span>
        </div>
      </div>

      {/* Question and Multiple Choice Options */}
      {!isCompleted && currentQ && (
        <div className="mira-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--primary-teal)', flex: 1 }}>
              <Sun size={26} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {currentQ.question}
                </h3>
                {currentQ.hint && (
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    💡 {currentQ.hint}
                  </p>
                )}
              </div>
            </div>
            <SpeakButton
              text={`${currentQ.question}. ${currentQ.hint || ''}`}
              lang={language}
              variant="pill"
              label="🔊 Listen"
              title="Hear question aloud"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.5rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectOpt = idx === currentQ.correct;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedAnswer !== null}
                  style={{
                    padding: '1rem 1.25rem',
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
                    textAlign: 'left',
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    cursor: selectedAnswer === null ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    transition: 'border 0.2s ease, background 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        minWidth: '34px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-teal)',
                        color: '#ffffff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ fontSize: '1.05rem' }}>{opt}</span>
                  </div>

                  {/* Audio Speak button for illiterate senior to hear this specific option */}
                  <SpeakButton
                    text={opt}
                    lang={language}
                    variant="option"
                    size={18}
                    title={`Hear option ${String.fromCharCode(65 + idx)}`}
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
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☀️🫖✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem', fontSize: '1.4rem' }}>
            Splendid Orientation & Memory!
          </h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1.05rem' }}>
            You reflected on comforting daily rituals and routines with clarity and peace.
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
