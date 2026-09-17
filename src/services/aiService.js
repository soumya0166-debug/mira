/**
 * Secure AI Service for MIND AI - NER
 * Communicates with the secure backend Express API (/api/gemini/*).
 * ZERO API keys are ever stored or exposed in client-side source code.
 */

import { authService } from './authService';
import { networkManager } from '../offline/network/networkManager';

class AIService {
  /**
   * Send user message to MIRA AI via secure server route
   */
  async chatWithMira(message, context = {}) {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('mira_token') || '';

    // If device is offline, immediately utilize local companion fallback without network delay
    if (!networkManager.isOnline) {
      return this.getLocalFallback(message, user, context, true);
    }

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': user?.id || ''
        },
        body: JSON.stringify({
          message,
          context: {
            preferredName: user?.preferredName || user?.name || 'Friend',
            memories: context.memories || [],
            routines: context.routines || [],
            reminders: context.reminders || []
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.reply,
          source: data.source,
          timestamp: data.timestamp
        };
      }
    } catch (err) {
      console.warn('Backend chat unreachable, engaging local client fallback:', err.message);
    }

    // Client-side fallback if server is unreachable
    return this.getLocalFallback(message, user, context);
  }

  /**
   * Request adaptive difficulty recommendation from server
   */
  async getAdaptiveDifficulty(gameType, currentDifficulty = 'medium', recentSessions = []) {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('mira_token') || '';

    try {
      const response = await fetch('/api/gemini/adaptive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': user?.id || ''
        },
        body: JSON.stringify({
          gameType,
          currentDifficulty,
          recentSessions
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Adaptive API call failed, using client heuristic:', err.message);
    }

    // Fallback heuristic:
    if (recentSessions.length === 0) {
      return {
        nextDifficulty: 'easy',
        rationale: 'Starting at a gentle pace for comfort and ease.',
        confidence: 0.9
      };
    }

    const avgAccuracy = recentSessions.reduce((acc, s) => acc + (s.accuracy || 70), 0) / recentSessions.length;
    let nextDifficulty = currentDifficulty;
    let rationale = 'Maintaining a calm, steady rhythm.';

    if (avgAccuracy < 50) {
      nextDifficulty = currentDifficulty === 'hard' ? 'medium' : 'easy';
      rationale = 'Adjusted to a softer pace to keep your experience joyful and relaxing.';
    } else if (avgAccuracy >= 85) {
      nextDifficulty = currentDifficulty === 'easy' ? 'medium' : 'hard';
      rationale = 'Great steady focus! Stepping gently forward.';
    }

    return {
      nextDifficulty,
      rationale,
      confidence: 0.95
    };
  }

  /**
   * Resilient local fallback for MIRA
   */
  getLocalFallback(message, user, context, isOffline = false) {
    const q = (message || '').toLowerCase();
    const name = user?.preferredName || 'Dadi';
    const offlinePrefix = isOffline
      ? "You're offline. Core cognitive activities and your saved memories are fully accessible. "
      : "";

    if (q.includes('routine') || q.includes('schedule') || q.includes('today')) {
      if (context.routines && context.routines.length > 0) {
        const item = context.routines[0];
        return {
          reply: `${offlinePrefix}You have "${item.title}" coming up at ${item.time || '10:00 AM'}. Take your time, there is no hurry.`,
          source: 'local-companion'
        };
      }
      return {
        reply: `${offlinePrefix}Today is calm and peaceful, ${name}. You can enjoy your morning tea and listen to sweet music.`,
        source: 'local-companion'
      };
    }

    if (q.includes('memory') || q.includes('remember') || q.includes('story')) {
      if (context.memories && context.memories.length > 0) {
        return {
          reply: `${offlinePrefix}You have lovely memories saved, like "${context.memories[0].title}". Would you like to look at the pictures?`,
          source: 'local-companion'
        };
      }
      return {
        reply: `${offlinePrefix}Your memory album is ready. Would you like to save a story of your hometown or children?`,
        source: 'local-companion'
      };
    }

    if (q.includes('visitor') || q.includes('who is coming') || q.includes('family')) {
      return {
        reply: `${offlinePrefix}Your daughter Ananya will be checking in with you this evening with warm tea.`,
        source: 'local-companion'
      };
    }

    if (q.includes('game') || q.includes('play') || q.includes('activity')) {
      return {
        reply: `${offlinePrefix}Let us play the gentle Heritage Memory Match with Kaziranga and Hornbill symbols.`,
        source: 'local-companion'
      };
    }

    return {
      reply: `${offlinePrefix}I am right here with you, ${name}. Everything is peaceful today. How can I help you?`,
      source: 'local-companion'
    };
  }
}

export const aiService = new AIService();
export default aiService;
