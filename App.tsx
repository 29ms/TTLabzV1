import Privacy from "./components/Privacy";
import Terms from "./components/Terms";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./services/firebase";

import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import MissionView from './components/MissionView';
import PortfolioView from './components/PortfolioView';
import LearnView from './components/LearnView';
import InfiniteSection from './components/InfiniteSection';
import UpgradeView from './components/UpgradeView';
import LabCreator from './components/LabCreator';
import ResearchSimulator from './components/ResearchSimulator';
import NeuralBuilder from './components/NeuralBuilder';
import AuthView from './components/AuthView';
import SnowOverlay from './components/SnowOverlay';
import { auth, onAuthStateChanged, signOut, sendEmailVerification, User } from './services/firebase';
import { AppView, UserMetrics, Mission, LabTrack, UserCertificate } from './types';
import { MISSIONS, INITIAL_METRICS } from './constants';

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
  notes: "",
  sections: null,
  activeSectionId: "q",
});


  // --- Persisted "cloud save" of user progress ---
  const saveProgressBlob = async (uid: string, blob: any) => {
    const ref = doc(db, "users", uid, "state", "main");
    await setDoc(ref, { blob, updatedAt: serverTimestamp() }, { merge: true });
  };

  const loadProgressBlob = async (uid: string) => {
    const ref = doc(db, "users", uid, "state", "main");
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data()?.blob ?? null) : null;
  }; 
  // end of pasted

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: currentUser.email || "",
      plan: "free",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setMetrics(prev => ({ ...prev, isPremium: false }));
  } else {
    const data = snap.data();
    const isPro = data?.plan === "pro";
    setMetrics(prev => ({ ...prev, isPremium: isPro }));
  }

  // ===== LOAD SAVED APP STATE =====
const stateRef = doc(db, "users", currentUser.uid, "state", "main");
const stateSnap = await getDoc(stateRef);

if (stateSnap.exists()) {
  const saved = stateSnap.data()?.blob;

  if (saved?.metrics) {
    setMetrics(prev => ({
      ...saved.metrics,
      isPremium: prev.isPremium, // keep plan logic
    }));
  }

  if (saved?.missions) {
    setMissions(saved.missions);
  }

  if (saved?.view) {
    setView(saved.view === AppView.SPEED_LABS ? AppView.DASHBOARD : saved.view);
  }
}

      // ✅ Load saved progress (research, missions, certificates, points, etc.)
      const saved = await loadProgressBlob(currentUser.uid);

      if (saved?.metrics) {
        // IMPORTANT: keep isPremium controlled by Firestore "plan"
        const premiumFromPlan = (snap.exists() && snap.data()?.plan === "pro");
        setMetrics({ ...saved.metrics, isPremium: premiumFromPlan });
      }

      if (saved?.missions) {
        setMissions(saved.missions);
      }

      if (saved?.view) {
        setView(saved.view === AppView.SPEED_LABS ? AppView.DASHBOARD : saved.view);
      } 
    
      if (saved?.researchState) {
  setResearchState(saved.researchState);
      }
      // end of pasted
  
}

      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  // ===============================
// AUTO SAVE USER PROGRESS (CLOUD SAVE)
// ===============================
useEffect(() => {
  if (!user) return;

  const t = setTimeout(async () => {
    try {
      const ref = doc(db, "users", user.uid, "state", "main");

      await setDoc(
        ref,
        {
          blob: {
            metrics,
            missions,
            view,
            researchState
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Autosave failed:", e);
    }
  }, 600); // prevents too many writes

  return () => clearTimeout(t);
}, [user, metrics, missions, view, researchState]);

// end of pasted

  const handleTerminalComplete = () => {
    setView(AppView.DASHBOARD);
  };

  const handleAuthSuccess = () => {
    setView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView(AppView.TERMINAL);
  };

  const handleUpdatePoints = (pts: number) => {
    setMetrics(prev => ({
      ...prev,
      points: Math.max(0, prev.points + pts)
    }));
  };

  const selectMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission?.premium && !metrics.isPremium) {
      setView(AppView.UPGRADE);
      return;
    }
    setActiveMissionId(id);
    setView(AppView.MISSION);
  };

  const completeMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;
    const basePoints = mission.mediaType === 'TEXT' ? 50 : 150;
    setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: true } : m));
    setMetrics(prev => ({
      ...prev,
      labsCompleted: prev.labsCompleted + 1,
      points: prev.points + basePoints,
      trackProgress: {
        ...prev.trackProgress,
        [mission.track]: prev.trackProgress[mission.track] + 1
      },
      privacy: Math.min(100, prev.privacy + 5),
      criticalThinking: Math.min(100, prev.criticalThinking + 8),
    }));
    setView(AppView.DASHBOARD);
    setActiveMissionId(null);
  };

  const handleUpdateName = (name: string) => {
    setMetrics(prev => ({ ...prev, operatorName: name }));
  };

  const handleActivatePathway = (track: LabTrack) => {
    setMetrics(prev => ({ ...prev, activePathway: track }));
  };

  const handleClearPathway = () => {
    setMetrics(prev => ({ ...prev, activePathway: 'ALL' }));
  };

  const handleResearchComplete = (cert: UserCertificate) => {
    setMetrics(prev => ({ 
      ...prev, 
      researchCompleted: true, 
      points: prev.points + 500,
      earnedCertificates: [...prev.earnedCertificates, cert]
    }));
  };

  const handleNeuralComplete = (cert: UserCertificate) => {
    setMetrics(prev => ({ 
      ...prev, 
      neuralBuilderCompleted: true, 
      points: prev.points + 1000,
      trackProgress: { ...prev.trackProgress, AI_ENGINEERING: (prev.trackProgress.AI_ENGINEERING || 0) + 1 },
      earnedCertificates: [...prev.earnedCertificates, cert]
    }));
  };

  const addQuickPoints = (pts: number, track: LabTrack) => {
    setMetrics(prev => ({ 
      ...prev, 
      points: prev.points + pts,
      trackProgress: { ...prev.trackProgress, [track]: (prev.trackProgress[track] || 0) + 0.1 }
    }));
  };

  const handleUpgrade = (plan: 'MONTHLY' | 'ANNUAL') => {
    if (!user) {
      alert("Error: No user session detected. Please sign in to upgrade.");
      return;
    }

    const base = plan === 'MONTHLY' 
      ? "https://buy.stripe.com/cNiaEQ8AVb9q8tY5xZao800" 
      : "https://buy.stripe.com/fZu6oA3gB91i9y23pRao801";
      
    const url =
  `${base}?client_reference_id=${encodeURIComponent(user.uid)}` +
  `&prefilled_email=${encodeURIComponent(user.email || "")}` +
  `&metadata[firebaseUID]=${encodeURIComponent(user.uid)}`;

window.location.href = url;

  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-zinc-800 border-t-white animate-spin"></div>
          <span className="animate-pulse">Syncing_Uplink...</span>
        </div>
      </div>
    );
  }

  if (view === AppView.TERMINAL) return <Terminal onComplete={handleTerminalComplete} />;
  
  if (!user) return <AuthView onAuthSuccess={handleAuthSuccess} />;

  // Gate: email/password users must verify email before using the app
  const needsEmailVerification =
    user?.providerData?.some((p) => p.providerId === "password") && !user.emailVerified;

  const handleResendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        alert("Verification email sent. Check your inbox (and spam).");
      }
    } catch (e: any) {
      alert(e?.message || "Failed to send verification email.");
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
        alert("Still not verified yet. After clicking the email link, come back and press Refresh.");
      }
    } catch (e: any) {
      alert(e?.message || "Failed to refresh verification status.");
    }
  };

  if (needsEmailVerification) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-zinc-200">
        <div className="w-full max-w-md border border-zinc-900 bg-zinc-950 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <h1 className="text-2xl font-light tracking-tight text-white">Verify your email</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We sent a verification link to <span className="text-white">{user.email}</span>.
            Please click the link in your inbox, then come back here.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              className="w-full border border-zinc-800 text-white py-3 rounded-full text-sm tracking-widest hover:border-white hover:bg-white/5 transition-all"
            >
              Resend verification email
            </button>

            <button
              onClick={handleRefreshVerification}
              className="w-full bg-white text-black py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
              I verified — Refresh
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-zinc-400 py-2 rounded-full text-sm hover:text-white transition-all"
            >
              Log out
            </button>
          </div>

          <p className="text-[11px] text-zinc-600">
            Tip: Check your spam/promotions folder. If you didn’t receive it, press “Resend”.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-200 selection:text-black">
      {isSnowing && <SnowOverlay />}
      
      {view === AppView.SPEED_LABS ? (
        <InfiniteSection onComplete={addQuickPoints} onExit={() => setView(AppView.DASHBOARD)} />
      ) : view === AppView.MISSION && activeMissionId ? (
        <MissionView mission={missions.find(m => m.id === activeMissionId)!} onExit={() => setView(AppView.DASHBOARD)} onComplete={completeMission} />
      ) : (
        <>
          <Sidebar currentView={view} setView={setView} isPremium={metrics.isPremium} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} onLogout={handleLogout} />
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            {view === AppView.DASHBOARD && (
              <Dashboard 
                metrics={metrics} 
                missions={missions} 
                onSelectMission={selectMission} 
                setView={setView} 
                onClearPathway={handleClearPathway}
                snowToggle={() => setIsSnowing(!isSnowing)}
                isSnowing={isSnowing}
                onUpdatePoints={handleUpdatePoints}
                onUpdateName={handleUpdateName}
              />
            )}
            {view === AppView.PORTFOLIO && <PortfolioView metrics={metrics} missions={missions} onUpdateName={handleUpdateName} onActivatePathway={handleActivatePathway} onSelectMission={selectMission} setView={setView} onLogout={handleLogout} />}
            {view === AppView.LEARN && <LearnView />}
            {view === AppView.UPGRADE && <UpgradeView onUpgrade={handleUpgrade} />}
            {view === AppView.LAB_CREATOR && <LabCreator isPremium={metrics.isPremium} onResearchComplete={() => {}} />}
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
            {view === AppView.NEURAL_BUILDER && <NeuralBuilder isPremium={metrics.isPremium} operatorName={metrics.operatorName || ''} onComplete={handleNeuralComplete} onExit={() => setView(AppView.DASHBOARD)} onUpdateOperatorName={handleUpdateName} />}
          </main>
        </>
      )}
    </div>
  );
};

export default App;