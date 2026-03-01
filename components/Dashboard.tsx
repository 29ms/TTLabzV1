
import React, { useState, useEffect } from 'react';
import { UserMetrics, Mission, AppView, LabTrack, DashboardSubView } from '../types';
import VirtualSOC from './VirtualSOC';
import NeuralBuilder from './NeuralBuilder';

interface DashboardProps {
  metrics: UserMetrics;
  missions: Mission[];
  onSelectMission: (id: string) => void;
  setView: (view: AppView) => void;
  onClearPathway: () => void;
  snowToggle: () => void;
  isSnowing: boolean;
  onUpdatePoints: (pts: number) => void;
  // Added onUpdateName to satisfy NeuralBuilderProps requirements
  onUpdateName: (name: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  metrics, missions, onSelectMission, setView, onClearPathway, snowToggle, isSnowing, onUpdatePoints, onUpdateName 
}) => {
  const [selectedTrack, setSelectedTrack] = useState<LabTrack | 'ALL'>(metrics.activePathway || 'ALL');
  const [subView, setSubView] = useState<DashboardSubView>(DashboardSubView.INTEL_HUB);

  useEffect(() => {
    if (metrics.activePathway) setSelectedTrack(metrics.activePathway);
  }, [metrics.activePathway]);

  const tracks: { id: LabTrack; label: string }[] = [
    { id: 'LIFE', label: 'Real Life Safety' },
    { id: 'SOVEREIGNTY', label: 'Digital Footprint' },
    { id: 'DEFENDER', label: 'Security Analyst' },
    { id: 'EXECUTIVE', label: 'Tech Leadership' },
    { id: 'INTEL', label: 'OSINT Intelligence' },
    { id: 'ETHICS', label: 'AI & Society' },
  ];

  const filteredMissions = selectedTrack === 'ALL' 
    ? missions 
    : missions.filter(m => m.track === selectedTrack);

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-1000 pb-32 h-screen flex flex-col overflow-hidden">
      <header className="mb-8 border-b border-zinc-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 shrink-0">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl font-light tracking-tighter uppercase text-zinc-100">Intelligence_Ops</h1>
            {selectedTrack !== 'ALL' && subView === DashboardSubView.INTEL_HUB && (
              <button 
                onClick={() => { onClearPathway(); setSelectedTrack('ALL'); }}
                className="text-[9px] font-mono text-zinc-400 hover:text-zinc-100 uppercase border border-zinc-800 px-3 py-1 tracking-widest transition-all"
              >
                Clear_Filter [x]
              </button>
            )}
          </div>
          <div className="flex gap-8 items-center">
            <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
              {metrics.labsCompleted} VERIFIED / {metrics.points.toLocaleString()} POINTS
            </p>
            <div className="h-[1px] w-8 bg-zinc-800" />
            <button 
              onClick={snowToggle}
              className={`text-[9px] font-mono uppercase tracking-[0.2em] transition-colors ${isSnowing ? 'text-white' : 'text-zinc-700 hover:text-zinc-300'}`}
            >
              [ {isSnowing ? 'DISABLE_SNOW' : 'ENABLE_SNOW'} ]
            </button>
          </div>
        </div>

        <nav className="flex bg-zinc-950 border border-zinc-900 p-1">
          {[
            { id: DashboardSubView.INTEL_HUB, label: 'Intel_Hub' },
            { id: DashboardSubView.VIRTUAL_SOC, label: 'Security_SOC' },
            { id: DashboardSubView.NEURAL_OPS, label: 'Intelligence_Lab' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setSubView(view.id)}
              className={`px-6 py-3 text-[10px] font-mono uppercase tracking-widest transition-all relative ${subView === view.id ? 'bg-zinc-100 text-black' : 'text-zinc-400 hover:text-zinc-100'}`}
            >
              {view.label}
              {view.id === DashboardSubView.NEURAL_OPS && !metrics.isPremium && (
                <span className="ml-2 text-[8px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded-sm">LOCKED</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {subView === DashboardSubView.INTEL_HUB && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => { onClearPathway(); setSelectedTrack('ALL'); }}
                className={`text-[10px] font-mono px-4 py-2 border transition-all ${selectedTrack === 'ALL' ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-inner' : 'border-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}`}
              >
                ALL_MODULES
              </button>
              {tracks.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  className={`text-[10px] font-mono px-4 py-2 border transition-all ${selectedTrack === t.id ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-inner' : 'border-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}`}
                >
                  {t.id}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
              {filteredMissions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => onSelectMission(mission.id)}
                  className={`text-left border border-zinc-900 p-10 hover:bg-zinc-900/20 transition-all duration-700 group flex flex-col justify-between h-[300px] ${mission.completed ? 'opacity-30' : ''}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-10">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">[{mission.track}]</span>
                      {mission.premium && !metrics.isPremium && (
                         <span className="text-[8px] font-mono uppercase bg-zinc-900 border border-zinc-800 px-3 py-1 text-zinc-400">PRO_ACCESS</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-light mb-4 group-hover:tracking-tight transition-all text-zinc-100 uppercase leading-tight">{mission.title}</h3>
                    <p className="text-zinc-400 text-[13px] leading-relaxed line-clamp-2 font-light">{mission.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-100 transition-all pt-6 border-t border-zinc-800">
                    <span>{mission.completed ? 'VERIFIED' : 'INITIATE'}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {subView === DashboardSubView.VIRTUAL_SOC && <VirtualSOC onUpdatePoints={onUpdatePoints} />}
        
        {subView === DashboardSubView.NEURAL_OPS && (
          <div className="h-full">
            {!metrics.isPremium ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-8 animate-in zoom-in-95 duration-700">
                <div className="w-20 h-20 border border-zinc-800 flex items-center justify-center text-4xl text-zinc-600">✢</div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-light text-zinc-100 uppercase tracking-tighter">Intelligence Lab Locked</h2>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                    The advanced Red Team and Blue Team technical training modules are exclusive to Professional Grade operatives.
                  </p>
                </div>
                <button 
                  onClick={() => setView(AppView.UPGRADE)}
                  className="bg-zinc-100 text-black px-12 py-4 font-mono text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                >
                  Unlock Access
                </button>
              </div>
            ) : (
              <NeuralBuilder 
                isPremium={metrics.isPremium} 
                // Fix: Added missing operatorName and onUpdateOperatorName properties
                operatorName={metrics.operatorName || ''}
                onUpdateOperatorName={onUpdateName}
                onComplete={() => {
                  onUpdatePoints(500); 
                }} 
                onExit={() => setSubView(DashboardSubView.INTEL_HUB)} 
              />
            )}
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
