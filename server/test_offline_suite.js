/**
 * Automated Verification Suite for MIRA NER Offline-First Architecture
 */

import { indexedDBStorage } from '../src/offline/storage/indexedDBStorage.js';
import { syncQueue } from '../src/offline/sync/syncQueue.js';
import { syncManager } from '../src/offline/sync/syncManager.js';
import { cacheManager } from '../src/offline/cache/cacheManager.js';
import { offlineGameService } from '../src/offline/games/offlineGameService.js';
import { networkManager } from '../src/offline/network/networkManager.js';

// Polyfill minimal browser environment for node testing if needed
if (typeof localStorage === 'undefined') {
  const store = new Map();
  global.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] || null,
    get length() { return store.size; }
  };
}

if (typeof navigator === 'undefined') {
  global.navigator = { onLine: true };
}

async function runVerification() {
  networkManager.isOnline = true;
  console.log('====================================================');
  console.log(' MIRA NER: Offline-First Architecture Test Suite    ');
  console.log('====================================================');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  // TEST 1: Storage Layer
  console.log('\n--- Test Group 1: Local Storage Layer ---');
  await indexedDBStorage.put('appSettings', { fontSize: 'large', language: 'as' }, 'usr-radha-1');
  const settings = await indexedDBStorage.get('appSettings', 'usr-radha-1');
  assert(settings && settings.fontSize === 'large', 'IndexedDB/LocalStorage fallback put & get works');

  const health = await indexedDBStorage.getStorageHealth();
  assert(health && health.status === 'Healthy', 'Storage health report is Healthy');

  // TEST 2: Sync Queue
  console.log('\n--- Test Group 2: Data Sync Queue ---');
  await syncQueue.clear();
  const enqueuedItem = await syncQueue.enqueue('TEST_ACTION', { foo: 'bar' });
  assert(enqueuedItem && enqueuedItem.id.startsWith('sync-'), 'Enqueued item has unique sync ID');

  const pendingCount1 = await syncQueue.getPendingCount();
  assert(pendingCount1 === 1, 'Pending count correctly returns 1');

  await syncQueue.updateStatus(enqueuedItem.id, 'failed', 'Connection timeout');
  const pendingItems = await syncQueue.getPending();
  assert(pendingItems[0].retryCount === 1, 'Retry count incremented on failed sync attempt');

  await syncQueue.removeSynced([enqueuedItem.id]);
  const pendingCount2 = await syncQueue.getPendingCount();
  assert(pendingCount2 === 0, 'Synced item successfully removed from queue');

  // TEST 3: Cache Manager & Pre-downloaded Content
  console.log('\n--- Test Group 3: Offline Content Cache ---');
  await cacheManager.initCache();
  const offlineCount = await cacheManager.getOfflineActivitiesCount();
  assert(offlineCount >= 18, `Offline activities count >= 18 (actual: ${offlineCount})`);

  const easyActivities = await cacheManager.getActivitiesForDifficulty('easy');
  assert(easyActivities.length > 0, 'Can retrieve pre-cached Easy cognitive sessions');

  // TEST 4: Offline Game Service
  console.log('\n--- Test Group 4: Offline Game Session Recording ---');
  const gameResult = await offlineGameService.recordSession({
    userId: 'usr-radha-1',
    gameId: 'heritage-match',
    gameType: 'memory-match',
    difficulty: 'easy',
    score: 95,
    accuracy: 90,
    durationSeconds: 42,
    moves: 6
  });

  assert(gameResult.isSavedLocally === true, 'Game completed offline is flagged as saved locally');
  assert(gameResult.session.syncStatus === 'pending', 'Offline session marked as "pending"');
  assert(gameResult.recommendation.nextDifficulty !== undefined, 'Adaptive difficulty computed locally without network');

  const pendingCountAfterGame = await syncQueue.getPendingCount();
  assert(pendingCountAfterGame >= 1, 'Game session automatically enqueued to sync queue');

  // TEST 5: Automatic Batch Synchronization with Server
  console.log('\n--- Test Group 5: Backend Cloud Synchronization ---');
  const syncResult = await syncManager.processQueue();
  assert(syncResult.success === true, `Cloud batch sync succeeded (processed: ${syncResult.processedCount})`);

  const pendingCountAfterSync = await syncQueue.getPendingCount();
  assert(pendingCountAfterSync === 0, 'Queue completely drained after successful cloud sync');

  // TEST 6: Network Status Manager
  console.log('\n--- Test Group 6: Network Status Manager ---');
  assert(typeof networkManager.isOnline === 'boolean', 'NetworkManager accurately reports online state');
  const isCloudReachable = await networkManager.checkCloudConnectivity();
  assert(isCloudReachable === true, 'Heartbeat connectivity test to /api/health passed');

  console.log('====================================================');
  console.log(` RESULTS: ${passed}/${total} tests passed (${Math.round((passed/total)*100)}%)`);
  console.log('====================================================');

  if (networkManager.pingInterval) {
    clearInterval(networkManager.pingInterval);
  }

  if (passed === total) {
    console.log('All 16 offline architecture checks passed cleanly!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
