import React, { useState, useEffect, useMemo } from 'react';
import { UserMetrics, Mission, AppView, LabTrack } from '../types';
import VirtualSOC from './VirtualSOC';

interface DashboardProps {
  metrics: UserMetrics;
  missions: Mission[];
  onSelectMission: (id: string) => void;
  setView: (view: AppView) => void;
  onClearPathway: () => void;
  snowToggle: () => void;
  isSnowing: boolean;
  onUpdatePoints: (pts: number) => void;
  onUpdateName: (name: string) => void;
}

const trackLabels: Record<LabTrack, string> = {
  LIFE: 'Real Life Safety',
  SOVEREIGNTY: 'Digital Footprint',
  DEFENDER: 'Cybersecurity Projects',
  EXECUTIVE: 'Coding Projects',
  INTEL: 'Advanced Projects',
  ETHICS: 'AI Projects',
  AI_ENGINEERING: 'AI Projects',
};

const pathCards: { id: LabTrack; title: string; why: string }[] = [
  { id: 'ETHICS', title: 'AI Project Path', why: 'Understand model decisions and produce evidence-based AI analysis.' },
  { id: 'DEFENDER', title: 'Cybersecurity Project Path', why: 'Investigate real threats and document practical security responses.' },
  { id: 'EXECUTIVE', title: 'Coding Project Path', why: 'Build working tools and explain your technical implementation process.' },
  { id: 'INTEL', title: 'Advanced Research Path', why: 'Develop deeper investigations for advanced portfolio submissions.' },
];

const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  missions,
  onSelectMission,
  setView,
  onClearPathway,
  snowToggle,
  isSnowing,
  onUpdatePoints,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<LabTrack | 'ALL'>(metrics.activePathway || 'ALL');
  const [showPractice, setShowPractice] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const preferredTrack = localStorage.getItem('preferredTrack') as LabTrack | null;
    if (preferredTrack) {
      setSelectedTrack(preferredTrack);
      localStorage.removeItem('preferredTrack');
      return;
    }
    if (metrics.activePathway) setSelectedTrack(metrics.activePathway);
  }, [metrics.activePathway]);

  const filteredMissions = useMemo(
    () => (selectedTrack === 'ALL' ? missions : missions.filter((m) => m.track === selectedTrack)),
    [missions, selectedTrack],
  );

  const nextLab = useMemo(
    () => filteredMissions.find((m) => !m.completed) || filteredMissions[0] || null,
    [filteredMissions],
  );

  const recommended = useMemo(() => {
    const pending = filteredMissions.filter((m) => !m.completed);
    return (pending.length ? pending : filteredMissions).slice(0, visibleCount);
  }, [filteredMissions, visibleCount]);

  const total = filteredMissions.length || 1;
  const done = filteredMissions.filter((m) => m.completed).length;
  const progress = Math.round((done / total) * 100);

  if (showPractice) {
    return (
      <div className="p-8 md:p-12 pb-24 h-screen flex flex-col overflow-hidden">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold text-white">Cybersecurity Practice</h1>
            <p className="text-[15px] text-zinc-400 mt-2">Scenario practice with fast feedback and scoring.</p>
          </div>
          <button onClick={() => setShowPractice(false)} className="h-10 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-200 hover:border-zinc-500 transition-colors duration-200 ease-out">Back</button>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <VirtualSOC onUpdatePoints={onUpdatePoints} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 pb-24 h-screen flex flex-col overflow-hidden">
      <header className="mb-8 border-b border-zinc-900 pb-6 space-y-5 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold text-white">Continue Your Portfolio Project</h1>
            <p className="text-[15px] text-zinc-400 mt-2">
              You are not completing random labs. You are building structured project evidence.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => (nextLab ? onSelectMission(nextLab.id) : null)}
              className="h-11 rounded-lg px-5 text-[15px] font-semibold bg-white text-black hover:bg-zinc-200 transition-colors duration-200 ease-out"
            >
              {nextLab ? 'Continue Project' : 'Start'}
            </button>
            <button
              onClick={() => setView(AppView.PORTFOLIO)}
              className="h-11 rounded-lg px-5 text-[15px] font-semibold border border-zinc-700 text-zinc-100 hover:border-zinc-500 transition-colors duration-200 ease-out"
            >
              Add to Portfolio
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-[15px] text-zinc-500">Current Progress</p>
            <p className="mt-1 text-[26px] font-semibold text-white">{progress}%</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-[15px] text-zinc-500">Labs Completed</p>
            <p className="mt-1 text-[26px] font-semibold text-white">{metrics.labsCompleted}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-[15px] text-zinc-500">Why It Matters</p>
            <p className="mt-1 text-[15px] text-zinc-300">Your outputs become portfolio proof for internships and applications.</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-6">
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedTrack('ALL');
                  onClearPathway();
                  setVisibleCount(4);
                }}
                className={`h-9 rounded-lg px-3 text-[15px] transition-all duration-200 ease-out ${selectedTrack === 'ALL' ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
              >
                All Paths
              </button>
              {pathCards.map((path) => (
                <button
                  key={path.id}
                  onClick={() => {
                    setSelectedTrack(path.id);
                    setVisibleCount(4);
                  }}
                  className={`h-9 rounded-lg px-3 text-[15px] transition-all duration-200 ease-out ${selectedTrack === path.id ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                >
                  {path.title.replace(' Path', '')}
                </button>
              ))}
            </div>
            <button onClick={snowToggle} className="text-[15px] text-zinc-400 hover:text-zinc-200 transition-colors duration-200 ease-out">
              {isSnowing ? 'Disable Snow' : 'Enable Snow'}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-[26px] font-semibold text-white">Project Paths</h2>
          <p className="mt-2 text-[15px] text-zinc-400">Choose a path based on what you want to prove in your portfolio.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {pathCards.map((path) => (
              <button
                key={path.id}
                onClick={() => setSelectedTrack(path.id)}
                className="text-left rounded-xl border border-zinc-800 bg-black p-5 hover:bg-zinc-900/70 transition-colors duration-200 ease-out"
              >
                <h3 className="text-[20px] font-semibold text-white">{path.title}</h3>
                <p className="mt-2 text-[15px] text-zinc-300">{path.why}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[26px] font-semibold text-white mb-4">
            {selectedTrack === 'ALL' ? 'Recommended Project Labs' : `Recommended · ${trackLabels[selectedTrack]}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {recommended.map((mission) => (
              <button
                key={mission.id}
                onClick={() => onSelectMission(mission.id)}
                className={`text-left rounded-xl border border-zinc-800 bg-zinc-950 p-6 hover:bg-zinc-900 transition-all duration-200 ease-out min-h-[260px] flex flex-col justify-between ${mission.completed ? 'opacity-60' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[15px] text-zinc-500">{trackLabels[mission.track] || mission.track}</p>
                    {mission.completed && <span className="text-[12px] rounded-full border border-emerald-700/70 bg-emerald-900/20 px-2 py-1 text-emerald-300">Output Ready</span>}
                  </div>
                  <h3 className="mt-2 text-[20px] font-semibold text-white">{mission.title}</h3>
                  <p className="mt-3 text-[15px] text-zinc-400 line-clamp-2">{mission.description}</p>
                  <ul className="mt-4 space-y-1 text-[15px] text-zinc-500">
                    <li>• Concept</li>
                    <li>• Investigation + Application</li>
                    <li>• Structured Output + Reflection</li>
                  </ul>
                </div>
                <p className="mt-4 text-[15px] text-zinc-300">{mission.completed ? 'Add to Portfolio' : 'Start Lab →'}</p>
              </button>
            ))}
          </div>

          {recommended.length < filteredMissions.length && (
            <button onClick={() => setVisibleCount((prev) => prev + 4)} className="mt-5 h-10 rounded-lg px-5 text-[15px] border border-zinc-700 text-zinc-200 hover:border-zinc-500 transition-colors duration-200 ease-out">Show More</button>
          )}
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-[26px] font-semibold text-white">Advanced Work</h2>
          <p className="mt-2 text-[15px] text-zinc-400">Use deeper tools when you are ready to build long-form research artifacts.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => setShowPractice(true)} className="h-10 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-100 hover:border-zinc-500 transition-colors duration-200 ease-out">Start Practice</button>
            <button onClick={() => setView(AppView.RESEARCH)} className="h-10 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-100 hover:border-zinc-500 transition-colors duration-200 ease-out">Open Research Suite</button>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-zinc-800 bg-black/95 backdrop-blur p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] text-zinc-400">{nextLab ? `Next Step: ${nextLab.title}` : 'All current labs complete. Add your output to portfolio.'}</p>
        <div className="flex gap-3">
          <button
            onClick={() => (nextLab ? onSelectMission(nextLab.id) : setView(AppView.DASHBOARD))}
            className="h-10 rounded-lg px-4 text-[15px] font-semibold bg-white text-black hover:bg-zinc-200 transition-colors duration-200 ease-out"
          >
            Continue Project
          </button>
          <button
            onClick={() => setView(AppView.PORTFOLIO)}
            className="h-10 rounded-lg px-4 text-[15px] font-semibold border border-zinc-700 text-zinc-100 hover:border-zinc-500 transition-colors duration-200 ease-out"
          >
            Add to Portfolio
          </button>
        </div>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:#27272a;border-radius:10px}`}</style>
    </div>
  );
};

export default Dashboard;
