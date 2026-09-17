import React, { useState, useEffect, useRef } from 'react';
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
  User,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
export default function AuthView({ initialTab = 'signin' }) {
  const {
    login,
    register,
    generateAndSendOtp,
    verifyOtp,
    loginWithOtp,
    isOnline
  } = useApp();

  const [tab, setTab] = useState(initialTab); // 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('form'); // 'form' | 'otp_verify' | 'forgot_otp'
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign-in form state
  const [signinEmail, setSigninEmail] = useState('');
  const [signinCredential, setSigninCredential] = useState('');

  // Sign-up form state
  const [signupRole, setSignupRole] = useState('patient'); // 'patient' | 'guardian'
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupLovedName, setSignupLovedName] = useState('');
  const [signupLovedHometown, setSignupLovedHometown] = useState('');
  const [signupLovedHobbies, setSignupLovedHobbies] = useState('');

  // OTP Verification state
  const [pendingSignupData, setPendingSignupData] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [activeNotification, setActiveNotification] = useState(null);

  const otpInputRefs = useRef([]);

  // Sync tab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
      setAuthMode('form');
      setError('');
    }
  }, [initialTab]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if ((authMode === 'otp_verify' || authMode === 'forgot_otp') && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authMode, otpTimer]);

  // ── Handle Sign In ────────────────────────────────────────────────────────
  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!signinEmail.trim() || !signinCredential.trim()) {
      setError('Please enter your email and password or 4-digit PIN.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(signinEmail.trim(), signinCredential.trim());
      if (!result.success) {
        setError(result.error);
      }
      setLoading(false);
    }, 350);
  };

  // ── Handle Sign Up (Initiates OTP Verification) ─────────────────────────────
  const handleSignUpInit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedName = signupName.trim();
    const trimmedEmail = signupEmail.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!signupPw && !signupPin) {
      setError('Please provide either a password or a 4-digit PIN for account security.');
      return;
    }
    if (signupPin && !/^\d{4}$/.test(signupPin)) {
      setError('PIN must be exactly 4 digits.');
      return;
    }

    let patientProfile = null;
    let userData = null;

    if (signupRole === 'patient') {
      patientProfile = {
        id: 'pat-' + Date.now(),
        name: trimmedName,
        preferredName: trimmedName,
        birthYear: '',
        age: '',
        avatar: '👵',
        hobbies: signupLovedHobbies.trim(),
        childhoodHometown: signupLovedHometown.trim(),
        emergencyContact: { name: '', phone: '', relationship: '' },
        doctorInfo: { name: '', clinic: '', phone: '' },
        notes: ''
      };

      userData = {
        name: trimmedName,
        email: trimmedEmail,
        password: signupPw || null,
        pin: signupPin || null,
        role: 'patient',
        avatar: '👵'
      };
    } else {
      patientProfile = signupLovedName.trim()
        ? {
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
          }
        : null;

      userData = {
        name: trimmedName,
        email: trimmedEmail,
        password: signupPw || null,
        pin: signupPin || null,
        role: 'guardian',
        lovedOneName: signupLovedName.trim(),
        avatar: '🧑'
      };
    }

    setLoading(true);

    setTimeout(() => {
      // Generate & send OTP
      const otpResult = generateAndSendOtp(trimmedEmail);
      if (!otpResult.success) {
        setError(otpResult.error);
        setLoading(false);
        return;
      }

      setPendingSignupData({ userData, patientProfile });
      setGeneratedOtp(otpResult.otp);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimer(30);
      setAuthMode('otp_verify');
      setLoading(false);

      // Show real-time verification alert notification banner
      setActiveNotification({
        code: otpResult.otp,
        email: trimmedEmail,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 300);
  };

  // ── Handle OTP Digit Input ────────────────────────────────────────────────
  const handleOtpDigitChange = (index, value) => {
    // Only accept digits
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // Handle paste of whole OTP code (up to 6 digits)
      const pasted = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      if (otpInputRefs.current[nextFocus]) {
        otpInputRefs.current[nextFocus].focus();
      }
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto-advance focus
    if (cleaned && index < 5) {
      if (otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (otpInputRefs.current[index - 1]) {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOtp = () => {
    if (otpTimer > 0) return;
    setError('');
    const targetEmail =
      authMode === 'otp_verify' ? pendingSignupData?.userData?.email : signinEmail;

    if (!targetEmail) {
      setError('Email address is missing.');
      return;
    }

    const res = generateAndSendOtp(targetEmail);
    if (res.success) {
      setGeneratedOtp(res.otp);
      setOtpTimer(30);
      setOtpDigits(['', '', '', '', '', '']);
      setActiveNotification({
        code: res.otp,
        email: targetEmail,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setSuccessMsg('A new verification code has been sent!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setError(res.error || 'Failed to resend code.');
    }
  };

  // ── Verify OTP & Finalize Registration ─────────────────────────────────────
  const handleVerifyAndCompleteSignup = (e) => {
    e.preventDefault();
    setError('');
    const enteredCode = otpDigits.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const email = pendingSignupData?.userData?.email;
      const verifyResult = verifyOtp(email, enteredCode);

      if (!verifyResult.success) {
        setError(verifyResult.error || 'Invalid verification code. Please check and try again.');
        setLoading(false);
        return;
      }

      // Registration
      const regResult = register(
        pendingSignupData.userData,
        pendingSignupData.patientProfile
      );

      if (!regResult.success) {
        setError(regResult.error || 'Registration failed. Please try again.');
        setLoading(false);
      } else {
        setSuccessMsg('Account verified successfully! Welcome to MIRA.');
        setLoading(false);
      }
    }, 400);
  };

  // ── Handle Sign In with OTP (Forgot PIN / OTP Login) ───────────────────────
  const handleInitiateOtpLogin = () => {
    setError('');
    setSuccessMsg('');
    const targetEmail = signinEmail.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please enter your registered email address first.');
      return;
    }
    const res = generateAndSendOtp(targetEmail);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setGeneratedOtp(res.otp);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpTimer(30);
    setAuthMode('forgot_otp');
    setActiveNotification({
      code: res.otp,
      email: targetEmail,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleVerifyOtpLogin = (e) => {
    e.preventDefault();
    setError('');
    const enteredCode = otpDigits.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = loginWithOtp(signinEmail.trim(), enteredCode);
      if (!result.success) {
        setError(result.error);
      }
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
        padding: '1.5rem 1rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--wine-700) 0%, var(--wine-900) 100%)',
              boxShadow: '0 8px 24px rgba(107, 29, 47, 0.28)',
              marginBottom: '0.85rem'
            }}
          >
            <HeartHandshake size={32} style={{ color: '#fbc6d5' }} />
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.9rem',
              fontWeight: 700,
              color: 'var(--wine-800)',
              margin: 0
            }}
          >
            MIRA NER
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            Memory Intelligence &amp; Reminiscence Assistant
          </p>
          {!isOnline && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginTop: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#eff6ff',
                border: '1px solid #93c5fd',
                color: '#1d4ed8',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              <WifiOff size={13} /> Offline Mode — Local &amp; Private Vault
            </div>
          )}
        </div>

        {/* Tab Navigation (only when on form view) */}
        {authMode === 'form' && (
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--ivory-soft)',
              borderRadius: '14px',
              padding: '4px',
              marginBottom: '1.25rem',
              border: '1px solid var(--ivory-border)'
            }}
          >
            {[
              { key: 'signin', label: 'Sign In', icon: LogIn },
              { key: 'signup', label: 'Create Account', icon: UserPlus }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setTab(key);
                  setError('');
                  setSuccessMsg('');
                  setActiveNotification(null);
                }}
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
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Real-time Verification Alert Notification Simulation */}
        {activeNotification && (
          <div
            style={{
              backgroundColor: '#064e3b',
              color: '#f0fdf4',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              marginBottom: '1rem',
              boxShadow: '0 6px 20px rgba(6, 78, 59, 0.25)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              animation: 'fadeIn 0.3s ease-out',
              border: '1px solid #059669'
            }}
          >
            <div
              style={{
                backgroundColor: '#047857',
                borderRadius: '8px',
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} color="#a7f3d0" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a7f3d0', fontWeight: 700 }}>
                  Verification Code (OTP)
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{activeNotification.time}</span>
              </div>
              <div style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>
                Sent to <strong>{activeNotification.email}</strong>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#ffffff',
                  color: '#064e3b',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '0.25em',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '8px',
                  marginTop: '0.5rem',
                  fontFamily: 'monospace'
                }}
              >
                {activeNotification.code}
              </div>
            </div>
          </div>
        )}

        {/* Main Card Container */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid var(--ivory-border)',
            boxShadow: '0 8px 32px rgba(107,29,47,0.10)',
            padding: '1.75rem'
          }}
        >
          {/* Alerts */}
          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                color: '#dc2626',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                color: '#047857',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={16} />
              {successMsg}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              VIEW 1: SIGN IN FORM
             ═════════════════════════════════════════════════════════════════════ */}
          {authMode === 'form' && tab === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
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
                  Sign in to your private elder care vault.
                </p>
              </div>

              <InputGroup
                icon={Mail}
                label="Email Address or Name"
                type="text"
                placeholder="name@example.com"
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                autoComplete="username"
                required
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={labelStyle}>Password or 4-Digit PIN</label>
                  <button
                    type="button"
                    onClick={handleInitiateOtpLogin}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--wine-700)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      marginBottom: '0.35rem'
                    }}
                  >
                    Sign in with OTP?
                  </button>
                </div>
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
                    placeholder="Enter password or PIN"
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
                {loading ? 'Signing in…' : <><LogIn size={17} /> Sign In</>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Don't have an account?{' '}
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

          {/* ═════════════════════════════════════════════════════════════════════
              VIEW 2: SIGN UP FORM (INITIATES VERIFICATION)
             ═════════════════════════════════════════════════════════════════════ */}
          {authMode === 'form' && tab === 'signup' && (
            <form onSubmit={handleSignUpInit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
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
                  A verification code will be sent to your email to verify your identity.
                </p>
              </div>

              {/* Account Role Selector */}
              <div>
                <label style={labelStyle}>I Am Creating An Account For</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setSignupRole('patient')}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      border: signupRole === 'patient' ? '2px solid #059669' : '1px solid var(--ivory-border)',
                      backgroundColor: signupRole === 'patient' ? '#ecfdf5' : '#ffffff',
                      color: signupRole === 'patient' ? '#065f46' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>👵</span>
                    <span>Elderly Patient</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>Self-care & games</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('guardian')}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      border: signupRole === 'guardian' ? '2px solid var(--wine-700)' : '1px solid var(--ivory-border)',
                      backgroundColor: signupRole === 'guardian' ? 'var(--pink-50)' : '#ffffff',
                      color: signupRole === 'guardian' ? 'var(--wine-900)' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>🛡️</span>
                    <span>Family Caregiver</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>Monitoring & trends</span>
                  </button>
                </div>
              </div>

              {/* Account Credentials Section */}
              <div
                style={{
                  padding: '0.85rem',
                  background: signupRole === 'patient' ? '#f0fdf4' : 'var(--pink-50)',
                  borderRadius: '12px',
                  border: signupRole === 'patient' ? '1px solid #bbf7d0' : '1px solid var(--pink-200)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: signupRole === 'patient' ? '#166534' : 'var(--wine-700)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {signupRole === 'patient' ? '👵 Patient Profile' : '👩‍💼 Guardian / Caregiver Profile'}
                </p>
                <InputGroup
                  icon={User}
                  label={signupRole === 'patient' ? 'Your Full Name' : 'Caregiver Full Name'}
                  type="text"
                  placeholder={signupRole === 'patient' ? 'e.g. Radha Barua' : 'e.g. Dr. Ananya Barua'}
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
                <InputGroup
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  placeholder={signupRole === 'patient' ? 'radha@example.org' : 'ananya@example.org'}
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
                    <label style={labelStyle}>4-Digit PIN <span style={{ fontWeight: 400 }}>(quick login)</span></label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--wine-600)', pointerEvents: 'none' }} />
                      <input
                        style={inputStyle}
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="4-digit PIN"
                        value={signupPin}
                        onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Profile Section (Optional for Guardian, Roots for Patient) */}
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
                  {signupRole === 'patient'
                    ? '🌿 Personal Familiar Roots (Optional)'
                    : '👵 Loved One\'s Profile (Optional)'}
                </p>
                {signupRole === 'guardian' && (
                  <InputGroup
                    icon={User}
                    label="Elder's Name"
                    type="text"
                    placeholder="e.g. Radha Barua"
                    value={signupLovedName}
                    onChange={(e) => setSignupLovedName(e.target.value)}
                  />
                )}
                <InputGroup
                  icon={User}
                  label="Childhood Hometown / Village"
                  type="text"
                  placeholder="e.g. Guwahati / Jorhat / Shillong"
                  value={signupLovedHometown}
                  onChange={(e) => setSignupLovedHometown(e.target.value)}
                />
                <InputGroup
                  icon={Sparkles}
                  label="Favourite Activities / Music"
                  type="text"
                  placeholder="e.g. Bihu songs, gardening, tea"
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
                {loading ? 'Sending verification code…' : <>Continue to Verification <ArrowRight size={16} /></>}
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

          {/* ═════════════════════════════════════════════════════════════════════
              VIEW 3: OTP VERIFICATION SCREEN (FOR SIGNUP & FORGOT PIN)
             ═════════════════════════════════════════════════════════════════════ */}
          {(authMode === 'otp_verify' || authMode === 'forgot_otp') && (
            <form
              onSubmit={authMode === 'otp_verify' ? handleVerifyAndCompleteSignup : handleVerifyOtpLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: '#fce4ec',
                    color: 'var(--wine-800)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem'
                  }}
                >
                  <KeyRound size={26} />
                </div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.35rem',
                    color: 'var(--wine-800)',
                    margin: 0
                  }}
                >
                  {authMode === 'otp_verify' ? 'Verify Your Email' : 'Sign In with Verification Code'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  Enter the 6-digit security code sent to:
                  <br />
                  <strong style={{ color: 'var(--wine-900)' }}>
                    {authMode === 'otp_verify' ? pendingSignupData?.userData?.email : signinEmail}
                  </strong>
                </p>
              </div>

              {/* Segmented 6-digit OTP Input */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e.target.value)}
                    style={{
                      width: '46px',
                      height: '52px',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      border: digit ? '2px solid var(--wine-700)' : '1.5px solid var(--ivory-border)',
                      backgroundColor: digit ? '#fff5f7' : 'var(--ivory-soft)',
                      color: 'var(--wine-900)',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={loading || otpDigits.join('').length !== 6}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading
                    ? 'Verifying…'
                    : authMode === 'otp_verify'
                    ? 'Verify & Complete Account Creation'
                    : 'Verify & Sign In'}
                </button>

                {/* Resend button & timer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('form');
                      setError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    ← Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpTimer > 0}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: otpTimer > 0 ? 'var(--text-muted)' : 'var(--wine-700)',
                      fontWeight: 600,
                      cursor: otpTimer > 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: 0
                    }}
                  >
                    <RotateCcw size={13} />
                    {otpTimer > 0 ? `Resend code in ${otpTimer}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Privacy reassurance footer */}
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
          Zero external tracking. Personal memory data is stored privately on your device.
        </div>
      </div>
    </div>
  );
}
