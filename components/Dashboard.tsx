import React, { useState, useEffect } from 'react';
import { UserMetrics, Mission, AppView, LabTrack, DashboardSubView } from '../types';
import VirtualSOC from './VirtualSOC';
import NeuralBuilder from './NeuralBuilder';

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
  DEFENDER: 'Security Analyst',
  EXECUTIVE: 'Tech Leadership',
  INTEL: 'Open Source Research',
  ETHICS: 'AI & Society',
  AI_ENGINEERING: 'AI Projects',
};

const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  missions,
  onSelectMission,
  setView,
  onClearPathway,
  snowToggle,
  isSnowing,
  onUpdatePoints,
  onUpdateName,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<LabTrack | 'ALL'>(metrics.activePathway || 'ALL');
  const [subView, setSubView] = useState<DashboardSubView>(DashboardSubView.INTEL_HUB);
  const [showLabs, setShowLabs] = useState(false);

  useEffect(() => {
    if (metrics.activePathway) {
      setSelectedTrack(metrics.activePathway);
      setShowLabs(true);
    }
  }, [metrics.activePathway]);

  const trackOptions = Object.entries(trackLabels)
    .filter(([id]) => id !== 'AI_ENGINEERING')
    .map(([id, label]) => ({ id: id as LabTrack, label }));

  const filteredMissions = selectedTrack === 'ALL'
    ? missions
    : missions.filter((m) => m.track === selectedTrack);

  const nextLabs = filteredMissions.filter((m) => !m.completed).slice(0, 6);

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700 pb-24 h-screen flex flex-col overflow-hidden">
      <header className="mb-8 border-b border-zinc-900 pb-6 flex flex-col gap-6 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold text-zinc-100">Project Dashboard</h1>
            <p className="text-[15px] text-zinc-400 mt-2">
              Choose a track, complete focused labs, and turn your work into portfolio projects.
            </p>
          </div>

          <nav className="flex bg-zinc-950 border border-zinc-900 p-1 rounded-md w-fit">
            {[
              { id: DashboardSubView.INTEL_HUB, label: 'Labs' },
              { id: DashboardSubView.VIRTUAL_SOC, label: 'Cybersecurity Practice' },
              { id: DashboardSubView.NEURAL_OPS, label: 'Advanced Builder' },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setSubView(view.id)}
                className={`px-4 py-2 text-[15px] font-medium rounded transition-all ${
                  subView === view.id ? 'bg-zinc-100 text-black' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {view.label}
                {view.id === DashboardSubView.NEURAL_OPS && !metrics.isPremium && (
                  <span className="ml-2 text-[10px] text-zinc-500">Locked</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[15px] text-zinc-400">
          <span>{metrics.labsCompleted} Labs Completed</span>
          <span>{metrics.points.toLocaleString()} Points</span>
          <button onClick={snowToggle} className="hover:text-zinc-200 transition-colors">
            {isSnowing ? 'Disable Snow' : 'Enable Snow'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {subView === DashboardSubView.INTEL_HUB && (
          <div className="space-y-8">
            {!showLabs ? (
              <section className="grid gap-6 lg:grid-cols-3">
                <article className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
                  <h2 className="text-[26px] font-semibold text-white">Start Here</h2>
                  <ol className="mt-4 space-y-3 text-[15px] text-zinc-300">
                    <li>1. Choose a track that matches your interest.</li>
                    <li>2. Complete labs with clear prompts and outputs.</li>
                    <li>3. Turn completed work into a structured portfolio project.</li>
                  </ol>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowLabs(true)}
                      className="h-11 rounded-lg px-6 text-[15px] font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
                    >
                      Browse Labs
                    </button>
                    <button
                      onClick={() => setView(AppView.PORTFOLIO)}
                      className="h-11 rounded-lg px-6 text-[15px] font-semibold border border-zinc-700 text-zinc-100 hover:border-zinc-500 transition-colors"
                    >
                      View Portfolio
                    </button>
                  </div>
                </article>

                <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
                  <h3 className="text-[20px] font-semibold text-white">Your Progress</h3>
                  <p className="mt-4 text-[15px] text-zinc-300">Completed Labs: {metrics.labsCompleted}</p>
                  <p className="mt-2 text-[15px] text-zinc-300">Points: {metrics.points.toLocaleString()}</p>
                  <p className="mt-2 text-[15px] text-zinc-300">Plan: {metrics.isPremium ? 'Pro' : 'Free'}</p>
                </article>
              </section>
            ) : (
              <>
                <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-[26px] font-semibold text-white">Labs</h2>
                    <p className="mt-2 text-[15px] text-zinc-400">Choose one track to reduce clutter and stay focused.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={selectedTrack}
                      onChange={(e) => {
                        const value = e.target.value as LabTrack | 'ALL';
                        setSelectedTrack(value);
                        if (value === 'ALL') onClearPathway();
                      }}
                      className="h-11 rounded-lg border border-zinc-700 bg-zinc-950 px-4 text-[15px] text-zinc-100 outline-none"
                    >
                      <option value="ALL">All Tracks</option>
                      {trackOptions.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowLabs(false)}
                      className="h-11 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-100 hover:border-zinc-500 transition-colors"
                    >
                      Back to Overview
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-[20px] font-semibold text-white mb-4">Recommended Next Labs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                    {(nextLabs.length ? nextLabs : filteredMissions.slice(0, 6)).map((mission) => (
                      <button
                        key={mission.id}
                        onClick={() => onSelectMission(mission.id)}
                        className={`text-left border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900/30 transition-all flex flex-col justify-between min-h-[220px] ${mission.completed ? 'opacity-50' : ''}`}
                      >
                        <div>
                          <p className="text-[15px] text-zinc-500">{trackLabels[mission.track] || mission.track}</p>
                          <h4 className="text-[20px] font-semibold text-zinc-100 mt-2">{mission.title}</h4>
                          <p className="text-[15px] text-zinc-400 mt-3 line-clamp-3">{mission.description}</p>
                        </div>
                        <p className="text-[15px] text-zinc-300 mt-5">{mission.completed ? 'Completed' : 'Open Lab →'}</p>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {subView === DashboardSubView.VIRTUAL_SOC && <VirtualSOC onUpdatePoints={onUpdatePoints} />}

        {subView === DashboardSubView.NEURAL_OPS && (
          <div className="h-full">
            {!metrics.isPremium ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-6">
                <h2 className="text-[26px] font-semibold text-zinc-100">Advanced Builder Locked</h2>
                <p className="text-zinc-400 text-[15px] max-w-md">
                  Upgrade to Pro to access advanced project modules and deeper structured workflows.
                </p>
                <button
                  onClick={() => setView(AppView.UPGRADE)}
                  className="h-11 rounded-lg px-8 text-[15px] font-semibold bg-zinc-100 text-black hover:bg-white transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            ) : (
              <NeuralBuilder
                isPremium={metrics.isPremium}
                operatorName={metrics.operatorName || ''}
                onUpdateOperatorName={onUpdateName}
                onComplete={() => onUpdatePoints(500)}
                onExit={() => setSubView(DashboardSubView.INTEL_HUB)}
              />
            )}
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
