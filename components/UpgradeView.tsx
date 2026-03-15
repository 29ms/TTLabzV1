import React, { useState } from 'react';

interface UpgradeViewProps {
  onUpgrade: (plan: 'MONTHLY' | 'ANNUAL') => void;
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ onUpgrade }) => {
  const [billing, setBilling] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');

  const features = [
    { name: 'Path Access', free: 'Core paths only', pro: 'Core + advanced paths' },
    { name: 'Guided Project Steps', free: 'Foundations and builder levels', pro: 'Full depth across all levels' },
    { name: 'Portfolio Storage', free: 'Starter portfolio history', pro: 'Extended portfolio archive' },
    { name: 'Certificates', free: 'Limited certificate track', pro: 'Full certificate set' },
    { name: 'Research Suite', free: 'Preview access', pro: 'Full advanced research workflows' },
    { name: 'Project Builder Tools', free: 'Basic tools', pro: 'Expanded build and export tools' },
  ];

  return (
    <div className="mx-auto max-w-6xl p-8 md:p-12 animate-in fade-in duration-300">
      <header className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
        <p className="text-sm text-[#9CA3AF]">Upgrade</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">Go from solid portfolio to standout portfolio.</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#9CA3AF]">
          The free plan stays useful for real progress. Pro unlocks deeper projects, stronger outputs, and advanced research quality.
        </p>

        <div className="mt-5 inline-flex rounded-lg border border-[#1F2937] bg-[#0B0F14] p-1">
          <button
            onClick={() => setBilling('MONTHLY')}
            className={`h-10 rounded-md px-4 text-sm font-medium transition-all duration-200 ease-out ${
              billing === 'MONTHLY' ? 'bg-white text-black' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('ANNUAL')}
            className={`h-10 rounded-md px-4 text-sm font-medium transition-all duration-200 ease-out ${
              billing === 'ANNUAL' ? 'bg-white text-black' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            Annual (Best Value)
          </button>
        </div>
      </header>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
          <p className="text-sm text-[#9CA3AF]">Standard</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">Free</h2>
          <ul className="mt-5 space-y-3 text-sm text-[#9CA3AF]">
            <li>Access to core paths and guided project structure</li>
            <li>Portfolio basics and starter proof-of-work entries</li>
            <li>Meaningful foundation for applications and internships</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-white bg-[#111827] p-6 md:p-8 relative overflow-hidden">
          <span className="absolute right-4 top-4 rounded-full border border-white px-2 py-1 text-xs text-[#F9FAFB]">Pro</span>
          <p className="text-sm text-[#9CA3AF]">Professional</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">
            {billing === 'ANNUAL' ? '$5' : '$8'}
            <span className="ml-2 text-sm font-medium text-[#9CA3AF]">/ month</span>
          </h2>
          {billing === 'ANNUAL' && <p className="mt-1 text-sm text-[#9CA3AF]">Billed as $60 per year</p>}

          <ul className="mt-5 space-y-3 text-sm text-[#9CA3AF]">
            <li>Advanced project sequences and richer outputs</li>
            <li>Full research workflows and deeper project expansion</li>
            <li>More portfolio storage, exports, and presentation strength</li>
          </ul>

          <button
            onClick={() => onUpgrade(billing)}
            className="mt-6 h-11 w-full rounded-lg bg-white text-sm font-medium text-black transition-all duration-200 ease-out hover:bg-zinc-200"
          >
            Upgrade to Pro
          </button>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-[#1F2937] bg-[#111827] p-6 md:p-8">
        <h3 className="text-xl font-semibold text-[#F9FAFB]">Plan comparison</h3>
        <p className="mt-2 text-sm text-[#9CA3AF]">Clear differences based on your new product structure.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#1F2937] text-[#9CA3AF]">
                <th className="py-3 font-medium">Feature</th>
                <th className="py-3 font-medium">Standard</th>
                <th className="py-3 font-medium">Professional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {features.map((feature) => (
                <tr key={feature.name}>
                  <td className="py-4 text-[#F9FAFB]">{feature.name}</td>
                  <td className="py-4 text-[#9CA3AF]">{feature.free}</td>
                  <td className="py-4 text-[#F9FAFB]">{feature.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UpgradeView;
