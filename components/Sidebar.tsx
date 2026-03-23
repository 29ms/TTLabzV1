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

const iconClass = 'h-4 w-4';

const icons = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass}><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/></svg>,
  projects: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16"/><path d="M11 9h7M11 13h7M11 17h4"/></svg>,
  certificates: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass}><circle cx="12" cy="10" r="5"/><path d="m9 14-2 7 5-2 5 2-2-7"/></svg>,
  profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.3-6 8-6s6.5 2 8 6"/></svg>,
  research: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass}><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/></svg>,
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isPremium, isCollapsed, setIsCollapsed, onLogout }) => {
  const navItems = [
    { label: 'Home', view: AppView.DASHBOARD, icon: icons.home, activeViews: [AppView.DASHBOARD, AppView.MISSION] },
    { label: 'Projects', view: AppView.PROJECTS, icon: icons.projects, activeViews: [AppView.PROJECTS] },
    { label: 'Certificates', view: AppView.CERTIFICATES, icon: icons.certificates, activeViews: [AppView.CERTIFICATES] },
    { label: 'Profile', view: AppView.ACCOUNT, icon: icons.profile, activeViews: [AppView.ACCOUNT] },
    { label: 'Research Suite', view: AppView.RESEARCH, icon: icons.research, activeViews: [AppView.RESEARCH] },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen border-r border-white/10 bg-black/90 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className={`flex items-center justify-between border-b border-white/10 p-5 ${isCollapsed ? 'px-4' : ''}`}>
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-semibold text-white">TechTales</h1>
            <p className="mt-1 text-sm text-zinc-400">Portfolio Studio</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-md border border-white/15 text-sm text-zinc-400 transition hover:border-white/30 hover:text-white"
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </div>

      <div className="px-3 py-4">
        {!isCollapsed && (
          <button
            onClick={() => setView(AppView.PROJECTS)}
            className="mb-4 h-11 w-full rounded-lg bg-white text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Continue Building
          </button>
        )}

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.activeViews.includes(currentView);
            return (
              <button
                key={item.label}
                onClick={() => setView(item.view)}
                title={isCollapsed ? item.label : ''}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isCollapsed ? 'justify-center' : 'justify-start'
                } ${
                  isActive
                    ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  {item.icon}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`absolute bottom-0 w-full border-t border-white/10 p-4 ${isCollapsed ? 'px-2' : ''}`}>
        {!isPremium && !isCollapsed && currentView !== AppView.DASHBOARD && (
          <button
            onClick={() => setView(AppView.UPGRADE)}
            className="mb-3 h-10 w-full rounded-lg border border-blue-300/40 bg-blue-400/10 text-sm font-medium text-blue-100 transition hover:border-blue-200"
          >
            Upgrade to Pro
          </button>
        )}

        <button
          onClick={onLogout}
          className="h-10 w-full rounded-lg border border-white/10 text-sm font-medium text-zinc-400 transition hover:border-white/25 hover:text-white"
        >
          {isCollapsed ? 'Out' : 'Log out'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
