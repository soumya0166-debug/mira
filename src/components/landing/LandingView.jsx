import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function LandingView({ onGetStarted, onLogin }) {
  const { language, setLanguage, voiceEnabled } = useApp();
  const [selectedLang, setSelectedLang] = useState('English');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const culturalLanguages = [
    { code: 'en', name: 'English', sub: 'Default', voicePhrase: 'Welcome to MIRA. A gentle companion for daily comfort, joyful memories, and staying close to those you love.' },
    { code: 'as', name: 'অসমীয়া', sub: 'Assamese', voicePhrase: 'মীৰালৈ স্বাগতম। দৈনন্দিন সান্ত্বনা আৰু সুমধুৰ স্মৃতিৰ বাবে আপোনাৰ আপোন সংগী।' },
    { code: 'bn', name: 'বাংলা', sub: 'Bengali', voicePhrase: 'মীরায় স্বাগতম। প্রতিদিনের আরাম ও মধুর স্মৃতির জন্য আপনার প্রিয় সঙ্গী।' },
    { code: 'mni', name: 'ꯃꯤꯇꯩꯂꯣꯟ', sub: 'Manipuri', voicePhrase: 'MIRA da taramna okchari. Eikhoi loinana ningsingba thoudok khangminasi.' },
    { code: 'kha', name: 'Khasi', sub: 'Meghalaya', voicePhrase: 'Pdiang burom sha ka MIRA. Ka paralok kaba ieid na ka bynta ka jingkynmaw.' },
    { code: 'miz', name: 'Mizo ṭawng', sub: 'Mizoram', voicePhrase: 'MIRA-ah kan lo lawm a che. Ngun takin thawnthu ngaihnawm te i chhiar ang u.' },
    { code: 'hi', name: 'हिन्दी', sub: 'Hindi', voicePhrase: 'मीरा में आपका स्वागत है। दैनिक सुकून और मधुर यादों के लिए आपकी अपनी साथी।' }
  ];

  const handlePlayWelcomeAudio = () => {
    setIsPlayingAudio(true);
    const curr = culturalLanguages.find((l) => l.name === selectedLang) || culturalLanguages[0];
    audioService.speak(curr.voicePhrase, curr.code);
    setTimeout(() => setIsPlayingAudio(false), 4500);
  };

  const handleSelectLanguage = (item) => {
    setSelectedLang(item.name);
    setLanguage(item.code);
    if (voiceEnabled) {
      audioService.speak(item.name, item.code);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--stitch-surface)', color: 'var(--stitch-on-surface)' }}>
      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(242, 252, 244, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid rgba(226, 220, 208, 0.8)',
          boxShadow: '0 1px 8px rgba(0, 0, 0, 0.04)',
          padding: '0.65rem 1rem'
        }}
      >
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img
              src="/assets/mira_logo.png"
              alt="MIRA Logo"
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--stitch-primary)', lineHeight: 1.1 }}>
                MIRA
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--stitch-on-surface-variant)', lineHeight: 1.1 }}>
                Home
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onLogin}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                border: '1.5px solid var(--stitch-primary)',
                backgroundColor: 'transparent',
                color: 'var(--stitch-primary)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1.5px solid var(--stitch-primary)',
                padding: '1px'
              }}
            >
              <img
                src="/assets/deben_baba.png"
                alt="Baba Profile"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '1.25rem 1rem 5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Hero Section */}
        <section
          style={{
            borderRadius: '1.5rem',
            overflow: 'hidden',
            backgroundColor: 'var(--stitch-surface-container-low)',
            boxShadow: '0 6px 20px -4px rgba(28,37,32,0.08)',
            border: '1.5px solid rgba(226, 220, 208, 0.7)'
          }}
        >
          {/* Hero Image */}
          <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden' }}>
            <img
              src="/assets/veranda_tea.png"
              alt="Elder and family member enjoying tea on bamboo veranda overlooking misty mountains"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, var(--stitch-surface-container-low) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%)'
              }}
            />
            {/* Northeast India Tag */}
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255,255,255,0.95)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--stitch-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>Northeast India</span>
            </div>
          </div>

          {/* Hero Card Text & Welcome Audio */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--stitch-tertiary)', fontWeight: 700, fontSize: '0.95rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>spa</span>
              <span>Welcome to MIRA</span>
            </div>

            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--stitch-primary)', lineHeight: 1.2, letterSpacing: '-0.02em', margin: 0 }}>
              Memories. Moments. Together.
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--stitch-on-surface-variant)', lineHeight: 1.5, margin: 0 }}>
              A gentle companion for daily comfort, joyful memories, and staying close to those you love.
            </p>

            {/* Listen in Audio Pill */}
            <button
              onClick={handlePlayWelcomeAudio}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '1.25rem',
                backgroundColor: 'var(--stitch-surface-container-high)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.15s ease'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.99)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--stitch-tertiary-container)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(127, 38, 0, 0.3)'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
                    {isPlayingAudio ? 'volume_up' : 'play_arrow'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                    Listen in {selectedLang}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--stitch-on-surface-variant)' }}>
                    {isPlayingAudio ? "MIRA is speaking warmly..." : "Tap to hear MIRA's warm voice"}
                  </span>
                </div>
              </div>

              {/* Soundwave bars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="wave-bar" style={{ backgroundColor: 'var(--stitch-turmeric)', animationDuration: '0.8s' }} />
                <span className="wave-bar" style={{ backgroundColor: 'var(--stitch-tertiary-container)', animationDuration: '1.2s' }} />
                <span className="wave-bar" style={{ backgroundColor: 'var(--stitch-turmeric)', animationDuration: '0.9s' }} />
              </div>
            </button>
          </div>
        </section>

        {/* Choose Your Language Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-secondary)' }}>translate</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--stitch-on-surface)', margin: 0 }}>
                Choose Your Language
              </h2>
            </div>
            <span style={{ fontSize: '1rem', color: 'var(--stitch-on-surface-variant)', fontWeight: 600 }}>
              ভাষা বাছক
            </span>
          </div>

          {/* Language Selector Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {culturalLanguages.map((item) => {
              const isSelected = selectedLang === item.name;
              const isHindi = item.name === 'हिन्दी';

              return (
                <button
                  key={item.code}
                  onClick={() => handleSelectLanguage(item)}
                  style={{
                    gridColumn: isHindi ? 'span 2' : 'span 1',
                    minHeight: '62px',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    backgroundColor: isSelected ? 'var(--stitch-primary)' : 'var(--stitch-surface-container)',
                    color: isSelected ? '#ffffff' : 'var(--stitch-on-surface)',
                    border: isSelected ? '2px solid var(--stitch-primary)' : '1px solid rgba(226, 220, 208, 0.7)',
                    boxShadow: isSelected ? '0 4px 12px rgba(0, 54, 41, 0.2)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: isSelected ? 'var(--stitch-primary-fixed)' : 'var(--stitch-on-surface-variant)' }}>
                      {item.sub}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#ffffff' }}>
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Primary Action Button: Get Started as Baba / Aita */}
        <button
          onClick={onGetStarted}
          className="stitch-btn-forest"
          style={{
            width: '100%',
            height: '62px',
            fontSize: '1.15rem',
            borderRadius: '1.25rem',
            boxShadow: '0 6px 20px -4px rgba(0, 54, 41, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>sentiment_satisfied</span>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontWeight: 700, lineHeight: 1.1 }}>Get Started</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>Start as Baba / Aita</span>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', marginLeft: 'auto' }}>arrow_forward</span>
        </button>

        {/* Caregiver Setup Option */}
        <div
          onClick={onLogin}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '1.25rem',
            backgroundColor: 'var(--stitch-surface-container-lowest)',
            border: '1.5px solid rgba(226, 220, 208, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-tertiary-fixed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--stitch-tertiary)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>diversity_1</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                I'm a Caregiver or Family Member
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--stitch-on-surface-variant)' }}>
                Assist setup & photo albums
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--stitch-outline)' }}>chevron_right</span>
        </div>

        {/* Privacy & Offline Reassurance */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textAlign: 'center', padding: '0.5rem 0' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--stitch-outline)' }}>lock</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--stitch-on-surface-variant)' }}>
            Works offline in your village or home · 100% private
          </span>
        </div>
      </main>
    </div>
  );
}
