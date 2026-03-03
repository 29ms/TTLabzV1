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
    { label: 'Dashboard', view: AppView.DASHBOARD, icon: '◈' },
    { label: 'Portfolio', view: AppView.PORTFOLIO, icon: '▣' },
    { label: 'Learning Library', view: AppView.LEARN, icon: '⚯' },
  ];

  return (
    <aside className={`border-r border-zinc-800/60 fixed top-0 left-0 h-screen bg-zinc-950/95 backdrop-blur z-50 transition-all duration-200 ease-out ${isCollapsed ? 'w-16' : 'w-72'}`}>
      <div className={`p-6 flex items-center justify-between ${isCollapsed ? 'px-4' : ''}`}>
        {!isCollapsed && (
          <div>
            <h1 className="text-[20px] font-semibold text-zinc-100">TechTales Labs</h1>
            <p className="text-[15px] text-zinc-500">Project Workspace</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-500 hover:text-white text-xl p-1 transition-colors duration-200 ease-out"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setView(item.view)}
            title={isCollapsed ? item.label : ''}
            className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 ease-out ${
              currentView === item.view
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            } ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3 text-left'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="text-[15px] font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="mx-3 my-4 border-t border-zinc-800" />

      <div className="px-3 space-y-1">
        <button
          onClick={() => isPremium ? setView(AppView.LAB_CREATOR) : setView(AppView.UPGRADE)}
          title={isCollapsed ? 'Project Builder' : ''}
          className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 ease-out ${
            currentView === AppView.LAB_CREATOR
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
          } ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3 text-left'}`}
        >
          <span className="text-xl">✢</span>
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[15px] font-medium">Project Builder</span>
              {!isPremium && <span className="text-[10px] border border-zinc-600 text-zinc-500 px-1">PRO</span>}
            </div>
          )}
        </button>

        <button
          onClick={() => isPremium ? setView(AppView.RESEARCH) : setView(AppView.UPGRADE)}
          title={isCollapsed ? 'Advanced Projects' : ''}
          className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 ease-out ${
            currentView === AppView.RESEARCH
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
          } ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3 text-left'}`}
        >
          <span className="text-xl">⌬</span>
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[15px] font-medium">Advanced Projects</span>
              {!isPremium && <span className="text-[10px] border border-zinc-600 text-zinc-500 px-1">PRO</span>}
            </div>
          )}
        </button>
      </div>

      <div className={`absolute bottom-0 w-full p-4 ${isCollapsed ? 'px-2' : 'px-4'} border-t border-zinc-800 bg-zinc-950`}>
        {!isPremium && !isCollapsed && (
          <button
            onClick={() => setView(AppView.UPGRADE)}
            className="w-full h-11 rounded-lg border border-zinc-700 text-[15px] text-zinc-300 hover:bg-zinc-100 hover:text-black transition-all duration-200 ease-out"
          >
            Upgrade to Pro
          </button>
        )}

        <button
          onClick={onLogout}
          className={`mt-3 w-full h-10 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all duration-200 ease-out ${isCollapsed ? '' : 'text-[15px]'}`}
        >
          {isCollapsed ? '⏻' : 'Log out'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
