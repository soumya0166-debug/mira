import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import storageService from '../services/storageService';
import { translations, LANGUAGES, getTranslationProxy } from '../i18n/translations';
import audioService from '../services/audioService';
import { networkManager } from '../offline/network/networkManager';
import { syncManager } from '../offline/sync/syncManager';
import { syncQueue } from '../offline/sync/syncQueue';
import { cacheManager } from '../offline/cache/cacheManager';
import { indexedDBStorage } from '../offline/storage/indexedDBStorage';
import cdrScoringEngine, { calculateCDRScore, evaluateLongitudinalTrend } from '../services/cdrScoringEngine';

const AppContext = createContext();

export function AppProvider({ children }) {
  // ── Bootstrap: seed demo users & migrate old data ──
  useEffect(() => { storageService.init(); }, []);

  // ── Authentication State ──
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentUser());
  const isLoggedIn = !!currentUser;

  // ── Settings (depend on logged-in user) ──
  const loadSettings = useCallback(() => storageService.getSettings(), []);
  const [language, setLanguageState] = useState(() => loadSettings().language || 'en');
  const [fontSize, setFontSizeState] = useState(() => loadSettings().fontSize || 'normal');
  const [mode, setModeState] = useState(() => loadSettings().mode || 'guardian');
  const [activeTab, setActiveTab] = useState('home');

  // ── Core App Data ──
  const [patient, setPatientState] = useState(() => storageService.getPatient());
  const [guardian, setGuardianState] = useState(() => storageService.getGuardian());
  const [memories, setMemoriesState] = useState(() => storageService.getMemories());
  const [routines, setRoutinesState] = useState(() => storageService.getRoutines());
  const [gameSessions, setGameSessionsState] = useState(() => storageService.getGameSessions());
  const [careNotes, setCareNotesState] = useState(() => storageService.getCareNotes());
  const [cdrAssessments, setCdrAssessmentsState] = useState(() => storageService.getCDRAssessments());

  // ── Caregiver Permission & Accessibility States ──
  const [caregiverPermission, setCaregiverPermissionState] = useState('FULL_SHARED_DATA');
  const [highContrast, setHighContrastState] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedGameId, setSelectedGameId] = useState(null);

  // ── Offline & Network Synchronization State ──
  const [networkStatus, setNetworkStatus] = useState(() => ({
    isOnline: networkManager.isOnline,
    syncStatus: networkManager.syncStatus,
    lastSyncTime: networkManager.lastSyncTime
  }));
  const [pendingCount, setPendingCount] = useState(0);
  const [offlineActivitiesCount, setOfflineActivitiesCount] = useState(18);
  const [storageHealth, setStorageHealth] = useState({ status: 'Healthy', usageMB: '2.4', quotaMB: '500' });

  // Subscribe to networkManager, syncQueue, and cacheManager
  useEffect(() => {
    cacheManager.initCache().then(() => {
      cacheManager.getOfflineActivitiesCount().then(setOfflineActivitiesCount);
    });
    indexedDBStorage.getStorageHealth().then(setStorageHealth);
    syncQueue.getPendingCount().then(setPendingCount);

    const unsubscribe = networkManager.subscribe((status) => {
      setNetworkStatus(status);
      syncQueue.getPendingCount().then(setPendingCount);
    });
    return unsubscribe;
  }, []);

  const syncNow = async () => {
    const result = await syncManager.syncNow();
    const count = await syncQueue.getPendingCount();
    setPendingCount(count);
    return result;
  };

  const refreshOfflineContent = async () => {
    const count = await cacheManager.refreshOfflineContent();
    setOfflineActivitiesCount(count);
    return count;
  };

  // ── Sync font-size and high-contrast class to body ──
  useEffect(() => {
    document.body.classList.remove('font-large', 'font-xlarge');
    if (fontSize === 'large') document.body.classList.add('font-large');
    else if (fontSize === 'xlarge') document.body.classList.add('font-xlarge');
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const setHighContrast = (val) => setHighContrastState(val);
  const setCaregiverPermission = (level) => setCaregiverPermissionState(level);
  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    storageService.saveSettings({ language: newLang, fontSize, mode });
    try {
      indexedDBStorage.saveItem('settings', { id: 'user_settings', language: newLang, fontSize, mode });
    } catch (e) {
      // silent
    }
  };
  const switchLanguage = setLanguage;

  // ── Reload all state when user changes ──
  const reloadUserData = useCallback(() => {
    const s = storageService.getSettings();
    setLanguageState(s.language || 'en');
    setFontSizeState(s.fontSize || 'normal');
    setModeState(s.mode || 'guardian');
    setPatientState(storageService.getPatient());
    setGuardianState(storageService.getGuardian());
    setMemoriesState(storageService.getMemories());
    setRoutinesState(storageService.getRoutines());
    setGameSessionsState(storageService.getGameSessions());
    setCareNotesState(storageService.getCareNotes());
    setCdrAssessmentsState(storageService.getCDRAssessments());
    setActiveTab('home');
  }, []);

  // Translation dictionary with deep recursive fallback proxy across all 10 NER languages
  const t = useMemo(() => getTranslationProxy(language), [language]);

  // ── Auth Actions ──
  const login = (emailOrUsername, credential) => {
    const result = storageService.login(emailOrUsername, credential);
    if (result.success) {
      setCurrentUser(result.user);
      reloadUserData();
      audioService.playSuccessChime();
    }
    return result;
  };

  const loginById = (userId) => {
    const result = storageService.loginById(userId);
    if (result.success) {
      setCurrentUser(result.user);
      reloadUserData();
      audioService.playSuccessChime();
    }
    return result;
  };

  const register = (userData, patientProfile) => {
    const result = storageService.register(userData, patientProfile);
    if (result.success) {
      setCurrentUser(result.user);
      reloadUserData();
      audioService.playSuccessChime();
    }
    return result;
  };

  const logout = () => {
    storageService.logout();
    setCurrentUser(null);
    setPatientState({});
    setGuardianState({});
    setMemoriesState([]);
    setRoutinesState([]);
    setGameSessionsState([]);
    setCareNotesState([]);
    setCdrAssessmentsState([]);
    audioService.playSoftClick();
  };

  const switchUser = (userId) => {
    const result = storageService.loginById(userId);
    if (result.success) {
      setCurrentUser(result.user);
      reloadUserData();
      audioService.playSoftClick();
    }
    return result;
  };

  const availableUsers = storageService.getAllUsers();

  const updateCurrentUser = (updates) => {
    if (!currentUser) return false;
    const ok = storageService.updateUser(currentUser.id, updates);
    if (ok) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
    return ok;
  };

  // ── Settings Mutators ──
  const setFontSize = (newSize) => {
    setFontSizeState(newSize);
    storageService.saveSettings({ language, fontSize: newSize, mode });
  };

  const switchMode = (newMode) => {
    setModeState(newMode);
    storageService.saveSettings({ language, fontSize, mode: newMode });
    audioService.playSoftClick();
    setActiveTab(newMode === 'guardian' ? 'guardian' : 'memories');
  };

  // ── Profile Mutators ──
  const updatePatient = (updatedData) => {
    const updated = { ...patient, ...updatedData };
    setPatientState(updated);
    storageService.savePatient(updated);
  };

  const updateGuardian = (updatedData) => {
    const updated = { ...guardian, ...updatedData };
    setGuardianState(updated);
    storageService.saveGuardian(updated);
  };

  // ── Memory Mutators ──
  const addMemory = (newMem) => {
    const memoryWithId = { id: 'mem-' + Date.now(), reactions: [], ...newMem };
    const updated = [memoryWithId, ...memories];
    setMemoriesState(updated);
    storageService.saveMemories(updated);
  };

  const deleteMemory = (id) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemoriesState(updated);
    storageService.saveMemories(updated);
  };

  const addReaction = (memoryId, reactionObj) => {
    const updated = memories.map((mem) => {
      if (mem.id === memoryId) {
        return {
          ...mem,
          reactions: [
            { emoji: reactionObj.emoji, label: reactionObj.label, date: 'Just now' },
            ...(mem.reactions || [])
          ]
        };
      }
      return mem;
    });
    setMemoriesState(updated);
    storageService.saveMemories(updated);

    addCareNote({
      id: 'note-' + Date.now(),
      date: 'Just now',
      author: 'MIRA System Log',
      mood: reactionObj.emoji + ' ' + reactionObj.label,
      content: `Patient engaged with memory "${memories.find((m) => m.id === memoryId)?.title}" and reacted: ${reactionObj.label}.`
    });

    audioService.playSuccessChime();
  };

  // ── Routine Mutators ──
  const toggleRoutine = (id) => {
    const updated = routines.map((item) => {
      if (item.id === id) {
        const completed = !item.completedToday;
        if (completed) audioService.playSuccessChime();
        else audioService.playSoftClick();
        return {
          ...item,
          completedToday: completed,
          completedAt: completed
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null
        };
      }
      return item;
    });
    setRoutinesState(updated);
    storageService.saveRoutines(updated);
  };

  const addRoutine = (newRoutine) => {
    const routineWithId = { id: 'rout-' + Date.now(), completedToday: false, completedAt: null, ...newRoutine };
    const updated = [...routines, routineWithId];
    setRoutinesState(updated);
    storageService.saveRoutines(updated);
  };

  // ── Games ──
  const recordGameSession = (gameName, score, details = {}) => {
    const newSession = {
      id: 'gs-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      game: gameName,
      score,
      durationSec: details.durationSec || 60,
      syncStatus: 'pending',
      ...details
    };
    const updated = storageService.addGameSession(newSession);
    setGameSessionsState(updated);
    syncQueue.getPendingCount().then(setPendingCount);
  };

  // ── Care Notes ──
  const addCareNote = (note) => {
    const noteWithId = {
      id: 'note-' + Date.now(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) +
        ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...note
    };
    const updated = storageService.addCareNote(noteWithId);
    setCareNotesState(updated);
  };

  // ── Backup & Restore ──
  const exportBackup = () => storageService.exportAllData();

  const importBackup = (jsonString) => {
    const ok = storageService.importAllData(jsonString);
    if (ok) reloadUserData();
    return ok;
  };

  const resetToDefaults = () => {
    storageService.resetToDefaults();
    reloadUserData();
  };

  // ── Cognitive Score ──
  const computeCognitiveScore = () => {
    const totalRoutines = routines.length || 1;
    const completedRoutines = routines.filter((r) => r.completedToday).length;
    const routineScore = Math.round((completedRoutines / totalRoutines) * 100);

    const totalReactions = memories.reduce((acc, m) => acc + (m.reactions?.length || 0), 0);
    const memoryScore = Math.min(100, 60 + Math.min(40, totalReactions * 10));

    const recentGames = gameSessions.slice(0, 5);
    const avgGameScore = recentGames.length > 0
      ? Math.round(recentGames.reduce((acc, s) => acc + (s.score || 80), 0) / recentGames.length)
      : 85;

    const overall = Math.round(routineScore * 0.3 + memoryScore * 0.35 + avgGameScore * 0.35);
    return {
      overall: Math.max(50, Math.min(98, overall)),
      routineScore,
      memoryScore,
      gameScore: avgGameScore,
      streakDays: 5,
      completedRoutinesCount: completedRoutines,
      totalRoutinesCount: totalRoutines
    };
  };

  const cognitiveScore = computeCognitiveScore();

  // ── CDR-Inspired Cognitive Functional Screenings ──
  const saveCDRAssessment = (assessmentInput) => {
    const evaluated = assessmentInput.total_score !== undefined
      ? assessmentInput
      : calculateCDRScore(assessmentInput);
    const updated = storageService.saveCDRAssessment(evaluated);
    setCdrAssessmentsState(updated);
    audioService.playSuccessChime();
    return evaluated;
  };

  const latestCDRAssessment = useMemo(() => {
    if (!cdrAssessments || cdrAssessments.length === 0) return null;
    const sorted = [...cdrAssessments].sort((a, b) => 
      new Date(b.assessment_date || b.timestamp) - new Date(a.assessment_date || a.timestamp)
    );
    return sorted[0];
  }, [cdrAssessments]);

  const cdrTrend = useMemo(() => {
    return evaluateLongitudinalTrend(cdrAssessments);
  }, [cdrAssessments]);

  return (
    <AppContext.Provider
      value={{
        // Auth
        currentUser,
        isLoggedIn,
        login,
        loginById,
        register,
        logout,
        switchUser,
        availableUsers,
        updateCurrentUser,
        // i18n
        language,
        preferredLanguage: language,
        setLanguage,
        switchLanguage,
        languages: LANGUAGES,
        t,
        // Display & Accessibility
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        voiceEnabled,
        setVoiceEnabled,
        caregiverPermission,
        setCaregiverPermission,
        selectedGameId,
        setSelectedGameId,
        mode,
        switchMode,
        activeTab,
        setActiveTab,
        // Data
        patient,
        updatePatient,
        guardian,
        updateGuardian,
        memories,
        addMemory,
        deleteMemory,
        addReaction,
        routines,
        toggleRoutine,
        addRoutine,
        gameSessions,
        recordGameSession,
        careNotes,
        addCareNote,
        cognitiveScore,
        // CDR-Inspired Screening
        cdrAssessments,
        latestCDRAssessment,
        cdrTrend,
        saveCDRAssessment,
        exportBackup,
        importBackup,
        resetToDefaults,
        // Offline & Network Sync State
        isOnline: networkStatus.isOnline,
        syncStatus: networkStatus.syncStatus,
        lastSyncTime: networkStatus.lastSyncTime,
        pendingCount,
        offlineActivitiesCount,
        storageHealth,
        syncNow,
        refreshOfflineContent,
        networkStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}

export default AppContext;
