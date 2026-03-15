import React, { useEffect, useMemo, useState } from 'react';
import { AppView, LabTrack, Mission, UserMetrics } from '../types';

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

const paths: { id: LabTrack; title: string; level: string; output: string }[] = [
  { id: 'ETHICS', title: 'AI Projects', level: 'Foundations → Builder → Advanced', output: 'Technical brief' },
  { id: 'DEFENDER', title: 'Cybersecurity Projects', level: 'Foundations → Builder → Advanced', output: 'Security audit' },
  { id: 'EXECUTIVE', title: 'Coding Projects', level: 'Foundations → Builder → Advanced', output: 'Prototype report' },
  { id: 'INTEL', title: 'Advanced Projects', level: 'Builder → Advanced', output: 'Research output' },
];

const trackLabel: Record<LabTrack, string> = {
  LIFE: 'Foundational Safety',
  SOVEREIGNTY: 'Digital Identity',
  DEFENDER: 'Cybersecurity Projects',
  EXECUTIVE: 'Coding Projects',
  INTEL: 'Advanced Projects',
  ETHICS: 'AI Projects',
  AI_ENGINEERING: 'AI Projects',
};

const allowedTracks = new Set<LabTrack>(['ETHICS', 'DEFENDER', 'EXECUTIVE', 'INTEL', 'AI_ENGINEERING']);

const Dashboard: React.FC<DashboardProps> = ({ metrics, missions, onSelectMission, setView, onClearPathway }) => {
  const [selectedTrack, setSelectedTrack] = useState<LabTrack | 'ALL'>(metrics.activePathway || 'ALL');

  useEffect(() => {
    const preferredTrack = localStorage.getItem('preferredTrack') as LabTrack | null;
    if (preferredTrack) {
      setSelectedTrack(preferredTrack);
      localStorage.removeItem('preferredTrack');
      return;
    }
    if (metrics.activePathway) setSelectedTrack(metrics.activePathway);
  }, [metrics.activePathway]);

  const projectMissions = useMemo(
    () => missions.filter((mission) => allowedTracks.has(mission.track)),
    [missions],
  );

  const filteredMissions = useMemo(() => {
    if (selectedTrack === 'ALL') return projectMissions;
    return projectMissions.filter((mission) => mission.track === selectedTrack);
  }, [projectMissions, selectedTrack]);

  const nextProject = useMemo(
    () => filteredMissions.find((mission) => !mission.completed) || filteredMissions[0] || null,
    [filteredMissions],
  );

  const projectSteps = useMemo(() => {
    const pending = filteredMissions.filter((mission) => !mission.completed);
    return (pending.length ? pending : filteredMissions).slice(0, 3);
  }, [filteredMissions]);

  const completedProjects = projectMissions.filter((mission) => mission.completed).length;
  const portfolioProgress = projectMissions.length
    ? Math.round((completedProjects / projectMissions.length) * 100)
    : 0;

  return (
    <div className="relative h-screen overflow-hidden bg-[#0B0F14] px-6 pb-28 pt-8 md:px-10">
      <div className="h-full overflow-y-auto space-y-6 pb-6 pr-1">
        <header className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
          <p className="text-sm text-[#9CA3AF]">Home</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">Your next project is ready.</h1>
          <p className="mt-3 max-w-3xl text-sm text-[#9CA3AF]">
            Build serious work in AI, cybersecurity, coding, and advanced research. Every step is designed to become portfolio proof.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => (nextProject ? onSelectMission(nextProject.id) : null)}
              className="h-11 rounded-lg bg-white px-5 text-sm font-medium text-black transition-all duration-200 ease-out hover:bg-zinc-200"
            >
              {nextProject ? 'Continue Project' : 'Start Project'}
            </button>
            <button
              onClick={() => setView(AppView.PORTFOLIO)}
              className="h-11 rounded-lg border border-[#1F2937] px-5 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
            >
              Add to Portfolio
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
              <p className="text-sm text-[#9CA3AF]">Projects Completed</p>
              <p className="mt-2 text-xl font-semibold text-[#F9FAFB]">{completedProjects}</p>
            </article>
            <article className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
              <p className="text-sm text-[#9CA3AF]">Portfolio Progress</p>
              <p className="mt-2 text-xl font-semibold text-[#F9FAFB]">{portfolioProgress}%</p>
            </article>
            <article className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
              <p className="text-sm text-[#9CA3AF]">Why this matters</p>
              <p className="mt-2 text-sm text-[#F9FAFB]">These outputs strengthen applications, scholarships, and internship profiles.</p>
            </article>
          </div>
        </header>

        <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-[#F9FAFB]">Paths</h2>
          <p className="mt-2 text-sm text-[#9CA3AF]">Choose a path and progress from foundations to advanced work.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedTrack('ALL');
                onClearPathway();
              }}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-out ${
                selectedTrack === 'ALL' ? 'bg-white text-black' : 'border border-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              All
            </button>
            {paths.map((path) => (
              <button
                key={path.id}
                onClick={() => setSelectedTrack(path.id)}
                className={`h-9 rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-out ${
                  selectedTrack === path.id
                    ? 'bg-white text-black'
                    : 'border border-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB]'
                }`}
              >
                {path.title}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {paths.map((path) => (
              <article key={path.id} className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-5">
                <h3 className="text-xl font-semibold text-[#F9FAFB]">{path.title}</h3>
                <p className="mt-2 text-sm text-[#9CA3AF]">Levels: <span className="text-[#F9FAFB]">{path.level}</span></p>
                <p className="mt-1 text-sm text-[#9CA3AF]">Output: <span className="text-[#F9FAFB]">{path.output}</span></p>
                <button
                  onClick={() => setSelectedTrack(path.id)}
                  className="mt-4 h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
                >
                  Choose Path
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-[#F9FAFB]">Projects</h2>
          <p className="mt-2 text-sm text-[#9CA3AF]">Complete these guided project steps and convert them into portfolio proof.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {projectSteps.map((mission) => (
              <article key={mission.id} className="flex min-h-[230px] flex-col justify-between rounded-xl border border-[#1F2937] bg-[#0B0F14] p-5">
                <div>
                  <p className="text-sm text-[#9CA3AF]">{trackLabel[mission.track]}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#F9FAFB]">{mission.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-[#9CA3AF]">{mission.description}</p>
                </div>
                <button
                  onClick={() => onSelectMission(mission.id)}
                  className="mt-4 h-10 rounded-lg border border-[#1F2937] px-4 text-left text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
                >
                  {mission.completed ? 'Add to Portfolio' : 'Start Project Step'}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#1F2937] bg-[#0B0F14]/95 p-4 backdrop-blur md:left-[18rem]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#9CA3AF]">
            {nextProject ? `Next step: ${nextProject.title}` : 'All visible steps complete. Add your output to Portfolio.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => (nextProject ? onSelectMission(nextProject.id) : null)}
              className="h-10 rounded-lg bg-white px-4 text-sm font-medium text-black transition-all duration-200 ease-out hover:bg-zinc-200"
            >
              Continue Project
            </button>
            <button
              onClick={() => setView(AppView.PORTFOLIO)}
              className="h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
            >
              Add to Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
