import React from 'react';
import { LabTrack } from '../types';

interface TerminalProps {
  onComplete: () => void;
}

const tracks: { title: string; track: LabTrack; description: string }[] = [
  { title: 'AI Projects', track: 'ETHICS', description: 'Build practical AI projects with clear evaluation and portfolio reporting.' },
  { title: 'Cybersecurity Projects', track: 'DEFENDER', description: 'Investigate real security scenarios and write structured audit evidence.' },
  { title: 'Coding Projects', track: 'EXECUTIVE', description: 'Ship clean software projects with planning, implementation, and reflection.' },
  { title: 'Advanced Projects', track: 'INTEL', description: 'Take strong work further through long-form research and deeper analysis.' },
];

const steps = ['Choose a path', 'Complete guided project stages', 'Create portfolio output', 'Export proof for real opportunities'];

const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  const handleStart = (track: LabTrack) => {
    localStorage.setItem('preferredTrack', track);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(59,130,246,0.15),transparent_35%)]" />
      <header className="relative border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
          <div>
            <p className="text-xl font-semibold text-white">TechTales</p>
            <p className="text-sm text-zinc-400">Portfolio Builder for ambitious students</p>
          </div>
          <button onClick={onComplete} className="h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/45 hover:bg-white/5">
            Enter app
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl space-y-16 px-6 py-16 md:px-8">
        <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur">
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">Build work worth showing.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            TechTales helps you build serious projects in AI, cybersecurity, coding, and advanced research. Every step is designed to produce evidence you can actually use.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onComplete} className="h-11 rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-200">Start building</button>
            <a href="#tracks" className="h-11 inline-flex items-center rounded-lg border border-white/20 px-6 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5">Explore paths</a>
          </div>
        </section>

        <section id="tracks" className="space-y-5">
          <h2 className="text-2xl font-semibold text-white">Choose your path</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tracks.map((track) => (
              <article key={track.track} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/30">
                <h3 className="text-xl font-semibold text-white">{track.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{track.description}</p>
                <button onClick={() => handleStart(track.track)} className="mt-5 h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5">Start this path</button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">How it works</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step} className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <p className="text-sm text-zinc-500">Step {i + 1}</p>
                <p className="mt-2 text-lg font-semibold text-white">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
};

export default Terminal;
