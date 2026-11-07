import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicSiteData, WebProject } from '../types';
import { PageBackground } from '../components/common/PageBackground';
import {
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Server,
} from 'lucide-react';

interface ProjectsPageProps {
  data: PublicSiteData;
  onSelectWebProject: (project: WebProject) => void;
  onSelectGraphicImage?: (item: { imageUrl: string; title: string; category: string }) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  data,
  onSelectWebProject,
}) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const allProjects = (data.webProjects || []).filter((p) => p.isPublished);

  // Extract unique categories dynamically from published projects
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    allProjects.forEach((p) => {
      if (p.category && p.category.trim()) cats.add(p.category.trim());
    });
    return Array.from(cats);
  }, [allProjects]);

  const filteredProjects = allProjects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category.toLowerCase().trim() === activeFilter.toLowerCase().trim();
  });

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-white text-stone-900 transition-colors duration-300">
      <PageBackground variant="services" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
            <span>Where Ideas Become Innovation.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black font-['Outfit'] tracking-tight">
            Our Projects &amp; Portfolio
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            A curated showcase of our engineering work across Website Development, Systems Development, and Enterprise IT Infrastructure.
          </p>

          {/* Interactive Filter Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#155EEF] text-white shadow-md shadow-[#155EEF]/25'
                  : 'bg-stone-100 text-stone-700 hover:text-black hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Projects ({allProjects.length})</span>
            </button>

            {availableCategories.map((cat) => {
              const isActive = activeFilter.toLowerCase() === cat.toLowerCase();
              const count = allProjects.filter(
                (p) => p.category.toLowerCase().trim() === cat.toLowerCase().trim()
              ).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#155EEF] text-white shadow-md shadow-[#155EEF]/25'
                      : 'bg-stone-100 text-stone-700 hover:text-black hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#155EEF]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div
                className="aspect-16/10 overflow-hidden relative bg-stone-900 cursor-pointer"
                onClick={() => onSelectWebProject(p)}
              >
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
                    <span>Featured Project</span>
                  </div>

                  <h3
                    onClick={() => onSelectWebProject(p)}
                    className="text-xl font-bold text-black font-['Outfit'] hover:text-[#155EEF] transition-colors cursor-pointer"
                  >
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectWebProject(p)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#124ec4] transition-colors cursor-pointer"
                  >
                    <span>View Project Overview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      navigate('/contact', {
                        state: { prefilledService: `Project Consultation: ${p.title}` },
                      })
                    }
                    className="text-xs font-semibold text-[#FF914D] hover:underline cursor-pointer"
                  >
                    Request Similar Build &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Consultation Banner */}
        <div className="rounded-3xl bg-black text-white p-8 sm:p-12 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF914D]">
              Where Ideas Become Innovation.
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              Planning a complex website or enterprise software system?
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              We provide rapid architectural scoping, requirements analysis, and milestone roadmaps. Reach out directly to us.
            </p>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white font-bold text-sm shadow-lg shadow-[#FF914D]/25 transition-all shrink-0 cursor-pointer"
          >
            Start Technical Consultation &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
