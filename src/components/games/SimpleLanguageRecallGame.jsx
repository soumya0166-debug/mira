import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Languages, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';

const LANGUAGE_PAIRS = [
  {
    language: 'Assamese (অসমীয়া)',
    nativeWord: 'নমস্কাৰ (Namaskar)',
    meaning: 'Respectful Greeting',
    options: ['Respectful Greeting', 'Cold Mountain Breeze', 'Evening Dinner', 'Morning Walk'],
    correct: 'Respectful Greeting'
  },
  {
    language: 'Meitei / Manipuri (মৈতৈলোন্)',
    nativeWord: 'খুরুমজরি (Khurumjari)',
    meaning: 'Humble Salutations & Warm Welcome',
    options: ['Humble Salutations & Warm Welcome', 'Red Silk Ribbon', 'Bamboo Flute', 'Sweet Rice Cake'],
    correct: 'Humble Salutations & Warm Welcome'
  },
  {
    language: 'Khasi (Ka Ktien Khasi)',
    nativeWord: 'Khublei Shibun',
    meaning: 'Blessings & Many Thanks',
    options: ['Blessings & Many Thanks', 'Thunderstorm in Hills', 'Hot Black Tea', 'Fast Running Stream'],
    correct: 'Blessings & Many Thanks'
  },
  {
    language: 'Mizo (Mizo ṭawng)',
    nativeWord: 'Chibai',
    meaning: 'Peaceful Hello & Good Wishes',
    options: ['Peaceful Hello & Good Wishes', 'Heavy Rain Shower', 'Wooden Loom', 'Wild Orchid'],
    correct: 'Peaceful Hello & Good Wishes'
  },
  {
    language: 'Bengali (বাংলা)',
    nativeWord: 'সুপ্রভাত (Suprobhat)',
    meaning: 'Good Morning & Peaceful Dawn',
    options: ['Good Morning & Peaceful Dawn', 'Midnight Stars', 'Heavy Brass Pot', 'Winter Blanket'],
    correct: 'Good Morning & Peaceful Dawn'
  }
];

export default function SimpleLanguageRecallGame({ onNextActivity }) {
  const { t, activeUserId } = useApp();
  const [difficulty, setDifficulty] = useState('easy');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const getPairCount = (diff = difficulty) => {
    if (diff === 'easy') return 3;
    if (diff === 'medium') return 4;
    return 5;
  };

  const startNewGame = (diff = difficulty) => {
    setDifficulty(diff);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsCompleted(false);
    setAdaptiveInfo(null);
    setStartTime(Date.now());
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, []);

  const totalPairs = getPairCount(difficulty);
  const currentPair = LANGUAGE_PAIRS[currentIdx];

  const handleSelect = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    const isCorrect = option === currentPair.correct;
    if (isCorrect) {
      setScore(s => s + Math.round(100 / totalPairs));
    }

    setTimeout(() => {
      if (currentIdx + 1 < totalPairs) {
        setCurrentIdx(idx => idx + 1);
        setSelectedOption(null);
      } else {
        finishGame(isCorrect ? score + Math.round(100 / totalPairs) : score);
      }
    }, 1200);
  };

  const finishGame = async (finalScore) => {
    setIsCompleted(true);
    const durationSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const accuracy = Math.min(100, finalScore);

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'language-recall',
      gameType: 'language-recall',
      difficulty,
      score: accuracy,
      accuracy,
      durationSeconds,
      moves: totalPairs
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
              Game 8 of 8 • Multilingual & Cultural Recall
            </span>
            <h2 style={{ margin: '0.25rem 0 0.5rem', color: 'var(--text-main)' }}>
              {t.games?.game8Title || 'Regional Language Word Recall'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
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

      {!isCompleted && currentPair && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.35rem 0.9rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700 }}>
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
              margin: '0 auto 1.75rem'
            }}
          >
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-teal)', display: 'block' }}>
              {currentPair.nativeWord}
            </span>
          </div>

          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            What does this warm expression mean?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {currentPair.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentPair.correct;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  disabled={selectedOption !== null}
                  style={{
                    padding: '1.1rem',
                    borderRadius: '16px',
                    border: isSelected
                      ? isCorrectOpt
                        ? '3px solid #16a34a'
                        : '3px solid #dc2626'
                      : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected
                      ? isCorrectOpt
                        ? '#dcfce7'
                        : '#fee2e2'
                      : 'var(--card-bg)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--text-main)',
                    cursor: selectedOption === null ? 'pointer' : 'default',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗣️💬✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem' }}>Splendid Linguistic Connection!</h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1rem' }}>
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
