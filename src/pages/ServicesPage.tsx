import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicSiteData } from '../types';
import { PageBackground } from '../components/common/PageBackground';
import {
  OFFICIAL_SERVICE_CATALOGUE,
  CatalogueCategory,
  CatalogueSubcategory,
  searchCatalogue,
} from '../data/serviceCatalogue';
import {
  Globe,
  Cpu,
  Wrench,
  Sparkles,
  Search,
  X,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Layers,
  ShieldCheck,
  Server,
  Code2,
  Laptop,
  Check,
  ExternalLink,
  Filter,
  Info,
  Star,
} from 'lucide-react';
import { DynamicIcon } from '../components/common/DynamicIcon';

interface ServicesPageProps {
  data: PublicSiteData;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ data }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<{
    category: CatalogueCategory;
    subcategory: CatalogueSubcategory;
  } | null>(null);

  // Expanded subcategory accordions for supporting divisions
  const [expandedSubcategoryIds, setExpandedSubcategoryIds] = useState<Record<string, boolean>>({
    'computer-hardware-support': true,
    'domain-hosting-email-solutions': true,
  });

  const toggleSubcategoryExpand = (subId: string) => {
    setExpandedSubcategoryIds((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCatalogue(searchQuery);
  }, [searchQuery]);

  // Primary Divisions (Website Development & Systems Development)
  const primaryDivisions = useMemo(() => {
    return OFFICIAL_SERVICE_CATALOGUE.filter((c) => c.isPrimary);
  }, []);

  // Supporting Divisions (IT Support & IT Solutions)
  const supportingDivisions = useMemo(() => {
    return OFFICIAL_SERVICE_CATALOGUE.filter((c) => !c.isPrimary);
  }, []);

  // Live Active Services from CMS Database
  const liveServices = useMemo(() => {
    return (data?.services || []).filter((s) => s.isPublished !== false);
  }, [data?.services]);

  const filteredLiveServices = useMemo(() => {
    if (activeCategoryFilter === 'all') return liveServices;
    return liveServices.filter((s) => {
      const cat = (s.category || '').toLowerCase();
      if (activeCategoryFilter === 'website-development') return cat.includes('web');
      if (activeCategoryFilter === 'systems-development') return cat.includes('system');
      if (activeCategoryFilter === 'it-support') return cat.includes('support');
      if (activeCategoryFilter === 'it-solutions') return cat.includes('solution') || cat.includes('cyber');
      return cat.includes(activeCategoryFilter.toLowerCase());
    });
  }, [liveServices, activeCategoryFilter]);

  const handleInquireForService = (serviceName: string) => {
    navigate(`/contact?service=${encodeURIComponent(serviceName)}`);
  };

  const scrollToDivision = (divisionId: string) => {
    setActiveCategoryFilter(divisionId);
    const element = document.getElementById(divisionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-white text-stone-900 transition-colors duration-300">
      {/* Background Ambience */}
      <PageBackground variant="services" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* ========================================================= */}
        {/* 1. HERO HEADER: CATALOGUE OVERVIEW & SEARCH               */}
        {/* ========================================================= */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
            <span>Where Ideas Become Innovation.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black font-['Outfit'] tracking-tight leading-[1.15]">
            Engineering Digital Experiences.{' '}
            <span className="text-gradient">Creating Powerful Systems.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
            JD Fusion Technologies specializes primarily in <strong className="text-stone-900 font-bold">Website Development</strong> and{' '}
            <strong className="text-stone-900 font-bold">Systems Development</strong>, backed by dedicated{' '}
            <span className="text-stone-700 font-semibold">IT Support</span> and{' '}
            <span className="text-stone-700 font-semibold">IT Solutions</span> divisions. Explore all 33 recognized subcategories below.
          </p>

          {/* Real-Time Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 33+ services (e.g., e-commerce, school management, CCTV, hosting, KRA, POS)..."
                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border-2 border-stone-200 text-stone-900 placeholder-stone-400 text-sm sm:text-base focus:outline-hidden focus:border-[#155EEF] focus:ring-4 focus:ring-[#155EEF]/10 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="mt-2 text-xs font-medium text-stone-500 text-left px-2 flex items-center justify-between">
                <span>
                  Found <strong className="text-[#155EEF] font-bold">{searchResults.length}</strong> matching subcategories for &ldquo;{searchQuery}&rdquo;
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-stone-500 hover:text-[#155EEF] underline cursor-pointer"
                >
                  Reset view
                </button>
              </div>
            )}
          </div>

          {/* Quick-Jump Category Navigation Tabs */}
          {!searchQuery && (
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setActiveCategoryFilter('all');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategoryFilter === 'all'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                All Divisions (33)
              </button>

              <button
                onClick={() => scrollToDivision('website-development')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryFilter === 'website-development'
                    ? 'bg-[#155EEF] text-white shadow-sm shadow-[#155EEF]/25'
                    : 'bg-[#155EEF]/10 hover:bg-[#155EEF]/20 text-[#155EEF] border border-[#155EEF]/30'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>1. Website Development (8)</span>
              </button>

              <button
                onClick={() => scrollToDivision('systems-development')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryFilter === 'systems-development'
                    ? 'bg-[#155EEF] text-white shadow-sm shadow-[#155EEF]/25'
                    : 'bg-[#155EEF]/10 hover:bg-[#155EEF]/20 text-[#155EEF] border border-[#155EEF]/30'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>2. Systems Development (10)</span>
              </button>

              <button
                onClick={() => scrollToDivision('it-support')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryFilter === 'it-support'
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                <Wrench className="w-4 h-4 text-stone-500" />
                <span>3. IT Support (7)</span>
              </button>

              <button
                onClick={() => scrollToDivision('it-solutions')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryFilter === 'it-solutions'
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#FF914D]" />
                <span>4. IT Solutions (8)</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* LIVE ACTIVE SERVICES & SOLUTIONS (LIVE SYNC FROM CMS)     */}
        {/* ========================================================= */}
        {!searchQuery && filteredLiveServices.length > 0 && (
          <section className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Services &amp; Deployments ({filteredLiveServices.length})</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-['Outfit'] tracking-tight">
                  Engineering Solutions &amp; Systems
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
                  Bespoke software, management systems, and technical architectures managed directly by JD Fusion Technologies.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Live to website</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLiveServices.map((service) => (
                <div
                  key={service.id}
                  className="p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-[#155EEF]/50 transition-all duration-300 flex flex-col justify-between space-y-6 group relative overflow-hidden"
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center font-bold group-hover:bg-[#155EEF] group-hover:text-white group-hover:scale-105 transition-all shadow-xs">
                        <DynamicIcon name={service.iconName || 'Globe'} className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {service.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                            <Star className="w-3 h-3 fill-orange-500" />
                            <span>Featured</span>
                          </span>
                        )}

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
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
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-black font-['Outfit'] group-hover:text-[#155EEF] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        {service.shortDescription}
                      </p>
                      {service.fullDescription && service.fullDescription !== service.shortDescription && (
                        <p className="text-xs text-stone-500 mt-2 leading-relaxed line-clamp-3">
                          {service.fullDescription}
                        </p>
                      )}
                    </div>

                    {/* Features checklist */}
                    {service.features && service.features.length > 0 && (
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                          Included Deliverables:
                        </span>
                        <div className="space-y-1.5">
                          {service.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between relative z-10">
                    <button
                      onClick={() => handleInquireForService(service.title)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-[#155EEF] text-white text-xs font-bold transition-all shadow-sm cursor-pointer group-hover:bg-[#155EEF]"
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* SEARCH RESULTS VIEW (IF SEARCH QUERY ACTIVE)              */}
        {/* ========================================================= */}
        {searchQuery.trim() !== '' && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="text-xl font-bold font-['Outfit'] text-stone-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#155EEF]" />
                <span>Search Results for &ldquo;{searchQuery}&rdquo;</span>
              </h2>
              <span className="text-xs text-stone-500">Showing {searchResults.length} subcategories</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 bg-stone-50 rounded-3xl border border-dashed border-stone-300 p-8 space-y-3">
                <p className="text-base font-semibold text-stone-700">No matching service found for &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Try searching for terms like &ldquo;e-commerce&rdquo;, &ldquo;hospital&rdquo;, &ldquo;school&rdquo;, &ldquo;POS&rdquo;, &ldquo;cabling&rdquo;, &ldquo;domain&rdquo;, or &ldquo;KRA&rdquo;.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold cursor-pointer"
                >
                  View Complete Catalogue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(({ category, subcategory, matchSnippet }) => (
                  <div
                    key={`${category.id}-${subcategory.id}`}
                    className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-lg hover:border-[#155EEF]/50 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          {category.title}
                        </span>
                        {category.isPrimary && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#155EEF]/10 text-[#155EEF]">
                            Core Practice
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-black font-['Outfit'] leading-snug">
                        {subcategory.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {subcategory.tagline}
                      </p>

                      <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900">
                        <span className="font-bold block text-[10px] uppercase tracking-wider text-blue-700 mb-0.5">Match:</span>
                        <span className="line-clamp-2">{matchSnippet}</span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-stone-700 block">Includes:</span>
                        <ul className="text-xs text-stone-600 space-y-1">
                          {subcategory.servicesIncluded.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedSubcategory({ category, subcategory })}
                        className="text-xs font-bold text-[#155EEF] hover:underline cursor-pointer"
                      >
                        View Full Scope &rarr;
                      </button>

                      <button
                        onClick={() => handleInquireForService(`${category.title}: ${subcategory.title}`)}
                        className="px-3.5 py-2 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        Inquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. PRIMARY BUSINESS PRIORITIES (WEBSITE & SYSTEMS)        */}
        {/*    STRONGEST VISUAL EMPHASIS                              */}
        {/* ========================================================= */}
        {!searchQuery && (
          <div className="space-y-24">
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-7 rounded-full bg-[#155EEF]" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-extrabold text-[#155EEF]">
                    Core Business Engineering Priorities
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-['Outfit'] tracking-tight">
                    Website Development &amp; Systems Development
                  </h2>
                </div>
              </div>

              {/* RENDER CORE DIVISIONS */}
              <div className="space-y-16">
                {primaryDivisions.map((category, catIdx) => {
                  const isWeb = category.id === 'website-development';
                  const Icon = isWeb ? Globe : Cpu;

                  return (
                    <div
                      key={category.id}
                      id={category.id}
                      className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-white border-2 border-stone-200/90 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-[#155EEF]/50 scroll-mt-24"
                    >
                      {/* Top Ambient Glow Pill */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-[#155EEF]/5 rounded-full blur-3xl pointer-events-none" />

                      {/* Division Header Header Banner */}
                      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-stone-200">
                        <div className="space-y-3 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-[#155EEF] text-white font-bold text-xs flex items-center justify-center">
                              {catIdx + 1}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-extrabold tracking-wide uppercase">
                              <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
                              <span>Core Practice</span>
                            </span>
                            <span className="text-xs text-stone-500 font-semibold">
                              {category.subcategories.length} Specialized Subcategories
                            </span>
                          </div>

                          <h3 className="text-3xl sm:text-4xl font-extrabold text-black font-['Outfit'] tracking-tight">
                            {category.title}
                          </h3>

                          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                            {category.overview}
                          </p>
                        </div>

                        {/* CTA Cluster */}
                        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 self-start lg:self-center">
                          <button
                            onClick={() => handleInquireForService(category.title)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF914D]/25 transition-all cursor-pointer"
                          >
                            <span>Scope {category.shortName} Project</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/services/${category.id}`}
                            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all"
                          >
                            <span>Dedicated {category.shortName} View</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Subcategories Grid: Grouped Cards & Lists */}
                      <div className="relative z-10 pt-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-stone-500">
                            Recognized Subcategories &amp; Complete Deliverables ({category.subcategories.length})
                          </h4>
                          <span className="text-xs text-stone-400 font-medium hidden sm:inline">
                            Click any subcategory for full technical scope
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                          {category.subcategories.map((subcat, sIdx) => (
                            <div
                              key={subcat.id}
                              className="group p-6 rounded-2xl bg-stone-50/70 hover:bg-white border border-stone-200 hover:border-[#155EEF]/50 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-mono font-bold text-[#155EEF] bg-[#155EEF]/10 px-2 py-0.5 rounded-md">
                                    0{sIdx + 1}
                                  </span>
                                  <span className="text-[10px] text-stone-400 font-medium">
                                    {subcat.servicesIncluded.length} deliverables
                                  </span>
                                </div>

                                <h5 className="font-bold text-base text-black font-['Outfit'] group-hover:text-[#155EEF] transition-colors leading-snug">
                                  {subcat.title}
                                </h5>

                                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                                  {subcat.tagline}
                                </p>

                                {/* Grouped Deliverables List */}
                                <div className="pt-2 border-t border-stone-200/60 space-y-2">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block">
                                    Services Included:
                                  </span>
                                  <ul className="text-xs text-stone-700 space-y-1.5">
                                    {subcat.servicesIncluded.slice(0, 3).map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 text-[11px]">{item}</span>
                                      </li>
                                    ))}
                                    {subcat.servicesIncluded.length > 3 && (
                                      <li className="text-[11px] font-semibold text-[#155EEF] pt-0.5">
                                        + {subcat.servicesIncluded.length - 3} more items included
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2">
                                <button
                                  onClick={() => setSelectedSubcategory({ category, subcategory: subcat })}
                                  className="text-xs font-bold text-stone-700 hover:text-[#155EEF] transition-colors cursor-pointer"
                                >
                                  View Scope &rarr;
                                </button>
                                <button
                                  onClick={() => handleInquireForService(`${category.title}: ${subcat.title}`)}
                                  className="px-2.5 py-1.5 rounded-lg bg-stone-200/70 hover:bg-[#FF914D] hover:text-white text-stone-800 text-[11px] font-bold transition-all cursor-pointer"
                                  title="Inquire about this subcategory"
                                >
                                  Inquire
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================= */}
            {/* 3. SUPPORTING SERVICE DIVISIONS                           */}
            {/*    (IT SUPPORT & IT SOLUTIONS)                            */}
            {/* ========================================================= */}
            <div className="relative pt-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-7 rounded-full bg-stone-400" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-extrabold text-stone-500">
                    Supporting Service Divisions
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-['Outfit'] tracking-tight">
                    IT Support &amp; IT Solutions
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Operational infrastructure, hardware helpdesk, cloud architecture, and ongoing technical maintenance.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {supportingDivisions.map((category, catIdx) => {
                  const isSupport = category.id === 'it-support';
                  const Icon = isSupport ? Wrench : Sparkles;

                  return (
                    <div
                      key={category.id}
                      id={category.id}
                      className="p-8 rounded-3xl bg-stone-50/90 border border-stone-200 shadow-sm relative overflow-hidden transition-all duration-300 hover:border-stone-300 scroll-mt-24"
                    >
                      {/* Division Header */}
                      <div className="pb-6 border-b border-stone-200 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-200/80 text-stone-700 text-xs font-bold uppercase tracking-wider">
                            <Icon className="w-3.5 h-3.5 text-stone-600" />
                            <span>Supporting Division</span>
                          </span>
                          <span className="text-xs font-semibold text-stone-500">
                            {category.subcategories.length} Specialized Practices
                          </span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-black font-['Outfit'] tracking-tight">
                          {catIdx + 3}. {category.title}
                        </h3>

                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                          {category.overview}
                        </p>
                      </div>

                      {/* Grouped Accordion / List for Supporting Services */}
                      <div className="pt-6 space-y-3">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                          All Recognized Services in {category.title}:
                        </div>

                        {category.subcategories.map((subcat, sIdx) => {
                          const isExpanded = !!expandedSubcategoryIds[subcat.id];

                          return (
                            <div
                              key={subcat.id}
                              className="rounded-2xl bg-white border border-stone-200/90 overflow-hidden transition-all duration-200 shadow-2xs"
                            >
                              {/* Subcategory Accordion Header */}
                              <button
                                onClick={() => toggleSubcategoryExpand(subcat.id)}
                                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-3 pr-2">
                                  <span className="w-6 h-6 rounded-md bg-stone-100 text-stone-600 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                                    {sIdx + 1}
                                  </span>
                                  <div>
                                    <h4 className="font-bold text-sm text-stone-900 font-['Outfit']">
                                      {subcat.title}
                                    </h4>
                                    <p className="text-[11px] text-stone-500 line-clamp-1">
                                      {subcat.tagline}
                                    </p>
                                  </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-2">
                                  <span className="text-[10px] text-stone-400 hidden sm:inline">
                                    {subcat.servicesIncluded.length} items
                                  </span>
                                  <ChevronDown
                                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                                      isExpanded ? 'rotate-180 text-stone-800' : ''
                                    }`}
                                  />
                                </div>
                              </button>

                              {/* Expanded Breakdown */}
                              {isExpanded && (
                                <div className="px-5 pb-5 pt-1 border-t border-stone-100 bg-stone-50/30 space-y-3 animate-in fade-in duration-150">
                                  <p className="text-xs text-stone-600 leading-relaxed">
                                    {subcat.description}
                                  </p>

                                  <div className="space-y-1.5 pt-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block">
                                      Included Deliverables:
                                    </span>
                                    <ul className="text-xs text-stone-700 space-y-1">
                                      {subcat.servicesIncluded.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                          <span className="text-[11px]">{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="pt-2 flex items-center justify-between border-t border-stone-200/60 text-xs">
                                    <button
                                      onClick={() => setSelectedSubcategory({ category, subcategory: subcat })}
                                      className="text-xs font-bold text-[#155EEF] hover:underline cursor-pointer"
                                    >
                                      Complete Details &rarr;
                                    </button>

                                    <button
                                      onClick={() => handleInquireForService(`${category.title}: ${subcat.title}`)}
                                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-black text-white text-[11px] font-bold transition-colors cursor-pointer"
                                    >
                                      Request Support / Quote
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Division Footer CTA */}
                      <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between">
                        <span className="text-xs text-stone-500">
                          Need customized SLA support?
                        </span>
                        <button
                          onClick={() => handleInquireForService(category.title)}
                          className="text-xs font-bold text-[#155EEF] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Inquire About {category.shortName}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. MODAL: DETAILED SUBCATEGORY BREAKDOWN & INQUIRY        */}
        {/* ========================================================= */}
        {selectedSubcategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-200">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {selectedSubcategory.category.title}
                    </span>
                    {selectedSubcategory.category.isPrimary ? (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#155EEF]/10 text-[#155EEF]">
                        Core Practice
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                        Supporting Division
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold text-black font-['Outfit']">
                    {selectedSubcategory.subcategory.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {selectedSubcategory.subcategory.tagline}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Service Overview</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {selectedSubcategory.subcategory.description}
                </p>
              </div>

              {/* All Services Included */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Comprehensive Services &amp; Deliverables Included ({selectedSubcategory.subcategory.servicesIncluded.length}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSubcategory.subcategory.servicesIncluded.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2 text-xs text-stone-800"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience & Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Ideal For / Target Clients:
                  </span>
                  <p className="text-xs text-stone-800 font-medium">
                    {selectedSubcategory.subcategory.targetAudience}
                  </p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-stone-500">
                  Need a custom scope proposal?
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const serviceTitle = `${selectedSubcategory.category.title}: ${selectedSubcategory.subcategory.title}`;
                      setSelectedSubcategory(null);
                      handleInquireForService(serviceTitle);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white text-xs font-bold shadow-md shadow-[#FF914D]/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Inquire About This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. BOTTOM CTA BANNER: PROPOSAL & CUSTOM CONSULTATION      */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-black text-white p-8 sm:p-12 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#155EEF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 max-w-2xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF914D]">
              Direct Founder Scoping &amp; Transparent Delivery
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight">
              Ready to Scope Your Website or Enterprise System?
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Whether you need a high-conversion e-commerce platform, a hospital management system, structured office cabling, or KRA e-government solutions, our team delivers with zero agency overhead.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white font-bold text-sm shadow-lg shadow-[#FF914D]/25 transition-all cursor-pointer text-center"
            >
              Let&apos;s Work Together &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
