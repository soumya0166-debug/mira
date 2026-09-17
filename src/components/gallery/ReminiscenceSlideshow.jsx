import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Smile, 
  Sparkles,
  Pause,
  Play
} from 'lucide-react';
import audioService from '../../services/audioService';
import { useApp } from '../../context/AppContext';

export default function ReminiscenceSlideshow({ memories, initialIndex = 0, onClose, onAddReaction }) {
  const { language, voiceEnabled } = useApp();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  const current = memories[currentIndex];

  useEffect(() => {
    // Stop any playing audio on slide change
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingAudio(false);

    if (current && voiceEnabled) {
      const speechText = `${current.title}. ${current.year ? `Year ${current.year}.` : ''} ${current.story} ${current.questionPrompt || ''}`;
      audioService.speak(speechText, language);
    }
  }, [currentIndex, current?.id, voiceEnabled, language]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
    audioService.playSoftClick();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
    audioService.playSoftClick();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [memories.length]);

  const toggleAudio = () => {
    if (current.audioNote && current.audioNote.startsWith('data:audio')) {
      if (!audioRef.current) {
        audioRef.current = new Audio(current.audioNote);
        audioRef.current.onended = () => setIsPlayingAudio(false);
      }
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play();
        setIsPlayingAudio(true);
      }
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = `${current.title}. ${current.year ? `Year ${current.year}.` : ''} ${current.story} ${current.questionPrompt || ''}`;
      audioService.speak(textToSpeak, language);
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  if (!current) return null;

  return (
    <div 
      className="modal-overlay" 
      style={{
        backgroundColor: 'rgba(35, 10, 20, 0.94)',
        padding: 0,
        zIndex: 2000
      }}
      role="dialog"
      aria-label="Reminiscence Slideshow"
    >
      <div 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          maxWidth: '960px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Top bar: counter & exit */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span 
              className="badge" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '0.9rem' }}
            >
              Memory {currentIndex + 1} of {memories.length}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#fbc6d5' }}>
              {current.category} • {current.year}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Exit slideshow"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={26} />
          </button>
        </div>

        {/* Center: Image & Content */}
        <div 
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1rem 0'
          }}
        >
          {/* Main Photo */}
          <div 
            style={{
              maxHeight: '45vh',
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <img 
              src={current.image} 
              alt={current.title} 
              style={{ maxHeight: '45vh', width: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Memory Text & Story */}
          <div 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.75rem',
              maxWidth: '800px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              textAlign: 'center'
            }}
          >
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem', color: 'var(--wine-900)' }}>
              {current.title}
            </h2>

            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#374151', marginBottom: '0.75rem' }}>
              {current.story}
            </p>

            {current.questionPrompt && (
              <div 
                style={{
                  backgroundColor: 'var(--pink-50)',
                  borderLeft: '4px solid var(--wine-600)',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-block',
                  color: 'var(--wine-900)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
              >
                💬 {current.questionPrompt}
              </div>
            )}

            {/* Audio Voice Note & Reaction Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={toggleAudio}
                className="btn-primary"
                style={{
                  backgroundColor: isPlayingAudio ? '#dc2626' : 'var(--wine-700)',
                  fontSize: '1rem',
                  padding: '0.65rem 1.25rem'
                }}
              >
                {isPlayingAudio ? <Pause size={20} /> : <Volume2 size={20} />}
                <span>{isPlayingAudio ? 'Listening...' : 'Listen to Voice Note'}</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>How did it feel?</span>
                <button
                  onClick={() => onAddReaction(current.id, { emoji: '😊', label: 'Brought a smile' })}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', minHeight: '40px' }}
                  title="Brought a smile"
                >
                  😊 Smiled
                </button>
                <button
                  onClick={() => onAddReaction(current.id, { emoji: '🗣️', label: 'Shared a story' })}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', minHeight: '40px' }}
                  title="Shared a story"
                >
                  🗣️ Shared
                </button>
                <button
                  onClick={() => onAddReaction(current.id, { emoji: '❤️', label: 'Felt comforted' })}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', minHeight: '40px' }}
                  title="Felt comforted"
                >
                  ❤️ Comforted
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls: Big Previous and Next buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.5rem' }}>
          <button
            onClick={handlePrev}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '1.1rem',
              backgroundColor: '#ffffff',
              color: 'var(--wine-900)'
            }}
          >
            <ChevronLeft size={24} /> Previous Memory
          </button>

          <button
            onClick={handleNext}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '1.1rem'
            }}
          >
            Next Memory <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
