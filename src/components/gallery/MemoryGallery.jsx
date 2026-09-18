import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function MemoryGallery() {
  const { setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPlayingFeatured, setIsPlayingFeatured] = useState(false);
  const [playingItemId, setPlayingItemId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemoryText, setNewMemoryText] = useState('');

  const categories = [
    { key: 'All', label: 'All (24)' },
    { key: 'Family', label: 'Family & People (12)' },
    { key: 'Tea', label: 'Tea Gardens (5)' },
    { key: 'Festivals', label: 'Festivals (7)' }
  ];

  const familiarMemories = [
    {
      id: 'umiam',
      title: 'Trip to Umiam Lake',
      category: 'Family',
      desc: 'Quiet sunset boat ride on calm waters with pine trees reflecting.',
      details: '2 voice notes · May 2023',
      image: '/assets/umiam_lake.png',
      audioText: 'Baba, remember how calm the lake was that afternoon? You hummed an old song on the boat.'
    },
    {
      id: 'bihu',
      title: 'Bihu Festival Folk Song',
      category: 'Festivals',
      desc: 'Authentic Dhol and Pepa folk melodies celebrating Rongali Bihu.',
      details: '4 min singing · Rongali 2022',
      isAudio: true,
      audioText: 'Playing Bihu folk rhythm: Dhol beats and festive spring joy in Assam.'
    },
    {
      id: 'bamboo',
      title: "Father's Bamboo Craft",
      category: 'Tea',
      desc: 'Tezpur artisan days weaving traditional baskets and tea strainers.',
      details: 'Family Story · 1974',
      image: '/assets/bamboo_craft.png',
      audioText: 'Your father taught you the art of curing bamboo by the river. A priceless family legacy.'
    }
  ];

  const handlePlayFeaturedAudio = () => {
    setIsPlayingFeatured(true);
    audioService.speak(
      "Baba, remember this tea from the gardens? You taught me how to brew it with crushed ginger and fresh milk on chilly Shillong mornings.",
      'en'
    );
    setTimeout(() => setIsPlayingFeatured(false), 5500);
  };

  const handlePlayItemAudio = (item) => {
    setPlayingItemId(item.id);
    audioService.speak(item.audioText, 'en');
    setTimeout(() => setPlayingItemId(null), 4500);
  };

  const handleAddMemorySubmit = (e) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;
    audioService.speak(`Added your new cherished memory: ${newMemoryText}`, 'en');
    setNewMemoryText('');
    setShowAddModal(false);
  };

  return (
    <div className="stitch-container">
      {/* 1. Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--stitch-primary)', margin: 0 }}>
          My Memory Album 📖
        </h1>
        <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--stitch-on-surface-variant)' }}>
          Treasured moments, familiar voices, and cherished places.
        </p>
      </div>

      {/* 2. Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: isSelected ? 'var(--stitch-primary)' : 'var(--stitch-surface-container)',
                color: isSelected ? '#ffffff' : 'var(--stitch-on-surface)',
                border: isSelected ? '2px solid var(--stitch-primary)' : '1px solid rgba(226, 220, 208, 0.7)',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Featured Memory Card: Winter Veranda Tea with Ananya */}
      <section className="stitch-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Memory Image with Location & Date */}
        <div style={{ position: 'relative', width: '100%', height: '260px', backgroundColor: 'var(--stitch-surface-container)' }}>
          <img
            src="/assets/veranda_tea.png"
            alt="Winter Veranda Tea with Ananya"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Location Badge */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: 'var(--stitch-primary)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--stitch-primary)' }}>
              location_on
            </span>
            <span>Shillong, Meghalaya</span>
          </div>

          {/* Date Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(21, 29, 25, 0.85)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            Dec 2023
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Attribute Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--stitch-tertiary-fixed)',
                color: 'var(--stitch-tertiary)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              Assam CTC Tea & Pitha
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--stitch-surface-container)',
                color: 'var(--stitch-primary)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
              Heart Memory
            </span>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--stitch-primary)', margin: 0 }}>
              Winter Veranda Tea with Ananya
            </h2>
            <p style={{ margin: '0.35rem 0 0', fontSize: '1.05rem', color: 'var(--stitch-on-surface-variant)', lineHeight: 1.5 }}>
              Holding hands over clay cups of hot steeped tea on the misted bamboo balcony.
            </p>
          </div>

          {/* Voice Note Audio Component */}
          <div
            style={{
              backgroundColor: 'var(--stitch-surface-container-low)',
              borderRadius: '1rem',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              border: '1px solid rgba(226, 220, 208, 0.6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-tertiary-container)' }}>
                  record_voice_over
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
                  Ananya's Voice Note
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--stitch-on-surface-variant)' }}>
                1 min 24 sec
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--stitch-on-surface)', fontStyle: 'italic', lineHeight: 1.4 }}>
              “Baba, remember this tea from the gardens? You taught me how to brew it with crushed ginger.”
            </p>

            {/* Audio controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.25rem' }}>
              <button
                onClick={handlePlayFeaturedAudio}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--stitch-tertiary-container)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(127, 38, 0, 0.3)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  {isPlayingFeatured ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', height: '24px' }}>
                {[14, 26, 18, 28, 22, 16, 24, 18, 12, 26, 18, 14, 22, 16].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      flex: 1,
                      backgroundColor: isPlayingFeatured ? 'var(--stitch-tertiary-container)' : 'var(--stitch-outline-variant)',
                      height: isPlayingFeatured ? `${h}px` : '8px',
                      borderRadius: '9999px',
                      transition: 'height 0.2s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Call Ananya Now, Record New Thought, Turn Into Game */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              onClick={() => audioService.speak('Dialing Ananya now...', 'en')}
              className="stitch-btn-terracotta"
              style={{ width: '100%', height: '54px', fontSize: '1.05rem' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>call</span>
              <span>Call Ananya Now</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  height: '48px',
                  padding: '0 0.85rem',
                  borderRadius: '1rem',
                  backgroundColor: 'var(--stitch-surface-container)',
                  color: 'var(--stitch-on-surface)',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--stitch-tertiary-container)' }}>
                  mic
                </span>
                <span>Record Thought</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('games');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  height: '48px',
                  padding: '0 0.85rem',
                  borderRadius: '1rem',
                  backgroundColor: 'var(--stitch-secondary-container)',
                  color: 'var(--stitch-on-secondary-container)',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>extension</span>
                <span>Turn Into Game</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. More Familiar Memories Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--stitch-primary)', margin: 0 }}>
            More Familiar Memories
          </h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--stitch-on-surface-variant)' }}>
            3 recent
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {familiarMemories.map((mem) => {
            const isPlaying = playingItemId === mem.id;

            return (
              <div
                key={mem.id}
                onClick={() => handlePlayItemAudio(mem)}
                className="stitch-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  {mem.isAudio ? (
                    <div
                      style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: '1rem',
                        backgroundColor: 'var(--stitch-secondary-container)',
                        color: 'var(--stitch-on-secondary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                        music_note
                      </span>
                    </div>
                  ) : (
                    <div style={{ width: '58px', height: '58px', borderRadius: '1rem', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={mem.image}
                        alt={mem.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = '/assets/veranda_tea.png'; }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                      {mem.title}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--stitch-on-surface-variant)', lineHeight: 1.3 }}>
                      {mem.desc}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--stitch-secondary)', fontWeight: 600, marginTop: '2px' }}>
                      {mem.details}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: isPlaying ? 'var(--stitch-primary)' : 'var(--stitch-surface-container)',
                    color: isPlaying ? '#ffffff' : 'var(--stitch-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    {isPlaying ? 'volume_up' : 'play_arrow'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Add New Memory CTA */}
      <button
        onClick={() => setShowAddModal(true)}
        className="stitch-btn-forest"
        style={{ width: '100%', height: '60px', marginTop: '0.5rem' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>add_circle</span>
        <span>Add New Memory (Speak or Add Photo)</span>
      </button>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--stitch-primary)' }}>
                Add New Cherished Memory
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--stitch-outline)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea
                value={newMemoryText}
                onChange={(e) => setNewMemoryText(e.target.value)}
                placeholder="Describe a cherished story, family trip, or beloved person..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '1rem',
                  border: '1.5px solid rgba(226, 220, 208, 0.8)',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => audioService.speak('Listening to your spoken memory...', 'en')}
                  style={{
                    flex: 1,
                    height: '50px',
                    borderRadius: '1rem',
                    backgroundColor: 'var(--stitch-surface-container)',
                    border: 'none',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--stitch-tertiary-container)' }}>mic</span>
                  <span>Record Voice</span>
                </button>

                <button
                  type="submit"
                  className="stitch-btn-forest"
                  style={{ flex: 1, height: '50px', borderRadius: '1rem' }}
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
