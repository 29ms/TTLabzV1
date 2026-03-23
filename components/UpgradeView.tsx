import React, { useState } from 'react';

interface UpgradeViewProps {
  onUpgrade: (plan: 'MONTHLY' | 'ANNUAL') => void;
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ onUpgrade }) => {
  const [billing, setBilling] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');

  const features = [
    { name: 'Project paths', free: 'Core pathways', pro: 'Core + advanced pathways' },
    { name: 'Project depth', free: 'Foundations and builder steps', pro: 'Extended advanced sequences' },
    { name: 'Portfolio outputs', free: 'Basic saved outputs', pro: 'Expanded polished outputs and exports' },
    { name: 'Research Suite', free: 'Preview only', pro: 'Full long-form workflows' },
    { name: 'Certificates', free: 'Limited', pro: 'Advanced certificate set' },
  ];

  return (
    <div className="min-h-screen bg-black px-6 py-10 md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(255,255,255,0.1),transparent_35%),radial-gradient(circle_at_86%_26%,rgba(59,130,246,0.16),transparent_30%)]" />
      <div className="relative mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur">
          <p className="text-sm text-zinc-400">Upgrade</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Go from solid portfolio to standout portfolio.</h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-300">
            Standard already gives meaningful value. Pro unlocks deeper project sequences, Research Suite workflows, and stronger portfolio presentation.
          </p>

          <div className="mt-5 inline-flex rounded-lg border border-white/15 bg-black/40 p-1">
            <button
              onClick={() => setBilling('MONTHLY')}
              className={`h-9 rounded-md px-4 text-sm font-medium transition ${billing === 'MONTHLY' ? 'bg-white text-black' : 'text-zinc-300 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('ANNUAL')}
              className={`h-9 rounded-md px-4 text-sm font-medium transition ${billing === 'ANNUAL' ? 'bg-white text-black' : 'text-zinc-300 hover:text-white'}`}
            >
              Annual (best value)
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <article className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur">
            <p className="text-sm text-zinc-400">TechTales Pro</p>
            <p className="mt-3 text-4xl font-semibold text-white">{billing === 'ANNUAL' ? '$8/mo' : '$12/mo'}</p>
            <p className="mt-1 text-sm text-zinc-400">{billing === 'ANNUAL' ? 'Billed annually' : 'Billed monthly'}</p>

            <button
              onClick={() => onUpgrade(billing)}
              className="mt-6 h-11 w-full rounded-lg bg-white text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Upgrade to Pro
            </button>
            <p className="mt-3 text-xs text-zinc-500">Secure checkout via Stripe. Your current auth and account stay unchanged.</p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Standard vs Pro</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-black/60 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Feature</th>
                    <th className="px-4 py-3 font-medium">Standard</th>
                    <th className="px-4 py-3 font-medium">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr key={feature.name} className="border-t border-white/10">
                      <td className="px-4 py-3 text-zinc-200">{feature.name}</td>
                      <td className="px-4 py-3 text-zinc-400">{feature.free}</td>
                      <td className="px-4 py-3 text-zinc-100">{feature.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default UpgradeView;
