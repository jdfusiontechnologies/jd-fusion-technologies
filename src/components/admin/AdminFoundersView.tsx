import React, { useState } from 'react';
import { Founder } from '../../types';
import { api } from '../../lib/api';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  X,
  Save,
  Loader2,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Quote,
  Eye,
  EyeOff,
  Code2,
} from 'lucide-react';
import { ImagePickerField } from './ImagePickerField';

interface AdminFoundersViewProps {
  founders: Founder[];
  onRefresh: () => void;
}

export const AdminFoundersView: React.FC<AdminFoundersViewProps> = ({
  founders,
  onRefresh,
}) => {
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const initialNewFounder: Partial<Founder> = {
    name: '',
    role: 'Founder',
    bio: '',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=85',
    linkedInUrl: 'https://linkedin.com/company/jdfusiontech',
    twitterUrl: 'https://twitter.com/jdfusiontech',
    githubUrl: 'https://github.com/jdfusion-technologies',
    email: '',
    specialties: ['Digital Architecture', 'UI/UX Design Systems'],
    quote: '',
    displayOrder: (founders?.length || 0) + 1,
    isPublished: true,
  };

  const [formData, setFormData] = useState<Partial<Founder>>(initialNewFounder);
  const [specialtiesText, setSpecialtiesText] = useState<string>('');

  const handleOpenCreate = () => {
    setFormData({ ...initialNewFounder });
    setSpecialtiesText(initialNewFounder.specialties?.join(', ') || '');
    setIsCreating(true);
    setEditingFounder(null);
  };

  const handleOpenEdit = (item: Founder) => {
    setFormData({ ...item });
    setSpecialtiesText(item.specialties?.join(', ') || '');
    setEditingFounder(item);
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingFounder(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.role?.trim() || !formData.bio?.trim()) {
      setFeedback({ type: 'error', message: 'Name, Role (Place held), and Bio/Message are required.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const parsedSpecialties = specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      name: formData.name.trim(),
      role: formData.role.trim(),
      bio: formData.bio.trim(),
      quote: formData.quote?.trim() || undefined,
      imageUrl: formData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=85',
      specialties: parsedSpecialties,
      displayOrder: Number(formData.displayOrder) || 0,
    };

    try {
      if (editingFounder) {
        await api.updateFounder(editingFounder.id, payload);
        setFeedback({ type: 'success', message: `Founder "${payload.name}" updated successfully!` });
      } else {
        await api.createFounder(payload as any);
        setFeedback({ type: 'success', message: `Founder "${payload.name}" added to the team!` });
      }
      handleCloseModal();
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save founder.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await api.deleteFounder(deleteConfirm.id);
      setFeedback({ type: 'success', message: `Founder "${deleteConfirm.name}" removed.` });
      setDeleteConfirm(null);
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete founder.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
              Founders &amp; Leadership Directory
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Manage company co-founders, executive profiles, bios, headshots, credentials, and social channels.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Founder</span>
        </button>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Founders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {founders && founders.length > 0 ? (
          founders.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-stone-200 dark:ring-zinc-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit']">
                          {item.name}
                        </h3>
                        {item.isPublished ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5" /> Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-500/10 text-stone-500 border border-stone-500/20 flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5" /> Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                        {item.role}
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                        Display Order: {item.displayOrder ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-stone-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      title="Edit Founder"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: item.id, name: item.name })}
                      className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-stone-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Founder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                  {item.bio}
                </p>

                {item.quote && (
                  <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-zinc-950/60 border border-stone-200/60 dark:border-zinc-800 text-[11px] italic text-stone-600 dark:text-zinc-400 flex items-start gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">&ldquo;{item.quote}&rdquo;</span>
                  </div>
                )}

                {item.specialties && item.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.specialties.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Socials & Email info */}
              <div className="pt-3 mt-3 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  {item.linkedInUrl && <Linkedin className="w-3.5 h-3.5 text-blue-500" />}
                  {item.twitterUrl && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                  {item.githubUrl && <Github className="w-3.5 h-3.5 text-stone-700 dark:text-zinc-300" />}
                  {item.email && <Mail className="w-3.5 h-3.5 text-orange-500" />}
                </div>
                <span className="text-[11px]">{item.email || 'No email set'}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-stone-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-800">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No founders listed yet.</p>
            <p className="text-xs mt-1 text-stone-400">
              Click &quot;Add Founder&quot; to showcase your executive leadership.
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editingFounder) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white font-['Outfit']">
                  {editingFounder ? `Edit: ${editingFounder.name}` : 'Add New Founder'}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Joshua Mwenda"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Role / Executive Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Founder & Chief Executive Officer"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <ImagePickerField
                  label="Founder Portrait Headshot Image URL *"
                  value={formData.imageUrl || ''}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                  Executive Bio *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summarize expertise, background, role in product delivery, and vision..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                  Specialties &amp; Focus (comma-separated tags)
                </label>
                <input
                  type="text"
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  placeholder="e.g. Brand Identity, UI/UX Architecture, Cloud Architecture, DevOps"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                  Founder Quote / Engineering Philosophy
                </label>
                <input
                  type="text"
                  value={formData.quote || ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="e.g. Great technology without impeccable design is invisible..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. joshua@jdfusiontech.com"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedInUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Twitter / X URL
                  </label>
                  <input
                    type="url"
                    value={formData.twitterUrl || ''}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder ?? 0}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="founder-is-published"
                    checked={formData.isPublished !== false}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="founder-is-published"
                    className="text-xs font-semibold text-stone-700 dark:text-zinc-300 cursor-pointer"
                  >
                    Publish to Public Website
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Founder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit']">
                  Remove Founder
                </h3>
                <p className="text-xs text-stone-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-stone-900 dark:text-white font-semibold">&ldquo;{deleteConfirm.name}&rdquo;</strong> from the founders directory?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Yes, Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
