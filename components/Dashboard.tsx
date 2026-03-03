import React, { useState, useEffect } from 'react';
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

const starterTracks: { id: LabTrack; title: string; summary: string }[] = [
  { id: 'ETHICS', title: 'AI Projects', summary: 'Build and evaluate model-driven projects with structured evidence.' },
  { id: 'DEFENDER', title: 'Cybersecurity Projects', summary: 'Investigate incidents and produce clear security recommendations.' },
  { id: 'EXECUTIVE', title: 'Coding Projects', summary: 'Create practical software outcomes with test-backed implementation.' },
  { id: 'INTEL', title: 'Advanced Projects', summary: 'Run deeper investigations and publish advanced portfolio artifacts.' },
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
  const [showLabs, setShowLabs] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    const preferredTrack = localStorage.getItem('preferredTrack') as LabTrack | null;
    if (preferredTrack) {
      setSelectedTrack(preferredTrack);
      setShowLabs(true);
      localStorage.removeItem('preferredTrack');
      return;
    }

    if (metrics.activePathway) {
      setSelectedTrack(metrics.activePathway);
      setShowLabs(true);
    }
  }, [metrics.activePathway]);

  const filteredMissions = selectedTrack === 'ALL'
    ? missions
    : missions.filter((m) => m.track === selectedTrack);

  const recommendedLabs = filteredMissions.filter((m) => !m.completed);
  const visibleLabs = (recommendedLabs.length ? recommendedLabs : filteredMissions).slice(0, visibleCount);

  const handleChooseTrack = (track: LabTrack) => {
    setSelectedTrack(track);
    setShowLabs(true);
    setShowPractice(false);
    setVisibleCount(3);
  };

  if (showPractice) {
    return (
      <div className="p-8 md:p-12 pb-24 h-screen flex flex-col overflow-hidden">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold text-white">Cybersecurity Practice</h1>
            <p className="text-[15px] text-zinc-400 mt-2">Focused simulations to sharpen analysis and incident response thinking.</p>
          </div>
          <button
            onClick={() => setShowPractice(false)}
            className="h-10 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-200 hover:border-zinc-500 transition-colors duration-200 ease-out"
          >
            Back to Dashboard
          </button>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <VirtualSOC onUpdatePoints={onUpdatePoints} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 pb-24 h-screen flex flex-col overflow-hidden">
      <header className="mb-8 border-b border-zinc-900 pb-6 flex flex-col gap-5 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold text-white">Project Dashboard</h1>
            <p className="text-[15px] text-zinc-400 mt-2">Clear steps. Structured labs. Strong portfolio outputs.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPractice(true)}
              className="h-10 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-200 hover:border-zinc-500 transition-colors duration-200 ease-out"
            >
              Open Cybersecurity Practice
            </button>
            <button
              onClick={() => setView(AppView.RESEARCH)}
              className="h-10 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-200 hover:border-zinc-500 transition-colors duration-200 ease-out"
            >
              Open Advanced Projects
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-[15px] text-zinc-400">
          <span>{metrics.labsCompleted} Labs Completed</span>
          <span>{metrics.points.toLocaleString()} Points</span>
          <button onClick={snowToggle} className="hover:text-zinc-200 transition-colors duration-200 ease-out">
            {isSnowing ? 'Disable Snow' : 'Enable Snow'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!showLabs ? (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 md:p-10 space-y-6">
            <div>
              <h2 className="text-[26px] font-semibold text-white">Start Here</h2>
              <p className="mt-3 text-[15px] text-zinc-300 max-w-3xl">
                Choose a project track, complete structured labs, generate portfolio outputs, and add them to your showcase.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {starterTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleChooseTrack(track.id)}
                  className="text-left rounded-xl border border-zinc-800 bg-black p-6 hover:bg-zinc-900/70 transition-all duration-200 ease-out"
                >
                  <h3 className="text-[20px] font-semibold text-white">{track.title}</h3>
                  <p className="mt-3 text-[15px] text-zinc-300">{track.summary}</p>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-[26px] font-semibold text-white">{selectedTrack === 'ALL' ? 'All Tracks' : trackLabels[selectedTrack]}</h2>
                <p className="mt-2 text-[15px] text-zinc-400">Each lab includes concept, application, output, and reflection.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedTrack('ALL');
                    onClearPathway();
                    setVisibleCount(3);
                  }}
                  className="h-10 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-200 hover:border-zinc-500 transition-colors duration-200 ease-out"
                >
                  View All
                </button>
                <button
                  onClick={() => setShowLabs(false)}
                  className="h-10 rounded-lg px-4 text-[15px] border border-zinc-700 text-zinc-200 hover:border-zinc-500 transition-colors duration-200 ease-out"
                >
                  Change Track
                </button>
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-[20px] font-semibold text-white mb-4">Recommended Next Labs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
                {visibleLabs.map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => onSelectMission(mission.id)}
                    className={`text-left rounded-xl border border-zinc-800 bg-zinc-950 p-6 hover:bg-zinc-900 transition-all duration-200 ease-out min-h-[250px] flex flex-col justify-between ${mission.completed ? 'opacity-50' : ''}`}
                  >
                    <div>
                      <p className="text-[15px] text-zinc-500">{trackLabels[mission.track] || mission.track}</p>
                      <h4 className="mt-2 text-[20px] font-semibold text-white">{mission.title}</h4>
                      <p className="mt-3 text-[15px] text-zinc-400 line-clamp-2">{mission.description}</p>
                      <ul className="mt-4 space-y-1 text-[15px] text-zinc-500">
                        <li>• Concept</li>
                        <li>• Application</li>
                        <li>• Structured Output + Reflection</li>
                      </ul>
                    </div>
                    <p className="mt-4 text-[15px] text-zinc-300">{mission.completed ? 'Completed' : 'Start Lab →'}</p>
                  </button>
                ))}
              </div>

              {visibleLabs.length < (recommendedLabs.length ? recommendedLabs.length : filteredMissions.length) && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="h-10 rounded-lg px-5 text-[15px] border border-zinc-700 text-zinc-200 hover:border-zinc-500 transition-colors duration-200 ease-out"
                >
                  Show More Labs
                </button>
              )}
            </section>
          </>
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
