import React from 'react';
import { Shield, Lock, Heart, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PrivacyPolicyView() {
  const { t } = useApp();

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'left' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          <Shield size={20} />
          <span>{t.privacy.tag || 'Patient Trust, Ethics & Security'}</span>
        </div>
        <h1 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontSize: '2rem' }}>
          {t.privacy.title || 'Privacy, Ethics & Non-Medical Principles'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          {t.privacy.subtitle || 'MIND AI – NER architectural commitment to user isolation, clinical safety, and data sovereignty.'}
        </p>
      </div>

      {/* 1. Core Non-Medical Product Principle Banner */}
      <div
        className="mira-card"
        style={{
          padding: '1.5rem',
          backgroundColor: '#fef3c7',
          borderColor: '#fde68a',
          borderRadius: '20px',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={24} style={{ color: '#b45309', flexShrink: 0, marginTop: '0.2rem' }} />
          <div>
            <h3 style={{ margin: '0 0 0.35rem', color: '#92400e', fontSize: '1.2rem' }}>
              {t.privacy.principleTitle || 'Important Product Principle (Non-Diagnostic Application)'}
            </h3>
            <p style={{ margin: '0 0 0.75rem', color: '#92400e', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {t.privacy.principleDesc || 'MIND AI is NOT a medical diagnosis application. It never claims that it diagnoses dementia, measures medical severity with clinical accuracy, or replaces physicians and neurologists.'}
            </p>
            <div style={{ fontSize: '0.9rem', color: '#78350f' }}>
              {t.privacy.supportiveTerms || 'We strictly utilize supportive terminology:'}
              <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                <li>{t.privacy.cognitiveActivity || 'Cognitive Activity: Stimulating puzzles rooted in regional culture.'}</li>
                <li>{t.privacy.engagementJoy || 'Engagement & Joy: Daily participation without clinical judgment.'}</li>
                <li>{t.privacy.memorySupport || 'Memory Support: Reminiscing about cherished family keepsakes.'}</li>
                <li>{t.privacy.routineAssistance || 'Routine Assistance: Soothing reminders for morning tea and walks.'}</li>
                <li>{t.privacy.wellnessSupport || 'Wellness Support: Promoting comfort, hydration, and family connection.'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Supabase PostgreSQL Row Level Security (RLS) */}
      <div className="mira-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Lock size={22} style={{ color: 'var(--primary-teal)' }} />
          <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem' }}>
            {t.privacy.rlsTitle || 'Row Level Security & Complete User Data Isolation'}
          </h3>
        </div>
        <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.55 }}>
          {t.privacy.rlsDesc || "In our PostgreSQL / Supabase architecture, every single table is protected by Row Level Security (RLS). A user can NEVER access another individual's:"}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {[
            t.privacy.itemMemories || 'Private Memory Items',
            t.privacy.itemRoutines || 'Daily Routine Schedules',
            t.privacy.itemActivities || 'Cognitive Activity Sessions',
            t.privacy.itemWellness || 'Mood & Wellness Check-ins',
            t.privacy.itemCaregiver || 'Caregiver Connections',
            t.privacy.itemProfiles || 'User Profiles & Names'
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={16} style={{ color: 'var(--primary-teal)' }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Granular Caregiver Consent */}
      <div className="mira-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Heart size={22} style={{ color: '#c2410c' }} />
          <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem' }}>
            Elderly Patient Sovereignty & Caregiver Consent
          </h3>
        </div>
        <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.55 }}>
          Caregiver access is never granted automatically. The elderly user maintains absolute control over what their caregiver can view through 5 explicit permission tiers:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div><strong>1. NONE:</strong> Total privacy. Caregiver sees zero personal records.</div>
          <div><strong>2. BASIC_ACTIVITY:</strong> Caregiver sees only game scores and activity completion.</div>
          <div><strong>3. ROUTINES:</strong> Caregiver can view and assist with daily morning tea, walks, and medications.</div>
          <div><strong>4. INSIGHTS:</strong> Caregiver views weekly engagement trends and mood check-ins.</div>
          <div><strong>5. FULL_SHARED_DATA:</strong> Caregiver views memories, routines, and progress.</div>
        </div>
      </div>

      {/* 4. Google Gemini AI Zero Key Exposure */}
      <div className="mira-card" style={{ padding: '1.75rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Shield size={22} style={{ color: 'var(--primary-teal)' }} />
          <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem' }}>
            Secure AI Architecture: Zero Key Exposure
          </h3>
        </div>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.55 }}>
          The Google Gemini API key (<code style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '6px' }}>GEMINI_API_KEY</code>) is stored strictly in server-side environment variables and is never exposed in client source code, network bundles, or localStorage. In addition, an offline intelligent companion engine provides uninterrupted, resilient local service during network drops.
        </p>
      </div>
    </div>
  );
}
