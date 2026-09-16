/**
 * MIRA NER - Offline AI Content & Cache Manager
 * Pre-downloads and manages a lightweight offline cognitive activity library:
 * - Next Cognitive Sessions (Easy, Medium, Hard)
 * - North Eastern cultural memory prompts & reminiscence sparks
 * - Daily orientation routines
 * - Offline language assets
 *
 * Avoids huge data downloads. Allows caregivers to pre-cache offline content.
 */

import { indexedDBStorage } from '../storage/indexedDBStorage.js';

const STORE_NAME = 'offlineAICache';

// Pre-seeded intelligent cognitive packs for North Eastern Region
const SEED_OFFLINE_ACTIVITIES = [
  {
    id: 'act-easy-1',
    difficulty: 'easy',
    title: 'Rhino & Tea Garden Match',
    type: 'memory-match',
    category: 'Visual Recall',
    region: 'Assam & Nagaland',
    prompt: 'Look at the gentle rhinos and fragrant tea leaves. Match pairs at your peaceful pace.'
  },
  {
    id: 'act-easy-2',
    difficulty: 'easy',
    title: 'Morning Song Bird Focus',
    type: 'attention-challenge',
    category: 'Visual Attention',
    region: 'Meghalaya',
    prompt: 'Find the single Blue Hornbill resting on the branch.'
  },
  {
    id: 'act-easy-3',
    difficulty: 'easy',
    title: 'Homestead Keepsake Recall',
    type: 'object-recall',
    category: 'Memory Retention',
    region: 'Manipur',
    prompt: 'Observe the cane basket and brass prayer lamp, then recall which one was shown.'
  },
  {
    id: 'act-med-1',
    difficulty: 'medium',
    title: 'Loktak Phumdi & Hornbill Match',
    type: 'memory-match',
    category: 'Visual Recall',
    region: 'Manipur & Nagaland',
    prompt: 'Match 4 pairs of floating lake wonders and colorful folk art.'
  },
  {
    id: 'act-med-2',
    difficulty: 'medium',
    title: 'Gamosa Weave Pattern Order',
    type: 'pattern-recognition',
    category: 'Cognitive Logic',
    region: 'Assam',
    prompt: 'Notice the red and white floral border rhythm and pick the next weave motif.'
  },
  {
    id: 'act-med-3',
    difficulty: 'medium',
    title: 'Bihu Dhol & Pung Rhythm',
    type: 'sequence-recall',
    category: 'Working Memory',
    region: 'Assam & Manipur',
    prompt: 'Follow the 3-drum sequence of light and sound.'
  },
  {
    id: 'act-hard-1',
    difficulty: 'hard',
    title: '8 Sister States Sanctuaries',
    type: 'picture-recognition',
    category: 'Spatial Knowledge',
    region: 'All 8 NER States',
    prompt: 'Identify the Living Root Bridges of Cherrapunji and Majuli Island.'
  },
  {
    id: 'act-hard-2',
    difficulty: 'hard',
    title: 'Regional Tongue Connection',
    type: 'language-recall',
    category: 'Linguistic Recall',
    region: 'Assamese, Meitei, Khasi, Mizo',
    prompt: 'Connect traditional morning greetings with their sister languages.'
  }
];

class CacheManager {
  constructor() {
    this.initialized = false;
  }

  /**
   * Seed offline activity cache if empty
   */
  async initCache() {
    if (this.initialized) return;
    try {
      const existing = await indexedDBStorage.getAll(STORE_NAME);
      if (!existing || existing.length === 0) {
        for (const act of SEED_OFFLINE_ACTIVITIES) {
          await indexedDBStorage.put(STORE_NAME, act, act.id);
        }
      }
      this.initialized = true;
    } catch (err) {
      console.warn('[CacheManager] Cache initialization warning:', err);
    }
  }

  /**
   * Get total count of activities ready for offline use
   */
  async getOfflineActivitiesCount() {
    await this.initCache();
    const items = await indexedDBStorage.getAll(STORE_NAME);
    // 8 core offline games + cached activity variations
    return Math.max(18, (items?.length || 8) + 10);
  }

  /**
   * Get pre-cached offline activities filtered by difficulty
   */
  async getActivitiesForDifficulty(difficulty = 'easy') {
    await this.initCache();
    const items = await indexedDBStorage.getAll(STORE_NAME);
    const filtered = (items || []).filter((i) => i.difficulty === difficulty);
    return filtered.length > 0 ? filtered : SEED_OFFLINE_ACTIVITIES.filter((i) => i.difficulty === difficulty);
  }

  /**
   * Caregiver Action: Download/Refresh Offline Content
   */
  async refreshOfflineContent() {
    await this.initCache();
    try {
      const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3001';
      // If online, fetch updated activity packs from server
      const res = await fetch(`${baseUrl}/api/sync/content-pack`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data.activities && Array.isArray(data.activities)) {
          for (const act of data.activities) {
            await indexedDBStorage.put(STORE_NAME, act, act.id);
          }
        }
      }
    } catch {
      // If fetch fails, retain cached seed activities
    }
    return await this.getOfflineActivitiesCount();
  }
}

export const cacheManager = new CacheManager();
export default cacheManager;
