import React, { useMemo, useState } from 'react';
import { AppView, LabTrack, Mission, UserMetrics } from '../types';

interface DashboardProps {
  metrics: UserMetrics;
  missions: Mission[];
  onSelectMission: (id: string) => void;
  setView: (view: AppView) => void;
  onClearPathway: () => void;
  mode?: 'DASHBOARD' | 'TRACKS';
}

const trackMeta: Record<LabTrack, { label: string; summary: string; image: string }> = {
  ETHICS: {
    label: 'Artificial Intelligence',
    summary: 'Model evaluation, prompt systems, and decision-ready AI reports.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
  DEFENDER: {
    label: 'Cybersecurity',
    summary: 'Threat analysis, secure architecture, and real defense strategy.',
    image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80',
  },
  EXECUTIVE: {
    label: 'Coding Systems',
    summary: 'Software builds with planning, implementation, and clean execution.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  INTEL: {
    label: 'Robotics',
    summary: 'Automation systems, embedded logic, and prototype development.',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80',
  },
};

const trackList = Object.keys(trackMeta) as LabTrack[];
const accent = '#c1121f';
const accentDark = '#a30f1a';

const Dashboard: React.FC<DashboardProps> = ({ metrics, missions, onSelectMission, setView, onClearPathway, mode = 'DASHBOARD' }) => {
  const [selectedTrack, setSelectedTrack] = useState<LabTrack | 'ALL'>(metrics.activePathway || 'ALL');
  const [viewFilter, setViewFilter] = useState<'ALL' | 'BASIC' | 'ADVANCED'>('ALL');

  const filtered = useMemo(() => {
    const byTrack = selectedTrack === 'ALL' ? missions : missions.filter((mission) => mission.track === selectedTrack);
    if (viewFilter === 'ALL') return byTrack;
    return byTrack.filter((mission) => mission.level === viewFilter);
  }, [missions, selectedTrack, viewFilter]);

  const completedModules = missions.filter((mission) => mission.completed);
  const activeModules = missions.filter((mission) => !mission.completed).slice(0, 3);
  const nextModule = activeModules[0] || missions[0];
  const completionRate = missions.length ? Math.round((completedModules.length / missions.length) * 100) : 0;

  if (mode === 'DASHBOARD') {
    return (
      <div className="min-h-screen bg-[#0b0b0d] px-6 py-8 text-[#EAEAEA] md:px-10">
        <div className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[2rem] border border-white/10 bg-[#121215] p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-[#fca5a5]">Dashboard</p>
              <h1 className="mt-4 text-[40px] font-semibold leading-tight text-white">Your next impressive project is ready.</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                Build advanced portfolio work step by step, then take it further in the Project Development Lab.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => (nextModule ? onSelectMission(nextModule.id) : setView(AppView.TRACKS))}
                  className="h-12 rounded-full bg-[#c1121f] px-6 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-[#a30f1a]"
                >
                  Continue current project
                </button>
                <button
                  onClick={() => setView(AppView.TRACKS)}
                  className="h-12 rounded-full border border-white/10 px-6 text-sm font-medium text-white transition-all duration-200 ease-out hover:border-[#c1121f] hover:bg-white/[0.04]"
                >
                  Browse projects
                </button>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#121215]">
              <div className="relative h-full min-h-[280px] bg-cover bg-center" style={{ backgroundImage: `url('${trackMeta[nextModule?.track || 'ETHICS'].image}')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#fecaca]">Continue building</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">{nextModule?.title || 'Choose your first project'}</h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-200">{nextModule?.description || 'Open the project browser to begin.'}</p>
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {[
              ['My Projects', `${activeModules.length} active`],
              ['Completed Projects', `${completedModules.length}`],
              ['Portfolio Progress', `${completionRate}%`],
              ['Current Tier', metrics.isPremium ? 'Pro' : 'Starter'],
            ].map(([label, value]) => (
              <article key={label} className="rounded-[1.5rem] border border-white/10 bg-[#121215] p-6">
                <p className="text-sm text-zinc-400">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[2rem] border border-white/10 bg-[#121215] p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">My projects</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Work already in motion</h2>
                </div>
                <button
                  onClick={() => setView(AppView.TRACKS)}
                  className="h-11 rounded-full border border-white/10 px-5 text-sm font-medium text-white transition-all duration-200 ease-out hover:border-[#c1121f]"
                >
                  View all
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {activeModules.map((module, index) => (
                  <button
                    key={module.id}
                    onClick={() => onSelectMission(module.id)}
                    className="flex w-full items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-5 py-5 text-left transition-all duration-200 ease-out hover:border-[#c1121f]/45 hover:bg-white/[0.05]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[#fca5a5]">Project {index + 1}</p>
                      <p className="mt-2 text-xl font-semibold text-white">{module.title}</p>
                      <p className="mt-2 text-sm text-zinc-400">{trackMeta[module.track].label}</p>
                    </div>
                    <span className="rounded-full bg-[#c1121f] px-4 py-2 text-xs font-semibold text-white">Continue</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-[#121215] p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Browse projects</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Four ambitious tracks</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {trackList.map((track) => (
                  <button
                    key={track}
                    onClick={() => {
                      setSelectedTrack(track);
                      setView(AppView.TRACKS);
                    }}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] text-left transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#c1121f]/45"
                  >
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('${trackMeta[track].image}')` }} />
                    <div className="p-5">
                      <p className="text-lg font-semibold text-white">{trackMeta[track].label}</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-400">{trackMeta[track].summary}</p>
                    </div>
                  </button>
                ))}
              </div>
            </article>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0d] px-6 py-8 text-[#EAEAEA] md:px-10">
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-[#121215] p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Projects</p>
              <h1 className="mt-3 text-[40px] font-semibold leading-tight text-white">Browse high-end project builds</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
                Choose a track, start with a guided builder, then continue into the Project Development Lab for a stronger final result.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedTrack('ALL');
                setViewFilter('ALL');
                onClearPathway();
              }}
              className="h-11 rounded-full border border-white/10 px-5 text-sm font-medium text-white transition-all duration-200 ease-out hover:border-[#c1121f]"
            >
              Clear filters
            </button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {trackList.map((track) => {
            const active = selectedTrack === track;
            return (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`overflow-hidden rounded-[1.7rem] border text-left transition-all duration-200 ease-out ${active ? 'border-[#c1121f]/50 bg-[#c1121f]/10' : 'border-white/10 bg-[#121215] hover:border-[#c1121f]/35'}`}
              >
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url('${trackMeta[track].image}')` }} />
                <div className="p-5">
                  <p className="text-lg font-semibold text-white">{trackMeta[track].label}</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{trackMeta[track].summary}</p>
                </div>
              </button>
            );
          })}
        </section>

        <section className="flex flex-wrap gap-3">
          {(['ALL', 'BASIC', 'ADVANCED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setViewFilter(filter)}
              className={`h-10 rounded-full px-5 text-sm font-medium transition-all duration-200 ease-out ${viewFilter === filter ? 'bg-[#c1121f] text-white' : 'border border-white/10 text-white hover:border-[#c1121f]'}`}
            >
              {filter === 'ALL' ? 'All projects' : filter === 'BASIC' ? 'Basic projects' : 'Advanced projects'}
            </button>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((module, index) => {
            const track = trackMeta[module.track];
            const locked = module.premium && !metrics.isPremium;
            return (
              <article key={module.id} className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#121215] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#c1121f]/35">
                <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url('${track.image}')` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{module.level}</span>
                    {locked ? (
                      <span className="rounded-full bg-[#c1121f] px-3 py-1 text-xs font-semibold text-white">Premium</span>
                    ) : index === 0 && module.level === 'BASIC' ? (
                      <span className="rounded-full bg-[#166534] px-3 py-1 text-xs font-semibold text-white">Starter access</span>
                    ) : null}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-zinc-400">{track.label}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{module.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{module.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Estimated time</p>
                      <p className="mt-1 text-sm text-white">{module.estimatedMinutes} min</p>
                    </div>
                    <button
                      onClick={() => onSelectMission(module.id)}
                      className="h-10 rounded-full px-5 text-sm font-semibold text-white transition-all duration-200 ease-out"
                      style={{ backgroundColor: locked ? '#3f3f46' : accent }}
                    >
                      {module.completed ? 'Reopen' : locked ? 'Preview' : 'Start build'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
