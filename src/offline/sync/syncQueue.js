/**
 * MIRA NER - Persistent Data Sync Queue
 * Stores pending operations locally when offline or during transient network drops.
 * Operations:
 *  - GAME_SESSION (completed cognitive games)
 *  - ROUTINE_UPDATE (completed daily routine checks)
 *  - ROUTINE_ADD (new reminder/routine added)
 *  - MEMORY_REACTION (cherished memory interactions)
 *  - CARE_NOTE (guardian / caregiver notes)
 *  - SETTINGS_UPDATE (accessibility, font, language changes)
 *  - PROFILE_UPDATE (patient/guardian edits)
 */

import { indexedDBStorage } from '../storage/indexedDBStorage.js';

const STORE_NAME = 'pendingSync';

class SyncQueue {
  /**
   * Enqueue a new action for background synchronization
   */
  async enqueue(type, payload) {
    const item = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      type,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
      lastAttempt: null
    };

    await indexedDBStorage.put(STORE_NAME, item);
    return item;
  }

  /**
   * Get all pending items in the queue
   */
  async getPending() {
    const all = await indexedDBStorage.getAll(STORE_NAME);
    return (all || []).filter((item) => item.status === 'pending' || item.status === 'failed');
  }

  /**
   * Get count of pending items
   */
  async getPendingCount() {
    const pending = await this.getPending();
    return pending.length;
  }

  /**
   * Update an item's status in the queue
   */
  async updateStatus(id, status, error = null) {
    const item = await indexedDBStorage.get(STORE_NAME, id);
    if (!item) return;

    item.status = status;
    item.lastAttempt = new Date().toISOString();
    if (status === 'failed') {
      item.retryCount = (item.retryCount || 0) + 1;
      item.lastError = error;
    }

    await indexedDBStorage.put(STORE_NAME, item);
  }

  /**
   * Mark items as successfully synced and remove from queue
   */
  async removeSynced(ids) {
    if (!Array.isArray(ids)) return;
    for (const id of ids) {
      await indexedDBStorage.delete(STORE_NAME, id);
    }
  }

  /**
   * Clear the entire sync queue (e.g., upon user logout or manual purge)
   */
  async clear() {
    await indexedDBStorage.clear(STORE_NAME);
  }
}

export const syncQueue = new SyncQueue();
export default syncQueue;
