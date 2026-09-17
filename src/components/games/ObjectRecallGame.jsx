import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Eye, CheckCircle2, ArrowRight, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { getGameContent } from '../../i18n/gameTranslations';
import audioService from '../../services/audioService';
import SpeakButton from '../common/SpeakButton';

export default function ObjectRecallGame({ onNextActivity }) {
  const { t, activeUserId, language, voiceEnabled } = useApp();
  const [difficulty, setDifficulty] = useState('easy'); // easy: 3 items, medium: 5 items, hard: 7 items
  const [stage, setStage] = useState('memorize'); // 'memorize', 'recall', 'completed'
  const [targetItems, setTargetItems] = useState([]);
  const [displayPool, setDisplayPool] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [countdown, setCountdown] = useState(8);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Dynamic regional objects based on active language
  const allObjects = getGameContent('object-recall', language) || [];

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
    const shuffled = [...allObjects].sort(() => Math.random() - 0.5);
    const chosenTargets = shuffled.slice(0, count);
    setTargetItems(chosenTargets);

    // Display pool: targets + distractors
    const pool = [...shuffled.slice(0, count + 3)].sort(() => Math.random() - 0.5);
    setDisplayPool(pool);

    const initialCountdown = diff === 'easy' ? 8 : diff === 'medium' ? 10 : 12;
    setCountdown(initialCountdown);

    if (voiceEnabled) {
      audioService.speakText('Look carefully at these items and remember them.', language);
    }
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, [language]);

  // Memorize countdown
  useEffect(() => {
    if (stage !== 'memorize') return;
    if (countdown <= 0) {
      setStage('recall');
      if (voiceEnabled) {
        audioService.speakText('Which items did you see? Tap each one to select.', language);
      }
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, stage, voiceEnabled, language]);

  const handleToggleItem = (item) => {
    if (stage !== 'recall') return;

    // Speak name of item when tapped
    if (voiceEnabled && item) {
      audioService.speakText(item.name, language);
    }

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
    const errorCount = selected.length - correctCount;
    const accuracy = Math.max(0, Math.min(100, Math.round((correctCount / targetItems.length) * 100)));
    const score = accuracy;
    const elapsedMs = Date.now() - (startTime || Date.now());
    const durationSeconds = Math.max(1, Math.round(elapsedMs / 1000));
    const responseTimeMs = Math.round(elapsedMs / Math.max(1, selected.length));

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}

    audioService.playSuccessChime();
    if (voiceEnabled) {
      audioService.speakText(`Wonderful recall! You found ${correctCount} of ${targetItems.length} items.`, language);
    }

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'object-recall',
      gameType: 'object-recall',
      difficulty,
      score,
      accuracy,
      responseTimeMs,
      responseTime: responseTimeMs,
      errors: errorCount,
      durationSeconds,
      sessionDuration: durationSeconds,
      moves: selected.length
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
              Game 3 of 8 • Visual & Semantic Memory
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-main)' }}>
                {t.games?.game3Title || 'Everyday Object Recall'}
              </h2>
              <SpeakButton
                text={`${t.games?.game3Title || 'Everyday Object Recall'}. ${t.games?.game3Desc || 'Observe items from our homesteads and recall which were present.'}`}
                lang={language}
                variant="icon"
                size={18}
                title="Hear game instructions"
              />
            </div>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game3Desc || 'Observe everyday items from our homesteads, then recall which ones were present.'}
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

        {/* Status / Countdown */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {stage === 'memorize' && (
            <span style={{ fontSize: '1rem', color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} /> Memorize these {targetItems.length} items ({countdown}s remaining)
            </span>
          )}
          {stage === 'recall' && (
            <span style={{ fontSize: '1rem', color: 'var(--primary-teal)', fontWeight: 700 }}>
              Select the {targetItems.length} items you saw ({selectedItems.length} / {targetItems.length} selected)
            </span>
          )}
          {stage === 'completed' && (
            <span style={{ fontSize: '1rem', color: '#15803d', fontWeight: 700 }}>
              Activity Completed!
            </span>
          )}

          <button
            onClick={() => startNewGame(difficulty)}
            className="mira-btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Stage 1: Memorize Mode */}
      {stage === 'memorize' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${targetItems.length <= 3 ? 3 : 4}, 1fr)`,
            gap: '1.25rem',
            marginBottom: '1.5rem'
          }}
        >
          {targetItems.map((item) => (
            <div
              key={item.id}
              className="mira-card"
              style={{
                padding: '1.5rem 1rem',
                textAlign: 'center',
                backgroundColor: '#fefce8',
                borderColor: '#fef08a',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <strong style={{ display: 'block', fontSize: '1.05rem', color: '#713f12', lineHeight: 1.2 }}>
                {item.name}
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#854d0e', marginTop: '0.25rem', display: 'block' }}>
                {item.category}
              </span>
              <div style={{ marginTop: '0.5rem' }}>
                <SpeakButton text={item.name} lang={language} variant="icon" size={16} title={`Hear ${item.name}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stage 2: Recall Mode */}
      {stage === 'recall' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem'
          }}
        >
          {displayPool.map((item) => {
            const isSelected = selectedItems.some(i => i.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleToggleItem(item)}
                style={{
                  padding: '1.25rem 0.75rem',
                  borderRadius: '20px',
                  border: isSelected ? '3px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? '#f0fdf4' : 'var(--card-bg)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span style={{ fontSize: '3rem', marginBottom: '0.4rem' }}>{item.icon}</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {item.name}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {item.category}
                </span>
                {isSelected && (
                  <span style={{ marginTop: '0.5rem', color: 'var(--primary-teal)', fontSize: '0.8rem', fontWeight: 700 }}>
                    ✓ Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Stage 3: Completed View */}
      {stage === 'completed' && (
        <div className="mira-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧺🌟</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem', fontSize: '1.4rem' }}>
            Splendid Object Recognition!
          </h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1.05rem' }}>
            You identified the familiar items from our homestead with memory and calm presence.
          </p>

          {adaptiveInfo && (
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'left', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Brain size={18} />
                <span>AI Adaptive Recommendation</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>
                <strong>Adaptive Engine:</strong> {adaptiveInfo.rationale} Next pacing level: <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{adaptiveInfo.nextDifficulty}</span>.
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
