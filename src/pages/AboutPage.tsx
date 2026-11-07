import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicSiteData } from '../types';
import { PageBackground } from '../components/common/PageBackground';
import { FoundersSection } from '../components/public/FoundersSection';
import {
  Sparkles,
  Target,
  Compass,
  ShieldCheck,
  CheckCircle2,
  Users,
  Code2,
  Cpu,
  ArrowRight,
  Server,
  Lock,
} from 'lucide-react';

interface AboutPageProps {
  data: PublicSiteData;
}

export const AboutPage: React.FC<AboutPageProps> = ({ data }) => {
  const navigate = useNavigate();

  const ab = data.about || {
    title: 'Where Ideas Become Innovation',
    intro:
      'JD Fusion Technologies is an engineering-driven technology company specialising primarily in Website Development and Systems Development, reinforced by dependable IT Support and strategic IT Solutions.',
    bio:
      'Founded to deliver uncompromising technical rigor and purposeful digital design, JD Fusion Technologies engineers mission-critical software, enterprise management platforms, and robust digital infrastructure for ambitious businesses and institutions.',
    mission:
      'To build scalable, resilient, and intuitive technology solutions that empower enterprises to operate with speed, agility, and absolute reliability.',
    vision:
      'To be the most trusted, transformative technology partner recognized for engineering excellence and genuine client success.',
    approach:
      'We reject generic templates and brittle shortcuts. Every system, website, and network architecture is engineered with clean code, modern standards, and direct accountability.',
    highlights: [
      'Modern TypeScript, React 19, and robust relational backbones',
      'Custom business ERPs, HMS, SMS, and operational systems',
      'Structured network cabling, managed servers, and hardware diagnostics',
      'Zero-trust cybersecurity, NVMe cloud hosting, and automation',
    ],
  };

  const coreValues = [
    {
      icon: Code2,
      title: 'Architectural Rigor',
      desc: 'We engineer with strict TypeScript contracts, relational PostgreSQL models, and modular component design—no fragile shortcuts.',
    },
    {
      icon: Cpu,
      title: 'Mission-Critical Reliability',
      desc: 'Our enterprise systems, ERPs, and database backbones are architected for zero data loss, fault tolerance, and high concurrency.',
    },
    {
      icon: Lock,
      title: 'Zero-Trust Security',
      desc: 'Edge-level firewalling, automated vulnerability defense, encrypted authentication, and data privacy baked into every layer.',
    },
    {
      icon: Users,
      title: 'Direct Engineering Accountability',
      desc: 'You work directly with us. Transparent technical execution, proactive problem-solving, and zero account-manager telephone games.',
    },
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-white text-stone-900 transition-colors duration-300">
      <PageBackground variant="about" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
            <span>Where Ideas Become Innovation.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black font-['Outfit'] tracking-tight">
            Engineering High-Performance Web &amp; Software Systems
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            {ab.intro}
          </p>
        </div>

        {/* Company Narrative & Vision / Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Narrative */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-stone-50 border border-stone-200 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-['Outfit'] text-black">
                Our Engineering Background &amp; Philosophy
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {ab.bio}
              </p>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {ab.approach}
              </p>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Official Engineering Standards:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ab.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Outfit'] text-black">
                Our Mission
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {ab.mission}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF914D]/10 text-[#FF914D] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Outfit'] text-black">
                Our Vision
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {ab.vision}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              Foundational Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black font-['Outfit']">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-[#155EEF]/40 hover:shadow-md transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-black font-['Outfit']">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Founders Section */}
        <div className="pt-8">
          <FoundersSection
            founders={data.founders}
            settings={data.settings}
            onInquireClick={() => navigate('/contact')}
          />
        </div>

        {/* Bottom Consultation Banner */}
        <div className="rounded-3xl bg-black text-white p-8 sm:p-12 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF914D]">
              Where Ideas Become Innovation.
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              Experience the JD Fusion difference.
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Schedule a consultation with us to discuss your web application, management software, or IT infrastructure.
            </p>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white font-bold text-sm shadow-lg shadow-[#FF914D]/25 transition-all cursor-pointer shrink-0"
          >
            Start a Conversation &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
