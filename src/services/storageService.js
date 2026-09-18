/**
 * Storage Service for MIRA NER
 * Multi-user vault architecture: each user's data is isolated under a namespaced key.
 * Offline-first: all data lives in localStorage. Passwords are hashed (simple SHA-256-like).
 *
 * Key Schema:
 *  mira_users              — JSON array of registered user objects
 *  mira_active_user_id     — ID of the currently signed-in user
 *  mira_u_<uid>_patient    — Patient profile for user <uid>
 *  mira_u_<uid>_guardian   — Guardian profile for user <uid>
 *  mira_u_<uid>_memories   — Memories array for user <uid>
 *  mira_u_<uid>_routines   — Routines array for user <uid>
 *  mira_u_<uid>_game_sessions — Game sessions for user <uid>
 *  mira_u_<uid>_care_notes — Care notes for user <uid>
 *  mira_u_<uid>_settings   — App settings for user <uid>
 */

import { indexedDBStorage } from '../offline/storage/indexedDBStorage.js';
import { syncQueue } from '../offline/sync/syncQueue.js';

// ─── Seed Images (royalty-free SVG Data URIs) ──────────────────────────────
const SEED_IMAGES = {
  shimla: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23fed7aa"/><stop offset="50%" stop-color="%23fbcfe8"/><stop offset="100%" stop-color="%2393c5fd"/></linearGradient><linearGradient id="mount" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23312e81"/><stop offset="100%" stop-color="%231e1b4b"/></linearGradient></defs><rect width="600" height="400" fill="url(%23sky)"/><circle cx="480" cy="110" r="40" fill="%23fef08a" opacity="0.85"/><polygon points="0,400 120,220 260,400" fill="url(%23mount)" opacity="0.9"/><polygon points="160,400 320,180 480,400" fill="url(%23mount)"/><polygon points="380,400 500,240 600,400" fill="url(%23mount)" opacity="0.85"/><rect y="350" width="600" height="50" fill="%2314532d"/><text x="300" y="380" font-family="sans-serif" font-size="20" fill="%23ffffff" text-anchor="middle" font-weight="bold">Family Holiday in Shimla • 1984</text></svg>`,
  garden: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fce7f3"/><stop offset="100%" stop-color="%23dcfce7"/></linearGradient></defs><rect width="600" height="400" fill="url(%23bg)"/><path d="M50 350 Q 150 150 250 350 T 450 350 T 600 350" fill="%2315803d" opacity="0.3"/><circle cx="150" cy="200" r="28" fill="%23ffffff"/><circle cx="150" cy="200" r="8" fill="%23facc15"/><circle cx="300" cy="170" r="32" fill="%23ffffff"/><circle cx="300" cy="170" r="9" fill="%23facc15"/><circle cx="450" cy="210" r="28" fill="%23ffffff"/><circle cx="450" cy="210" r="8" fill="%23facc15"/><text x="300" y="340" font-family="sans-serif" font-size="22" fill="%23166534" text-anchor="middle" font-weight="bold">Fresh Jasmine Harvest at Dawn</text></svg>`,
  graduation: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23fef3c7"/><stop offset="100%" stop-color="%23fde68a"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><polygon points="300,100 210,150 300,200 390,150" fill="%231e293b"/><polygon points="240,165 240,240 360,240 360,165" fill="%23334155"/><rect x="290" y="195" width="20" height="70" fill="%23dc2626"/><text x="300" y="340" font-family="sans-serif" font-size="22" fill="%2378350f" text-anchor="middle" font-weight="bold">Meera's College Graduation • 2018</text></svg>`,
  coffee: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fae8ff"/><stop offset="100%" stop-color="%23f3e8ff"/></linearGradient></defs><rect width="600" height="400" fill="url(%23c)"/><rect x="230" y="160" width="140" height="150" rx="18" fill="%2378350f"/><rect x="220" y="140" width="160" height="24" rx="8" fill="%2392400e"/><path d="M370 190 C420 190 420 270 370 270" fill="none" stroke="%2392400e" stroke-width="16" stroke-linecap="round"/><text x="300" y="360" font-family="sans-serif" font-size="22" fill="%23581c87" text-anchor="middle" font-weight="bold">Morning Classical Raga &amp; Filter Chai</text></svg>`,
  // Second user's seed images
  sabarmati: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23fde68a"/><stop offset="100%" stop-color="%23fed7aa"/></linearGradient></defs><rect width="600" height="400" fill="url(%23sky2)"/><rect x="0" y="300" width="600" height="100" fill="%2392400e" opacity="0.4"/><rect x="50" y="200" width="500" height="100" fill="%23f5f5dc" rx="4"/><rect x="120" y="220" width="40" height="80" fill="%2392400e" opacity="0.5"/><rect x="220" y="210" width="40" height="90" fill="%2392400e" opacity="0.5"/><rect x="320" y="225" width="40" height="75" fill="%2392400e" opacity="0.5"/><rect x="420" y="215" width="40" height="85" fill="%2392400e" opacity="0.5"/><circle cx="300" cy="120" r="35" fill="%23fbbf24"/><text x="300" y="380" font-family="sans-serif" font-size="20" fill="%2392400e" text-anchor="middle" font-weight="bold">Sabarmati Ashram Visit • 1978</text></svg>`,
  kite: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2338bdf8"/><stop offset="100%" stop-color="%23bae6fd"/></linearGradient></defs><rect width="600" height="400" fill="url(%23sky3)"/><polygon points="200,80 260,160 200,240 140,160" fill="%23ef4444"/><line x1="200" y1="240" x2="250" y2="350" stroke="%234b5563" stroke-width="2"/><polygon points="350,50 420,140 350,230 280,140" fill="%23f59e0b"/><line x1="350" y1="230" x2="300" y2="360" stroke="%234b5563" stroke-width="2"/><polygon points="460,100 510,170 460,240 410,170" fill="%2310b981"/><line x1="460" y1="240" x2="430" y2="360" stroke="%234b5563" stroke-width="2"/><text x="300" y="390" font-family="sans-serif" font-size="20" fill="%231e3a5f" text-anchor="middle" font-weight="bold">Uttarayan Kite Festival • Ahmedabad 1985</text></svg>`,
  sitar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="eve" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23312e81"/><stop offset="100%" stop-color="%236d28d9"/></linearGradient></defs><rect width="600" height="400" fill="url(%23eve)"/><ellipse cx="300" cy="290" rx="80" ry="70" fill="%23a16207"/><rect x="296" y="60" width="8" height="240" fill="%23a16207"/><rect x="280" y="80" width="40" height="10" rx="3" fill="%23854d0e"/><rect x="275" y="100" width="50" height="10" rx="3" fill="%23854d0e"/><circle cx="240" cy="320" r="6" fill="%23fef08a"/><circle cx="360" cy="310" r="5" fill="%23fef08a"/><circle cx="480" cy="130" r="25" fill="%23fef08a" opacity="0.3"/><text x="300" y="390" font-family="sans-serif" font-size="20" fill="%23fef08a" text-anchor="middle" font-weight="bold">Evening Sitar at the Riverside</text></svg>`
};
// ─── Simple Password Hashing (deterministic, client-side) ──────────────────
// NOT cryptographic — suitable only for local offline app.
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

// ─── OTP Verification Storage ────────────────────────────────────────────────
function getOtpKey(email) {
  return `mira_otp_${String(email || '').trim().toLowerCase()}`;
}

// ─── Default Seeding (Runs only when storage is completely empty) ───────────
function seedInitialDataIfEmpty() {
  try {
    if (typeof localStorage === 'undefined') return;

    const rawUsers = localStorage.getItem('mira_users');
    let users = [];
    try {
      users = rawUsers ? JSON.parse(rawUsers) : [];
    } catch {
      users = [];
    }

    if (users.length === 0) {
      const radhaUser = {
        id: 'usr-radha-1',
        name: 'Radha Barua',
        email: 'radha@mira.org',
        role: 'patient',
        avatar: '👵',
        lovedOneName: 'Self (Elderly Individual)',
        isVerified: true,
        emailVerifiedAt: '2026-01-01T00:00:00.000Z',
        pin: simpleHash('1234'),
        password: simpleHash('mira2026'),
        joinedAt: '2026-01-01T00:00:00.000Z'
      };

      const ananyaUser = {
        id: 'usr-ananya-2',
        name: 'Dr. Ananya Barua',
        email: 'ananya@mira.org',
        role: 'guardian',
        avatar: '👩‍⚕️',
        lovedOneName: 'Radha Barua (Mother)',
        isVerified: true,
        emailVerifiedAt: '2026-01-01T00:00:00.000Z',
        pin: simpleHash('1234'),
        password: simpleHash('mira2026'),
        joinedAt: '2026-01-01T00:00:00.000Z'
      };

      users = [radhaUser, ananyaUser];
      localStorage.setItem('mira_users', JSON.stringify(users));

      // ── Radha Patient Data ──
      const radhaPatient = {
        id: 'pat-usr-radha-1',
        name: 'Radha Barua',
        preferredName: 'Aita Radha',
        birthYear: '1950',
        age: '76',
        avatar: '👵',
        hobbies: 'Assam tea gardening, Bihu folk songs, weaving traditional Gamusa',
        childhoodHometown: 'Tezpur, Assam',
        emergencyContact: { name: 'Dr. Ananya Barua', phone: '+91 98765 43210', relationship: 'Daughter (Caregiver)' },
        doctorInfo: { name: 'Dr. B. C. Borah', clinic: 'Dispur Wellness & Geriatric Clinic', phone: '+91 94350 12345' },
        notes: 'Enjoys morning walks and listening to soothing Bihu flute music.'
      };

      const radhaGuardian = {
        id: 'guard-usr-radha-1',
        name: 'Dr. Ananya Barua',
        relation: 'Daughter & Primary Caregiver',
        phone: '+91 98765 43210',
        email: 'ananya@mira.org',
        notificationPreference: 'Immediate alert & daily digest',
        avatar: '👩‍⚕️'
      };

      const radhaMemories = [
        {
          id: 'mem-101',
          title: 'Family Holiday in Shimla',
          year: '1984',
          category: 'Travel & Family',
          relationshipLabel: 'Family & Children',
          story: 'Our cherished summer holiday in the rolling hills of Shimla. The cool breeze and mountain toy train brought endless laughter.',
          questionPrompt: 'Do you remember the warm roasted corn we shared near the ridge?',
          image: SEED_IMAGES.shimla,
          hasAudio: false,
          audioNote: null,
          tags: ['Travel & Family', 'Shimla'],
          reactions: [{ emoji: '😊', label: 'Brought a smile', date: 'Yesterday' }]
        },
        {
          id: 'mem-102',
          title: 'Fresh Jasmine Harvest at Dawn',
          year: '1992',
          category: 'Home & Nature',
          relationshipLabel: 'Home Courtyard',
          story: 'Gathering white jasmine flowers in our courtyard every morning before temple prayer in Tezpur.',
          questionPrompt: 'Can you still smell the fragrant morning jasmine?',
          image: SEED_IMAGES.garden,
          hasAudio: false,
          audioNote: null,
          tags: ['Home & Nature', 'Flowers'],
          reactions: [{ emoji: '🌸', label: 'Peaceful memory', date: '2 days ago' }]
        },
        {
          id: 'mem-103',
          title: "Ananya's Medical College Graduation",
          year: '2010',
          category: 'Milestones',
          relationshipLabel: 'Daughter (Ananya)',
          story: 'Proudest day for our family when Ananya received her medical degree at Gauhati Medical College.',
          questionPrompt: 'Remember how proud we all felt seeing her in her black gown?',
          image: SEED_IMAGES.graduation,
          hasAudio: false,
          audioNote: null,
          tags: ['Milestones', 'Daughter'],
          reactions: [{ emoji: '❤️', label: 'Felt comforted', date: '3 days ago' }]
        }
      ];

      const radhaRoutines = [
        { id: 'rout-1', title: 'Morning Assam Tea & Warm Water', time: '08:00 AM', category: 'Nutrition', completedToday: true, completedAt: '08:15 AM' },
        { id: 'rout-2', title: 'Gentle Garden Walk & Breathing', time: '09:00 AM', category: 'Physical', completedToday: true, completedAt: '09:25 AM' },
        { id: 'rout-3', title: 'Daily Cognitive Game Stimulation', time: '11:00 AM', category: 'Cognitive', completedToday: false, completedAt: null },
        { id: 'rout-4', title: 'Blood Pressure Check & Afternoon Rest', time: '02:00 PM', category: 'Health', completedToday: false, completedAt: null },
        { id: 'rout-5', title: 'Evening Classical Raga Listening', time: '06:00 PM', category: 'Mindfulness', completedToday: false, completedAt: null }
      ];

      localStorage.setItem(k('usr-radha-1', 'patient'), JSON.stringify(radhaPatient));
      localStorage.setItem(k('usr-radha-1', 'guardian'), JSON.stringify(radhaGuardian));
      localStorage.setItem(k('usr-radha-1', 'memories'), JSON.stringify(radhaMemories));
      localStorage.setItem(k('usr-radha-1', 'routines'), JSON.stringify(radhaRoutines));
      localStorage.setItem(k('usr-radha-1', 'game_sessions'), JSON.stringify([]));
      localStorage.setItem(k('usr-radha-1', 'care_notes'), JSON.stringify([
        { id: 'cn-1', author: 'Dr. Ananya Barua (Daughter)', mood: 'Cheerful & Bright 😊', content: 'Mother was alert and enjoyed reminiscing about Shimla over breakfast.' }
      ]));
      localStorage.setItem(k('usr-radha-1', 'cdr_assessments'), JSON.stringify([]));
      localStorage.setItem(k('usr-radha-1', 'settings'), JSON.stringify({ language: 'en', fontSize: 'normal', mode: 'patient' }));

      // ── Ananya Caregiver Data (Linked to Mother Radha) ──
      localStorage.setItem(k('usr-ananya-2', 'patient'), JSON.stringify(radhaPatient));
      localStorage.setItem(k('usr-ananya-2', 'guardian'), JSON.stringify(radhaGuardian));
      localStorage.setItem(k('usr-ananya-2', 'memories'), JSON.stringify(radhaMemories));
      localStorage.setItem(k('usr-ananya-2', 'routines'), JSON.stringify(radhaRoutines));
      localStorage.setItem(k('usr-ananya-2', 'game_sessions'), JSON.stringify([]));
      localStorage.setItem(k('usr-ananya-2', 'care_notes'), JSON.stringify([
        { id: 'cn-2', author: 'Dr. Ananya Barua (Daughter)', mood: 'Calm & Steady 🌿', content: 'Scheduled next routine health review for next month.' }
      ]));
      localStorage.setItem(k('usr-ananya-2', 'cdr_assessments'), JSON.stringify([]));
      localStorage.setItem(k('usr-ananya-2', 'settings'), JSON.stringify({ language: 'en', fontSize: 'normal', mode: 'guardian' }));

      // Default active user is Radha Barua if not logged in
      if (!localStorage.getItem('mira_active_user_id')) {
        localStorage.setItem('mira_active_user_id', 'usr-radha-1');
      }
    }
  } catch (e) {
    console.warn('Could not seed initial data:', e);
  }
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function k(userId, suffix) {
  return `mira_u_${userId}_${suffix}`;
}


// ─── Public Storage Service ──────────────────────────────────────────────────

export const storageService = {
  // ── Bootstrapping ──
  init() {
    seedInitialDataIfEmpty();
    indexedDBStorage.init().catch(() => {});
  },

  // ── User Registry ──
  getAllUsers() {
    return JSON.parse(localStorage.getItem('mira_users') || '[]');
  },

  _saveUsers(users) {
    localStorage.setItem('mira_users', JSON.stringify(users));
  },

  // ── Session ──
  getCurrentUser() {
    const uid = localStorage.getItem('mira_active_user_id');
    if (!uid) return null;
    const users = this.getAllUsers();
    return users.find((u) => u.id === uid) || null;
  },

  _setCurrentUserId(uid) {
    localStorage.setItem('mira_active_user_id', uid);
  },

  // ── Authentication ──
  login(emailOrUsername, credential = '') {
    const users = this.getAllUsers();
    const input = String(emailOrUsername || '').trim().toLowerCase();
    const cred = String(credential || '').trim();

    if (!input) {
      return { success: false, error: 'Please enter your email or name.' };
    }

    // Match by exact email, full name, first name, or user ID
    const user = users.find((u) => {
      const email = (u.email || '').toLowerCase();
      const name = (u.name || '').toLowerCase();
      const firstName = name.split(' ')[0];
      const id = (u.id || '').toLowerCase();
      return (
        email === input ||
        name === input ||
        firstName === input ||
        id === input ||
        email.startsWith(input)
      );
    });

    if (!user) {
      return {
        success: false,
        error: 'No account found for "' + emailOrUsername + '". Please check your email or click "Create Account".'
      };
    }

    const hashed = simpleHash(cred);
    const valid =
      user.pin === hashed ||
      user.password === hashed ||
      user.pin === cred ||
      user.password === cred;

    if (!valid) {
      return { success: false, error: 'Incorrect PIN or password. Please try again.' };
    }

    this._setCurrentUserId(user.id);
    return { success: true, user };
  },

  loginById(userId) {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, error: 'User account not found.' };
    this._setCurrentUserId(user.id);
    return { success: true, user };
  },

  // ── OTP Methods ──
  generateAndSendOtp(email) {
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    const otpData = { code, expiresAt };
    localStorage.setItem(getOtpKey(normalized), JSON.stringify(otpData));

    // Try notifying the backend if available
    try {
      fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized })
      }).catch(() => {});
    } catch (e) {}

    return { success: true, otp: code, expiresAt };
  },

  verifyOtp(email, code) {
    const normalized = String(email || '').trim().toLowerCase();
    const stored = localStorage.getItem(getOtpKey(normalized));
    if (!stored) {
      return { success: false, error: 'No verification code found. Please click "Resend Code".' };
    }
    try {
      const { code: expectedCode, expiresAt } = JSON.parse(stored);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(getOtpKey(normalized));
        return { success: false, error: 'Verification code has expired. Please request a new code.' };
      }
      if (String(expectedCode).trim() !== String(code).trim()) {
        return { success: false, error: 'Invalid verification code. Please check and try again.' };
      }
      // Successfully verified
      localStorage.removeItem(getOtpKey(normalized));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to verify code. Please request a new code.' };
    }
  },

  loginWithOtp(email, otp) {
    const otpRes = this.verifyOtp(email, otp);
    if (!otpRes.success) return otpRes;

    const users = this.getAllUsers();
    const normalized = String(email || '').trim().toLowerCase();
    const user = users.find((u) => (u.email || '').toLowerCase() === normalized);
    if (!user) {
      return { success: false, error: 'No account found with this email. Please sign up to create your account.' };
    }
    this._setCurrentUserId(user.id);
    return { success: true, user };
  },

  register({ name, email, password, pin, role = 'guardian', lovedOneName = '', avatar = '🧑' }, patientProfile = null) {
    const users = this.getAllUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) return { success: false, error: 'An account with this email already exists.' };

    const uid = 'user_' + Date.now();
    const newUser = {
      id: uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      avatar,
      lovedOneName,
      isVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      pin: pin ? simpleHash(pin) : null,
      password: password ? simpleHash(password) : null,
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    this._saveUsers(users);
    this._setCurrentUserId(uid);

    // Create default clean data for this new user
    const defaultPatient = patientProfile || {
      id: 'pat-' + uid,
      name: lovedOneName || 'Your Loved One',
      preferredName: lovedOneName || 'My Elder',
      birthYear: '',
      age: '',
      avatar: '👵',
      hobbies: '',
      childhoodHometown: '',
      emergencyContact: { name: '', phone: '', relationship: '' },
      doctorInfo: { name: '', clinic: '', phone: '' },
      notes: ''
    };
    const defaultGuardian = {
      id: 'guard-' + uid,
      name: newUser.name,
      relation: 'Family Caregiver',
      phone: '',
      email: newUser.email,
      notificationPreference: 'Daily digest',
      avatar: newUser.avatar
    };

    localStorage.setItem(k(uid, 'patient'), JSON.stringify(defaultPatient));
    localStorage.setItem(k(uid, 'guardian'), JSON.stringify(defaultGuardian));
    localStorage.setItem(k(uid, 'memories'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'routines'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'game_sessions'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'care_notes'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'cdr_assessments'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'settings'), JSON.stringify({ language: 'en', fontSize: 'normal', mode: 'guardian' }));

    return { success: true, user: newUser };
  },

  logout() {
    localStorage.removeItem('mira_active_user_id');
    localStorage.removeItem('mira_active_tab');
  },

  updateUser(userId, updates) {
    const users = this.getAllUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return false;
    if (updates.pin) updates.pin = simpleHash(updates.pin);
    if (updates.password) updates.password = simpleHash(updates.password);
    users[idx] = { ...users[idx], ...updates };
    this._saveUsers(users);
    return true;
  },

  // ── Per-User Data Accessors ──
  _uid() {
    return localStorage.getItem('mira_active_user_id');
  },

  getPatient() {
    const uid = this._uid();
    if (!uid) return {};
    const data = localStorage.getItem(k(uid, 'patient'));
    return data ? JSON.parse(data) : {};
  },
  savePatient(profile) {
    const uid = this._uid();
    if (!uid) return;
    localStorage.setItem(k(uid, 'patient'), JSON.stringify(profile));
    indexedDBStorage.put('patientProfile', profile, uid).catch(() => {});
    syncQueue.enqueue('PROFILE_UPDATE', { userId: uid, profile }).catch(() => {});
  },

  getGuardian() {
    const uid = this._uid();
    if (!uid) return {};
    const data = localStorage.getItem(k(uid, 'guardian'));
    return data ? JSON.parse(data) : {};
  },
  saveGuardian(profile) {
    const uid = this._uid();
    if (!uid) return;
    localStorage.setItem(k(uid, 'guardian'), JSON.stringify(profile));
    indexedDBStorage.put('caregiverProfile', profile, uid).catch(() => {});
  },

  getMemories() {
    const uid = this._uid();
    if (!uid) return [];
    const data = localStorage.getItem(k(uid, 'memories'));
    return data ? JSON.parse(data) : [];
  },
  saveMemories(memories) {
    const uid = this._uid();
    if (!uid) return;
    localStorage.setItem(k(uid, 'memories'), JSON.stringify(memories));
    indexedDBStorage.put('memoryItems', memories, uid).catch(() => {});
    syncQueue.enqueue('MEMORY_UPDATE', { userId: uid, memories }).catch(() => {});
  },

  getRoutines() {
    const uid = this._uid();
    if (!uid) return [];
    const data = localStorage.getItem(k(uid, 'routines'));
    return data ? JSON.parse(data) : [];
  },
  saveRoutines(routines) {
    const uid = this._uid();
    if (!uid) return;
    localStorage.setItem(k(uid, 'routines'), JSON.stringify(routines));
    indexedDBStorage.put('dailyRoutine', routines, uid).catch(() => {});
    syncQueue.enqueue('ROUTINE_UPDATE', { userId: uid, routines }).catch(() => {});
  },

  getGameSessions() {
    const uid = this._uid();
    if (!uid) return [];
    const data = localStorage.getItem(k(uid, 'game_sessions'));
    return data ? JSON.parse(data) : [];
  },
  saveGameSession(session) {
    return this.addGameSession(session);
  },
  addGameSession(session) {
    const sessions = this.getGameSessions();
    const exists = sessions.some(s => s.id === session.id);
    const updated = exists ? sessions.map(s => s.id === session.id ? session : s) : [session, ...sessions];
    const uid = this._uid();
    if (uid) {
      localStorage.setItem(k(uid, 'game_sessions'), JSON.stringify(updated));
      indexedDBStorage.put('gameSessions', session).catch(() => {});
    }
    return updated;
  },

  getCareNotes() {
    const uid = this._uid();
    if (!uid) return [];
    const data = localStorage.getItem(k(uid, 'care_notes'));
    return data ? JSON.parse(data) : [];
  },
  addCareNote(note) {
    const notes = this.getCareNotes();
    const updated = [note, ...notes];
    const uid = this._uid();
    if (uid) {
      localStorage.setItem(k(uid, 'care_notes'), JSON.stringify(updated));
      indexedDBStorage.put('careNotes', note).catch(() => {});
      syncQueue.enqueue('CARE_NOTE', { userId: uid, note }).catch(() => {});
    }
    return updated;
  },

  // ── CDR-Inspired Cognitive Functional Screenings ──
  getCDRAssessments() {
    const uid = this._uid();
    if (!uid) return [];
    const data = localStorage.getItem(k(uid, 'cdr_assessments'));
    if (!data) return [];
    try {
      return JSON.parse(data) || [];
    } catch (e) {
      return [];
    }
  },

  saveCDRAssessment(assessment) {
    const assessments = this.getCDRAssessments();
    const uid = this._uid();
    const newRecord = {
      id: assessment.id || `cdr-${Date.now()}`,
      user_id: uid,
      assessment_date: assessment.assessment_date || new Date().toISOString(),
      month_label: assessment.month_label || new Date().toLocaleString('default', { month: 'short' }),
      memory_score: assessment.memory_score ?? assessment.memory ?? 0,
      orientation_score: assessment.orientation_score ?? assessment.orientation ?? 0,
      judgment_score: assessment.judgment_score ?? assessment.judgment_problem_solving ?? 0,
      community_score: assessment.community_score ?? assessment.community_affairs ?? 0,
      home_hobbies_score: assessment.home_hobbies_score ?? assessment.home_hobbies ?? 0,
      personal_care_score: assessment.personal_care_score ?? assessment.personal_care ?? 0,
      total_score: assessment.total_score,
      observed_level: assessment.observed_level,
      assessment_type: 'screening',
      assessor: assessment.assessor || 'Caregiver / Self',
      notes: assessment.notes || ''
    };
    const updated = [...assessments, newRecord];
    if (uid) {
      localStorage.setItem(k(uid, 'cdr_assessments'), JSON.stringify(updated));
      indexedDBStorage.put('careNotes', { id: newRecord.id, type: 'cdr_assessment', ...newRecord }).catch(() => {});
      syncQueue.enqueue('CDR_ASSESSMENT_SYNC', { userId: uid, assessment: newRecord }).catch(() => {});
    }
    return updated;
  },

  getSettings() {
    const globalLang = typeof localStorage !== 'undefined' ? localStorage.getItem('mira_app_language') : null;
    const uid = this._uid();
    if (!uid) return { language: globalLang || 'en', fontSize: 'normal', mode: 'guardian' };
    const data = localStorage.getItem(k(uid, 'settings'));
    const parsed = data ? JSON.parse(data) : { language: globalLang || 'en', fontSize: 'normal', mode: 'guardian' };
    if (globalLang && parsed.language !== globalLang) {
      parsed.language = globalLang;
    }
    return parsed;
  },
  saveSettings(settings) {
    if (settings?.language && typeof localStorage !== 'undefined') {
      localStorage.setItem('mira_app_language', settings.language);
    }
    const uid = this._uid();
    if (!uid) return;
    localStorage.setItem(k(uid, 'settings'), JSON.stringify(settings));
    indexedDBStorage.put('appSettings', settings, uid).catch(() => {});
    syncQueue.enqueue('SETTINGS_UPDATE', { userId: uid, settings }).catch(() => {});
  },

  // ── Backup & Restore ──
  exportAllData() {
    const uid = this._uid();
    const user = this.getCurrentUser();
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      userId: uid,
      userEmail: user?.email,
      patient: this.getPatient(),
      guardian: this.getGuardian(),
      memories: this.getMemories(),
      routines: this.getRoutines(),
      gameSessions: this.getGameSessions(),
      careNotes: this.getCareNotes(),
      cdrAssessments: this.getCDRAssessments(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      const uid = this._uid();
      if (!uid) return false;
      if (data.patient) localStorage.setItem(k(uid, 'patient'), JSON.stringify(data.patient));
      if (data.guardian) localStorage.setItem(k(uid, 'guardian'), JSON.stringify(data.guardian));
      if (data.memories) localStorage.setItem(k(uid, 'memories'), JSON.stringify(data.memories));
      if (data.routines) localStorage.setItem(k(uid, 'routines'), JSON.stringify(data.routines));
      if (data.gameSessions) localStorage.setItem(k(uid, 'game_sessions'), JSON.stringify(data.gameSessions));
      if (data.careNotes) localStorage.setItem(k(uid, 'care_notes'), JSON.stringify(data.careNotes));
      if (data.cdrAssessments) localStorage.setItem(k(uid, 'cdr_assessments'), JSON.stringify(data.cdrAssessments));
      if (data.settings) localStorage.setItem(k(uid, 'settings'), JSON.stringify(data.settings));
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  resetToDefaults() {
    const uid = this._uid();
    if (!uid) return;
    localStorage.setItem(k(uid, 'memories'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'routines'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'game_sessions'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'care_notes'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'cdr_assessments'), JSON.stringify([]));
    localStorage.setItem(k(uid, 'settings'), JSON.stringify({ language: 'en', fontSize: 'normal', mode: 'guardian' }));
  }
};

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    seedInitialDataIfEmpty();
  }
} catch (e) {}

export default storageService;
