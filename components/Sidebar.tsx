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
  const navItems = [
    { label: 'Home', view: AppView.DASHBOARD, short: 'HM' },
    { label: 'Paths', view: AppView.DASHBOARD, short: 'PA' },
    { label: 'Projects', view: AppView.DASHBOARD, short: 'PR' },
    { label: 'Portfolio', view: AppView.PORTFOLIO, short: 'PF' },
    { label: 'Research Suite', view: isPremium ? AppView.RESEARCH : AppView.UPGRADE, short: 'RS' },
    { label: 'Library', view: AppView.LEARN, short: 'LB' },
    { label: 'Account', view: AppView.PORTFOLIO, short: 'AC' },
  ];

  const isItemActive = (label: string, view: AppView) => {
    if (['Home', 'Paths', 'Projects'].includes(label)) return currentView === AppView.DASHBOARD;
    if (label === 'Account') return currentView === AppView.PORTFOLIO;
    return currentView === view;
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen border-r border-[#1F2937] bg-[#0B0F14]/95 backdrop-blur transition-all duration-200 ease-out ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className={`flex items-center justify-between p-5 ${isCollapsed ? 'px-3' : ''}`}>
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-semibold text-[#F9FAFB]">TechTales Labs</h1>
            <p className="mt-1 text-sm text-[#9CA3AF]">Guided Portfolio Builder</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-md border border-[#1F2937] text-sm text-[#9CA3AF] transition-all duration-200 ease-out hover:border-white hover:text-[#F9FAFB]"
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </div>

      <div className="px-3">
        {!isCollapsed && (
          <button
            onClick={() => setView(AppView.DASHBOARD)}
            className="mb-3 h-11 w-full rounded-lg bg-white text-sm font-medium text-black transition-all duration-200 ease-out hover:bg-zinc-200"
          >
            Continue Project
          </button>
        )}

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setView(item.view)}
              title={isCollapsed ? item.label : ''}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } ${
                isItemActive(item.label, item.view)
                  ? 'bg-[#111827] text-[#F9FAFB]'
                  : 'text-[#9CA3AF] hover:bg-[#111827] hover:text-[#F9FAFB]'
              }`}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded border border-[#1F2937] text-xs">
                {item.short}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className={`absolute bottom-0 w-full border-t border-[#1F2937] p-4 ${isCollapsed ? 'px-2' : ''}`}>
        {!isPremium && !isCollapsed && (
          <button
            onClick={() => setView(AppView.UPGRADE)}
            className="mb-3 h-10 w-full rounded-lg border border-[#1F2937] text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
          >
            Upgrade
          </button>
        )}

        <button
          onClick={onLogout}
          className="h-10 w-full rounded-lg border border-[#1F2937] text-sm font-medium text-[#9CA3AF] transition-all duration-200 ease-out hover:border-white hover:text-[#F9FAFB]"
        >
          {isCollapsed ? 'Out' : 'Log out'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
