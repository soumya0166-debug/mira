import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import audioService from '../../services/audioService';

export default function GamesHub({ initialGameId, onBackToHub }) {
  const { language } = useApp();
  const [currentExercise, setCurrentExercise] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState('ananya');
  const [isPlayingNote, setIsPlayingNote] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showRestModal, setShowRestModal] = useState(false);

  const exercises = [
    {
      step: 1,
      image: '/assets/veranda_tea.png',
      location: 'Morning Veranda, Assam',
      question: 'Who is sitting with you enjoying morning tea on the veranda?',
      choices: [
        {
          id: 'ananya',
          title: 'Ananya (Your daughter)',
          subtitle: 'Visiting with fresh Assam tea',
          isCorrect: true,
          icon: 'favorite',
          confirmation: 'Wonderful, Baba! Yes, that is Ananya visiting you from Guwahati.',
          audioNote: 'Deuta, morning tea ready... I picked fresh ginger from the backyard for you.'
        },
        {
          id: 'pooja',
          title: 'Pooja (Your granddaughter)',
          subtitle: 'At school in Jorhat',
          isCorrect: false,
          icon: 'local_florist'
        },
        {
          id: 'meera',
          title: 'Meera (Your sister)',
          subtitle: 'In Tezpur',
          isCorrect: false,
          icon: 'light_mode'
        }
      ],
      hint: 'Notice the warm smiles and traditional Assam silk border. This is your loving daughter who brews ginger tea for you.'
    },
    {
      step: 2,
      image: '/assets/tea_cups.png',
      location: 'Tezpur Tea Estate, Assam',
      question: 'What kind of special tea are we enjoying in the clay cups?',
      choices: [
        {
          id: 'assam_ctc',
          title: 'Assam CTC Garden Tea with Crushed Ginger',
          subtitle: 'Brewed over morning bamboo fire',
          isCorrect: true,
          icon: 'local_cafe',
          confirmation: 'Exactly right, Baba! You always loved fresh strong CTC tea with ginger.',
          audioNote: 'Baba, remember how you taught me to boil the tea leaves twice with cardamoms?'
        },
        {
          id: 'green_tea',
          title: 'Imported Green Tea',
          subtitle: 'Light infusion from Darjeeling',
          isCorrect: false,
          icon: 'spa'
        },
        {
          id: 'sweet_milk',
          title: 'Plain Warm Sweet Milk',
          subtitle: 'Morning cow milk with honey',
          isCorrect: false,
          icon: 'nutrition'
        }
      ],
      hint: 'The rich dark liquor in terracotta cups has the fragrance of ginger and garden harvest.'
    },
    {
      step: 3,
      image: '/assets/granddaughter_pooja.png',
      location: 'Umiam Lake Viewpoint, Meghalaya',
      question: 'Who wore the festive handwoven muffler on our picnic trip?',
      choices: [
        {
          id: 'pooja_granddaughter',
          title: 'Pooja (Your granddaughter)',
          subtitle: 'Singing Bihu songs in the sun',
          isCorrect: true,
          icon: 'sentiment_very_satisfied',
          confirmation: 'Yes, Deben Dadu! Pooja was overjoyed to wear your handwoven muffler.',
          audioNote: 'Dadu, I still have the muffler you gifted me. I wear it every winter!'
        },
        {
          id: 'driver',
          title: 'Biren the taxi driver',
          subtitle: 'Taking us to the boathouse',
          isCorrect: false,
          icon: 'directions_car'
        },
        {
          id: 'neighbor',
          title: 'Phukan Uncle',
          subtitle: 'Greeting us by the lakeside',
          isCorrect: false,
          icon: 'person'
        }
      ],
      hint: 'Look at the bright sparkling young eyes of your granddaughter who loves her Dadu.'
    }
  ];

  const currentData = exercises[currentExercise - 1];
  const activeChoiceObj = currentData.choices.find(c => c.id === selectedChoice);
  const isCorrect = activeChoiceObj?.isCorrect;

  const handleSelectChoice = (choiceId) => {
    setSelectedChoice(choiceId);
    const chosen = currentData.choices.find(c => c.id === choiceId);
    if (chosen?.isCorrect) {
      audioService.speak(chosen.confirmation, 'en');
    }
  };

  const handlePlayVoiceNote = () => {
    setIsPlayingNote(true);
    const text = activeChoiceObj?.audioNote || 'Deuta, morning tea is ready!';
    audioService.speak(text, 'en');
    setTimeout(() => setIsPlayingNote(false), 4000);
  };

  const handleNextMemory = () => {
    setShowHint(false);
    if (currentExercise < exercises.length) {
      setCurrentExercise(prev => prev + 1);
      setSelectedChoice('ananya');
    } else {
      setCurrentExercise(1);
      setSelectedChoice('ananya');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="stitch-container">
      {/* 1. Header Progress Card */}
      <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--stitch-primary)' }}>
              potted_plant
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
              Gentle Exercise {currentExercise} of {exercises.length}
            </span>
          </div>

          {/* Progress Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.65rem', borderRadius: '9999px', backgroundColor: 'var(--stitch-surface-container-low)' }}>
            {exercises.map((ex) => (
              <span
                key={ex.step}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: ex.step === currentExercise ? 'var(--stitch-primary)' : 'var(--stitch-outline-variant)'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--stitch-on-surface)', margin: 0 }}>
            Let's Remember Together 🌿
          </h1>
          <button
            onClick={() => audioService.speak(`${currentData.question}`, 'en')}
            aria-label="Audio read screen"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--stitch-surface-container)',
              color: 'var(--stitch-primary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>volume_up</span>
          </button>
        </div>
      </div>

      {/* 2. Photo & Memory Question Card */}
      <div className="stitch-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: 'var(--stitch-surface-container)' }}>
          <img
            src={currentData.image}
            alt={currentData.location}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = '/assets/veranda_tea.png'; }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(21, 29, 25, 0.85)',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--stitch-turmeric)' }}>
              wb_sunny
            </span>
            <span>{currentData.location}</span>
          </div>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--stitch-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Memory Question
          </span>
          <p style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--stitch-on-surface)', margin: 0, lineHeight: 1.35 }}>
            {currentData.question}
          </p>
        </div>
      </div>

      {/* 3. Multiple Choice Radio Group */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {currentData.choices.map((choice) => {
          const isSelected = selectedChoice === choice.id;

          return (
            <button
              key={choice.id}
              onClick={() => handleSelectChoice(choice.id)}
              style={{
                minHeight: '68px',
                padding: '1rem 1.25rem',
                borderRadius: '1rem',
                backgroundColor: isSelected ? 'var(--stitch-primary)' : 'var(--stitch-surface-container-lowest)',
                color: isSelected ? '#ffffff' : 'var(--stitch-on-surface)',
                border: isSelected ? '2px solid var(--stitch-primary)' : '1.5px solid rgba(226, 220, 208, 0.8)',
                boxShadow: isSelected ? '0 4px 14px rgba(0, 54, 41, 0.2)' : '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'var(--stitch-surface-container)',
                    color: isSelected ? '#ffffff' : 'var(--stitch-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    {choice.icon}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {choice.title}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: isSelected ? 'var(--stitch-primary-fixed)' : 'var(--stitch-on-surface-variant)' }}>
                    {choice.subtitle}
                  </span>
                </div>
              </div>

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#ffffff' : 'transparent',
                  border: isSelected ? 'none' : '2px solid var(--stitch-outline-variant)',
                  color: 'var(--stitch-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {isSelected && (
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>check</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Warm Confirmation Feedback Card */}
      {isCorrect && (
        <section
          style={{
            backgroundColor: 'var(--stitch-surface-container-low)',
            borderRadius: '1.25rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1.5px solid rgba(226, 220, 208, 0.7)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-primary-container)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                sentiment_satisfied
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--stitch-primary)' }}>
                Warm Confirmation
              </span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '1.1rem', color: 'var(--stitch-on-surface)', lineHeight: 1.4 }}>
                {activeChoiceObj?.confirmation}
              </p>
            </div>
          </div>

          {/* Voice note snippet */}
          <div
            style={{
              backgroundColor: 'var(--stitch-surface-container-lowest)',
              borderRadius: '1rem',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              border: '1px solid rgba(226, 220, 208, 0.6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={handlePlayVoiceNote}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--stitch-secondary-container)',
                    color: 'var(--stitch-on-secondary-container)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    {isPlayingNote ? 'pause' : 'volume_up'}
                  </span>
                </button>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--stitch-on-surface)' }}>
                    Hear Ananya's Voice Note
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--stitch-on-surface-variant)' }}>
                    Today, 7:15 AM · 0:24
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--stitch-secondary)' }}>
                Assamese
              </span>
            </div>

            {/* Audio Waveform */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.4rem 0.6rem',
                backgroundColor: 'var(--stitch-surface-container-low)',
                borderRadius: '8px',
                height: '32px'
              }}
            >
              {[12, 22, 16, 28, 18, 24, 14, 20, 26, 12, 22, 18, 14].map((h, i) => (
                <span
                  key={i}
                  style={{
                    width: '4px',
                    height: `${isPlayingNote ? (h + Math.sin(i) * 6) : (h * 0.7)}px`,
                    backgroundColor: isPlayingNote ? 'var(--stitch-secondary)' : 'var(--stitch-outline-variant)',
                    borderRadius: '9999px',
                    transition: 'height 0.2s ease'
                  }}
                />
              ))}
              <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--stitch-on-surface-variant)', fontStyle: 'italic' }}>
                “Deuta, morning tea ready...”
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Gentle Hint display */}
      {showHint && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '1rem',
            backgroundColor: '#fefce8',
            border: '1.5px solid #fef08a',
            color: '#713f12',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#a16207' }}>
            lightbulb
          </span>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Gentle Hint</strong>
            <span>{currentData.hint}</span>
          </div>
        </div>
      )}

      {/* 5. Navigation & Helper Action Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          onClick={() => {
            setShowHint(false);
            audioService.speak(currentData.question, 'en');
          }}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-surface-container)',
            color: 'var(--stitch-on-surface)',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>replay</span>
          <span>Repeat</span>
        </button>

        <button
          onClick={() => setShowHint(!showHint)}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-surface-container)',
            color: 'var(--stitch-on-surface)',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--stitch-secondary)' }}>
            search
          </span>
          <span>Gentle Hint</span>
        </button>

        <button
          onClick={() => setShowRestModal(true)}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-surface-container)',
            color: 'var(--stitch-on-surface)',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--stitch-outline)' }}>
            pause_circle
          </span>
          <span>Take a Rest</span>
        </button>

        <button
          onClick={handleNextMemory}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--stitch-tertiary-container)',
            color: '#ffffff',
            border: 'none',
            fontSize: '1.05rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(127, 38, 0, 0.25)'
          }}
        >
          <span>Next Memory</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
        </button>
      </div>

      {/* Take a Rest Modal */}
      {showRestModal && (
        <div
          onClick={() => setShowRestModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              maxWidth: '420px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--stitch-surface-container)',
                color: 'var(--stitch-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>self_improvement</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--stitch-primary)' }}>
              Take a Peaceful Rest
            </h3>
            <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--stitch-on-surface-variant)', lineHeight: 1.4 }}>
              Take a deep breath and sip some warm water or tea. You can return anytime Baba.
            </p>
            <button
              onClick={() => setShowRestModal(false)}
              className="stitch-btn-forest"
              style={{ width: '100%', height: '52px' }}
            >
              Continue when ready
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
