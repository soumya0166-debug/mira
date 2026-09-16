/**
 * MIRA NER - Automatic Synchronization Manager
 * Orchestrates synchronization between local storage (IndexedDB) and backend cloud database.
 * Supports:
 * - Automatic background sync upon network restoration
 * - Manual "Sync Now" for caregivers
 * - Idempotency & deduplication
 * - Conflict resolution (append-only event store for games; last-write-wins for profile/routines)
 * - Exponential backoff retry logic
 */

import { syncQueue } from './syncQueue.js';
import { networkManager } from '../network/networkManager.js';
import { indexedDBStorage } from '../storage/indexedDBStorage.js';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.retryTimeout = null;

    // Listen to network restoration
    if (typeof window !== 'undefined') {
      networkManager.subscribe(({ isOnline }) => {
        if (isOnline && !this.isSyncing) {
          // Delay briefly to allow connection to settle
          setTimeout(() => this.processQueue(), 1200);
        }
      });
    }
  }

  /**
   * Manual or automatic trigger to process the pending sync queue
   */
  async processQueue() {
    if (this.isSyncing) return { success: false, reason: 'already_syncing' };

    const isConnected = await networkManager.checkCloudConnectivity();
    if (!isConnected) {
      const pendingCount = await syncQueue.getPendingCount();
      if (pendingCount > 0) {
        networkManager.setSyncStatus('pending');
      }
      return { success: false, reason: 'offline' };
    }

    const pendingItems = await syncQueue.getPending();
    if (!pendingItems || pendingItems.length === 0) {
      networkManager.setSyncStatus('synced');
      return { success: true, processedCount: 0 };
    }

    this.isSyncing = true;
    networkManager.setSyncStatus('syncing');

    try {
      const token = typeof localStorage !== 'undefined' ? (localStorage.getItem('mira_token') || 'demo_token') : 'demo_token';
      const activeUserId = typeof localStorage !== 'undefined' ? (localStorage.getItem('mira_active_user_id') || 'usr-radha-1') : 'usr-radha-1';
      const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3001';

      const response = await fetch(`${baseUrl}/api/sync/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-demo-user-id': activeUserId
        },
        body: JSON.stringify({
          items: pendingItems,
          clientTimestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        const syncedIds = result.processedIds || pendingItems.map((i) => i.id);

        // Remove synced items from queue
        await syncQueue.removeSynced(syncedIds);

        // Mark game sessions as 'synced' in IndexedDB
        for (const item of pendingItems) {
          if (item.type === 'GAME_SESSION' && item.payload && item.payload.id) {
            const session = await indexedDBStorage.get('gameSessions', item.payload.id);
            if (session) {
              session.syncStatus = 'synced';
              await indexedDBStorage.put('gameSessions', session);
            }
          }
        }

        this.isSyncing = false;
        networkManager.setSyncStatus('synced');
        return { success: true, processedCount: syncedIds.length };
      } else {
        throw new Error(`Sync server responded with status: ${response.status}`);
      }
    } catch (err) {
      console.warn('[SyncManager] Batch sync error, scheduling graceful retry:', err.message);
      this.isSyncing = false;
      networkManager.setSyncStatus('pending');

      // Schedule exponential backoff retry if still online
      this._scheduleRetry(pendingItems[0]?.retryCount || 0);
      return { success: false, error: err.message };
    }
  }

  _scheduleRetry(currentRetryCount) {
    if (this.retryTimeout) clearTimeout(this.retryTimeout);
    const delay = Math.min(30000, 2000 * Math.pow(1.5, currentRetryCount));
    this.retryTimeout = setTimeout(() => {
      if (networkManager.isOnline) {
        this.processQueue();
      }
    }, delay);
  }

  /**
   * Explicit user trigger (e.g. from Caregiver Dashboard)
   */
  async syncNow() {
    return await this.processQueue();
  }

  /**
   * Get current sync status overview
   */
  async getStatusSummary() {
    const pendingCount = await syncQueue.getPendingCount();
    return {
      isOnline: networkManager.isOnline,
      syncStatus: pendingCount > 0 ? (this.isSyncing ? 'syncing' : 'pending') : 'synced',
      pendingCount,
      lastSyncTime: networkManager.lastSyncTime
    };
  }
}

export const syncManager = new SyncManager();
export default syncManager;
