import React, { useState } from 'react';
import { Sparkles, Check, RotateCcw, Award } from 'lucide-react';
import audioService from '../../services/audioService';
import { useApp } from '../../context/AppContext';

const WORD_PAIRS = [
  { id: '1', prompt: 'Morning Chai ☕', match: 'Cardamom & Ginger 🌿' },
  { id: '2', prompt: 'Courtyard Garden 🪴', match: 'Fresh White Jasmine 🌸' },
  { id: '3', prompt: 'Vintage Gramophone 📻', match: 'Morning Classical Raga 🎶' },
  { id: '4', prompt: 'Monsoon Showers 🌧️', match: 'Floating Paper Boat ⛵' },
  { id: '5', prompt: 'Warm Winter Knitting 🧶', match: 'Soft Woolen Shawl 🧣' }
];

export default function WordAssociationGame({ onComplete }) {
  const { recordGameSession, t } = useApp();

  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongAttempt, setWrongAttempt] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shuffled right-side answers
  const [shuffledMatches, setShuffledMatches] = useState(() => 
    [...WORD_PAIRS].sort(() => Math.random() - 0.5)
  );

  const resetGame = () => {
    setSelectedPrompt(null);
    setMatchedPairs([]);
    setWrongAttempt(null);
    setIsCompleted(false);
    setShuffledMatches([...WORD_PAIRS].sort(() => Math.random() - 0.5));
  };

  const handlePromptClick = (pair) => {
    if (matchedPairs.includes(pair.id)) return;
    audioService.playSoftClick();
    setSelectedPrompt(pair);
    setWrongAttempt(null);
  };

  const handleMatchClick = (matchedItem) => {
    if (!selectedPrompt) return;
    if (matchedPairs.includes(matchedItem.id)) return;

    if (selectedPrompt.id === matchedItem.id) {
      // Correct Match!
      audioService.playSuccessChime();
      const updated = [...matchedPairs, selectedPrompt.id];
      setMatchedPairs(updated);
      setSelectedPrompt(null);
      setWrongAttempt(null);

      if (updated.length === WORD_PAIRS.length) {
        setIsCompleted(true);
        recordGameSession('Word Association', 98, { pairsMatched: updated.length });
        if (onComplete) onComplete();
      }
    } else {
      // Gentle mismatch
      audioService.playSoftClick();
      setWrongAttempt(matchedItem.id);
      setTimeout(() => setWrongAttempt(null), 800);
    }
  };

  return (
    <div className="mira-card" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.25rem', color: 'var(--wine-900)' }}>
        {t.games.wordTitle}
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        {t.games.wordDesc}
      </p>

      {/* Instruction */}
      <div 
        style={{
          padding: '0.6rem 1rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--pink-50)',
          color: 'var(--wine-800)',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}
      >
        {selectedPrompt 
          ? `Now select the companion that pairs with "${selectedPrompt.prompt}"`
          : 'First, tap an item on the left column.'}
      </div>

      {/* Two columns for pairing */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Left Column (Prompts) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--wine-800)', textAlign: 'left', margin: 0 }}>
            Memories & Keepsakes
          </h4>
          {WORD_PAIRS.map((pair) => {
            const isMatched = matchedPairs.includes(pair.id);
            const isSelected = selectedPrompt?.id === pair.id;

            return (
              <button
                key={pair.id}
                onClick={() => handlePromptClick(pair)}
                disabled={isMatched}
                style={{
                  textAlign: 'left',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isMatched ? 'var(--sage-bg)' : isSelected ? 'var(--wine-700)' : 'var(--ivory-soft)',
                  color: isMatched ? 'var(--sage-green)' : isSelected ? '#ffffff' : 'var(--text-main)',
                  border: '1.5px solid ' + (isMatched ? 'var(--sage-green)' : isSelected ? 'var(--wine-700)' : 'var(--ivory-border)'),
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isMatched ? 0.7 : 1
                }}
              >
                <span>{pair.prompt}</span>
                {isMatched && <Check size={18} />}
              </button>
            );
          })}
        </div>

        {/* Right Column (Matches) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--wine-800)', textAlign: 'left', margin: 0 }}>
            Cherished Companions
          </h4>
          {shuffledMatches.map((pair) => {
            const isMatched = matchedPairs.includes(pair.id);
            const isWrong = wrongAttempt === pair.id;

            return (
              <button
                key={pair.id}
                onClick={() => handleMatchClick(pair)}
                disabled={isMatched}
                style={{
                  textAlign: 'left',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isMatched ? 'var(--sage-bg)' : isWrong ? '#fee2e2' : 'var(--ivory-card)',
                  color: isMatched ? 'var(--sage-green)' : isWrong ? '#b91c1c' : 'var(--text-main)',
                  border: '1.5px solid ' + (isMatched ? 'var(--sage-green)' : isWrong ? '#ef4444' : 'var(--pink-200)'),
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isMatched ? 0.7 : 1
                }}
              >
                <span>{pair.match}</span>
                {isMatched && <Check size={18} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div 
          style={{
            backgroundColor: 'var(--sage-bg)',
            color: 'var(--sage-green)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <Award size={36} style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ color: 'var(--sage-green)', margin: '0 0 0.25rem' }}>
            {t.games.wellDone}
          </h3>
          <p style={{ color: '#166534', margin: '0 0 1rem' }}>
            All nostalgic pairs matched with grace and clarity!
          </p>
          <button onClick={resetGame} className="btn-primary" style={{ backgroundColor: 'var(--sage-green)' }}>
            <RotateCcw size={16} /> {t.games.playAgain}
          </button>
        </div>
      )}

      {!isCompleted && (
        <button onClick={resetGame} className="btn-outline" style={{ fontSize: '0.85rem' }}>
          <RotateCcw size={16} /> Reset Pairs
        </button>
      )}
    </div>
  );
}
