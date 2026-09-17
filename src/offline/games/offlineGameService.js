/**
 * MIRA NER - Offline Game Service
 * Ensures all 8 cognitive activities execute and record results 100% locally.
 * Preserves patient progress during rural network disconnects.
 * Automatically marks results as "pending" and enqueues them for cloud sync upon reconnection.
 */

import { indexedDBStorage } from '../storage/indexedDBStorage.js';
import { syncQueue } from '../sync/syncQueue.js';
import { syncManager } from '../sync/syncManager.js';
import { networkManager } from '../network/networkManager.js';

class OfflineGameService {
  /**
   * Record a completed cognitive game session locally
   */
  async recordSession({
    userId,
    patientId,
    gameId,
    gameType,
    difficulty = 'easy',
    score = 80,
    accuracy = 80,
    responseTimeMs = 0,
    responseTime = 0,
    errors = 0,
    durationSeconds = 60,
    sessionDuration = 60,
    moves = 0,
    attempts = 1
  }) {
    const activeUserId = userId || patientId || localStorage.getItem('mira_active_user_id') || 'usr-radha-1';
    const computedResponseTime = Math.max(0, Math.round(responseTimeMs || responseTime || 0));
    const computedDuration = Math.max(1, Math.round(durationSeconds || sessionDuration || 1));
    const computedAccuracy = Math.max(0, Math.min(100, Math.round(accuracy)));
    const computedErrors = Math.max(0, Math.round(errors || 0));
    const computedScore = Math.max(0, Math.min(100, Math.round(score)));

    const session = {
      id: 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      sessionId: 'sess-' + Date.now(),
      patientId: activeUserId,
      userId: activeUserId,
      gameId: gameId || gameType,
      gameType: gameType || 'memory-match',
      difficulty,
      score: computedScore,
      accuracy: computedAccuracy,
      responseTimeMs: computedResponseTime,
      responseTime: computedResponseTime,
      errors: computedErrors,
      durationSeconds: computedDuration,
      sessionDuration: computedDuration,
      moves,
      attempts,
      completedAt: new Date().toISOString(),
      syncStatus: 'pending' // Marked pending until syncManager confirms cloud upload
    };

    // 1. Save to local IndexedDB store (and fallback localStorage)
    await indexedDBStorage.put('gameSessions', session);
    await indexedDBStorage.put('gameResults', {
      id: 'res-' + session.id,
      sessionId: session.id,
      gameType: session.gameType,
      score: session.score,
      accuracy: session.accuracy,
      responseTimeMs: session.responseTimeMs,
      errors: session.errors,
      durationSeconds: session.durationSeconds,
      timestamp: session.completedAt
    });

    // 2. Queue for cloud synchronization
    await syncQueue.enqueue('GAME_SESSION', session);

    // 3. Compute local adaptive recommendation without network dependency
    const recommendation = this.computeLocalAdaptiveRecommendation(gameType, difficulty, accuracy, score);

    // 4. If online, trigger background sync in parallel (never blocks the UI)
    if (networkManager.isOnline) {
      syncManager.processQueue().catch(() => {});
    }

    return {
      session,
      recommendation,
      isSavedLocally: true,
      syncStatus: 'pending'
    };
  }

  /**
   * 100% Local adaptive difficulty recommendation heuristic
   * Adjusts pacing calmly without clinical stress or network calls
   */
  computeLocalAdaptiveRecommendation(gameType, currentDifficulty, accuracy, score) {
    let nextDifficulty = currentDifficulty;
    let rationale = 'Maintaining a calm, steady rhythm.';

    if (accuracy < 50 || score < 40) {
      nextDifficulty = currentDifficulty === 'hard' ? 'medium' : 'easy';
      rationale = 'Adjusted to a softer, relaxing pace for peaceful comfort.';
    } else if (accuracy >= 85 && score >= 80) {
      nextDifficulty = currentDifficulty === 'easy' ? 'medium' : 'hard';
      rationale = 'Wonderful steady focus! Stepping gently forward.';
    }

    return {
      gameType,
      currentDifficulty,
      nextDifficulty,
      rationale,
      confidence: 0.95,
      isOfflineGenerated: true
    };
  }

  /**
   * Retrieve all game sessions for a user from local storage
   */
  async getLocalGameSessions(userId) {
    const all = await indexedDBStorage.getAll('gameSessions');
    const uid = userId || localStorage.getItem('mira_active_user_id') || 'usr-radha-1';
    return (all || []).filter((s) => s.userId === uid || s.patientId === uid);
  }
}

export const offlineGameService = new OfflineGameService();
export default offlineGameService;
