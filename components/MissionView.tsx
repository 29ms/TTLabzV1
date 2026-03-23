import React, { useMemo, useState } from 'react';
import { LabTrack, Mission } from '../types';

interface MissionViewProps {
  mission: Mission;
  onExit: () => void;
  onComplete: (missionId: string) => void;
}

type DeviceType = 'Laptop' | 'Chromebook' | 'Mobile';

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  image: string;
  caption: string;
}

const sections: ModuleSection[] = [
  { id: 'overview', title: 'Overview', description: 'Read scope, goals, difficulty, and expected output before you begin.', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', caption: 'See the project clearly before building it.' },
  { id: 'learn', title: 'Learn', description: 'Study the concept with context, examples, and decision-making guidance.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', caption: 'Each stage adds context instead of dropping students into random tasks.' },
  { id: 'checkpoint', title: 'Checkpoint', description: 'Confirm understanding with a small concept check before moving on.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', caption: 'Short checkpoints keep progress honest and clear.' },
  { id: 'apply', title: 'Apply', description: 'Use what you learned to draft the actual project output.', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', caption: 'Students build something real instead of just reading text.' },
  { id: 'reflect', title: 'Reflect', description: 'Write what you learned, what was difficult, and why the work matters.', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80', caption: 'Reflection turns a finished task into portfolio evidence.' },
  { id: 'completion', title: 'Completion', description: 'Finish the module and turn the result into a portfolio-ready outcome.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', caption: 'Completion should feel earned and visually distinct.' },
];

const trackNames = {
  ETHICS: 'Artificial Intelligence',
  DEFENDER: 'Cybersecurity',
  EXECUTIVE: 'Coding Systems',
  INTEL: 'Robotics',
} as const;

const accent = '#c1121f';

const deviceInstructions: Record<DeviceType, string[]> = {
  Laptop: ['Open the linked tools in separate tabs and work locally when possible.', 'Copy code snippets into your editor and test each change.', 'Take screenshots as you build so your portfolio entry has evidence.'],
  Chromebook: ['Use browser-based tools such as Replit or online notebooks.', 'Keep one tab for instructions and one tab for your build.', 'Export or save links at the end so your work can be shown later.'],
  Mobile: ['Use the builder mainly for planning, outlining, and reflection.', 'Open web-based tools only when the task can be completed on mobile.', 'Save links, screenshots, and notes so you can continue on a larger device later.'],
};

const trackContent: Record<
  LabTrack,
  {
    concept: string;
    deliverableLabel: string;
    deliverableChecklist: string[];
    resources: string[];
    codeExample: string;
    applyPlaceholder: string;
    reflectionPrompt: string;
    checkpointChoices: string[];
    developmentLab: string[];
  }
> = {
  ETHICS: {
    concept: 'You are building an AI evaluation artifact that explains quality, risks, and decision tradeoffs clearly enough for a teacher, reviewer, or internship mentor.',
    deliverableLabel: 'AI review blueprint',
    deliverableChecklist: [
      'Define the model or workflow being evaluated.',
      'List the evidence, examples, or prompt tests you used.',
      'Explain where outputs were strong, weak, biased, or uncertain.',
      'Finish with a recommendation or risk-control plan.',
    ],
    resources: [
      'Use side-by-side prompt/output comparisons instead of vague opinions.',
      'Name the evaluation criteria directly: accuracy, bias, consistency, explainability, or safety.',
      'Capture a few representative outputs so your portfolio entry shows real evidence.',
    ],
    codeExample: `const aiEvaluation = {\n  system: 'Student support chatbot',\n  tests: ['bias check', 'accuracy prompt set', 'edge-case prompt set'],\n  findings: ['answers were fast', 'citations were inconsistent'],\n  recommendation: 'Add source verification before deployment'\n};`,
    applyPlaceholder: 'Draft your AI review: what system or prompt workflow are you evaluating, what evidence did you collect, and what recommendation would you make?',
    reflectionPrompt: 'What did you learn about evaluating AI responsibly, what tradeoff was hardest to judge, and how would this help you in a real product or research setting?',
    checkpointChoices: [
      'A structured AI review with tests, evidence, risks, and a recommendation',
      'A short opinion that says the model seems good',
      'A copied summary with no original evaluation',
    ],
    developmentLab: [
      'Add a more rigorous prompt-testing matrix or benchmark table.',
      'Compare two models or workflows and justify which one should be used.',
      'Turn the review into a presentation, policy memo, or portfolio case study.',
    ],
  },
  DEFENDER: {
    concept: 'You are producing a cybersecurity artifact that shows how a risk appears, how to assess it, and what controls should be implemented next.',
    deliverableLabel: 'Security assessment blueprint',
    deliverableChecklist: [
      'Identify the threat, weak point, or risky behavior clearly.',
      'Explain impact using a concrete scenario or failure path.',
      'List practical mitigations in order of priority.',
      'Close with an action plan or incident-response next step.',
    ],
    resources: [
      'Use attacker, asset, and impact language so the report sounds operational.',
      'Rank issues by severity or likelihood instead of treating all findings as equal.',
      'Screenshots, diagrams, and checklists make security work feel more credible and useful.',
    ],
    codeExample: `const securityReview = {\n  asset: 'student portal login',\n  threat: 'credential phishing',\n  impact: 'account takeover and grade exposure',\n  controls: ['MFA', 'login alerting', 'staff awareness training']\n};`,
    applyPlaceholder: 'Draft your security assessment: what is the threat, who or what is exposed, what evidence supports your finding, and which mitigation should happen first?',
    reflectionPrompt: 'What did you learn about thinking like a defender, what part of the risk analysis was hardest, and why would this matter in a real security team?',
    checkpointChoices: [
      'A risk-focused report with impact, evidence, and prioritized controls',
      'A vague warning that something could be unsafe',
      'A copied checklist with no explanation of the actual threat',
    ],
    developmentLab: [
      'Convert the report into a threat model diagram or security playbook.',
      'Add severity scoring and a clearer remediation timeline.',
      'Prepare a short executive briefing for a non-technical audience.',
    ],
  },
  EXECUTIVE: {
    concept: 'You are building a software-engineering artifact that shows planning, implementation thinking, and how the feature or system should evolve.',
    deliverableLabel: 'Engineering feature blueprint',
    deliverableChecklist: [
      'State the user problem or feature objective clearly.',
      'Describe the architecture, workflow, or component plan.',
      'Show implementation decisions, tradeoffs, or testing strategy.',
      'End with next iteration steps or release-readiness notes.',
    ],
    resources: [
      'Use inputs, outputs, components, and edge cases to make your thinking concrete.',
      'Explain why you chose one technical approach over another.',
      'Include testing or debugging notes so the project feels like real engineering work.',
    ],
    codeExample: `const featurePlan = {\n  feature: 'Portfolio project dashboard',\n  components: ['hero', 'filter bar', 'project cards'],\n  risks: ['slow data fetch', 'unclear progress states'],\n  nextStep: 'Add empty-state and loading-state coverage'\n};`,
    applyPlaceholder: 'Draft your engineering artifact: what are you building, how should it work, what tradeoffs did you make, and what should be improved next?',
    reflectionPrompt: 'What did you learn about planning and structuring software work, where did the design or implementation get difficult, and how would this help on a real team?',
    checkpointChoices: [
      'A clear build plan with architecture, reasoning, and next steps',
      'A few disconnected notes with no system structure',
      'A copied code sample with no explanation of how it fits the project',
    ],
    developmentLab: [
      'Turn the concept into a live prototype or a better-coded feature.',
      'Add testing, instrumentation, or performance measurement.',
      'Package the work as a polished case study with screenshots and architecture notes.',
    ],
  },
  INTEL: {
    concept: 'You are producing a robotics or automation artifact that connects sensors, logic, reliability, and the physical behavior of the system.',
    deliverableLabel: 'Robotics systems blueprint',
    deliverableChecklist: [
      'Define the robot task, subsystem, or physical problem clearly.',
      'Describe sensors, actuators, or control logic involved.',
      'Explain how the system will be tested for safety or reliability.',
      'Finish with improvements for performance, repeatability, or deployment.',
    ],
    resources: [
      'Be explicit about what the robot senses, decides, and does next.',
      'Use reliability, calibration, and safety language to strengthen the artifact.',
      'A simple system diagram can make robotics work much easier to understand.',
    ],
    codeExample: `const robotPlan = {\n  task: 'line-following delivery bot',\n  sensors: ['line sensor array', 'distance sensor'],\n  controlLogic: 'adjust motor speed based on line deviation',\n  testPlan: 'run 10 trials and log drift + stop accuracy'\n};`,
    applyPlaceholder: 'Draft your robotics systems artifact: what task should the system complete, what hardware or logic drives it, how will you test it, and what should improve next?',
    reflectionPrompt: 'What did you learn about robotics systems thinking, what reliability or safety issue was hardest, and how does this connect to real engineering work?',
    checkpointChoices: [
      'A systems-focused artifact with hardware, logic, testing, and improvements',
      'A loose description of a robot idea with no technical structure',
      'A copied build summary with no explanation of behavior or reliability',
    ],
    developmentLab: [
      'Add telemetry, calibration, or repeatability analysis.',
      'Design a cleaner subsystem diagram or test protocol.',
      'Prepare a demo narrative that explains the robot’s decisions and tradeoffs.',
    ],
  },
};

const MissionView: React.FC<MissionViewProps> = ({ mission, onExit, onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [device, setDevice] = useState<DeviceType>('Laptop');
  const [reflection, setReflection] = useState('');
  const [applyDraft, setApplyDraft] = useState('');
  const [checkpointAnswer, setCheckpointAnswer] = useState<string | null>(null);

  const progress = Math.round(((activeIndex + 1) / sections.length) * 100);
  const activeSection = sections[activeIndex];
  const missionContent = trackContent[mission.track];

  const checkpointQuestion = useMemo(() => `Which outcome best represents strong work for "${mission.title}"?`, [mission.title]);

  const canMoveForward = useMemo(() => {
    if (activeSection.id === 'checkpoint') return checkpointAnswer !== null;
    if (activeSection.id === 'apply') return applyDraft.trim().length >= 40;
    if (activeSection.id === 'reflect') return reflection.trim().length >= 40;
    return true;
  }, [activeSection.id, checkpointAnswer, applyDraft, reflection]);

  const next = () => {
    if (activeIndex < sections.length - 1 && canMoveForward) setActiveIndex((prev) => prev + 1);
  };

  const previous = () => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] px-6 py-8 text-[#EAEAEA] md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] border border-white/10 bg-[#121215] p-6 md:p-8">
          <button onClick={onExit} className="h-10 rounded-full border border-white/10 px-4 text-sm font-medium text-[#EAEAEA] transition-all duration-200 ease-out hover:border-[#c1121f]">Back to Projects</button>
          <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#fca5a5]">{trackNames[mission.track]} • {mission.level}</p>
              <h1 className="mt-3 text-[40px] font-semibold leading-tight">{mission.title}</h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-zinc-300">{mission.description}</p>
            </div>
            <div className="min-w-[230px] rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-sm text-zinc-400">Progress</p>
              <p className="mt-2 text-3xl font-semibold text-white">{progress}%</p>
              <p className="mt-2 text-sm text-zinc-400">Current stage: {activeSection.title}</p>
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full transition-all duration-300 ease-out" style={{ width: `${progress}%`, backgroundColor: accent }} />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[310px_1fr_390px]">
          <aside className="rounded-[2rem] border border-white/10 bg-[#121215] p-5">
            <h2 className="text-[22px] font-semibold">Step Checklist</h2>
            <div className="mt-5 space-y-3">
              {sections.map((section, index) => {
                const isActive = index === activeIndex;
                const isComplete = index < activeIndex;
                const isUnlocked = index <= activeIndex;
                return (
                  <button
                    key={section.id}
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && setActiveIndex(index)}
                    className={`flex w-full items-start gap-3 rounded-[1.2rem] border px-4 py-4 text-left transition-all duration-200 ease-out ${isActive ? 'border-white/15 bg-white/[0.05]' : 'border-white/10 bg-black/20 hover:border-white/20'} disabled:opacity-45`}
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: isComplete || isActive ? accent : '#27272a' }}>{index + 1}</span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{section.title}</span>
                      <span className="mt-1 block text-xs leading-6 text-zinc-400">{section.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.26em] text-zinc-500">Device aware</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(['Laptop', 'Chromebook', 'Mobile'] as DeviceType[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setDevice(option)}
                    className={`h-9 rounded-full px-4 text-xs font-semibold transition-all duration-200 ease-out ${device === option ? 'bg-[#c1121f] text-white' : 'border border-white/10 text-white hover:border-[#c1121f]'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="rounded-[2rem] border border-white/10 bg-[#121215] p-6 md:p-8">
            <h2 className="text-[28px] font-semibold">{activeSection.title}</h2>
            <p className="mt-2 text-base leading-8 text-zinc-300">{activeSection.description}</p>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
              <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-semibold text-white">Goal</p>
                <p className="mt-2 text-sm leading-7 text-zinc-300">{mission.task}</p>
                <p className="mt-5 text-sm font-semibold text-white">{missionContent.deliverableLabel}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-300">{missionContent.concept}</p>
                <ul className="mt-3 space-y-3">
                  {missionContent.deliverableChecklist.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: accent }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-sm font-semibold text-white">Step-by-step instructions</p>
                <ol className="mt-3 space-y-3">
                  {deviceInstructions[device].map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-7 text-zinc-300">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: accent }}>{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                {activeSection.id === 'learn' && (
                  <>
                    <p className="mt-5 text-sm font-semibold text-white">Code example</p>
                    <pre className="mt-3 overflow-x-auto rounded-[1.2rem] border border-white/10 bg-black/35 p-4 text-xs leading-6 text-zinc-200">{missionContent.codeExample}</pre>
                  </>
                )}
              </section>

              <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-semibold text-white">Resources</p>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-zinc-300">
                  {missionContent.resources.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            {activeSection.id === 'overview' && (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-zinc-300">
                <p><span className="text-white">Difficulty:</span> {mission.level}</p>
                <p className="mt-3"><span className="text-white">Estimated time:</span> {mission.estimatedMinutes} minutes</p>
                <p className="mt-3"><span className="text-white">Tags:</span> {mission.tags.join(', ')}</p>
              </div>
            )}

            {activeSection.id === 'checkpoint' && (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-base text-white">{checkpointQuestion}</p>
                <div className="mt-4 space-y-3">
                  {missionContent.checkpointChoices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => setCheckpointAnswer(choice)}
                      className={`w-full rounded-[1.2rem] border px-4 py-3 text-left text-sm transition-all duration-200 ease-out ${checkpointAnswer === choice ? 'border-transparent text-white' : 'border-white/10 text-zinc-300 hover:border-white/20'}`}
                      style={checkpointAnswer === choice ? { backgroundColor: `${accent}22`, boxShadow: `inset 0 0 0 1px ${accent}` } : { backgroundColor: 'rgba(255,255,255,0.03)' }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSection.id === 'apply' && (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="mb-3 text-sm text-zinc-400">Draft the actual project output. Minimum 40 characters.</p>
                <textarea value={applyDraft} onChange={(e) => setApplyDraft(e.target.value)} className="min-h-[210px] w-full rounded-[1.2rem] border border-white/10 bg-black/30 p-4 text-base text-white outline-none transition-all duration-200 ease-out placeholder:text-zinc-600 focus:border-[#c1121f]" placeholder={missionContent.applyPlaceholder} />
              </div>
            )}

            {activeSection.id === 'reflect' && (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="mb-3 text-sm text-zinc-400">{missionContent.reflectionPrompt}</p>
                <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} className="min-h-[210px] w-full rounded-[1.2rem] border border-white/10 bg-black/30 p-4 text-base text-white outline-none transition-all duration-200 ease-out placeholder:text-zinc-600 focus:border-[#c1121f]" placeholder="Write your reflection here..." />
              </div>
            )}

            {activeSection.id === 'completion' && (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-base leading-8 text-zinc-300">You are ready to complete this module. Completion adds this work to your portfolio and unlocks the Project Development Lab.</p>
                <button onClick={() => onComplete(mission.id)} className="mt-5 h-11 rounded-full bg-[#c1121f] px-5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-[#a30f1a]">Mark Project Complete</button>
              </div>
            )}

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/25 p-6">
              <p className="text-xs uppercase tracking-[0.26em] text-zinc-500">Project Development Lab</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Take the project beyond the guided builder.</h3>
              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                {missionContent.developmentLab.map((item, index) => (
                  <div key={item} className="flex gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c1121f] text-xs font-semibold text-white">{index + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button onClick={previous} disabled={activeIndex === 0} className="h-10 rounded-full border border-white/10 px-4 text-sm font-medium text-white transition-all duration-200 ease-out hover:border-[#c1121f] disabled:opacity-50">Previous</button>
              {activeIndex < sections.length - 1 && <button onClick={next} disabled={!canMoveForward} className="h-10 rounded-full bg-[#c1121f] px-5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-[#a30f1a] disabled:opacity-50">Next Section</button>}
            </div>
          </main>

          <aside className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#121215]">
            <div className="relative h-full min-h-[620px] bg-cover bg-center transition-all duration-500 ease-out" style={{ backgroundImage: `url('${activeSection.image}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/5" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-[#fca5a5]">Visual guide</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{activeSection.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-200">{activeSection.caption}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MissionView;
