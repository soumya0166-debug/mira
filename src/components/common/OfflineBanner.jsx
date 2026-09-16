import React, { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OfflineBanner() {
  const { isOnline, syncStatus, pendingCount, t } = useApp();
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      setShowReconnected(false);
    } else if (wasOfflineRef.current) {
      // Transition from offline to online
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        wasOfflineRef.current = false;
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  // When offline: show gentle, reassuring non-blocking notification
  if (!isOnline) {
    return (
      <div 
        className="offline-banner" 
        style={{
          backgroundColor: '#eff6ff',
          borderColor: '#bfdbfe',
          color: '#1e40af',
          borderLeft: '4px solid #3b82f6',
          borderRadius: '12px',
          padding: '0.65rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.9rem'
        }}
      >
        <WifiOff size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
        <span>
          <strong>{t.common?.offlineActive || 'Offline Mode'}:</strong> {t.common?.offlineNotice || 'Your cognitive activities, routines, and memories are saved securely on this device. Everything will sync automatically when you reconnect.'}
        </span>
      </div>
    );
  }

  // When reconnected: show temporary sync transition notice
  if (showReconnected) {
    const isSyncing = syncStatus === 'syncing' || pendingCount > 0;
    return (
      <div 
        className="offline-banner" 
        style={{
          backgroundColor: isSyncing ? '#fefce8' : '#f0fdf4',
          borderColor: isSyncing ? '#fef08a' : '#bbf7d0',
          color: isSyncing ? '#854d0e' : '#166534',
          borderLeft: `4px solid ${isSyncing ? '#eab308' : '#22c55e'}`,
          borderRadius: '12px',
          padding: '0.65rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease'
        }}
      >
        {isSyncing ? (
          <>
            <RefreshCw size={18} className="spin-icon" style={{ color: '#ca8a04', flexShrink: 0 }} />
            <span>
              <strong>Back Online:</strong> Synchronizing your progress with cloud vault…
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
            <span>
              <strong>All progress synced:</strong> Your activities are safely updated.
            </span>
          </>
        )}
      </div>
    );
  }

  // When normal online: return null to keep screen calm and uncluttered for elderly patients
  return null;
}
