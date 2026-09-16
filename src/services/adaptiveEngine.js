/**
 * Adaptive Cognitive Engine for MIND AI - NER
 * Evaluates performance metrics (accuracy, duration, score) without clinical claims.
 * Dynamically paces game difficulty (Easy, Medium, Hard).
 */

import { aiService } from './aiService';
import { storageService } from './storageService';
import { offlineGameService } from '../offline/games/offlineGameService';

class AdaptiveEngine {
  /**
   * Record a completed cognitive activity session
   */
  async recordGameSession({
    userId,
    gameId,
    gameType,
    difficulty,
    score,
    accuracy,
    durationSeconds,
    moves = 0
  }) {
    // 1. Record session through offline-first game service (IndexedDB + Sync Queue)
    const offlineResult = await offlineGameService.recordSession({
      userId,
      gameId,
      gameType,
      difficulty,
      score,
      accuracy,
      durationSeconds,
      moves
    });

    const session = offlineResult.session;

    // 2. Also persist in user's isolated storage for backwards compatibility
    storageService.saveGameSession(session);

    // 3. Return local heuristic recommendation or online AI recommendation if connected
    let recommendation = offlineResult.recommendation;
    try {
      const history = storageService.getGameSessions()
        .filter(s => s.gameType === gameType)
        .slice(-5);
      const onlineRec = await aiService.getAdaptiveDifficulty(
        gameType,
        difficulty,
        history
      );
      if (onlineRec) recommendation = onlineRec;
    } catch {}

    return {
      session,
      recommendation,
      isSavedLocally: true
    };
  }

  /**
   * Get the recommended next difficulty for a game
   */
  async getNextDifficulty(gameType, currentDifficulty = 'medium') {
    const history = storageService.getGameSessions()
      .filter(s => s.gameType === gameType)
      .slice(-5);

    return await aiService.getAdaptiveDifficulty(gameType, currentDifficulty, history);
  }
}

export const adaptiveEngine = new AdaptiveEngine();
export default adaptiveEngine;
