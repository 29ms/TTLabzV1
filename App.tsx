import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import Terminal from './components/Terminal';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import MissionView from './components/MissionView';
import PortfolioView from './components/PortfolioView';
import LearnView from './components/LearnView';
import UpgradeView from './components/UpgradeView';
import ResearchSimulator from './components/ResearchSimulator';
import AuthView from './components/AuthView';
import SnowOverlay from './components/SnowOverlay';
import { db, auth, onAuthStateChanged, signOut, sendEmailVerification, User } from './services/firebase';
import { AppView, LabTrack, Mission, PortfolioTab, UserCertificate, UserMetrics } from './types';
import { MISSIONS, INITIAL_METRICS } from './constants';

const normalizeView = (incoming?: AppView): AppView => {
  if (!incoming || incoming === AppView.SPEED_LABS || incoming === AppView.LAB_CREATOR || incoming === AppView.NEURAL_BUILDER) {
    return AppView.DASHBOARD;
  }
  return incoming;
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
  const [researchState, setResearchState] = useState({
    level: null,
    percent: 0,
    notes: '',
    sections: null,
    activeSectionId: 'q',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
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

        if (saved?.metrics) {
          setMetrics({ ...saved.metrics, isPremium: isPro });
        }
        if (saved?.missions) setMissions(saved.missions);
        if (saved?.view) setView(normalizeView(saved.view));
        if (saved?.researchState) setResearchState(saved.researchState);
      } finally {
        setIsInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
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
  }, [user, metrics, missions, view, researchState]);

  const handleTerminalComplete = () => setView(AppView.DASHBOARD);
  const handleAuthSuccess = () => setView(AppView.DASHBOARD);

  const handleLogout = async () => {
    await signOut(auth);
    setView(AppView.TERMINAL);
  };

  const selectMission = (id: string) => {
    const mission = missions.find((m) => m.id === id);
    if (mission?.premium && !metrics.isPremium) {
      setView(AppView.UPGRADE);
      return;
    }
    setActiveMissionId(id);
    setView(AppView.MISSION);
  };

  const completeMission = (id: string) => {
    const mission = missions.find((m) => m.id === id);
    if (!mission) return;
    const basePoints = mission.mediaType === 'TEXT' ? 50 : 150;

    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, completed: true } : m)));
    setMetrics((prev) => ({
      ...prev,
      labsCompleted: prev.labsCompleted + 1,
      points: prev.points + basePoints,
      trackProgress: {
        ...prev.trackProgress,
        [mission.track]: prev.trackProgress[mission.track] + 1,
      },
      privacy: Math.min(100, prev.privacy + 5),
      criticalThinking: Math.min(100, prev.criticalThinking + 8),
    }));

    setView(AppView.PROJECTS);
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
      <div className="h-screen bg-black flex flex-col items-center justify-center text-zinc-500">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
          <span className="text-sm tracking-wide">Syncing your workspace…</span>
        </div>
      </div>
    );
  }

  if (view === AppView.TERMINAL) return <Terminal onComplete={handleTerminalComplete} />;
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-zinc-200">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <h1 className="text-2xl font-semibold text-white">Verify your email</h1>
          <p className="mt-3 text-sm text-zinc-400">
            We sent a verification link to <span className="text-white">{user.email}</span>. Please click the link in your inbox, then return here.
          </p>
          <div className="mt-6 space-y-3">
            <button onClick={handleResendVerification} className="w-full h-11 rounded-lg border border-white/20 text-white text-sm hover:bg-white/5">Resend verification email</button>
            <button onClick={handleRefreshVerification} className="w-full h-11 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200">I verified — Refresh</button>
            <button onClick={handleLogout} className="w-full h-10 rounded-lg border border-white/20 text-zinc-400 text-sm hover:text-white">Log out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-zinc-200 selection:bg-white selection:text-black">
      {isSnowing && <SnowOverlay />}

      {view === AppView.MISSION && activeMissionId ? (
        <MissionView mission={missions.find((m) => m.id === activeMissionId)!} onExit={() => setView(AppView.PROJECTS)} onComplete={completeMission} />
      ) : (
        <>
          <Sidebar currentView={view} setView={setView} isPremium={metrics.isPremium} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} onLogout={handleLogout} />
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
            {view === AppView.DASHBOARD && (
              <Dashboard metrics={metrics} missions={missions} onSelectMission={selectMission} setView={setView} onClearPathway={handleClearPathway} mode="HOME" />
            )}
            {view === AppView.PROJECTS && (
              <Dashboard metrics={metrics} missions={missions} onSelectMission={selectMission} setView={setView} onClearPathway={handleClearPathway} mode="PROJECTS" />
            )}
            {(view === AppView.PORTFOLIO || view === AppView.CERTIFICATES || view === AppView.ACCOUNT) && (
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
                    ? PortfolioTab.CERTIFICATIONS
                    : view === AppView.ACCOUNT
                    ? PortfolioTab.ACCOUNT
                    : PortfolioTab.CERTIFICATIONS
                }
              />
            )}
            {view === AppView.LEARN && <LearnView />}
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
  );
};

export default App;
