import React, { useEffect, useMemo, useState } from 'react';
import { AppView, LabTrack, Mission, UserMetrics } from '../types';
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

const tracks: { id: LabTrack; title: string; level: string; output: string; summary: string }[] = [
  {
    id: 'ETHICS',
    title: 'AI Projects',
    level: 'Foundations → Builder → Advanced',
    output: 'Technical brief or case study',
    summary: 'Understand model decisions, assess risk, and produce evidence-based analysis.',
  },
  {
    id: 'DEFENDER',
    title: 'Cybersecurity Projects',
    level: 'Foundations → Builder → Advanced',
    output: 'Security audit report',
    summary: 'Evaluate threats, controls, and architecture with practical recommendations.',
  },
  {
    id: 'EXECUTIVE',
    title: 'Coding Projects',
    level: 'Foundations → Builder → Advanced',
    output: 'Prototype report',
    summary: 'Build software artifacts and document approach, testing, and outcomes.',
  },
  {
    id: 'INTEL',
    title: 'Advanced Projects',
    level: 'Builder → Advanced',
    output: 'Research output',
    summary: 'Develop deeper technical investigations and structured long-form work.',
  },
];

const featuredImages = [
  {
    title: 'AI analysis workflow',
    source: 'Photo: Unsplash / Growtika',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Security architecture review',
    source: 'Photo: Unsplash / Kevin Ku',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Software project planning',
    source: 'Photo: Unsplash / Christina @ wocintechchat.com',
    url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
  },
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

  const activeSteps = useMemo(() => {
    const pending = filteredMissions.filter((mission) => !mission.completed);
    return (pending.length ? pending : filteredMissions).slice(0, 3);
  }, [filteredMissions]);

  const completedProjects = projectMissions.filter((mission) => mission.completed).length;
  const portfolioProgress = projectMissions.length
    ? Math.round((completedProjects / projectMissions.length) * 100)
    : 0;

  if (showPractice) {
    return (
      <div className="h-screen overflow-hidden bg-[#0B0F14] px-6 pb-24 pt-8 md:px-10">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#F9FAFB]">Cybersecurity Practice</h1>
            <p className="mt-2 text-sm text-[#9CA3AF]">Scenario practice to strengthen project decision-making.</p>
          </div>
          <button
            onClick={() => setShowPractice(false)}
            className="h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
          >
            Back to Home
          </button>
        </header>
        <div className="h-[calc(100%-5rem)] overflow-y-auto rounded-xl border border-[#1F2937] bg-[#111827] p-4">
          <VirtualSOC onUpdatePoints={onUpdatePoints} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#0B0F14] px-6 pb-28 pt-8 md:px-10">
      <div className="h-full overflow-y-auto pr-1 pb-6 space-y-6">
        <header className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
          <p className="text-sm text-[#9CA3AF]">Home</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">Build work worth showing.</h1>
          <p className="mt-3 max-w-3xl text-sm text-[#9CA3AF]">
            TechTales guides you from first concept to portfolio-ready project output with clear structure and meaningful depth.
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
              <p className="mt-2 text-sm text-[#F9FAFB]">Your outputs become proof for applications, scholarships, and internships.</p>
            </article>
          </div>
        </header>

        <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#F9FAFB]">Visual project inspiration</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">
                Free-to-use Unsplash visuals to add polish while keeping a serious product tone.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {featuredImages.map((image) => (
              <article key={image.title} className="overflow-hidden rounded-xl border border-[#1F2937] bg-[#0B0F14]">
                <img src={image.url} alt={image.title} className="h-36 w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#F9FAFB]">{image.title}</h3>
                  <p className="mt-1 text-xs text-[#9CA3AF]">{image.source}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <article className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
            <p className="text-sm text-[#9CA3AF]">Your next meaningful move</p>
            <h2 className="mt-2 text-xl font-semibold text-[#F9FAFB]">{nextProject ? nextProject.title : 'Choose a path to begin'}</h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">
              {nextProject
                ? nextProject.description
                : 'Select a track below. You will complete guided steps and produce a structured output.'}
            </p>

            {nextProject && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-[#1F2937] bg-[#0B0F14] p-3 text-sm text-[#9CA3AF]">
                  Track: <span className="text-[#F9FAFB]">{trackLabel[nextProject.track]}</span>
                </div>
                <div className="rounded-lg border border-[#1F2937] bg-[#0B0F14] p-3 text-sm text-[#9CA3AF]">
                  Difficulty: <span className="text-[#F9FAFB]">{nextProject.difficulty}</span>
                </div>
                <div className="rounded-lg border border-[#1F2937] bg-[#0B0F14] p-3 text-sm text-[#9CA3AF]">
                  Output: <span className="text-[#F9FAFB]">Portfolio artifact</span>
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#1F2937] bg-[#0B0F14] p-3">
                <p className="text-sm font-medium text-[#F9FAFB]">Project stages</p>
                <p className="mt-1 text-sm text-[#9CA3AF]">Context → Concept → Application → Output → Reflection</p>
              </div>
              <div className="rounded-lg border border-[#1F2937] bg-[#0B0F14] p-3">
                <p className="text-sm font-medium text-[#F9FAFB]">Next action</p>
                <p className="mt-1 text-sm text-[#9CA3AF]">Complete your next guided step and add it to Portfolio.</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#F9FAFB]">Advanced Layer</h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">Use these tools when you want deeper work.</p>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => setView(AppView.RESEARCH)}
                className="h-10 w-full rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
              >
                Open Research Suite
              </button>
              <button
                onClick={() => setShowPractice(true)}
                className="h-10 w-full rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
              >
                Practice Scenarios
              </button>
              <button
                onClick={snowToggle}
                className="h-10 w-full rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#9CA3AF] transition-all duration-200 ease-out hover:text-[#F9FAFB]"
              >
                {isSnowing ? 'Disable Snow' : 'Enable Snow'}
              </button>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#F9FAFB]">Paths</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">Choose a path and progress from foundations to advanced work.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedTrack('ALL');
                  onClearPathway();
                }}
                className={`h-9 rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-out ${
                  selectedTrack === 'ALL'
                    ? 'bg-white text-black'
                    : 'border border-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB]'
                }`}
              >
                All
              </button>
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`h-9 rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-out ${
                    selectedTrack === track.id
                      ? 'bg-white text-black'
                      : 'border border-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {tracks.map((track) => (
              <article key={track.id} className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-5">
                <h3 className="text-xl font-semibold text-[#F9FAFB]">{track.title}</h3>
                <p className="mt-2 text-sm text-[#9CA3AF]">{track.summary}</p>
                <p className="mt-2 text-sm text-[#9CA3AF]">Levels: <span className="text-[#F9FAFB]">{track.level}</span></p>
                <p className="mt-1 text-sm text-[#9CA3AF]">Output: <span className="text-[#F9FAFB]">{track.output}</span></p>
                <button
                  onClick={() => setSelectedTrack(track.id)}
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
          <p className="mt-2 text-sm text-[#9CA3AF]">Complete these guided project steps and turn them into portfolio proof.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {activeSteps.map((mission) => (
              <article key={mission.id} className="flex min-h-[240px] flex-col justify-between rounded-xl border border-[#1F2937] bg-[#0B0F14] p-5">
                <div>
                  <p className="text-sm text-[#9CA3AF]">{trackLabel[mission.track]}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#F9FAFB]">{mission.title}</h3>
                  <p className="mt-2 text-sm text-[#9CA3AF] line-clamp-3">{mission.description}</p>
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
            {nextProject ? `Next step: ${nextProject.title}` : 'All visible project steps complete. Add your output to Portfolio.'}
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
