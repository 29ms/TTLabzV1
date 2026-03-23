import React, { Suspense, lazy, useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import AuthView from './components/AuthView';
import SnowOverlay from './components/SnowOverlay';
import { db, auth, onAuthStateChanged, signOut, sendEmailVerification, User } from './services/firebase';
import { AppView, LabTrack, Mission, PortfolioTab, UserCertificate, UserMetrics } from './types';
import { MISSIONS, INITIAL_METRICS } from './constants';

const Terminal = lazy(() => import('./components/Terminal'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const MissionView = lazy(() => import('./components/MissionView'));
const PortfolioView = lazy(() => import('./components/PortfolioView'));
const UpgradeView = lazy(() => import('./components/UpgradeView'));
const ResearchSimulator = lazy(() => import('./components/ResearchSimulator'));

const TRACKS: LabTrack[] = ['ETHICS', 'DEFENDER', 'EXECUTIVE', 'INTEL'];
const DEFAULT_RESEARCH_STATE = {
  level: null,
  percent: 0,
  notes: '',
  sections: null,
  activeSectionId: 'q',
};

const normalizeView = (incoming?: AppView): AppView => {
  if (!incoming) return AppView.DASHBOARD;
  if ([AppView.DASHBOARD, AppView.TRACKS, AppView.PORTFOLIO, AppView.CERTIFICATES, AppView.SETTINGS, AppView.UPGRADE, AppView.RESEARCH].includes(incoming)) {
    return incoming;
  }
  if (incoming === AppView.MISSION) return AppView.TRACKS;
  return AppView.DASHBOARD;
};

const isTrack = (value: unknown): value is LabTrack => typeof value === 'string' && TRACKS.includes(value as LabTrack);

const normalizeTrackProgress = (value: unknown): Record<LabTrack, number> => {
  const source = typeof value === 'object' && value !== null ? value as Partial<Record<LabTrack, unknown>> : {};

  return TRACKS.reduce((acc, track) => {
    acc[track] = typeof source[track] === 'number' ? source[track] : 0;
    return acc;
  }, {} as Record<LabTrack, number>);
};

const normalizeMetrics = (value: unknown, isPremium: boolean): UserMetrics => {
  const source = typeof value === 'object' && value !== null ? value as Partial<UserMetrics> : {};

  return {
    ...INITIAL_METRICS,
    ...source,
    isPremium,
    activePathway: source.activePathway === 'ALL' || isTrack(source.activePathway) ? source.activePathway : 'ALL',
    earnedCertificates: Array.isArray(source.earnedCertificates) ? source.earnedCertificates : [],
    trackProgress: normalizeTrackProgress(source.trackProgress),
  };
};

const normalizeMission = (savedMission: unknown): Mission | null => {
  if (typeof savedMission !== 'object' || savedMission === null) return null;

  const source = savedMission as Partial<Mission> & { id?: unknown; completed?: unknown };
  if (typeof source.id !== 'string') return null;

  const baseMission = MISSIONS.find((mission) => mission.id === source.id);
  if (!baseMission) return null;

  return {
    ...baseMission,
    completed: typeof source.completed === 'boolean' ? source.completed : baseMission.completed,
  };
};

const normalizeMissions = (value: unknown): Mission[] => {
  if (!Array.isArray(value)) return MISSIONS;

  const savedMap = new Map<string, Mission>();
  value.forEach((entry) => {
    const normalized = normalizeMission(entry);
    if (normalized) savedMap.set(normalized.id, normalized);
  });

  return MISSIONS.map((mission) => savedMap.get(mission.id) || mission);
};

const normalizeResearchState = (value: unknown) => {
  if (typeof value !== 'object' || value === null) return DEFAULT_RESEARCH_STATE;
  const source = value as Partial<typeof DEFAULT_RESEARCH_STATE>;

  return {
    ...DEFAULT_RESEARCH_STATE,
    ...source,
    percent: typeof source.percent === 'number' ? source.percent : DEFAULT_RESEARCH_STATE.percent,
    notes: typeof source.notes === 'string' ? source.notes : DEFAULT_RESEARCH_STATE.notes,
    activeSectionId: typeof source.activeSectionId === 'string' ? source.activeSectionId : DEFAULT_RESEARCH_STATE.activeSectionId,
  };
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.TERMINAL);
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<UserMetrics>(INITIAL_METRICS);
  const [missions, setMissions] = useState<Mission[]>(MISSIONS);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSnowing, setIsSnowing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isStateHydrated, setIsStateHydrated] = useState(false);
  const [researchState, setResearchState] = useState(DEFAULT_RESEARCH_STATE);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsStateHydrated(false);
      if (!currentUser) {
        setMetrics(INITIAL_METRICS);
        setMissions(MISSIONS);
        setResearchState(DEFAULT_RESEARCH_STATE);
        setActiveMissionId(null);
        setIsSidebarCollapsed(false);
        setView(AppView.TERMINAL);
        setIsInitializing(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        let isPro = false;
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: currentUser.email || '',
            plan: 'free',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          isPro = userSnap.data()?.plan === 'pro';
        }

        setMetrics((prev) => ({ ...prev, isPremium: isPro }));

        const stateRef = doc(db, 'users', currentUser.uid, 'state', 'main');
        const stateSnap = await getDoc(stateRef);
        const saved = stateSnap.exists() ? stateSnap.data()?.blob : null;

        if (saved?.metrics) setMetrics(normalizeMetrics(saved.metrics, isPro));
        else setMetrics((prev) => ({ ...prev, isPremium: isPro }));

        if (saved?.missions) setMissions(normalizeMissions(saved.missions));
        else setMissions(MISSIONS);
        if (saved?.view) setView(normalizeView(saved.view));
        else setView(AppView.DASHBOARD);
        if (saved?.researchState) setResearchState(normalizeResearchState(saved.researchState));
        else setResearchState(DEFAULT_RESEARCH_STATE);
        setActiveMissionId(null);
        setIsStateHydrated(true);
      } finally {
        setIsInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isStateHydrated) return;
    const timer = setTimeout(async () => {
      try {
        const ref = doc(db, 'users', user.uid, 'state', 'main');
        await setDoc(
          ref,
          {
            blob: { metrics, missions, view, researchState },
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (error) {
        console.error('Autosave failed:', error);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [user, isStateHydrated, metrics, missions, view, researchState]);

  const handleTerminalComplete = () => setView(AppView.DASHBOARD);
  const handleAuthSuccess = () => setView(AppView.DASHBOARD);

  const handleLogout = async () => {
    await signOut(auth);
    setView(AppView.TERMINAL);
  };

  const selectMission = (id: string) => {
    const mission = missions.find((m) => m.id === id);
    if (!mission) return;

    if (mission.premium && !metrics.isPremium) {
      const basicDone = missions.filter((m) => m.completed && m.level === 'BASIC').length;
      const advancedDone = missions.filter((m) => m.completed && m.level === 'ADVANCED').length;
      const freeCapReached = basicDone >= 3 && advancedDone >= 3;
      if (freeCapReached) {
        setView(AppView.UPGRADE);
        return;
      }
    }

    setActiveMissionId(id);
    setView(AppView.MISSION);
  };

  const completeMission = (id: string) => {
    const mission = missions.find((m) => m.id === id);
    if (!mission) return;
    const basePoints = mission.level === 'BASIC' ? 120 : 200;

    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, completed: true } : m)));
    setMetrics((prev) => ({
      ...prev,
      labsCompleted: prev.labsCompleted + 1,
      points: prev.points + basePoints,
      trackProgress: {
        ...prev.trackProgress,
        [mission.track]: (prev.trackProgress[mission.track] || 0) + 1,
      },
      criticalThinking: Math.min(100, prev.criticalThinking + 4),
      digitalReadiness: Math.min(100, prev.digitalReadiness + 4),
    }));

    setView(AppView.TRACKS);
    setActiveMissionId(null);
  };

  const handleUpdateName = (name: string) => setMetrics((prev) => ({ ...prev, operatorName: name }));
  const handleActivatePathway = (track: LabTrack) => setMetrics((prev) => ({ ...prev, activePathway: track }));
  const handleClearPathway = () => setMetrics((prev) => ({ ...prev, activePathway: 'ALL' }));

  const handleResearchComplete = (cert: UserCertificate) => {
    setMetrics((prev) => ({
      ...prev,
      researchCompleted: true,
      points: prev.points + 500,
      earnedCertificates: [...prev.earnedCertificates, cert],
    }));
  };

  const handleUpgrade = (plan: 'MONTHLY' | 'ANNUAL') => {
    if (!user) {
      alert('Error: No user session detected. Please sign in to upgrade.');
      return;
    }

    const base =
      plan === 'MONTHLY'
        ? 'https://buy.stripe.com/cNiaEQ8AVb9q8tY5xZao800'
        : 'https://buy.stripe.com/fZu6oA3gB91i9y23pRao801';

    const url =
      `${base}?client_reference_id=${encodeURIComponent(user.uid)}` +
      `&prefilled_email=${encodeURIComponent(user.email || '')}` +
      `&metadata[firebaseUID]=${encodeURIComponent(user.uid)}`;

    window.location.href = url;
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-[#A1A1A1]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#262626] border-t-[#c1121f]" />
          <span className="text-sm tracking-wide">Syncing your workspace…</span>
        </div>
      </div>
    );
  }

  const loadingFallback = (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] text-[#A1A1A1]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#262626] border-t-[#c1121f]" />
        <span className="text-sm tracking-wide">Loading workspace…</span>
      </div>
    </div>
  );

  if (view === AppView.TERMINAL) {
    return (
      <Suspense fallback={loadingFallback}>
        <Terminal onComplete={handleTerminalComplete} />
      </Suspense>
    );
  }
  if (!user) return <AuthView onAuthSuccess={handleAuthSuccess} />;

  const needsEmailVerification = user?.providerData?.some((p) => p.providerId === 'password') && !user.emailVerified;

  const handleResendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        alert('Verification email sent. Check your inbox (and spam).');
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to send verification email.');
    }
  };

  const handleRefreshVerification = async () => {
    try {
      await auth.currentUser?.reload();
      const refreshed = auth.currentUser;
      setUser(refreshed);
      if (refreshed?.emailVerified) {
        setView(AppView.DASHBOARD);
      } else {
        alert('Still not verified yet. After clicking the email link, come back and press Refresh.');
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to refresh verification status.');
    }
  };

  if (needsEmailVerification) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-6 text-[#EAEAEA]">
        <div className="w-full max-w-md rounded-xl border border-[#262626] bg-[#171717] p-8">
          <h1 className="text-[28px] font-semibold">Verify your email</h1>
          <p className="mt-3 text-base text-[#A1A1A1]">
            We sent a verification link to <span className="text-[#EAEAEA]">{user.email}</span>. Please click the link in your inbox, then return here.
          </p>
          <div className="mt-6 space-y-3">
            <button onClick={handleResendVerification} className="w-full h-11 rounded-lg border border-[#262626] text-[#EAEAEA] text-sm hover:border-[#c1121f]">Resend verification email</button>
            <button onClick={handleRefreshVerification} className="w-full h-11 rounded-lg bg-[#c1121f] text-white text-sm font-semibold hover:bg-[#a30f1a]">I verified — Refresh</button>
            <button onClick={handleLogout} className="w-full h-10 rounded-lg border border-[#262626] text-[#A1A1A1] text-sm hover:text-[#EAEAEA]">Log out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={loadingFallback}>
      <div className="flex min-h-screen bg-[#0F0F0F] text-[#EAEAEA] selection:bg-[#c1121f] selection:text-white">
        {isSnowing && <SnowOverlay />}

        {view === AppView.MISSION && activeMissionId ? (
          <MissionView mission={missions.find((m) => m.id === activeMissionId)!} onExit={() => setView(AppView.TRACKS)} onComplete={completeMission} />
        ) : (
          <>
            <Sidebar currentView={view} setView={setView} isPremium={metrics.isPremium} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} onLogout={handleLogout} />
            <main className={`flex-1 overflow-y-auto transition-all duration-200 ease-out ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
              {view === AppView.DASHBOARD && (
                <Dashboard metrics={metrics} missions={missions} onSelectMission={selectMission} setView={setView} onClearPathway={handleClearPathway} mode="DASHBOARD" />
              )}
              {view === AppView.TRACKS && (
                <Dashboard metrics={metrics} missions={missions} onSelectMission={selectMission} setView={setView} onClearPathway={handleClearPathway} mode="TRACKS" />
              )}
              {(view === AppView.PORTFOLIO || view === AppView.CERTIFICATES || view === AppView.SETTINGS) && (
                <PortfolioView
                  metrics={metrics}
                  missions={missions}
                  onUpdateName={handleUpdateName}
                  onActivatePathway={handleActivatePathway}
                  onSelectMission={selectMission}
                  setView={setView}
                  onLogout={handleLogout}
                  initialTab={
                    view === AppView.CERTIFICATES
                      ? PortfolioTab.CERTIFICATES
                      : view === AppView.SETTINGS
                      ? PortfolioTab.SETTINGS
                      : PortfolioTab.PORTFOLIO
                  }
                />
              )}
              {view === AppView.UPGRADE && <UpgradeView onUpgrade={handleUpgrade} />}
              {view === AppView.RESEARCH && (
                <ResearchSimulator
                  isPremium={metrics.isPremium}
                  operatorName={metrics.operatorName || ''}
                  onComplete={handleResearchComplete}
                  onUpdateOperatorName={handleUpdateName}
                  researchState={researchState}
                  setResearchState={setResearchState}
                />
              )}
            </main>
          </>
        )}
      </div>
    </Suspense>
  );
};

export default App;
