import React, { useState } from 'react';

interface UpgradeViewProps {
  onUpgrade: (plan: 'MONTHLY' | 'ANNUAL') => void;
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ onUpgrade }) => {
  const [billing, setBilling] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');

  const features = [
    { name: 'Mission Access', free: 'Foundational Only', pro: 'All 100+ Advanced Labs' },
    { name: 'Speed Labs', free: 'Limited (25)', pro: 'Infinite Simulations' },
    { name: 'Certifications', free: 'None', pro: '10 Track Certifications' },
    { name: 'Lab Creator', free: 'Locked', pro: 'Create, Share, Deploy' },
    { name: 'Leaderboard', free: 'Public', pro: 'Priority Verified Ranking' },
  ];

  return (
    <div className="p-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-light mb-4 uppercase tracking-tighter">Professional Track</h1>
        <p className="text-zinc-500 max-w-lg mx-auto leading-relaxed text-sm font-light">
          Unlock the full curriculum of the TechTales Labs program and begin earning professional certifications.
        </p>
      </header>

      <div className="flex justify-center mb-12">
        <div className="border border-zinc-800 p-1 flex gap-2 rounded-sm bg-zinc-900/10">
          <button 
            onClick={() => setBilling('MONTHLY')}
            className={`px-8 py-2 text-[10px] font-mono uppercase tracking-widest transition-all ${billing === 'MONTHLY' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Monthly Access
          </button>
          <button 
            onClick={() => setBilling('ANNUAL')}
            className={`px-8 py-2 text-[10px] font-mono uppercase tracking-widest transition-all ${billing === 'ANNUAL' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Annual Program (Best Value)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="border border-zinc-900 p-12 opacity-50 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-4 tracking-widest">Standard</p>
            <p className="text-3xl font-light mb-8">Free</p>
            <ul className="space-y-4 text-xs font-light text-zinc-600">
              <li>• Access to introductory missions</li>
              <li>• Standard Intelligence Hub dashboard</li>
              <li>• Limited speed lab rotation</li>
            </ul>
          </div>
        </div>

        <div className="border border-white p-12 bg-zinc-900/10 relative flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 bg-white text-black text-[8px] font-mono uppercase px-4 py-1.5 tracking-[0.2em]">Verified Professional</div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase mb-4 tracking-widest">Professional</p>
            <div className="mb-8">
              <p className="text-4xl font-light mb-1">
                {billing === 'ANNUAL' ? '$5.00' : '$8.00'}
                <span className="text-xs text-zinc-500 font-mono ml-2 uppercase">/ Month</span>
              </p>
              {billing === 'ANNUAL' && <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-2">Billed as $60 per year</p>}
            </div>
            <ul className="space-y-4 text-xs font-light mb-12">
              <li className="flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                 Full curriculum (100+ Advanced Labs)
              </li>
              <li className="flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                 Professional Track Certifications
              </li>
              <li className="flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                 Unlimited Speed Lab simulation
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                 <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></span>
                 Lab Creator access included
              </li>
            </ul>
          </div>
          <button 
            onClick={() => onUpgrade(billing)}
            className="w-full bg-white text-black py-4 font-mono text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl"
          >
            Initiate Deployment
          </button>
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-16">
        <h3 className="text-center text-xs font-mono text-zinc-600 uppercase mb-12 tracking-[0.4em]">Feature Comparison</h3>
        <table className="w-full text-left text-sm font-light">
          <thead>
            <tr className="border-b border-zinc-900 text-[10px] font-mono text-zinc-800 uppercase tracking-widest">
              <th className="pb-6 font-normal">Sovereignty Toolset</th>
              <th className="pb-6 font-normal">Standard</th>
              <th className="pb-6 font-normal">Professional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {features.map(f => (
              <tr key={f.name} className="hover:bg-zinc-900/10 transition-colors">
                <td className="py-6 text-zinc-300">{f.name}</td>
                <td className="py-6 text-zinc-600">{f.free}</td>
                <td className="py-6 text-white font-medium">{f.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpgradeView;