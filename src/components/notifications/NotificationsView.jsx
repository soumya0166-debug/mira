import React, { useState } from 'react';
import { Bell, Check, Clock, Heart, Award, Shield, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NotificationsView() {
  const { t, patient, guardian } = useApp();
  const [readState, setReadState] = useState({
    'notif-1': false,
    'notif-2': false,
    'notif-3': true
  });

  const notifications = [
    {
      id: 'notif-1',
      type: 'medicine',
      title: t.notifications.medicineTitle || 'Blood Pressure & Heart Tablet Reminder',
      message: t.notifications.medicineDesc || 'Time for morning blood pressure tablet with a warm glass of water.',
      time: t.notifications.timeMorning || '08:30 AM',
      icon: '💊'
    },
    {
      id: 'notif-2',
      type: 'caregiver',
      title: `${t.notifications.caregiverNoteTitle || 'Caregiver Note'} (${guardian?.name || 'Ananya'})`,
      message: t.notifications.caregiverNoteDesc || '"Ma, I will visit this evening with your favorite Assam tea biscuits. Take plenty of rest!"',
      time: '09:15 AM',
      icon: '💌'
    },
    {
      id: 'notif-3',
      type: 'achievement',
      title: t.notifications.achievementTitle || 'Cognitive Activity Streak: 5 Days!',
      message: t.notifications.achievementDesc || 'You completed Heritage Memory Match with Kaziranga treasures. Wonderful steady focus.',
      time: t.notifications.timeYesterday || 'Yesterday',
      icon: '🌟'
    }
  ];

  const handleMarkAllAsRead = () => {
    setReadState({
      'notif-1': true,
      'notif-2': true,
      'notif-3': true
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
            <Bell size={20} />
            <span>{t.notifications.tag || 'Gentle Daily Alerts'}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-main)' }}>{t.notifications.title || 'Notifications & Alerts'}</h1>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="mira-btn-secondary"
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          {t.notifications.markAllRead || 'Mark all as read'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map((n) => {
          const isRead = !!readState[n.id];
          return (
            <div
              key={n.id}
              className="mira-card"
              style={{
                padding: '1.25rem',
                borderRadius: '20px',
                borderLeft: isRead ? '1px solid var(--border-subtle)' : '5px solid var(--primary-teal)',
                backgroundColor: isRead ? 'var(--card-bg)' : '#f0fdf4',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{n.title}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.time}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.45 }}>
                  {n.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
