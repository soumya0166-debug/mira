import React, { useState } from 'react';
import { Plus, Play, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import MemoryCard from './MemoryCard';
import AddMemoryModal from './AddMemoryModal';
import ReminiscenceSlideshow from './ReminiscenceSlideshow';
import SpeakButton from '../common/SpeakButton';

export default function MemoryGallery() {
  const { memories, addMemory, addReaction, mode, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const categories = [
    { key: 'All', label: t.gallery?.filterAll || 'All' },
    { key: 'Travel & Family', label: t.gallery?.catTravel || 'Travel & Family' },
    { key: 'Home & Nature', label: t.gallery?.catHome || 'Home & Nature' },
    { key: 'Milestones', label: t.gallery?.catMilestones || 'Milestones' },
    { key: 'Daily Comfort', label: t.gallery?.catDaily || 'Daily Comfort' }
  ];

  const filteredMemories = selectedCategory === 'All'
    ? memories
    : memories.filter((m) => m.category === selectedCategory || (m.tags && m.tags.includes(selectedCategory)));

  const handleStartSlideshow = (index = 0) => {
    setSlideshowIndex(index);
    setSlideshowOpen(true);
  };

  return (
    <div>
      {/* Header Section */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.35rem' }}>{t.gallery.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Primary action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <SpeakButton 
            text={`${t.gallery.title}. ${t.gallery.subtitle}.`} 
            label={t.gallery.listenAudio || 'Listen to Memories'} 
            variant="senior" 
          />

          {memories.length > 0 && (
            <button 
              onClick={() => handleStartSlideshow(0)}
              className="btn-secondary"
            >
              <Play size={18} /> {t.gallery.slideshow}
            </button>
          )}

          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="btn-primary"
          >
            <Plus size={18} /> {t.gallery.addMemory}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div 
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className="badge"
            style={{
              padding: '0.45rem 0.9rem',
              backgroundColor: selectedCategory === cat.key ? 'var(--wine-700)' : 'var(--ivory-card)',
              color: selectedCategory === cat.key ? '#ffffff' : 'var(--text-muted)',
              border: '1px solid ' + (selectedCategory === cat.key ? 'var(--wine-700)' : 'var(--ivory-border)'),
              boxShadow: selectedCategory === cat.key ? '0 2px 6px rgba(107, 29, 47, 0.2)' : 'none',
              cursor: 'pointer'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Memories Grid */}
      {filteredMemories.length === 0 ? (
        <div 
          className="mira-card"
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: 'var(--ivory-soft)'
          }}
        >
          <Sparkles size={40} style={{ color: 'var(--pink-300)', marginBottom: '0.75rem' }} />
          <h3>{t.gallery.noMemories}</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            {t.gallery.noMemoriesDesc || 'Add beloved photographs, recorded voice notes, and familiar stories to spark joy and reminiscence.'}
          </p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus size={18} /> {t.gallery.addMemory}
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredMemories.map((memory, idx) => (
            <MemoryCard 
              key={memory.id} 
              memory={memory} 
              onOpenSlideshow={() => handleStartSlideshow(idx)} 
            />
          ))}
        </div>
      )}

      {/* Add Memory Modal */}
      <AddMemoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={addMemory} 
      />

      {/* Slideshow Modal */}
      {slideshowOpen && (
        <ReminiscenceSlideshow 
          memories={filteredMemories} 
          initialIndex={slideshowIndex} 
          onClose={() => setSlideshowOpen(false)} 
          onAddReaction={addReaction} 
        />
      )}
    </div>
  );
}
