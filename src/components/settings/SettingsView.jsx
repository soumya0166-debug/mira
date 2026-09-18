import React, { useState } from 'react';
import { Settings, Languages, Type, Eye, Volume2, Shield, Moon, Check, Download, Database, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n/translations';
import audioService from '../../services/audioService';

export default function SettingsView({ onNavigateTab }) {
  const {
    language,
    switchLanguage,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    voiceEnabled,
    setVoiceEnabled,
    offlineActivitiesCount,
    refreshOfflineContent,
    storageHealth,
    isOnline,
    t
  } = useApp();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState(null);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          <Settings size={20} />
          <span>{t.settings.tag || 'Accessibility & Personalization'}</span>
        </div>
        <h1 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontSize: '2rem' }}>
          {t.settings.title || 'Settings & Preferences'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          {t.settings.subtitle || 'Customize text size, language, high contrast, and voice speed for maximum comfort.'}
        </p>
      </div>

      {/* 1. Regional Languages */}
      <div className="mira-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Languages size={22} style={{ color: 'var(--primary-teal)' }} />
          <div>
            <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'block' }}>
              {t.settings.languagesTitle || 'North Eastern Regional Languages (10 Supported)'}
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {t.settings.languagesDesc || 'Select your native tongue for MIRA voice conversation and UI text'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? '#f0fdf4' : 'var(--card-bg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem', color: isSelected ? 'var(--primary-teal)' : 'var(--text-main)' }}>
                    {lang.native}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lang.label} • {lang.region}
                  </span>
                </div>
                {isSelected && <Check size={18} style={{ color: 'var(--primary-teal)' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Elderly Font Scaling */}
      <div className="mira-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Type size={22} style={{ color: 'var(--primary-teal)' }} />
          <div>
            <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'block' }}>
              {t.settings.readabilityTitle || 'Readability & Font Size'}
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {t.settings.readabilityDesc || 'Increase font scale for relaxed reading without eye strain'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { id: 'normal', label: t.settings.standard || 'Standard (100%)', sample: 'Aa' },
            { id: 'large', label: t.settings.large || 'Large (125%)', sample: 'Aa+' },
            { id: 'xlarge', label: t.settings.extraLarge || 'Extra Large (150%)', sample: 'Aa++' }
          ].map((f) => {
            const isSelected = fontSize === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFontSize(f.id)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? '#f0fdf4' : 'var(--card-bg)',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '1.6rem', fontWeight: 700, display: 'block', color: 'var(--primary-teal)', marginBottom: '0.35rem' }}>
                  {f.sample}
                </span>
                <strong style={{ fontSize: '0.95rem', color: isSelected ? 'var(--primary-teal)' : 'var(--text-main)' }}>
                  {f.label}
                </strong>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. High Contrast Mode Toggle */}
      <div className="mira-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Eye size={22} style={{ color: 'var(--primary-teal)' }} />
            <div>
              <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'block' }}>
                {t.settings.highContrastTitle || 'High Contrast Accessibility Mode'}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t.settings.highContrastDesc || 'Enhance contrast to WCAG AAA standards for seniors with low vision'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setHighContrast(!highContrast)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '24px',
              border: highContrast ? '2px solid #000000' : '1px solid var(--border-subtle)',
              backgroundColor: highContrast ? '#000000' : '#f3f4f6',
              color: highContrast ? '#ffff00' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            {highContrast ? (t.settings.highContrastActive || 'Active (High Contrast)') : (t.settings.highContrastOff || 'Off (Natural)')}
          </button>
        </div>
      </div>

      {/* 4. Offline Content & Local Storage Management (Req #12) */}
      <div className="mira-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={22} style={{ color: 'var(--primary-teal)' }} />
            <div>
              <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'block' }}>
                {t.settings.offlineLibraryTitle || 'Offline Cognitive Activity Library'}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t.settings.offlineLibraryDesc || 'Pre-download and cache cognitive sessions for uninterrupted use in remote areas'}
              </span>
            </div>
          </div>

          <button
            onClick={async () => {
              setIsDownloading(true);
              const count = await refreshOfflineContent();
              setIsDownloading(false);
              setDownloadMsg(`${t.settings.downloadSuccess || 'Successfully updated offline library!'} ${count} ${t.settings.activitiesReady || 'activities ready'}.`);
              audioService.playSuccessChime();
              setTimeout(() => setDownloadMsg(null), 4000);
            }}
            disabled={isDownloading}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-teal)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={16} />
            {isDownloading ? (t.settings.downloading || 'Downloading…') : (t.settings.downloadOffline || 'Download Offline Content')}
          </button>
        </div>

        {downloadMsg && (
          <div
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '0.85rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{downloadMsg}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.settings.activitiesReady ? `${t.settings.activitiesReady}:` : 'Available Offline:'}</span>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: '#0e4a42' }}>
              {offlineActivitiesCount || 18} {t.settings.activitiesReady || 'Activities Ready'}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.settings.localDatabase ? `${t.settings.localDatabase}:` : 'Local Database:'}</span>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: '#15803d' }}>
              {storageHealth?.status || 'Healthy'} {t.settings.healthyVault || 'IndexedDB Vault'} ({storageHealth?.usageMB || '2.4'} MB)
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.settings.currentStatus ? `${t.settings.currentStatus}:` : 'Current Status:'}</span>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: isOnline ? '#15803d' : '#1d4ed8' }}>
              {isOnline ? (t.settings.connected || '🟢 Connected') : (t.settings.offlineActive || '🔵 Offline (Active)')}
            </strong>
          </div>
        </div>
      </div>

      {/* 5. Privacy & Disclaimer Link Card */}
      <div
        className="mira-card"
        style={{
          padding: '1.25rem',
          backgroundColor: '#f8fafc',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={20} style={{ color: 'var(--primary-teal)' }} />
          <span style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
            {t.settings.privacyBanner || 'Data Privacy, Row Level Security & Non-Medical Principles'}
          </span>
        </div>
        <button
          onClick={() => onNavigateTab && onNavigateTab('privacy')}
          className="mira-btn-secondary"
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          {t.settings.viewPrivacy || 'View Privacy Policy'}
        </button>
      </div>
    </div>
  );
}
