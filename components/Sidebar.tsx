import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isPremium: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isPremium, isCollapsed, setIsCollapsed, onLogout }) => {
  const menuItems = [
    { label: 'Labs', view: AppView.DASHBOARD, icon: '◈' },
    { label: 'Speed Labs', view: AppView.SPEED_LABS, icon: 'ϟ' }, 
    { label: 'Portfolio', view: AppView.PORTFOLIO, icon: '▣' },
    { label: 'Learn', view: AppView.LEARN, icon: '⚯' }, // Technical Nodes/Intelligence icon
  ];

  return (
    <div className={`border-r border-zinc-800/40 flex flex-col h-screen fixed top-0 left-0 bg-black/95 backdrop-blur-md z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className={`p-8 cursor-pointer flex items-center justify-between ${isCollapsed ? 'px-4' : ''}`} onClick={() => setView(AppView.DASHBOARD)}>
        {!isCollapsed && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-sm font-bold tracking-[0.25em] mb-1 text-zinc-200 uppercase">TechTales Labs</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Operator Console</p>
          </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }} 
          className="text-zinc-500 hover:text-white transition-colors text-xl font-mono p-1"
          title={isCollapsed ? "Expand Navigation" : "Collapse Navigation"}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="flex-1 mt-8">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setView(item.view)}
            title={isCollapsed ? item.label : ''}
            className={`w-full text-left flex items-center gap-4 transition-all duration-200 ${
              currentView === item.view 
                ? 'text-white border-l-2 border-white bg-zinc-900/60' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/20'
            } ${isCollapsed ? 'px-4 py-4 justify-center' : 'px-8 py-4'}`}
          >
            <span className={`text-xl font-mono transition-colors ${currentView === item.view ? 'text-white' : 'text-zinc-600'}`}>
              {item.icon}
            </span>
            {!isCollapsed && <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{item.label}</span>}
          </button>
        ))}
        
        <div className="my-4 border-t border-zinc-900/50" />

        <button
          onClick={() => isPremium ? setView(AppView.LAB_CREATOR) : setView(AppView.UPGRADE)}
          title={isCollapsed ? 'Lab Creator' : ''}
          className={`w-full text-left flex items-center gap-4 transition-all duration-200 ${
            currentView === AppView.LAB_CREATOR 
              ? 'text-white border-l-2 border-white bg-zinc-900/60' 
              : 'text-zinc-500 hover:text-white'
          } ${isCollapsed ? 'px-4 py-4 justify-center' : 'px-8 py-4'} group`}
        >
          <span className={`text-xl font-mono transition-colors ${currentView === AppView.LAB_CREATOR ? 'text-white' : 'text-zinc-600'}`}>✢</span>
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Lab Creator</span>
              {!isPremium && <span className="text-[8px] border border-zinc-600 px-1 text-zinc-500">PRO</span>}
            </div>
          )}
        </button>

        <button
          onClick={() => isPremium ? setView(AppView.RESEARCH) : setView(AppView.UPGRADE)}
          title={isCollapsed ? 'Research Simulator' : ''}
          className={`w-full text-left flex items-center gap-4 transition-all duration-200 ${
            currentView === AppView.RESEARCH 
              ? 'text-white border-l-2 border-white bg-zinc-900/60' 
              : 'text-zinc-500 hover:text-white'
          } ${isCollapsed ? 'px-4 py-4 justify-center' : 'px-8 py-4'} group`}
        >
          <span className={`text-xl font-mono transition-colors ${currentView === AppView.RESEARCH ? 'text-white' : 'text-zinc-600'}`}>⌬</span>
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Research Suite</span>
              {!isPremium && <span className="text-[8px] border border-zinc-600 px-1 text-zinc-500">PRO</span>}
            </div>
          )}
        </button>
      </nav>

      <div className={`p-8 ${isCollapsed ? 'px-4' : ''}`}>
        {!isPremium && !isCollapsed && (
          <button
            onClick={() => setView(AppView.UPGRADE)}
            className="w-full mb-6 border border-zinc-800 py-3 text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-zinc-200 hover:text-black transition-all text-zinc-400 hover:border-zinc-200"
          >
            Unlock Pro
          </button>
        )}
        
        <button 
          onClick={onLogout}
          className="w-full mb-4 text-left group flex items-center gap-4"
        >
          <span className="text-xl font-mono text-zinc-700 group-hover:text-white transition-colors">⏻</span>
          {!isCollapsed && <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-300 uppercase tracking-widest transition-colors">Terminate_Session</span>}
        </button>

        <div className={`border border-zinc-800 p-4 rounded-sm transition-all duration-300 ${isCollapsed ? 'p-2 border-none' : ''}`}>
          {!isCollapsed && <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2 tracking-widest">Operator</p>}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-zinc-300' : 'bg-zinc-700'} animate-pulse`} />
            {!isCollapsed && <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter font-light">{isPremium ? 'PROFESSIONAL' : 'STANDARD'}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;