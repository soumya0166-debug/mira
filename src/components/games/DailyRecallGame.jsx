import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Calendar, Sun, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';

const ORIENTATION_QUESTIONS = [
  {
    id: 'tea',
    question: 'What comforting warm beverage is cherished in the morning across Assam and the hills?',
    options: ['Fresh Assam Milk Tea with Cardamom', 'Iced Lemon Soda', 'Cold Apple Juice', 'Chilled Rose Milk'],
    correct: 0,
    hint: 'Grown along the Brahmaputra valley.'
  },
  {
    id: 'season',
    question: 'When the spring breeze arrives in North East India, which vibrant harvest festival is celebrated?',
    options: ['Bihu and Spring Festivals', 'Winter Snow Carnival', 'Autumn Leaves Gathering', 'Midsummer Sun Feast'],
    correct: 0,
    hint: 'Celebrated with dhol and pepa.'
  },
  {
    id: 'evening',
    question: 'What is a gentle, calming evening routine after sunset?',
    options: ['Lighting a brass lamp and gentle prayer', 'Running a fast marathon', 'Drinking three cups of strong black espresso', 'Chopping heavy firewood'],
    correct: 0,
    hint: 'Bringing peaceful warmth to the household.'
  },
  {
    id: 'care',
    question: 'When should morning medicine typically be taken?',
    options: ['After a warm nutritious breakfast with water', 'Right in the middle of deep sleep', 'Never with water', 'Only while jogging outdoors'],
    correct: 0,
    hint: 'With gentle morning nourishment.'
  }
];

export default function DailyRecallGame({ onNextActivity }) {
  const { t, activeUserId } = useApp();
  const [difficulty, setDifficulty] = useState('easy');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

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
  }, []);

  const currentQ = ORIENTATION_QUESTIONS[currentIdx];

  const handleSelect = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      setScore(s => s + 25);
    }

    setTimeout(() => {
      if (currentIdx + 1 < ORIENTATION_QUESTIONS.length) {
        setCurrentIdx(idx => idx + 1);
        setSelectedAnswer(null);
      } else {
        finishGame(isCorrect ? score + 25 : score);
      }
    }, 1200);
  };

  const finishGame = async (finalScore) => {
    setIsCompleted(true);
    const durationSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const accuracy = Math.round((finalScore / 100) * 100);

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'daily-recall',
      gameType: 'daily-recall',
      difficulty,
      score: finalScore,
      accuracy,
      durationSeconds,
      moves: ORIENTATION_QUESTIONS.length
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
              Game 6 of 8 • Temporal Orientation & Daily Rhythms
            </span>
            <h2 style={{ margin: '0.25rem 0 0.5rem', color: 'var(--text-main)' }}>
              {t.games?.game6Title || 'Daily Life Recall'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
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
          <span>Question <strong>{currentIdx + 1}</strong> of {ORIENTATION_QUESTIONS.length}</span>
          <span>Score: <strong>{score}</strong></span>
        </div>
      </div>

      {!isCompleted && currentQ && (
        <div className="mira-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary-teal)' }}>
            <Sun size={24} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              {currentQ.question}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectOpt = idx === currentQ.correct;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedAnswer !== null}
                  style={{
                    padding: '1.1rem 1.25rem',
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
                    textAlign: 'left',
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    cursor: selectedAnswer === null ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-teal)',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☀️🫖✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem' }}>Splendid Orientation & Memory!</h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You reflected on comforting daily rituals and routines with clarity.
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
