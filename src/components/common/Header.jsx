import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  Shield, 
  UserCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function Header() {
  const { 
    language, 
    setLanguage, 
    languages, 
    fontSize, 
    setFontSize, 
    mode, 
    switchMode, 
    patient, 
    guardian,
    t,
    currentUser,
    logout,
    switchUser,
    availableUsers,
    activeTab,
    setActiveTab,
    voiceEnabled,
    setVoiceEnabled
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isPatient = mode === 'patient';
  const otherUsers = availableUsers?.filter((u) => u.id !== currentUser?.id) || [];

  // Close menus when clicking outside
  const headerRef = useRef(null);
  useEffect(() => {
    function handleClick(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setLangMenuOpen(false);
        setFontMenuOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const closeAll = () => {
    setLangMenuOpen(false);
    setFontMenuOpen(false);
    setUserMenuOpen(false);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home': return 'Home';
      case 'games': return 'Games';
      case 'memories': return 'Memories';
      case 'mira': return 'Companion';
      case 'guardian':
      case 'wellness':
      case 'caregiver': return 'Caregiver Dashboard';
      case 'settings': return 'Settings';
      case 'profile': return 'Profile';
      default: return 'Home';
    }
  };

  const currentAvatarImg = isPatient ? '/assets/deben_baba.png' : '/assets/profile_ananya.png';

  return (
    <header 
      ref={headerRef}
      style={{
        backgroundColor: 'rgba(242, 252, 244, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1.5px solid rgba(226, 220, 208, 0.8)',
        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div 
        style={{
          maxWidth: '840px',
          margin: '0 auto',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}
      >
        {/* Brand Logo & Screen Title */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <img
            src="/assets/mira_logo.png"
            alt="MIRA Logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--stitch-primary)', lineHeight: 1.1 }}>
              MIRA
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--stitch-on-surface-variant)', lineHeight: 1.1 }}>
              {getTabTitle()}
            </span>
          </div>
        </div>

        {/* Action Controls: Size toggle, Language, Voice chime, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Voice Read Toggle */}
          <button 
            onClick={() => {
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (next) {
                audioService.speak(
                  language === 'as' ? 'কণ্ঠ সহায়ক সক্ৰিয়' : 'Voice guidance enabled',
                  language
                );
              }
            }}
            title={voiceEnabled ? "Voice guidance is ON" : "Voice guidance is OFF"}
            aria-label="Toggle voice"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: voiceEnabled ? 'var(--stitch-surface-container)' : '#fef2f2',
              color: voiceEnabled ? 'var(--stitch-primary)' : '#b91c1c',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              {voiceEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Format Size Adjust Button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setFontMenuOpen(!fontMenuOpen); setLangMenuOpen(false); setUserMenuOpen(false); }}
              aria-label="Adjust text size"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-surface-container)',
                color: 'var(--stitch-on-surface)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>format_size</span>
            </button>

            {fontMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#ffffff',
                  border: '1.5px solid rgba(226, 220, 208, 0.8)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  padding: '0.5rem',
                  zIndex: 100,
                  minWidth: '160px'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--stitch-on-surface-variant)', padding: '0.25rem 0.5rem' }}>
                  Text Size
                </div>
                {[
                  { key: 'normal', label: 'Normal (18px)', size: '1rem' },
                  { key: 'large', label: 'Large (20px)', size: '1.15rem' },
                  { key: 'xlarge', label: 'Extra Large (24px)', size: '1.3rem' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setFontSize(item.key);
                      setFontMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      backgroundColor: fontSize === item.key ? 'var(--stitch-surface-container)' : 'transparent',
                      color: fontSize === item.key ? 'var(--stitch-primary)' : 'var(--stitch-on-surface)',
                      fontWeight: fontSize === item.key ? 700 : 500,
                      fontSize: item.size,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setLangMenuOpen(!langMenuOpen); setFontMenuOpen(false); setUserMenuOpen(false); }}
              aria-label="Change language"
              style={{
                height: '42px',
                padding: '0 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--stitch-surface-container)',
                color: 'var(--stitch-on-surface)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--stitch-primary)' }}>translate</span>
              <span>{languages?.find((l) => l.code === language)?.native || 'English'}</span>
            </button>

            {langMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#ffffff',
                  border: '1.5px solid rgba(226, 220, 208, 0.8)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  padding: '0.5rem',
                  zIndex: 100,
                  minWidth: '190px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
              >
                {languages?.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangMenuOpen(false);
                      if (voiceEnabled) {
                        audioService.speak(item.native, item.code);
                      }
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      backgroundColor: language === item.code ? 'var(--stitch-surface-container)' : 'transparent',
                      color: language === item.code ? 'var(--stitch-primary)' : 'var(--stitch-on-surface)',
                      fontWeight: language === item.code ? 700 : 500,
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{item.native}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--stitch-on-surface-variant)' }}>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile & Role Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setLangMenuOpen(false); setFontMenuOpen(false); }}
              aria-label="Account menu"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                padding: '2px',
                backgroundColor: 'var(--stitch-surface-container)',
                border: '2px solid var(--stitch-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              <img
                src={currentAvatarImg}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/deben_baba.png';
                }}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </button>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#ffffff',
                  border: '1.5px solid rgba(226, 220, 208, 0.8)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  padding: '0.5rem',
                  zIndex: 100,
                  minWidth: '220px'
                }}
              >
                {/* Current user info */}
                <div
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderBottom: '1px solid rgba(226, 220, 208, 0.8)',
                    marginBottom: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                      src={currentAvatarImg} 
                      alt="" 
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--stitch-primary)' }}>
                        {currentUser?.name || (isPatient ? 'Deben Baruah (Baba)' : 'Ananya Baruah')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--stitch-on-surface-variant)' }}>
                        {isPatient ? 'Shillong Home' : 'Caregiver'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Switcher */}
                <button
                  onClick={() => {
                    closeAll();
                    switchMode(isPatient ? 'guardian' : 'patient');
                    setActiveTab(isPatient ? 'guardian' : 'home');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '10px',
                    color: 'var(--stitch-primary)',
                    backgroundColor: 'var(--stitch-surface-container-low)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '0.35rem'
                  }}
                >
                  {isPatient ? <Shield size={16} /> : <UserCheck size={16} />}
                  <span>{isPatient ? 'Switch to Caregiver Hub' : 'Switch to Elder View'}</span>
                </button>

                {/* Profile Link */}
                <button
                  onClick={() => { closeAll(); setActiveTab('profile'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    color: 'var(--stitch-on-surface)',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <User size={16} style={{ color: 'var(--stitch-primary)' }} />
                  Care Profile & Settings
                </button>

                {/* Divider + Sign Out */}
                <div style={{ borderTop: '1px solid rgba(226, 220, 208, 0.8)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                  <button
                    onClick={() => { closeAll(); logout(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      color: '#dc2626',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
