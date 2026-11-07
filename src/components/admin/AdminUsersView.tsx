import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Check, Copy, Loader2, Shield, UserPlus, Users } from 'lucide-react';

const MODULES = [
  { id: 'inquiries', label: 'Inquiries & Leads' },
  { id: 'services', label: 'Services Manager' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'about', label: 'About & Mission' },
  { id: 'media', label: 'Media Library' },
  { id: 'settings', label: 'System & Backup' },
  { id: 'seo', label: 'SEO & Meta Tags' },
  { id: 'web-projects', label: 'Projects & Portfolio' },
];

const makeTemporaryPassword = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const random = new Uint32Array(24);
  window.crypto.getRandomValues(random);
  return Array.from(random, (value) => alphabet[value % alphabet.length]).join('');
};

export const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'user'>('admin');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [createdPassword, setCreatedPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await api.listAdminUsers());
      setError('');
    } catch (err: any) {
      setError(err.message || 'Could not load administrator accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadUsers(); }, []);

  const togglePermission = (id: string) => {
    setPermissions((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    const password = temporaryPassword || makeTemporaryPassword();
    try {
      await api.createAdminUser({ email, name, role, permissions: role === 'admin' ? permissions : [], temporaryPassword: password });
      setCreatedPassword(password);
      setTemporaryPassword('');
      setEmail('');
      setName('');
      setRole('admin');
      setPermissions([]);
      setNotice('Account created. Copy the temporary password now; it will not be shown again.');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Could not create account.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: any) => {
    if (!window.confirm(user.isActive ? 'Deactivate this account? It will lose access immediately.' : 'Reactivate this account?')) return;
    try {
      await api.updateAdminUser(user.id, { role: user.role, permissions: user.permissions || [], isActive: !user.isActive });
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Could not update account.');
    }
  };

  const copyPassword = async () => {
    await navigator.clipboard.writeText(createdPassword);
    setNotice('Temporary password copied.');
  };

  return (
    <section className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-stone-200 dark:border-zinc-800 pb-3">
        <Users className="w-5 h-5 text-orange-500" />
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-white">Administrator Accounts</h3>
          <p className="text-xs text-stone-500 dark:text-zinc-400">Create accounts, assign roles and control access.</p>
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-xs text-red-600">{error}</p>}
      {notice && <p role="status" className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300">{notice}</p>}
      {createdPassword && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 p-4 space-y-2">
          <p className="text-xs font-bold">Temporary password — share securely with the new account holder</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 break-all text-sm">{createdPassword}</code>
            <button type="button" onClick={copyPassword} className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-800" title="Copy temporary password"><Copy className="w-4 h-4" /></button>
          </div>
          <button type="button" onClick={() => setCreatedPassword('')} className="text-xs underline">Hide password</button>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-xs font-semibold space-y-1">Full name
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-semibold space-y-1">Email address
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm" />
          </label>
        </div>
        <label className="block text-xs font-semibold space-y-1">Role
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm">
            <option value="super_admin">Super Admin — full access</option>
            <option value="admin">Admin — selected modules</option>
            <option value="user">User — no admin modules by default</option>
          </select>
        </label>
        {role === 'admin' && (
          <div className="space-y-2">
            <p className="text-xs font-bold">Allowed modules</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {MODULES.map((module) => (
                <label key={module.id} className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={permissions.includes(module.id)} onChange={() => togglePermission(module.id)} />
                  {module.label}
                </label>
              ))}
            </div>
          </div>
        )}
        <label className="block text-xs font-semibold space-y-1">Temporary password <span className="font-normal text-stone-500">(leave blank to generate a secure password)</span>
          <input type="text" autoComplete="off" value={temporaryPassword} onChange={(e) => setTemporaryPassword(e.target.value)} minLength={12} placeholder="Generated automatically if blank" className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm" />
        </label>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-60 px-4 py-2.5 text-xs font-bold text-white">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          Create account
        </button>
      </form>

      <div className="space-y-3">
        <h4 className="text-xs font-bold flex items-center gap-2"><Shield className="w-4 h-4 text-orange-500" />Existing accounts</h4>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : users.length === 0 ? <p className="text-xs text-stone-500">No database accounts have been created yet.</p> : users.map((user) => (
          <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 dark:border-zinc-800 p-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-stone-500 truncate">{user.email}</p>
              <p className="text-[11px] text-stone-500">{user.role.replace('_', ' ')} · {user.mustChangePassword ? 'Password change required' : 'Password updated'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold ${user.isActive ? 'text-emerald-600' : 'text-red-500'}`}>{user.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
              <button type="button" onClick={() => handleToggleActive(user)} className="rounded-lg border border-stone-300 dark:border-zinc-700 px-3 py-1.5 text-xs">{user.isActive ? 'Deactivate' : 'Reactivate'}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
