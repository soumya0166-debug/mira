import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Languages, CheckCircle2, ArrowRight, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { getGameContent } from '../../i18n/gameTranslations';
import audioService from '../../services/audioService';
import SpeakButton from '../common/SpeakButton';

export default function SimpleLanguageRecallGame({ onNextActivity }) {
  const { t, activeUserId, language, voiceEnabled } = useApp();
  const [difficulty, setDifficulty] = useState('easy');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);

  // Dynamic language pairs based on active user language
  const languagePairs = getGameContent('language-recall', language) || [];

  const getPairCount = (diff = difficulty) => {
    if (diff === 'easy') return Math.min(3, languagePairs.length);
    if (diff === 'medium') return Math.min(4, languagePairs.length);
    return languagePairs.length;
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

  const totalPairs = getPairCount(difficulty);
  const currentPair = languagePairs[currentIdx] || languagePairs[0];

  // Auto-announce phrase when it changes if voice is enabled
  useEffect(() => {
    if (currentPair && voiceEnabled && !isCompleted) {
      const phraseText = `${currentPair.phrase}. What does this mean?`;
      const timer = setTimeout(() => {
        audioService.speakText(phraseText, language);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, language, isCompleted, voiceEnabled]);

  const handleSelect = (option) => {
    if (selectedOption !== null || !currentPair) return;
    setSelectedOption(option);

    const isCorrect = option === currentPair.correct;
    let nextErrors = errors;
    if (isCorrect) {
      setScore(s => s + Math.round(100 / totalPairs));
      audioService.playSuccessChime();
      if (voiceEnabled) {
        audioService.speakText(`Correct! It means ${currentPair.correct}.`, language);
      }
    } else {
      nextErrors = errors + 1;
      setErrors(nextErrors);
      audioService.playSoftClick();
      if (voiceEnabled) {
        audioService.speakText(`Good try! It means ${currentPair.correct}.`, language);
      }
    }

    setTimeout(() => {
      if (currentIdx + 1 < totalPairs) {
        setCurrentIdx(idx => idx + 1);
        setSelectedOption(null);
      } else {
        finishGame(isCorrect ? score + Math.round(100 / totalPairs) : score, nextErrors);
      }
    }, 1400);
  };

  const finishGame = async (finalScore, finalErrors = errors) => {
    setIsCompleted(true);
    const elapsedMs = Date.now() - (startTime || Date.now());
    const durationSeconds = Math.max(1, Math.round(elapsedMs / 1000));
    const responseTimeMs = Math.round(elapsedMs / Math.max(1, totalPairs));
    const accuracy = Math.max(0, Math.min(100, Math.round(((totalPairs - finalErrors) / Math.max(1, totalPairs)) * 100)));

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    if (voiceEnabled) {
      audioService.speakText('Wonderful linguistic recall! You connected heartwarming North Eastern words.', language);
    }

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'language-recall',
      gameType: 'language-recall',
      difficulty,
      score: accuracy,
      accuracy,
      responseTimeMs,
      responseTime: responseTimeMs,
      errors: finalErrors,
      durationSeconds,
      sessionDuration: durationSeconds,
      moves: totalPairs
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
              Game 8 of 8 • Multilingual & Cultural Recall
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-main)' }}>
                {t.games?.game8Title || 'Regional Language Word Recall'}
              </h2>
              <SpeakButton
                text={`${t.games?.game8Title || 'Regional Language Word Recall'}. ${t.games?.game8Desc || 'Match familiar warm greetings across North Eastern languages.'}`}
                lang={language}
                variant="icon"
                size={18}
                title="Hear game instructions"
              />
            </div>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game8Desc || 'Match familiar warm greetings and cherished phrases from our North Eastern mother tongues.'}
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
                {d} ({getPairCount(d)} phrases)
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Word <strong>{currentIdx + 1}</strong> of {totalPairs}</span>
          <span>Score: <strong>{score}</strong></span>
        </div>
      </div>

      {/* Word and Options Card */}
      {!isCompleted && currentPair && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.35rem 0.9rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700 }}>
              {currentPair.language}
            </span>
          </div>

          <div
            style={{
              padding: '1.5rem',
              borderRadius: '20px',
              backgroundColor: '#f0fdf4',
              border: '2px solid var(--primary-teal)',
              marginBottom: '1.75rem',
              maxWidth: '500px',
              margin: '0 auto 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-teal)' }}>
              {currentPair.nativeWord}
            </span>
            <SpeakButton
              text={currentPair.nativeWord}
              lang={language}
              variant="icon"
              size={22}
              title={`Pronounce ${currentPair.nativeWord}`}
            />
          </div>

          <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            What does this warm expression mean?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {currentPair.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentPair.correct;
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
                  {/* Embedded SpeakButton for non-reading seniors */}
                  <SpeakButton
                    text={opt}
                    lang={language}
                    variant="option"
                    size={18}
                    title={`Hear option: ${opt}`}
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
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗣️💬✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem', fontSize: '1.4rem' }}>
            Splendid Linguistic Connection!
          </h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1.05rem' }}>
            You connected comforting words across North Eastern languages with familiarity and warmth.
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
                <span>Back to Hub</span> <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
