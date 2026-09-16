import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, Check, Upload } from 'lucide-react';
import VoiceRecorder from '../common/VoiceRecorder';
import audioService from '../../services/audioService';

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Vintage Train in Mist',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="%23fdf2f4"/><circle cx="200" cy="130" r="80" fill="%23fbc6d5" opacity="0.6"/><text x="200" y="135" font-family="sans-serif" font-size="18" fill="%236b1d2f" text-anchor="middle" font-weight="bold">🚂 Mountain Toy Train</text></svg>'
  },
  {
    name: 'Jasmine Courtyard',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="%23f0fdf4"/><circle cx="200" cy="130" r="80" fill="%23bbf7d0" opacity="0.6"/><text x="200" y="135" font-family="sans-serif" font-size="18" fill="%23166534" text-anchor="middle" font-weight="bold">🌸 Courtyard Blossoms</text></svg>'
  },
  {
    name: 'Family Celebration',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="%23fef3c7"/><circle cx="200" cy="130" r="80" fill="%23fde68a" opacity="0.6"/><text x="200" y="135" font-family="sans-serif" font-size="18" fill="%2392400e" text-anchor="middle" font-weight="bold">🎉 Family Gathering</text></svg>'
  }
];

export default function AddMemoryModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('Travel & Family');
  const [story, setStory] = useState('');
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [image, setImage] = useState(SAMPLE_PHOTO_PRESETS[0].url);
  const [audioNote, setAudioNote] = useState(null);

  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      year: year || 'Cherished Memory',
      category,
      story,
      questionPrompt: questionPrompt || 'Do you remember this special moment?',
      image,
      hasAudio: !!audioNote,
      audioNote,
      tags: [category]
    });

    audioService.playSuccessChime();
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-memory-title">
      <div className="modal-dialog">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 id="add-memory-title" style={{ margin: 0, fontSize: '1.4rem' }}>
            Add a Cherished Memory
          </h2>
          <button 
            onClick={onClose} 
            aria-label="Close modal"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--wine-50)',
              color: 'var(--wine-800)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Photo Preview & Selector */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--wine-900)' }}>
              Memory Photo
            </label>
            <div 
              style={{
                width: '100%',
                height: '180px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6',
                border: '1px solid var(--ivory-border)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {image ? (
                <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={48} style={{ color: '#9ca3af' }} />
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <label 
                className="btn-secondary" 
                style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '0.45rem 0.9rem', minHeight: '38px' }}
              >
                <Upload size={16} /> Upload Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageFileChange} 
                  style={{ display: 'none' }} 
                />
              </label>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or choose preset:</span>

              {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: image === preset.url ? 'var(--wine-100)' : 'var(--ivory-soft)',
                    border: '1px solid var(--ivory-border)',
                    color: 'var(--wine-800)',
                    fontWeight: 600
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Year */}
          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--wine-900)' }}>
                Memory Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Trip to Grand Canyon, Cousin's Wedding"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--ivory-border)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--wine-900)' }}>
                Year or Era
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., Summer 1985 or Early 90s"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--ivory-border)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--wine-900)' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--ivory-border)',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="Travel & Family">Travel & Family</option>
              <option value="Home & Nature">Home & Nature</option>
              <option value="Milestones">Milestones & Celebrations</option>
              <option value="Daily Comfort">Daily Comfort & Traditions</option>
            </select>
          </div>

          {/* Story Narrative */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--wine-900)' }}>
              The Story (Context & Details)
            </label>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Describe the moment in warm, conversational words. Who was there? What were they doing?"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--ivory-border)',
                fontSize: '0.95rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Question Prompt for Patient */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--wine-900)' }}>
              Gentle Reminiscence Question Prompt
            </label>
            <input
              type="text"
              value={questionPrompt}
              onChange={(e) => setQuestionPrompt(e.target.value)}
              placeholder="e.g., Do you remember who made the delicious carrot halwa?"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--ivory-border)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Voice Recording */}
          <div>
            <VoiceRecorder onRecordingComplete={(dataUrl) => setAudioNote(dataUrl)} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={18} /> Save Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
