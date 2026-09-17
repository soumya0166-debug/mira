import React, { useState } from 'react';
import { User, Shield, Phone, Heart, Edit3, Check, Stethoscope, Home, Sparkles, LogOut, Users, Lock, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function ProfileView() {
  const { patient, updatePatient, guardian, updateGuardian, mode, switchMode, t,
    currentUser, updateCurrentUser, logout, switchUser, availableUsers,
    memories, routines } = useApp();

  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [patientForm, setPatientForm] = useState(patient);
  const [patientError, setPatientError] = useState('');

  const [isEditingGuardian, setIsEditingGuardian] = useState(false);
  const [guardianForm, setGuardianForm] = useState(guardian);

  // Account / PIN state
  const [showPinForm, setShowPinForm] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleSavePin = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) { setPinError('PIN must be exactly 4 digits.'); return; }
    updateCurrentUser({ pin: newPin });
    setNewPin('');
    setPinError('');
    setPinSuccess(true);
    setShowPinForm(false);
    audioService.playSuccessChime();
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const otherUsers = availableUsers.filter((u) => u.id !== currentUser?.id);

  const handleSavePatient = (e) => {
    e.preventDefault();
    setPatientError('');

    if (patientForm.age !== undefined && patientForm.age !== '') {
      const ageNum = Number(patientForm.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 125) {
        setPatientError('Age must be a valid number between 1 and 125.');
        return;
      }
    }

    if (patientForm.birthYear !== undefined && patientForm.birthYear !== '') {
      const currentYear = new Date().getFullYear();
      const yearNum = Number(patientForm.birthYear);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
        setPatientError(`Birth year must be between 1900 and ${currentYear}.`);
        return;
      }
    }

    updatePatient(patientForm);
    setIsEditingPatient(false);
    audioService.playSuccessChime();
  };

  const handleSaveGuardian = (e) => {
    e.preventDefault();
    updateGuardian(guardianForm);
    setIsEditingGuardian(false);
    audioService.playSuccessChime();
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.35rem' }}>Care Profiles</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          Manage personal preferences, familiar memories, and guardian contacts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* ── Account & Authentication Card ── */}
        {currentUser && (
          <section className="mira-card mira-card-accent" aria-labelledby="account-heading">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.2rem' }}>{currentUser.avatar || '🧑'}</span>
                <div>
                  <h2 id="account-heading" style={{ fontSize: '1.35rem', margin: 0, color: 'var(--wine-900)' }}>
                    {currentUser.name}
                  </h2>
                  <span className="badge badge-wine" style={{ fontSize: '0.75rem' }}>
                    {currentUser.role === 'guardian' ? '🛡️ Guardian / Caregiver' : '❤️ Patient / Self-Care'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { if (window.confirm('Sign out of MIRA NER?')) logout(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
                  backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                  color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>

            {/* Account Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Email Address</span>
                <span style={{ fontWeight: 600, color: 'var(--wine-900)', fontSize: '0.9rem' }}>{currentUser.email}</span>
              </div>
              <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Caring For</span>
                <span style={{ fontWeight: 600, color: 'var(--wine-900)', fontSize: '0.9rem' }}>{currentUser.lovedOneName || patient?.preferredName || '—'}</span>
              </div>
              <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Joined</span>
                <span style={{ fontWeight: 600, color: 'var(--wine-900)', fontSize: '0.9rem' }}>
                  {currentUser.joinedAt ? new Date(currentUser.joinedAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                </span>
              </div>
              <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Care Vault</span>
                <span style={{ fontWeight: 600, color: 'var(--wine-900)', fontSize: '0.9rem' }}>
                  {memories.length} memories · {routines.length} routines
                </span>
              </div>
            </div>

            {/* PIN Change */}
            <div style={{ borderTop: '1px solid var(--ivory-border)', paddingTop: '1rem' }}>
              {pinSuccess && (
                <div style={{ padding: '0.5rem 0.85rem', backgroundColor: 'var(--sage-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--sage-green)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  ✅ PIN updated successfully!
                </div>
              )}
              {!showPinForm ? (
                <button
                  onClick={() => setShowPinForm(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--pink-100)', border: '1px solid var(--pink-200)',
                    color: 'var(--wine-800)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                  }}
                >
                  <KeyRound size={14} /> Change 4-Digit PIN
                </button>
              ) : (
                <form onSubmit={handleSavePin} style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>New 4-Digit PIN</label>
                    <input
                      type="text" inputMode="numeric" maxLength={4}
                      placeholder="e.g. 5678"
                      value={newPin}
                      onChange={(e) => { setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                      style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--ivory-border)', fontSize: '1rem', width: '120px' }}
                    />
                    {pinError && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.2rem' }}>{pinError}</p>}
                  </div>
                  <button type="submit" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', minHeight: '42px' }}>
                    <Check size={15} /> Save PIN
                  </button>
                  <button type="button" onClick={() => { setShowPinForm(false); setNewPin(''); setPinError(''); }}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--ivory-soft)', border: '1px solid var(--ivory-border)', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>

            {/* Switch Account */}
            {otherUsers.length > 0 && (
              <div style={{ borderTop: '1px solid var(--ivory-border)', paddingTop: '1rem', marginTop: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Switch Account</p>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {otherUsers.map((u) => (
                    <button key={u.id} onClick={() => switchUser(u.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--ivory-soft)', border: '1px solid var(--ivory-border)',
                        color: 'var(--wine-800)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{u.avatar}</span> {u.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
        {/* Patient Profile Card */}
        <section className="mira-card" aria-labelledby="patient-profile-heading">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.2rem' }}>{patient.avatar || '👵'}</span>
              <div>
                <h2 id="patient-profile-heading" style={{ fontSize: '1.35rem', margin: 0, color: 'var(--wine-900)' }}>
                  {patient.name} ({patient.preferredName})
                </h2>
                <span className="badge badge-pink" style={{ fontSize: '0.75rem' }}>
                  Loved One / Patient Profile
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingPatient(!isEditingPatient)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
            >
              <Edit3 size={15} /> {isEditingPatient ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditingPatient ? (
            <form onSubmit={handleSavePatient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {patientError && (
                <div style={{ padding: '0.65rem 0.9rem', backgroundColor: '#fef2f2', border: '1.5px solid #f87171', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠️ {patientError}
                </div>
              )}

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Preferred Call Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={patientForm.preferredName}
                    onChange={(e) => setPatientForm({ ...patientForm, preferredName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Age (Years: 1–125)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="125"
                    value={patientForm.age || ''}
                    onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                    placeholder="e.g. 74"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Birth Year (1900–2026)
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2026"
                    value={patientForm.birthYear || ''}
                    onChange={(e) => setPatientForm({ ...patientForm, birthYear: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                    placeholder="e.g. 1952"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Childhood Hometown
                  </label>
                  <input
                    type="text"
                    value={patientForm.childhoodHometown}
                    onChange={(e) => setPatientForm({ ...patientForm, childhoodHometown: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Favorite Hobbies & Comforts
                  </label>
                  <input
                    type="text"
                    value={patientForm.hobbies}
                    onChange={(e) => setPatientForm({ ...patientForm, hobbies: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Caregiver Advice / Memory Notes
                </label>
                <textarea
                  rows={2}
                  value={patientForm.notes}
                  onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> Save Patient Profile
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                    Age & Birth Year
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--wine-900)' }}>
                    {patient.age ? `${patient.age} years old` : '—'} {patient.birthYear ? `(Born ${patient.birthYear})` : ''}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                    Childhood Towns & Roots
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--wine-900)' }}>
                    {patient.childhoodHometown}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                    Favorite Familiar Topics
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--wine-900)' }}>
                    {patient.hobbies}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                    Primary Physician
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--wine-900)' }}>
                    {patient?.doctorInfo?.name ? `${patient.doctorInfo.name} (${patient.doctorInfo.clinic || 'Family Clinic'})` : 'Dr. B. K. Sarma (Guwahati Care Clinic)'}
                  </span>
                </div>
              </div>

              {patient?.notes && (
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--pink-50)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--wine-500)' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--wine-900)', display: 'block', marginBottom: '2px' }}>
                    Care & Reminiscence Guidance:
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--wine-800)' }}>
                    {patient.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Guardian Profile Card */}
        <section className="mira-card" aria-labelledby="guardian-profile-heading">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.2rem' }}>{guardian?.avatar || '👩‍💼'}</span>
              <div>
                <h2 id="guardian-profile-heading" style={{ fontSize: '1.35rem', margin: 0, color: 'var(--wine-900)' }}>
                  {guardian?.name || 'Dr. Ananya Barua'}
                </h2>
                <span className="badge badge-wine" style={{ fontSize: '0.75rem' }}>
                  {guardian?.relation || 'Daughter'} • Primary Guardian
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingGuardian(!isEditingGuardian)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
            >
              <Edit3 size={15} /> {isEditingGuardian ? 'Cancel' : 'Edit Guardian'}
            </button>
          </div>

          {isEditingGuardian ? (
            <form onSubmit={handleSaveGuardian} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guardianForm.name}
                    onChange={(e) => setGuardianForm({ ...guardianForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Relationship to Patient
                  </label>
                  <input
                    type="text"
                    value={guardianForm.relation}
                    onChange={(e) => setGuardianForm({ ...guardianForm, relation: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={guardianForm.phone}
                    onChange={(e) => setGuardianForm({ ...guardianForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={guardianForm.email}
                    onChange={(e) => setGuardianForm({ ...guardianForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> Save Guardian Profile
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                  Phone / Emergency Line
                </span>
                <span style={{ fontWeight: 600, color: 'var(--wine-900)' }}>
                  {guardian?.phone || '+91 98765 43210'}
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                  Email Address
                </span>
                <span style={{ fontWeight: 600, color: 'var(--wine-900)' }}>
                  {guardian?.email || 'ananya@mira.org'}
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--ivory-soft)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                  Notification Preference
                </span>
                <span style={{ fontWeight: 600, color: 'var(--wine-900)' }}>
                  {guardian?.notificationPreference || 'Immediate for high risk, daily digest'}
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
