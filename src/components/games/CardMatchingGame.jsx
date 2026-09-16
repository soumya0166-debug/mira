import React, { useState, useEffect } from 'react';
import { RotateCcw, Award, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import audioService from '../../services/audioService';
import { useApp } from '../../context/AppContext';

const CARD_ITEMS = [
  { id: 'jasmine', name: 'Jasmine Flower', icon: '🌸', color: '#fbcfe8' },
  { id: 'chai', name: 'Cardamom Chai', icon: '☕', color: '#fed7aa' },
  { id: 'marigold', name: 'Marigold Garland', icon: '🌼', color: '#fef08a' },
  { id: 'peacock', name: 'Peacock Feather', icon: '🦚', color: '#a7f3d0' },
  { id: 'music', name: 'Classical Sitar', icon: '🎵', color: '#ddd6fe' },
  { id: 'lamp', name: 'Brass Prayer Lamp', icon: '🪔', color: '#fde68a' }
];

export default function CardMatchingGame({ onComplete }) {
  const { recordGameSession, t } = useApp();
  const [difficulty, setDifficulty] = useState(6); // 4 (2x2), 6 (3x2), 12 (4x3)
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Initialize deck
  const initializeGame = (cardCount = difficulty) => {
    const pairCount = cardCount / 2;
    const selectedItems = CARD_ITEMS.slice(0, pairCount);
    const deck = [...selectedItems, ...selectedItems]
      .map((item, index) => ({
        ...item,
        uniqueKey: `${item.id}-${index}-${Math.random()}`
      }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setIsWon(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty]);

  const handleCardClick = (index) => {
    // Prevent clicking if already flipped or matched or two are already open
    if (
      flippedIndices.includes(index) ||
      matchedIds.includes(cards[index].id) ||
      flippedIndices.length >= 2
    ) {
      return;
    }

    audioService.playMelodyNote(index);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [idx1, idx2] = newFlipped;
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      if (card1.id === card2.id) {
        // Matched!
        setTimeout(() => {
          const newMatched = [...matchedIds, card1.id];
          setMatchedIds(newMatched);
          setFlippedIndices([]);
          audioService.playSuccessChime();

          // Check Win Condition
          if (newMatched.length === cards.length / 2) {
            setIsWon(true);
            const duration = Math.round((Date.now() - startTime) / 1000);
            recordGameSession('Card Matching', 95, { durationSec: duration, moves: moves + 1 });
            try {
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
            } catch (e) {}
            if (onComplete) onComplete();
          }
        }, 500);
      } else {
        // Not matched, flip back gently
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="mira-card" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
      {/* Game Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--wine-900)' }}>
            {t.games.cardMatchTitle}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            {t.games.cardMatchDesc}
          </p>
        </div>

        {/* Difficulty Selector */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { count: 4, label: 'Gentle (2x2)' },
            { count: 6, label: 'Comfort (3x2)' },
            { count: 12, label: 'Engaging (4x3)' }
          ].map((d) => (
            <button
              key={d.count}
              type="button"
              onClick={() => { setDifficulty(d.count); }}
              className="badge"
              style={{
                backgroundColor: difficulty === d.count ? 'var(--wine-700)' : 'var(--ivory-soft)',
                color: difficulty === d.count ? '#ffffff' : 'var(--text-main)',
                border: '1px solid ' + (difficulty === d.count ? 'var(--wine-700)' : 'var(--ivory-border)'),
                padding: '0.35rem 0.65rem'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          backgroundColor: 'var(--pink-50)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.6rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--wine-800)'
        }}
      >
        <span>{t.games.moves}: {moves}</span>
        <span>{t.games.pairsFound}: {matchedIds.length} / {cards.length / 2}</span>
        <button
          onClick={() => initializeGame(difficulty)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--wine-700)' }}
          title="Restart Game"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {/* Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: difficulty === 4 ? 'repeat(2, 1fr)' : difficulty === 6 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
          gap: '0.85rem',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}
      >
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.id);
          const isMatched = matchedIds.includes(card.id);

          return (
            <button
              key={card.uniqueKey}
              onClick={() => handleCardClick(index)}
              disabled={isMatched}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isFlipped ? card.color : 'var(--wine-700)',
                border: isMatched ? '3px solid var(--sage-green)' : '2px solid var(--ivory-border)',
                boxShadow: isFlipped ? 'var(--shadow-md)' : '0 4px 8px rgba(107, 29, 47, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: difficulty === 12 ? '2rem' : '2.8rem',
                cursor: isMatched ? 'default' : 'pointer',
                transition: 'all 0.25s ease',
                transform: isFlipped ? 'scale(1.02)' : 'scale(1)',
                position: 'relative'
              }}
              aria-label={isFlipped ? card.name : `Card ${index + 1}`}
            >
              {isFlipped ? (
                <>
                  <span>{card.icon}</span>
                  {difficulty <= 6 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      {card.name}
                    </span>
                  )}
                </>
              ) : (
                <Sparkles size={28} style={{ color: '#fbc6d5', opacity: 0.8 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Win Celebration Banner */}
      {isWon && (
        <div 
          style={{
            backgroundColor: 'var(--sage-bg)',
            border: '2px solid #86efac',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <Award size={36} style={{ color: 'var(--sage-green)', margin: '0 auto 0.5rem' }} />
          <h3 style={{ color: 'var(--sage-green)', margin: '0 0 0.25rem' }}>
            {t.games.wellDone}
          </h3>
          <p style={{ color: '#166534', fontSize: '0.95rem', margin: '0 0 1rem' }}>
            {t.games.completedIn}
          </p>
          <button
            onClick={() => initializeGame(difficulty)}
            className="btn-primary"
            style={{ backgroundColor: 'var(--sage-green)' }}
          >
            <RotateCcw size={16} /> {t.games.playAgain}
          </button>
        </div>
      )}
    </div>
  );
}
