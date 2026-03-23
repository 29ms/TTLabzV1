import React, { useEffect, useMemo, useState } from 'react';
import { LabTrack } from '../types';

interface TerminalProps {
  onComplete: () => void;
}

const tracks: { title: string; track: LabTrack; description: string; stat: string }[] = [
  { title: 'AI Projects', track: 'ETHICS', description: 'Model evaluation, prompt systems, and decision-ready AI reports.', stat: 'Build intelligent systems' },
  { title: 'Cybersecurity', track: 'DEFENDER', description: 'Threat analysis, architecture review, and defensive planning.', stat: 'Ship security case studies' },
  { title: 'Coding Systems', track: 'EXECUTIVE', description: 'Structured software builds with planning, implementation, and polish.', stat: 'Turn ideas into software' },
  { title: 'Robotics', track: 'INTEL', description: 'Automation projects, embedded logic, and system-thinking workflows.', stat: 'Prototype technical systems' },
];

const socials = [
  { label: 'Medium', href: 'https://medium.com/@realtechtales' },
  { label: 'Email', href: 'mailto:jjanimationsyt@gmail.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
];

const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const deviceStyle = useMemo(() => {
    const depth = Math.min(scrollY * 0.08, 32);
    const scale = Math.max(1 - scrollY * 0.00018, 0.92);
    const rotateX = Math.max(14 - scrollY * 0.02, 2);
    return {
      transform: `perspective(1800px) translateY(${depth}px) scale(${scale}) rotateX(${rotateX}deg)`,
    };
  }, [scrollY]);

  const handleStart = (track?: LabTrack) => {
    if (track) localStorage.setItem('preferredTrack', track);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(193,18,31,0.18),transparent_30%),radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.08),transparent_28%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <img src="/techtales-logo.svg" alt="TechTales Labs" className="h-12 w-auto md:h-14" />
        <button
          onClick={() => handleStart()}
          className="h-11 rounded-full border border-white/15 bg-white px-5 text-sm font-semibold text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#f4f4f5]"
        >
          Enter platform
        </button>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <section className="grid items-center gap-12 pt-6 md:grid-cols-[1.1fr_0.9fr] md:pt-12">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#fca5a5]">Tech innovation platform</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] text-white md:text-7xl">
              Build the projects that make universities notice.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Guided engineering projects for ambitious students in AI, cybersecurity, coding systems, and robotics.
              Clear steps. Strong outcomes. Portfolio-ready work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => handleStart()}
                className="h-12 rounded-full bg-[#c1121f] px-6 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#a30f1a]"
              >
                Start building
              </button>
              <a
                href="#tracks"
                className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm font-medium text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/5"
              >
                Explore projects
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-3xl">
            <div style={deviceStyle} className="transition-transform duration-200 ease-out">
              <div className="rounded-[2rem] border border-white/10 bg-[#111114] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
                <div className="rounded-[1.6rem] border border-white/10 bg-[#18181b] p-3">
                  <div className="rounded-[1.2rem] bg-[#f6f5f1] px-5 py-5 text-black">
                    <div className="flex items-center justify-between border-b border-black/10 pb-4">
                      <img src="/techtales-logo-dark.svg" alt="TechTales Labs" className="h-8 w-auto" />
                      <div className="rounded-full bg-[#c1121f] px-4 py-2 text-xs font-semibold text-white">Project builder</div>
                    </div>
                    <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                      <div>
                        <p className="text-sm font-medium text-black/55">Current project</p>
                        <h2 className="mt-2 text-4xl font-semibold leading-tight">Global Cyber Threat Map</h2>
                        <p className="mt-3 text-sm leading-7 text-black/65">
                          Collect threat data, process signals, and visualize patterns in one guided workflow.
                        </p>
                        <div className="mt-6 space-y-3">
                          {['Collect data source', 'Clean and structure data', 'Build the visualization', 'Prepare portfolio summary'].map((item, index) => (
                            <div key={item} className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3">
                              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${index === 0 ? 'bg-[#c1121f] text-white' : 'bg-black/5 text-black/60'}`}>
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-black/75">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-[1.4rem] border border-black/10 bg-[#d6dde3]">
                        <div className="h-full min-h-[340px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80')" }}>
                          <div className="flex h-full flex-col justify-between bg-gradient-to-t from-black/55 via-black/10 to-transparent p-6 text-white">
                            <div className="self-end rounded-full border border-white/20 bg-black/25 px-3 py-2 text-xs">78% complete</div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Live build preview</p>
                              <p className="mt-3 max-w-sm text-2xl font-semibold leading-tight">A cinematic workspace that moves as the student scrolls.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tracks" className="mt-24 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#111114] p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Why TechTales</p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">One clear system for building serious projects.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {tracks.map((track) => (
                <article key={track.track} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#c1121f]/45 hover:bg-white/[0.05]">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#fca5a5]">{track.stat}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{track.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">{track.description}</p>
                  <button
                    onClick={() => handleStart(track.track)}
                    className="mt-5 h-11 rounded-full bg-[#c1121f] px-5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-[#a30f1a]"
                  >
                    Build this track
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#111114] p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">What students get</p>
            <div className="mt-6 space-y-5">
              {[
                'A guided builder with concrete step-by-step instructions.',
                'A project development lab for deeper improvements and stronger polish.',
                'A portfolio-ready output that can be shown in applications and interviews.',
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c1121f] text-sm font-semibold text-white">0{index + 1}</span>
                  <p className="text-base leading-7 text-zinc-200">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#0c0c0f] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Follow TechTales</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center rounded-full border border-white/10 px-5 text-sm font-medium text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#c1121f]/50 hover:bg-white/[0.04]"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Terminal;
