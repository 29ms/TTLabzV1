import React, { useMemo, useState } from 'react';
import { AppView, LabTrack, Mission, PortfolioTab, UserMetrics } from '../types';
import { certificateService } from '../services/certificateService';

interface PortfolioViewProps {
  metrics: UserMetrics;
  missions: Mission[];
  onUpdateName: (name: string) => void;
  onActivatePathway: (track: LabTrack) => void;
  onSelectMission: (id: string) => void;
  setView: (view: AppView) => void;
  onLogout: () => void;
  initialTab?: PortfolioTab;
}

const trackName: Record<LabTrack, string> = {
  ETHICS: 'Artificial Intelligence',
  DEFENDER: 'Cybersecurity',
  EXECUTIVE: 'Coding / Software Development',
  INTEL: 'Robotics',
};

const PortfolioView: React.FC<PortfolioViewProps> = ({
  metrics,
  missions,
  onUpdateName,
  onActivatePathway,
  onSelectMission,
  setView,
  onLogout,
  initialTab = PortfolioTab.PORTFOLIO,
}) => {
  const [activeTab, setActiveTab] = useState<PortfolioTab>(initialTab);
  const [tempName, setTempName] = useState(metrics.operatorName || '');

  const completed = useMemo(() => missions.filter((mission) => mission.completed), [missions]);

  const downloadCertificate = async (module: Mission) => {
    await certificateService.generateCertificate({
      fullName: metrics.operatorName || 'Student',
      title: module.title,
      theater: module.track === 'DEFENDER' ? 'BLUE' : module.track === 'INTEL' ? 'GENERAL' : 'RED',
      issuedAt: new Date().toLocaleDateString(),
      serial: `TT-${module.id.toUpperCase()}-${Date.now().toString().slice(-6)}`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] px-6 py-8 text-[#EAEAEA] md:px-10">
      <header className="rounded-xl border border-[#262626] bg-[#171717] p-6 md:p-8">
        <p className="text-sm text-[#A1A1A1]">Portfolio</p>
        <h1 className="mt-2 text-[36px] font-semibold">Proof of your completed work</h1>
        <p className="mt-3 text-base text-[#A1A1A1]">Portfolio entries are automatically created from completed modules, reflections, and certificates.</p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { id: PortfolioTab.PORTFOLIO, label: 'Portfolio Items' },
          { id: PortfolioTab.CERTIFICATES, label: 'Certificates' },
          { id: PortfolioTab.SETTINGS, label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-10 rounded-lg px-4 text-sm font-medium transition-all duration-200 ease-out ${
              activeTab === tab.id
                ? 'border border-[#c1121f]/60 bg-[#c1121f]/10 text-[#EAEAEA]'
                : 'border border-[#262626] text-[#A1A1A1] hover:border-[#c1121f] hover:text-[#EAEAEA]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === PortfolioTab.PORTFOLIO && (
        <section className="mt-6 rounded-xl border border-[#262626] bg-[#171717] p-6 md:p-8">
          <h2 className="text-[28px] font-semibold">Completed Modules</h2>
          <p className="mt-2 text-base text-[#A1A1A1]">Each completed module includes your reflection and structured output evidence.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {completed.map((module) => (
              <article key={module.id} className="rounded-xl border border-[#262626] bg-[#111111] p-6">
                <p className="text-sm text-[#A1A1A1]">{trackName[module.track]} • {module.level}</p>
                <h3 className="mt-2 text-[22px] font-semibold">{module.title}</h3>
                <p className="mt-2 text-base text-[#A1A1A1]">Artifact type: Technical summary + reflection</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onSelectMission(module.id)}
                    className="h-10 rounded-lg border border-[#262626] px-4 text-sm font-medium text-[#EAEAEA] transition-all duration-200 ease-out hover:border-[#c1121f]"
                  >
                    Review Module
                  </button>
                  <button
                    onClick={() => downloadCertificate(module)}
                    className="h-10 rounded-lg bg-[#c1121f] px-4 text-sm font-medium text-white transition-all duration-200 ease-out hover:bg-[#a30f1a]"
                  >
                    Certificate
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === PortfolioTab.CERTIFICATES && (
        <section className="mt-6 rounded-xl border border-[#262626] bg-[#171717] p-6 md:p-8">
          <h2 className="text-[28px] font-semibold">Certificates</h2>
          <p className="mt-2 text-base text-[#A1A1A1]">Generate downloadable certificates for completed modules.</p>
          <div className="mt-6 space-y-3">
            {completed.map((module) => (
              <article key={`cert-${module.id}`} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#262626] bg-[#111111] p-4">
                <div>
                  <p className="text-[16px] font-semibold">{module.title}</p>
                  <p className="text-sm text-[#A1A1A1]">{trackName[module.track]} • {module.level}</p>
                </div>
                <button
                  onClick={() => downloadCertificate(module)}
                  className="h-10 rounded-lg bg-[#c1121f] px-4 text-sm font-medium text-white transition-all duration-200 ease-out hover:bg-[#a30f1a]"
                >
                  Download PDF
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === PortfolioTab.SETTINGS && (
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-[#262626] bg-[#171717] p-6">
            <h2 className="text-[28px] font-semibold">Profile</h2>
            <p className="mt-2 text-base text-[#A1A1A1]">Your name appears on certificates and exports.</p>
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="mt-4 h-11 w-full rounded-lg border border-[#262626] bg-[#111111] px-4 text-base text-[#EAEAEA] outline-none focus:border-[#c1121f]"
            />
            <button
              onClick={() => onUpdateName(tempName)}
              className="mt-4 h-10 rounded-lg bg-[#c1121f] px-4 text-sm font-medium text-white transition-all duration-200 ease-out hover:bg-[#a30f1a]"
            >
              Save profile
            </button>
          </article>

          <article className="rounded-xl border border-[#262626] bg-[#171717] p-6">
            <h2 className="text-[28px] font-semibold">Next Steps</h2>
            <p className="mt-2 text-base text-[#A1A1A1]">Choose your next track and continue your sequence.</p>
            <div className="mt-4 grid gap-3">
              {(Object.keys(trackName) as LabTrack[]).map((track) => (
                <button
                  key={track}
                  onClick={() => {
                    onActivatePathway(track);
                    setView(AppView.TRACKS);
                  }}
                  className="h-10 rounded-lg border border-[#262626] px-4 text-left text-sm font-medium text-[#EAEAEA] transition-all duration-200 ease-out hover:border-[#c1121f]"
                >
                  Start {trackName[track]}
                </button>
              ))}
            </div>
            <button onClick={onLogout} className="mt-4 h-10 rounded-lg border border-[#262626] px-4 text-sm text-[#A1A1A1] transition-all duration-200 ease-out hover:border-[#c1121f] hover:text-[#EAEAEA]">
              Log out
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default PortfolioView;
