import React from 'react';
import { LabTrack } from '../types';

interface TerminalProps {
  onComplete: () => void;
}

const tracks: { title: string; track: LabTrack; description: string }[] = [
  { title: 'Build AI Project', track: 'ETHICS', description: 'Design, test, and present an AI-focused portfolio project.' },
  { title: 'Build Cybersecurity Project', track: 'DEFENDER', description: 'Investigate real scenarios and produce structured security outputs.' },
  { title: 'Build Coding Project', track: 'EXECUTIVE', description: 'Build practical software with planning, implementation, and testing evidence.' },
  { title: 'Build Advanced Project', track: 'INTEL', description: 'Complete deeper investigations and publish advanced portfolio artifacts.' },
];

const steps = ['Choose Track', 'Complete Structured Lab', 'Generate Portfolio Output', 'Add to Portfolio'];

const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  const handleStart = (track: LabTrack) => {
    localStorage.setItem('preferredTrack', track);
    onComplete();
  };

const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      <header className="border-b border-zinc-800/80 bg-black/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <div>
            <p className="text-[20px] font-semibold text-white">TechTales Labs</p>
            <p className="text-[15px] text-zinc-500">Structured portfolio project platform</p>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[15px] text-zinc-400">
            <a href="#tracks" className="hover:text-white transition-colors duration-200 ease-out">Tracks</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200 ease-out">How It Works</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16 space-y-14">
        <section className="space-y-6">
          <h1 className="text-[34px] font-semibold leading-tight text-white max-w-2xl">
            Build Serious Tech Projects Before Graduation.
          </h1>
          <p className="text-[15px] leading-7 text-zinc-300 max-w-3xl">
            Create structured AI, cybersecurity, and coding projects that strengthen your portfolio.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onComplete()}
              className="h-11 rounded-lg px-6 text-[15px] font-semibold bg-white text-black hover:bg-zinc-200 transition-colors duration-200 ease-out"
            >
              Start Building
            </button>
            <a
              href="#tracks"
              className="h-11 inline-flex items-center rounded-lg px-6 text-[15px] font-semibold border border-zinc-700 text-zinc-100 hover:border-zinc-500 transition-colors duration-200 ease-out"
            >
              View Tracks
            </a>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-[15px] text-zinc-500">Projects Built</p>
              <p className="mt-2 text-[26px] font-semibold text-white">120+</p>
            </div>
            <div>
              <p className="text-[15px] text-zinc-500">Portfolio Outputs</p>
              <p className="mt-2 text-[26px] font-semibold text-white">300+</p>
            </div>
            <div>
              <p className="text-[15px] text-zinc-500">Tracks Available</p>
              <p className="mt-2 text-[26px] font-semibold text-white">4</p>
            </div>
          </div>
        </section>

        <section id="tracks" className="space-y-6">
          <h2 className="text-[26px] font-semibold text-white">Build by Track</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tracks.map((track) => (
              <article key={track.track} className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
                <h3 className="text-[20px] font-semibold text-white">{track.title.replace('Build ', '')}</h3>
                <p className="text-[15px] leading-7 text-zinc-300">{track.description}</p>
                <button
                  onClick={() => handleStart(track.track)}
                  className="h-10 rounded-lg px-4 text-[15px] font-semibold border border-zinc-700 text-zinc-100 hover:border-zinc-500 transition-colors duration-200 ease-out"
                >
                  Start
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="space-y-6">
          <h2 className="text-[26px] font-semibold text-white">How It Works</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <ol className="grid gap-4 md:grid-cols-4">
              {steps.map((step, i) => (
                <li key={step} className="rounded-lg border border-zinc-800 bg-black px-4 py-4">
                  <p className="text-[15px] text-zinc-500">Step {i + 1}</p>
                  <p className="mt-2 text-[20px] font-semibold text-white">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/80">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-8 flex flex-wrap items-center justify-between gap-4 text-[15px] text-zinc-400">
          <p>© 2026 TechTales Labs</p>
          <div className="flex items-center gap-3">
            <a href="/privacy.html" target="_blank" rel="noreferrer" className="hover:text-white">Privacy Policy</a>
            <span>•</span>
            <a href="/terms.html" target="_blank" rel="noreferrer" className="hover:text-white">Terms of Service</a>
            <span>•</span>
            <a href="https://medium.com/@realtechtales" target="_blank" rel="noreferrer" className="hover:text-white">Medium</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Terminal;
