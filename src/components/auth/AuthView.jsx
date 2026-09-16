import React, { useState } from 'react';
import {
  HeartHandshake,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  ShieldCheck,
  WifiOff,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ─── Demo Account Quick-Login Cards ─────────────────────────────────────────
const DEMO_CARDS = [
  {
    userId: 'user_ananya',
    name: 'Ananya Sharma',
    role: 'Guardian (Daughter)',
    avatar: '👩‍💼',
    loved: 'Radha Dadi',
    memories: 4,
    hint: 'PIN: 1234',
    gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
    border: '#f48fb1'
  },
  {
    userId: 'user_vikram',
    name: 'Dr. Vikram Patel',
    role: 'Guardian (Son)',
    avatar: '👨‍⚕️',
    loved: 'Bapuji',
    memories: 3,
    hint: 'PIN: 1234',
    gradient: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
    border: '#9fa8da'
  }
];

// ─── Shared input style ───────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem 0.65rem 2.6rem',
  borderRadius: '12px',
  border: '1.5px solid var(--ivory-border)',
  fontSize: '1rem',
  color: 'var(--text-main)',
  backgroundColor: 'var(--ivory-soft)',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '0.35rem',
  letterSpacing: '0.04em',
  textTransform: 'uppercase'
};

function InputGroup({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon
          size={16}
          style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--wine-600)',
            pointerEvents: 'none'
          }}
        />
        <input style={inputStyle} {...props} />
      </div>
    </div>
  );
}

// ─── Main Auth View ──────────────────────────────────────────────────────────
export default function AuthView() {
  const { login, loginById, register, isOnline } = useApp();

  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoadingId, setQuickLoadingId] = useState(null);

  // Sign-in form state
  const [signinEmail, setSigninEmail] = useState('');
  const [signinCredential, setSigninCredential] = useState('');

  // Sign-up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupLovedName, setSignupLovedName] = useState('');
  const [signupLovedHometown, setSignupLovedHometown] = useState('');
  const [signupLovedHobbies, setSignupLovedHobbies] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    if (!signinEmail.trim() || !signinCredential.trim()) {
      setError('Please enter your email and PIN or password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(signinEmail, signinCredential);
      if (!result.success) setError(result.error);
      setLoading(false);
    }, 400);
  };

  const handleQuickLogin = (userId) => {
    setError('');
    const email = userId === 'user_ananya' ? 'ananya.sharma@example.com' : 'vikram.patel@example.com';
    setSigninEmail(email);
    setSigninCredential('1234');
    setQuickLoadingId(userId);
    setTimeout(() => {
      const res = loginById(userId);
      if (!res?.success) {
        setError(res?.error || 'Failed to sign in. Please try again.');
      }
      setQuickLoadingId(null);
    }, 250);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    if (!signupName.trim()) { setError('Please enter your full name.'); return; }
    if (!signupEmail.trim()) { setError('Please enter your email address.'); return; }
    if (!signupPw && !signupPin) { setError('Please enter either a password or a 4-digit PIN.'); return; }
    if (signupPin && !/^\d{4}$/.test(signupPin)) { setError('PIN must be exactly 4 digits.'); return; }

    const patientProfile = signupLovedName.trim() ? {
      id: 'pat-' + Date.now(),
      name: signupLovedName.trim(),
      preferredName: signupLovedName.trim(),
      birthYear: '',
      age: '',
      avatar: '👵',
      hobbies: signupLovedHobbies.trim(),
      childhoodHometown: signupLovedHometown.trim(),
      emergencyContact: { name: '', phone: '', relationship: '' },
      doctorInfo: { name: '', clinic: '', phone: '' },
      notes: ''
    } : null;

    setLoading(true);
    setTimeout(() => {
      const result = register(
        {
          name: signupName.trim(),
          email: signupEmail.trim(),
          password: signupPw || null,
          pin: signupPin || null,
          role: 'guardian',
          lovedOneName: signupLovedName.trim(),
          avatar: '🧑'
        },
        patientProfile
      );
      if (!result.success) setError(result.error);
      setLoading(false);
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #fff0f3 0%, #fce4ec 40%, #ede7f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '68px',
              height: '68px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, var(--wine-700) 0%, var(--wine-900) 100%)',
              boxShadow: '0 8px 24px rgba(107, 29, 47, 0.35)',
              marginBottom: '1rem'
            }}
          >
            <HeartHandshake size={32} style={{ color: '#fbc6d5' }} />
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--wine-800)',
              margin: 0
            }}
          >
            MIRA NER
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
            Memory Intelligence &amp; Reminiscence Assistant
          </p>
          {/* Offline badge */}
          {!isOnline && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginTop: '0.6rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#eff6ff',
                border: '1px solid #93c5fd',
                color: '#1d4ed8',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <WifiOff size={13} /> Offline Mode — Data stays local &amp; private
            </div>
          )}
        </div>

        {/* Quick Demo Login Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}
        >
          {DEMO_CARDS.map((card) => (
            <button
              key={card.userId}
              onClick={() => handleQuickLogin(card.userId)}
              disabled={!!quickLoadingId}
              style={{
                background: card.gradient,
                border: `1.5px solid ${card.border}`,
                borderRadius: '16px',
                padding: '1rem',
                textAlign: 'left',
                cursor: quickLoadingId ? 'wait' : 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                opacity: quickLoadingId === card.userId ? 0.7 : 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '1.8rem', lineHeight: 1, marginBottom: '0.4rem' }}>
                {quickLoadingId === card.userId ? '⏳' : card.avatar}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--wine-900)', lineHeight: 1.2 }}>
                {card.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {card.role}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  marginTop: '0.5rem',
                  fontSize: '0.72rem',
                  color: 'var(--wine-700)',
                  fontWeight: 600
                }}
              >
                <Sparkles size={11} />
                For: {card.loved} · {card.memories} memories
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {card.hint}
              </div>
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            color: 'var(--text-muted)',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--ivory-border)' }} />
          <span>or sign in to your account</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--ivory-border)' }} />
        </div>

        {/* Tab Bar */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--ivory-soft)',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '1.5rem',
            border: '1px solid var(--ivory-border)'
          }}
        >
          {[
            { key: 'signin', label: 'Sign In', icon: LogIn },
            { key: 'signup', label: 'Create Account', icon: UserPlus }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setError(''); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '11px',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                backgroundColor: tab === key ? '#ffffff' : 'transparent',
                color: tab === key ? 'var(--wine-800)' : 'var(--text-muted)',
                boxShadow: tab === key ? '0 2px 8px rgba(107,29,47,0.10)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid var(--ivory-border)',
            boxShadow: '0 8px 32px rgba(107,29,47,0.10)',
            padding: '1.75rem'
          }}
        >
          {/* Error */}
          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                color: '#dc2626',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* ── Sign In Tab ── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ marginBottom: '0.25rem' }}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.35rem',
                    color: 'var(--wine-800)',
                    margin: 0
                  }}
                >
                  Welcome back 👋
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                  Sign in to continue caring for your loved one.
                </p>
              </div>

              <InputGroup
                icon={Mail}
                label="Email Address or Name"
                type="text"
                placeholder="ananya.sharma@example.com"
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                autoComplete="username"
                required
              />

              <div>
                <label style={labelStyle}>Password or 4-Digit PIN</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--wine-600)',
                      pointerEvents: 'none'
                    }}
                  />
                  <input
                    style={inputStyle}
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter PIN or password"
                    value={signinCredential}
                    onChange={(e) => setSigninCredential(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
              >
                {loading ? (
                  'Signing in…'
                ) : (
                  <>
                    <LogIn size={17} /> Sign In
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                No account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('signup'); setError(''); }}
                  style={{ color: 'var(--wine-700)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Create one free →
                </button>
              </p>
            </form>
          )}

          {/* ── Sign Up Tab ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ marginBottom: '0.25rem' }}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.35rem',
                    color: 'var(--wine-800)',
                    margin: 0
                  }}
                >
                  Create your free account
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                  Start your loved one's personalised care memory vault.
                </p>
              </div>

              {/* Guardian Section */}
              <div
                style={{
                  padding: '0.85rem',
                  background: 'var(--pink-50)',
                  borderRadius: '12px',
                  border: '1px solid var(--pink-200)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--wine-700)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  👩‍💼 Your Guardian / Caregiver Account
                </p>
                <InputGroup
                  icon={User}
                  label="Your Full Name"
                  type="text"
                  placeholder="e.g. Priya Kapoor"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
                <InputGroup
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  placeholder="priya@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Password <span style={{ fontWeight: 400 }}>(optional)</span></label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--wine-600)', pointerEvents: 'none' }} />
                      <input
                        style={inputStyle}
                        type={showPw ? 'text' : 'password'}
                        placeholder="Password"
                        value={signupPw}
                        onChange={(e) => setSignupPw(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>4-Digit PIN <span style={{ fontWeight: 400 }}>(easy login)</span></label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--wine-600)', pointerEvents: 'none' }} />
                      <input
                        style={inputStyle}
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="1234"
                        value={signupPin}
                        onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Section (Optional) */}
              <div
                style={{
                  padding: '0.85rem',
                  background: 'var(--ivory-soft)',
                  borderRadius: '12px',
                  border: '1px solid var(--ivory-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--wine-700)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  👵 Your Loved One's Profile <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--text-muted)' }}>(optional — can add later)</span>
                </p>
                <InputGroup
                  icon={User}
                  label="Elder's Full Name"
                  type="text"
                  placeholder="e.g. Kamla Devi"
                  value={signupLovedName}
                  onChange={(e) => setSignupLovedName(e.target.value)}
                />
                <InputGroup
                  icon={User}
                  label="Childhood Hometown"
                  type="text"
                  placeholder="e.g. Varanasi & Allahabad"
                  value={signupLovedHometown}
                  onChange={(e) => setSignupLovedHometown(e.target.value)}
                />
                <InputGroup
                  icon={Sparkles}
                  label="Favourite Comforting Topics"
                  type="text"
                  placeholder="e.g. Classical music, gardening, cooking"
                  value={signupLovedHobbies}
                  onChange={(e) => setSignupLovedHobbies(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? (
                  'Creating account…'
                ) : (
                  <>
                    <UserPlus size={17} /> Create Account <ArrowRight size={15} />
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('signin'); setError(''); }}
                  style={{ color: 'var(--wine-700)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Sign In →
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Privacy reassurance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1.25rem',
            color: 'var(--text-muted)',
            fontSize: '0.78rem'
          }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--wine-600)' }} />
          All data is stored privately on this device. No servers. No tracking.
        </div>
      </div>
    </div>
  );
}
