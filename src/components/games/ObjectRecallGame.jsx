import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';

const ALL_NER_OBJECTS = [
  { id: 'japi', name: 'Bamboo Japi Hat', category: 'Traditional Sunhat', icon: '👒' },
  { id: 'gamusa', name: 'Red & White Gamusa', category: 'Handwoven Scarf', icon: '🧣' },
  { id: 'chai_kettle', name: 'Brass Tea Kettle', category: 'Assam Tea Ritual', icon: '🫖' },
  { id: 'flute', name: 'Handcrafted Flute', category: 'Folk Music', icon: '🎋' },
  { id: 'clay_lamp', name: 'Clay Diya / Lamp', category: 'Evening Prayer', icon: '🪔' },
  { id: 'basket', name: 'Cane Tea Basket', category: 'Harvest', icon: '🧺' },
  { id: 'brass_glass', name: 'Brass Water Tumbler', category: 'Dining Keepsake', icon: '🥛' },
  { id: 'betel_pouch', name: 'Bata Betel Pouch', category: 'Hospitality', icon: '🍃' },
  { id: 'spinning_wheel', name: 'Charkha Takli', category: 'Eri Silk Weaving', icon: '🧵' }
];

export default function ObjectRecallGame({ onNextActivity }) {
  const { t, activeUserId } = useApp();
  const [difficulty, setDifficulty] = useState('easy'); // easy: 3 items, medium: 5 items, hard: 7 items
  const [stage, setStage] = useState('memorize'); // 'memorize', 'recall', 'completed'
  const [targetItems, setTargetItems] = useState([]);
  const [displayPool, setDisplayPool] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [countdown, setCountdown] = useState(8);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const getItemCount = (diff = difficulty) => {
    if (diff === 'easy') return 3;
    if (diff === 'medium') return 5;
    return 7;
  };

  const startNewGame = (diff = difficulty) => {
    setDifficulty(diff);
    setStage('memorize');
    setSelectedItems([]);
    setAdaptiveInfo(null);
    setStartTime(Date.now());

    const count = getItemCount(diff);
    const shuffled = [...ALL_NER_OBJECTS].sort(() => Math.random() - 0.5);
    const chosenTargets = shuffled.slice(0, count);
    setTargetItems(chosenTargets);

    // Display pool: targets + distractors
    const pool = [...shuffled.slice(0, count + 3)].sort(() => Math.random() - 0.5);
    setDisplayPool(pool);

    setCountdown(diff === 'easy' ? 8 : diff === 'medium' ? 10 : 12);
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, []);

  // Memorize countdown
  useEffect(() => {
    if (stage !== 'memorize') return;
    if (countdown <= 0) {
      setStage('recall');
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, stage]);

  const handleToggleItem = (item) => {
    if (stage !== 'recall') return;
    if (selectedItems.some(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      const nextSelected = [...selectedItems, item];
      setSelectedItems(nextSelected);

      if (nextSelected.length === targetItems.length) {
        evaluateRecall(nextSelected);
      }
    }
  };

  const evaluateRecall = async (selected) => {
    setStage('completed');
    const correctCount = selected.filter(s => targetItems.some(t => t.id === s.id)).length;
    const accuracy = Math.round((correctCount / targetItems.length) * 100);
    const score = Math.max(40, accuracy);
    const durationSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'object-recall',
      gameType: 'object-recall',
      difficulty,
      score,
      accuracy,
      durationSeconds,
      moves: selected.length
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
              Game 3 of 8 • Visual & Semantic Memory
            </span>
            <h2 style={{ margin: '0.25rem 0 0.5rem', color: 'var(--text-main)' }}>
              {t.games?.game3Title || 'Everyday Object Recall'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game3Desc || 'Look at familiar North Eastern household items, then recall them from memory.'}
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
                {d} ({getItemCount(d)} items)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage 1: Memorization Phase */}
      {stage === 'memorize' && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 700, marginBottom: '1.25rem' }}>
            <Eye size={18} /> Take in these {targetItems.length} items calmly • Hidden in {countdown}s
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(targetItems.length, 4)}, 1fr)`, gap: '1rem', marginTop: '1rem' }}>
            {targetItems.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '1.25rem 0.75rem',
                  borderRadius: '16px',
                  backgroundColor: '#f8fafc',
                  border: '2px solid var(--primary-teal)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{item.icon}</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{item.name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.category}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStage('recall')}
            className="mira-btn-primary"
            style={{ marginTop: '1.5rem', padding: '0.65rem 1.25rem' }}
          >
            I Remember Them! Start Recall
          </button>
        </div>
      )}

      {/* Stage 2: Recall Phase */}
      {stage === 'recall' && (
        <div className="mira-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
              Select the {targetItems.length} items you saw earlier:
            </h3>
            <span style={{ fontWeight: 700, color: 'var(--primary-teal)' }}>
              Selected: {selectedItems.length} / {targetItems.length}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {displayPool.map(item => {
              const isSelected = selectedItems.some(i => i.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleItem(item)}
                  style={{
                    padding: '1rem',
                    borderRadius: '16px',
                    border: isSelected ? '3px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? '#f0fdf4' : 'var(--card-bg)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <span style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{item.icon}</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'center' }}>{item.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stage 3: Completed Phase */}
      {stage === 'completed' && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧺✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem' }}>Excellent Memory & Recall!</h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You identified the North Eastern keepsakes with calm visual focus.
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
