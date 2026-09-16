/**
 * MIRA NER - Global Network & Connectivity Manager
 * Manages detection of:
 * - Online
 * - Offline
 * - Reconnecting / Connection Restored
 * - Syncing
 * - Sync Completed
 * - Sync Failed
 *
 * Provides event subscriptions and gentle status descriptions.
 */

class NetworkManager {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.syncStatus = 'synced'; // 'synced' | 'syncing' | 'pending' | 'error'
    this.lastSyncTime = typeof localStorage !== 'undefined' ? (localStorage.getItem('mira_last_sync_time') || new Date().toISOString()) : new Date().toISOString();
    this.listeners = new Set();
    this.pingInterval = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this._handleOnline());
      window.addEventListener('offline', () => this._handleOffline());
      this._startHeartbeat();
    }
  }

  /**
   * Subscribe to network and sync state changes
   * @param {Function} callback ({ isOnline, syncStatus, lastSyncTime }) => void
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    callback({
      isOnline: this.isOnline,
      syncStatus: this.syncStatus,
      lastSyncTime: this.lastSyncTime
    });
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = {
      isOnline: this.isOnline,
      syncStatus: this.syncStatus,
      lastSyncTime: this.lastSyncTime
    };
    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.warn('[NetworkManager] Listener error:', err);
      }
    });
  }

  _handleOnline() {
    this.isOnline = true;
    this.syncStatus = 'reconnecting';
    this.notify();

    // Verify true end-to-end connectivity with backend
    this.checkCloudConnectivity().then((reachable) => {
      if (reachable) {
        this.isOnline = true;
        this.notify();
      }
    });
  }

  _handleOffline() {
    this.isOnline = false;
    this.notify();
  }

  setSyncStatus(status) {
    this.syncStatus = status;
    if (status === 'synced') {
      this.lastSyncTime = new Date().toISOString();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mira_last_sync_time', this.lastSyncTime);
      }
    }
    this.notify();
  }

  /**
   * Verify if cloud server is actually reachable (not a captive portal or dead link)
   */
  async checkCloudConnectivity() {
    if (typeof fetch === 'undefined') return false;
    const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3001';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${baseUrl}/api/health`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const ok = res.ok;
      if (ok && !this.isOnline) {
        this.isOnline = true;
        this.notify();
      }
      return ok;
    } catch {
      // Cloud unreachable, continue operating gracefully offline
      return false;
    }
  }

  _startHeartbeat() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    // Lightweight heartbeat check every 30 seconds
    this.pingInterval = setInterval(() => {
      if (navigator.onLine) {
        this.checkCloudConnectivity();
      } else if (this.isOnline) {
        this._handleOffline();
      }
    }, 30000);
  }
}

export const networkManager = new NetworkManager();
export default networkManager;
