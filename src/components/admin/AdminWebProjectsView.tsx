import React, { useState } from 'react';
import { WebProject } from '../../types';
import { api } from '../../lib/api';
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  Sparkles,
  Check,
  AlertCircle,
  X,
  Save,
  Loader2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  Layers,
  Code2,
  Cpu,
  Server,
  Smartphone,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { ImagePickerField } from './ImagePickerField';

interface AdminWebProjectsViewProps {
  projects: WebProject[];
  onRefresh: () => void;
}

const CATEGORY_PRESETS = [
  { label: 'Website Development', value: 'Website Development', icon: Code2 },
  { label: 'Systems Development', value: 'Systems Development', icon: Cpu },
  { label: 'IT Solutions & Infrastructure', value: 'IT Solutions & Infrastructure', icon: Server },
  { label: 'Enterprise ERP & POS', value: 'Enterprise ERP & POS', icon: Layers },
  { label: 'Hospital Management (HMS)', value: 'Hospital Management (HMS)', icon: ShieldCheck },
  { label: 'School Management System', value: 'School Management System', icon: Layers },
  { label: 'Mobile Application', value: 'Mobile Application', icon: Smartphone },
  { label: 'Cloud & DevOps Architecture', value: 'Cloud & DevOps Architecture', icon: Server },
  { label: 'IT Support & Maintenance', value: 'IT Support & Maintenance', icon: ShieldCheck },
];

const POPULAR_TECHS = [
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Tailwind CSS',
  'Next.js',
  'Python',
  'Docker',
  'Flutter',
  'AWS',
  'Google Cloud',
  'MySQL',
  'Redis',
  'Linux',
  'Express',
  'MongoDB',
  'GraphQL',
  'REST API',
];

export const AdminWebProjectsView: React.FC<AdminWebProjectsViewProps> = ({ projects, onRefresh }) => {
  const [editingProject, setEditingProject] = useState<WebProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');

  const initialNewProject: Partial<WebProject> = {
    title: '',
    category: 'Website Development',
    description: '',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    mainImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [],
    projectUrl: '',
    githubUrl: null,
    isFeatured: false,
    isPublished: true,
    order: projects.length + 1,
  };

  const [formData, setFormData] = useState<Partial<WebProject>>(initialNewProject);

  const handleOpenCreate = () => {
    setFormData({
      ...initialNewProject,
      order: projects.length + 1,
    });
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleOpenEdit = (proj: WebProject) => {
    setFormData({ ...proj, githubUrl: null });
    setEditingProject(proj);
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingProject(null);
  };

  const toggleTech = (tech: string) => {
    const current = formData.technologies || [];
    if (current.includes(tech)) {
      setFormData({
        ...formData,
        technologies: current.filter((t) => t !== tech),
      });
    } else {
      setFormData({
        ...formData,
        technologies: [...current, tech],
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setFeedback({ type: 'error', message: 'Project title is required.' });
      return;
    }
    if (!formData.category?.trim()) {
      setFeedback({ type: 'error', message: 'Project category is required.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const payload = {
        ...formData,
        githubUrl: null,
      };

      if (editingProject) {
        await api.updateWebProject(editingProject.id, payload);
        setFeedback({ type: 'success', message: `Project "${formData.title}" updated successfully!` });
      } else {
        await api.createWebProject(payload);
        setFeedback({ type: 'success', message: `New project "${formData.title}" published live!` });
      }
      handleCloseModal();
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save project.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await api.deleteWebProject(id);
      setFeedback({ type: 'success', message: 'Project removed.' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete project.' });
    }
  };

  const handleTogglePublish = async (proj: WebProject) => {
    setTogglingId(proj.id);
    try {
      await api.updateWebProject(proj.id, { isPublished: !proj.isPublished });
      setFeedback({
        type: 'success',
        message: `Project "${proj.title}" is now ${!proj.isPublished ? 'Live on Website' : 'Draft'}!`,
      });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update visibility.' });
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleFeatured = async (proj: WebProject) => {
    setTogglingId(proj.id);
    try {
      await api.updateWebProject(proj.id, { isFeatured: !proj.isFeatured });
      setFeedback({
        type: 'success',
        message: `Project "${proj.title}" ${!proj.isFeatured ? 'is now Featured' : 'removed from Featured'}.`,
      });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update featured status.' });
    } finally {
      setTogglingId(null);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (statusFilter === 'published' && !p.isPublished) return false;
    if (statusFilter === 'draft' && p.isPublished) return false;
    if (statusFilter === 'featured' && !p.isFeatured) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTech = (p.technologies || []).some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchCat || matchDesc || matchTech;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#155EEF]/10 text-[#155EEF] text-xs font-bold mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>JD Fusion Technologies Portfolio Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
            Projects &amp; Portfolio Manager
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            Publish and manage any project across Website Development, Enterprise Systems, IT Solutions, Infrastructure, Mobile Apps, or custom software builds directly to the website.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
          >
            <span>Live /projects</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Any Project</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search projects by title, category, description, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${projects.length})` },
            { id: 'published', label: `Live (${projects.filter((p) => p.isPublished).length})` },
            { id: 'draft', label: `Draft (${projects.filter((p) => !p.isPublished).length})` },
            { id: 'featured', label: `Featured (${projects.filter((p) => p.isFeatured).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-stone-300 dark:border-zinc-700 space-y-3">
          <Layers className="w-8 h-8 mx-auto text-stone-400" />
          <p className="text-sm font-semibold text-stone-700 dark:text-zinc-300">
            No projects match your filter.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-500 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className={`bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-200 ${
                proj.isPublished
                  ? 'border-stone-200 dark:border-zinc-800 hover:border-[#155EEF]/50'
                  : 'border-stone-300 dark:border-zinc-800 opacity-80'
              }`}
            >
              <div>
                <div className="aspect-video w-full bg-zinc-950 relative overflow-hidden group">
                  <img
                    src={proj.mainImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs border border-white/10">
                      {proj.category}
                    </span>
                  </div>

                  {proj.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-stone-950 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                  )}

                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/70 text-white hover:bg-black transition-colors"
                      title="Open Live Preview"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit']">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(proj.technologies || []).slice(0, 4).map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                    {(proj.technologies || []).length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-stone-400 font-semibold">
                        +{(proj.technologies || []).length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Controls */}
              <div className="p-5 pt-0 border-t border-stone-100 dark:border-zinc-800/80 pt-3 flex items-center justify-between">
                {/* 1-Click Visibility Toggles */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(proj)}
                    disabled={togglingId === proj.id}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      proj.isPublished
                        ? 'text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 dark:text-emerald-400'
                        : 'text-stone-500 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                    title="Click to toggle Live/Draft"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        proj.isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                      }`}
                    />
                    <span>{proj.isPublished ? 'Live on Website' : 'Draft'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(proj)}
                    disabled={togglingId === proj.id}
                    className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      proj.isFeatured
                        ? 'text-amber-700 bg-amber-400/20 hover:bg-amber-400/30 dark:text-amber-300'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200'
                    }`}
                    title="Toggle featured status"
                  >
                    {proj.isFeatured ? '★ Featured' : '☆ Feature'}
                  </button>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 cursor-pointer"
                    title="Edit project details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white text-red-500 cursor-pointer transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal: Add or Edit Any Project */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
                  {editingProject ? 'Edit Project' : 'Publish Any Project to Website'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  Add websites, management systems, enterprise solutions, or custom technology implementations.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title & Category */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Hospital HMS, Nairobi Sacco ERP, Fleet Telematics Engine"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#155EEF]/50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300">
                      Project Category *
                    </label>
                    <span className="text-[10px] text-stone-500">Pick preset or type custom</span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="e.g. Website Development, Systems Development, IT Solutions, Hospital HMS..."
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#155EEF]/50 mb-2 font-medium"
                  />

                  {/* Fast Category Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_PRESETS.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = formData.category === cat.value;
                      return (
                        <button
                          type="button"
                          key={cat.value}
                          onClick={() => setFormData({ ...formData, category: cat.value })}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#155EEF] text-white shadow-xs'
                              : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Project Image */}
              <ImagePickerField
                label="Project Image / Cover * (Supports uploaded photos or Unsplash URLs)"
                value={formData.mainImage || ''}
                onChange={(url) => setFormData({ ...formData, mainImage: url })}
                required
                aspectRatio="video"
                placeholder="https://... or select from gallery"
                helpText="Choose a high-resolution screenshot, device preview, or architectural diagram."
              />

              {/* Live Project / Demo Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Live Project / Demo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example-project.com or https://client-portal.com"
                  value={formData.projectUrl || ''}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#155EEF]/50"
                />
              </div>

              {/* Technology Stack with fast chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300">
                    Technologies &amp; Architecture
                  </label>
                  <span className="text-[10px] text-stone-500">Click presets or edit below</span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800 max-h-24 overflow-y-auto">
                  {POPULAR_TECHS.map((tech) => {
                    const active = (formData.technologies || []).includes(tech);
                    return (
                      <button
                        type="button"
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-[#155EEF] text-white shadow-2xs'
                            : 'bg-white dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700 hover:border-stone-400'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {tech}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Or type comma-separated technologies: React, TypeScript, Node.js, PostgreSQL..."
                  value={(formData.technologies || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technologies: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm text-stone-900 dark:text-white"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the problem solved, business impact, architecture highlights, or key deliverables..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#155EEF]/50"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={formData.isPublished ?? true}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Publish Live on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Featured Project</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-orange-400 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Project...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Go Live</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
