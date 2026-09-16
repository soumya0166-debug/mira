import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import audioService from '../../services/audioService';

export default function AddReminderModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [period, setPeriod] = useState('morning');
  const [category, setCategory] = useState('Medication');
  const [instructions, setInstructions] = useState('');
  const [icon, setIcon] = useState('💊');

  if (!isOpen) return null;

  const ICONS = ['💊', '💧', '🥗', '🚶‍♀️', '🧩', '🪴', '🫖', '🌙'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      time,
      period,
      category,
      instructions,
      icon
    });

    audioService.playSuccessChime();
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-routine-title">
      <div className="modal-dialog">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 id="add-routine-title" style={{ margin: 0, fontSize: '1.35rem' }}>
            Add Daily Routine Reminder
          </h2>
          <button 
            onClick={onClose} 
            aria-label="Close"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--wine-50)',
              color: 'var(--wine-800)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
              Routine Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Afternoon Hydration Glass, Heart Medication"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--ivory-border)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
                Scheduled Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 08:30 AM"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--ivory-border)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
                Time of Day
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--ivory-border)',
                  fontSize: '0.95rem',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="morning">Morning (🌅)</option>
                <option value="afternoon">Afternoon (☀️)</option>
                <option value="evening">Evening (🌇)</option>
                <option value="night">Night (🌙)</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--ivory-border)',
                  fontSize: '0.95rem',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Medication">Medication</option>
                <option value="Meals & Hydration">Meals & Hydration</option>
                <option value="Activity">Activity / Fresh Air</option>
                <option value="Cognitive Stimulation">Brain Game / Memory</option>
                <option value="Movement">Gentle Walk / Stretch</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
                Icon Symbol
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {ICONS.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setIcon(sym)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: icon === sym ? 'var(--pink-100)' : 'var(--ivory-soft)',
                      border: '1.5px solid ' + (icon === sym ? 'var(--wine-700)' : 'var(--ivory-border)'),
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
              Gentle Instructions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Take with a tall glass of warm water after eating porridge."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--ivory-border)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={18} /> Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
