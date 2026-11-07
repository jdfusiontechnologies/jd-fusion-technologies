import React from 'react';
import { ShieldCheck, Cpu, Sparkles, Clock, Lock, Users, Headphones, Check } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Engineering-First Architecture',
      desc: 'We engineer with TypeScript, React 19, Node.js, PostgreSQL, and clean APIs—avoiding fragile drag-and-drop website builders.',
    },
    {
      icon: ShieldCheck,
      title: 'Mission-Critical Systems Development',
      desc: 'Custom enterprise software, ERPs, clinic HMS, and multi-branch POS backbones built for high data integrity and zero downtime.',
    },
    {
      icon: Lock,
      title: 'Zero-Trust Security & Data Integrity',
      desc: 'Edge-level firewalling, automated vulnerability defense, encrypted authentication, and relational database integrity.',
    },
    {
      icon: Sparkles,
      title: 'Strategic IT & Cloud Solutions',
      desc: 'High-speed NVMe hosting, cloud infrastructure (GCP/AWS), workflow automation, and verified compliance portal guidance.',
    },
    {
      icon: Users,
      title: 'Direct Founder Accountability',
      desc: 'Direct collaboration with our founders. Clear architectural roadmap, zero outsourced middle layers, and rapid turnarounds.',
    },
    {
      icon: Headphones,
      title: 'Dedicated Post-Launch Support',
      desc: 'Continuous preventive maintenance, network troubleshooting, and prompt support SLAs via WhatsApp and direct email.',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden transition-colors duration-300">
      {/* Subtle fine geometric dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#155EEF 1.2px, transparent 1.2px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-bold shadow-xs">
            <Check className="w-3.5 h-3.5 text-[#FF914D]" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black font-['Outfit'] tracking-tight">
            Why Partner With JD Fusion Technologies?
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Engineering excellence, mission-critical dependability, and dedicated technical partnership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isAccent = idx % 2 === 1;
            return (
              <div
                key={idx}
                className="group p-7 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 hover:border-[#155EEF]/50 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isAccent ? 'bg-[#FF914D]/10 text-[#FF914D]' : 'bg-[#155EEF]/10 text-[#155EEF]'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-['Outfit'] group-hover:text-[#155EEF] transition-colors duration-200">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
