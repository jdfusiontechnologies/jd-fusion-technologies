import React, { useState, useMemo } from 'react';
import { ServiceItem } from '../../types';
import { api } from '../../lib/api';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  AlertCircle,
  X,
  Save,
  Loader2,
  Globe,
  Cpu,
  Wrench,
  Server,
  Database,
  Code2,
  ExternalLink,
  Filter,
  Star,
  CheckCircle2,
  Search,
  Radio,
} from 'lucide-react';

interface AdminServicesViewProps {
  services: ServiceItem[];
  onRefresh: () => void;
}

const POPULAR_ICONS = [
  'Globe',
  'Code2',
  'Cpu',
  'Database',
  'Server',
  'Layers',
  'ShieldCheck',
  'Wrench',
  'Sparkles',
  'Laptop',
  'Settings',
  'Cloud',
  'Lock',
  'Workflow',
  'Network',
  'HardDrive',
  'Terminal',
  'Smartphone',
];

const PRESET_CATEGORIES = [
  { id: 'website-development', label: 'Website Development' },
  { id: 'systems-development', label: 'Systems Development' },
  { id: 'it-solutions', label: 'IT Solutions' },
  { id: 'it-support', label: 'IT Support' },
  { id: 'custom', label: 'Custom / Other Service' },
];

export const AdminServicesView: React.FC<AdminServicesViewProps> = ({ services, onRefresh }) => {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filters in Admin
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Form State
  const [selectedCategoryPreset, setSelectedCategoryPreset] = useState<string>('website-development');
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');

  const initialNewService: Partial<ServiceItem> = {
    title: '',
    category: 'website-development',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Globe',
    features: ['Bespoke Architecture', 'High Performance', 'Full Integration'],
    isFeatured: false,
    isPublished: true,
    order: (services?.length || 0) + 1,
  };

  const [formData, setFormData] = useState<Partial<ServiceItem>>(initialNewService);

  const handleOpenCreate = () => {
    setSelectedCategoryPreset('website-development');
    setCustomCategoryInput('');
    setFormData({
      ...initialNewService,
      category: 'website-development',
      order: (services?.length || 0) + 1,
    });
    setIsCreating(true);
    setEditingService(null);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    const isPreset = PRESET_CATEGORIES.some((p) => p.id !== 'custom' && p.id === service.category);
    if (isPreset) {
      setSelectedCategoryPreset(service.category);
      setCustomCategoryInput('');
    } else {
      setSelectedCategoryPreset('custom');
      setCustomCategoryInput(service.category);
    }

    setFormData({ ...service });
    setEditingService(service);
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingService(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    // Resolve final category
    const finalCategory =
      selectedCategoryPreset === 'custom'
        ? (customCategoryInput.trim() || 'Custom Solution')
        : selectedCategoryPreset;

    const payload = {
      ...formData,
      category: finalCategory,
    };

    try {
      if (editingService) {
        await api.updateService(editingService.id, payload);
        setFeedback({
          type: 'success',
          message: `Service "${payload.title}" updated successfully and updated live on the website!`,
        });
      } else {
        await api.createService(payload);
        setFeedback({
          type: 'success',
          message: `New service "${payload.title}" created successfully and published live!`,
        });
      }
      handleCloseModal();
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save service.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (service: ServiceItem) => {
    try {
      const updated = { ...service, isPublished: !service.isPublished };
      await api.updateService(service.id, updated);
      setFeedback({
        type: 'success',
        message: `"${service.title}" is now ${updated.isPublished ? 'Live on the website' : 'set to Draft (hidden)'}!`,
      });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update live status.' });
    }
  };

  const handleToggleFeatured = async (service: ServiceItem) => {
    try {
      const updated = { ...service, isFeatured: !service.isFeatured };
      await api.updateService(service.id, updated);
      setFeedback({
        type: 'success',
        message: `"${service.title}" ${updated.isFeatured ? 'is now featured on Homepage' : 'unfeatured'}.`,
      });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update featured status.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from website services?`)) return;
    try {
      await api.deleteService(id);
      setFeedback({ type: 'success', message: `Service "${title}" removed successfully.` });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete service.' });
    }
  };

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return (services || []).filter((s) => {
      // Status filter
      if (statusFilter === 'published' && !s.isPublished) return false;
      if (statusFilter === 'draft' && s.isPublished) return false;

      // Category filter
      if (categoryFilter !== 'all') {
        const cat = (s.category || '').toLowerCase();
        if (categoryFilter === 'web' && !cat.includes('web')) return false;
        if (categoryFilter === 'systems' && !cat.includes('system')) return false;
        if (categoryFilter === 'solution' && !cat.includes('solution') && !cat.includes('cyber')) return false;
        if (categoryFilter === 'support' && !cat.includes('support')) return false;
      }

      // Search query
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(query);
        const matchesCat = (s.category || '').toLowerCase().includes(query);
        const matchesDesc = (s.shortDescription || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCat && !matchesDesc) return false;
      }

      return true;
    });
  }, [services, statusFilter, categoryFilter, searchFilter]);

  const liveCount = (services || []).filter((s) => s.isPublished).length;
  const featuredCount = (services || []).filter((s) => s.isFeatured).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
              Services &amp; Offerings Manager
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync Active
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Add or update any service (Website, System, IT Solution, IT Support, or custom capability). Any change updates live to the website immediately.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <a
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
            title="Open Public Website Services Page"
          >
            <span>Preview on Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 block font-medium">Total Services</span>
            <span className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">{services?.length || 0}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Globe className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 block font-medium">Live on Website</span>
            <span className="text-lg font-bold font-['Outfit'] text-emerald-600 dark:text-emerald-400">{liveCount}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 block font-medium">Featured on Home</span>
            <span className="text-lg font-bold font-['Outfit'] text-orange-600 dark:text-orange-400">{featuredCount}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Star className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 block font-medium">Drafts (Hidden)</span>
            <span className="text-lg font-bold font-['Outfit'] text-stone-600 dark:text-zinc-400">
              {(services?.length || 0) - liveCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-500 flex items-center justify-center font-bold">
            <EyeOff className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Action / Notification Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
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
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search services by title, category, or description..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-orange-500"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-700 dark:text-zinc-300 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="web">Web Development</option>
            <option value="systems">Systems Development</option>
            <option value="solution">IT Solutions</option>
            <option value="support">IT Support</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-700 dark:text-zinc-300 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="published">Live Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-zinc-950 text-stone-500 dark:text-zinc-400 uppercase font-bold tracking-wider border-b border-stone-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Service &amp; Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Icon</th>
                <th className="px-6 py-3.5">Features</th>
                <th className="px-6 py-3.5 text-center">Live on Web</th>
                <th className="px-6 py-3.5 text-center">Home Feature</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-stone-500 dark:text-zinc-400">
                    No services found matching the selected filter. Click &ldquo;Add New Service&rdquo; to publish a new one!
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-stone-50/60 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-900 dark:text-white max-w-xs">
                      <div className="flex items-center gap-2">
                        <span>{service.title}</span>
                      </div>
                      <span className="block text-[11px] font-normal text-stone-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        {service.shortDescription}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          (service.category || '').includes('web')
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50'
                            : (service.category || '').includes('system')
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50'
                            : (service.category || '').includes('solution') || (service.category || '').includes('cyber')
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                            : (service.category || '').includes('support')
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                            : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50'
                        }`}
                      >
                        {service.category === 'web'
                          ? 'Website Dev'
                          : service.category === 'systems'
                          ? 'Systems Dev'
                          : service.category === 'support'
                          ? 'IT Support'
                          : service.category === 'cyber' || service.category === 'it-solutions'
                          ? 'IT Solutions'
                          : service.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                        <DynamicIcon name={service.iconName} className="w-4 h-4" />
                      </div>
                    </td>

                    <td className="px-6 py-4 text-stone-600 dark:text-zinc-400">
                      <span className="font-mono text-[11px] font-bold">
                        {service.features?.length || 0}
                      </span>{' '}
                      bullets
                    </td>

                    {/* Quick 1-Click Live Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(service)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          service.isPublished
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400 border border-stone-300 dark:border-zinc-700'
                        }`}
                        title="Click to toggle live website visibility"
                      >
                        {service.isPublished ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-stone-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Quick 1-Click Featured on Home Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(service)}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          service.isFeatured
                            ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500/25'
                            : 'text-stone-300 dark:text-zinc-600 hover:text-stone-600 dark:hover:text-zinc-300'
                        }`}
                        title={service.isFeatured ? 'Featured on Homepage (Click to remove)' : 'Click to feature on Homepage'}
                      >
                        <Star className={`w-4 h-4 ${service.isFeatured ? 'fill-orange-500' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(service)}
                          className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 cursor-pointer"
                          title="Edit Service Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.title)}
                          className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white text-red-500 cursor-pointer transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create / Edit */}
      {(isCreating || editingService) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
                  {editingService ? 'Edit Service Offering' : 'Add New Service to Website'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                  Save and publish any service, system, or solution. It will go live immediately on the public website.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Service Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Hospital Management System (HMS), Custom Web Store, CCTV Installation"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm focus:outline-hidden focus:border-orange-500 font-medium"
                />
              </div>

              {/* Category Picker (Presets + Custom Input) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300">
                  Service Category / Division *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_CATEGORIES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedCategoryPreset(preset.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left border cursor-pointer ${
                        selectedCategoryPreset === preset.id
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-stone-50 dark:bg-zinc-950 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* If Custom chosen, show free-form category input */}
                {selectedCategoryPreset === 'custom' && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-zinc-400 mb-1">
                      Type Custom Category Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. School Portals, Cloud Architecture, CCTV &amp; Security, AI Solutions"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Icon Selection with Quick Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300">
                    Service Icon
                  </label>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                    <span>Active:</span>
                    <div className="w-5 h-5 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                      <DynamicIcon name={formData.iconName || 'Globe'} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-stone-900 dark:text-white">{formData.iconName || 'Globe'}</span>
                  </div>
                </div>

                {/* Quick icon chips */}
                <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 max-h-28 overflow-y-auto">
                  {POPULAR_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: icon })}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        formData.iconName === icon
                          ? 'bg-orange-600 text-white font-bold shadow-2xs'
                          : 'bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-800 hover:bg-stone-100'
                      }`}
                    >
                      <DynamicIcon name={icon} className="w-3 h-3" />
                      <span>{icon}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Or enter any custom Lucide icon name (e.g. Activity, Shield, Terminal)..."
                  value={formData.iconName || ''}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs font-mono focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Short Description (Overview) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary displayed on cards across the website catalogue..."
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Full Description / What We Did */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Full Detailed Description (Capabilities &amp; Scope)
                </label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive technical details, architecture specs, or client deliverables for this service offering..."
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Key Features Bullets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Key Features &amp; Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Custom Tailored Architecture&#10;Fast Deployment &amp; Handover&#10;Zero Downtime SLA Support&#10;M-Pesa STK Push Integration"
                  value={(formData.features || []).join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value
                        .split('\n')
                        .map((f) => f.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Display Order & Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order ?? 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm focus:outline-hidden font-mono"
                  />
                </div>

                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800 dark:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={formData.isPublished ?? true}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      Live to Website
                    </span>
                  </label>
                </div>

                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800 dark:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured ?? false}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-orange-500" />
                      Feature on Home
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
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
                      <span>Saving &amp; Updating Live...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingService ? 'Update & Push Live' : 'Publish Service Live'}</span>
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

