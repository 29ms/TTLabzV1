import React, { useEffect, useMemo, useState } from 'react';
import { AppView, LabTrack, Mission, UserMetrics } from '../types';

interface DashboardProps {
  metrics: UserMetrics;
  missions: Mission[];
  onSelectMission: (id: string) => void;
  setView: (view: AppView) => void;
  onClearPathway: () => void;
  mode?: 'HOME' | 'PROJECTS';
}

const paths: { id: LabTrack; title: string; level: string; output: string }[] = [
  { id: 'ETHICS', title: 'AI Projects', level: 'Foundations → Builder → Advanced', output: 'Technical brief' },
  { id: 'DEFENDER', title: 'Cybersecurity Projects', level: 'Foundations → Builder → Advanced', output: 'Security audit report' },
  { id: 'EXECUTIVE', title: 'Coding Projects', level: 'Foundations → Builder → Advanced', output: 'Prototype case study' },
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

const Dashboard: React.FC<DashboardProps> = ({ metrics, missions, onSelectMission, setView, onClearPathway, mode = 'HOME' }) => {
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

  const projectMissions = useMemo(() => missions.filter((mission) => allowedTracks.has(mission.track)), [missions]);
  const filteredMissions = useMemo(() => {
    if (selectedTrack === 'ALL') return projectMissions;
    return projectMissions.filter((mission) => mission.track === selectedTrack);
  }, [projectMissions, selectedTrack]);

  const nextProject = useMemo(() => filteredMissions.find((mission) => !mission.completed) || filteredMissions[0] || null, [filteredMissions]);
  const completedProjects = projectMissions.filter((mission) => mission.completed).length;
  const portfolioProgress = projectMissions.length ? Math.round((completedProjects / projectMissions.length) * 100) : 0;
  const featuredProjects = useMemo(() => {
    const pending = filteredMissions.filter((mission) => !mission.completed);
    return (pending.length ? pending : filteredMissions).slice(0, mode === 'HOME' ? 2 : 9);
  }, [filteredMissions, mode]);

  return (
    <div className="relative min-h-screen bg-black px-6 pb-12 pt-8 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_8%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.12),transparent_30%)]" />
      <div className="relative space-y-6">
        {mode === 'HOME' ? (
          <>
            <header className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur md:p-8">
              <p className="text-sm text-zinc-400">Home</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Your next project is ready.</h1>
              <p className="mt-3 max-w-3xl text-sm text-zinc-300 md:text-base">
                Build serious tech projects step-by-step and convert each one into portfolio proof you can use for real opportunities.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => (nextProject ? onSelectMission(nextProject.id) : setView(AppView.PROJECTS))}
                  className="h-11 rounded-lg bg-white px-5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-zinc-200"
                >
                  {nextProject ? 'Continue next project step' : 'Go to projects'}
                </button>
                <button
                  onClick={() => setView(AppView.PROJECTS)}
                  className="h-11 rounded-lg border border-white/20 px-5 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Open projects workspace
                </button>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur">
                <p className="text-sm text-zinc-400">Projects Completed</p>
                <p className="mt-2 text-3xl font-semibold text-white">{completedProjects}</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur">
                <p className="text-sm text-zinc-400">Portfolio Progress</p>
                <p className="mt-2 text-3xl font-semibold text-white">{portfolioProgress}%</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur">
                <p className="text-sm text-zinc-400">Recommended Path</p>
                <p className="mt-2 text-lg font-semibold text-white">{selectedTrack === 'ALL' ? 'AI Projects' : trackLabel[selectedTrack]}</p>
                <p className="mt-2 text-sm text-zinc-400">This path gives the clearest progression from foundations to advanced work.</p>
              </article>
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Start here</h2>
                  <p className="mt-2 text-sm text-zinc-400">These are your highest-impact next steps.</p>
                </div>
                <button
                  onClick={() => setView(AppView.PROJECTS)}
                  className="h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  See all projects
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {featuredProjects.map((mission) => (
                  <article key={mission.id} className="rounded-2xl border border-white/10 bg-black/50 p-5 transition hover:border-white/25">
                    <p className="text-sm text-zinc-400">{trackLabel[mission.track]}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{mission.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{mission.description}</p>
                    <button
                      onClick={() => onSelectMission(mission.id)}
                      className="mt-4 h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                      {mission.completed ? 'Review output' : 'Start step'}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <header className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur md:p-8">
              <p className="text-sm text-zinc-400">Projects</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Project workspace</h1>
              <p className="mt-3 max-w-3xl text-sm text-zinc-300 md:text-base">
                Choose a path, then complete guided project steps in order. Each completion can be added to your portfolio.
              </p>
            </header>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Paths</h2>
                  <p className="mt-2 text-sm text-zinc-400">Focused pathways with clear levels and portfolio outcomes.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTrack('ALL');
                    onClearPathway();
                  }}
                  className="h-9 rounded-lg border border-white/15 px-3 text-sm text-zinc-300 transition hover:border-white/35 hover:text-white"
                >
                  Reset to all
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {paths.map((path) => (
                  <article
                    key={path.id}
                    className={`rounded-2xl border p-5 transition duration-300 ${
                      selectedTrack === path.id
                        ? 'border-blue-300/50 bg-blue-400/10 shadow-[0_10px_30px_rgba(59,130,246,0.15)]'
                        : 'border-white/10 bg-black/50 hover:border-white/25'
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-white">{path.title}</h3>
                    <p className="mt-2 text-sm text-zinc-300">{path.level}</p>
                    <p className="mt-1 text-sm text-zinc-400">Portfolio output: {path.output}</p>
                    <button
                      onClick={() => setSelectedTrack(path.id)}
                      className="mt-4 h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                      {selectedTrack === path.id ? 'Selected path' : 'Choose path'}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur md:p-8">
              <h2 className="text-xl font-semibold text-white">All guided project steps</h2>
              <p className="mt-2 text-sm text-zinc-400">Structured tasks from context through output and reflection.</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featuredProjects.map((mission) => (
                  <article key={mission.id} className="flex min-h-[230px] flex-col justify-between rounded-2xl border border-white/10 bg-black/50 p-5 transition hover:-translate-y-0.5 hover:border-white/25">
                    <div>
                      <p className="text-sm text-zinc-400">{trackLabel[mission.track]}</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">{mission.title}</h3>
                      <p className="mt-2 text-sm text-zinc-400">{mission.description}</p>
                    </div>
                    <button
                      onClick={() => onSelectMission(mission.id)}
                      className="mt-4 h-10 rounded-lg border border-white/20 px-4 text-left text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                      {mission.completed ? 'Review project output' : 'Start project step'}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
