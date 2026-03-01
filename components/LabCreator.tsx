import React, { useState, useEffect } from 'react';
import { LabTrack, MediaType, LabDifficulty, Mission } from '../types';
import MissionView from './MissionView';

interface LabCreatorProps {
  isPremium: boolean;
  onResearchComplete: () => void;
}

const LabCreator: React.FC<LabCreatorProps> = ({ isPremium }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [createdLabs, setCreatedLabs] = useState<Mission[]>([]);
  const [activeTestMission, setActiveTestMission] = useState<Mission | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    track: 'SOVEREIGNTY' as LabTrack,
    difficulty: 'INTERMEDIATE' as LabDifficulty,
    mediaType: 'TEXT' as MediaType,
    scenario: '',
    task: '',
  });

  // Load private labs from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('techtales_private_labs');
    if (saved) {
      try {
        setCreatedLabs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load private labs", e);
      }
    }
  }, []);

  const handlePublish = () => {
    if (!formData.title || !formData.scenario || !formData.task) {
      alert("Verification Error: All intelligence fields must be populated before deployment.");
      return;
    }

    const newMission: Mission = {
      id: `private-${Date.now()}`,
      title: formData.title,
      track: formData.track,
      category: 'TEXT_ANALYSIS', 
      difficulty: formData.difficulty,
      description: formData.scenario.substring(0, 80) + '...',
      scenario: formData.scenario,
      task: formData.task,
      completed: false,
      premium: false,
      mediaType: formData.mediaType,
    };

    const updatedLabs = [newMission, ...createdLabs];
    setCreatedLabs(updatedLabs);
    localStorage.setItem('techtales_private_labs', JSON.stringify(updatedLabs));
    
    alert('Deployment Successful: Lab added to Private Archive.');
    setFormData({
      title: '',
      track: 'SOVEREIGNTY',
      difficulty: 'INTERMEDIATE',
      mediaType: 'TEXT',
      scenario: '',
      task: '',
    });
    setStep(1);
  };

  const deleteLab = (id: string) => {
    const updated = createdLabs.filter(l => l.id !== id);
    setCreatedLabs(updated);
    localStorage.setItem('techtales_private_labs', JSON.stringify(updated));
  };

  // If user is testing their mission, show the mission view
  if (activeTestMission) {
    return (
      <div className="fixed inset-0 z-[200] bg-black">
        <MissionView 
          mission={activeTestMission} 
          onExit={() => setActiveTestMission(null)} 
          onComplete={() => {
            alert("Simulation Complete. Performance markers recorded.");
            setActiveTestMission(null);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto animate-in fade-in duration-700 pb-40">
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.5em]">Creative_Terminal_v4</span>
        </div>
        <h1 className="text-5xl font-light tracking-tighter text-white uppercase mb-4">Lab_Creator</h1>
        <p className="text-zinc-500 max-w-xl text-sm font-light leading-relaxed">
          Design, test, and archive custom intelligence scenarios. All deployments are stored locally in your private encrypted vault.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Creation Panel */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-950 border border-zinc-900 p-10 shadow-2xl relative overflow-hidden rounded-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800"></div>
            
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-[11px] font-mono text-white uppercase tracking-widest font-bold underline underline-offset-8">Construction_Sequence_0{step}</h2>
              <div className="flex gap-1">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-1 w-6 transition-all duration-500 ${step >= s ? 'bg-white' : 'bg-zinc-900'}`} />
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Mission Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-zinc-800 p-4 text-white font-mono text-sm focus:border-white outline-none transition-all uppercase placeholder:text-zinc-800"
                    placeholder="E.G. THE SHADOW NETWORK"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Analysis Track</label>
                    <select 
                      className="w-full bg-black border border-zinc-800 p-4 text-white font-mono text-xs uppercase outline-none focus:border-white transition-all"
                      value={formData.track}
                      onChange={e => setFormData({...formData, track: e.target.value as any})}
                    >
                      {['SOVEREIGNTY', 'DEFENDER', 'EXECUTIVE', 'INTEL', 'ETHICS', 'LIFE'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Input Modality</label>
                    <select 
                      className="w-full bg-black border border-zinc-800 p-4 text-white font-mono text-xs uppercase outline-none focus:border-white transition-all"
                      value={formData.mediaType}
                      onChange={e => setFormData({...formData, mediaType: e.target.value as any})}
                    >
                      <option value="TEXT">Text only</option>
                      <option value="IMAGE">Visual Analysis (Image)</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-white text-black py-5 font-mono text-xs font-bold uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-xl"
                >
                  Continue to Core Analysis
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Scenario Context</label>
                  <textarea 
                    className="w-full bg-black border border-zinc-800 p-6 h-48 text-white font-light text-sm leading-relaxed focus:border-white outline-none transition-all placeholder:text-zinc-800 resize-none"
                    placeholder="Define the hypothetical intelligence situation..."
                    value={formData.scenario}
                    onChange={e => setFormData({...formData, scenario: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Verification Task</label>
                  <textarea 
                    className="w-full bg-black border border-zinc-800 p-6 h-32 text-white font-light text-sm leading-relaxed focus:border-white outline-none transition-all placeholder:text-zinc-800 resize-none"
                    placeholder="What must the operator identify or solve?"
                    value={formData.task}
                    onChange={e => setFormData({...formData, task: e.target.value})}
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 border border-zinc-800 text-zinc-500 py-4 font-mono text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all">Back</button>
                  <button onClick={() => setStep(3)} className="flex-[2] bg-white text-black py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all">Final Review</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="border border-zinc-800 p-8 bg-black/40 space-y-6">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Protocol Preview</span>
                    <span className="text-[9px] font-mono text-zinc-100 uppercase bg-zinc-900 px-2 py-1">{formData.mediaType}</span>
                  </div>
                  <h4 className="text-2xl font-light text-white uppercase tracking-tight">{formData.title || 'UNTITLED_MISSION'}</h4>
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-400 leading-relaxed italic">"{formData.scenario}"</p>
                    <p className="text-xs text-zinc-300 font-mono">Objective: {formData.task}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 border border-zinc-800 text-zinc-500 py-4 font-mono text-xs uppercase tracking-widest hover:text-white hover:border-white transition-all">Modify</button>
                  <button onClick={handlePublish} className="flex-[2] bg-white text-black py-4 font-mono text-xs font-bold uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all shadow-xl">Deploy to Archive</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Local Repository / Vault Panel */}
        <div className="lg:col-span-5">
          <div className="border border-zinc-900 p-10 h-full flex flex-col bg-zinc-950/20">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.4em] mb-10 font-bold border-b border-zinc-900 pb-4 flex justify-between items-center">
              Private_Vault_Node
              <span className="text-[9px] text-zinc-700">[{createdLabs.length}_Stored]</span>
            </h3>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
              {createdLabs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-30">
                  <div className="text-4xl">🗃️</div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Archive empty. Construct a lab to begin storage.</p>
                </div>
              ) : (
                createdLabs.map(lab => (
                  <div key={lab.id} className="group border border-zinc-900 p-6 bg-black/40 hover:border-zinc-500 transition-all relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">[{lab.track}] // {lab.mediaType}</span>
                        <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-tight group-hover:text-white transition-colors">{lab.title}</h4>
                      </div>
                      <button 
                        onClick={() => deleteLab(lab.id)}
                        className="text-zinc-800 hover:text-red-500 transition-colors font-mono text-xs"
                        title="Purge Lab"
                      >
                        [×]
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-600 line-clamp-2 mb-6 font-light leading-relaxed">"{lab.scenario}"</p>
                    <button 
                      onClick={() => setActiveTestMission(lab)}
                      className="w-full py-3 border border-zinc-800 text-[9px] font-mono text-zinc-500 hover:bg-white hover:text-black hover:border-white transition-all uppercase tracking-widest"
                    >
                      Run_Simulation_Uplink
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LabCreator;
