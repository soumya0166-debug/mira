import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  ClipboardCheck,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  ASSESSMENT_DOMAINS, 
  calculateCDRScore, 
  MANDATORY_DISCLAIMER 
} from '../../services/cdrScoringEngine';

export default function CDRAssessmentModal({ isOpen, onClose }) {
  const { saveCDRAssessment, patient, guardian, t } = useApp();

  // State for the 6 domain scores
  const [domainScores, setDomainScores] = useState({
    memory: 0.5,
    orientation: 0.5,
    judgment_problem_solving: 0.5,
    community_affairs: 0.5,
    home_hobbies: 0.5,
    personal_care: 0.0
  });

  const [assessorName, setAssessorName] = useState(
    guardian?.name ? `${guardian.name} (${guardian.relation || 'Guardian'})` : 'Family Caregiver'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  // Real-time calculation of Sum of Boxes
  const currentPreview = calculateCDRScore(domainScores);

  const handleScoreSelect = (domainKey, scoreValue) => {
    setDomainScores(prev => ({
      ...prev,
      [domainKey]: scoreValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = saveCDRAssessment({
      ...domainScores,
      assessor: assessorName,
      notes: notes.trim()
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="mira-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '0.4rem',
            borderRadius: '50%'
          }}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.25rem', paddingRight: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem' }}>📋</span>
            <h2 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--wine-900)' }}>
              {t.wellness.protocolTitle || 'CDR-Inspired Cognitive Functional Screening'}
            </h2>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            {t.wellness.protocolDesc || `Evaluate observed daily function across 6 core domains for ${patient?.preferredName || patient?.name || 'the individual'}.`}
          </p>
        </div>

        {/* Prominent Mandatory Screening Disclaimer */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '0.75rem',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: '#92400e',
            lineHeight: 1.45
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#b45309' }} />
          <div>
            <strong>Non-Diagnostic Screening Protocol:</strong> {MANDATORY_DISCLAIMER}
          </div>
        </div>

        {/* Live Score Preview Header Banner */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            backgroundColor: currentPreview.level_info.bg,
            border: `1px solid ${currentPreview.level_info.border}`,
            borderRadius: '1rem',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Sum of Boxes (CDR-SB Style)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--wine-900)' }}>
                {currentPreview.total_score.toFixed(1)}
              </span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                / 18
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Observed Level
            </div>
            <span 
              className="badge"
              style={{
                backgroundColor: '#ffffff',
                color: currentPreview.level_info.color,
                borderColor: currentPreview.level_info.border,
                fontSize: '0.95rem',
                fontWeight: 700,
                padding: '0.4rem 0.9rem',
                marginTop: '0.2rem',
                display: 'inline-block'
              }}
            >
              {currentPreview.observed_level}
            </span>
          </div>
        </div>

        {/* 6 Assessment Domains */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2rem' }}>
            {ASSESSMENT_DOMAINS.map((domain, index) => {
              const currentScore = domainScores[domain.key];
              const question = domain.questions[0];

              return (
                <div 
                  key={domain.key}
                  style={{
                    border: '1px solid #f1f5f9',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    backgroundColor: '#fafbfc'
                  }}
                >
                  {/* Domain Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{domain.icon}</span>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--wine-900)' }}>
                        {domain.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500 }}>({domain.code})</span>
                      </h3>
                    </div>
                    <span 
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--pink-200)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--wine-800)'
                      }}
                    >
                      {currentScore.toFixed(1)} / 3
                    </span>
                  </div>

                  <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {question.prompt}
                  </p>

                  {/* 5 Options Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                    {question.options.map((opt) => {
                      const isSelected = currentScore === opt.score;
                      return (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => handleScoreSelect(domain.key, opt.score)}
                          style={{
                            textAlign: 'left',
                            padding: '0.65rem 0.75rem',
                            borderRadius: '0.65rem',
                            border: isSelected ? '2px solid var(--wine-700)' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? '#fff1f2' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: isSelected ? 'var(--wine-900)' : '#334155' }}>
                            {opt.label}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.3 }}>
                            {opt.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Assessor Details & Observation Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
                Assessor / Observer Name
              </label>
              <input
                type="text"
                value={assessorName}
                onChange={(e) => setAssessorName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.6rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--wine-900)' }}>
                Caregiver Clinical Context / Observations
              </label>
              <input
                type="text"
                placeholder="Optional notes regarding mood, sleep, or medication..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.6rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.7rem 1.25rem' }}
            >
              {t.profile?.cancelEdit || 'Cancel'}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.5rem',
                backgroundColor: 'var(--wine-700)',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 size={18} /> {t.common?.playAgain || 'Recorded Successfully'}
                </>
              ) : (
                <>
                  <ClipboardCheck size={18} /> {t.wellness?.recordScreening || 'Save Screening Result'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
