import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Disclaimer() {
  const { t } = useApp();

  return (
    <aside className="disclaimer-banner" role="complementary" aria-label="Medical Disclaimer">
      <AlertTriangle size={22} className="shrink-0" style={{ color: '#d97706', marginTop: '2px' }} />
      <div>
        <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '2px', color: '#92400e' }}>
          {t.disclaimerTitle}
        </strong>
        <p style={{ margin: 0, lineHeight: 1.45, color: '#78350f' }}>
          {t.disclaimerText}
        </p>
      </div>
    </aside>
  );
}
