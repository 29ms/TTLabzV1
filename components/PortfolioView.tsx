import React, { useMemo, useState } from 'react';
import { AppView, LabTrack, Mission, PortfolioTab, UserCertificate, UserMetrics } from '../types';
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

const trackNames: Record<LabTrack, string> = {
  LIFE: 'Foundational Safety',
  SOVEREIGNTY: 'Digital Identity',
  DEFENDER: 'Cybersecurity Projects',
  EXECUTIVE: 'Coding Projects',
  INTEL: 'Advanced Projects',
  ETHICS: 'AI Projects',
  AI_ENGINEERING: 'AI Projects',
};

const artifactByTrack: Record<LabTrack, string> = {
  ETHICS: 'Technical brief',
  AI_ENGINEERING: 'Model report',
  DEFENDER: 'Security audit',
  EXECUTIVE: 'Prototype report',
  INTEL: 'Research output',
  LIFE: 'Case summary',
  SOVEREIGNTY: 'Policy brief',
};

const tabs = [
  { id: PortfolioTab.CERTIFICATIONS, label: 'Portfolio' },
  { id: PortfolioTab.PROFILE, label: 'Progress' },
  { id: PortfolioTab.SETTINGS, label: 'Paths' },
  { id: PortfolioTab.ACCOUNT, label: 'Account' },
];

const PortfolioView: React.FC<PortfolioViewProps> = ({
  metrics,
  missions,
  onUpdateName,
  onActivatePathway,
  onSelectMission,
  setView,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<PortfolioTab>(PortfolioTab.CERTIFICATIONS);
  const [tempName, setTempName] = useState(metrics.operatorName || '');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const completed = useMemo(() => missions.filter((mission) => mission.completed), [missions]);
  const pending = useMemo(() => missions.filter((mission) => !mission.completed).slice(0, 4), [missions]);

  const portfolioItems = useMemo(
    () =>
      completed.map((mission) => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        category: trackNames[mission.track],
        artifactType: artifactByTrack[mission.track],
      })),
    [completed],
  );

  const handleNameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = tempName.trim();
    if (name.length < 3) return;
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateName(name);
      setIsUpdating(false);
    }, 300);
  };

  const downloadCertificate = async (certificate: UserCertificate) => {
    if (!metrics.operatorName) {
      alert('Please set your name in Account before downloading certificates.');
      return;
    }

    setIsDownloading(certificate.id);
    try {
      await certificateService.generateCertificate({
        fullName: metrics.operatorName,
        title: certificate.title,
        theater: certificate.theater,
        serial: certificate.serial,
        issuedAt: certificate.issuedAt,
      });
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0B0F14] px-6 pb-24 pt-8 md:px-10">
      <header className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
        <p className="text-sm text-[#9CA3AF]">Portfolio</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">Build evidence of ability.</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#9CA3AF]">
          Your portfolio is where project outputs, certificates, and progress become proof for real opportunities.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-out ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'border border-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mt-6 h-[calc(100%-15rem)] overflow-y-auto pr-1 space-y-6">
        {activeTab === PortfolioTab.CERTIFICATIONS && (
          <>
            <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#F9FAFB]">Portfolio Artifacts</h2>
                  <p className="mt-2 text-sm text-[#9CA3AF]">Completed projects converted into structured entries.</p>
                </div>
                <button
                  onClick={() => setView(AppView.DASHBOARD)}
                  className="h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
                >
                  Build More Projects
                </button>
              </div>

              {portfolioItems.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#1F2937] bg-[#0B0F14] p-6 text-sm text-[#9CA3AF]">
                  No artifacts yet. Complete your first guided project step and add it here.
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {portfolioItems.map((item) => (
                    <article key={item.id} className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-5">
                      <h3 className="text-xl font-semibold text-[#F9FAFB]">{item.title}</h3>
                      <p className="mt-2 text-sm text-[#9CA3AF]">{item.description}</p>
                      <p className="mt-3 text-sm text-[#9CA3AF]">
                        Category: <span className="text-[#F9FAFB]">{item.category}</span>
                      </p>
                      <p className="mt-1 text-sm text-[#9CA3AF]">
                        Artifact type: <span className="text-[#F9FAFB]">{item.artifactType}</span>
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
              <h2 className="text-xl font-semibold text-[#F9FAFB]">Certificates</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">Download verified records for completed milestones.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {metrics.earnedCertificates.length === 0 && (
                  <p className="text-sm text-[#9CA3AF]">No certificates earned yet.</p>
                )}
                {metrics.earnedCertificates.map((certificate) => (
                  <article key={certificate.id} className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-5">
                    <h3 className="text-xl font-semibold text-[#F9FAFB]">{certificate.title}</h3>
                    <p className="mt-2 text-sm text-[#9CA3AF]">Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
                    <button
                      onClick={() => downloadCertificate(certificate)}
                      disabled={isDownloading === certificate.id}
                      className="mt-4 h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white disabled:opacity-60"
                    >
                      {isDownloading === certificate.id ? 'Preparing file...' : 'Download Certificate'}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === PortfolioTab.PROFILE && (
          <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#F9FAFB]">Progress</h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">Track momentum and continue your strongest project path.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
                <p className="text-sm text-[#9CA3AF]">Points</p>
                <p className="mt-2 text-xl font-semibold text-[#F9FAFB]">{metrics.points}</p>
              </article>
              <article className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
                <p className="text-sm text-[#9CA3AF]">Projects Completed</p>
                <p className="mt-2 text-xl font-semibold text-[#F9FAFB]">{metrics.labsCompleted}</p>
              </article>
              <article className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
                <p className="text-sm text-[#9CA3AF]">Portfolio Items</p>
                <p className="mt-2 text-xl font-semibold text-[#F9FAFB]">{portfolioItems.length}</p>
              </article>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-[#F9FAFB]">Continue Building</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {pending.map((project) => (
                <article key={project.id} className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-5">
                  <p className="text-sm text-[#9CA3AF]">{trackNames[project.track]}</p>
                  <h4 className="mt-2 text-xl font-semibold text-[#F9FAFB]">{project.title}</h4>
                  <p className="mt-2 text-sm text-[#9CA3AF]">{project.description}</p>
                  <button
                    onClick={() => onSelectMission(project.id)}
                    className="mt-4 h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
                  >
                    Continue Project
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === PortfolioTab.SETTINGS && (
          <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#F9FAFB]">Paths</h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">Choose the path that should guide your recommended projects.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {CERTIFICATIONS.map((certification) => (
                <article key={certification.id} className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-5">
                  <h3 className="text-xl font-semibold text-[#F9FAFB]">{certification.name}</h3>
                  <p className="mt-2 text-sm text-[#9CA3AF]">Track: {trackNames[certification.track]}</p>
                  <p className="mt-1 text-sm text-[#9CA3AF]">Required projects: {certification.requiredLabs}</p>
                  <button
                    onClick={() => {
                      onActivatePathway(certification.track);
                      setView(AppView.DASHBOARD);
                    }}
                    className="mt-4 h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
                  >
                    Choose Path
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === PortfolioTab.ACCOUNT && (
          <section className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
              <h2 className="text-xl font-semibold text-[#F9FAFB]">Account</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">Set your full name for certificates and portfolio exports.</p>
              <form onSubmit={handleNameSubmit} className="mt-5 space-y-3">
                <label className="block text-sm text-[#9CA3AF]">Full name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(event) => setTempName(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#1F2937] bg-[#0B0F14] px-3 text-sm text-[#F9FAFB] outline-none transition-all duration-200 ease-out focus:border-white"
                />
                <button
                  type="submit"
                  disabled={isUpdating || tempName.trim().length < 3}
                  className="h-10 rounded-lg bg-white px-4 text-sm font-medium text-black transition-all duration-200 ease-out hover:bg-zinc-200 disabled:opacity-60"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </form>
            </article>

            <article className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
              <h2 className="text-xl font-semibold text-[#F9FAFB]">Plan</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">Current access level for project, research, and export tools.</p>
              <p className="mt-4 text-xl font-semibold text-[#F9FAFB]">{metrics.isPremium ? 'Pro' : 'Standard'}</p>
              {!metrics.isPremium && (
                <button
                  onClick={() => setView(AppView.UPGRADE)}
                  className="mt-4 h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
                >
                  Upgrade
                </button>
              )}
              <button
                onClick={onLogout}
                className="mt-3 h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#9CA3AF] transition-all duration-200 ease-out hover:border-white hover:text-[#F9FAFB]"
              >
                Log out
              </button>
            </article>
          </section>
        )}
      </main>
    </div>
  );
};

export default PortfolioView;
