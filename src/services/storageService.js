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

import { indexedDBStorage } from '../offline/storage/indexedDBStorage';
import { syncQueue } from '../offline/sync/syncQueue';

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

// ─── Demo Seed Data ─────────────────────────────────────────────────────────

const DEMO_PATIENT_ANANYA = {
  id: 'pat-1',
  name: 'Radha Sharma',
  preferredName: 'Radha Dadi',
  birthYear: '1950',
  age: 76,
  avatar: '👵',
  hobbies: 'Indian classical music, gardening, knitting, making ginger tea',
  childhoodHometown: 'Pune & Shimla',
  emergencyContact: {
    name: 'Ananya Sharma (Daughter)',
    phone: '+91 98765 43210',
    relationship: 'Daughter & Primary Guardian'
  },
  doctorInfo: {
    name: 'Dr. Arvind Joshi, MD (Neurology)',
    clinic: 'Wellness Clinic, Pune',
    phone: '+91 98220 11223'
  },
  notes: 'Gentle morning reminder required for blood pressure pills. Loves listening to M.S. Subbulakshmi raga.'
};

const DEMO_GUARDIAN_ANANYA = {
  id: 'guard-1',
  name: 'Ananya Sharma',
  relation: 'Daughter',
  phone: '+91 98765 43210',
  email: 'ananya.sharma@example.com',
  notificationPreference: 'Daily evening digest & missed medicine alerts',
  avatar: '👩‍💼'
};

const DEMO_MEMORIES_ANANYA = [
  {
    id: 'mem-1', title: 'Shimla Summer Vacation with Suresh', year: '1984',
    category: 'Travel & Family', image: SEED_IMAGES.shimla,
    story: 'We took the toy train through the pine hills. You and Suresh sat near the window laughing as cold mountain mist blew across our faces. We stopped at Barog for hot cardamom chai and sweet buns.',
    questionPrompt: 'Do you remember the toy train whistling through the tunnels, Radha?',
    hasAudio: true, audioNote: null,
    audioSampleText: 'Radha, remember this day? Suresh was holding the thermos of tea and laughing with the children.',
    tags: ['Travel', 'Shimla', 'Suresh', 'Joyful'],
    reactions: [
      { emoji: '😊', label: 'Brought a warm smile', date: 'Yesterday' },
      { emoji: '🗣️', label: 'Shared a memory of Suresh', date: '3 days ago' }
    ]
  },
  {
    id: 'mem-2', title: 'The Fragrant Jasmine Garden at Dawn', year: '1992',
    category: 'Home & Nature', image: SEED_IMAGES.garden,
    story: 'Every morning at 6:00 AM, you walked down to our ancestral courtyard with a cane basket to gently harvest fresh white mogra and jasmine blossoms for the morning prayer lamp.',
    questionPrompt: 'Can you still remember the sweet scent of the fresh morning jasmine?',
    hasAudio: true, audioNote: null,
    audioSampleText: 'You always told us the white flowers bloomed brightest under the morning star.',
    tags: ['Garden', 'Jasmine', 'Home', 'Peace'],
    reactions: [{ emoji: '❤️', label: 'Felt deeply comforted', date: 'Today' }]
  },
  {
    id: 'mem-3', title: "Meera's University Graduation Ceremony", year: '2018',
    category: 'Milestones', image: SEED_IMAGES.graduation,
    story: 'Granddaughter Meera received her degree in Architecture. You wore your favorite maroon Kanjeevaram silk saree with the golden peacock border. You were clapping so proudly.',
    questionPrompt: 'Do you remember how tightly Meera hugged you after throwing her black graduation cap?',
    hasAudio: false, audioNote: null,
    tags: ['Meera', 'Graduation', 'Pride', 'Family'],
    reactions: [{ emoji: '😊', label: 'Smiled proudly at Meera', date: '4 days ago' }]
  },
  {
    id: 'mem-4', title: 'Morning Cardamom Chai & Classical Raga', year: 'Everyday Ritual',
    category: 'Daily Comfort', image: SEED_IMAGES.coffee,
    story: 'The quiet hour before anyone woke up. You would turn on the vintage Philips radio softly to Raga Bhairav, crushing green cardamom in the marble mortar.',
    questionPrompt: 'Which raga was your favorite when the morning sunlight entered the kitchen window?',
    hasAudio: true, audioNote: null,
    audioSampleText: 'Dadi, you always taught us that morning music brings peace to the entire household.',
    tags: ['Music', 'Chai', 'Tradition', 'Ritual'],
    reactions: [{ emoji: '🗣️', label: 'Hummed along to the tune', date: '2 days ago' }]
  }
];

const DEMO_ROUTINES_ANANYA = [
  { id: 'rout-1', time: '08:00 AM', period: 'morning', title: 'Morning Heart & Blood Pressure Tablets', instructions: '1 Amlodipine tablet with a warm glass of water after light breakfast', category: 'Medication', icon: '💊', completedToday: true, completedAt: '08:15 AM' },
  { id: 'rout-2', time: '09:00 AM', period: 'morning', title: 'Sunlight & Balcony Plants Watering', instructions: '15 minutes of gentle morning warmth and watering the basil & jasmine plants', category: 'Activity', icon: '🪴', completedToday: true, completedAt: '09:20 AM' },
  { id: 'rout-3', time: '01:00 PM', period: 'afternoon', title: 'Nourishing Lunch & Hydration', instructions: 'Warm khichdi/dal with steamed vegetables and a glass of buttermilk', category: 'Meals & Hydration', icon: '🍲', completedToday: false, completedAt: null },
  { id: 'rout-4', time: '03:30 PM', period: 'afternoon', title: 'MIRA Memory Game or Photo Walk', instructions: 'Relaxing 10-minute card matching session with family memories', category: 'Cognitive Stimulation', icon: '🧩', completedToday: false, completedAt: null },
  { id: 'rout-5', time: '05:30 PM', period: 'evening', title: 'Courtyard Walk with Ananya', instructions: 'Gentle walk around the garden path, breathing fresh evening air', category: 'Movement', icon: '🚶‍♀️', completedToday: false, completedAt: null },
  { id: 'rout-6', time: '08:30 PM', period: 'night', title: 'Evening Calcium & Bedtime Reading', instructions: 'Calcium tablet with warm milk, listen to evening devotional prayer', category: 'Medication', icon: '🌙', completedToday: false, completedAt: null }
];

const DEMO_GAME_SESSIONS_ANANYA = [
  { id: 'gs-1', date: '2026-09-13', game: 'Card Matching', score: 95, matches: 6, durationSec: 72 },
  { id: 'gs-2', date: '2026-09-12', game: 'Attention Pattern', score: 88, rounds: 5, durationSec: 64 },
  { id: 'gs-3', date: '2026-09-11', game: 'Word Association', score: 100, pairs: 4, durationSec: 50 },
  { id: 'gs-4', date: '2026-09-10', game: 'Card Matching', score: 90, matches: 4, durationSec: 48 },
  { id: 'gs-5', date: '2026-09-09', game: 'Attention Pattern', score: 85, rounds: 4, durationSec: 55 }
];

const DEMO_CARE_NOTES_ANANYA = [
  { id: 'note-1', date: 'Today, 10:30 AM', author: 'Ananya Sharma (Guardian)', mood: 'Cheerfully engaged 😊', content: 'Radha woke up smiling today. She spent 15 minutes looking at the 1984 Shimla vacation photo and specifically mentioned the cold wind and tea at Barog railway station!' },
  { id: 'note-2', date: 'Yesterday, 07:15 PM', author: 'Ananya Sharma (Guardian)', mood: 'Calm and reflective 🕊️', content: 'Completed the 3x2 card matching game in 6 moves. Enjoyed listening to the audio chime. She asked to listen to M.S. Subbulakshmi raga before dinner.' }
];

// ─── Vikram Patel (second demo user) ────────────────────────────────────────

const DEMO_PATIENT_VIKRAM = {
  id: 'pat-v1',
  name: 'Devendra Patel',
  preferredName: 'Bapuji',
  birthYear: '1947',
  age: 79,
  avatar: '👴',
  hobbies: 'Sitar music, reading Gujarati poetry, evening walks along the riverfront, chess',
  childhoodHometown: 'Ahmedabad & Vadodara',
  emergencyContact: {
    name: 'Dr. Vikram Patel (Son)',
    phone: '+91 99001 12345',
    relationship: 'Son & Primary Guardian'
  },
  doctorInfo: {
    name: 'Dr. Sunita Mehta, MD (Geriatrics)',
    clinic: 'Silver Years Clinic, Ahmedabad',
    phone: '+91 98240 55678'
  },
  notes: 'Bapuji responds very well to Raga Yaman in the evenings. Please avoid loud television. Enjoys chess puzzles with his great-grandchildren.'
};

const DEMO_GUARDIAN_VIKRAM = {
  id: 'guard-v1',
  name: 'Dr. Vikram Patel',
  relation: 'Son',
  phone: '+91 99001 12345',
  email: 'vikram.patel@example.com',
  notificationPreference: 'Instant alerts for missed medications & weekly wellness digest',
  avatar: '👨‍⚕️'
};

const DEMO_MEMORIES_VIKRAM = [
  {
    id: 'vmem-1', title: "Sabarmati Ashram Walk \u2014 Gandhiji's Path", year: '1978',
    category: 'Heritage & Inspiration', image: SEED_IMAGES.sabarmati,
    story: 'You walked the same stone corridors where Gandhiji once spun khadi. You said the silence there was different — full of purpose. You bought a small spinning wheel model for me that day.',
    questionPrompt: 'Bapuji, do you still remember the smell of the old khadi cloth in the Ashram weaving room?',
    hasAudio: true, audioNote: null,
    audioSampleText: 'Bapuji, you said that day was the most peaceful you had ever felt in the city.',
    tags: ['Gandhi', 'Ahmedabad', 'Heritage', 'Inspiration'],
    reactions: [
      { emoji: '😊', label: 'Smiled warmly remembering', date: 'Yesterday' },
      { emoji: '🗣️', label: 'Told the story of the spinning wheel', date: '2 days ago' }
    ]
  },
  {
    id: 'vmem-2', title: 'Uttarayan Kite Festival — Ahmedabad Rooftop', year: '1985',
    category: 'Festivals & Celebrations', image: SEED_IMAGES.kite,
    story: 'Every January 14th, the whole family gathered on the terrace. You guided me to cut the neighbour\'s blue kite with a perfect 90-degree tug. The whole street cheered.',
    questionPrompt: 'Bapuji, which colour kite do you remember cutting the most on Uttarayan?',
    hasAudio: true, audioNote: null,
    audioSampleText: 'Bapuji, you were the best at the manja string technique in the entire building.',
    tags: ['Kite', 'Festival', 'Ahmedabad', 'Family Joy'],
    reactions: [{ emoji: '❤️', label: 'Felt pure joy remembering', date: 'Today' }]
  },
  {
    id: 'vmem-3', title: 'Evening Sitar by the Sabarmati Riverfront', year: 'Every Evening',
    category: 'Music & Daily Ritual', image: SEED_IMAGES.sitar,
    story: 'Just as dusk settled over the river, you would settle into your carved wooden chair, tune the sitar gently, and begin Raga Yaman. The neighbours would open their windows to listen.',
    questionPrompt: 'Bapuji, which raga do you feel the most alive playing — Yaman or Bhairav?',
    hasAudio: false, audioNote: null,
    tags: ['Sitar', 'Music', 'Raga', 'Riverside'],
    reactions: [{ emoji: '🗣️', label: 'Hummed the notes of Raga Yaman', date: '3 days ago' }]
  }
];

const DEMO_ROUTINES_VIKRAM = [
  { id: 'vrout-1', time: '07:30 AM', period: 'morning', title: 'Morning Thyroid & BP Medication', instructions: '2 tablets with warm water before breakfast as prescribed by Dr. Mehta', category: 'Medication', icon: '💊', completedToday: true, completedAt: '07:45 AM' },
  { id: 'vrout-2', time: '08:30 AM', period: 'morning', title: 'Warm Porridge & Fresh Pomegranate', instructions: 'Oat porridge with honey and a small bowl of pomegranate seeds', category: 'Meals & Hydration', icon: '🥣', completedToday: true, completedAt: '08:50 AM' },
  { id: 'vrout-3', time: '10:00 AM', period: 'morning', title: 'Gujarati Poetry Reading Session', instructions: 'Read aloud from the Narsinh Mehta poetry collection for 20 minutes', category: 'Cognitive Stimulation', icon: '📖', completedToday: false, completedAt: null },
  { id: 'vrout-4', time: '04:00 PM', period: 'afternoon', title: 'Chess Puzzle & Memory Game', instructions: 'One chess puzzle from the book, then a short MIRA card matching round', category: 'Cognitive Stimulation', icon: '♟️', completedToday: false, completedAt: null },
  { id: 'vrout-5', time: '06:30 PM', period: 'evening', title: 'Sitar Listening or Gentle Walk', instructions: 'Listen to Pandit Ravi Shankar recording or gentle 10-minute riverfront walk', category: 'Movement & Music', icon: '🎵', completedToday: false, completedAt: null },
  { id: 'vrout-6', time: '09:00 PM', period: 'night', title: 'Calcium & Joint Supplement', instructions: 'Calcium + Vitamin D tablet with warm golden milk', category: 'Medication', icon: '🌙', completedToday: false, completedAt: null }
];

const DEMO_GAME_SESSIONS_VIKRAM = [
  { id: 'vgs-1', date: '2026-09-13', game: 'Card Matching', score: 88, matches: 5, durationSec: 85 },
  { id: 'vgs-2', date: '2026-09-12', game: 'Word Association', score: 92, pairs: 4, durationSec: 68 },
  { id: 'vgs-3', date: '2026-09-11', game: 'Attention Pattern', score: 80, rounds: 4, durationSec: 74 },
  { id: 'vgs-4', date: '2026-09-09', game: 'Card Matching', score: 85, matches: 4, durationSec: 92 }
];

const DEMO_CARE_NOTES_VIKRAM = [
  { id: 'vnote-1', date: 'Today, 11:00 AM', author: 'Dr. Vikram Patel (Guardian)', mood: 'Bright and engaged 🎵', content: 'Bapuji listened to Raga Yaman for 30 minutes this morning and was very happy. He specifically mentioned the kite festival in 1985 and pointed at the photo.' },
  { id: 'vnote-2', date: 'Yesterday, 08:00 PM', author: 'Dr. Vikram Patel (Guardian)', mood: 'Calm and reflective 🕊️', content: 'Completed the chess puzzle section in his afternoon routine. Solved 2 out of 3 puzzles independently — excellent cognitive engagement today.' }
];

// ─── Demo User Registry (two pre-seeded demo accounts) ──────────────────────

const DEMO_USERS = [
  {
    id: 'user_ananya',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    role: 'guardian', // 'guardian' | 'patient'
    avatar: '👩‍💼',
    pin: simpleHash('1234'),
    password: simpleHash('password123'),
    joinedAt: '2026-01-15T10:00:00.000Z',
    lovedOneName: 'Radha Dadi'
  },
  {
    id: 'user_vikram',
    name: 'Dr. Vikram Patel',
    email: 'vikram.patel@example.com',
    role: 'guardian',
    avatar: '👨‍⚕️',
    pin: simpleHash('1234'),
    password: simpleHash('password123'),
    joinedAt: '2026-02-20T09:30:00.000Z',
    lovedOneName: 'Bapuji (Devendra Patel)'
  }
];

// ─── Internal helpers ────────────────────────────────────────────────────────

function k(userId, suffix) {
  return `mira_u_${userId}_${suffix}`;
}

function ensureDemoUsersSeeded() {
  const existing = JSON.parse(localStorage.getItem('mira_users') || '[]');
  const existingIds = existing.map((u) => u.id);
  let updated = [...existing];

  DEMO_USERS.forEach((demoUser) => {
    if (!existingIds.includes(demoUser.id)) {
      updated.push(demoUser);
      // Seed this user's data if not already present
      const uid = demoUser.id;
      if (!localStorage.getItem(k(uid, 'patient'))) {
        const patientData = uid === 'user_ananya' ? DEMO_PATIENT_ANANYA : DEMO_PATIENT_VIKRAM;
        const guardianData = uid === 'user_ananya' ? DEMO_GUARDIAN_ANANYA : DEMO_GUARDIAN_VIKRAM;
        const memoriesData = uid === 'user_ananya' ? DEMO_MEMORIES_ANANYA : DEMO_MEMORIES_VIKRAM;
        const routinesData = uid === 'user_ananya' ? DEMO_ROUTINES_ANANYA : DEMO_ROUTINES_VIKRAM;
        const gameData = uid === 'user_ananya' ? DEMO_GAME_SESSIONS_ANANYA : DEMO_GAME_SESSIONS_VIKRAM;
        const notesData = uid === 'user_ananya' ? DEMO_CARE_NOTES_ANANYA : DEMO_CARE_NOTES_VIKRAM;
        localStorage.setItem(k(uid, 'patient'), JSON.stringify(patientData));
        localStorage.setItem(k(uid, 'guardian'), JSON.stringify(guardianData));
        localStorage.setItem(k(uid, 'memories'), JSON.stringify(memoriesData));
        localStorage.setItem(k(uid, 'routines'), JSON.stringify(routinesData));
        localStorage.setItem(k(uid, 'game_sessions'), JSON.stringify(gameData));
        localStorage.setItem(k(uid, 'care_notes'), JSON.stringify(notesData));
        localStorage.setItem(k(uid, 'settings'), JSON.stringify({ language: 'en', fontSize: 'normal', mode: 'guardian' }));
      }
    }
  });

  if (updated.length !== existing.length) {
    localStorage.setItem('mira_users', JSON.stringify(updated));
  }
}

// ─── Migration: carry over any pre-auth data into Ananya's account ──────────

function migratePreAuthData() {
  const migrated = localStorage.getItem('mira_migrated_v2');
  if (migrated) return;

  const oldPatient = localStorage.getItem('mira_patient_profile');
  const uid = 'user_ananya';
  // Only migrate if no scoped data exists yet for Ananya
  if (oldPatient && !localStorage.getItem(k(uid, 'patient'))) {
    localStorage.setItem(k(uid, 'patient'), oldPatient);
    const oldGuardian = localStorage.getItem('mira_guardian_profile');
    if (oldGuardian) localStorage.setItem(k(uid, 'guardian'), oldGuardian);
    const oldMem = localStorage.getItem('mira_memories');
    if (oldMem) localStorage.setItem(k(uid, 'memories'), oldMem);
    const oldRout = localStorage.getItem('mira_routines');
    if (oldRout) localStorage.setItem(k(uid, 'routines'), oldRout);
    const oldGS = localStorage.getItem('mira_game_sessions');
    if (oldGS) localStorage.setItem(k(uid, 'game_sessions'), oldGS);
    const oldNotes = localStorage.getItem('mira_caregiver_notes');
    if (oldNotes) localStorage.setItem(k(uid, 'care_notes'), oldNotes);
    const oldSettings = localStorage.getItem('mira_settings');
    if (oldSettings) localStorage.setItem(k(uid, 'settings'), oldSettings);
  }

  localStorage.setItem('mira_migrated_v2', 'true');
}

// ─── Public Storage Service ──────────────────────────────────────────────────

export const storageService = {
  // ── Bootstrapping ──
  init() {
    migratePreAuthData();
    ensureDemoUsersSeeded();
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
  login(emailOrUsername, credential) {
    const users = this.getAllUsers();
    const normalised = emailOrUsername.trim().toLowerCase();
    const user = users.find((u) =>
      u.email.toLowerCase() === normalised || u.name.toLowerCase() === normalised
    );
    if (!user) return { success: false, error: 'No account found with that email or name.' };

    const hashed = simpleHash(credential);
    if (user.pin !== hashed && user.password !== hashed) {
      return { success: false, error: 'Incorrect PIN or password. Please try again.' };
    }

    this._setCurrentUserId(user.id);
    return { success: true, user };
  },

  loginById(userId) {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, error: 'User not found.' };
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
      pin: pin ? simpleHash(pin) : null,
      password: password ? simpleHash(password) : null,
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    this._saveUsers(users);
    this._setCurrentUserId(uid);

    // Create default data for this new user
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
    localStorage.setItem(k(uid, 'settings'), JSON.stringify({ language: 'en', fontSize: 'normal', mode: 'guardian' }));

    return { success: true, user: newUser };
  },

  logout() {
    localStorage.removeItem('mira_active_user_id');
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

  getSettings() {
    const uid = this._uid();
    if (!uid) return { language: 'en', fontSize: 'normal', mode: 'guardian' };
    const data = localStorage.getItem(k(uid, 'settings'));
    return data ? JSON.parse(data) : { language: 'en', fontSize: 'normal', mode: 'guardian' };
  },
  saveSettings(settings) {
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
    const isAnanya = uid === 'user_ananya';
    const isVikram = uid === 'user_vikram';

    if (isAnanya) {
      localStorage.setItem(k(uid, 'patient'), JSON.stringify(DEMO_PATIENT_ANANYA));
      localStorage.setItem(k(uid, 'guardian'), JSON.stringify(DEMO_GUARDIAN_ANANYA));
      localStorage.setItem(k(uid, 'memories'), JSON.stringify(DEMO_MEMORIES_ANANYA));
      localStorage.setItem(k(uid, 'routines'), JSON.stringify(DEMO_ROUTINES_ANANYA));
      localStorage.setItem(k(uid, 'game_sessions'), JSON.stringify(DEMO_GAME_SESSIONS_ANANYA));
      localStorage.setItem(k(uid, 'care_notes'), JSON.stringify(DEMO_CARE_NOTES_ANANYA));
    } else if (isVikram) {
      localStorage.setItem(k(uid, 'patient'), JSON.stringify(DEMO_PATIENT_VIKRAM));
      localStorage.setItem(k(uid, 'guardian'), JSON.stringify(DEMO_GUARDIAN_VIKRAM));
      localStorage.setItem(k(uid, 'memories'), JSON.stringify(DEMO_MEMORIES_VIKRAM));
      localStorage.setItem(k(uid, 'routines'), JSON.stringify(DEMO_ROUTINES_VIKRAM));
      localStorage.setItem(k(uid, 'game_sessions'), JSON.stringify(DEMO_GAME_SESSIONS_VIKRAM));
      localStorage.setItem(k(uid, 'care_notes'), JSON.stringify(DEMO_CARE_NOTES_VIKRAM));
    } else {
      localStorage.setItem(k(uid, 'memories'), JSON.stringify([]));
      localStorage.setItem(k(uid, 'routines'), JSON.stringify([]));
      localStorage.setItem(k(uid, 'game_sessions'), JSON.stringify([]));
      localStorage.setItem(k(uid, 'care_notes'), JSON.stringify([]));
    }
    localStorage.setItem(k(uid, 'settings'), JSON.stringify({ language: 'en', fontSize: 'normal', mode: 'guardian' }));
  }
};

export default storageService;
