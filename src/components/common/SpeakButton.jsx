import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import audioService from '../../services/audioService';
import { useApp } from '../../context/AppContext';

/**
 * Senior-Friendly Multilingual Speak Button
 * Allows non-reading elderly users to hear instructions, cards, and options spoken aloud.
 */
export default function SpeakButton({
  text,
  lang,
  label,
  variant = 'icon', // 'icon', 'pill', 'option', 'senior'
  size = 18,
  className = '',
  style = {},
  autoPlay = false,
  title
}) {
  const { language: currentAppLang, voiceEnabled } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const targetLang = lang || currentAppLang || 'en';
  const targetText = typeof text === 'string' ? text : '';

  // Auto-play on mount or when text changes if voiceEnabled is true
  useEffect(() => {
    if (autoPlay && voiceEnabled && targetText && targetText.trim()) {
      const timer = setTimeout(() => {
        handleSpeak();
      }, 400);
      return () => {
        clearTimeout(timer);
        audioService.stopSpeaking();
      };
    }
  }, [targetText, targetLang, autoPlay, voiceEnabled]);

  const handleSpeak = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (!targetText || !targetText.trim()) return;

    if (isPlaying) {
      audioService.stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    audioService.speakText(
      targetText,
      targetLang,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  };

  // 1. Option embedded variant (for inside multiple-choice cards)
  if (variant === 'option') {
    return (
      <button
        type="button"
        onClick={handleSpeak}
        title={title || 'Tap to hear this option spoken aloud'}
        aria-label={title || 'Hear option spoken aloud'}
        style={{
          width: '38px',
          height: '38px',
          minWidth: '38px',
          borderRadius: '50%',
          backgroundColor: isPlaying ? '#dcfce7' : '#f1f5f9',
          border: `2px solid ${isPlaying ? '#22c55e' : '#cbd5e1'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isPlaying ? '#15803d' : '#475569',
          boxShadow: isPlaying ? '0 0 10px rgba(34, 197, 94, 0.4)' : 'none',
          transition: 'all 0.2s ease',
          padding: 0,
          ...style
        }}
        className={`speak-btn speak-btn-option ${isPlaying ? 'speaking' : ''} ${className}`}
      >
        {isPlaying ? (
          <Volume2 size={size} className="animate-pulse" style={{ color: '#16a34a' }} />
        ) : (
          <Volume2 size={size} />
        )}
      </button>
    );
  }

  // 2. Pill button with text (e.g., "🔊 Listen to Explanation")
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleSpeak}
        title={title || 'Tap to listen to this section'}
        aria-label={title || 'Listen to this section'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.45rem 0.9rem',
          borderRadius: '24px',
          backgroundColor: isPlaying ? '#dcfce7' : '#f8fafc',
          border: `1.5px solid ${isPlaying ? '#22c55e' : '#cbd5e1'}`,
          color: isPlaying ? '#166534' : 'var(--text-main)',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: isPlaying ? '0 2px 10px rgba(34, 197, 94, 0.25)' : 'none',
          transition: 'all 0.2s ease',
          ...style
        }}
        className={`speak-btn speak-btn-pill ${isPlaying ? 'speaking' : ''} ${className}`}
      >
        <Volume2 size={size} style={{ color: isPlaying ? '#16a34a' : 'var(--primary-teal)' }} />
        <span>{isPlaying ? 'Speaking…' : (label || 'Listen')}</span>
      </button>
    );
  }

  // 3. Large Senior Variant (High-visibility, large touch target)
  if (variant === 'senior') {
    return (
      <button
        type="button"
        onClick={handleSpeak}
        title={title || 'Tap to hear voice guidance'}
        aria-label={title || 'Tap to hear voice guidance'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.75rem 1.4rem',
          borderRadius: '28px',
          backgroundColor: isPlaying ? '#166534' : 'var(--primary-teal)',
          border: 'none',
          color: '#ffffff',
          fontSize: '1.05rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(14, 74, 66, 0.3)',
          transition: 'all 0.2s ease',
          ...style
        }}
        className={`speak-btn speak-btn-senior ${isPlaying ? 'speaking' : ''} ${className}`}
      >
        <Volume2 size={22} />
        <span>{isPlaying ? 'Listening…' : (label || 'Hear Voice Guidance')}</span>
      </button>
    );
  }

  // 4. Default Round Icon
  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={title || 'Tap to listen'}
      aria-label={title || 'Tap to listen'}
      style={{
        width: '42px',
        height: '42px',
        minWidth: '42px',
        borderRadius: '50%',
        backgroundColor: isPlaying ? '#dcfce7' : 'var(--ivory-soft)',
        border: `1.5px solid ${isPlaying ? '#22c55e' : 'var(--ivory-border)'}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isPlaying ? '#166534' : 'var(--primary-teal)',
        boxShadow: isPlaying ? '0 0 10px rgba(34, 197, 94, 0.3)' : '0 2px 6px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        padding: 0,
        ...style
      }}
      className={`speak-btn speak-btn-icon ${isPlaying ? 'speaking' : ''} ${className}`}
    >
      <Volume2 size={size} style={{ color: isPlaying ? '#16a34a' : 'inherit' }} />
    </button>
  );
}
