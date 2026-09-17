import React, { useState, useRef } from 'react';
import { Volume2, Pause, Heart, MessageSquare, Smile, Trash2, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function MemoryCard({ memory, onOpenSlideshow }) {
  const { mode, addReaction, deleteMemory, t, language } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  const isGuardian = mode === 'guardian';

  const toggleAudio = (e) => {
    e.stopPropagation();

    if (memory.audioNote && memory.audioNote.startsWith('data:audio')) {
      if (!audioRef.current) {
        audioRef.current = new Audio(memory.audioNote);
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
      // Read memory title and story aloud in active language so non-reading elders understand
      setIsPlayingAudio(true);
      const memoryText = `${memory.title}. ${memory.year ? `From ${memory.year}.` : ''} ${memory.story} ${memory.questionPrompt ? `Remember: ${memory.questionPrompt}` : ''}`;
      audioService.speak(memoryText, language);
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  const handleReaction = (e, reaction) => {
    e.stopPropagation();
    addReaction(memory.id, reaction);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this memory?')) {
      deleteMemory(memory.id);
    }
  };

  return (
    <article className="mira-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Card Image */}
      <div 
        onClick={onOpenSlideshow}
        style={{
          height: '210px',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          backgroundColor: 'var(--pink-50)',
          cursor: 'pointer',
          position: 'relative',
          marginBottom: '1rem'
        }}
      >
        <img 
          src={memory.image} 
          alt={memory.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(43, 19, 25, 0.75)',
            color: '#ffffff',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {memory.year}
        </div>
      </div>

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <h3 
          onClick={onOpenSlideshow}
          style={{ 
            cursor: 'pointer',
            fontSize: '1.2rem', 
            color: 'var(--wine-900)',
            margin: 0
          }}
        >
          {memory.title}
        </h3>

        {isGuardian && (
          <button 
            onClick={handleDelete}
            aria-label="Delete memory"
            title="Delete memory (Guardian only)"
            style={{ color: '#ef4444', padding: '0.25rem' }}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <span className="badge badge-wine" style={{ fontSize: '0.75rem' }}>
          <Tag size={12} /> {memory.category}
        </span>
        {memory.relationshipLabel && (
          <span className="badge" style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.75rem', fontWeight: 600 }}>
            👥 {memory.relationshipLabel}
          </span>
        )}
      </div>

      {/* Story excerpt */}
      <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.55, flex: 1, marginBottom: '1rem' }}>
        {memory.story}
      </p>

      {/* Prompt Question */}
      {memory.questionPrompt && (
        <div 
          style={{
            backgroundColor: 'var(--ivory-soft)',
            borderLeft: '3px solid var(--wine-500)',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: 'var(--wine-800)',
            fontStyle: 'italic',
            marginBottom: '1rem'
          }}
        >
          <strong>{t.gallery.promptQuestion}</strong> "{memory.questionPrompt}"
        </div>
      )}

      {/* Audio Button */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={toggleAudio}
          className="btn-secondary"
          style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
        >
          {isPlayingAudio ? <Pause size={16} /> : <Volume2 size={16} />}
          <span>{isPlayingAudio ? t.gallery.listeningNow : t.gallery.listenAudio}</span>
        </button>
      </div>

      {/* Reactions Section */}
      <div 
        style={{
          borderTop: '1px solid var(--ivory-border)',
          paddingTop: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.4rem'
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {t.gallery.reactions}
        </span>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={(e) => handleReaction(e, { emoji: '😊', label: 'Brought a smile' })}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--ivory-soft)',
              border: '1px solid var(--ivory-border)',
              fontSize: '0.85rem'
            }}
            title={t.gallery.smiled}
          >
            😊
          </button>
          <button
            type="button"
            onClick={(e) => handleReaction(e, { emoji: '🗣️', label: 'Shared a story' })}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--ivory-soft)',
              border: '1px solid var(--ivory-border)',
              fontSize: '0.85rem'
            }}
            title={t.gallery.shared}
          >
            🗣️
          </button>
          <button
            type="button"
            onClick={(e) => handleReaction(e, { emoji: '❤️', label: 'Felt comforted' })}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--ivory-soft)',
              border: '1px solid var(--ivory-border)',
              fontSize: '0.85rem'
            }}
            title={t.gallery.comforted}
          >
            ❤️
          </button>
        </div>
      </div>

      {/* Recent Reaction Badges */}
      {memory.reactions && memory.reactions.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {memory.reactions.slice(0, 2).map((r, i) => (
            <span key={i} className="badge badge-pink" style={{ fontSize: '0.7rem' }}>
              {r.emoji} {r.label} ({r.date})
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
