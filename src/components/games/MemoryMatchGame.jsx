import React, { useState, useEffect } from 'react';
import { RotateCcw, Award, Sparkles, Brain, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';

// North Eastern Cultural Treasures for Memory Match
const NER_CARDS = [
  { id: 'rhino', label: 'One-Horned Rhino', subtitle: 'Kaziranga, Assam', icon: '🦏' },
  { id: 'hornbill', label: 'Great Hornbill', subtitle: 'State Bird & Festival, Nagaland', icon: '🪶' },
  { id: 'silk', label: 'Golden Muga & Eri Silk', subtitle: 'Assamese Weave', icon: '🧵' },
  { id: 'flute', label: 'Bamboo Flute & Craft', subtitle: 'Tripura & Meghalaya', icon: '🎋' },
  { id: 'phumdi', label: 'Floating Phumdi & Lake', subtitle: 'Loktak Lake, Manipur', icon: '🌺' },
  { id: 'dhol', label: 'Bihu Dhol & Pepa', subtitle: 'Harvest Rhythm, Assam', icon: '🥁' },
  { id: 'tea', label: 'Fresh Assam Tea Leaf', subtitle: 'Tea Gardens of Brahmaputra', icon: '🍃' },
  { id: 'orchid', label: 'Blue Vanda Orchid', subtitle: 'Wild Bloom of Arunachal', icon: '🌸' }
];

export default function MemoryMatchGame({ onNextActivity }) {
  const { t, activeUserId, preferredLanguage } = useApp();
  const [difficulty, setDifficulty] = useState('easy'); // easy (6 cards, 3 pairs), medium (8 cards, 4 pairs), hard (12 cards, 6 pairs)
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);

  // Initialize deck based on difficulty
  const startNewGame = (diff = difficulty) => {
    setDifficulty(diff);
    let pairCount = 3;
    if (diff === 'medium') pairCount = 4;
    if (diff === 'hard') pairCount = 6;

    const selectedPairs = NER_CARDS.slice(0, pairCount);
    const deck = [...selectedPairs, ...selectedPairs]
      .map((c, index) => ({
        uniqueId: `${c.id}-${index}`,
        ...c
      }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStartTime(Date.now());
    setIsCompleted(false);
    setAdaptiveInfo(null);
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].id)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.id === card2.id) {
        // Matched
        const newMatched = [...matched, card1.id];
        setMatched(newMatched);
        setFlipped([]);

        // Check game completion
        const totalPairs = cards.length / 2;
        if (newMatched.length === totalPairs) {
          handleCompletion(totalPairs, moves + 1);
        }
      } else {
        // Mismatch - flip back gently
        setTimeout(() => {
          setFlipped([]);
        }, 1200);
      }
    }
  };

  const handleCompletion = async (pairs, finalMoves) => {
    setIsCompleted(true);
    const durationSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const accuracy = Math.min(100, Math.round((pairs / finalMoves) * 100));
    const score = Math.max(30, Math.min(100, 100 - (finalMoves - pairs) * 5));

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'heritage-match',
      gameType: 'memory-match',
      difficulty,
      score,
      accuracy,
      durationSeconds,
      moves: finalMoves
    });

    if (result && result.recommendation) {
      setAdaptiveInfo(result.recommendation);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Game Header with Difficulty Selector */}
      <div className="mira-card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-teal)', fontWeight: 700 }}>
              Game 1 of 8 • Cultural Memory
            </span>
            <h2 style={{ margin: '0.25rem 0 0.5rem', color: 'var(--text-main)' }}>
              {t.games?.game1Title || 'Heritage Memory Match'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game1Desc || 'Match pairs of North Eastern cultural treasures at your own peaceful pace.'}
            </p>
          </div>

          {/* Difficulty Toggles */}
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

        {/* Moves and Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem' }}>
            <span><strong>Pairs Matched:</strong> {matched.length} / {cards.length / 2}</span>
            <span><strong>Gentle Moves:</strong> {moves}</span>
          </div>
          <button
            onClick={() => startNewGame(difficulty)}
            className="mira-btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={16} /> Reset Cards
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: difficulty === 'easy' ? 'repeat(3, 1fr)' : difficulty === 'medium' ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);

          return (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(index)}
              disabled={isMatched || isFlipped}
              style={{
                aspectRatio: '1',
                borderRadius: '16px',
                border: isMatched ? '2px solid #16a34a' : isFlipped ? '2px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                backgroundColor: isMatched ? '#dcfce7' : isFlipped ? '#f0fdf4' : 'var(--card-bg)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                cursor: isMatched ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0.75rem',
                textAlign: 'center',
                transition: 'transform 0.2s, background-color 0.2s',
                transform: isFlipped ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              {isFlipped ? (
                <>
                  <span style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{card.icon}</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.2 }}>{card.label}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{card.subtitle}</span>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--primary-teal)' }}>
                  <span style={{ fontSize: '2rem', opacity: 0.7 }}>🌸</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>Tap to Reveal</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Modal / Card */}
      {isCompleted && (
        <div className="mira-card" style={{ padding: '1.75rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌟</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem' }}>Wonderful Focus and Memory!</h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You matched all North Eastern treasures in {moves} gentle moves. Your cognitive engagement was calm and steady.
          </p>

          {adaptiveInfo && (
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'left', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Brain size={18} />
                <span>AI Adaptive Recommendation</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>
                <strong>Pacing:</strong> {adaptiveInfo.rationale} Next suggested level: <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{adaptiveInfo.nextDifficulty}</span>.
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
