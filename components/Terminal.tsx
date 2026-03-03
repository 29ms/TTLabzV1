import React from "react";

interface TerminalProps {
  onComplete: () => void;
}

const baseButtonClasses =
  "h-11 rounded-lg px-6 text-[15px] font-semibold transition-colors duration-200";

const trackCards = [
  {
    name: "AI Projects",
    focus: "Model Thinking",
    description:
      "Design and evaluate AI workflows with clear prompts, model choices, and measured outcomes.",
  },
  {
    name: "Cybersecurity Projects",
    focus: "Risk Analysis",
    description:
      "Investigate security scenarios, document findings, and recommend practical protections.",
  },
  {
    name: "Coding Projects",
    focus: "Build + Test",
    description:
      "Ship practical features with planning notes, implementation evidence, and testing logs.",
  },
  {
    name: "Advanced Projects",
    focus: "Research Builder",
    description:
      "Use advanced project tools for deeper research, synthesis, and technical reflection.",
  },
];

const workflowSteps = [
  {
    title: "Choose Track",
    detail: "Select one project track based on your goals.",
  },
  {
    title: "Complete Labs",
    detail: "Finish guided labs that produce reusable project evidence.",
  },
  {
    title: "Build Final Project",
    detail: "Assemble your evidence into one structured technical project.",
  },
  {
    title: "Publish Portfolio Entry",
    detail: "Present your methods, output quality, and reflection.",
  },
];

const qualityRubric = [
  {
    phase: "Concept",
    prompt: "What did you learn and why does it matter?",
  },
  {
    phase: "Application",
    prompt: "How did you apply it in a real task?",
  },
  {
    phase: "Output",
    prompt: "What concrete artifact did you produce?",
  },
  {
    phase: "Reflection",
    prompt: "What tradeoffs did you notice and improve?",
  },
];

const inAppPreview = [
  "Labs Dashboard: choose pathway filters and open active labs.",
  "Mission View: respond to prompts and receive mentor feedback.",
  "Portfolio View: review certificates and structured project outputs.",
  "Advanced Projects: complete deeper research-driven builds.",
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
            <a href="#workflow" className="hover:text-white">Workflow</a>
            <a href="#quality" className="hover:text-white">Quality Standard</a>
            <a href="#inside" className="hover:text-white">In-App Preview</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 md:px-8 md:py-16">
        <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
          <h1 className="text-[34px] font-semibold leading-tight text-white">
            Build Serious Tech Projects Before Graduation.
          </h1>
          <p className="max-w-3xl text-[15px] leading-7 text-zinc-300">
            Learn AI, cybersecurity, and coding by building structured portfolio projects.
            This platform is built for depth: guided labs, clear frameworks, and strong final outputs.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={onComplete} className={`${baseButtonClasses} bg-white text-zinc-950 hover:bg-zinc-200`}>
              Start Project Journey
            </button>
            <a
              href="#inside"
              className={`${baseButtonClasses} inline-flex items-center border border-zinc-700 text-zinc-100 hover:border-zinc-500 hover:text-white`}
            >
              See In-App Preview
            </a>
          </div>
        </section>

        <section id="tracks" className="space-y-6">
          <h2 className="text-[26px] font-semibold text-white">Project Tracks</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {trackCards.map((track) => (
              <article key={track.name} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <p className="text-[15px] font-medium text-zinc-400">{track.focus}</p>
                <h3 className="mt-2 text-[20px] font-semibold text-white">{track.name}</h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-300">{track.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="space-y-6">
          <h2 className="text-[26px] font-semibold text-white">How It Works</h2>
          <ol className="grid gap-4 md:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <p className="text-[15px] font-medium text-zinc-400">Step {index + 1}</p>
                <h3 className="mt-2 text-[20px] font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-[15px] text-zinc-300">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="quality" className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h2 className="text-[26px] font-semibold text-white">Lab Quality Standard</h2>
          <p className="text-[15px] leading-7 text-zinc-300">
            Every lab is graded against the same four-part rubric so students build depth consistently.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {qualityRubric.map((item) => (
              <div key={item.phase} className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-4">
                <h3 className="text-[20px] font-semibold text-white">{item.phase}</h3>
                <p className="mt-2 text-[15px] text-zinc-300">{item.prompt}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="inside" className="space-y-6">
          <h2 className="text-[26px] font-semibold text-white">What You See After Clicking Start</h2>
          <ul className="space-y-3">
            {inAppPreview.map((item) => (
              <li key={item} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-4 text-[15px] text-zinc-300">
                {item}
              </li>
            ))}
          </ul>
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
