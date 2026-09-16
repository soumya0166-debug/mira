import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';

export default function AttentionChallengeGame({ onNextActivity }) {
  const { t, activeUserId } = useApp();
  const [difficulty, setDifficulty] = useState('easy'); // easy: 6 tiles (2x3), medium: 12 tiles (3x4), hard: 16 tiles (4x4)
  const [grid, setGrid] = useState([]);
  const [targetSymbol, setTargetSymbol] = useState('🪶'); // Great Hornbill feather
  const [distractorSymbol, setDistractorSymbol] = useState('🍃'); // Forest leaves
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const ROUNDS_PER_GAME = 3;

  const getGridSize = (diff = difficulty) => {
    if (diff === 'easy') return 6;
    if (diff === 'medium') return 12;
    return 16;
  };

  const startNewRound = (diff = difficulty, roundNum = 0) => {
    const totalTiles = getGridSize(diff);
    const targetIndex = Math.floor(Math.random() * totalTiles);

    const themePairs = [
      { target: '🦏', distractor: '🐃', targetName: 'Kaziranga One-Horned Rhino', distractorName: 'Wild Buffalo' },
      { target: '🪶', distractor: '🍃', targetName: 'Hornbill Golden Feather', distractorName: 'Forest Leaf' },
      { target: '🌸', distractor: '🌿', targetName: 'Blue Vanda Wild Orchid', distractorName: 'River Grass' }
    ];

    const currentTheme = themePairs[roundNum % themePairs.length];
    setTargetSymbol(currentTheme.target);
    setDistractorSymbol(currentTheme.distractor);

    const newGrid = [];
    for (let i = 0; i < totalTiles; i++) {
      newGrid.push({
        id: i,
        symbol: i === targetIndex ? currentTheme.target : currentTheme.distractor,
        isTarget: i === targetIndex,
        targetName: currentTheme.targetName
      });
    }

    setGrid(newGrid);
  };

  const startNewGame = (diff = difficulty) => {
    setDifficulty(diff);
    setRoundsPlayed(0);
    setScore(0);
    setIsCompleted(false);
    setAdaptiveInfo(null);
    setStartTime(Date.now());
    startNewRound(diff, 0);
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, []);

  const handleTileClick = (tile) => {
    if (tile.isTarget) {
      const nextRounds = roundsPlayed + 1;
      const nextScore = score + 33;
      setScore(nextScore);
      setRoundsPlayed(nextRounds);

      if (nextRounds >= ROUNDS_PER_GAME) {
        finishGame(nextScore);
      } else {
        startNewRound(difficulty, nextRounds);
      }
    }
  };

  const finishGame = async (finalScore) => {
    setIsCompleted(true);
    const durationSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const accuracy = 100;

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'attention-challenge',
      gameType: 'attention-challenge',
      difficulty,
      score: 100,
      accuracy,
      durationSeconds,
      moves: ROUNDS_PER_GAME
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
              Game 5 of 8 • Visual Focus & Attention
            </span>
            <h2 style={{ margin: '0.25rem 0 0.5rem', color: 'var(--text-main)' }}>
              {t.games?.game5Title || 'Nature Attention Challenge'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game5Desc || 'Gently locate the special North Eastern treasure in the peaceful forest setting.'}
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
          <span>Round <strong>{Math.min(roundsPlayed + 1, ROUNDS_PER_GAME)}</strong> of {ROUNDS_PER_GAME}</span>
          <span style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>Find the one: <strong>{targetSymbol}</strong></span>
        </div>
      </div>

      {!isCompleted && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: difficulty === 'easy' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
              gap: '1rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}
          >
            {grid.map(tile => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--card-bg)',
                  fontSize: '2.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'transform 0.15s ease'
                }}
              >
                {tile.symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🦏🌸✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem' }}>Wonderful Visual Focus!</h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You located all North Eastern treasures with sharp, peaceful focus.
          </p>

          {adaptiveInfo && (
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'left', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Brain size={18} />
                <span>AI Adaptive Recommendation</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>
                {adaptiveInfo.rationale} Next suggested level: <strong>{adaptiveInfo.nextDifficulty}</strong>.
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
