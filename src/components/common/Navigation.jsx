import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Navigation() {
  const { activeTab, setActiveTab, mode, currentUser } = useApp();
  const isCaregiver = currentUser?.role === 'guardian' || mode === 'guardian';

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'games', label: 'Games', icon: 'extension' },
    { id: 'memories', label: 'Memories', icon: 'photo_library' },
    { id: isCaregiver ? 'guardian' : 'routines', label: isCaregiver ? 'Family' : 'Family', icon: 'diversity_1' },
    { id: 'settings', label: 'Settings', icon: 'tune' }
  ];

  const showFloatingVoice = activeTab !== 'mira';

  return (
    <>
      {/* Floating Tactile "Talk to MIRA" Button - Stitch Signature Action */}
      {showFloatingVoice && (
        <div
          style={{
            position: 'fixed',
            bottom: '76px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 40,
            pointerEvents: 'none',
            padding: '0 1rem'
          }}
        >
          <button
            onClick={() => {
              setActiveTab('mira');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              backgroundColor: 'var(--stitch-tertiary-container)',
              color: '#ffffff',
              padding: '0.85rem 2rem',
              borderRadius: '9999px',
              boxShadow: '0 8px 24px -4px rgba(89, 24, 0, 0.4), 0 2px 8px rgba(0,0,0,0.1)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '1.05rem',
              letterSpacing: '0.01em',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
              maxWidth: '380px',
              width: '100%'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>mic</span>
            <span>Talk to MIRA</span>
          </button>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav
        role="navigation"
        aria-label="Main Navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1.5px solid rgba(226, 220, 208, 0.8)',
          boxShadow: '0 -2px 16px rgba(0, 0, 0, 0.04)',
          zIndex: 50,
          padding: '0.4rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'guardian' && activeTab === 'wellness');

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.2rem',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  color: isActive ? 'var(--stitch-primary)' : 'var(--stitch-outline)',
                  border: 'none',
                  minWidth: '58px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '26px',
                    fontWeight: isActive ? '700' : 'normal',
                    color: isActive ? 'var(--stitch-primary)' : 'var(--stitch-outline)'
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.01em',
                    lineHeight: 1.1
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
