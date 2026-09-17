import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Sparkles, CheckCircle2, ArrowRight, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import audioService from '../../services/audioService';
import SpeakButton from '../common/SpeakButton';
import { getGameContent } from '../../i18n/gameTranslations';

export default function PatternRecognitionGame({ onNextActivity }) {
  const { t, activeUserId, language, voiceEnabled } = useApp();
  const [difficulty, setDifficulty] = useState('easy');
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const patterns = getGameContent('pattern-recognition', language) || [];

  const startNewGame = (diff = difficulty) => {
    setDifficulty(diff);
    setCurrentPatternIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setIsCompleted(false);
    setAdaptiveInfo(null);
    setStartTime(Date.now());
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, [language]);

  const currentPattern = patterns[currentPatternIndex] || patterns[0];

  // Auto-announce pattern prompt
  useEffect(() => {
    if (currentPattern && voiceEnabled && !isCompleted) {
      const prompt = `${currentPattern.title}. ${currentPattern.description}. Which symbol completes the pattern?`;
      const timer = setTimeout(() => {
        audioService.speakText(prompt, language);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentPatternIndex, language, isCompleted, voiceEnabled]);

  const handleSelectOption = (option) => {
    if (selectedOption !== null || !currentPattern) return;

    setSelectedOption(option);
    const correct = option === currentPattern.correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 25);
      audioService.playSuccessChime();
      if (voiceEnabled) {
        audioService.speakText('Correct pattern match! Wonderful.', language);
      }
    } else {
      audioService.playSoftClick();
      if (voiceEnabled) {
        audioService.speakText('Good try. Let us see the next pattern.', language);
      }
    }

    setTimeout(() => {
      if (currentPatternIndex + 1 < patterns.length) {
        setCurrentPatternIndex(idx => idx + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        finishGame(correct ? score + 25 : score);
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
      audioService.speakText('Outstanding! You completed all handloom weave patterns.', language);
    }

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'pattern-recognition',
      gameType: 'pattern-recognition',
      difficulty,
      score: finalScore,
      accuracy,
      durationSeconds,
      moves: patterns.length
    });

    if (result && result.recommendation) {
      setAdaptiveInfo(result.recommendation);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="mira-card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-teal)', fontWeight: 700 }}>
              Game 4 of 8 • Logical & Geometric Focus
            </span>
            <h2 style={{ margin: '0.25rem 0 0.5rem', color: 'var(--text-main)' }}>
              {t.games?.game4Title || 'Tribal Weave Pattern Recognition'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game4Desc || 'Complete the traditional handloom weave motifs from North Eastern textiles.'}
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
          <span>Pattern <strong>{currentPatternIndex + 1}</strong> of {patterns.length}</span>
          <span>Score: <strong>{score}</strong></span>
        </div>
      </div>

      {!isCompleted && currentPattern && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.35rem 0.9rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700 }}>
                {currentPattern.state} • {currentPattern.title}
              </span>
              <SpeakButton
                text={`${currentPattern.title}. ${currentPattern.description}. Which symbol naturally completes the weave sequence?`}
                lang={language}
                variant="icon"
                size={18}
                title="Hear pattern description"
              />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
              {currentPattern.description}
            </p>
          </div>

          {/* Weave sequence display */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2rem 0', flexWrap: 'wrap' }}>
            {currentPattern.sequence.map((symbol, idx) => (
              <div
                key={idx}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                {symbol}
              </div>
            ))}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                border: '3px dashed var(--primary-teal)',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.8rem',
                fontWeight: 700,
                color: 'var(--primary-teal)'
              }}
            >
              {selectedOption || '?'}
            </div>
          </div>

          <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Which symbol naturally completes the weave sequence?
          </p>

          {/* Options */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {currentPattern.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isOptionCorrect = opt === currentPattern.correct;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedOption !== null}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '18px',
                    border: isSelected
                      ? isOptionCorrect
                        ? '3px solid #16a34a'
                        : '3px solid #dc2626'
                      : '2px solid var(--border-subtle)',
                    backgroundColor: isSelected
                      ? isOptionCorrect
                        ? '#dcfce7'
                        : '#fee2e2'
                      : 'var(--card-bg)',
                    fontSize: '2.2rem',
                    cursor: selectedOption === null ? 'pointer' : 'default',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isCorrect !== null && (
            <div style={{ marginTop: '1.5rem', fontWeight: 600, color: isCorrect ? '#16a34a' : '#ea580c' }}>
              {isCorrect ? 'Splendid pattern recognition! Next pattern...' : 'Gentle observation. Let us move to the next weave.'}
            </div>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧵✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem' }}>Weave Geometry Mastered!</h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You completed all North Eastern tribal textile patterns with steady attention.
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
