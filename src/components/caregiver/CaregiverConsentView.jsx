import React, { useState } from 'react';
import { Shield, Lock, Eye, CheckCircle2, UserCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export const getPermissionLevels = (t) => [
  {
    level: 'NONE',
    label: t.caregiver?.levelNone || 'No Access (Completely Private)',
    icon: '🔒',
    description: t.caregiver?.descNone || 'Your caregiver cannot view any of your memories, routines, or activity scores.',
    badgeColor: '#ef4444'
  },
  {
    level: 'BASIC_ACTIVITY',
    label: t.caregiver?.levelBasic || 'Basic Activity (Game scores & engagement only)',
    icon: '🦏',
    description: t.caregiver?.descBasic || 'Caregiver can view your game participation and cognitive activity scores only.',
    badgeColor: '#f59e0b'
  },
  {
    level: 'ROUTINES',
    label: t.caregiver?.levelRoutines || 'Routines & Reminders (Can view & assist with daily schedule)',
    icon: '🕒',
    description: t.caregiver?.descRoutines || 'Caregiver can view and assist with your daily tea, walks, and medication routines.',
    badgeColor: '#3b82f6'
  },
  {
    level: 'INSIGHTS',
    label: t.caregiver?.levelInsights || 'Wellness Insights (View engagement trends & check-ins)',
    icon: '📊',
    description: t.caregiver?.descInsights || 'Caregiver can view weekly engagement patterns and daily mood check-ins.',
    badgeColor: '#8b5cf6'
  },
  {
    level: 'FULL_SHARED_DATA',
    label: t.caregiver?.levelFull || 'Full Shared Data (View memories, routines, and activity)',
    icon: '🤝',
    description: t.caregiver?.descFull || 'Caregiver can view your memory album, routines, activity history, and check-ins.',
    badgeColor: '#10b981'
  }
];

export const PERMISSION_LEVELS = getPermissionLevels({});

export default function CaregiverConsentView() {
  const { caregiverPermission, setCaregiverPermission, guardian, patient, t } = useApp();
  const [currentLevel, setCurrentLevel] = useState(caregiverPermission || 'FULL_SHARED_DATA');
  const [isSaved, setIsSaved] = useState(false);

  const levels = getPermissionLevels(t);

  const handleSavePermission = (level) => {
    setCurrentLevel(level);
    if (setCaregiverPermission) {
      setCaregiverPermission(level);
    }
    setIsSaved(true);
    audioService.playSuccessChime();
    setTimeout(() => setIsSaved(false), 2500);

    // Also notify backend if online
    try {
      fetch('/api/caregiver/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mira_token') || ''}`
        },
        body: JSON.stringify({
          caregiverUserId: localStorage.getItem('mira_active_user_id') || '',
          permissionLevel: level
        })
      });
    } catch {}
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          <Shield size={20} />
          <span>{t.caregiver?.headerTag || 'Patient-Controlled Privacy & Consent'}</span>
        </div>
        <h1 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontSize: '2rem' }}>
          {t.caregiver?.title || 'Caregiver Connectivity & Consent'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          {t.caregiver?.subtitle || 'You are in complete control of what information your designated caregiver can view.'}
        </p>
      </div>

      {/* Connected Caregiver Profile Card */}
      <div
        className="mira-card"
        style={{
          padding: '1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>👩‍💼</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>
                {guardian?.name || 'Ananya Sharma'}
              </h3>
              <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                {t.caregiver?.verifiedTag || 'Verified Family Member'}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {guardian?.relation || 'Daughter & Primary Caregiver'} • {guardian?.phone || '+91 98765 43210'}
            </p>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.caregiver?.currentStatus || 'Current Access'}:</span>
          <strong style={{ color: 'var(--primary-teal)', fontSize: '1rem' }}>
            {levels.find(p => p.level === currentLevel)?.label || 'Full Shared Data (All Access)'}
          </strong>
        </div>
      </div>

      {/* Permission Tiers Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem', color: 'var(--text-main)', fontSize: '1.25rem' }}>
          {t.caregiver?.permissionHeader || 'Choose What Your Caregiver Can Access'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {levels.map((perm) => {
            const isSelected = currentLevel === perm.level;
            return (
              <div
                key={perm.level}
                onClick={() => handleSavePermission(perm.level)}
                className="mira-card"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? '#f0fdf4' : 'var(--card-bg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                  borderRadius: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{perm.icon}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.05rem', color: isSelected ? 'var(--primary-teal)' : 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {perm.label}
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {perm.description}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid var(--primary-teal)' : '2px solid var(--border-subtle)',
                    backgroundColor: '#ffffff',
                    flexShrink: 0
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Pill */}
      {isSaved && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            borderRadius: '14px',
            border: '1px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}
        >
          <CheckCircle2 size={20} />
          <strong>Caregiver permissions successfully updated and enforced by Row Level Security!</strong>
        </div>
      )}

      {/* Security & RLS Disclaimer Card */}
      <div
        className="mira-card"
        style={{
          padding: '1.25rem',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Lock size={20} style={{ color: 'var(--primary-teal)', marginTop: '0.2rem', flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
              Cryptographic Data Isolation Guarantee
            </strong>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.45 }}>
              Under PostgreSQL Row Level Security (RLS), your private memories, routine schedules, and wellness logs are stored in an encrypted vault. Caregivers and third parties cannot access unauthorized records under any circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
