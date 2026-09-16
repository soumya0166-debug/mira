import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Play, Award, Volume2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { audioService } from '../../services/audioService';

// Traditional Drums of North East India
const DRUMS = [
  { id: 0, name: 'Bihu Dhol', region: 'Assam', color: '#c2410c', glow: '#fdba74', icon: '🥁', soundFreq: 260 },
  { id: 1, name: 'Manipuri Pung', region: 'Manipur', color: '#047857', glow: '#86efac', icon: '🪘', soundFreq: 330 },
  { id: 2, name: 'Garo Dama', region: 'Meghalaya', color: '#1d4ed8', glow: '#93c5fd', icon: '🪕', soundFreq: 392 },
  { id: 3, name: 'Mizo Khuang', region: 'Mizoram', color: '#7e22ce', glow: '#d8b4fe', icon: '🔔', soundFreq: 523 }
];

export default function SequenceRecallGame({ onNextActivity }) {
  const { t, activeUserId } = useApp();
  const [difficulty, setDifficulty] = useState('easy'); // easy: 3 steps, medium: 5 steps, hard: 7 steps
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeDrum, setActiveDrum] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Tap "Start Sequence" to listen');
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const getTargetLength = (diff = difficulty) => {
    if (diff === 'easy') return 3;
    if (diff === 'medium') return 5;
    return 7;
  };

  const playTone = (freq) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {}
  };

  const generateSequence = (diff = difficulty) => {
    const len = getTargetLength(diff);
    const newSeq = [];
    for (let i = 0; i < len; i++) {
      newSeq.push(Math.floor(Math.random() * DRUMS.length));
    }
    return newSeq;
  };

  const startSequence = (diff = difficulty) => {
    setDifficulty(diff);
    setIsCompleted(false);
    setPlayerStep(0);
    setAdaptiveInfo(null);
    setStartTime(Date.now());

    const newSeq = generateSequence(diff);
    setSequence(newSeq);
    playBackSequence(newSeq);
  };

  const playBackSequence = async (seq) => {
    setIsPlayingSequence(true);
    setStatusMessage('Watch and listen to the gentle rhythm...');

    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      const drumId = seq[i];
      setActiveDrum(drumId);
      playTone(DRUMS[drumId].soundFreq);
      await new Promise(r => setTimeout(r, 650));
      setActiveDrum(null);
    }

    setIsPlayingSequence(false);
    setStatusMessage('Your turn! Tap the drums in the same peaceful order.');
  };

  const handleDrumClick = (drumId) => {
    if (isPlayingSequence || isCompleted || sequence.length === 0) return;

    setActiveDrum(drumId);
    playTone(DRUMS[drumId].soundFreq);
    setTimeout(() => setActiveDrum(null), 300);

    if (sequence[playerStep] === drumId) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      if (nextStep === sequence.length) {
        // Successful completion
        finishGame();
      } else {
        setStatusMessage(`Good! Step ${nextStep} of ${sequence.length}. Keep going.`);
      }
    } else {
      // Gentle mismatch without buzzer or jarring sounds
      setStatusMessage('Gently take a breath. Let us listen to the rhythm once again.');
      setTimeout(() => {
        setPlayerStep(0);
        playBackSequence(sequence);
      }, 1000);
    }
  };

  const finishGame = async () => {
    setIsCompleted(true);
    setStatusMessage('Splendid rhythm! You remembered the entire sequence with great focus.');

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}

    const durationSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const score = 95;
    const accuracy = 100;

    const result = await adaptiveEngine.recordGameSession({
      userId: activeUserId || 'usr-radha-1',
      gameId: 'sequence-recall',
      gameType: 'sequence-recall',
      difficulty,
      score,
      accuracy,
      durationSeconds,
      moves: sequence.length
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
              Game 2 of 8 • Sensory & Auditory Memory
            </span>
            <h2 style={{ margin: '0.25rem 0 0.5rem', color: 'var(--text-main)' }}>
              {t.games?.game2Title || 'Rhythm Sequence Recall'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game2Desc || 'Watch the traditional drum glow and repeat the soothing pattern.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Difficulty:</span>
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => startSequence(d)}
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
                {d} ({getTargetLength(d)} beats)
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', color: 'var(--primary-teal)', fontWeight: 600 }}>
            {statusMessage}
          </span>
          <button
            onClick={() => startSequence(difficulty)}
            className="mira-btn-primary"
            style={{ padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
          >
            <Play size={16} /> Start Sequence
          </button>
        </div>
      </div>

      {/* 4 Cultural Drums Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {DRUMS.map((drum) => {
          const isActive = activeDrum === drum.id;
          return (
            <button
              key={drum.id}
              onClick={() => handleDrumClick(drum.id)}
              disabled={isPlayingSequence || isCompleted}
              style={{
                aspectRatio: '1.3',
                borderRadius: '24px',
                border: isActive ? `4px solid ${drum.color}` : '2px solid var(--border-subtle)',
                backgroundColor: isActive ? drum.glow : 'var(--card-bg)',
                boxShadow: isActive ? `0 0 24px ${drum.glow}` : '0 4px 12px rgba(0,0,0,0.06)',
                cursor: isPlayingSequence ? 'wait' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(1.04)' : 'scale(1)'
              }}
            >
              <span style={{ fontSize: '3rem', marginBottom: '0.4rem' }}>{drum.icon}</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{drum.name}</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{drum.region}</span>
            </button>
          );
        })}
      </div>

      {/* Completion Card */}
      {isCompleted && (
        <div className="mira-card" style={{ padding: '1.75rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🪘✨</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem' }}>Rhythm & Harmony Mastered!</h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You listened closely and repeated all {sequence.length} beats with composure.
          </p>

          {adaptiveInfo && (
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'left', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Brain size={18} />
                <span>AI Adaptive Engine Suggestion</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>
                {adaptiveInfo.rationale} Next level: <strong>{adaptiveInfo.nextDifficulty}</strong>.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => startSequence(adaptiveInfo?.nextDifficulty || difficulty)}
              className="mira-btn-primary"
              style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={18} /> Repeat Activity
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
