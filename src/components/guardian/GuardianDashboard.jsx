import React, { useState } from 'react';
import { 
  Shield, 
  Phone, 
  CalendarCheck, 
  Heart, 
  BookOpen, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Smile, 
  AlertCircle,
  FileText,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CloudUpload,
  CheckCircle2,
  Activity,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';
import CDRAssessmentModal from '../wellness/CDRAssessmentModal';

export default function GuardianDashboard() {
  const { 
    patient, 
    guardian, 
    routines, 
    memories, 
    gameSessions, 
    careNotes, 
    addCareNote,
    exportBackup,
    importBackup,
    resetToDefaults,
    t,
    isOnline,
    syncStatus,
    lastSyncTime,
    pendingCount,
    offlineActivitiesCount,
    storageHealth,
    syncNow,
    refreshOfflineContent,
    latestCDRAssessment,
    cdrTrend,
    setActiveTab
  } = useApp();

  const [isCDRModalOpen, setIsCDRModalOpen] = useState(false);
  const [isSyncingManual, setIsSyncingManual] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [isRefreshingContent, setIsRefreshingContent] = useState(false);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteMood, setNewNoteMood] = useState('Cheerful & Bright 😊');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const completedRoutines = routines.filter((r) => r.completedToday);
  const adherenceRate = routines.length > 0 ? Math.round((completedRoutines.length / routines.length) * 100) : 0;

  // Extract recent reactions across all memories
  const allReactions = memories.flatMap((m) => 
    (m.reactions || []).map((r) => ({ ...r, memoryTitle: m.title }))
  );

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    addCareNote({
      author: `${guardian.name || 'Caregiver'} (${guardian.relation || 'Family'})`,
      mood: newNoteMood,
      content: newNoteContent
    });

    setNewNoteContent('');
    setShowNoteForm(false);
    audioService.playSuccessChime();
  };

  const handleExportData = () => {
    const jsonString = exportBackup();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mira-ner-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    audioService.playSuccessChime();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        const ok = importBackup(content);
        if (ok) {
          setImportStatus('Data successfully restored!');
          audioService.playSuccessChime();
        } else {
          setImportStatus('Failed to parse backup file. Please ensure it is valid JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all account data to a fresh clean state?')) {
      resetToDefaults();
      audioService.playSoftClick();
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Shield size={26} style={{ color: 'var(--wine-700)' }} />
          <h1 style={{ margin: 0 }}>{t.guardian.title}</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          {t.guardian.subtitle}
        </p>
      </div>

      {/* Mandatory Non-Medical Disclaimer Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '0.85rem',
          padding: '0.85rem 1.15rem',
          marginBottom: '1.5rem',
          fontSize: '0.88rem',
          color: '#92400e',
          lineHeight: 1.45
        }}
      >
        <AlertCircle size={20} style={{ color: '#d97706', flexShrink: 0 }} />
        <div>
          <strong style={{ color: '#78350f' }}>Important Notice: MIRA/PCPS is not a medical diagnosis.</strong> This platform provides assistive wellness tools and cognitive engagement routines. It does not diagnose dementia or substitute for medical professional consultation.
        </div>
      </div>

      {/* Emergency Quick Action & Patient Overview Card */}
      <div 
        className="mira-card" 
        style={{
          backgroundColor: 'linear-gradient(135deg, #ffffff 0%, var(--pink-50) 100%)',
          borderLeft: '5px solid var(--wine-700)',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--pink-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}
          >
            {patient?.avatar || '👵'}
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.2rem', color: 'var(--wine-900)', fontSize: '1.25rem' }}>
              {patient?.name || 'Radha Barua'} {patient?.preferredName ? `(${patient.preferredName})` : ''}
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {patient?.age ? `Age ${patient.age} • ` : ''}{patient?.childhoodHometown ? `Hometown: ${patient.childhoodHometown} • ` : ''}Doctor: {patient?.doctorInfo?.name || 'Assigned Family Physician'}
            </p>
          </div>
        </div>

        {/* ICE Call Button */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={`tel:${patient?.emergencyContact?.phone || ''}`}
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <Phone size={18} /> {t.guardian?.callDoctor || 'Call Doctor / ICE'}
          </a>
        </div>
      </div>

      {/* ── Caregiver Offline & Cloud Synchronization Status Card (Req #18) ── */}
      <div 
        className="mira-card" 
        style={{
          marginBottom: '1.75rem',
          borderLeft: `5px solid ${isOnline ? '#10b981' : '#3b82f6'}`,
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: isOnline ? '#ecfdf5' : '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isOnline ? '#059669' : '#2563eb'
              }}
            >
              {isOnline ? <Wifi size={22} /> : <WifiOff size={22} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                {t.guardian?.offlineHubTitle || 'Offline-First Data & Synchronization Hub'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t.guardian?.offlineHubDesc || 'Guaranteed zero progress loss in low-connectivity North Eastern regions'}
              </p>
            </div>
          </div>

          {/* Action Buttons: Sync Now & Download Content */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={async () => {
                setIsRefreshingContent(true);
                const count = await refreshOfflineContent();
                setIsRefreshingContent(false);
                setSyncFeedback(`Downloaded offline library: ${count} activities ready without internet.`);
                audioService.playSuccessChime();
                setTimeout(() => setSyncFeedback(null), 4000);
              }}
              disabled={isRefreshingContent}
              className="btn-secondary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              title="Pre-cache cognitive activities and language assets for offline use"
            >
              <Download size={16} /> {isRefreshingContent ? (t.guardian?.downloading || 'Downloading…') : (t.guardian?.downloadOffline || 'Download Offline Content')}
            </button>

            <button
              onClick={async () => {
                setIsSyncingManual(true);
                setSyncFeedback(null);
                const res = await syncNow();
                setIsSyncingManual(false);
                if (res.success) {
                  setSyncFeedback(`Sync complete: ${res.synced} items synchronized to central server.`);
                  audioService.playSuccessChime();
                } else {
                  setSyncFeedback(`Sync deferred: stored locally in offline queue.`);
                }
                setTimeout(() => setSyncFeedback(null), 4000);
              }}
              disabled={isSyncingManual}
              className="btn-primary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              title="Manually trigger immediate synchronization with PostgreSQL backend"
            >
              <CloudUpload size={16} /> {isSyncingManual ? (t.guardian?.syncing || 'Syncing…') : (t.guardian?.syncNow || 'Sync to Cloud Now')}
            </button>
          </div>
        </div>

        {/* Sync Feedback Message */}
        {syncFeedback && (
          <div
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* 5-Metric Status Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            textAlign: 'center'
          }}
        >
          {/* Connection */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Connection</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem' }}>{isOnline ? '🟢' : '🔵'}</span>
              <strong style={{ fontSize: '0.95rem', color: isOnline ? '#15803d' : '#1d4ed8' }}>
                {isOnline ? 'Online' : 'Offline'}
              </strong>
            </div>
          </div>

          {/* Last Sync */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Last Sync</span>
            <div style={{ marginTop: '0.25rem' }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ready to Sync'}
              </strong>
            </div>
          </div>

          {/* Pending Activities */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Sync</span>
            <div style={{ marginTop: '0.25rem' }}>
              <strong style={{ fontSize: '0.95rem', color: pendingCount > 0 ? '#b91c1c' : '#15803d' }}>
                {pendingCount > 0 ? `${pendingCount} items` : '0 (Synced)'}
              </strong>
            </div>
          </div>

          {/* Offline Content */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Offline Content</span>
            <div style={{ marginTop: '0.25rem' }}>
              <strong style={{ fontSize: '0.95rem', color: '#0e4a42' }}>
                {offlineActivitiesCount || 18} activities
              </strong>
            </div>
          </div>

          {/* Local Storage */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Local Storage</span>
            <div style={{ marginTop: '0.25rem' }}>
              <strong style={{ fontSize: '0.95rem', color: '#15803d' }}>
                {storageHealth?.status || 'Healthy'} ({storageHealth?.usageMB || '2.4'} MB)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Status Highlights Grid */}
      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        {/* Routine Adherence */}
        <div className="mira-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📅</span>
            <span className="badge badge-wine">{adherenceRate}%</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem', color: 'var(--wine-900)' }}>
            {t.guardian.todayAdherence}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            {completedRoutines.length} of {routines.length} items checked off today.
          </p>
        </div>

        {/* Joy & Emotion Reactions */}
        <div className="mira-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌸</span>
            <span className="badge badge-pink">{allReactions.length} Total</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem', color: 'var(--wine-900)' }}>
            {t.guardian.recentReactions}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Memories and voice notes sparking joy or storytelling.
          </p>
        </div>

        {/* Cognitive Stimulation Sessions */}
        <div className="mira-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧩</span>
            <span className="badge badge-wine">{gameSessions.length} Played</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem', color: 'var(--wine-900)' }}>
            Recent Brain Games
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Card matching, sequence, and word pairing logs.
          </p>
        </div>
      </div>

      {/* ── CDR-Inspired Cognitive Functional Screening Summary Card ── */}
      <div 
        className="mira-card" 
        style={{
          marginBottom: '1.75rem',
          borderLeft: '5px solid var(--wine-700)',
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
                Screening Protocol
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Non-diagnostic functional evaluation
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem', color: 'var(--wine-900)' }}>
              CDR-Inspired Cognitive Functional Screening
            </h3>
            {latestCDRAssessment ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sum of Boxes: </span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--wine-900)' }}>
                    {latestCDRAssessment.total_score.toFixed(1)} / 18
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Observed Level: </span>
                  <strong style={{ fontSize: '0.95rem', color: '#0284c7' }}>
                    {latestCDRAssessment.observed_level}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trend: </span>
                  <strong style={{ fontSize: '0.95rem', color: cdrTrend?.color ?? '#2563eb' }}>
                    {cdrTrend?.status ?? 'Stable'}
                  </strong>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No clinical functional screening recorded yet. Tap "Conduct Screening" to log the initial baseline.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              onClick={() => setActiveTab('wellness')}
              className="btn-secondary"
              style={{ padding: '0.55rem 0.95rem', fontSize: '0.88rem' }}
            >
              View Full Profile & Radar
            </button>
            <button
              onClick={() => setIsCDRModalOpen(true)}
              className="btn-primary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ClipboardList size={16} /> Conduct Screening
            </button>
          </div>
        </div>
      </div>

      {/* Caregiver Observation Journal */}
      <div className="mira-card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--wine-900)', margin: '0 0 0.2rem' }}>
              {t.guardian.careNotes}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Record daily observations on mood, sleep, clarity, or food intake.
            </p>
          </div>

          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
          >
            <Plus size={16} /> {showNoteForm ? 'Hide Form' : t.guardian.addNote}
          </button>
        </div>

        {/* Note Writing Form */}
        {showNoteForm && (
          <form onSubmit={handleAddNote} style={{ marginBottom: '1.5rem', backgroundColor: 'var(--ivory-soft)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                Observed Mood / State
              </label>
              <select
                value={newNoteMood}
                onChange={(e) => setNewNoteMood(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--ivory-border)',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Cheerful & Bright 😊">Cheerful & Bright 😊</option>
                <option value="Calm & Reflective 🕊️">Calm & Reflective 🕊️</option>
                <option value="Nostalgic & Talkative 🗣️">Nostalgic & Talkative 🗣️</option>
                <option value="Tired or Restless 😴">Tired or Restless 😴</option>
                <option value="Needs Extra Comfort ❤️">Needs Extra Comfort ❤️</option>
              </select>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                Note Details
              </label>
              <textarea
                rows={3}
                required
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="e.g., Radha enjoyed looking at the 1984 Shimla photo and smiled when hearing the train sound."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--ivory-border)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowNoteForm(false)} className="btn-outline" style={{ fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ fontSize: '0.85rem' }}>
                Save Care Note
              </button>
            </div>
          </form>
        )}

        {/* Existing Notes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {careNotes.slice(0, 5).map((note) => (
            <div 
              key={note.id}
              style={{
                backgroundColor: 'var(--ivory-soft)',
                border: '1px solid var(--ivory-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1.1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--wine-900)' }}>
                  {note.author}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-pink" style={{ fontSize: '0.75rem' }}>
                    {note.mood}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {note.date}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                {note.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Backup, Restore & Offline Resilience */}
      <div className="mira-card">
        <h3 style={{ fontSize: '1.2rem', color: 'var(--wine-900)', margin: '0 0 0.5rem' }}>
          Offline Data Management & Backup
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          MIRA NER runs completely offline on this browser. Export a portable JSON backup file to ensure precious memories and care notes are never lost.
        </p>

        {importStatus && (
          <div 
            style={{
              padding: '0.65rem 1rem',
              backgroundColor: importStatus.includes('successfully') ? '#dcfce7' : '#fee2e2',
              color: importStatus.includes('successfully') ? '#166534' : '#b91c1c',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}
          >
            {importStatus}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={handleExportData} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            <Download size={16} /> {t.guardian.exportBackup}
          </button>

          <label 
            className="btn-secondary" 
            style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: '40px' }}
          >
            <Upload size={16} /> {t.guardian.importBackup}
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportFile} 
              style={{ display: 'none' }} 
            />
          </label>

          <button 
            onClick={handleResetDemo} 
            className="btn-outline" 
            style={{ fontSize: '0.85rem', color: '#b91c1c', borderColor: '#fca5a5' }}
          >
            <RotateCcw size={16} /> {t.guardian.resetData}
          </button>
        </div>
      </div>
      {/* CDR Screening Modal */}
      <CDRAssessmentModal
        isOpen={isCDRModalOpen}
        onClose={() => setIsCDRModalOpen(false)}
      />
    </div>
  );
}
