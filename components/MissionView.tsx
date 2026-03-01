import React, { useState, useEffect } from 'react';
import { Mission } from '../types';
import { geminiService } from '../services/geminiService';
import { mediaService } from '../services/mediaService';

interface MissionViewProps {
  mission: Mission;
  onExit: () => void;
  onComplete: (missionId: string) => void;
}

const MissionView: React.FC<MissionViewProps> = ({ mission: initialMission, onExit, onComplete }) => {
  const [currentMission, setCurrentMission] = useState<Mission>(initialMission);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [isGeneratingRemedial, setIsGeneratingRemedial] = useState(false);
  const [isRemedial, setIsRemedial] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMediaInit = async () => {
    setIsGeneratingMedia(true);
    setError(null);
    try {
      // Improved prompt: Explicitly ask for text-heavy, list-based info for "Data Broker" missions
      const extraContext = currentMission.id === 's1' ? 'Show a computer screen with a list of user details. Include some text like "GUESSED INTERESTS" or "PREDICTED MOOD".' : '';
      const prompt = `Hyper-realistic forensic evidence: ${currentMission.scenario}. ${extraContext} High detail, cinematic lighting, sharp focus on the text and details.`;
      
      let url = '';
      if (currentMission.mediaType === 'IMAGE') {
        url = await mediaService.generateImage(prompt);
      } else if (currentMission.mediaType === 'VIDEO') {
        url = await mediaService.generateVideo(prompt);
      }
      setMediaUrl(url);
    } catch (err) {
      setError("Failed to initialize visual asset. Please retry.");
      console.error(err);
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  const handleSubmit = async () => {
    if (!response.trim()) return;
    setIsSubmitting(true);
    
    // Pass mediaUrl if it's an image so Gemini can actually "see" it for feedback
    const imageData = (currentMission.mediaType === 'IMAGE' && mediaUrl) ? mediaUrl : undefined;
    
    const feedbackText = await geminiService.getMentorFeedback(
      `SCENARIO: ${currentMission.scenario}\nTASK: ${currentMission.task}`,
      response,
      imageData
    );
    setFeedback(feedbackText);
    setIsSubmitting(false);
  };

  const handleRetrySimilar = async () => {
    if (!feedback) return;
    setIsGeneratingRemedial(true);
    try {
      const remedialMission = await geminiService.generateSimilarMission(currentMission, response, feedback);
      setCurrentMission(remedialMission);
      setIsRemedial(true);
      setResponse('');
      setFeedback(null);
      setMediaUrl(null); // Force re-generation of media for new scenario
    } catch (err) {
      setError("Failed to generate remedial mission sequence.");
    } finally {
      setIsGeneratingRemedial(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row animate-in fade-in duration-500">
      {/* Sidebar Mission Info */}
      <div className="w-full md:w-1/3 border-r border-zinc-800 p-8 flex flex-col relative overflow-hidden">
        {isRemedial && (
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600/50 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
        )}
        <button onClick={onExit} className="text-zinc-500 hover:text-white mb-12 text-xs font-mono uppercase tracking-widest flex items-center">
          ← TERMINATE SESSION
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono border border-zinc-700 px-2 py-1 uppercase text-zinc-400 inline-block">{currentMission.category}</span>
            {isRemedial && <span className="text-[10px] font-mono bg-red-900/40 text-red-400 px-2 py-1 uppercase tracking-tighter animate-pulse border border-red-900/60">Remedial_Protocol</span>}
          </div>
          <h1 className="text-3xl font-light mb-6 tracking-tight uppercase">{currentMission.title}</h1>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-mono uppercase text-zinc-500 mb-2">Scenario Context</h3>
              <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-900/50 p-4 border-l border-zinc-700 italic">
                {currentMission.scenario}
              </p>
            </section>
            
            <section>
              <h3 className="text-xs font-mono uppercase text-zinc-500 mb-2">Operation Task</h3>
              <p className="text-white text-sm leading-relaxed">
                {currentMission.task}
              </p>
            </section>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-900 text-[10px] text-zinc-600 font-mono">
          {isRemedial ? 'ADAPTIVE TRAINING SEQUENCE ACTIVE // ERROR COMPENSATION ENABLED' : 'SECURE SIMULATION ENGINE ENABLED // VISUAL ANALYSIS UNIT ACTIVE'}
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <div className="max-w-4xl mx-auto h-full flex flex-col relative">
          
          {isGeneratingRemedial && (
            <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-300">
               <div className="w-64 h-1 bg-zinc-900 mb-8 overflow-hidden">
                  <div className="h-full bg-white animate-[loading_2s_ease-in-out_infinite]"></div>
               </div>
               <p className="text-xs font-mono uppercase tracking-[0.4em] mb-2">Regenerating Neural Scenario</p>
               <p className="text-[10px] text-zinc-600 font-mono uppercase">Adapting complexity based on previous performance markers...</p>
               <style>{`
                 @keyframes loading {
                   0% { transform: translateX(-100%); }
                   100% { transform: translateX(100%); }
                 }
               `}</style>
            </div>
          )}

          {currentMission.mediaType !== 'TEXT' && !mediaUrl && !feedback && (
            <div className="flex-1 flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900/10 mb-8 p-12 text-center">
              {isGeneratingMedia ? (
                <div className="space-y-6">
                  <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-2">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-white animate-pulse">
                      Decoding Visual Artifacts...
                    </p>
                    <p className="text-[10px] text-zinc-600 font-mono uppercase">
                      {currentMission.mediaType === 'VIDEO' ? 'Neural Engine Rendering Video Sequence' : 'Synthesizing High-Resolution Image'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="w-16 h-16 border border-zinc-800 flex items-center justify-center mx-auto">
                    <span className="text-2xl opacity-20">{currentMission.mediaType === 'IMAGE' ? '◈' : '▶'}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-400">Visual Feed Not Initialized</h3>
                    <p className="text-xs text-zinc-600 font-light max-w-sm">
                      This lab requires visual analysis of AI-generated artifacts. Initialize the feed to begin.
                    </p>
                  </div>
                  {error && <p className="text-[10px] text-red-500 font-mono uppercase">{error}</p>}
                  <button 
                    onClick={handleMediaInit}
                    className="border border-white text-white px-8 py-3 text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                  >
                    Initialize Visual Decoder
                  </button>
                </div>
              )}
            </div>
          )}

          {mediaUrl && !feedback && (
            <div className="mb-8 border border-zinc-800 bg-black overflow-hidden group shadow-2xl">
              {currentMission.mediaType === 'IMAGE' ? (
                <img src={mediaUrl} alt="Forensic Artifact" className="w-full h-auto object-contain max-h-[500px]" />
              ) : (
                <video src={mediaUrl} controls autoPlay loop className="w-full h-auto max-h-[500px]" />
              )}
              <div className="p-3 bg-zinc-900/50 flex justify-between items-center border-t border-zinc-800">
                <span className="text-[9px] font-mono text-zinc-600 uppercase">Artifact Analysis Node // {currentMission.id}</span>
              </div>
            </div>
          )}

          {!feedback ? (
            <>
              <h2 className="text-xs font-mono uppercase text-zinc-500 mb-4 tracking-widest">Operator Analysis Input</h2>
              <textarea
                className="flex-1 bg-zinc-900/30 border border-zinc-800 p-6 text-white font-mono text-sm outline-none focus:border-zinc-500 transition-colors resize-none mb-6 placeholder:text-zinc-700 min-h-[200px]"
                placeholder="Enter your findings and strategic reasoning here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
              <button
                disabled={isSubmitting || !response.trim() || (currentMission.mediaType !== 'TEXT' && !mediaUrl)}
                onClick={handleSubmit}
                className="bg-white text-black py-4 px-8 font-mono text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors disabled:opacity-30 self-end shadow-lg"
              >
                {isSubmitting ? 'TRANSMITTING...' : 'SUBMIT ANALYSIS'}
              </button>
            </>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Mentor Evaluation</h2>
                <button 
                  onClick={() => setFeedback(null)}
                  className="text-xs font-mono text-zinc-500 hover:text-white"
                >
                  REVISE ANALYSIS
                </button>
              </div>
              <div className="flex-1 bg-zinc-900/30 border border-zinc-800 p-8 overflow-y-auto mb-8 font-light text-zinc-300 leading-relaxed space-y-6">
                {feedback.split('\n').map((para, i) => para ? <p key={i} className="animate-in fade-in duration-500" style={{animationDelay: `${i * 100}ms`}}>{para}</p> : <br key={i} />)}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 self-end">
                {!isRemedial && (
                  <button
                    onClick={handleRetrySimilar}
                    className="border border-zinc-700 text-zinc-400 py-4 px-8 font-mono text-sm uppercase tracking-[0.2em] hover:border-white hover:text-white transition-all"
                  >
                    Retry Similar Mission
                  </button>
                )}
                <button
                  onClick={() => onComplete(initialMission.id)}
                  className="bg-white text-black py-4 px-12 font-mono text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl"
                >
                  Finalize Mission
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionView;