import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import audioService from '../../services/audioService';

export default function VoiceRecorder({ onRecordingComplete, initialAudio = null }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(initialAudio);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone recording not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result;
          setAudioUrl(base64Data);
          if (onRecordingComplete) onRecordingComplete(base64Data);
        };
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      audioService.playSoftClick();
    } catch (err) {
      console.warn('Microphone error, providing simulated friendly voice note:', err);
      setErrorMsg('Microphone unavailable or permission not granted. You can use our simulated voice note instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      audioService.playSuccessChime();
    }
  };

  // Simulated Voice Note generator (in case microphone is not permitted in browser test)
  const useSimulatedVoiceNote = () => {
    // A synthetic comforting audio snippet encoded or synthesized
    // We create a mock audio data url
    const mockAudio = 'simulated_guardian_voice_note';
    setAudioUrl(mockAudio);
    if (onRecordingComplete) onRecordingComplete(mockAudio);
    setErrorMsg(null);
    audioService.playSuccessChime();
  };

  const handlePlayAudio = () => {
    if (audioUrl === 'simulated_guardian_voice_note' || !audioUrl.startsWith('data:audio')) {
      // Play soothing simulated chime narration
      setIsPlaying(true);
      audioService.playReminderChime();
      setTimeout(() => setIsPlaying(false), 2400);
      return;
    }

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    if (onRecordingComplete) onRecordingComplete(null);
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      style={{
        backgroundColor: 'var(--ivory-soft)',
        border: '1.5px dashed var(--pink-300)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Mic size={20} style={{ color: 'var(--wine-700)' }} />
        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--wine-900)' }}>
          Guardian Voice Note
        </h4>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Record a warm message reminding them of who is in the photo or what made this day special.
      </p>

      {errorMsg && (
        <div style={{ fontSize: '0.8rem', color: '#b91c1c', marginBottom: '0.85rem' }}>
          {errorMsg}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={useSimulatedVoiceNote}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
            >
              <Sparkles size={14} /> Add Demo Soothing Voice Note
            </button>
          </div>
        </div>
      )}

      {!audioUrl && (
        <div>
          {isRecording ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '1.1rem'
                }}
              >
                <span 
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#dc2626',
                    animation: 'pulseGlow 1.2s infinite'
                  }} 
                />
                Recording: {formatSeconds(recordingTime)}
              </div>

              <button
                type="button"
                onClick={stopRecording}
                className="btn-primary"
                style={{ backgroundColor: '#dc2626' }}
              >
                <Square size={16} /> Stop Recording
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={startRecording}
                className="btn-primary"
              >
                <Mic size={18} /> Start Recording
              </button>
              <button
                type="button"
                onClick={useSimulatedVoiceNote}
                className="btn-secondary"
                title="Use demo audio without microphone"
              >
                <Sparkles size={16} /> Use Sample Voice
              </button>
            </div>
          )}
        </div>
      )}

      {audioUrl && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePlayAudio}
            className="btn-primary"
            style={{ minWidth: '130px' }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'Pause' : 'Play Note'}</span>
          </button>

          <button
            type="button"
            onClick={resetRecording}
            className="btn-outline"
            title="Re-record"
          >
            <RotateCcw size={16} /> Re-record
          </button>

          <span className="badge badge-success">
            <Check size={14} /> Voice Note Ready
          </span>
        </div>
      )}
    </div>
  );
}
