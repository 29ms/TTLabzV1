import React from "react";

interface TerminalProps {
  onComplete: () => void;
}

const baseButtonClasses =
  "h-11 rounded-lg px-6 text-[15px] font-semibold transition-colors duration-200";

const journeySteps = [
  {
    title: "Choose Track",
    action: "Pick AI, cybersecurity, coding, or advanced projects.",
    outcome: "You get focused labs tied to one project path.",
  },
  {
    title: "Complete Labs",
    action: "Finish guided tasks with checkpoints and mentor prompts.",
    outcome: "Each lab creates an artifact for your final project.",
  },
  {
    title: "Generate Structured Project",
    action: "Assemble artifacts into one coherent project narrative.",
    outcome: "You produce a clear, portfolio-ready submission.",
  },
  {
    title: "Add to Portfolio",
    action: "Publish your summary, evidence, and reflection.",
    outcome: "You show depth, not just completion.",
  },
];

const trackCards = [
  {
    name: "AI Projects",
    description:
      "Design and evaluate AI workflows with clear prompts, model choices, and measured outcomes.",
  },
  {
    name: "Cybersecurity Projects",
    description:
      "Analyze risks, investigate incidents, and produce security recommendations in structured reports.",
  },
  {
    name: "Coding Projects",
    description:
      "Build practical software features with planning notes, implementation evidence, and testing logs.",
  },
  {
    name: "Advanced Projects",
    description:
      "Use the project builder layer for deeper research, synthesis, and technical reflection.",
  },
];

const labDepth = [
  {
    phase: "Concept",
    detail: "Learn the core principle with concise context and examples.",
  },
  {
    phase: "Application",
    detail: "Use the principle in a guided technical challenge.",
  },
  {
    phase: "Structured Output",
    detail: "Create a reusable output (report, code evidence, or analysis sheet).",
  },
  {
    phase: "Reflection",
    detail: "Document tradeoffs, decisions, and next improvements.",
  },
];

const inAppPreview = [
  {
    screen: "Labs Dashboard",
    detail: "Filter by pathway, open labs, and track completed work.",
  },
  {
    screen: "Mission View",
    detail: "Read the prompt, submit your response, and receive mentor feedback.",
  },
  {
    screen: "Portfolio View",
    detail: "Review earned certificates and project outputs to present your progress.",
  },
  {
    screen: "Advanced Project Layer",
    detail: "Use the research/project builder tools for deeper structured work.",
  },
];

const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <header className="border-b border-zinc-800 bg-zinc-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <div>
            <p className="text-[15px] font-semibold text-white">TechTales Labs</p>
            <p className="text-[15px] text-zinc-400">Structured project learning for high school students</p>
          </div>
          <nav className="hidden gap-6 text-[15px] text-zinc-300 md:flex">
            <a href="#tracks" className="hover:text-white">Tracks</a>
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <a href="#inside" className="hover:text-white">Inside the Platform</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 md:px-8 md:py-16">
        <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
          <p className="text-[15px] font-medium uppercase tracking-wide text-zinc-400">Homepage</p>
          <h1 className="text-[34px] font-semibold leading-tight text-white">
            Build Serious Tech Projects Before Graduation.
          </h1>
          <p className="max-w-3xl text-[15px] leading-7 text-zinc-300">
            Learn AI, cybersecurity, and coding by building structured portfolio projects.
            Every project follows a clear path from guided labs to a polished final output.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={onComplete} className={`${baseButtonClasses} bg-white text-zinc-950 hover:bg-zinc-200`}>
              Start Project Journey
            </button>
            <a
              href="#how-it-works"
              className={`${baseButtonClasses} inline-flex items-center border border-zinc-700 text-zinc-100 hover:border-zinc-500 hover:text-white`}
            >
              Review How It Works
            </a>
          </div>
        </section>

        <section id="tracks" className="space-y-6">
          <h2 className="text-[26px] font-semibold text-white">Project Tracks</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {trackCards.map((track) => (
              <article key={track.name} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-[20px] font-semibold text-white">{track.name}</h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-300">{track.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="space-y-6">
          <h2 className="text-[26px] font-semibold text-white">How It Works</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {journeySteps.map((step, index) => (
              <article key={step.title} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <p className="text-[15px] font-medium text-zinc-400">Step {index + 1}</p>
                <h3 className="mt-2 text-[20px] font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-[15px] text-zinc-200"><span className="font-semibold">Action:</span> {step.action}</p>
                <p className="mt-2 text-[15px] text-zinc-300"><span className="font-semibold">Outcome:</span> {step.outcome}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h2 className="text-[26px] font-semibold text-white">Lab Depth Rubric</h2>
          <p className="text-[15px] leading-7 text-zinc-300">
            This section defines quality standards for each lab so students know what strong work looks like.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {labDepth.map((item) => (
              <div key={item.phase} className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-4">
                <h3 className="text-[20px] font-semibold text-white">{item.phase}</h3>
                <p className="mt-2 text-[15px] text-zinc-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="inside" className="space-y-6">
          <h2 className="text-[26px] font-semibold text-white">What You See After Clicking Start</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {inAppPreview.map((item) => (
              <article key={item.screen} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-[20px] font-semibold text-white">{item.screen}</h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-[15px] text-zinc-400 md:px-8">
          <p>© 2026 TechTales Labs</p>
          <div className="flex flex-wrap items-center gap-3">
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
};

export default Terminal;
