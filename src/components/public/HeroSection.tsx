import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteSettings, ContactSettings } from '../../types';
import { ArrowRight, Code2, Cpu, ShieldCheck, Server, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';
import { HeroAnimatedBackground } from './HeroAnimatedBackground';

interface HeroSectionProps {
  settings?: SiteSettings;
  contact?: ContactSettings;
  onCtaClick?: () => void;
  onExploreProjects?: () => void;
  onExploreServices?: () => void;
  onStartInquiry?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onCtaClick,
  onExploreProjects,
  onExploreServices,
  onStartInquiry,
}) => {
  const navigate = useNavigate();

  const setts = settings || {
    siteName: 'JD Fusion Technologies',
    heroBadgeText: 'Empowering Modern Enterprises & Creators',
    heroHeadline: 'Building Digital Experiences. Creating Powerful Brands.',
    heroSubheadline:
      'We engineer high-performance websites, scalable distributed systems, defensive cybersecurity, and dedicated IT support solutions.',
    primaryCtaText: 'Start a Project',
    secondaryCtaText: 'Explore Services & Work',
  };

  const handlePrimary = onExploreServices || (() => navigate('/services'));
  const handleContact = onStartInquiry || onCtaClick || (() => navigate('/contact'));

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-32 pb-24 flex items-center justify-center overflow-hidden bg-white transition-colors duration-300"
    >
      {/* High-Performance Animated Ambient Wave & Flowing Light Background */}
      <HeroAnimatedBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-7">
          {/* Eyebrow badge with official slogan */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
            <span>Where Ideas Become Innovation.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-black font-['Outfit'] leading-[1.1] text-balance">
            Building Digital Experiences.{' '}
            <span className="text-gradient">Creating Powerful Systems.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed text-pretty font-normal">
            Specialising primarily in bespoke <strong className="text-stone-900 font-semibold">Website Development</strong> and mission-critical <strong className="text-stone-900 font-semibold">Systems Development</strong>, supported by enterprise-grade <span className="text-stone-800">IT Support</span> and strategic <span className="text-stone-800">IT Solutions</span>.
          </p>

          {/* Clear Calls to Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Action: Explore Services */}
            <button
              id="hero-primary-cta"
              onClick={handlePrimary}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#155EEF] hover:bg-[#124ec4] active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-[#155EEF]/25 hover:shadow-xl transition-all duration-200 cursor-pointer group"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Secondary Action: Contact Us */}
            <button
              id="hero-secondary-cta"
              onClick={handleContact}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] active:scale-[0.98] text-white font-bold text-base shadow-md shadow-[#FF914D]/25 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <span>Contact Us</span>
            </button>
          </div>

          {/* Value Highlights Bar: 4 Official Divisions */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-stone-600 font-medium">
            <div
              onClick={() => navigate('/services/website-development')}
              className="flex items-center gap-1.5 cursor-pointer hover:text-[#155EEF] transition-colors group"
            >
              <CheckCircle className="w-4 h-4 text-[#155EEF] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-stone-900 group-hover:text-[#155EEF] transition-colors">Website Development</span>
            </div>
            <div
              onClick={() => navigate('/services/systems-development')}
              className="flex items-center gap-1.5 cursor-pointer hover:text-[#155EEF] transition-colors group"
            >
              <CheckCircle className="w-4 h-4 text-[#155EEF] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-stone-900 group-hover:text-[#155EEF] transition-colors">Systems Development</span>
            </div>
            <div
              onClick={() => navigate('/services/it-support')}
              className="flex items-center gap-1.5 cursor-pointer hover:text-stone-900 transition-colors group"
            >
              <CheckCircle className="w-4 h-4 text-stone-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-stone-900 transition-colors">IT Support</span>
            </div>
            <div
              onClick={() => navigate('/services/it-solutions')}
              className="flex items-center gap-1.5 cursor-pointer hover:text-[#FF914D] transition-colors group"
            >
              <CheckCircle className="w-4 h-4 text-[#FF914D] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-[#FF914D] transition-colors">IT Solutions</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Terminal / Product Feature Graphic Card */}
        <div className="mt-14 max-w-6xl mx-auto rounded-3xl bg-white border border-stone-200 shadow-xl overflow-hidden transition-all duration-300">
          {/* Top Window Bar */}
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-[#FF914D]" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-stone-500 hidden sm:inline">
                jd-fusion-technologies ~ where-ideas-become-innovation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#155EEF] bg-[#155EEF]/10 px-2.5 py-0.5 rounded-md border border-[#155EEF]/20">
                Official Service Structure
              </span>
            </div>
          </div>

          {/* Window Interior Grid: 4 Core Technology Pillars */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-gradient-to-b from-stone-50/60 to-white/80">
            {/* Feature 1: Website Development */}
            <div
              onClick={() => navigate('/services/website-development')}
              className="p-5 rounded-2xl bg-white border border-[#155EEF]/30 space-y-3 cursor-pointer hover:border-[#155EEF] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#155EEF]/10 transition-all duration-300 group relative"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#155EEF]/10 text-[#155EEF]">
                  Flagship
                </span>
              </div>
              <h3 className="font-bold text-base text-black font-['Outfit'] group-hover:text-[#155EEF] transition-colors">
                Website Development
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Corporate websites, e-commerce stores, creative portfolios, educational portals &amp; custom web software.
              </p>
              <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#155EEF] group-hover:translate-x-1 transition-transform">
                <span>Explore 8 Practices</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2: Systems Development */}
            <div
              onClick={() => navigate('/services/systems-development')}
              className="p-5 rounded-2xl bg-white border border-[#155EEF]/30 space-y-3 cursor-pointer hover:border-[#155EEF] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#155EEF]/10 transition-all duration-300 group relative"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#155EEF]/10 text-[#155EEF]">
                  Flagship
                </span>
              </div>
              <h3 className="font-bold text-base text-black font-['Outfit'] group-hover:text-[#155EEF] transition-colors">
                Systems Development
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enterprise ERPs, hospital HMS, school SMS, POS inventory, HR payroll &amp; custom database architectures.
              </p>
              <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#155EEF] group-hover:translate-x-1 transition-transform">
                <span>Explore 10 Systems</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3: IT Support */}
            <div
              onClick={() => navigate('/services/it-support')}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 space-y-3 cursor-pointer hover:border-stone-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-800 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                  Support
                </span>
              </div>
              <h3 className="font-bold text-base text-black font-['Outfit'] group-hover:text-stone-900 transition-colors">
                IT Support
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Computer hardware repairs, structured Cat6 network cabling, servers, CCTV surveillance &amp; helpdesk SLAs.
              </p>
              <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-stone-600 group-hover:translate-x-1 transition-transform">
                <span>Explore 7 Support Areas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4: IT Solutions */}
            <div
              onClick={() => navigate('/services/it-solutions')}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 space-y-3 cursor-pointer hover:border-[#FF914D] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#FF914D]/15 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#FF914D]/10 text-[#FF914D] flex items-center justify-center group-hover:bg-[#FF914D] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#FF914D]/10 text-[#FF914D]">
                  Solutions
                </span>
              </div>
              <h3 className="font-bold text-base text-black font-['Outfit'] group-hover:text-[#FF914D] transition-colors">
                IT Solutions
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Domain &amp; hosting, cloud computing, cybersecurity defense, automation, AI &amp; e-government compliance.
              </p>
              <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#FF914D] group-hover:translate-x-1 transition-transform">
                <span>Explore 8 Solutions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
