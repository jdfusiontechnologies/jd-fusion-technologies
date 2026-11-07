import React, { useState } from 'react';
import { SocialLink } from '../../types';
import { api } from '../../lib/api';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  Edit2,
  Check,
  AlertCircle,
  X,
  Save,
  Loader2,
  ExternalLink,
  Power,
  Plus,
  Trash2,
  Share2,
  Globe,
  Sparkles,
} from 'lucide-react';

interface AdminSocialsViewProps {
  socials: SocialLink[];
  onRefresh: () => void;
}

interface PlatformPreset {
  platform: string;
  platformName: string;
  icon: string;
  defaultUrl: string;
  description: string;
  accentColor: string;
}

const PRESET_CHANNELS: PlatformPreset[] = [
  {
    platform: 'facebook',
    platformName: 'Facebook',
    icon: 'Facebook',
    defaultUrl: 'https://facebook.com/jdfusiontech',
    description: 'Official corporate page for updates, community, and announcements.',
    accentColor: 'text-blue-600 bg-blue-500/10 border-blue-500/30',
  },
  {
    platform: 'linkedin',
    platformName: 'LinkedIn',
    icon: 'Linkedin',
    defaultUrl: 'https://linkedin.com/company/jd-fusion-technologies',
    description: 'B2B enterprise networking, executive hiring, and corporate case studies.',
    accentColor: 'text-sky-600 bg-sky-500/10 border-sky-500/30',
  },
  {
    platform: 'whatsapp',
    platformName: 'WhatsApp',
    icon: 'MessageCircle',
    defaultUrl: 'https://wa.me/254700000000?text=Hello%20JD%20Fusion%20Technologies',
    description: 'Instant client consultation, WhatsApp floating trigger, and direct inquiries.',
    accentColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    platform: 'twitter',
    platformName: 'X (Twitter)',
    icon: 'Twitter',
    defaultUrl: 'https://x.com/jdfusiontech',
    description: 'Tech updates, system releases, and community discussions.',
    accentColor: 'text-stone-900 dark:text-stone-200 bg-stone-500/10 border-stone-500/30',
  },
  {
    platform: 'instagram',
    platformName: 'Instagram',
    icon: 'Instagram',
    defaultUrl: 'https://instagram.com/jdfusiontech',
    description: 'Visual portfolio, design highlights, and behind-the-scenes engineering.',
    accentColor: 'text-pink-600 bg-pink-500/10 border-pink-500/30',
  },
  {
    platform: 'youtube',
    platformName: 'YouTube',
    icon: 'Youtube',
    defaultUrl: 'https://youtube.com/@jdfusiontech',
    description: 'System demos, tutorial walkthroughs, and developer showcases.',
    accentColor: 'text-red-600 bg-red-500/10 border-red-500/30',
  },
  {
    platform: 'github',
    platformName: 'GitHub',
    icon: 'Github',
    defaultUrl: 'https://github.com/jdfusion-technologies',
    description: 'Open source tooling, repositories, and technical documentation.',
    accentColor: 'text-purple-600 bg-purple-500/10 border-purple-500/30',
  },
  {
    platform: 'telegram',
    platformName: 'Telegram',
    icon: 'Send',
    defaultUrl: 'https://t.me/jdfusiontech',
    description: 'Direct messaging channel and community broadcasts.',
    accentColor: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/30',
  },
];

const AVAILABLE_ICONS = [
  'Facebook',
  'Linkedin',
  'MessageCircle',
  'Twitter',
  'Instagram',
  'Youtube',
  'Github',
  'Send',
  'Globe',
  'Share2',
  'Phone',
  'Mail',
  'Sparkles',
];

export const AdminSocialsView: React.FC<AdminSocialsViewProps> = ({ socials = [], onRefresh }) => {
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Show all configured socials, sorted by displayOrder
  const allSocials = [...socials].sort(
    (a, b) => (a.displayOrder ?? a.order ?? 0) - (b.displayOrder ?? b.order ?? 0)
  );

  const [formData, setFormData] = useState<Partial<SocialLink>>({
    platform: 'facebook',
    platformName: 'Facebook',
    url: 'https://facebook.com/jdfusiontech',
    icon: 'Facebook',
    isPublished: true,
    isEnabled: true,
    displayOrder: 1,
  });

  const handleOpenEdit = (social: SocialLink) => {
    setFormData({
      id: social.id,
      platform: social.platform,
      platformName: social.platformName,
      url: social.url,
      icon: social.icon || 'Globe',
      isPublished: social.isPublished ?? social.isEnabled ?? true,
      isEnabled: social.isPublished ?? social.isEnabled ?? true,
      displayOrder: social.displayOrder ?? social.order ?? 1,
    });
    setEditingSocial(social);
    setIsCreating(false);
  };

  const handleOpenCreate = (presetPlatform?: string) => {
    if (presetPlatform && presetPlatform !== 'custom') {
      const preset = PRESET_CHANNELS.find((c) => c.platform === presetPlatform) || PRESET_CHANNELS[0];
      setFormData({
        id: `social-${preset.platform}-${Date.now().toString().slice(-4)}`,
        platform: preset.platform,
        platformName: preset.platformName,
        url: preset.defaultUrl,
        icon: preset.icon,
        isPublished: true,
        isEnabled: true,
        displayOrder: allSocials.length + 1,
      });
    } else {
      setFormData({
        id: `social-custom-${Date.now().toString().slice(-4)}`,
        platform: 'custom',
        platformName: '',
        url: 'https://',
        icon: 'Globe',
        isPublished: true,
        isEnabled: true,
        displayOrder: allSocials.length + 1,
      });
    }
    setIsCreating(true);
    setEditingSocial(null);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingSocial(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url || !formData.platformName) {
      setFeedback({ type: 'error', message: 'Please provide both platform name and valid URL.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const cleanPlatform = (formData.platform || 'custom').toLowerCase().trim();
      const generatedId =
        formData.id ||
        `social-${cleanPlatform.replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

      const payload: SocialLink = {
        id: editingSocial ? editingSocial.id : generatedId,
        platform: cleanPlatform,
        platformName: formData.platformName.trim(),
        url: formData.url.trim(),
        icon: formData.icon || 'Globe',
        displayOrder: Number(formData.displayOrder) || allSocials.length + 1,
        isPublished: Boolean(formData.isPublished),
        isEnabled: Boolean(formData.isPublished),
        updatedAt: new Date().toISOString(),
      };

      if (editingSocial) {
        await api.updateSocial(editingSocial.id, payload);
        setFeedback({
          type: 'success',
          message: `${payload.platformName} updated successfully!`,
        });
      } else {
        await api.createSocial(payload);
        setFeedback({
          type: 'success',
          message: `${payload.platformName} added and active on your website!`,
        });
      }
      handleCloseModal();
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save social channel.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (social: SocialLink) => {
    setTogglingId(social.id);
    setFeedback(null);
    try {
      const currentActive = social.isPublished ?? social.isEnabled ?? true;
      const newActive = !currentActive;

      await api.updateSocial(social.id, {
        ...social,
        isPublished: newActive,
        isEnabled: newActive,
      });

      setFeedback({
        type: 'success',
        message: `${social.platformName} is now ${
          newActive ? 'ACTIVATED & LIVE on public website' : 'DEACTIVATED & hidden from public website'
        }.`,
      });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to toggle status.' });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (social: SocialLink) => {
    if (!window.confirm(`Are you sure you want to remove ${social.platformName}?`)) {
      return;
    }

    setDeletingId(social.id);
    setFeedback(null);
    try {
      await api.deleteSocial(social.id);
      setFeedback({
        type: 'success',
        message: `${social.platformName} has been removed.`,
      });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete social channel.' });
    } finally {
      setDeletingId(null);
    }
  };

  // Find presets not yet in existing socials
  const existingPlatforms = allSocials.map((s) => s.platform.toLowerCase());
  const suggestedPresets = PRESET_CHANNELS.filter(
    (c) => !existingPlatforms.includes(c.platform.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-orange-600" />
            <span>Connect & Social Channels</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Add any social channel (Facebook, LinkedIn, WhatsApp, X, Instagram, YouTube, etc.) and toggle active to display live on the public website.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreate('custom')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm transition-all hover:shadow-md cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Social</span>
        </button>
      </div>

      {/* Suggested Quick-Add Presets */}
      {suggestedPresets.length > 0 && (
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
            Quick Add Popular Channels:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedPresets.map((c) => (
              <button
                key={c.platform}
                onClick={() => handleOpenCreate(c.platform)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-zinc-700 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-medium shadow-2xs transition-all cursor-pointer"
              >
                <DynamicIcon name={c.icon} className="w-3.5 h-3.5 text-orange-600" />
                <span>+ {c.platformName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Status Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
          <p className="font-bold">Active Socials Visibility Engine</p>
          <p className="text-emerald-800 dark:text-emerald-300">
            Any social channel marked <strong>Active</strong> appears automatically in the public footer, contact points, and navigation links with dynamic brand icons. Disabling a channel hides it immediately without deleting your configuration.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Socials List */}
      <div className="space-y-4">
        {allSocials.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-2xl border-2 border-dashed border-stone-200 dark:border-zinc-800 space-y-3">
            <Globe className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-800 dark:text-white">No Social Channels Added Yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Add your corporate social profiles to connect with clients across Facebook, LinkedIn, WhatsApp, and more.
            </p>
            <button
              onClick={() => handleOpenCreate('facebook')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Channel</span>
            </button>
          </div>
        ) : (
          allSocials.map((social) => {
            const isActive = social.isPublished ?? social.isEnabled ?? true;
            const isToggling = togglingId === social.id;
            const isDeleting = deletingId === social.id;
            const presetInfo = PRESET_CHANNELS.find(
              (c) => c.platform === social.platform.toLowerCase()
            );

            return (
              <div
                key={social.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 shadow-xs'
                    : 'bg-stone-50/70 dark:bg-zinc-900/40 border-dashed border-stone-300 dark:border-zinc-800 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Platform Identity & Details */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        presetInfo?.accentColor || 'text-orange-600 bg-orange-500/10 border-orange-500/30'
                      }`}
                    >
                      <DynamicIcon name={social.icon || 'Globe'} className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-extrabold text-base font-['Outfit'] text-stone-900 dark:text-white">
                          {social.platformName}
                        </h3>

                        {/* Live Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 border border-stone-300 dark:border-zinc-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                            }`}
                          />
                          <span>{isActive ? 'Active & Live on Website' : 'Deactivated / Hidden'}</span>
                        </span>
                      </div>

                      <p className="text-xs text-stone-500 dark:text-zinc-400">
                        {presetInfo?.description || 'Connected company channel'}
                      </p>

                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 pt-0.5 font-mono"
                      >
                        <span className="truncate max-w-xs sm:max-w-md">{social.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Action Controls: Toggle Active, Edit, Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-0">
                    {/* Active / Inactive Switch */}
                    <button
                      onClick={() => handleToggleActive(social)}
                      disabled={isToggling}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs'
                          : 'bg-stone-200 dark:bg-zinc-800 hover:bg-stone-300 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300'
                      }`}
                      title={
                        isActive
                          ? 'Click to deactivate and hide from website'
                          : 'Click to activate and show live on website'
                      }
                    >
                      {isToggling ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Power className="w-3.5 h-3.5" />
                      )}
                      <span>{isActive ? 'Active' : 'Disabled'}</span>
                    </button>

                    {/* Edit URL / Details */}
                    <button
                      onClick={() => handleOpenEdit(social)}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
                      title="Edit Channel Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Channel */}
                    <button
                      onClick={() => handleDelete(social)}
                      disabled={isDeleting}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      title="Remove Social Channel"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Add Modal */}
      {(isCreating || editingSocial) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-orange-600" />
                <span>{editingSocial ? `Edit ${editingSocial.platformName}` : 'Add Social Channel'}</span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Select Platform Preset or Custom */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Platform Preset
                </label>
                <select
                  value={formData.platform || 'custom'}
                  onChange={(e) => {
                    const selPlatform = e.target.value;
                    if (selPlatform === 'custom') {
                      setFormData({
                        ...formData,
                        platform: 'custom',
                        icon: 'Globe',
                      });
                    } else {
                      const sel = PRESET_CHANNELS.find((c) => c.platform === selPlatform);
                      if (sel) {
                        setFormData({
                          ...formData,
                          platform: sel.platform,
                          platformName: sel.platformName,
                          icon: sel.icon,
                          url: formData.url && formData.url !== 'https://' ? formData.url : sel.defaultUrl,
                        });
                      }
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold"
                >
                  <option value="custom">Custom Social Media Platform...</option>
                  {PRESET_CHANNELS.map((c) => (
                    <option key={c.platform} value={c.platform}>
                      {c.platformName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Label */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Display Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Facebook, X, Instagram, TikTok"
                  value={formData.platformName || ''}
                  onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              {/* Channel URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Official Profile / Channel URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm font-mono"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
                  Display Icon
                </label>
                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800">
                  {AVAILABLE_ICONS.map((iconName) => (
                    <button
                      type="button"
                      key={iconName}
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`p-2 rounded-lg border transition-all cursor-pointer ${
                        (formData.icon || 'Globe') === iconName
                          ? 'bg-orange-600 text-white border-orange-600 scale-105 shadow-2xs'
                          : 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:border-orange-400'
                      }`}
                      title={iconName}
                    >
                      <DynamicIcon name={iconName} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.displayOrder ?? 1}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-24 px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              {/* Active Toggle in Modal */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isPublished)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.checked,
                        isEnabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 dark:text-white block">
                      Activate on Public Website
                    </span>
                    <span className="text-stone-500 dark:text-zinc-400">
                      When checked, this link is immediately visible in the website footer and contact points.
                    </span>
                  </div>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-orange-400 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Channel</span>
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
