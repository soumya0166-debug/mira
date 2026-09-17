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
  const [mode, setModeState] = useState(() => {
    if (currentUser?.role === 'patient') return 'patient';
    if (currentUser?.role === 'guardian') return 'guardian';
    return loadSettings().mode || 'guardian';
  });
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const saved = localStorage.getItem('mira_active_tab');
      if (saved) return saved;
    } catch {}
    return currentUser?.role === 'guardian' ? 'guardian' : 'home';
  });

  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('mira_active_tab', tab);
    } catch {}
  }, []);

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
    const curr = storageService.getCurrentUser();
    setLanguageState(s.language || 'en');
    setFontSizeState(s.fontSize || 'normal');
    const resolvedMode = curr?.role === 'patient' ? 'patient' : (curr?.role === 'guardian' ? 'guardian' : (s.mode || 'guardian'));
    setModeState(resolvedMode);
    setPatientState(storageService.getPatient());
    setGuardianState(storageService.getGuardian());
    setMemoriesState(storageService.getMemories());
    setRoutinesState(storageService.getRoutines());
    setGameSessionsState(storageService.getGameSessions());
    setCareNotesState(storageService.getCareNotes());
    setCdrAssessmentsState(storageService.getCDRAssessments());
    const defaultTab = curr?.role === 'guardian' ? 'guardian' : 'home';
    let savedTab = null;
    try {
      savedTab = localStorage.getItem('mira_active_tab');
    } catch {}
    setActiveTab(savedTab || defaultTab);
  }, [setActiveTab]);

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

  const generateAndSendOtp = (email) => {
    return storageService.generateAndSendOtp(email);
  };

  const verifyOtp = (email, code) => {
    return storageService.verifyOtp(email, code);
  };

  const loginWithOtp = (email, code) => {
    const result = storageService.loginWithOtp(email, code);
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
    try {
      localStorage.removeItem('mira_active_tab');
      window.history.replaceState(null, '', '/');
    } catch {}
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
    const totalRoutines = routines.length;
    const completedRoutines = routines.filter((r) => r.completedToday).length;
    const routineScore = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;

    const totalReactions = memories.reduce((acc, m) => acc + (m.reactions?.length || 0), 0);
    // Real memory engagement score (0-100) based on memories present and reactions
    const memoryScore = memories.length > 0 
      ? Math.min(100, Math.round((totalReactions / Math.max(1, memories.length)) * 50 + (memories.length * 10))) 
      : 0;

    const recentGames = gameSessions.slice(0, 5);
    const hasGames = recentGames.length > 0;
    const avgGameScore = hasGames
      ? Math.round(recentGames.reduce((acc, s) => acc + (Number(s.score) || 0), 0) / recentGames.length)
      : 0;

    // Real dynamic PCPS calculation
    let overall = 0;
    if (hasGames && totalRoutines > 0) {
      overall = Math.round(routineScore * 0.35 + memoryScore * 0.30 + avgGameScore * 0.35);
    } else if (hasGames) {
      overall = Math.round(avgGameScore * 0.70 + memoryScore * 0.30);
    } else if (totalRoutines > 0) {
      overall = Math.round(routineScore * 0.70 + memoryScore * 0.30);
    } else if (memories.length > 0) {
      overall = Math.round(memoryScore);
    }

    const clampedOverall = Math.max(0, Math.min(100, overall));

    return {
      overall: clampedOverall,
      routineScore: Math.max(0, Math.min(100, routineScore)),
      memoryScore: Math.max(0, Math.min(100, memoryScore)),
      gameScore: Math.max(0, Math.min(100, avgGameScore)),
      streakDays: Math.min(30, (hasGames ? 1 : 0) + (completedRoutines > 0 ? 1 : 0) + (totalReactions > 0 ? 1 : 0)),
      completedRoutinesCount: completedRoutines,
      totalRoutinesCount: totalRoutines,
      hasRealActivity: hasGames || completedRoutines > 0 || totalReactions > 0
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
        generateAndSendOtp,
        verifyOtp,
        loginWithOtp,
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
