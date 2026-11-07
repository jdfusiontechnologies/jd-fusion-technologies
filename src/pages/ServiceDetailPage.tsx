import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageBackground } from '../components/common/PageBackground';
import {
  OFFICIAL_SERVICE_CATALOGUE,
  getCategoryById,
  CatalogueCategory,
  CatalogueSubcategory,
} from '../data/serviceCatalogue';
import {
  Globe,
  Cpu,
  Wrench,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  ArrowLeft,
  Terminal,
  HelpCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  // Normalize slug to match official category ids
  let normalizedSlug = (slug || 'website-development').toLowerCase();
  if (normalizedSlug === 'web-development') normalizedSlug = 'website-development';
  if (normalizedSlug === 'systems-design') normalizedSlug = 'systems-development';
  if (normalizedSlug === 'it-support-digital-solutions') normalizedSlug = 'it-support';
  if (normalizedSlug === 'cyber-security' || normalizedSlug === 'cloud-infrastructure') {
    normalizedSlug = 'it-solutions';
  }

  const category: CatalogueCategory =
    getCategoryById(normalizedSlug) || OFFICIAL_SERVICE_CATALOGUE[0];

  const iconMap: Record<string, React.ElementType> = {
    Globe,
    Cpu,
    Wrench,
    Sparkles,
  };

  const IconComponent = iconMap[category.iconName] || Globe;

  const toggleSubcategory = (id: string) => {
    setExpandedSubcategory((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-white text-stone-900 transition-colors duration-300">
      <PageBackground variant="services" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/services" className="hover:text-black transition-colors">
            Services
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#155EEF] font-bold">{category.title}</span>
        </nav>

        {/* Back Link */}
        <div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#155EEF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Complete Catalogue</span>
          </Link>
        </div>

        {/* Category Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`text-xs font-extrabold uppercase px-3 py-1 rounded-md ${
                category.isPrimary
                  ? 'bg-[#155EEF]/10 text-[#155EEF] border border-[#155EEF]/20'
                  : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {category.priorityLabel}
            </span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs font-semibold text-stone-500">
              Where Ideas Become Innovation.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                category.isPrimary ? 'bg-[#155EEF]/10 text-[#155EEF]' : 'bg-stone-100 text-stone-700'
              }`}
            >
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black font-['Outfit'] tracking-tight">
                {category.title}
              </h1>
              <p className="text-xs font-mono text-stone-400 mt-1">
                {category.subcategories.length} Specialized Subcategories Recognized
              </p>
            </div>
          </div>

          <p className="text-lg sm:text-xl text-stone-600 max-w-3xl leading-relaxed font-normal">
            {category.tagline}
          </p>
        </div>

        {/* Overview Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-stone-50 border border-stone-200 space-y-6">
          <h2 className="text-xl font-bold text-black font-['Outfit']">
            Division Scope &amp; Architecture Overview
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            {category.overview}
          </p>

          <div className="pt-4 border-t border-stone-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-3">
              Recognized Subcategories Included in this Division
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-stone-700">
              {category.subcategories.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{sub.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comprehensive Subcategory List (Organized Groups) */}
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-black font-['Outfit']">
              All {category.subcategories.length} Subcategories &amp; Included Services
            </h2>
            <span className="text-xs text-stone-500 font-medium">Click to inspect deliverables</span>
          </div>

          <div className="space-y-4">
            {category.subcategories.map((sub: CatalogueSubcategory, idx: number) => {
              const isExpanded = expandedSubcategory === sub.id;

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:border-[#155EEF]/50 transition-all"
                >
                  <button
                    onClick={() => toggleSubcategory(sub.id)}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-hidden"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#155EEF]">
                          0{idx + 1}
                        </span>
                        <h3 className="font-bold text-lg text-black font-['Outfit']">
                          {sub.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600">
                        {sub.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <span className="text-xs font-semibold text-[#155EEF] hidden sm:inline">
                        {isExpanded ? 'Hide Details' : 'View Services'}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[#155EEF]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Content Drawer */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-stone-50/50 space-y-5 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        {sub.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Services Included */}
                        <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                            Included Services &amp; Deliverables:
                          </span>
                          <ul className="space-y-2 text-xs text-stone-700">
                            {sub.servicesIncluded.map((s, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Audience & Key Highlights */}
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-1.5">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                              Target Audience:
                            </span>
                            <p className="text-xs text-stone-700 leading-relaxed font-medium">
                              {sub.targetAudience}
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                              Key Highlights:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {sub.keyHighlights.map((h, hIdx) => (
                                <span
                                  key={hIdx}
                                  className="text-[11px] px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-700"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 flex flex-wrap items-center justify-end gap-3">

                        <button
                          onClick={() =>
                            navigate('/contact', {
                              state: { prefilledService: `${category.title} - ${sub.title}` },
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Inquire About This Service</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Division Switcher */}
        <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            Explore Other Service Divisions:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {OFFICIAL_SERVICE_CATALOGUE.filter((c) => c.id !== category.id).map((other) => (
              <Link
                key={other.id}
                to={`/services/${other.id}`}
                className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#155EEF] hover:shadow-xs transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900 group-hover:text-[#155EEF] transition-colors">
                    {other.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[11px] text-stone-500 block">
                  {other.priorityLabel} · {other.subcategories.length} Subcategories
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Direct Consultation CTA Box */}
        <div className="rounded-3xl bg-black text-white p-8 sm:p-12 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF914D]">
              Where Ideas Become Innovation.
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              Ready to begin your {category.title} project?
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Schedule a technical scoping consultation with us. Transparent scope, zero fluff.
            </p>
          </div>

          <button
            onClick={() =>
              navigate('/contact', {
                state: { prefilledService: category.title },
              })
            }
            className="px-8 py-4 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white font-bold text-sm shadow-lg shadow-[#FF914D]/25 transition-all cursor-pointer shrink-0"
          >
            Start a Consultation &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
