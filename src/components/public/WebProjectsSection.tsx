import React, { useState } from 'react';
import { WebProject } from '../../types';
import { ExternalLink, ArrowUpRight, Code, Eye, Layers, Sparkles } from 'lucide-react';
import { ProjectImageCarousel } from '../common/ProjectImageCarousel';

interface WebProjectsSectionProps {
  projects?: WebProject[];
  onOpenProject?: (project: WebProject) => void;
  onViewProjectDetails?: (project: WebProject) => void;
  onInquire?: () => void;
}

export const WebProjectsSection: React.FC<WebProjectsSectionProps> = ({
  projects = [],
  onOpenProject,
  onViewProjectDetails,
  onInquire,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleOpen = (project: WebProject) => {
    if (onViewProjectDetails) {
      onViewProjectDetails(project);
    } else if (onOpenProject) {
      onOpenProject(project);
    }
  };

  // Extract unique categories
  const categories: string[] = ['All', ...Array.from<string>(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="web-projects" className="py-24 bg-stone-50 dark:bg-[#12100E] relative overflow-hidden transition-colors duration-300">
      {/* Subtle Ambient Grid Texture */}
      <div className="absolute inset-0 bg-ambient-grid mask-radial-fade opacity-50 dark:opacity-30 pointer-events-none" />

      {/* Subtle Blue/Orange Ambient Light */}
      <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold shadow-xs">
              <Code className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Full-Stack Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white font-['Outfit'] tracking-tight">
              Featured Projects &amp; Portfolio
            </h2>
            <p className="text-stone-600 dark:text-zinc-400 text-base">
              Explore bespoke business platforms, enterprise management systems, and IT infrastructure engineered by JD Fusion Technologies.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`web-cat-filter-${(cat || '').toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-black text-black dark:text-white hover:bg-stone-100 dark:hover:bg-zinc-900 border border-black/10 dark:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`web-project-card-${project.id}`}
              className="group rounded-2xl bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xs border border-stone-200/90 dark:border-zinc-800 overflow-hidden flex flex-col justify-between card-hover-effect hover:border-orange-500/50 dark:hover:border-orange-500/50"
            >
              
              {/* Media Preview Box */}
              <div
                className="relative aspect-video w-full bg-zinc-950 overflow-hidden cursor-pointer"
                onClick={() => handleOpen(project)}
              >
                <ProjectImageCarousel
                  mainImage={project.mainImage}
                  additionalImages={project.additionalImages}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-orange-400" />
                    <span>View Details</span>
                  </span>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-900/80 text-white backdrop-blur-md border border-white/10">
                    {project.category}
                  </span>
                </div>

                {project.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/95 text-stone-950 flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <h3
                    onClick={() => handleOpen(project)}
                    className="text-lg font-bold text-stone-900 dark:text-white font-['Outfit'] hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>



                {/* Action Links */}
                <div className="pt-4 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleOpen(project)}
                    className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 group/btn cursor-pointer"
                  >
                    <span>Inspect Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors"
                        title="Live Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-stone-900 via-zinc-900 to-stone-900 text-white p-8 sm:p-10 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">
              Need a Custom Web Platform Built For Your Organization?
            </h3>
            <p className="text-stone-400 text-sm max-w-xl">
              We design and deliver robust, scalable digital solutions with rapid turnaround and dependable support from concept to launch.
            </p>
          </div>
          <button
            onClick={onInquire || (() => {
              const el = document.getElementById('inquiry');
              el?.scrollIntoView({ behavior: 'smooth' });
            })}
            className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-md hover:shadow-orange-500/25 transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-98 relative z-10"
          >
            Let's Work Together
          </button>
        </div>

      </div>
    </section>
  );
};
