/**
 * Audio & Speech Service for MIND AI - NER
 * Combines Web Audio chimes with Web Speech API (Synthesis & Recognition).
 * Supports elderly-paced speech synthesis (0.85x - 0.9x speed) and voice input.
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.recognition = null;
    this.isListening = false;
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Gentle Tibetan Singing Bowl Chime for Routine Reminders
   */
  playReminderChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const frequencies = [261.63, 392.00, 523.25]; // C4, G4, C5 soothing harmonic

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const volume = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.3);
      });
    } catch (e) {
      console.warn('Audio playback not allowed yet:', e);
    }
  }

  /**
   * Delicate uplifting success harp arpeggio
   */
  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [329.63, 392.00, 493.88, 659.25]; // E4, G4, B4, E5 (warm major chord)
      const startTime = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + i * 0.09);

        gain.gain.setValueAtTime(0, startTime + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.12, startTime + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + i * 0.09 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime + i * 0.09);
        osc.stop(startTime + i * 0.09 + 1.3);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Melodic Note for Attention Pattern Game
   */
  playMelodyNote(index) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const scale = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      const freq = scale[index % scale.length];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch (e) {
      console.warn('Melody note error:', e);
    }
  }

  playSoftClick() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  /**
   * Web Speech API - Text to Speech
   * Elderly-friendly slower pacing and gentle pitch
   */
  speakText(text, lang = 'en', onStart, onEnd) {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; // Gentle, clear slower pace
    utterance.pitch = 1.05;

    // Match language tag
    const langMap = {
      as: 'as-IN',
      bn: 'bn-IN',
      hi: 'hi-IN',
      en: 'en-IN'
    };
    utterance.lang = langMap[lang] || 'en-IN';

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Web Speech API - Speech Recognition
   */
  startSpeechRecognition({ lang = 'en', onResult, onError, onEnd }) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return null;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      const langMap = {
        as: 'as-IN',
        bn: 'bn-IN',
        hi: 'hi-IN',
        en: 'en-IN'
      };
      this.recognition.lang = langMap[lang] || 'en-IN';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return this.recognition;
    } catch (err) {
      if (onError) onError(err.message);
      return null;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const audioService = new AudioService();
export default audioService;
