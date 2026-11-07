import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicSiteData, WebProject, GraphicProject } from '../types';
import { HeroSection } from '../components/public/HeroSection';
import { WhyChooseUsSection } from '../components/public/WhyChooseUsSection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { FoundersSection } from '../components/public/FoundersSection';
import { ScrollReveal } from '../components/common/ScrollReveal';
import {
  Code2,
  Palette,
  ShieldCheck,
  Server,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  ChevronRight,
  Wrench,
  Star,
} from 'lucide-react';
import { DynamicIcon } from '../components/common/DynamicIcon';

interface HomePageProps {
  data: PublicSiteData;
  onSelectWebProject: (project: WebProject) => void;
  onSelectGraphicImage: (item: { imageUrl: string; title: string; category: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  data,
  onSelectWebProject,
  onSelectGraphicImage,
}) => {
  const navigate = useNavigate();

  const featuredServices = (data.services || [])
    .filter((s) => s.isPublished)
    .slice(0, 4);

  const featuredWebProjects = (data.webProjects || [])
    .filter((p) => p.isPublished)
    .slice(0, 2);

  const featuredGraphicProjects = (data.graphicProjects || [])
    .filter((g) => g.isPublished)
    .slice(0, 2);

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero Section */}
      <HeroSection
        settings={data.settings}
        contact={data.contact}
        onCtaClick={() => navigate('/contact')}
        onExploreProjects={() => navigate('/projects')}
        onExploreServices={() => navigate('/services')}
        onStartInquiry={() => navigate('/contact')}
      />

      {/* 2. Company Introduction & Official Slogan Banner */}
      <section className="py-16 bg-white border-y border-stone-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#155EEF] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
                <span>Where Ideas Become Innovation.</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-['Outfit'] tracking-tight">
                Engineering digital products that combine speed, resilience, and authoritative design.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {data.about?.intro ||
                  'JD Fusion Technologies is an engineering-driven technology company specialising primarily in Website Development and Systems Development, reinforced by dependable IT Support and strategic IT Solutions.'}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center lg:items-end">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-black text-sm font-semibold border border-stone-200 transition-all"
              >
                <span>About Our Company</span>
                <ChevronRight className="w-4 h-4 text-[#155EEF]" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#155EEF] hover:bg-[#124ec4] text-white text-sm font-bold shadow-md shadow-[#155EEF]/20 transition-all"
              >
                <span>Explore All Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Official Technology Services & Core Catalogue */}
      <section className="py-24 bg-stone-50/70 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 text-[#155EEF] text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-[#155EEF]" />
                <span>Official Service Structure</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-black font-['Outfit'] tracking-tight">
                Our Four Core Service Divisions
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Specializing primarily in <strong className="text-stone-900 font-bold">Website Development</strong> and{' '}
                <strong className="text-stone-900 font-bold">Systems Development</strong>, reinforced by reliable{' '}
                <span className="font-semibold text-stone-800">IT Support</span> and{' '}
                <span className="font-semibold text-stone-800">IT Solutions</span>.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black hover:bg-stone-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all self-start md:self-auto group"
            >
              <span>Explore Complete 33-Service Catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* CORE DIVISIONS (STRONG VISUAL EMPHASIS: 2 LARGE FEATURED CARDS) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#155EEF] bg-[#155EEF]/10 px-2.5 py-1 rounded-md">
                Core Business Engineering Priorities
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Core 1: Website Development */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#155EEF]/30 shadow-lg hover:shadow-2xl hover:shadow-[#155EEF]/10 hover:-translate-y-2 hover:border-[#155EEF] transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#155EEF]/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center font-bold group-hover:bg-[#155EEF] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                      <Code2 className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-[#155EEF] text-white shadow-xs">
                      Core Practice
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-[#155EEF]">01 · Division</span>
                    <h3 className="text-2xl font-extrabold text-black font-['Outfit'] mt-1 group-hover:text-[#155EEF] transition-colors">
                      Website Development
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      High-performance, bespoke corporate portals, e-commerce storefronts, portfolios, educational hubs, and custom web software engineered with React 19, Next.js, and TypeScript.
                    </p>
                  </div>

                  {/* Highlighted Subcategories */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                      Recognized Subcategories (8 Practices):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Business &amp; Corporate Websites</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>E-Commerce &amp; M-Pesa Stores</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Personal &amp; Portfolio Websites</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Educational &amp; Course Portals</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Media &amp; Publishing Websites</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Custom Web Applications</span></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between relative z-10">
                  <Link
                    to="/services/website-development"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155EEF] hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View All 8 Subcategories</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => navigate('/contact', { state: { prefilledService: 'Website Development' } })}
                    className="px-5 py-2.5 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white text-xs font-bold shadow-md shadow-[#FF914D]/25 hover:shadow-lg hover:shadow-[#FF914D]/35 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Scope Web Project
                  </button>
                </div>
              </div>

              {/* Core 2: Systems Development */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#155EEF]/30 shadow-lg hover:shadow-2xl hover:shadow-[#155EEF]/10 hover:-translate-y-2 hover:border-[#155EEF] transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#155EEF]/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center font-bold group-hover:bg-[#155EEF] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-[#155EEF] text-white shadow-xs">
                      Core Practice
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-[#155EEF]">02 · Division</span>
                    <h3 className="text-2xl font-extrabold text-black font-['Outfit'] mt-1">
                      Systems Development
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      Scalable, fault-tolerant enterprise management systems, hospital HMS, school SMS, finance &amp; accounting ledgers, POS inventory, and custom database backbones.
                    </p>
                  </div>

                  {/* Highlighted Subcategories */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                      Recognized Subcategories (10 Systems):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Business &amp; Enterprise ERP</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Healthcare (HMS / EMR)</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Education (SMS / SIS)</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Retail &amp; POS Inventory</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Finance &amp; Double-Entry Ledgers</span></div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Custom Systems Architecture</span></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between relative z-10">
                  <Link
                    to="/services/systems-development"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155EEF] hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View All 10 Systems</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => navigate('/contact', { state: { prefilledService: 'Systems Development' } })}
                    className="px-5 py-2.5 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white text-xs font-bold shadow-md shadow-[#FF914D]/25 hover:shadow-lg hover:shadow-[#FF914D]/35 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Inquire About Systems
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SUPPORTING SERVICE DIVISIONS (CLEAN 2-COLUMN SUMMARY) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600 bg-stone-200/80 px-2.5 py-1 rounded-md">
                Supporting Service Divisions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supporting 1: IT Support */}
              <div className="p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-stone-400 transition-all duration-300 flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      7 Support Areas
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-black font-['Outfit'] group-hover:text-[#155EEF] transition-colors">
                    03 · IT Support
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Reliable hardware repair, structured Cat6 network cabling, on-premise servers, CCTV surveillance, and dedicated helpdesk SLAs to prevent costly operational downtime.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-stone-600">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">Hardware &amp; PC Repair</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">Cat6 Cabling &amp; Wi-Fi</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">Servers &amp; NAS</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">CCTV &amp; Biometrics</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">Helpdesk SLAs</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    to="/services/it-support"
                    className="text-xs font-bold text-stone-700 hover:text-[#155EEF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Explore IT Support Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => navigate('/contact', { state: { prefilledService: 'IT Support' } })}
                    className="text-xs font-semibold text-[#FF914D] hover:underline cursor-pointer"
                  >
                    Request Support &rarr;
                  </button>
                </div>
              </div>

              {/* Supporting 2: IT Solutions */}
              <div className="p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#FF914D]/50 transition-all duration-300 flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FF914D]/10 text-[#FF914D] flex items-center justify-center group-hover:bg-[#FF914D] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      8 Solutions
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-black font-['Outfit'] group-hover:text-[#FF914D] transition-colors">
                    04 · IT Solutions
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Domain &amp; NVMe hosting, cloud computing (GCP/AWS), zero-trust cybersecurity, workflow automation, business intelligence, and public e-government portal guidance (KRA, eCitizen).
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-stone-600">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">Domain &amp; Email Hosting</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">Cloud &amp; DevOps</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">Cybersecurity Audits</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">Workflow Automation</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">KRA &amp; eCitizen</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    to="/services/it-solutions"
                    className="text-xs font-bold text-stone-700 hover:text-[#155EEF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Explore IT Solutions Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => navigate('/contact', { state: { prefilledService: 'IT Solutions' } })}
                    className="text-xs font-semibold text-[#FF914D] hover:underline cursor-pointer"
                  >
                    Inquire Solutions &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC CMS-SYNCED SERVICES (ANY SERVICE ADDED/UPDATED BY ADMIN) */}
          {(data.services || []).filter((s) => s.isPublished).length > 0 && (
            <div className="space-y-6 pt-10 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-black font-['Outfit'] tracking-tight">
                    Services &amp; Tailored Solutions We Deliver
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Live capabilities and deployed systems updated in real time from our engineering CMS.
                  </p>
                </div>

                <Link
                  to="/services"
                  className="text-xs font-bold text-[#155EEF] hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Explore full 33-service catalogue &rarr;</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(data.services || [])
                  .filter((s) => s.isPublished)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-[#155EEF]/50 transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center font-bold group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                            <DynamicIcon name={service.iconName || 'Globe'} className="w-5 h-5" />
                          </div>
                          {service.isFeatured && (
                            <span className="p-1 text-orange-500" title="Featured Service">
                              <Star className="w-3.5 h-3.5 fill-orange-500" />
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                            {service.category === 'web' || service.category === 'website-development'
                              ? 'Website Dev'
                              : service.category === 'systems' || service.category === 'systems-development'
                              ? 'Systems Dev'
                              : service.category === 'support' || service.category === 'it-support'
                              ? 'IT Support'
                              : service.category === 'cyber' || service.category === 'it-solutions'
                              ? 'IT Solutions'
                              : service.category}
                          </span>
                          <h4 className="text-base font-extrabold text-black font-['Outfit'] group-hover:text-[#155EEF] transition-colors line-clamp-1">
                            {service.title}
                          </h4>
                          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2">
                            {service.shortDescription}
                          </p>
                        </div>

                        {service.features && service.features.length > 0 && (
                          <div className="pt-2 border-t border-stone-100 space-y-1">
                            {service.features.slice(0, 2).map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-600 truncate">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-stone-100">
                        <button
                          onClick={() => navigate('/contact', { state: { prefilledService: service.title } })}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-50 hover:bg-[#155EEF] hover:text-white text-stone-800 text-xs font-bold transition-all border border-stone-200 cursor-pointer"
                        >
                          <span>Inquire Service</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Selected Technology Deployments */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 text-[#155EEF] text-xs font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>Engineering Deployments</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-black font-['Outfit'] tracking-tight">
                Selected Technology Deployments
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Representative architectural case studies across our Website Development and Systems Development practices.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#FF914D] hover:text-[#f07e36] transition-colors self-start md:self-auto group"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredWebProjects.map((p) => (
              <div
                key={p.id}
                className="group rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#155EEF]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="aspect-16/10 overflow-hidden relative bg-stone-900">
                  <img
                    src={p.mainImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Zero-Pill Metadata */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <span className="font-bold text-[#155EEF]">{p.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Production Verified</span>
                    </div>

                    <h3 className="text-xl font-bold text-black font-['Outfit']">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectWebProject(p)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#124ec4] transition-colors cursor-pointer"
                    >
                      <span>Inspect Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      to="/contact"
                      className="text-xs font-semibold text-[#FF914D] hover:underline"
                    >
                      Request Similar Build &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Reasons to Choose JD Fusion Technologies */}
      <ScrollReveal>
        <WhyChooseUsSection />
      </ScrollReveal>

      {/* 6. Executive Leadership & Founders */}
      <ScrollReveal>
        <FoundersSection
          founders={data.founders}
          settings={data.settings}
          onInquireClick={() => navigate('/contact')}
        />
      </ScrollReveal>

      {/* 7. Client Testimonials (gracefully omitted when no reviews) */}
      {data.testimonials && data.testimonials.length > 0 && (
        <ScrollReveal>
          <TestimonialsSection testimonials={data.testimonials} />
        </ScrollReveal>
      )}

      {/* 8. Strong Contact Call To Action Banner */}
      <section className="py-20 bg-black text-white relative overflow-hidden border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF914D]/15 border border-[#FF914D]/30 text-[#FF914D] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Where Ideas Become Innovation.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight">
            <span className="block sm:inline text-white">
              Building Digital Experiences.{' '}
            </span>
            <span className="text-gradient block sm:inline">
              Creating Powerful Systems.
            </span>
          </h2>

          <p className="text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Partner directly with us to build resilient digital platforms, enterprise management systems, and high-performance websites.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white font-bold text-base shadow-lg shadow-[#FF914D]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/services"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-base border border-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Our Services</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
