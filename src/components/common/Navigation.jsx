import React, { useState } from 'react';
import { 
  Home, 
  Puzzle, 
  Mic, 
  Sparkles, 
  CalendarCheck, 
  ShieldCheck, 
  Menu,
  X,
  Activity,
  User,
  Settings,
  Shield,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navigation() {
  const { activeTab, setActiveTab, t, currentUser, mode } = useApp();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const isCaregiver = currentUser?.role === 'guardian' || mode === 'guardian';

  // ── Segregated Navigation Items ──
  const mainNavItems = isCaregiver
    ? [
        { id: 'guardian', label: 'Caregiver Hub', icon: ShieldCheck },
        { id: 'wellness', label: 'Cognitive Trends', icon: Activity },
        { id: 'mira', label: 'MIRA AI', icon: Mic, highlight: true },
        { id: 'memories', label: t.nav?.memory || 'Memories', icon: Sparkles },
        { id: 'routines', label: t.nav?.routine || 'Care Plan', icon: CalendarCheck },
        { id: 'more', label: t.nav?.more || 'More', icon: Menu, isMore: true }
      ]
    : [
        { id: 'home', label: t.nav?.home || 'Home', icon: Home },
        { id: 'games', label: t.nav?.games || 'Games', icon: Puzzle },
        { id: 'mira', label: 'MIRA AI', icon: Mic, highlight: true },
        { id: 'memories', label: t.nav?.memory || 'Memories', icon: Sparkles },
        { id: 'routines', label: t.nav?.routine || 'Routine', icon: CalendarCheck },
        { id: 'more', label: t.nav?.more || 'More', icon: Menu, isMore: true }
      ];

  const moreItems = isCaregiver
    ? [
        { id: 'caregiver', label: 'Consent Tiers', icon: Shield },
        { id: 'games', label: 'Games Suite', icon: Puzzle },
        { id: 'home', label: 'Elder View Preview', icon: Home },
        { id: 'notifications', label: t.nav?.notifications || 'Notifications', icon: Bell },
        { id: 'profile', label: t.nav?.profile || 'Profile', icon: User },
        { id: 'settings', label: t.nav?.settings || 'Settings', icon: Settings },
        { id: 'privacy', label: t.nav?.privacy || 'Privacy & Security', icon: Shield }
      ]
    : [
        { id: 'profile', label: 'My Profile & ICE', icon: User },
        { id: 'notifications', label: t.nav?.notifications || 'Reminders', icon: Bell },
        { id: 'settings', label: 'Language & Display', icon: Settings },
        { id: 'privacy', label: t.nav?.privacy || 'Privacy & Security', icon: Shield }
      ];

  return (
    <>
      {/* More Options Drawer / Modal for Elder Ease */}
      {moreMenuOpen && (
        <div
          onClick={() => setMoreMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{t.nav?.moreOptions || 'More Options'}</strong>
              <button
                onClick={() => setMoreMenuOpen(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f3f4f6'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isItemActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMoreMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: '16px',
                      backgroundColor: isItemActive ? '#f0fdf4' : '#f8fafc',
                      border: isItemActive ? '2px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={22} style={{ color: 'var(--primary-teal)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
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
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-subtle)',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
          zIndex: 50,
          padding: '0.4rem 0.5rem'
        }}
      >
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isMore) {
              return (
                <button
                  key={item.id}
                  onClick={() => setMoreMenuOpen(true)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.2rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '16px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    minWidth: '58px',
                    minHeight: '52px',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={22} />
                  <span>{item.label}</span>
                </button>
              );
            }

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
                  padding: '0.4rem 0.6rem',
                  borderRadius: '16px',
                  backgroundColor: isActive ? '#f0fdf4' : 'transparent',
                  color: isActive ? 'var(--primary-teal)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.75rem',
                  minWidth: '58px',
                  minHeight: '52px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.highlight ? (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-teal)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(14, 74, 66, 0.3)'
                    }}
                  >
                    <Icon size={18} />
                  </div>
                ) : (
                  <Icon
                    size={22}
                    style={{
                      color: isActive ? 'var(--primary-teal)' : 'var(--text-muted)',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.15s ease'
                    }}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
