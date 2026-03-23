import React, { useEffect, useMemo, useState } from 'react';
import { geminiService } from '../services/geminiService';
import { certificateService } from '../services/certificateService';
import { UserCertificate, ResearchSection, SubmissionPlatform } from '../types';

interface ResearchSimulatorProps {
  isPremium: boolean;
  operatorName: string;
  onComplete: (cert: UserCertificate) => void;
  onUpdateOperatorName: (name: string) => void;
  researchState: any;
  setResearchState: React.Dispatch<React.SetStateAction<any>>;
}

const INITIAL_STRUCTURE: ResearchSection[] = [
  { id: 'q', title: 'Research Question', explanation: 'Define the exact problem your project will answer.', guidance: ['State one clear question', 'Tie it to a real challenge', 'Avoid vague wording'], tips: 'A precise question leads to stronger evidence and clearer conclusions.', commonMistakes: 'Questions that are too broad to answer.', content: '' },
  { id: 'lr', title: 'Background Review', explanation: 'Summarize what is already known.', guidance: ['Identify prior work', 'Compare sources', 'Highlight open gaps'], tips: 'Focus on why your question still matters after prior studies.', commonMistakes: 'Listing sources without synthesis.', content: '' },
  { id: 'm', title: 'Methodology', explanation: 'Explain how you will gather and evaluate evidence.', guidance: ['Define process', 'State tools', 'Explain reliability checks'], tips: 'Write this so another student could reproduce your work.', commonMistakes: 'Skipping validation details.', content: '' },
  { id: 'd', title: 'Findings', explanation: 'Report what you found in a structured way.', guidance: ['Show patterns', 'Use specific evidence', 'Separate fact from opinion'], tips: 'Use headings and short evidence statements.', commonMistakes: 'Mixing findings and conclusions.', content: '' },
  { id: 'disc', title: 'Discussion', explanation: 'Interpret findings and explain impact.', guidance: ['Connect to your question', 'Address limits', 'Explain implications'], tips: 'Be clear about what your project proves and what it does not.', commonMistakes: 'Ignoring contradictions.', content: '' },
  { id: 'conc', title: 'Conclusion and Next Steps', explanation: 'Close with what this work means and what comes next.', guidance: ['Restate answer', 'List practical use', 'Suggest next iteration'], tips: 'End with one concrete next move.', commonMistakes: 'Introducing new evidence in conclusion.', content: '' },
  { id: 'ref', title: 'References', explanation: 'Cite all sources used.', guidance: ['Use one citation format', 'Verify links', 'Include every source used'], tips: 'References are part of credibility, not optional.', commonMistakes: 'Missing citations for key claims.', content: '' },
];

const CORE_PLATFORMS: SubmissionPlatform[] = [
  { name: 'arXiv', url: 'https://arxiv.org' },
  { name: 'SSRN', url: 'https://www.ssrn.com' },
  { name: 'ResearchGate', url: 'https://www.researchgate.net' },
  { name: 'Academia.edu', url: 'https://www.academia.edu' },
  { name: 'Zenodo', url: 'https://zenodo.org' },
  { name: 'Open Science Framework', url: 'https://osf.io' },
  { name: 'Google Scholar Profile', url: 'https://scholar.google.com' },
];

const QUESTION_BANK: Record<string, string[]> = {
  AI: [
    'How does model bias change hiring recommendation outcomes in student-built AI tools?',
    'Which prompt design patterns improve consistency in AI tutor feedback?',
    'How do small dataset choices affect AI classification reliability?',
    'What evaluation rubric best measures trust in educational AI outputs?',
    'How can students reduce hallucinations in AI-generated research summaries?',
    'Which guardrails most effectively reduce unsafe responses in school-facing chatbots?',
    'How does response temperature affect factual accuracy in project assistants?',
    'What features increase student trust without reducing critical thinking?',
  ],
  Cybersecurity: [
    'How effective are password manager habits among high school students?',
    'Which phishing email signals are most missed by beginner users?',
    'How does MFA adoption change account-compromise risk in school communities?',
    'What personal data is most exposed through common social media settings?',
    'How can small teams run a practical vulnerability triage workflow?',
    'Which browser security settings have the highest impact for students?',
    'How should students prioritize security controls for side projects?',
    'What incident response checklist works best for student-led clubs?',
  ],
  Coding: [
    'How does test coverage affect bug rates in student web applications?',
    'Which code review checklist catches the most defects early?',
    'How does project scoping impact delivery quality in short sprint cycles?',
    'What architecture pattern improves maintainability for portfolio apps?',
    'How do naming conventions influence onboarding speed for new contributors?',
    'Which performance bottlenecks appear most in beginner full-stack projects?',
    'How can students quantify accessibility quality in frontend builds?',
    'What documentation format improves handoff quality for competition teams?',
  ],
  Robotics: [
    'How do sensor calibration practices affect robot navigation accuracy?',
    'What control-loop tuning approach is most reliable for beginner robots?',
    'How can teams reduce hardware debugging time during competitions?',
    'Which battery management strategies best extend mission runtime?',
    'How does mechanical design choice affect software complexity?',
    'What testing protocol improves safety in school robotics demos?',
    'How can students measure and improve robot task repeatability?',
    'Which telemetry metrics best predict subsystem failure early?',
  ],
};

const CATEGORIES = ['AI', 'Cybersecurity', 'Coding', 'Robotics', 'Other'];

const pickRandomQuestion = (category: string) => {
  const list = QUESTION_BANK[category] || [];
  if (!list.length) return '';
  return list[Math.floor(Math.random() * list.length)];
};

const ResearchSimulator: React.FC<ResearchSimulatorProps> = ({ isPremium, operatorName, onComplete, onUpdateOperatorName, researchState, setResearchState }) => {
  const [category, setCategory] = useState(researchState?.category || 'AI');
  const [suggestedQuestion, setSuggestedQuestion] = useState(researchState?.suggestedQuestion || pickRandomQuestion('AI'));
  const [customQuestion, setCustomQuestion] = useState(researchState?.customQuestion || '');
  const [topic, setTopic] = useState(researchState?.topic || '');

  const [builderActive, setBuilderActive] = useState(!!researchState?.builderActive);
  const [sections, setSections] = useState<ResearchSection[]>(researchState?.sections || INITIAL_STRUCTURE);
  const [activeSectionId, setActiveSectionId] = useState(researchState?.activeSectionId || 'q');
  const [archive, setArchive] = useState<any[]>(researchState?.archive || []);
  const [submissionMode, setSubmissionMode] = useState(false);
  const [recs, setRecs] = useState<SubmissionPlatform[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const [aiPointer, setAiPointer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [quizSubmitted, setQuizSubmitted] = useState(!!researchState?.quizSubmitted);
  const [showNameGate, setShowNameGate] = useState(false);
  const [tempName, setTempName] = useState(operatorName);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const completionPercentage = useMemo(
    () => Math.round((sections.filter((s) => s.content.trim().length > 50).length / sections.length) * 100),
    [sections],
  );

  useEffect(() => {
    setResearchState((prev: any) => ({
      ...(prev || {}),
      category,
      suggestedQuestion,
      customQuestion,
      topic,
      builderActive,
      sections,
      activeSectionId,
      archive,
      submissionMode,
      recs,
      quizSubmitted,
    }));
  }, [category, suggestedQuestion, customQuestion, topic, builderActive, sections, activeSectionId, archive, submissionMode, recs, quizSubmitted, setResearchState]);

  const handleCategorySelect = (newCategory: string) => {
    setCategory(newCategory);
    setCustomQuestion('');
    if (newCategory !== 'Other') {
      setSuggestedQuestion(pickRandomQuestion(newCategory));
    }
  };

  const handleNextFromQuestion = () => {
    const selected = category === 'Other' ? customQuestion.trim() : suggestedQuestion.trim();
    if (!selected) return;
    setTopic(selected);
    setBuilderActive(true);
    setSubmissionMode(false);
  };

  const handleAskAI = async () => {
    if (!isPremium) {
      setAiPointer('Pro feature: AI hints are available on TechTales Pro.');
      return;
    }
    setIsAiLoading(true);
    setAiPointer(null);
    const hint = await geminiService.getStructuredResearchPointers(topic, activeSection.title, activeSection.content);
    setAiPointer(hint);
    setIsAiLoading(false);
  };

  const handleStartSubmission = async () => {
    setSubmissionMode(true);
    if (!isPremium) {
      setRecs(CORE_PLATFORMS);
      return;
    }
    setIsLoadingRecs(true);
    const context = sections.map((s) => `${s.title}: ${s.content.substring(0, 120)}`).join('\n');
    const recommendations = await geminiService.getSubmissionRecommendations(topic, context);
    setRecs(recommendations);
    setIsLoadingRecs(false);
  };

  const saveToArchive = () => {
    if (!topic) return;
    const item = { id: crypto.randomUUID(), topic, sections, savedAt: Date.now() };
    setArchive((prev) => [item, ...prev]);
  };

  const resetResearch = () => {
    setBuilderActive(false);
    setSubmissionMode(false);
    setTopic('');
    setCustomQuestion('');
    setSuggestedQuestion(pickRandomQuestion(category === 'Other' ? 'AI' : category));
    setSections(INITIAL_STRUCTURE);
    setActiveSectionId('q');
    setAiPointer(null);
  };

  const initiateCertGeneration = async (name: string) => {
    setIsGeneratingCert(true);
    try {
      const cert = await certificateService.generateCertificate({ fullName: name, title: 'Research Specialist', theater: 'GENERAL' });
      setQuizSubmitted(true);
      onComplete(cert);
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim().length < 3) return;
    onUpdateOperatorName(tempName.trim());
    setShowNameGate(false);
    initiateCertGeneration(tempName.trim());
  };

  if (showNameGate) {
    return (
      <div className="mx-auto max-w-3xl p-8 md:p-12">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8">
          <h2 className="text-3xl font-semibold text-white">Confirm your name</h2>
          <p className="mt-2 text-sm text-zinc-400">Your name is needed for certificate generation.</p>
          <form onSubmit={handleNameSubmit} className="mt-5 space-y-3">
            <input value={tempName} onChange={(e) => setTempName(e.target.value)} className="h-11 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-white/35" placeholder="Full name" />
            <button className="h-11 rounded-lg bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200">Generate certificate</button>
          </form>
        </div>
      </div>
    );
  }

  if (isGeneratingCert) {
    return (
      <div className="mx-auto max-w-3xl p-8 md:p-12">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <p className="text-white">Generating certificate...</p>
        </div>
      </div>
    );
  }

  if (!builderActive) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-8 md:p-12">
        <header className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl">
          <p className="text-sm text-zinc-400">Research Suite</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">Start your research project</h1>
          <p className="mt-2 text-sm text-zinc-300">Choose a category, pick a question, and move into the structured writing workspace.</p>
          <p className="mt-2 text-sm text-zinc-400">Free includes full builder access. Pro adds AI hints and tailored submission recommendations.</p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white">Category</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => handleCategorySelect(c)} className={`h-9 rounded-lg px-3 text-sm transition ${category === c ? 'bg-white text-black' : 'border border-white/15 text-zinc-300 hover:border-white/35 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>

          {category !== 'Other' ? (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-zinc-400">Suggested research question</p>
              <p className="mt-2 text-lg text-white">{suggestedQuestion}</p>
              <button onClick={() => setSuggestedQuestion(pickRandomQuestion(category))} className="mt-4 h-9 rounded-lg border border-white/20 px-3 text-sm text-zinc-200 hover:border-white/40">Use another question</button>
            </div>
          ) : (
            <div className="mt-5">
              <label className="text-sm text-zinc-400">Your question</label>
              <input value={customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} placeholder="Type your research question" className="mt-2 h-11 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-white/35" />
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button onClick={handleNextFromQuestion} disabled={category === 'Other' && !customQuestion.trim()} className="h-10 rounded-lg bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50">
              Next: Open workspace
            </button>
          </div>
        </section>

        {archive.length > 0 && (
          <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">Saved research</h2>
            <div className="mt-4 grid gap-3">
              {archive.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-zinc-200">{item.topic}</p>
                  <button onClick={() => { setTopic(item.topic); setSections(item.sections || INITIAL_STRUCTURE); setBuilderActive(true); }} className="h-9 rounded-lg border border-white/20 px-3 text-sm text-zinc-200 hover:border-white/40">Open</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  if (submissionMode) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-8 md:p-12">
        <header className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-400">Research Suite</p>
            <h1 className="text-3xl font-semibold text-white">Submission planning</h1>
            <p className="mt-1 text-sm text-zinc-400">{topic}</p>
          </div>
          <button onClick={() => setSubmissionMode(false)} className="h-10 rounded-lg border border-white/20 px-4 text-sm text-zinc-200 hover:border-white/40">Back to builder</button>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">Core repositories</h2>
            <div className="mt-4 grid gap-3">
              {CORE_PLATFORMS.map((p) => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-200 hover:border-white/30">{p.name}</a>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">{isPremium ? 'Tailored recommendations' : 'Submission list'}</h2>
            {!isPremium && <p className="mt-2 text-sm text-zinc-400">Upgrade to Pro for tailored AI recommendation logic.</p>}
            {isLoadingRecs ? <p className="mt-4 text-zinc-500">Loading recommendations...</p> : (
              <div className="mt-4 grid gap-3">
                {recs.map((r) => (
                  <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 hover:border-white/30">
                    <p className="text-sm text-white">{r.name}</p>
                    {r.reason && <p className="mt-1 text-xs text-zinc-400">{r.reason}</p>}
                  </a>
                ))}
              </div>
            )}
            <div className="mt-5 flex gap-3">
              <button onClick={saveToArchive} className="h-10 rounded-lg border border-white/20 px-4 text-sm text-zinc-200 hover:border-white/40">Save</button>
              <button onClick={resetResearch} className="h-10 rounded-lg border border-white/20 px-4 text-sm text-zinc-400 hover:border-white/40 hover:text-white">New research</button>
            </div>
          </article>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8 md:p-12">
      <header className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-400">Research Suite</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">Research project workspace</h1>
            <p className="mt-1 text-sm text-zinc-400">{topic}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Progress {completionPercentage}%</span>
            <div className="h-2 w-36 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full bg-white" style={{ width: `${completionPercentage}%` }} /></div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-zinc-950/80 p-4 shadow-2xl">
          <h3 className="mb-3 text-sm font-semibold text-white">Project stages</h3>
          <div className="space-y-2">
            {sections.map((section) => (
              <button key={section.id} onClick={() => { setActiveSectionId(section.id); setAiPointer(null); }} className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${activeSectionId === section.id ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-white'}`}>
                <div className="flex items-center justify-between"><span>{section.title}</span><span className="text-xs">{section.content.trim().length > 50 ? 'Complete' : 'In progress'}</span></div>
              </button>
            ))}
          </div>
        </aside>

        <main className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">{activeSection.title}</h2>
              <p className="mt-1 text-sm text-zinc-400">{activeSection.explanation}</p>
            </div>
            <button onClick={handleAskAI} disabled={isAiLoading} className="h-10 rounded-lg border border-white/20 px-4 text-sm text-zinc-200 hover:border-white/40 disabled:opacity-50">{isAiLoading ? 'Loading…' : isPremium ? 'Get AI hint' : 'Pro: AI hint'}</button>
          </div>

          <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_300px]">
            <textarea
              value={activeSection.content}
              onChange={(e) => setSections((prev) => prev.map((s) => (s.id === activeSectionId ? { ...s, content: e.target.value } : s)))}
              placeholder={`Write your ${activeSection.title.toLowerCase()} here...`}
              className="min-h-[430px] w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-100 outline-none focus:border-white/35"
            />

            <aside className="space-y-4 rounded-xl border border-white/10 bg-black/30 p-4">
              {aiPointer && <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-zinc-300"><p className="mb-1 text-xs uppercase text-zinc-500">AI hint</p>{aiPointer}</div>}
              <div><p className="text-xs uppercase text-zinc-500">Checklist</p><ul className="mt-2 space-y-1 text-sm text-zinc-300">{activeSection.guidance.map((g, i) => <li key={i}>• {g}</li>)}</ul></div>
              <div><p className="text-xs uppercase text-zinc-500">Tip</p><p className="mt-1 text-sm text-zinc-300">{activeSection.tips}</p></div>
              <div><p className="text-xs uppercase text-zinc-500">Common mistake</p><p className="mt-1 text-sm text-zinc-300">{activeSection.commonMistakes}</p></div>
            </aside>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            {!quizSubmitted && completionPercentage >= 100 && (
              <button onClick={() => (operatorName ? initiateCertGeneration(operatorName) : setShowNameGate(true))} className="h-10 rounded-lg border border-white/20 px-4 text-sm text-zinc-200 hover:border-white/40">Generate certificate</button>
            )}
            {quizSubmitted && <button onClick={handleStartSubmission} className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-zinc-200">Finalize submission</button>}
            <button onClick={() => { const idx = sections.findIndex((s) => s.id === activeSectionId); if (idx < sections.length - 1) setActiveSectionId(sections[idx + 1].id); }} className="h-10 rounded-lg border border-white/20 px-4 text-sm text-zinc-200 hover:border-white/40">Next section</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResearchSimulator;
