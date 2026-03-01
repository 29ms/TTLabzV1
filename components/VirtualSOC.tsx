
import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  payload: string;
  severity: 'STABLE' | 'SUSPICIOUS' | 'CRITICAL_DDOS';
}

interface VirtualSOCProps {
  onUpdatePoints: (pts: number) => void;
}

const VirtualSOC: React.FC<VirtualSOCProps> = ({ onUpdatePoints }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isUnplugging, setIsUnplugging] = useState(false);
  const [systemState, setSystemState] = useState<'OPERATIONAL' | 'OFFLINE' | 'REBOOTING'>('OPERATIONAL');
  const [activeDDoS, setActiveDDoS] = useState<string | null>(null);
  const [ddosTimer, setDdosTimer] = useState(8);
  const [companyBudget, setCompanyBudget] = useState(1000000);
  const [budgetChange, setBudgetChange] = useState<{ amount: number; type: 'gain' | 'loss' } | null>(null);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setHistory] = useState<string[]>(['[SYSTEM] SOC_UPLINK_STABLE', '[SYSTEM] MONITORING_PACKET_STREAM...']);
  const [investigatingIP, setInvestigatingIP] = useState<string | null>(null);
  const [investigationTimer, setInvestigationTimer] = useState(0);
  const [threatCounts, setThreatCounts] = useState<Record<string, number>>({});
  const [investigatedIPs, setInvestigatedIPs] = useState<Set<string>>(new Set());

  const logEndRef = useRef<HTMLDivElement>(null);
  const ddosIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const threatIPs = ['103.4.22.1', '192.168.44.9', '45.33.12.8', '5.5.5.5', '1.2.3.4'];
  const benignIPs = ['172.16.0.4', '192.168.1.1', '10.0.0.25', '8.8.8.8'];

  // Handle budget animations
  const triggerBudgetChange = (amount: number, type: 'gain' | 'loss') => {
    setBudgetChange({ amount, type });
    setCompanyBudget(prev => type === 'gain' ? prev + amount : prev - amount);
    setTimeout(() => setBudgetChange(null), 3000);
  };

  useEffect(() => {
    if (systemState !== 'OPERATIONAL') return;
    const interval = setInterval(() => {
      const isCritical = Math.random() > 0.97 && !activeDDoS;
      const isSus = Math.random() > 0.88;
      const source = isSus || isCritical 
        ? threatIPs[Math.floor(Math.random() * threatIPs.length)]
        : benignIPs[Math.floor(Math.random() * benignIPs.length)];
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        source: source,
        payload: isCritical ? '!! VOLUMETRIC_DDOS_DETECTION !!' : isSus ? 'ANOMALOUS_HEARTBEAT' : 'ENCRYPTED_TUNNEL_LINK',
        severity: isCritical ? 'CRITICAL_DDOS' : isSus ? 'SUSPICIOUS' : 'STABLE',
      };

      setLogs(prev => [...prev.slice(-40), newLog]);
      if (isSus || isCritical) {
        setThreatCounts(prev => ({ ...prev, [source]: (prev[source] || 0) + 1 }));
      }

      if (isCritical) {
        setActiveDDoS(source);
        setDdosTimer(8);
        setHistory(prev => [...prev, `[!!!] DDoS ALERT: SOURCE ${source}. 8 SECONDS TO SYSTEM COLLAPSE.`]);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [systemState, activeDDoS]);

  useEffect(() => {
    if (activeDDoS && ddosTimer > 0) {
      ddosIntervalRef.current = setTimeout(() => {
        setDdosTimer(prev => prev - 1);
        setCompanyBudget(prev => prev - 1500); // Passive bleed
      }, 1000);
    } else if (activeDDoS && ddosTimer === 0) {
      setHistory(prev => [...prev, `[CRITICAL] SYSTEM_OVERLOAD: DDoS FROM ${activeDDoS} CAUSED INFRASTRUCTURE FAILURE.`]);
      triggerBudgetChange(200000, 'loss');
      onUpdatePoints(-1500);
      setSystemState('OFFLINE');
      setTimeout(() => {
        setSystemState('REBOOTING');
        setActiveDDoS(null);
      }, 4000);
    }
    return () => { if (ddosIntervalRef.current) clearTimeout(ddosIntervalRef.current); };
  }, [activeDDoS, ddosTimer]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const input = terminalInput.trim().toLowerCase();
    setTerminalInput('');
    if (!input) return;

    const [cmd, ip] = input.split(' ');
    setHistory(prev => [...prev, `> ${input}`]);

    if (cmd === 'block') {
      const isThreat = logs.find(l => l.source === ip && l.severity !== 'STABLE');
      if (isThreat) {
        const reward = isThreat.severity === 'CRITICAL_DDOS' ? 200 : 50;
        setHistory(prev => [...prev, `[SUCCESS] IP ${ip} BLOCKED.`]);
        onUpdatePoints(reward);
        setLogs(prev => prev.filter(l => l.source !== ip));
        if (isThreat.severity === 'CRITICAL_DDOS') setActiveDDoS(null);
      } else {
        const loss = Math.floor(Math.random() * 2000) + 1000;
        setHistory(prev => [...prev, `[ERR] MISBLOCK: $${loss.toLocaleString()} LOSS.`]);
        triggerBudgetChange(loss, 'loss');
        onUpdatePoints(-50);
      }
    } else if (cmd === 'investigate') {
      if (!ip) {
        setHistory(prev => [...prev, `[ERR] USAGE: investigate [IP]`]);
        return;
      }
      setInvestigatingIP(ip);
      setInvestigationTimer(100);
      const timer = setInterval(() => {
        setInvestigationTimer(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            finishInvestigation(ip);
            return 0;
          }
          return prev - 1;
        });
      }, 20); // 20ms * 100 = 2000ms (2 seconds)
    } else {
      setHistory(prev => [...prev, `[ERR] UNKNOWN_COMMAND: ${cmd}.`]);
    }
  };

  const finishInvestigation = (ip: string) => {
    setInvestigatingIP(null);
    const count = threatCounts[ip] || 0;
    
    if (count > 1 || activeDDoS === ip) {
      const bonus = activeDDoS === ip ? 80000 : 15000;
      setHistory(prev => [...prev, `[INTEL] THREAT_CONFIRMED: ${ip}. BONUS $${bonus.toLocaleString()}.`]);
      triggerBudgetChange(bonus, 'gain');
      setInvestigatedIPs(new Set([...investigatedIPs, ip]));
      onUpdatePoints(150);
    } else {
      const cost = 25000;
      setHistory(prev => [...prev, `[INTEL] CLEAN_IP: ${ip}. RESEARCH COST $${cost.toLocaleString()}.`]);
      triggerBudgetChange(cost, 'loss');
      onUpdatePoints(-100);
    }
  };

  const handleUnplug = () => {
    setIsUnplugging(true);
    // Unplug takes 2 seconds
    setTimeout(() => {
      setSystemState('OFFLINE');
      setIsUnplugging(false);
      
      if (activeDDoS) {
        const wasInvestigated = investigatedIPs.has(activeDDoS);
        const bonus = wasInvestigated ? 250000 : 100000;
        setHistory(prev => [...prev, `[SUCCESS] CORE PROTECTED. REWARD $${bonus.toLocaleString()}.`]);
        onUpdatePoints(wasInvestigated ? 1200 : 600);
        triggerBudgetChange(bonus, 'gain');
        setActiveDDoS(null);
      } else {
        setHistory(prev => [...prev, '[ERR] ACCIDENTAL_OUTAGE: $200,000 LOSS.']);
        triggerBudgetChange(200000, 'loss');
        onUpdatePoints(-1000);
      }

      setTimeout(() => {
        setSystemState('REBOOTING');
        setTimeout(() => {
          setSystemState('OPERATIONAL');
          setLogs([]);
          setThreatCounts({});
          setInvestigatedIPs(new Set());
        }, 3000);
      }, 3000);
    }, 2000);
  };

  if (systemState !== 'OPERATIONAL') {
    return (
      <div className="h-[650px] bg-black flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className={`w-3 h-3 rounded-full ${systemState === 'OFFLINE' ? 'bg-red-900 animate-ping' : 'bg-zinc-500 animate-pulse'}`}></div>
        </div>
        <div className="space-y-4 text-center">
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-[0.8em]">{systemState === 'OFFLINE' ? 'HARDWARE_LINK_SEVERED' : 'SYNCHRONIZING_KERNEL...'}</p>
          {systemState === 'OFFLINE' && <p className="text-red-600 font-mono text-[10px] uppercase tracking-widest animate-pulse">Critical Network Damage Detected</p>}
        </div>
        {systemState === 'REBOOTING' && (
          <div className="w-64 h-[1px] bg-zinc-900 overflow-hidden relative">
            <div className="absolute h-full bg-white w-full animate-[reboot_3s_linear_forwards]" />
          </div>
        )}
        <style>{`@keyframes reboot { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }`}</style>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Budget Change Indicator Overlay */}
      {budgetChange && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-none animate-in fade-out zoom-in slide-in-from-bottom-12 duration-1000 fill-mode-forwards">
          <div className={`text-6xl font-light tracking-tighter ${budgetChange.type === 'gain' ? 'text-green-500' : 'text-red-500'} drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
            {budgetChange.type === 'gain' ? '+' : '-'}${budgetChange.amount.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-center uppercase tracking-[0.4em] mt-4 text-white opacity-80">
            {budgetChange.type === 'gain' ? 'Corporate Bounty Awarded' : 'Infrastructure Damage Cost'}
          </div>
        </div>
      )}

      {/* High Fidelity Wire Unplug Overlay */}
      {isUnplugging && (
        <div className="fixed inset-0 z-[400] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="relative w-80 h-96 border border-zinc-900 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Socket Backplate */}
            <div className="w-40 h-40 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-center shadow-inner">
               <div className="w-16 h-16 bg-black rounded-lg border-b-4 border-zinc-800 flex flex-col items-center justify-center gap-2">
                 <div className="w-10 h-1 bg-zinc-900"></div>
                 <div className="w-10 h-1 bg-zinc-900"></div>
               </div>
            </div>

            {/* The RJ45 Cable & Plug */}
            <div className="absolute flex flex-col items-center animate-[unplug_2s_cubic-bezier(.76,0,.24,1)_forwards]">
               <div className="w-20 h-32 bg-zinc-800 rounded-t-xl border-x-2 border-zinc-700 relative shadow-2xl">
                 {/* Clip */}
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-8 bg-zinc-700 rounded-sm"></div>
                 {/* Pins */}
                 <div className="flex justify-center gap-1 mt-2">
                   {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-3 bg-yellow-600/50"></div>)}
                 </div>
               </div>
               {/* Massive Wire */}
               <div className="w-8 h-[1000px] bg-gradient-to-b from-zinc-800 to-black rounded-full"></div>
            </div>
            
            <p className="mt-80 text-[11px] font-mono text-white tracking-[0.8em] animate-pulse">EMERGENCY_PHYSICAL_SEVERANCE</p>
          </div>
          <style>{`
            @keyframes unplug {
              0% { transform: translateY(-160px); }
              20% { transform: translateY(-170px); } /* Initial pull resistance */
              100% { transform: translateY(800px); }
            }
          `}</style>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col justify-center relative group overflow-hidden h-32">
          <div className="absolute inset-0 bg-white/[0.01] pointer-events-none group-hover:bg-white/[0.03] transition-colors"></div>
          <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest mb-1">Corporate_Capital</span>
          <p className={`text-4xl font-light tracking-tighter ${companyBudget < 300000 ? 'text-red-500 animate-pulse' : 'text-zinc-100'} transition-colors`}>
            ${companyBudget.toLocaleString()}
          </p>
        </div>
        <div className={`border p-8 flex flex-col justify-center relative overflow-hidden transition-all duration-500 h-32 ${activeDDoS ? 'bg-red-950/20 border-red-500' : 'bg-zinc-950 border-zinc-900'}`}>
          <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest mb-1">Detection_Status</span>
          <div className="flex items-center gap-6">
            <p className={`text-3xl font-light tracking-tight ${activeDDoS ? 'text-red-500 animate-pulse' : 'text-zinc-200'}`}>
              {activeDDoS ? `DDoS [${ddosTimer}s]` : 'OPERATIONAL'}
            </p>
            {activeDDoS && (
              <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(ddosTimer/8)*100}%` }}></div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col justify-center h-32">
          <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest mb-1">Intel_Buffer</span>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(threatCounts).slice(-4).map(ip => (
              <span key={ip} className={`text-[9px] font-mono px-2 py-0.5 border ${investigatedIPs.has(ip) ? 'border-zinc-100 text-zinc-100' : 'border-zinc-800 text-zinc-700'}`}>
                {ip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
        {/* Packet Stream Panel - Fully Scrollable without pushing layout */}
        <div className="lg:col-span-2 border border-zinc-900 bg-zinc-950/40 flex flex-col h-full overflow-hidden shadow-inner">
          <div className="p-4 border-b border-zinc-900 flex justify-between bg-zinc-950 z-10">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Network_Ingress_Stream</span>
            <div className={`w-1.5 h-1.5 rounded-full ${activeDDoS ? 'bg-red-500 animate-ping' : 'bg-green-900/40'}`} />
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1.5 custom-scrollbar">
            {logs.map(log => (
              <div 
                key={log.id} 
                className={`p-2 flex gap-4 transition-all border border-transparent ${log.severity === 'CRITICAL_DDOS' ? 'text-red-500 bg-red-950/10 border-red-900/30' : log.severity === 'SUSPICIOUS' ? 'text-zinc-400' : 'text-zinc-700'}`}
              >
                <span className="opacity-30">[{log.timestamp}]</span>
                <span className="w-24 shrink-0">{log.source}</span>
                <span className="flex-1 truncate">{log.payload}</span>
                {investigatedIPs.has(log.source) && <span className="text-[8px] text-zinc-200 border border-zinc-200 px-1">CONFIRMED</span>}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 border border-zinc-900 bg-black flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Command_Relay_v9</span>
              {investigatingIP && (
                <div className="flex items-center gap-3">
                   <span className="text-[9px] font-mono text-zinc-500">ANALYZING {investigatingIP}</span>
                   <div className="w-16 h-1 bg-zinc-900 overflow-hidden">
                     <div className="h-full bg-zinc-300 transition-all duration-100" style={{ width: `${100 - investigationTimer}%` }}></div>
                   </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] text-zinc-600 space-y-1.5 custom-scrollbar">
               {terminalHistory.map((line, i) => (
                 <div key={i} className="animate-in fade-in duration-300 select-none">&gt; {line}</div>
               ))}
            </div>

            <form onSubmit={handleCommand} className="p-4 bg-zinc-950 border-t border-zinc-900 flex gap-4 items-center">
              <span className="text-zinc-700 font-mono text-sm font-bold">@SOC:~$</span>
              <input 
                autoFocus
                type="text" 
                placeholder="block [IP] | investigate [IP]"
                className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-xs placeholder:text-zinc-800"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
              />
            </form>
          </div>

          <div className={`border p-8 flex flex-col justify-between transition-all duration-1000 h-44 relative overflow-hidden ${activeDDoS ? 'bg-red-950/20 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-zinc-950 border-zinc-900 opacity-60 hover:opacity-100'}`}>
            <div>
              <h3 className="text-[10px] font-mono text-zinc-700 uppercase mb-2 tracking-[0.4em]">Infrastructure_Killswitch</h3>
              <p className="text-[9px] font-mono text-zinc-800 leading-tight uppercase">
                {activeDDoS ? 'CRITICAL: VOLUMETRIC_FLOOD_IN_PROGRESS. MANUAL_DECOUPLING_REQUIRED.' : 'READY: MONITORING_LOCAL_NODE_HEALTH.'}
              </p>
            </div>
            
            <button 
              onClick={handleUnplug}
              className={`w-full py-4 text-[11px] font-mono uppercase tracking-[0.6em] transition-all border ${activeDDoS ? 'bg-red-500 text-white border-white animate-pulse' : 'bg-transparent text-zinc-800 border-zinc-800 hover:text-zinc-300 hover:border-zinc-500'}`}
            >
              Sever_Physical_Link
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default VirtualSOC;
