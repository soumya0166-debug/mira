import React from 'react';
import { Shield, Brain, Heart, ArrowRight, Sparkles, Volume2, Users, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LandingView({ onGetStarted, onLogin }) {
  const { t, switchLanguage, preferredLanguage } = useApp();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Top Government Banner */}
      <div
        style={{
          backgroundColor: '#0e4a42',
          color: '#f0fdf4',
          padding: '0.6rem 1.5rem',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
          <span>🇮🇳</span>
          <span>MIRA NER • Digital Health & Cognitive Wellness</span>
          <span style={{ opacity: 0.7 }}>|</span>
          <span>Ministry of Development of North Eastern Region (MDoNER)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ backgroundColor: '#137a6b', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
            Elderly Wellness & Memory Support
          </span>
        </div>
      </div>

      {/* Navigation Header */}
      <header
        style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-teal)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800
            }}
          >
            🌿
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              MIND AI – NER
            </h1>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Cognitive Engagement & Memory Platform
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={onLogin}
            className="mira-btn-secondary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.95rem' }}
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="mira-btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.95rem' }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Mandatory Non-Medical Product Principle Banner */}
      <div
        style={{
          backgroundColor: '#fef3c7',
          borderBottom: '1px solid #fde68a',
          padding: '0.85rem 1.5rem',
          textAlign: 'center',
          color: '#92400e',
          fontSize: '0.9rem',
          fontWeight: 600
        }}
      >
        <span>⚠️ <strong>IMPORTANT PRODUCT PRINCIPLE:</strong> MIND AI is a wellness, cognitive engagement, and memory support platform. It is <strong>NOT</strong> a medical diagnosis application and does not replace professional doctors or clinical assessment.</span>
      </div>

      {/* Hero Section */}
      <section style={{ padding: '4rem 1.5rem 3rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0'
          }}
        >
          <Sparkles size={16} />
          <span>Culturally Rooted in Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal & Sikkim</span>
        </div>

        <h2 style={{ fontSize: '2.75rem', lineHeight: 1.2, color: 'var(--text-main)', margin: '0 0 1.25rem', fontWeight: 800 }}>
          Gentle Cognitive Engagement & Memory Assistance for Elders in North East India
        </h2>

        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '780px', margin: '0 auto 2.25rem' }}>
          An elderly-first AI companion featuring 8 cultural cognitive games, private memory storage, daily routine assistance, and multilingual voice interaction in 10 North Eastern languages.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            className="mira-btn-primary"
            style={{
              padding: '0.9rem 2rem',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              borderRadius: '16px'
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={20} />
          </button>
          <button
            onClick={onLogin}
            className="mira-btn-secondary"
            style={{
              padding: '0.9rem 1.75rem',
              fontSize: '1.1rem',
              borderRadius: '16px'
            }}
          >
            Caregiver Portal
          </button>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section style={{ padding: '3rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              icon: '🦏',
              title: '8 Cultural Cognitive Games',
              desc: 'From Kaziranga Rhino matching to Bihu drum sequence recall, each game dynamically adapts between Easy, Medium, and Hard.'
            },
            {
              icon: '🌿',
              title: 'MIRA AI Voice Companion',
              desc: 'Calm, short-sentence AI assistant querying only your private memories, routine schedules, and medication reminders.'
            },
            {
              icon: '🔒',
              title: 'Private Memory Vault & RLS',
              desc: 'Store cherished family photographs, voice recordings, and ancestral landmarks with strict Row Level Security.'
            },
            {
              icon: '🤝',
              title: 'Granular Caregiver Consent',
              desc: 'Elderly patients retain complete sovereignty with 5 explicit permission tiers (NONE to FULL_SHARED_DATA).'
            },
            {
              icon: '🗣️',
              title: '10 Regional Languages',
              desc: 'Native translation architecture supporting Assamese, Bengali, Bodo, Meitei, Khasi, Mizo, Garo, Kokborok, Nagamese, and English.'
            },
            {
              icon: '🛡️',
              title: 'Zero API Key Leakage',
              desc: 'Secure backend proxy architecture keeping Google Gemini API keys isolated on the server with resilient offline capability.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="mira-card"
              style={{
                padding: '1.75rem',
                borderRadius: '20px',
                backgroundColor: 'var(--card-bg)'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stakeholders & Wellness Initiative Section */}
      <section style={{ padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: '0 0 0.75rem' }}>
            Built for Senior Wellness & Caregivers • MDoNER Initiative
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Providing accessible, high-contrast, low-cognitive-load digital wellness infrastructure for senior citizens and family caregivers across the North Eastern Region.
          </p>
          <button onClick={onGetStarted} className="mira-btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            Create Your Account
          </button>
        </div>
      </section>
    </div>
  );
}
