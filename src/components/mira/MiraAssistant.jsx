import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function MiraAssistant({ onNavigateTab }) {
  const { setActiveTab } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85); // Gentle slower speech
  const [activeSpeechText, setActiveSpeechText] = useState(
    "Good morning Baba! It is wonderful to hear your voice. Ananya told me you were thinking of your garden this morning. Would you like to hear a folk tune or do a quick memory game?"
  );
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [inputMode, setInputMode] = useState(false);
  const [customText, setCustomText] = useState('');

  const quickAnswers = [
    {
      id: 1,
      text: 'I am feeling peaceful today',
      icon: 'spa',
      reply: 'That warms my heart, Baba. A calm morning brings health and joy. Enjoy the pine fragrance of Shillong.'
    },
    {
      id: 2,
      text: 'Play a gentle folk melody',
      icon: 'music_note',
      reply: 'Playing the soothing notes of Bhupen Hazarika and traditional Bihu flute for you, Baba. Relax your shoulders.'
    },
    {
      id: 3,
      text: "Let's do our morning memory game",
      icon: 'psychology',
      reply: "Wonderful idea! Let's remember the morning tea veranda together.",
      action: () => {
        if (onNavigateTab) onNavigateTab('games');
        else setActiveTab('games');
      }
    },
    {
      id: 4,
      text: 'Can we call Ananya?',
      icon: 'call',
      reply: 'Of course Baba, connecting you to Ananya right now on quick dial.'
    },
    {
      id: 5,
      text: "What is today's weather in Shillong?",
      icon: 'wb_sunny',
      reply: 'It is a pleasant 22 degrees Celsius with a cool pine morning breeze and gentle sun filtering through your bamboo blinds.'
    }
  ];

  const handleSpeak = (text) => {
    setIsSpeaking(true);
    audioService.speak(text, 'en');
    setTimeout(() => setIsSpeaking(false), 4500);
  };

  const handleSelectAnswer = (ans) => {
    setSelectedResponse(ans.id);
    setActiveSpeechText(ans.reply);
    handleSpeak(ans.reply);
    if (ans.action) {
      setTimeout(ans.action, 2500);
    }
  };

  const toggleSpeed = () => {
    const nextRate = speechRate === 0.85 ? 0.65 : 0.85;
    setSpeechRate(nextRate);
    handleSpeak(`Speech speed set to ${nextRate === 0.65 ? 'calm and extra slow' : 'gentle standard'}`);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const userText = customText.trim();
    setCustomText('');
    setInputMode(false);
    const reply = `I hear you Baba: "${userText}". Everything is peaceful and we are right here with you.`;
    setActiveSpeechText(reply);
    handleSpeak(reply);
  };

  return (
    <div className="stitch-container">
      {/* 1. Status and Mode Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--stitch-surface-container-high)',
            color: 'var(--stitch-primary)',
            fontSize: '0.95rem',
            fontWeight: 700
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--stitch-secondary)'
            }}
          />
          <span>Connected · On-Device Voice</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--stitch-surface-container)',
            color: 'var(--stitch-on-surface-variant)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cloud_off</span>
          <span>Offline Ready</span>
        </div>
      </div>

      {/* 2. Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--stitch-primary)', margin: 0 }}>
            MIRA Companion
          </h1>
          <button
            onClick={() => setInputMode(!inputMode)}
            aria-label="Toggle text input"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--stitch-surface-container-low)',
              color: 'var(--stitch-primary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>tune</span>
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--stitch-on-surface-variant)' }}>
          Listening with patience and warmth · Speak naturally
        </p>
      </div>

      {/* 3. Central Companion Speech & Living Voice Orb */}
      <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Organic Living Presence Waveform Orb */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 0',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-surface-container-low)',
            overflow: 'hidden'
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundColor: 'rgba(186, 238, 217, 0.4)',
              filter: 'blur(32px)',
              pointerEvents: 'none'
            }}
          />

          {/* Living Resonance Rings */}
          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span
              style={{
                position: 'absolute',
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                backgroundColor: 'rgba(186, 238, 217, 0.5)',
                transform: isSpeaking ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.4s ease'
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '104px',
                height: '104px',
                borderRadius: '50%',
                backgroundColor: 'rgba(170, 235, 235, 0.6)'
              }}
            />
            {/* Core Tactile Orb */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-primary-container)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0, 54, 41, 0.3)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '38px' }}>spa</span>
            </div>
          </div>

          {/* Animated Waveform Rhythm */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '32px', marginTop: '1rem' }}>
            {[10, 24, 16, 28, 20, 12, 22, 16].map((h, idx) => (
              <span
                key={idx}
                style={{
                  width: '5px',
                  borderRadius: '9999px',
                  backgroundColor: idx % 2 === 0 ? 'var(--stitch-primary)' : 'var(--stitch-tertiary-container)',
                  height: isSpeaking ? `${h}px` : '10px',
                  transition: 'height 0.2s ease'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--stitch-on-surface-variant)', marginTop: '0.5rem' }}>
            {isSpeaking ? 'MIRA is speaking gently...' : 'MIRA is listening with care'}
          </span>
        </div>

        {/* High Legibility Spoken Transcription */}
        <div
          style={{
            backgroundColor: 'var(--stitch-surface-container-high)',
            borderRadius: '1rem',
            padding: '1.25rem'
          }}
        >
          <p style={{ margin: 0, fontSize: '1.25rem', color: 'var(--stitch-on-surface)', lineHeight: 1.6, fontWeight: 500 }}>
            “{activeSpeechText}”
          </p>
        </div>

        {/* Speech Comfort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSpeak(activeSpeechText)}
            style={{
              flex: 1,
              minWidth: '130px',
              height: '48px',
              backgroundColor: 'var(--stitch-surface-container)',
              color: 'var(--stitch-on-surface)',
              borderRadius: '1rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--stitch-primary)' }}>
              volume_up
            </span>
            <span>Replay Voice</span>
          </button>

          <button
            onClick={toggleSpeed}
            style={{
              flex: 1,
              minWidth: '130px',
              height: '48px',
              backgroundColor: speechRate === 0.65 ? 'var(--stitch-secondary-container)' : 'var(--stitch-surface-container)',
              color: 'var(--stitch-on-surface)',
              borderRadius: '1rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--stitch-secondary)' }}>
              pace
            </span>
            <span>{speechRate === 0.65 ? 'Slow (Active)' : 'Slower Speech'}</span>
          </button>

          <div
            style={{
              height: '48px',
              padding: '0 1rem',
              backgroundColor: 'var(--stitch-surface-container)',
              color: 'var(--stitch-on-surface)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 600
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--stitch-tertiary-container)' }}>
              translate
            </span>
            <span>Assamese · Khasi</span>
          </div>
        </div>
      </div>

      {/* 4. Northeast Garden Ambience Visual Cue */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '140px',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          backgroundColor: 'var(--stitch-surface-container)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '1.25rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <img
          src="/assets/tea_garden_bloom.png"
          alt="Courtyard garden orchid in bloom"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.src = '/assets/veranda_tea.png'; }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(21, 29, 25, 0.85) 0%, rgba(21, 29, 25, 0.25) 60%, transparent 100%)'
          }}
        />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>park</span>
          <span style={{ fontSize: '1rem', fontWeight: 700 }}>
            Your Courtyard Orchid & Camellia are in Bloom
          </span>
        </div>
      </div>

      {/* Optional Custom Input form if keyboard clicked */}
      {inputMode && (
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type your thought or question for MIRA..."
            style={{
              flex: 1,
              height: '52px',
              padding: '0 1rem',
              borderRadius: '1rem',
              border: '1.5px solid var(--stitch-primary)',
              fontSize: '1rem',
              backgroundColor: '#ffffff'
            }}
          />
          <button
            type="submit"
            className="stitch-btn-forest"
            style={{ width: '80px', height: '52px', borderRadius: '1rem' }}
          >
            Send
          </button>
        </form>
      )}

      {/* 5. Prompt Quick-Pill Responses: "Tap to Answer Naturally" */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
            Tap to Answer Naturally
          </span>
          <span style={{ fontSize: '0.95rem', color: 'var(--stitch-on-surface-variant)' }}>
            {quickAnswers.length} options
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {quickAnswers.map((ans) => {
            const isSelected = selectedResponse === ans.id;

            return (
              <button
                key={ans.id}
                onClick={() => handleSelectAnswer(ans)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: isSelected ? 'var(--stitch-surface-container)' : 'var(--stitch-surface-container-lowest)',
                  color: 'var(--stitch-on-surface)',
                  padding: '1rem 1.25rem',
                  borderRadius: '1rem',
                  border: isSelected ? '2px solid var(--stitch-primary)' : '1px solid rgba(226, 220, 208, 0.7)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '64px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--stitch-surface-container)',
                      color: 'var(--stitch-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                      {ans.icon}
                    </span>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                    {ans.text}
                  </span>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-outline)' }}>
                  arrow_forward
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Central Mic Speak Trigger & Reassurance footer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', width: '100%' }}>
          <button
            onClick={() => setInputMode(!inputMode)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--stitch-surface-container)',
              color: 'var(--stitch-on-surface-variant)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Type with keyboard"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>keyboard</span>
          </button>

          {/* Big Circular Microphone Button */}
          <button
            onClick={() => handleSpeak(activeSpeechText)}
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: isSpeaking ? 'var(--stitch-primary)' : 'var(--stitch-tertiary-container)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(89, 24, 0, 0.35)',
              cursor: 'pointer',
              transform: isSpeaking ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>mic</span>
          </button>

          <button
            onClick={() => handleSpeak('MIRA is your companion. Tap any of the options or press the microphone to speak.')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--stitch-surface-container)',
              color: 'var(--stitch-on-surface-variant)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Help"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>help</span>
          </button>
        </div>

        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--stitch-on-surface)' }}>
          Tap Button to Speak Naturally
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-surface-container-low)',
            color: 'var(--stitch-on-surface-variant)',
            fontSize: '0.85rem',
            lineHeight: 1.4,
            textAlign: 'left'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--stitch-secondary)', flexShrink: 0 }}>
            verified_user
          </span>
          <span>
            MIRA is your gentle friend and companion. For medical questions, MIRA will always connect you directly to your family doctor or caregiver.
          </span>
        </div>
      </div>
    </div>
  );
}
