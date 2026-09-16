import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Sparkles, Volume2 } from 'lucide-react';
import audioService from '../../services/audioService';
import { useApp } from '../../context/AppContext';

const PADS = [
  { id: 0, name: 'Rose Petal', color: '#f472b6', activeColor: '#fbcfe8', soundIndex: 0 },
  { id: 1, name: 'Sage Leaf', color: '#4ade80', activeColor: '#bbf7d0', soundIndex: 1 },
  { id: 2, name: 'Morning Sun', color: '#fbbf24', activeColor: '#fef08a', soundIndex: 2 },
  { id: 3, name: 'Wine Blossom', color: '#be123c', activeColor: '#fecdd3', soundIndex: 3 }
];

export default function AttentionPatternGame({ onComplete }) {
  const { recordGameSession, t } = useApp();

  const [sequence, setSequence] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activePad, setActivePad] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, showing, playing, won, tryAgain
  const [highestRound, setHighestRound] = useState(0);

  const startNewGame = () => {
    setScore(0);
    setRound(1);
    setHighestRound(1);
    setGameStatus('showing');
    const firstSeq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    setSequence(firstSeq);
    setPlayerIndex(0);
    playSequence(firstSeq);
  };

  const playSequence = async (seq) => {
    setIsPlayingSequence(true);
    setGameStatus('showing');

    // Wait initial delay
    await new Promise((r) => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      const padIndex = seq[i];
      setActivePad(padIndex);
      audioService.playMelodyNote(padIndex);
      await new Promise((r) => setTimeout(r, 550));
      setActivePad(null);
      await new Promise((r) => setTimeout(r, 250));
    }

    setIsPlayingSequence(false);
    setGameStatus('playing');
    setPlayerIndex(0);
  };

  const handlePadClick = (padIndex) => {
    if (isPlayingSequence || gameStatus !== 'playing') return;

    // Flash pad and play sound
    setActivePad(padIndex);
    audioService.playMelodyNote(padIndex);
    setTimeout(() => setActivePad(null), 300);

    // Check if correct
    if (padIndex === sequence[playerIndex]) {
      const nextIndex = playerIndex + 1;
      setPlayerIndex(nextIndex);

      if (nextIndex === sequence.length) {
        // Round completed successfully!
        audioService.playSuccessChime();
        const nextRound = round + 1;
        setScore((prev) => prev + 10);
        setRound(nextRound);
        setHighestRound((prev) => Math.max(prev, nextRound));

        if (nextRound > 4) {
          // Patient completed 4 consecutive rounds, gentle win celebration
          setGameStatus('won');
          recordGameSession('Attention Pattern', 92, { rounds: nextRound });
          if (onComplete) onComplete();
        } else {
          // Add next random step
          const newSeq = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(newSeq);
          setTimeout(() => playSequence(newSeq), 1000);
        }
      }
    } else {
      // Gentle, non-punitive retry
      audioService.playSoftClick();
      setGameStatus('tryAgain');
    }
  };

  const replayCurrentSequence = () => {
    setGameStatus('showing');
    playSequence(sequence);
  };

  return (
    <div className="mira-card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.25rem', color: 'var(--wine-900)' }}>
        {t.games.attentionTitle}
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        {t.games.attentionDesc}
      </p>

      {/* Instructions / Status indicator */}
      <div 
        style={{
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: gameStatus === 'showing' ? 'var(--wine-50)' : gameStatus === 'playing' ? 'var(--pink-50)' : 'var(--ivory-soft)',
          color: 'var(--wine-800)',
          fontWeight: 600,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        {gameStatus === 'idle' && <span>Press "Start Game" to begin listening to the melody.</span>}
        {gameStatus === 'showing' && (
          <>
            <Volume2 size={18} className="animate-pulse" />
            <span>{t.games.listenCarefully}</span>
          </>
        )}
        {gameStatus === 'playing' && (
          <>
            <Sparkles size={18} style={{ color: 'var(--wine-700)' }} />
            <span>{t.games.yourTurn} ({playerIndex} of {sequence.length})</span>
          </>
        )}
        {gameStatus === 'tryAgain' && (
          <span style={{ color: '#b45309' }}>
            {t.games.tryAgain}
          </span>
        )}
        {gameStatus === 'won' && <span>{t.games.wellDone}</span>}
      </div>

      {/* Chime Pads 2x2 Layout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          maxWidth: '360px',
          margin: '0 auto 1.5rem'
        }}
      >
        {PADS.map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              disabled={isPlayingSequence || gameStatus === 'idle' || gameStatus === 'won'}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isActive ? pad.activeColor : pad.color,
                boxShadow: isActive ? `0 0 24px ${pad.color}` : 'var(--shadow-md)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                border: '3px solid #ffffff',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: isPlayingSequence ? 'wait' : 'pointer'
              }}
              aria-label={pad.name}
            >
              <div 
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(2px)'
                }}
              >
                {pad.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {gameStatus === 'idle' && (
          <button onClick={startNewGame} className="btn-primary">
            <Play size={18} /> {t.games.startPlaying}
          </button>
        )}

        {gameStatus === 'tryAgain' && (
          <button onClick={replayCurrentSequence} className="btn-secondary">
            <RotateCcw size={18} /> Replay Melody
          </button>
        )}

        {gameStatus === 'won' && (
          <div style={{ width: '100%' }}>
            <div 
              style={{
                backgroundColor: 'var(--sage-bg)',
                color: 'var(--sage-green)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem'
              }}
            >
              <Award size={32} style={{ margin: '0 auto 0.4rem' }} />
              <p style={{ margin: 0, fontWeight: 700 }}>Splendid! You completed {round - 1} melodic rounds.</p>
            </div>
            <button onClick={startNewGame} className="btn-primary">
              <Play size={18} /> {t.games.playAgain}
            </button>
          </div>
        )}

        {gameStatus === 'playing' && (
          <button onClick={replayCurrentSequence} className="btn-outline" style={{ fontSize: '0.85rem' }}>
            <Volume2 size={16} /> Replay Melody
          </button>
        )}
      </div>
    </div>
  );
}
