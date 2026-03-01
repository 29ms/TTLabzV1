
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { QUICK_SCENARIOS } from '../constants';
import { LabTrack, QuickScenario } from '../types';
import { geminiService } from '../services/geminiService';
import { mediaService } from '../services/mediaService';

interface InfiniteProps {
  onComplete: (points: number, track: LabTrack) => void;
  onExit: () => void;
}

type SpeedLabMode = 'ALL' | 'TEXT' | 'VISUAL';

const InfiniteSection: React.FC<InfiniteProps> = ({ onComplete, onExit }) => {
  const [scenarios, setScenarios] = useState<QuickScenario[]>(QUICK_SCENARIOS);
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState<LabTrack | 'ALL'>('ALL');
  const [labMode, setLabMode] = useState<SpeedLabMode>('ALL');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isFetchingDynamic, setIsFetchingDynamic] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => setIsLoading(false), 800);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Use useMemo to filter scenarios based on both track and media mode
  const filteredPool = useMemo(() => {
    return scenarios.filter(s => {
      const trackMatch = filter === 'ALL' || s.track === filter;
      const modeMatch = 
        labMode === 'ALL' || 
        (labMode === 'TEXT' && (!s.mediaType || s.mediaType === 'TEXT')) ||
        (labMode === 'VISUAL' && (s.mediaType === 'IMAGE' || s.mediaType === 'VIDEO'));
      return trackMatch && modeMatch;
    });
  }, [scenarios, filter, labMode]);

  const scenario = filteredPool[index % filteredPool.length] || filteredPool[0];

  useEffect(() => {
    const loadMedia = async () => {
      if (scenario && scenario.mediaType === 'IMAGE' && scenario.mediaPrompt && labMode !== 'TEXT') {
        setIsGeneratingMedia(true);
        try {
          const url = await mediaService.generateImage(scenario.mediaPrompt);
          setMediaUrl(url);
        } catch (e) {
          console.error("Media generation for scenario failed.");
        } finally {
          setIsGeneratingMedia(false);
        }
      } else {
        setMediaUrl(null);
      }
    };
    loadMedia();
  }, [scenario, labMode]);

  const fetchNextScenario = useCallback(async () => {
    if (index >= filteredPool.length - 1) {
      setIsFetchingDynamic(true);
      try {
        // Pass labMode to dynamic generation if needed
        const nextDynamic = await geminiService.generateDynamicScenario(filter);
        setScenarios(prev => [...prev, nextDynamic]);
      } catch (e) {
        console.error("Dynamic sync failed, looping existing pool.");
      } finally {
        setIsFetchingDynamic(false);
      }
    }
  }, [index, filteredPool.length, filter]);

  const handleAnswer = (answer: boolean) => {
    const correct = answer === scenario.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);
    if (correct) onComplete(15, scenario.track);
  };

  const next = async () => {
    await fetchNextScenario();
    setIndex(prev => prev + 1);
    setShowExplanation(false);
    setMediaUrl(null);
  };

  if (isLoading) {
    return (
      <div className={`fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100'}`}>
        <div className="relative w-64 h-80 flex items-center justify-center">
          <svg viewBox="0 0 100 150" className="w-48 h-48 filter drop-shadow-[0_0_20px_rgba(212,212,216,0.5)]">
            <path d="M60 10 L20 80 L50 80 L30 140 L80 60 L50 60 L70 10 Z" fill="none" stroke="#d4d4d8" strokeWidth="0.8" className="animate-[strike_2.2s_ease-in-out_infinite]" strokeDasharray="400" strokeDashoffset="400"/>
            <path d="M60 10 L20 80 L50 80 L30 140 L80 60 L50 60 L70 10 Z" fill="#d4d4d8" className="opacity-0 animate-[strike-fill_2.2s_ease-in_infinite]"/>
          </svg>
        </div>
        <div className="text-center space-y-6">
          <h2 className="text-sm font-mono text-zinc-300 uppercase tracking-[0.8em] animate-pulse">Speed_Labs</h2>
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Neural Probe Sequence Initiation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:40px_40px]"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10 space-y-12 animate-in fade-in duration-1000">
        <header className="flex flex-col md:flex-row justify-between items-center px-4 gap-6">
          <button 
            onClick={onExit} 
            className="group flex items-center gap-3 text-zinc-600 hover:text-zinc-200 text-[10px] font-mono uppercase tracking-[0.3em] transition-all"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            <span>Exit_Labs</span>
          </button>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 p-1 px-4 rounded-sm">
              <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Track:</span>
              <select 
                value={filter} 
                onChange={e => { setFilter(e.target.value as any); setIndex(0); }} 
                className="bg-transparent text-[9px] font-mono text-zinc-400 outline-none uppercase cursor-pointer hover:text-zinc-200 transition-colors border-none p-1"
              >
                <option value="ALL">ALL_CHANNELS</option>
                {['LIFE', 'SOVEREIGNTY', 'DEFENDER', 'EXECUTIVE', 'INTEL', 'ETHICS'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 p-1 px-4 rounded-sm">
              <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Mode:</span>
              <div className="flex gap-4">
                {(['ALL', 'TEXT', 'VISUAL'] as SpeedLabMode[]).map(mode => (
                  <button 
                    key={mode}
                    onClick={() => { setLabMode(mode); setIndex(0); }}
                    className={`text-[9px] font-mono uppercase tracking-tighter transition-all ${labMode === mode ? 'text-zinc-100 underline decoration-zinc-500 underline-offset-4' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
        
        <div className="relative border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.6)] group overflow-hidden">
          <div className="space-y-8 relative">
            <div className="flex justify-center items-center border-b border-zinc-900/50 pb-6 relative">
              <div className="absolute left-0 text-[9px] font-mono text-zinc-800 uppercase tracking-widest">ID: {scenario?.id.substring(0,8) || index + 1}</div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.6em] flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full bg-zinc-700 ${isFetchingDynamic || isGeneratingMedia ? 'animate-ping' : 'animate-pulse'}`}></span>
                {isFetchingDynamic || isGeneratingMedia ? 'SYNCING...' : `Speed_Labs // ${scenario?.track || 'Buffer'}`}
              </span>
            </div>

            {filteredPool.length > 0 ? (
              <>
                <div className="flex flex-col md:flex-row gap-8 items-center min-h-[300px]">
                  {mediaUrl && labMode !== 'TEXT' && (
                    <div className="w-full md:w-1/2 border border-zinc-800 bg-black p-2 animate-in zoom-in duration-500">
                      <img src={mediaUrl} alt="Scenario View" className="w-full h-auto object-cover max-h-[300px]" />
                    </div>
                  )}
                  {isGeneratingMedia && (
                    <div className="w-full md:w-1/2 h-[200px] border border-zinc-900 bg-zinc-900/10 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-zinc-700 animate-pulse uppercase">Generating Visual Feed...</span>
                    </div>
                  )}
                  <div className={`flex-1 flex items-center justify-center px-4 ${(mediaUrl || isGeneratingMedia) ? 'text-left' : 'text-center'}`}>
                    <p className="text-xl md:text-2xl font-light text-zinc-100 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-1000">
                      {scenario?.prompt || "Buffer Loading..."}
                    </p>
                  </div>
                </div>

                {!showExplanation ? (
                  <div className="flex flex-col sm:flex-row gap-8 pt-8 justify-center items-center">
                    <button 
                      disabled={!scenario || isGeneratingMedia}
                      onClick={() => handleAnswer(true)} 
                      className="w-full sm:w-64 group relative border border-zinc-900 py-10 font-mono text-[11px] text-zinc-500 hover:border-zinc-100 hover:text-white transition-all uppercase tracking-[0.6em] overflow-hidden disabled:opacity-20"
                    >
                      <span className="relative z-10">VALIDATE / REAL</span>
                    </button>
                    <div className="hidden sm:block h-8 w-[1px] bg-zinc-900" />
                    <button 
                      disabled={!scenario || isGeneratingMedia}
                      onClick={() => handleAnswer(false)} 
                      className="w-full sm:w-64 group relative border border-zinc-900 py-10 font-mono text-[11px] text-zinc-500 hover:border-zinc-100 hover:text-white transition-all uppercase tracking-[0.6em] overflow-hidden disabled:opacity-20"
                    >
                      <span className="relative z-10">SUSPECT / FAKE</span>
                    </button>
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-bottom-6 duration-700 ease-out space-y-10 pt-4 flex flex-col items-center">
                    <div className={`flex items-center gap-5 text-[11px] font-mono uppercase tracking-[0.4em] font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? 'INTEGRITY_VERIFIED' : 'DETECTION_MISMATCH'}
                    </div>
                    <div className="bg-white/[0.02] border border-zinc-900 p-10 w-full text-center">
                       <p className="text-base text-zinc-400 font-light leading-relaxed italic max-w-xl mx-auto">
                        "{scenario?.explanation}"
                       </p>
                    </div>
                    <button 
                      onClick={next} 
                      className="w-full sm:w-80 bg-zinc-100 text-black py-6 font-mono text-[11px] uppercase tracking-[0.8em] hover:bg-white transition-all shadow-xl"
                    >
                      Next_Sequence
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-32 text-center space-y-4">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">No scenarios match your current filter.</p>
                <button onClick={() => { setFilter('ALL'); setLabMode('ALL'); }} className="text-[10px] font-mono text-white underline">Reset Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteSection;
