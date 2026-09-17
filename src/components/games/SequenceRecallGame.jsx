import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Play, Award, Volume2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { audioService } from '../../services/audioService';
import { getGameContent } from '../../i18n/gameTranslations';
import SpeakButton from '../common/SpeakButton';

export default function SequenceRecallGame({ onNextActivity }) {
  const { t, activeUserId, language, voiceEnabled } = useApp();
  const [difficulty, setDifficulty] = useState('easy'); // easy: 3 steps, medium: 5 steps, hard: 7 steps
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeDrum, setActiveDrum] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Tap "Start Sequence" to listen');
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveInfo, setAdaptiveInfo] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Dynamic drums according to selected language
  const drums = getGameContent('sequence-recall', language) || [];

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
      newSeq.push(Math.floor(Math.random() * (drums.length || 4)));
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

    if (voiceEnabled) {
      audioService.speakText('Listen to the drums carefully.', language);
      await new Promise(r => setTimeout(r, 1200));
    }

    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      const drumId = seq[i];
      setActiveDrum(drumId);
      playTone(drums[drumId]?.soundFreq || 260);
      await new Promise(r => setTimeout(r, 650));
      setActiveDrum(null);
    }

    setIsPlayingSequence(false);
    setStatusMessage('Your turn! Tap the drums in the same peaceful order.');

    if (voiceEnabled) {
      audioService.speakText('Your turn. Tap the drums in order.', language);
    }
  };

  const handleDrumClick = (drumId) => {
    if (isPlayingSequence || isCompleted || sequence.length === 0) return;

    setActiveDrum(drumId);
    playTone(drums[drumId]?.soundFreq || 260);
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
      if (voiceEnabled) {
        audioService.speakText('Let us listen to the rhythm once again.', language);
      }
      setTimeout(() => {
        setPlayerStep(0);
        playBackSequence(sequence);
      }, 1200);
    }
  };

  const finishGame = async () => {
    setIsCompleted(true);
    setStatusMessage('Splendid rhythm! You remembered the entire sequence with great focus.');

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}

    audioService.playSuccessChime();
    if (voiceEnabled) {
      audioService.speakText('Splendid rhythm! You remembered the sequence with calm focus.', language);
    }

    const durationSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const score = 100;
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
      {/* Header */}
      <div className="mira-card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-teal)', fontWeight: 700 }}>
              Game 2 of 8 • Auditory Working Memory
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-main)' }}>
                {t.games?.game2Title || 'Rhythm Sequence Recall'}
              </h2>
              <SpeakButton
                text={`${t.games?.game2Title || 'Rhythm Sequence Recall'}. ${t.games?.game2Desc || 'Watch and repeat the peaceful light and drum rhythm patterns.'}`}
                lang={language}
                variant="icon"
                size={18}
                title="Hear game instructions"
              />
            </div>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t.games?.game2Desc || 'Watch and repeat the peaceful light and drum rhythm patterns from Bihu Dhol, Manipuri Pung, and Garo Dama.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Steps:</span>
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
                {d} ({getTargetLength(d)})
              </button>
            ))}
          </div>
        </div>

        {/* Status Message and Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-teal)' }}>
            {statusMessage}
          </span>
          {sequence.length === 0 && (
            <button
              onClick={() => startSequence(difficulty)}
              className="mira-btn-primary"
              style={{ padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Play size={18} /> Start Rhythm
            </button>
          )}
        </div>
      </div>

      {/* Drum Instruments Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          maxWidth: '500px',
          margin: '0 auto 1.5rem'
        }}
      >
        {drums.map((drum) => {
          const isActive = activeDrum === drum.id;
          return (
            <button
              key={drum.id}
              onClick={() => handleDrumClick(drum.id)}
              disabled={isPlayingSequence || isCompleted || sequence.length === 0}
              style={{
                aspectRatio: '1',
                borderRadius: '24px',
                border: `3px solid ${isActive ? drum.glow : drum.color}`,
                backgroundColor: isActive ? drum.glow : 'var(--card-bg)',
                boxShadow: isActive ? `0 0 24px ${drum.glow}` : '0 4px 12px rgba(0,0,0,0.05)',
                cursor: (isPlayingSequence || isCompleted || sequence.length === 0) ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1.5rem',
                transform: isActive ? 'scale(1.06)' : 'scale(1)',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{drum.icon}</span>
              <strong style={{ fontSize: '1.1rem', color: drum.color }}>{drum.name}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{drum.region}</span>
            </button>
          );
        })}
      </div>

      {/* Completion View */}
      {isCompleted && (
        <div className="mira-card" style={{ padding: '1.75rem', textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥁🌟</div>
          <h3 style={{ color: '#065f46', margin: '0 0 0.5rem' }}>Splendid Rhythmic Working Memory!</h3>
          <p style={{ color: '#047857', margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You mirrored all the gentle traditional drum beats accurately.
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
              onClick={() => startSequence(adaptiveInfo?.nextDifficulty || difficulty)}
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
