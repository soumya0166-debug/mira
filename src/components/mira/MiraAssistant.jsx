import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, Brain, Clock, Heart, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { audioService } from '../../services/audioService';

export default function MiraAssistant({ onNavigateTab }) {
  const { t, preferredLanguage, patient, memories, routines, reminders, isOnline } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'mira',
      text: `Pranam, ${patient?.preferredName || 'Radha Dadi'}. I am MIRA. I am right here to help you remember your day and bring peace to your mind.`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  // States: 'idle' | 'listening' | 'processing' | 'speaking' | 'error'
  const [voiceState, setVoiceState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, voiceState]);

  const quickPrompts = [
    { label: t.mira?.promptRoutine || 'What is my routine today?', icon: '🕒', query: 'What is my routine today?' },
    { label: t.mira?.promptMemories || 'What memories did I save?', icon: '📖', query: 'What memories did I save in my album?' },
    { label: t.mira?.promptFamily || 'Who is coming to visit today?', icon: '👥', query: 'Who is coming today?' },
    { label: t.mira?.promptGame || 'Start a memory activity', icon: '🦏', query: 'Start a memory activity with North Eastern treasures' },
    { label: t.mira?.promptComfort || 'What should I do next?', icon: '🌿', query: 'What should I do next to feel calm and rested?' }
  ];

  const handleSendMessage = async (userQuery) => {
    const textToSend = userQuery || inputText.trim();
    if (!textToSend) return;

    // Add user message
    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setVoiceState('processing');
    setErrorMessage('');

    try {
      const response = await aiService.chatWithMira(textToSend, {
        memories,
        routines,
        reminders
      });

      const miraReply = response.reply || "I am right here with you. Take your time, everything is peaceful.";

      const miraMsg = {
        id: 'mira-' + Date.now(),
        sender: 'mira',
        text: miraReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source
      };

      setMessages(prev => [...prev, miraMsg]);

      // Speak text aloud if enabled
      if (soundEnabled) {
        setVoiceState('speaking');
        audioService.speakText(
          miraReply,
          preferredLanguage,
          () => setVoiceState('speaking'),
          () => setVoiceState('idle')
        );
      } else {
        setVoiceState('idle');
      }
    } catch (err) {
      setVoiceState('error');
      setErrorMessage('MIRA could not connect to voice right now. Please try again gently.');
      setTimeout(() => setVoiceState('idle'), 3000);
    }
  };

  const handleToggleMic = () => {
    if (voiceState === 'listening') {
      audioService.stopListening();
      setVoiceState('idle');
      return;
    }

    if (voiceState === 'speaking') {
      audioService.stopSpeaking();
      setVoiceState('idle');
      return;
    }

    setVoiceState('listening');
    setErrorMessage('');

    audioService.startSpeechRecognition({
      lang: preferredLanguage,
      onResult: (transcript) => {
        setVoiceState('processing');
        handleSendMessage(transcript);
      },
      onError: (err) => {
        setVoiceState('error');
        if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
          // Requirement 13: Speech-to-text should fail immediately if microphone permission is denied
          setErrorMessage('Microphone access denied. Please allow microphone permission in your browser address bar to speak with MIRA.');
        } else if (err === 'no-speech') {
          setErrorMessage('No speech detected. Please tap the microphone and speak again.');
          setTimeout(() => {
            setVoiceState(prev => prev === 'error' ? 'idle' : prev);
            setErrorMessage('');
          }, 3500);
        } else {
          setErrorMessage('Could not understand speech audio. Please tap the microphone and try again.');
          setTimeout(() => {
            setVoiceState(prev => prev === 'error' ? 'idle' : prev);
            setErrorMessage('');
          }, 3500);
        }
      },
      onEnd: () => {
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      }
    });
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: '520px' }}>
      {/* Top Companion Status Card */}
      <div
        className="mira-card"
        style={{
          padding: '1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Animated Avatar Pill */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: voiceState === 'listening' ? '#dcfce7' : voiceState === 'speaking' ? '#e0f2fe' : '#f0fdf4',
              border: voiceState === 'listening' ? '3px solid #16a34a' : voiceState === 'speaking' ? '3px solid #0284c7' : '2px solid var(--primary-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: voiceState === 'listening' ? '0 0 16px rgba(22, 163, 74, 0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}
          >
            {voiceState === 'listening' ? '🎙️' : voiceState === 'speaking' ? '🗣️' : '🌿'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>MIRA AI Memory Assistant</h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  backgroundColor: voiceState === 'listening' ? '#dcfce7' : voiceState === 'speaking' ? '#e0f2fe' : '#f3f4f6',
                  color: voiceState === 'listening' ? '#166534' : voiceState === 'speaking' ? '#0369a1' : 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                {voiceState === 'listening' ? 'Listening...' : voiceState === 'speaking' ? 'Speaking...' : voiceState === 'processing' ? 'Thinking...' : 'Ready'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Calm, short-sentence guidance • User-isolated private memory
            </p>
          </div>
        </div>

        {/* Voice Audio Toggle */}
        <button
          onClick={() => {
            if (soundEnabled) audioService.stopSpeaking();
            setSoundEnabled(!soundEnabled);
          }}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: soundEnabled ? '#ecfdf5' : '#f3f4f6',
            color: soundEnabled ? 'var(--primary-teal)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundEnabled ? 'Voice Output ON' : 'Muted'}</span>
        </button>
      </div>

      {/* Offline AI Status Notice (Req #11) */}
      {!isOnline && (
        <div
          style={{
            padding: '0.75rem 1.1rem',
            backgroundColor: '#eff6ff',
            borderRadius: '16px',
            border: '1px solid #bfdbfe',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem',
            color: '#1e40af'
          }}
        >
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🔵</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>
              You're offline — Core Cognitive Companion Active
            </strong>
            <span style={{ fontSize: '0.85rem', color: '#1e3a8a' }}>
              Core cognitive activities, saved memories, and routines are fully accessible. AI-powered personalization will resume when you're connected.
            </span>
          </div>
        </div>
      )}

      {/* Quick Query Action Chips */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '0.75rem'
        }}
      >
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.query)}
            disabled={voiceState === 'processing' || voiceState === 'listening'}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '20px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div
        className="mira-card"
        style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1rem',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        {messages.map((msg) => {
          const isMira = msg.sender === 'mira';
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMira ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                display: 'flex',
                gap: '0.75rem',
                flexDirection: isMira ? 'row' : 'row-reverse'
              }}
            >
              {isMira && (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  🌿
                </div>
              )}

              <div
                style={{
                  padding: '0.9rem 1.2rem',
                  borderRadius: isMira ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                  backgroundColor: isMira ? '#f8fafc' : 'var(--primary-teal)',
                  color: isMira ? 'var(--text-main)' : '#ffffff',
                  border: isMira ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: '1.05rem',
                  lineHeight: 1.5,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <p style={{ margin: 0 }}>{msg.text}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.75rem', opacity: 0.75 }}>
                  <span>{msg.time}</span>
                  {msg.source && <span style={{ fontSize: '0.65rem' }}>• {msg.source}</span>}
                </div>
              </div>
            </div>
          );
        })}

        {voiceState === 'processing' && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              🌿
            </div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: '18px', backgroundColor: '#f1f5f9', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              MIRA is thinking gently...
            </div>
          </div>
        )}

        {errorMessage && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '12px', fontSize: '0.9rem', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prominent Voice / Mic Permission Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            borderRadius: '14px',
            border: '1.5px solid #f87171',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            color: '#991b1b',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#991b1b',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0.2rem 0.5rem'
            }}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bottom Voice & Text Input Bar */}
      <div
        className="mira-card"
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        {/* Large Accessible Microphone Button */}
        <button
          onClick={handleToggleMic}
          aria-label="Voice conversation microphone button"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: voiceState === 'listening' ? '#dc2626' : 'var(--primary-teal)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: voiceState === 'listening' ? '0 0 14px rgba(220, 38, 38, 0.6)' : '0 4px 10px rgba(0,0,0,0.1)',
            flexShrink: 0,
            transition: 'all 0.2s ease'
          }}
        >
          {voiceState === 'listening' ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask MIRA about your routine, memories, or family..."
          style={{
            flex: 1,
            padding: '0.85rem 1rem',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-main)',
            fontSize: '1rem',
            outline: 'none'
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || voiceState === 'processing'}
          className="mira-btn-primary"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
