
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { certificateService } from '../services/certificateService';
import { COUNTRIES } from '../constants';
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
  { id: 'q', title: "Research Question", explanation: "Define the core problem or query your study addresses.", guidance: ["Ensure it's specific", "Avoid yes/no questions", "Link to a real-world problem"], tips: "The question should be narrow enough to answer but broad enough to matter.", commonMistakes: "Making it too broad (e.g. 'How does AI work?')", content: "" },
  { id: 'lr', title: "Background / Literature Review", explanation: "What is already known about this topic?", guidance: ["Synthesize previous findings", "Identify knowledge gaps", "Cite major milestones"], tips: "Focus on how your work builds on others.", commonMistakes: "Just listing articles without connecting them.", content: "" },
  { id: 'h', title: "Hypothesis", explanation: "If applicable, what is your predicted outcome?", guidance: ["Make it testable", "Root it in the background research"], tips: "If your research is exploratory, you may describe objective themes instead.", commonMistakes: "A hypothesis that cannot be measured.", content: "" },
  { id: 'm', title: "Methodology", explanation: "How will you gather and verify your data?", guidance: ["Quantitative vs Qualitative", "Sampling methods", "Tools used"], tips: "A good methodology allows someone else to repeat your experiment.", commonMistakes: "Vague descriptions of how you found info.", content: "" },
  { id: 'dcp', title: "Data Collection Plan", explanation: "Steps to obtain the raw information.", guidance: ["Timing of collection", "Ethical considerations", "Verification of sources"], tips: "Include how you ensured the data wasn't biased.", commonMistakes: "Missing details on the source's credibility.", content: "" },
  { id: 'dap', title: "Data Analysis Plan", explanation: "How will you interpret the findings?", guidance: ["Statistical tests", "Coding for themes", "Triangulation"], tips: "Explain the 'Why' behind your choice of analysis.", commonMistakes: "Assuming the data explains itself.", content: "" },
  { id: 'rs', title: "Results Section", explanation: "Present your findings objectively.", guidance: ["Use data points", "Avoid interpretation here", "Organize logically"], tips: "Graphs or tables are usually described here in a full paper.", commonMistakes: "Mixing results with your personal opinion.", content: "" },
  { id: 'disc', title: "Discussion", explanation: "What do the results mean?", guidance: ["Compare to Lit Review", "Address limitations", "Explain surprises"], tips: "Be honest about what your research didn't prove.", commonMistakes: "Ignoring results that contradicted your hypothesis.", content: "" },
  { id: 'conc', title: "Conclusion", explanation: "Summarize major takeaways and next steps.", guidance: ["Restate key findings", "Suggest future research", "Final implications"], tips: "End with a powerful thought on digital sovereignty.", commonMistakes: "Introducing new data in the conclusion.", content: "" },
  { id: 'ref', title: "References & Citations", explanation: "Credit your intelligence sources.", guidance: ["Use consistent style", "Double-check URLs", "Include all used sources"], tips: "Use tools like Zotero or Mendeley for management.", commonMistakes: "Missing citations for controversial claims.", content: "" },
];

const CORE_PLATFORMS: SubmissionPlatform[] = [
  { name: "arXiv", url: "https://arxiv.org" },
  { name: "SSRN", url: "https://www.ssrn.com" },
  { name: "ResearchGate", url: "https://www.researchgate.net" },
  { name: "Academia.edu", url: "https://www.academia.edu" },
  { name: "Zenodo", url: "https://zenodo.org" },
  { name: "Open Science Framework", url: "https://osf.io" },
  { name: "Google Scholar Profile", url: "https://scholar.google.com" },
];

const ResearchSimulator: React.FC<ResearchSimulatorProps> = ({ isPremium, operatorName, onComplete, onUpdateOperatorName, researchState, setResearchState, }) => {
  const [topic, setTopic] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [category, setCategory] = useState('AI');
  const [isRefining, setIsRefining] = useState(false);
  const [topicConfirmed, setTopicConfirmed] = useState(false);

  const [archive, setArchive] = useState<any[]>(
  (researchState && researchState.archive) ? researchState.archive : []
);
  
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<{ findings: string[], analysis: string } | null>(null);
  const [paper, setPaper] = useState<string | null>(null);
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false);
  
const [quizSubmitted, setQuizSubmitted] = useState(
  (researchState && researchState.quizSubmitted) ? researchState.quizSubmitted : false
);
const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [showNameGate, setShowNameGate] = useState(false);
  const [tempName, setTempName] = useState(operatorName);

  // Structured Builder States
  const [builderActive, setBuilderActive] = useState(false);
const [sections, setSections] = useState<ResearchSection[]>(
  (researchState && researchState.sections) ? researchState.sections : INITIAL_STRUCTURE
);
const [activeSectionId, setActiveSectionId] = useState(
  researchState?.activeSectionId || "q"
);

useEffect(() => {
      if (!researchState) return;

    setResearchState((prev: any) => ({

      ...prev,
      sections,
      activeSectionId,
    }));
  }, [sections, activeSectionId, setResearchState]);

  const [aiPointer, setAiPointer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [submissionMode, setSubmissionMode] = useState(false);
  const [recs, setRecs] = useState<SubmissionPlatform[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const activeSection = sections.find(s => s.id === activeSectionId)!;
  const completionPercentage = Math.round((sections.filter(s => s.content.length > 50).length / sections.length) * 100);

  const demographics = {
    ageRange: '14-17',
    gender: 'All',
    country: 'United States',
    education: 'High School'
  };

  const categories = ['AI', 'Tech', 'Privacy', 'Cybersecurity', 'Ethics'];

  // --- SYNC LOCAL RESEARCH UI STATE -> App.tsx researchState (so Firestore can save it) ---
useEffect(() => {
  setResearchState((prev: any) => ({
    ...(prev || {}),
    topic,
    customInput,
    category,
    topicConfirmed,
    results,
    paper,
    quizSubmitted,
    builderActive,
    sections,
    archive,
    activeSectionId,
  }));
}, [
  topic,
  customInput,
  category,
  topicConfirmed,
  results,
  paper,
  quizSubmitted,
  builderActive,
  sections,
  activeSectionId,
  archive,
  setResearchState,
]);

  const handleFetchTopic = async () => {
    setIsLoadingTopic(true);
    setTopicConfirmed(false);
    const newTopic = await geminiService.generateResearchTopic(category);
    setTopic(newTopic);
    setIsLoadingTopic(false);
    setTopicConfirmed(true);
  };

  const handleRefineCustom = async () => {
    if (!customInput.trim()) return;
    setIsRefining(true);
    const refined = await geminiService.refineTopic(customInput);
    setTopic(refined);
    setIsRefining(false);
    setTopicConfirmed(true);
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setPaper(null);
    const data = await geminiService.simulateResearchData(topic, demographics);
    setResults(data);
    setIsSimulating(false);
  };

  const handleGeneratePaper = async () => {
    setIsGeneratingPaper(true);
    const doc = await geminiService.generateResearchPaper(topic, results, demographics);
    setPaper(doc);
    setIsGeneratingPaper(false);
  };

  const handleSectionChange = (val: string) => {
    setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, content: val } : s));
  };

  const handleAskAI = async () => {
    setIsAiLoading(true);
    setAiPointer(null);
    const pointers = await geminiService.getStructuredResearchPointers(topic, activeSection.title, activeSection.content);
    setAiPointer(pointers);
    setIsAiLoading(false);
  };

  const handleStartSubmission = async () => {
    setSubmissionMode(true);
    setIsLoadingRecs(true);
    const context = sections.map(s => `${s.title}: ${s.content.substring(0, 100)}`).join('\n');
    const recommendations = await geminiService.getSubmissionRecommendations(topic, context);
    setRecs(recommendations);
    setIsLoadingRecs(false);
  };

  const initiateCertGeneration = async (name: string) => {
    setIsGeneratingCert(true);
    try {
      const cert = await certificateService.generateCertificate({
        fullName: name,
        title: `Research Specialist`,
        theater: 'GENERAL'
      });
      setQuizSubmitted(true);
      onComplete(cert);
      setBuilderActive(true);
    } catch (err) {
      console.error("Accreditation synthesis failed", err);
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim().length > 2) {
      onUpdateOperatorName(tempName.trim());
      setShowNameGate(false);
      initiateCertGeneration(tempName.trim());
    }
  };

  if (!isPremium) {
    return (
      <div className="p-12 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in">
        <h2 className="text-2xl font-light mb-4 uppercase tracking-widest text-zinc-500">Research Division Locked</h2>
        <p className="text-zinc-600 font-mono text-[10px] mb-8 uppercase tracking-widest">Office of the Director of Research // Clearance Level Alpha Required</p>
        <button className="text-[10px] font-mono border border-zinc-800 px-8 py-3 uppercase tracking-widest hover:bg-zinc-300 hover:text-black transition-all">Request Professional Clearance</button>
      </div>
    );
  }

  if (showNameGate) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 space-y-10 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-white uppercase tracking-tighter">Identity Confirmation Required</h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest max-w-md mx-auto">
            The Director of Research requires your verified legal name for the Elite Research Specialist accreditation.
          </p>
        </div>
        <form onSubmit={handleNameSubmit} className="w-full max-w-sm space-y-6">
          <input 
            type="text" 
            autoFocus
            placeholder="FULL LEGAL NAME"
            className="w-full bg-black border border-zinc-800 p-5 text-center font-mono text-xs tracking-widest text-white outline-none focus:border-white transition-all uppercase rounded-xl"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
          />
          <button className="w-full bg-white text-black py-5 font-mono text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-200 transition-all rounded-xl shadow-xl">Confirm & Generate Certificate</button>
        </form>
      </div>
    );
  }

  if (isGeneratingCert) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 space-y-12 animate-in fade-in duration-1000 text-center">
        <div className="relative">
          <div className="w-24 h-24 border border-zinc-800 rounded-full animate-pulse flex items-center justify-center">
             <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="absolute -top-4 -right-4 bg-white text-black text-[9px] font-mono px-3 py-1 uppercase tracking-widest">Mastery Detected</div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-light uppercase tracking-[0.2em] text-white">Synthesizing_Research_Credential</h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Director of Research: Finalizing B&W High-Fidelity Accreditation...</p>
        </div>
      </div>
    );
  }

  // --- STRUCTURED BUILDER UI ---
  if (builderActive) {
    if (submissionMode) {
      return (
        <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12 animate-in fade-in">
          <header className="border-b border-zinc-900 pb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-light mb-2 uppercase tracking-tighter text-zinc-300">Research Submission Portal</h1>
              <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.5em]">Topic: {topic}</p>
            </div>
            <button onClick={() => setSubmissionMode(false)} className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest">Return to Builder</button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest border-l border-zinc-800 pl-4">Core Repositories</h3>

              {archive.length > 0 && (
  <section className="border border-zinc-900 p-6 rounded-2xl bg-zinc-900/5 space-y-4">
    <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
      Research Archive
    </h3>

    <div className="space-y-3">
      {archive.map(item => (
        <div key={item.id} className="flex items-center justify-between border border-zinc-900 p-4 rounded-xl">
          <div className="min-w-0">
            <div className="text-zinc-200 text-sm truncate">{item.topic}</div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              Saved
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => {
                setTopic(item.topic || '');
                setPaper(item.paper || null);
                setSections(item.sections || INITIAL_STRUCTURE);
                setTopicConfirmed(true);
              }}
              className="text-[10px] font-mono px-4 py-2 border border-zinc-800 text-zinc-300 hover:border-white hover:text-white rounded-lg uppercase tracking-widest"
            >
              Open
            </button>

            <button
              onClick={() => {
                setArchive(prev => prev.filter(x => x.id !== item.id));
              }}
              className="text-[10px] font-mono px-4 py-2 border border-red-900 text-red-300 hover:border-red-400 hover:text-red-200 rounded-lg uppercase tracking-widest"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

              <button
  onClick={() => {
    const item = {
      id: crypto.randomUUID(),
      topic,
      savedAt: Date.now(),
      paper,
      sections,
    };
    setArchive(prev => [item, ...prev]);
  }}
  className="w-full bg-white text-black py-4 font-mono text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all rounded-xl"
>
  Save to Archive
</button>

<button
  onClick={() => {
    setTopic('');
    setCustomInput('');
    setTopicConfirmed(false);
    setResults(null);
    setPaper(null);
    setSubmissionMode(false);
    setRecs([]);
    setBuilderActive(false);
    setSections(INITIAL_STRUCTURE);
    setActiveSectionId('q');
  }}
  className="w-full border border-zinc-800 text-zinc-300 py-4 font-mono text-[10px] uppercase tracking-[0.4em] hover:border-white hover:text-white transition-all rounded-xl"
>
  New Research
</button>


              <div className="grid grid-cols-1 gap-4">
                {CORE_PLATFORMS.map(p => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="p-4 border border-zinc-900 bg-zinc-900/10 hover:border-zinc-500 transition-all flex justify-between items-center group">
                    <span className="text-sm text-zinc-300 group-hover:text-white">{p.name}</span>
                    <span className="text-[9px] font-mono text-zinc-700">EXT_LINK ↗</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest border-l border-zinc-800 pl-4">AI Recommendations</h3>
              {isLoadingRecs ? (
                <div className="p-12 text-center animate-pulse text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Analyzing metadata for smart suggestions...</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {recs.map(p => (
                    <div key={p.name} className="p-6 border border-zinc-800 bg-zinc-950/40 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-1 text-[7px] font-mono text-zinc-800 bg-zinc-900">RECOMMENDED</div>
                      <h4 className="text-sm text-white mb-2">{p.name}</h4>
                      <p className="text-xs text-zinc-500 font-light mb-4 italic leading-relaxed">"{p.reason}"</p>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-mono text-zinc-300 hover:underline uppercase tracking-widest">Connect to Node ↗</a>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in h-screen flex flex-col overflow-hidden">
        <header className="border-b border-zinc-900 pb-6 flex justify-between items-end shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-light uppercase tracking-tighter text-zinc-200">Structured Research Builder</h1>
              <div className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Mode: Academic Tier III</div>
            </div>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.5em]">{topic}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Global Progress:</span>
                <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                   <div className="h-full bg-white transition-all duration-700 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                <span className="text-[10px] font-mono text-white font-bold">{completionPercentage}%</span>
             </div>
             <button onClick={() => setBuilderActive(false)} className="text-[9px] font-mono text-zinc-600 hover:text-white transition-colors uppercase underline underline-offset-4">Return to Suite</button>

        


          </div>
        </header>

        <div className="flex-1 flex gap-8 overflow-hidden">
          {/* Roadmap Sidebar */}
          <aside className="w-64 border-r border-zinc-900 pr-4 overflow-y-auto custom-scrollbar">
            <h3 className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em] mb-6 font-bold">Investigation Roadmap</h3>
            <div className="space-y-2">
              {sections.map(s => (
                <button 
                  key={s.id}
                  onClick={() => { setActiveSectionId(s.id); setAiPointer(null); }}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1 ${activeSectionId === s.id ? 'bg-zinc-100 text-black border-white' : 'border-zinc-900 hover:border-zinc-600 text-zinc-500'}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tight">{s.title}</span>
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] font-mono ${activeSectionId === s.id ? 'text-zinc-600' : 'text-zinc-800'}`}>
                      {s.content.length > 50 ? 'VERIFIED' : 'PENDING'}
                    </span>
                    {s.content.length > 50 && <span className="text-[10px]">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Editor Area */}
          <main className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="bg-zinc-950/40 border border-zinc-900 p-8 rounded-[2rem] flex-1 flex flex-col overflow-hidden">
               <div className="flex justify-between items-start mb-6 border-b border-zinc-900 pb-4 shrink-0">
                  <div className="space-y-1">
                    <h2 className="text-xl font-light text-white uppercase tracking-tight">{activeSection.title}</h2>
                    <p className="text-xs text-zinc-500 font-light italic">"{activeSection.explanation}"</p>
                  </div>
                  <button onClick={handleAskAI} disabled={isAiLoading} className="px-4 py-2 border border-zinc-800 hover:border-zinc-400 text-[10px] font-mono text-zinc-400 hover:text-white transition-all uppercase tracking-widest disabled:opacity-30">
                    {isAiLoading ? 'SYNCING...' : 'Ask AI for Help'}
                  </button>


               </div>

               <div className="flex-1 flex gap-8 overflow-hidden">
                  <div className="flex-1 flex flex-col">
                    <textarea 
                      className="flex-1 bg-black/40 border border-zinc-800 p-6 text-zinc-100 font-light text-sm leading-relaxed outline-none focus:border-zinc-500 transition-all resize-none shadow-inner"
                      placeholder={`Begin analysis for ${activeSection.title}...`}
                      value={activeSection.content}
                      onChange={(e) => handleSectionChange(e.target.value)}
                    />
                  </div>

                  <aside className="w-80 space-y-6 overflow-y-auto custom-scrollbar pl-4">
                     {aiPointer && (
                       <div className="p-4 bg-zinc-900/50 border border-zinc-700 animate-in slide-in-from-right-2 duration-300">
                          <h4 className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest mb-3 font-bold underline underline-offset-4">AI Structural Pointers:</h4>
                          <p className="text-[11px] text-zinc-400 leading-loose italic">{aiPointer}</p>
                       </div>
                     )}
                     
                     <div className="space-y-4">
                        <h4 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Guidance Checklist:</h4>
                        <ul className="space-y-2">
                          {activeSection.guidance.map((g, idx) => (
                            <li key={idx} className="text-[10px] text-zinc-400 flex items-center gap-2">
                               <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                               {g}
                            </li>
                          ))}
                        </ul>
                     </div>

                     <div className="p-4 border-t border-zinc-900 pt-6">
                        <h4 className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-2 font-bold">Structural Tips</h4>
                        <p className="text-[10px] text-zinc-600 font-light leading-relaxed">{activeSection.tips}</p>
                     </div>

                     <div className="p-4 border-t border-zinc-900 pt-6">
                        <h4 className="text-[9px] font-mono text-red-900 uppercase tracking-widest mb-2 font-bold">Common Pitfalls</h4>
                        <p className="text-[10px] text-zinc-700 font-light leading-relaxed">{activeSection.commonMistakes}</p>
                     </div>
                  </aside>
               </div>
            </div>

            <div className="flex justify-between items-center shrink-0">
               <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">Session_AutoSave: Active</div>
               <div className="flex gap-4">
                  {completionPercentage >= 100 && (
                    <button onClick={handleStartSubmission} className="bg-white text-black px-12 py-4 rounded-full font-mono text-xs font-bold uppercase tracking-[0.4em] shadow-xl transition-all hover:bg-zinc-200">Finalize & Submit</button>
                  )}
                  <button onClick={() => {
                    const idx = sections.findIndex(s => s.id === activeSectionId);
                    if (idx < sections.length - 1) setActiveSectionId(sections[idx + 1].id);
                  }} className="border border-zinc-800 text-zinc-500 px-8 py-4 rounded-full font-mono text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all">Next Section →</button>
                  
               </div>
            </div>
          </main>
        </div>
      </div>
    );
  }



  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in pb-32">
      <header className="border-b border-zinc-900 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-light mb-2 uppercase tracking-tighter text-zinc-300">Research_Suite</h1>
          <p className="text-zinc-500 text-sm font-light uppercase tracking-widest text-[10px]">Office of the Director of Research // Global Intelligence Synthesis</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest block mb-1">Grant Eligibility</span>
          <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-tighter">Level A-2 Certified</span>
        </div>
      </header>

      {/* Structured Path Unlock Section (Shown after cert or always if premium) */}
      {quizSubmitted && !builderActive && (
        <section className="animate-in zoom-in-95 duration-700">
           <div className="border-2 border-zinc-800 p-12 bg-zinc-950/20 text-center space-y-8 rounded-[3rem] relative overflow-hidden group hover:border-zinc-600 transition-all">
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none group-hover:bg-white/[0.03] transition-colors"></div>
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] font-mono text-white bg-zinc-900 border border-zinc-800 px-4 py-1.5 uppercase tracking-widest rounded-full">New Achievement Unlocked</span>
                <h2 className="text-4xl font-light text-white uppercase tracking-tighter">Academic Structured Builder</h2>
                <p className="text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
                  Now that you have your foundational accreditation, you can access the professional-grade Research Builder. Create high-fidelity papers with guided methodology and AI structural pointers.
                </p>
              </div>
              <button 
                onClick={() => setBuilderActive(true)}
                className="bg-zinc-100 text-black px-16 py-6 rounded-full font-mono text-[10px] uppercase font-bold tracking-[0.8em] shadow-2xl hover:bg-white transition-all active:scale-95 relative z-10"
              >
                Initialize Builder Mode
              </button>
           </div>
        </section>
      )}

{archive.length > 0 && (
  <section className="border border-zinc-900 p-6 rounded-2xl bg-zinc-900/5 space-y-4">
    <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
      Research Archive
    </h3>

    <div className="space-y-3">
      {archive.map(item => (
        <div key={item.id} className="flex items-center justify-between border border-zinc-900 p-4 rounded-xl">
          <div className="min-w-0">
            <div className="text-zinc-200 text-sm truncate">{item.topic}</div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              Saved
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => {
                setTopic(item.topic || '');
                setPaper(item.paper || null);
                setSections(item.sections || INITIAL_STRUCTURE);
                setTopicConfirmed(true);
              }}
              className="text-[10px] font-mono px-4 py-2 border border-zinc-800 text-zinc-300 hover:border-white hover:text-white rounded-lg uppercase tracking-widest"
            >
              Open
            </button>

            <button
              onClick={() => {
                setArchive(prev => prev.filter(x => x.id !== item.id));
              }}
              className="text-[10px] font-mono px-4 py-2 border border-red-900 text-red-300 hover:border-red-400 hover:text-red-200 rounded-lg uppercase tracking-widest"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

      {!topicConfirmed ? (
        <section className="border border-zinc-900 p-8 bg-zinc-900/5 space-y-8 rounded-[2rem]">
          <div className="flex flex-wrap gap-4 mb-4">
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setCategory(c)}
                className={`text-[10px] font-mono px-4 py-2 uppercase tracking-widest border transition-all ${category === c ? 'bg-zinc-300 text-black border-zinc-300' : 'border-zinc-900 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'}`}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest underline underline-offset-4">Option A: System Synthesis</h3>
              <button 
                onClick={handleFetchTopic}
                className="w-full bg-zinc-900/50 border border-zinc-900 py-6 font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all text-zinc-400 hover:text-zinc-200 rounded-xl"
              >
                {isLoadingTopic ? 'Synthesizing...' : 'Generate New Topic'}
              </button>




            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest underline underline-offset-4">Research Topic</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  placeholder="Enter raw concept..."
                  className="flex-1 bg-black border border-zinc-900 p-3 text-xs font-mono outline-none focus:border-zinc-500 text-zinc-400 rounded-lg"
                />
                <button 
                  onClick={handleRefineCustom}
                  className="bg-zinc-300 text-black px-6 py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-white transition-all rounded-lg"
                >
                  {isRefining ? '...' : 'REFINE'}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-8 animate-in slide-in-from-top-4 duration-700 ease-out">
          <div className="border border-zinc-900 p-10 bg-zinc-900/5 rounded-[3rem]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em] font-bold">Confirmed Topic Node</span>
              <button onClick={() => setTopicConfirmed(false)} className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 underline uppercase transition-colors">Modify</button>
            </div>
            <p className="text-3xl font-light text-zinc-100 mb-10 leading-tight">{topic}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {/* Simplified demographics as per non-destructive rule */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-zinc-700 uppercase font-bold">Age Range</label>
                <div className="p-3 bg-black border border-zinc-800 text-[10px] font-mono text-zinc-500 rounded-lg uppercase tracking-widest">14-17</div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-zinc-700 uppercase font-bold">Country</label>
                <div className="p-3 bg-black border border-zinc-800 text-[10px] font-mono text-zinc-500 rounded-lg uppercase tracking-widest">Global</div>
              </div>
            </div>

            <button onClick={handleSimulate} className="w-full bg-zinc-100 text-black py-5 font-mono text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all shadow-xl rounded-xl">
              {isSimulating ? 'COLLECTING DATA...' : 'INITIATE DATA COLLECTION'}
            </button>
          </div>
        </section>
      )}

      {results && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="border border-zinc-900 p-12 bg-zinc-900/10 rounded-[2rem]">
            <h3 className="text-[10px] font-mono text-zinc-600 uppercase mb-8 tracking-[0.4em] font-bold">Synthesized Findings Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {results.findings.map((f, i) => (
                <div key={i} className="border-l-2 border-zinc-800 pl-6 py-4 group">
                  <p className="text-3xl font-light text-zinc-100 group-hover:text-white transition-colors">{f.split(' ')[0]}</p>
                  <p className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest mt-2">{f.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleGeneratePaper} className="bg-zinc-100 text-black px-12 py-5 font-mono text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all rounded-xl">
            {isGeneratingPaper ? 'GENERATING PUBLICATION...' : 'GENERATE FORMAL PAPER'}
          </button>
        </div>
      )}

      {paper && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-1000">
           <div className="relative border border-zinc-900 bg-black p-12 h-[750px] overflow-hidden group shadow-2xl rounded-[2rem]">
             <div className="h-full overflow-y-auto font-mono text-[11px] leading-loose text-zinc-600 whitespace-pre scrollbar-hide">
               <div className="max-w-2xl mx-auto">
                  {paper}
               </div>
             </div>
           </div>

           <div className="border border-zinc-900 p-10 space-y-10 rounded-[2rem]">
             <h3 className="text-xs font-mono text-zinc-300 uppercase tracking-[0.4em] mb-2 font-bold">Integrity Validation</h3>
             {quizSubmitted ? (
               <div className="text-center py-32 space-y-6">
                 <div className="text-6xl text-white animate-pulse">✓</div>
                 <p className="text-lg font-light text-zinc-100 uppercase tracking-tighter">Accreditation Authenticated</p>
               </div>
             ) : (
               <form onSubmit={(e) => { e.preventDefault(); if(!operatorName) setShowNameGate(true); else initiateCertGeneration(operatorName); }} className="space-y-8">
                 <div className="space-y-4">
                    <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">To unlock the Elite Research Specialist accreditation, ensure you have reviewed all findings and analyzed the ethical implications of the synthetic data provided.</p>
                 </div>
                 <button type="submit" className="w-full bg-white text-black py-5 font-mono text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.05)]">Validate & Unlock Research Certificate</button>

                 
               </form>
             )}
           </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #27272a; }
      `}</style>
    </div>
  );
};

export default ResearchSimulator;