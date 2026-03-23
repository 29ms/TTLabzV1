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
  initialTab?: PortfolioTab;
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
  initialTab = PortfolioTab.CERTIFICATIONS,
}) => {
  const [activeTab, setActiveTab] = useState<PortfolioTab>(initialTab);
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
    }, 250);
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
    <div className="min-h-screen bg-black px-6 pb-10 pt-8 md:px-10">
      <header className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur md:p-8">
        <p className="text-sm text-zinc-400">Portfolio</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Build evidence of ability.</h1>
        <p className="mt-3 max-w-3xl text-sm text-zinc-300">
          Every project outcome should become proof: structured writing, technical reasoning, and certificates that support your applications.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'border border-white/15 text-zinc-300 hover:border-white/40 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mt-6 space-y-6">
        {activeTab === PortfolioTab.CERTIFICATIONS && (
          <>
            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Portfolio artifacts</h2>
                  <p className="mt-2 text-sm text-zinc-400">Outputs generated from completed project steps.</p>
                </div>
                <button
                  onClick={() => setView(AppView.PROJECTS)}
                  className="h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/45 hover:bg-white/5"
                >
                  Build more projects
                </button>
              </div>

              {portfolioItems.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-black/40 p-6 text-sm text-zinc-400">
                  No artifacts yet. Complete your first guided step and this space will fill with evidence.
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {portfolioItems.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                      <p className="text-sm text-zinc-400">{item.category}</p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
                      <p className="mt-3 text-sm text-zinc-300">Artifact: {item.artifactType}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl md:p-8">
              <h2 className="text-xl font-semibold text-white">Certificates</h2>
              <p className="mt-2 text-sm text-zinc-400">Download verified certificates for completed pathways and research milestones.</p>
              {metrics.earnedCertificates.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-white/20 bg-black/40 p-6 text-sm text-zinc-400">
                  No certificates earned yet.
                </div>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {metrics.earnedCertificates.map((certificate) => (
                    <article key={certificate.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                      <h3 className="text-lg font-semibold text-white">{certificate.title}</h3>
                      <p className="mt-1 text-sm text-zinc-400">Issued: {certificate.issuedAt}</p>
                      <button
                        onClick={() => downloadCertificate(certificate)}
                        disabled={isDownloading === certificate.id}
                        className="mt-4 h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5 disabled:opacity-50"
                      >
                        {isDownloading === certificate.id ? 'Preparing file…' : 'Download certificate'}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === PortfolioTab.PROFILE && (
          <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl md:p-8">
            <h2 className="text-xl font-semibold text-white">Progress</h2>
            <p className="mt-2 text-sm text-zinc-400">Track your momentum and continue your strongest path.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-black/40 p-4"><p className="text-sm text-zinc-400">Points</p><p className="mt-2 text-2xl font-semibold text-white">{metrics.points}</p></article>
              <article className="rounded-2xl border border-white/10 bg-black/40 p-4"><p className="text-sm text-zinc-400">Projects Completed</p><p className="mt-2 text-2xl font-semibold text-white">{metrics.labsCompleted}</p></article>
              <article className="rounded-2xl border border-white/10 bg-black/40 p-4"><p className="text-sm text-zinc-400">Portfolio Items</p><p className="mt-2 text-2xl font-semibold text-white">{portfolioItems.length}</p></article>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-white">Continue building</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {pending.map((project) => (
                <article key={project.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <p className="text-sm text-zinc-400">{trackNames[project.track]}</p>
                  <h4 className="mt-2 text-xl font-semibold text-white">{project.title}</h4>
                  <p className="mt-2 text-sm text-zinc-400">{project.description}</p>
                  <button onClick={() => onSelectMission(project.id)} className="mt-4 h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5">Continue project</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === PortfolioTab.SETTINGS && (
          <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl md:p-8">
            <h2 className="text-xl font-semibold text-white">Paths</h2>
            <p className="mt-2 text-sm text-zinc-400">Choose which path should guide your recommended projects.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {CERTIFICATIONS.map((certification) => (
                <article key={certification.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <h3 className="text-xl font-semibold text-white">{certification.name}</h3>
                  <p className="mt-2 text-sm text-zinc-400">Track: {trackNames[certification.track]}</p>
                  <p className="mt-1 text-sm text-zinc-400">Required projects: {certification.requiredLabs}</p>
                  <button
                    onClick={() => {
                      onActivatePathway(certification.track);
                      setView(AppView.PROJECTS);
                    }}
                    className="mt-4 h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                  >
                    Choose path
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === PortfolioTab.ACCOUNT && (
          <section className="grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl md:p-8">
              <h2 className="text-xl font-semibold text-white">Account</h2>
              <p className="mt-2 text-sm text-zinc-400">Set your full name for certificates and portfolio exports.</p>
              <form onSubmit={handleNameSubmit} className="mt-5 space-y-3">
                <label className="block text-sm text-zinc-400">Full name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(event) => setTempName(event.target.value)}
                  className="h-11 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm text-white outline-none transition focus:border-white/50"
                />
                <button
                  type="submit"
                  disabled={isUpdating || tempName.trim().length < 3}
                  className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60"
                >
                  {isUpdating ? 'Saving…' : 'Save'}
                </button>
              </form>
            </article>

            <article className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl md:p-8">
              <h2 className="text-xl font-semibold text-white">Plan</h2>
              <p className="mt-2 text-sm text-zinc-400">Current access level for project, research, and export tools.</p>
              <p className="mt-4 text-xl font-semibold text-white">{metrics.isPremium ? 'Pro' : 'Standard'}</p>
              {!metrics.isPremium && (
                <button onClick={() => setView(AppView.UPGRADE)} className="mt-4 h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5">Upgrade</button>
              )}
              <button onClick={onLogout} className="mt-3 h-10 rounded-lg border border-white/20 px-4 text-sm font-medium text-zinc-400 transition hover:border-white/40 hover:text-white">Log out</button>
            </article>
          </section>
        )}
      </main>
    </div>
  );
};

export default PortfolioView;
