/**
 * Enhanced Audio & Voice Service for MIND AI - NER
 * Provides acoustic chimes and senior-friendly multilingual Speech Synthesis & Recognition.
 * Includes voice detection, regional accent fallback, and auto-voice assistance.
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.voices = [];
    this.autoVoiceEnabled = true;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    try {
      this.voices = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
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
   * Resolve best available TTS Voice for the requested language code
   */
  getBestVoiceForLanguage(langCode) {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    // Mapping regional NER languages to phonetic target voices
    const targetLocales = {
      as: ['as-IN', 'bn-IN', 'hi-IN', 'en-IN'],
      bn: ['bn-IN', 'hi-IN', 'en-IN'],
      brx: ['hi-IN', 'en-IN'],
      mni: ['hi-IN', 'bn-IN', 'en-IN'],
      kha: ['en-IN', 'hi-IN'],
      lus: ['en-IN', 'hi-IN'],
      grt: ['en-IN', 'hi-IN'],
      trp: ['bn-IN', 'hi-IN', 'en-IN'],
      nag: ['en-IN', 'hi-IN'],
      en: ['en-IN', 'en-GB', 'en-US']
    };

    const candidates = targetLocales[langCode] || ['en-IN', 'en-US'];

    for (const locale of candidates) {
      const match = this.voices.find(v => v.lang === locale || v.lang.startsWith(locale.split('-')[0]));
      if (match) return match;
    }

    // Default fallback to first voice with Indian or English accent
    return this.voices.find(v => v.lang.includes('IN')) || this.voices[0] || null;
  }

  /**
   * Web Speech API - Text to Speech with Elderly Pace & Tone
   */
  speakText(text, lang = 'en', onStart, onEnd) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;

    // Remove any special emoji / HTML before speaking for clean audio
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
      .replace(/[•*#]/g, ' ')
      .trim();

    if (!cleanText) return;

    window.speechSynthesis.cancel(); // Cancel previous utterances to avoid overlapping

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.85; // Calming, slower elderly pace
    utterance.pitch = 1.05; // Friendly, warm pitch

    const voice = this.getBestVoiceForLanguage(lang);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang === 'en' ? 'en-IN' : (lang === 'bn' || lang === 'as' ? 'bn-IN' : 'hi-IN');
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Alias for speakText to ensure backwards and cross-component compatibility
   */
  speak(text, lang = 'en', onStart, onEnd) {
    return this.speakText(text, lang, onStart, onEnd);
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
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
        as: 'bn-IN', // Bengali-Assamese phonetic model
        bn: 'bn-IN',
        hi: 'hi-IN',
        en: 'en-IN',
        brx: 'hi-IN',
        nag: 'en-IN',
        kha: 'en-IN',
        lus: 'en-IN',
        grt: 'en-IN',
        trp: 'bn-IN',
        mni: 'hi-IN'
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
