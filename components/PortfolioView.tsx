import React, { useState } from 'react';
import { UserMetrics, Mission, PortfolioTab, Certification, LabTrack, AppView, UserCertificate } from '../types';
import { CERTIFICATIONS } from '../constants';
import { certificateService } from '../services/certificateService';

interface PortfolioViewProps {
  metrics: UserMetrics;
  missions: Mission[];
  onUpdateName: (name: string) => void;
  onActivatePathway: (track: LabTrack) => void;
  onSelectMission: (id: string) => void;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ 
  metrics, missions, onUpdateName, onActivatePathway, onSelectMission, setView, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<PortfolioTab>(PortfolioTab.CERTIFICATIONS);
  const [viewingTrack, setViewingTrack] = useState<LabTrack | null>(null);
  const [tempName, setTempName] = useState(metrics.operatorName || '');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim().length > 2) {
      setIsUpdating(true);
      setTimeout(() => {
        onUpdateName(tempName.trim());
        setIsUpdating(false);
      }, 800);
    }
  };

  const handleDownloadPastCert = async (cert: UserCertificate) => {
    if (!metrics.operatorName) {
      alert("Identity Check Failed: Please link your name in Account settings first.");
      return;
    }

    setIsDownloading(cert.id);
    try {
      await certificateService.generateCertificate({
        fullName: metrics.operatorName,
        title: cert.title,
        theater: cert.theater,
        serial: cert.serial,
        issuedAt: cert.issuedAt
      });
    } catch (e) {
      console.error("Accreditation synthesis failed", e);
    } finally {
      setIsDownloading(null);
    }
  };

  const renderPathwayDetails = (track: LabTrack) => {
    const trackMissions = missions.filter(m => m.track === track);
    let foundFirstIncomplete = false;

    return (
      <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 max-w-2xl pb-40">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-6">
           <button 
             onClick={() => setViewingTrack(null)}
             className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-widest transition-all"
           >
             ← Return to Sequence Map
           </button>
           <h3 className="text-[10px] font-mono text-zinc-100 uppercase tracking-[0.4em] font-bold">[{track}] MISSION_LOG</h3>
        </div>

        <div className="relative pl-12 space-y-16">
          <div className="absolute left-[23px] top-6 bottom-48 w-[1px] bg-zinc-900" />
          
          {trackMissions.map((mission, idx) => {
            const isCompleted = mission.completed;
            const isLocked = foundFirstIncomplete;
            if (!isCompleted && !foundFirstIncomplete) {
              foundFirstIncomplete = true;
            }
            
            const isOpen = !isCompleted && !isLocked;

            return (
              <div key={mission.id} className="relative group">
                <div className={`absolute -left-[45px] top-1.5 w-8 h-8 rounded-full border bg-black z-10 flex items-center justify-center transition-all duration-700 ${
                  isCompleted ? 'border-zinc-300 bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 
                  isOpen ? 'border-zinc-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 
                  'border-zinc-900 bg-zinc-950'
                }`}>
                  <span className={`text-[10px] font-mono ${isCompleted ? 'text-black font-bold' : isOpen ? 'text-white animate-pulse' : 'text-zinc-800'}`}>
                    {isCompleted ? '✓' : idx + 1}
                  </span>
                </div>
                
                <div 
                  onClick={() => isOpen && onSelectMission(mission.id)}
                  className={`relative overflow-hidden border p-8 transition-all duration-700 rounded-[2rem] ${
                    isCompleted ? 'border-zinc-900 opacity-60 bg-zinc-950/20' : 
                    isOpen ? 'border-zinc-700 bg-zinc-900/10 cursor-pointer hover:bg-zinc-800/20 hover:border-white shadow-xl' : 
                    'border-zinc-900 opacity-20 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Node_0{idx + 1}</span>
                    <span className={`text-[9px] font-mono uppercase tracking-widest ${isCompleted ? 'text-white' : isOpen ? 'text-zinc-100' : 'text-zinc-700'}`}>
                      {isCompleted ? 'Clearance Granted' : isLocked ? 'Encrypted' : 'Uplink Ready'}
                    </span>
                  </div>
                  <h4 className={`text-xl font-light uppercase tracking-tight ${isCompleted ? 'text-zinc-300' : 'text-white'}`}>{mission.title}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (viewingTrack) return renderPathwayDetails(viewingTrack);

    switch (activeTab) {
      case PortfolioTab.CERTIFICATIONS:
        return (
          <div className="space-y-24 animate-in fade-in pb-40">
            {!metrics.operatorName && (
              <div className="border border-zinc-900 bg-zinc-950/40 p-16 text-center space-y-10 relative overflow-hidden group rounded-[3rem] shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-light uppercase tracking-tighter text-white">Identity Link Protocol</h3>
                  <p className="text-sm font-light text-zinc-400 max-w-lg mx-auto leading-relaxed">
                    Certifications require your real name for verification. Please enter it to unlock the vault.
                  </p>
                </div>
                <form onSubmit={handleNameSubmit} className="max-w-xs mx-auto space-y-6 relative z-10">
                  <input 
                    type="text" 
                    placeholder="YOUR FULL NAME"
                    className="w-full bg-black border border-zinc-800 p-5 text-center font-mono text-xs tracking-[0.3em] outline-none focus:border-white text-white placeholder:text-zinc-800 transition-all uppercase rounded-[2rem]"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                  />
                  <button className="w-full bg-white text-black py-5 font-mono text-xs uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-xl active:scale-95 rounded-[2rem] font-bold">Verify Identity</button>
                </form>
              </div>
            )}

            {metrics.earnedCertificates.length > 0 && (
              <section className="animate-in fade-in duration-1000">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-900 pb-10">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.6em] block mb-2 font-bold">Verified Archives</span>
                    <h2 className="text-4xl font-light text-white uppercase tracking-tighter">Credential Vault</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-white uppercase tracking-widest border border-zinc-800 px-4 py-1.5 rounded-full inline-block">ID: {metrics.operatorName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {metrics.earnedCertificates.map((cert) => (
                    <div 
                      key={cert.id} 
                      className={`relative border p-10 bg-zinc-950 transition-all duration-500 overflow-hidden group rounded-[3rem] flex flex-col justify-between min-h-[360px] shadow-2xl border-zinc-900 hover:border-zinc-500`}
                    >
                      <div className={`absolute top-0 right-0 px-8 py-3 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-black bg-white shadow-lg`}>
                        {cert.theater} Mastery
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.5em] block font-bold">Serial: {cert.serial}</span>
                          <h4 className="text-4xl font-light text-white uppercase tracking-tighter leading-tight">{cert.title}</h4>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest border-l-2 border-zinc-800 pl-4">Verified Technical Document</p>
                      </div>

                      <div className="space-y-8 mt-12">
                        <div className="flex justify-between items-end border-t border-zinc-900 pt-8">
                           <div className="space-y-1">
                             <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Issued At</span>
                             <p className="text-xs text-zinc-100 uppercase font-light tracking-wide">{cert.issuedAt}</p>
                           </div>
                           <button 
                            onClick={() => handleDownloadPastCert(cert)}
                            disabled={isDownloading === cert.id || !metrics.operatorName}
                            className="bg-white text-black px-8 py-4 border border-white hover:bg-zinc-200 transition-all font-mono text-[9px] font-bold uppercase tracking-widest disabled:opacity-20 rounded-[2rem] shadow-xl active:scale-95"
                          >
                            {isDownloading === cert.id ? 'Loading...' : 'Download Intel'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${!metrics.operatorName ? 'opacity-30 pointer-events-none' : ''}`}>
              {CERTIFICATIONS.filter(c => c.level === 'ELITE' && c.track !== 'AI_ENGINEERING').map(cert => {
                const labsInTrack = missions.filter(m => m.track === cert.track && m.completed).length;
                const isUnlocked = labsInTrack >= cert.requiredLabs && metrics.points >= cert.requiredPoints;
                const isActive = metrics.activePathway === cert.track;
                
                return (
                  <div key={cert.id} className={`group relative border h-[520px] p-12 flex flex-col justify-between transition-all duration-700 rounded-[3rem] ${isUnlocked ? 'border-zinc-500 bg-zinc-900/10' : 'border-zinc-900 bg-zinc-950/10'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] pointer-events-none rounded-bl-full"></div>
                    <div>
                      <div className="flex justify-between items-start mb-12">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.5em] font-bold">[{cert.track} Core]</span>
                        {isUnlocked && <span className="text-[9px] font-mono text-black bg-white px-4 py-2 font-bold uppercase tracking-widest rounded-sm shadow-lg">Unlocked</span>}
                      </div>
                      <h3 className="text-5xl font-light text-white uppercase leading-tight tracking-tighter duration-700 group-hover:tracking-normal">{cert.name}</h3>
                      <p className="text-sm text-zinc-400 mt-6 font-light leading-relaxed">Elite performance track and technical accreditation program.</p>
                    </div>
                    
                    <div className="space-y-10">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono mb-4 uppercase text-zinc-300 tracking-[0.2em] font-bold">
                          <span className="group-hover:text-white transition-colors">Synchronization</span>
                          <span className="text-white">{labsInTrack} / {cert.requiredLabs} Nodes</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-[2px] rounded-full relative overflow-hidden">
                          <div className="bg-white h-full relative transition-all duration-1000 shadow-[0_0_10px_white]" style={{width: `${Math.min(100, (labsInTrack/cert.requiredLabs)*100)}%`}} />
                        </div>
                      </div>

                      <button 
                        onClick={() => { onActivatePathway(cert.track); setViewingTrack(cert.track); }}
                        className={`w-full py-5 font-mono text-[11px] font-bold uppercase tracking-[0.4em] transition-all border duration-500 rounded-[2rem] ${isActive ? 'bg-white text-black border-white shadow-xl' : 'border-zinc-800 text-zinc-400 hover:border-white hover:text-white'}`}
                      >
                        {isActive ? 'Continue Sync' : 'Start Sequence'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case PortfolioTab.PROFILE:
        return (
          <div className="space-y-16 animate-in fade-in pb-32">
            <div className="border border-zinc-900 p-16 bg-zinc-950 relative overflow-hidden rounded-[3rem] shadow-2xl">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
              <h3 className="text-[10px] font-mono text-zinc-400 uppercase mb-16 tracking-[0.8em] text-center border-b border-zinc-900 pb-8 font-bold">Neural_Skill_Map</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-12 relative z-10">
                {Object.entries(metrics.trackProgress).map(([k, v]) => (
                  <div key={k} className="space-y-6 text-center group">
                    <span className="text-[10px] font-mono text-zinc-100 uppercase tracking-widest font-bold group-hover:text-white transition-colors">{k}</span>
                    <div className="relative">
                      <p className="text-5xl font-light text-white transition-transform group-hover:scale-110 duration-700 tracking-tighter">{Math.floor(v as number)}</p>
                      <div className="w-10 h-[1px] bg-zinc-800 mx-auto mt-6 group-hover:w-16 group-hover:bg-white transition-all duration-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case PortfolioTab.ACCOUNT:
        return (
          <div className="max-w-4xl space-y-16 animate-in fade-in pb-32">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <div className="space-y-12">
                  <header className="space-y-2">
                    <h3 className="text-[10px] font-mono text-zinc-100 uppercase tracking-[0.5em] font-bold">Operator Identity</h3>
                    <p className="text-xs font-light text-zinc-400">Secure your public identifier for accreditation.</p>
                  </header>

                  <form onSubmit={handleNameSubmit} className="space-y-8 bg-zinc-950/40 p-10 border border-zinc-900 rounded-[2.5rem] shadow-xl">
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold ml-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-black border border-zinc-800 p-5 text-white font-mono text-xs tracking-widest rounded-[2rem] outline-none focus:border-white transition-all uppercase placeholder:text-zinc-900"
                        placeholder="NAME"
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                      />
                      <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest ml-1">Current: {metrics.operatorName || 'NOT_LINKED'}</p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isUpdating || tempName === metrics.operatorName || tempName.length < 3}
                      className="w-full bg-white text-black py-4 rounded-[2rem] font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-20 shadow-lg active:scale-95"
                    >
                      {isUpdating ? 'Saving...' : 'Update Record'}
                    </button>
                  </form>
               </div>

               <div className="space-y-12">
                  <header className="space-y-2">
                    <h3 className="text-[10px] font-mono text-zinc-100 uppercase tracking-[0.5em] font-bold">Clearance Grade</h3>
                    <p className="text-xs font-light text-zinc-400">Current authentication level within the matrix.</p>
                  </header>

                  <div className="bg-zinc-950/40 p-10 border border-zinc-900 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="w-16 h-16 border border-zinc-800 rounded-full flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
                      {metrics.isPremium ? '◈' : '◇'}
                    </div>
                    <div>
                      <h4 className="text-4xl font-light text-white uppercase tracking-tighter leading-none mb-2">
                        {metrics.isPremium ? 'Professional' : 'Standard'}
                      </h4>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Access Sequence Alpha</p>
                    </div>
                    {!metrics.isPremium && (
                      <button 
                        onClick={() => setView(AppView.UPGRADE)}
                        className="text-[9px] font-mono text-white underline underline-offset-8 hover:text-zinc-200 transition-colors uppercase tracking-[0.2em]"
                      >
                        Elevate Level
                      </button>
                    )}
                  </div>
               </div>
             </div>

             <div className="border-t border-zinc-900 pt-16">
               <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                 <div className="max-w-md space-y-8">
                   <div className="space-y-2">
                    <h3 className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest font-bold">Account Session</h3>
                    <p className="text-xs font-light text-zinc-400">Logout to terminate the secure uplink and clear local buffer.</p>
                   </div>
                   <button 
                    onClick={onLogout}
                    className="flex items-center gap-3 border border-red-900/20 text-red-500 hover:bg-red-600 hover:text-white transition-all px-8 py-4 rounded-[2rem] font-mono text-xs uppercase tracking-widest"
                   >
                     <span className="text-xl">⏻</span>
                     Terminate Session
                   </button>
                 </div>
                 <div className="flex gap-4">
                    <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-[2rem] text-center min-w-[140px]">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1 tracking-widest">Total Points</span>
                      <span className="text-2xl font-light text-white">{metrics.points.toLocaleString()}</span>
                    </div>
                    <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-[2rem] text-center min-w-[140px]">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1 tracking-widest">Labs Clear</span>
                      <span className="text-2xl font-light text-white">{metrics.labsCompleted}</span>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="p-8 md:p-16 lg:p-24 max-w-7xl mx-auto space-y-24">
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white mb-6 leading-none animate-in fade-in duration-1000">Identity Portfolio</h1>
          <div className="flex items-center gap-6">
            <div className="h-[1px] w-20 bg-zinc-800" />
            <p className="text-zinc-100 text-[11px] font-mono uppercase tracking-[0.6em] font-bold">Certification Authority</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.4em]">Node_Status: Encrypted // Matrix: 4.2.0</p>
        </div>
      </header>

      <nav className="flex flex-wrap gap-12 border-b border-zinc-900 pb-8 overflow-x-auto scrollbar-hide">
        {Object.values(PortfolioTab).filter(t => t !== PortfolioTab.SETTINGS).map(tab => (
          <button 
            key={tab} 
            onClick={() => { setActiveTab(tab); setViewingTrack(null); }} 
            className={`text-[11px] font-mono font-bold uppercase tracking-[0.5em] transition-all relative py-4 whitespace-nowrap ${activeTab === tab && !viewingTrack ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`}
          >
            {tab.replace('_', ' ')}
            {activeTab === tab && !viewingTrack && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white animate-in fade-in shadow-[0_0_15px_white]" />
            )}
          </button>
        ))}
      </nav>

      <div className="min-h-[700px] animate-in fade-in duration-700">
        {renderContent()}
      </div>
    </div>
  );
};

export default PortfolioView;
