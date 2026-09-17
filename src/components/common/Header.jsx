import React, { useState, useRef, useEffect } from 'react';
import { 
  HeartHandshake, 
  Globe, 
  Type, 
  UserCheck, 
  Shield, 
  ChevronDown,
  Volume2,
  LogOut,
  Users,
  User
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
    setActiveTab,
    isOnline,
    syncStatus,
    pendingCount
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isPatient = mode === 'patient';
  const otherUsers = availableUsers.filter((u) => u.id !== currentUser?.id);

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

  const handleLogout = () => {
    closeAll();
    logout();
  };

  const handleSwitchUser = (userId) => {
    closeAll();
    switchUser(userId);
  };

  return (
    <header 
      ref={headerRef}
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--ivory-border)',
        boxShadow: '0 2px 10px rgba(107, 29, 47, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div 
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--wine-700) 0%, var(--wine-900) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(107, 29, 47, 0.25)'
            }}
          >
            <HeartHandshake size={24} style={{ color: '#fbc6d5' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span 
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--primary-teal)',
                  letterSpacing: '-0.02em'
                }}
              >
                MIND AI – NER
              </span>
              <span 
                className="badge" 
                style={{ 
                  backgroundColor: isPatient ? '#ecfdf5' : '#eff6ff',
                  color: isPatient ? '#065f46' : '#1e40af',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {isPatient ? '👵 ' + (t.patientMode || 'Elderly') : '👩‍💼 ' + (t.guardianMode || 'Caregiver')}
              </span>
              {/* Connection & Sync Status Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: !isOnline ? '#eff6ff' : (syncStatus === 'syncing' ? '#fefce8' : (pendingCount > 0 ? '#fef2f2' : '#f0fdf4')),
                  color: !isOnline ? '#1d4ed8' : (syncStatus === 'syncing' ? '#a16207' : (pendingCount > 0 ? '#b91c1c' : '#15803d')),
                  border: `1px solid ${!isOnline ? '#bfdbfe' : (syncStatus === 'syncing' ? '#fef08a' : (pendingCount > 0 ? '#fecaca' : '#bbf7d0'))}`
                }}
                title={!isOnline ? 'Operating in offline mode. All progress is safely saved locally.' : (pendingCount > 0 ? `${pendingCount} items pending cloud sync.` : 'All activities and settings are in sync with cloud.')}
              >
                <span style={{ fontSize: '0.65rem' }}>
                  {!isOnline ? '🔵' : (syncStatus === 'syncing' ? '🟡' : (pendingCount > 0 ? '🔴' : '🟢'))}
                </span>
                <span>
                  {!isOnline ? 'Offline — Saved' : (syncStatus === 'syncing' ? 'Syncing…' : (pendingCount > 0 ? `Sync Pending (${pendingCount})` : 'Online — Synced'))}
                </span>
              </div>
            </div>
            <p 
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.2
              }}
            >
              MDoNER Digital Health • {isPatient ? (patient?.preferredName || patient?.name ? `For ${patient.preferredName || patient.name}` : 'Elderly Mode') : (guardian?.name ? `Caregiver: ${guardian.name}` : 'Caregiver Mode')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Quick Sound Chime Test */}
          <button 
            onClick={() => audioService.playReminderChime()}
            title="Play gentle reminder chime"
            aria-label="Play soothing chime sound"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--pink-50)',
              border: '1px solid var(--pink-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--wine-700)'
            }}
          >
            <Volume2 size={18} />
          </button>

          {/* Font Size Selector */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setFontMenuOpen(!fontMenuOpen); setLangMenuOpen(false); setUserMenuOpen(false); }}
              aria-label="Adjust text size"
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--ivory-soft)',
                border: '1px solid var(--ivory-border)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Type size={16} style={{ color: 'var(--wine-700)' }} />
              <span>{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
              <ChevronDown size={14} />
            </button>

            {fontMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#ffffff',
                  border: '1px solid var(--ivory-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 100,
                  minWidth: '150px'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
                  {t.common?.fontSize || 'Font Size'}
                </div>
                {[
                  { key: 'normal', label: t.common?.normalText || 'Normal', size: '1rem' },
                  { key: 'large', label: t.common?.largeText || 'Large', size: '1.15rem' },
                  { key: 'xlarge', label: t.common?.xlargeText || 'Extra Large', size: '1.3rem' }
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
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: fontSize === item.key ? 'var(--pink-100)' : 'transparent',
                      color: fontSize === item.key ? 'var(--wine-900)' : 'var(--text-main)',
                      fontWeight: fontSize === item.key ? 700 : 500,
                      fontSize: item.size
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
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--ivory-soft)',
                border: '1px solid var(--ivory-border)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Globe size={16} style={{ color: 'var(--wine-700)' }} />
              <span>{languages.find((l) => l.code === language)?.native || 'English'}</span>
              <ChevronDown size={14} />
            </button>

            {langMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#ffffff',
                  border: '1px solid var(--ivory-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 100,
                  minWidth: '180px',
                  maxHeight: '280px',
                  overflowY: 'auto'
                }}
              >
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: language === item.code ? 'var(--pink-100)' : 'transparent',
                      color: language === item.code ? 'var(--wine-900)' : 'var(--text-main)',
                      fontWeight: language === item.code ? 700 : 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    <span>{item.native}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Role Switcher Toggle */}
          <button 
            onClick={() => switchMode(isPatient ? 'guardian' : 'patient')}
            className={isPatient ? 'btn-primary' : 'btn-secondary'}
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              minHeight: '40px'
            }}
            title={isPatient ? 'Switch to Guardian Oversight' : 'Switch to Patient Friendly View'}
          >
            {isPatient ? (
              <>
                <Shield size={16} />
                <span>{t.guardianMode}</span>
              </>
            ) : (
              <>
                <UserCheck size={16} />
                <span>{t.patientMode}</span>
              </>
            )}
          </button>

          {/* User Avatar & Account Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setLangMenuOpen(false); setFontMenuOpen(false); }}
              aria-label="Account menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.7rem 0.35rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--wine-50)',
                border: '1.5px solid var(--wine-100)',
                color: 'var(--wine-800)',
                fontSize: '0.85rem',
                fontWeight: 600,
                minHeight: '40px'
              }}
            >
              <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>{currentUser?.avatar || '🧑'}</span>
              <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.name?.split(' ')[0]}
              </span>
              <ChevronDown size={13} />
            </button>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#ffffff',
                  border: '1px solid var(--ivory-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 100,
                  minWidth: '220px'
                }}
              >
                {/* Current user info */}
                <div
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderBottom: '1px solid var(--ivory-border)',
                    marginBottom: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.6rem' }}>{currentUser?.avatar || '🧑'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--wine-900)' }}>
                        {currentUser?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {currentUser?.email}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--wine-600)', fontWeight: 600, marginTop: '1px' }}>
                        Caring for: {currentUser?.lovedOneName || 'Your Loved One'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <button
                  onClick={() => { closeAll(); setActiveTab('profile'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    textAlign: 'left'
                  }}
                >
                  <User size={15} style={{ color: 'var(--wine-600)' }} />
                  Care Profile &amp; Account
                </button>

                {/* Switch Account */}
                {otherUsers.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.4rem 0.75rem 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Switch Account
                    </div>
                    {otherUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '1.15rem' }}>{u.avatar}</span>
                        <span>{u.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Divider + Sign Out */}
                <div style={{ borderTop: '1px solid var(--ivory-border)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      color: '#dc2626',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={15} />
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
