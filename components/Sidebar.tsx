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

const iconProps = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const icons = {
  dashboard: <svg {...iconProps}><path d="M3 13h8V3H3z"/><path d="M13 21h8v-6h-8z"/><path d="M13 3h8v6h-8z"/><path d="M3 21h8v-4H3z"/></svg>,
  projects: <svg {...iconProps}><path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h13"/><circle cx="18" cy="12" r="2"/></svg>,
  portfolio: <svg {...iconProps}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>,
  settings: <svg {...iconProps}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

const navItems = [
  { label: 'Dashboard', view: AppView.DASHBOARD, icon: icons.dashboard, activeViews: [AppView.DASHBOARD] },
  { label: 'Projects', view: AppView.TRACKS, icon: icons.projects, activeViews: [AppView.TRACKS, AppView.MISSION] },
  { label: 'Portfolio', view: AppView.PORTFOLIO, icon: icons.portfolio, activeViews: [AppView.PORTFOLIO, AppView.CERTIFICATES] },
  { label: 'Settings', view: AppView.SETTINGS, icon: icons.settings, activeViews: [AppView.SETTINGS] },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isPremium, isCollapsed, setIsCollapsed, onLogout }) => {
  return (
    <aside className={`fixed left-0 top-0 z-50 h-screen border-r border-[#262626] bg-[#121215] transition-all duration-200 ease-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center justify-between border-b border-[#262626] p-6 ${isCollapsed ? 'px-4' : ''}`}>
        {!isCollapsed && (
          <div>
            <h1 className="text-[20px] font-semibold text-[#EAEAEA]">TechTales</h1>
            <p className="mt-1 text-sm text-[#A1A1A1]">Project engineering platform</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-lg border border-[#262626] text-sm text-[#A1A1A1] transition-all duration-200 ease-out hover:border-[#c1121f] hover:text-[#EAEAEA]"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </div>

      <div className="p-4">
        {!isCollapsed && (
          <button
            onClick={() => setView(AppView.TRACKS)}
            className="mb-4 h-11 w-full rounded-xl bg-[#c1121f] text-sm font-medium text-white transition-all duration-200 ease-out hover:bg-[#a30f1a]"
          >
            Browse projects
          </button>
        )}

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.activeViews.includes(currentView);
            return (
              <button
                key={item.label}
                onClick={() => setView(item.view)}
                title={isCollapsed ? item.label : ''}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${isCollapsed ? 'justify-center' : ''} ${
                  isActive
                    ? 'border border-[#c1121f]/50 bg-[#c1121f]/10 text-[#EAEAEA]'
                    : 'border border-transparent text-[#A1A1A1] hover:border-[#262626] hover:bg-[#1F1F1F] hover:text-[#EAEAEA]'
                }`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`absolute bottom-0 w-full border-t border-[#262626] p-4 ${isCollapsed ? 'px-2' : ''}`}>
        {!isPremium && !isCollapsed && (
          <button
            onClick={() => setView(AppView.UPGRADE)}
            className="mb-3 h-10 w-full rounded-lg border border-[#c1121f]/40 bg-[#c1121f]/10 text-sm font-medium text-[#fecaca] transition-all duration-200 ease-out hover:border-[#c1121f]"
          >
            Unlock all projects
          </button>
        )}
        <button
          onClick={onLogout}
          className="h-10 w-full rounded-lg border border-[#262626] text-sm text-[#A1A1A1] transition-all duration-200 ease-out hover:border-[#c1121f] hover:text-[#EAEAEA]"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
