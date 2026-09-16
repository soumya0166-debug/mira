import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Heart, Languages, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n/translations';
import audioService from '../../services/audioService';

export default function OnboardingView({ onComplete }) {
  const { switchLanguage, language, patient, updatePatient } = useApp();
  const [step, setStep] = useState(1);
  const [preferredName, setPreferredName] = useState(patient?.preferredName || 'Radha Dadi');
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'as');
  const [caregiverEmail, setCaregiverEmail] = useState('ananya@mira.care');
  const [favoriteInterest, setFavoriteInterest] = useState('tea'); // tea, weaving, hills, music

  const handleNextStep = () => {
    if (step < 3) {
      setStep(s => s + 1);
      audioService.playSoftClick();
    } else {
      // Complete onboarding
      switchLanguage(selectedLanguage);
      if (updatePatient) {
        updatePatient({
          preferredName
        });
      }
      audioService.playSuccessChime();
      if (onComplete) onComplete();
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div
        className="mira-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: '40px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: s <= step ? 'var(--primary-teal)' : '#e2e8f0',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>

        {/* Step 1: Name and Language */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🌸</span>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', color: 'var(--text-main)' }}>
                Welcome to MIND AI – NER
              </h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                How would you like your assistant MIRA to address you?
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Your Name or Preferred Title
              </label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="e.g., Radha Dadi / Bor-Aai"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '1.1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Select Your Comfortable Language
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {LANGUAGES.slice(0, 6).map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.code)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? '#f0fdf4' : 'var(--card-bg)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <strong style={{ display: 'block', color: isSelected ? 'var(--primary-teal)' : 'var(--text-main)' }}>
                        {lang.native}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Family Caregiver Connection */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🤝</span>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', color: 'var(--text-main)' }}>
                Connect a Family Caregiver
              </h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                You can invite a daughter, son, or guardian to stay connected with your daily care.
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Caregiver Email or Phone
              </label>
              <input
                type="text"
                value={caregiverEmail}
                onChange={(e) => setCaregiverEmail(e.target.value)}
                placeholder="e.g., ananya@mira.care"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '1.1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '2rem',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5
              }}
            >
              🔒 <strong>Your Privacy is Guaranteed:</strong> You choose the permission level (NONE to FULL_SHARED_DATA) anytime in your Caregiver Consent portal.
            </div>
          </div>
        )}

        {/* Step 3: Favorite Keepsakes & Interests */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🍃</span>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', color: 'var(--text-main)' }}>
                What Brings You Peace?
              </h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                We personalize your cognitive games and stories to your passions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { id: 'tea', icon: '🫖', title: 'Assam Tea & Gardens', desc: 'Peaceful morning cups and garden walks' },
                { id: 'weaving', icon: '🧵', title: 'Handlooms & Weaves', desc: 'Eri silk, Gamosa, and Phanek patterns' },
                { id: 'music', icon: '🥁', title: 'Folk Rhythms & Flute', desc: 'Bihu dhol, borgeet, and hill melodies' },
                { id: 'hills', icon: '🏔️', title: 'Rivers & Monasteries', desc: 'Brahmaputra dawns and misty peaks' }
              ].map((item) => {
                const isSelected = favoriteInterest === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFavoriteInterest(item.id)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '18px',
                      border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? '#f0fdf4' : 'var(--card-bg)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.35rem' }}>{item.icon}</span>
                    <strong style={{ display: 'block', fontSize: '1rem', color: isSelected ? 'var(--primary-teal)' : 'var(--text-main)' }}>
                      {item.title}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleNextStep}
          className="mira-btn-primary"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.1rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span>{step === 3 ? 'Enter MIND AI Platform' : 'Continue'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
