import React, { useState } from 'react';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import OfflineBanner from './components/common/OfflineBanner';
import LandingView from './components/landing/LandingView';
import HomeDashboard from './components/home/HomeDashboard';
import GamesHub from './components/games/GamesHub';
import MemoryGallery from './components/gallery/MemoryGallery';
import RoutineSchedule from './components/routine/RoutineSchedule';
import MiraAssistant from './components/mira/MiraAssistant';
import CognitiveScoreDashboard from './components/wellness/CognitiveScoreDashboard';
import CaregiverConsentView from './components/caregiver/CaregiverConsentView';
import GuardianDashboard from './components/guardian/GuardianDashboard';
import NotificationsView from './components/notifications/NotificationsView';
import ProfileView from './components/profile/ProfileView';
import SettingsView from './components/settings/SettingsView';
import PrivacyPolicyView from './components/privacy/PrivacyPolicyView';
import OnboardingView from './components/onboarding/OnboardingView';
import AuthView from './components/auth/AuthView';
import { useApp } from './context/AppContext';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    mode,
    isLoggedIn,
    loginById,
    selectedGameId,
    setSelectedGameId
  } = useApp();

  const [landingMode, setLandingMode] = useState(!isLoggedIn);

  // If user is not logged in
  if (!isLoggedIn) {
    if (landingMode) {
      return (
        <LandingView
          onGetStarted={() => {
            // Log in as demo user and enter onboarding / home
            loginById('user_ananya');
            setLandingMode(false);
            setActiveTab('home');
          }}
          onLogin={() => setLandingMode(false)}
        />
      );
    }
    return (
      <div>
        <div style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setLandingMode(true)}
            style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            ← Back to MIND AI - NER Showcase
          </button>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>SIH 2026 Problem Statement 26003</span>
        </div>
        <AuthView />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Accessible Header with Language & Mode Switcher */}
      <Header />

      {/* Main Content Area */}
      <main className="main-content" role="main">
        {/* Offline / Storage Status Indicator */}
        <OfflineBanner />

        {/* Dynamic View Routing */}
        {activeTab === 'landing' && (
          <LandingView
            onGetStarted={() => setActiveTab('home')}
            onLogin={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'onboarding' && (
          <OnboardingView onComplete={() => setActiveTab('home')} />
        )}

        {activeTab === 'home' && (
          <HomeDashboard
            onNavigateTab={setActiveTab}
            onSelectGame={(gameId) => {
              if (setSelectedGameId) setSelectedGameId(gameId);
              setActiveTab('games');
            }}
          />
        )}

        {activeTab === 'games' && (
          <GamesHub
            initialGameId={selectedGameId}
            onBackToHub={() => {
              if (setSelectedGameId) setSelectedGameId(null);
            }}
          />
        )}

        {activeTab === 'mira' && (
          <MiraAssistant onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'memories' && <MemoryGallery />}

        {activeTab === 'routines' && <RoutineSchedule />}

        {activeTab === 'wellness' && <CognitiveScoreDashboard />}

        {activeTab === 'caregiver' && <CaregiverConsentView />}

        {activeTab === 'guardian' && <GuardianDashboard />}

        {activeTab === 'notifications' && <NotificationsView />}

        {activeTab === 'profile' && <ProfileView />}

        {activeTab === 'settings' && <SettingsView onNavigateTab={setActiveTab} />}

        {activeTab === 'privacy' && <PrivacyPolicyView />}
      </main>

      {/* Fixed Bottom Navigation */}
      <Navigation />
    </div>
  );
}
