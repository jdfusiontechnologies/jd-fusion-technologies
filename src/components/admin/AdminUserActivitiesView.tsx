import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  PhoneCall,
  Mail,
  Inbox,
  Star,
  RefreshCw,
  Search,
  Clock,
  Globe,
  ExternalLink,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Activity,
  Filter,
  User,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { api } from '../../lib/api';
import { ActivityLog } from '../../types';

export const AdminUserActivitiesView: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await api.getUserActivities(200);
      setActivities(data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to fetch user activities.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // Auto-poll user activities every 20 seconds
    const interval = setInterval(fetchActivities, 20000);
    return () => clearInterval(interval);
  }, []);

  // Compute metric totals
  const totalWhatsApp = activities.filter((a) => a.type === 'contact_whatsapp').length;
  const totalCalls = activities.filter((a) => a.type === 'contact_call').length;
  const totalEmails = activities.filter((a) => a.type === 'contact_email').length;
  const totalInquiries = activities.filter((a) => a.type === 'contact_inquiry').length;
  const totalTestimonials = activities.filter((a) => a.type === 'testimonial_submitted').length;

  const filteredActivities = activities.filter((act) => {
    if (filterType !== 'all' && act.type !== filterType) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title?.toLowerCase().includes(q);
      const matchDesc = act.description?.toLowerCase().includes(q);
      const matchIp = act.ip?.toLowerCase().includes(q);
      const matchPath = act.path?.toLowerCase().includes(q);
      const matchTarget = (act.metadata?.target || '').toLowerCase().includes(q);
      const matchName = (act.metadata?.details?.name || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchIp || matchPath || matchTarget || matchName;
    }

    return true;
  });

  const formatTimeAgo = (timestampStr: string) => {
    try {
      const date = new Date(timestampStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'contact_whatsapp':
        return {
          label: 'WhatsApp Chat',
          icon: MessageCircle,
          badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        };
      case 'contact_call':
        return {
          label: 'Phone Call Dialed',
          icon: PhoneCall,
          badgeColor: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
          iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
        };
      case 'contact_email':
        return {
          label: 'Email Initiated',
          icon: Mail,
          badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
          iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
        };
      case 'contact_inquiry':
        return {
          label: 'Quote Inquiry Form',
          icon: Inbox,
          badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        };
      case 'testimonial_submitted':
        return {
          label: 'Testimonial Review',
          icon: Star,
          badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
          iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
        };
      default:
        return {
          label: 'User Interaction',
          icon: Activity,
          badgeColor: 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/30',
          iconBg: 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/30',
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-emerald-600" />
            <span>User Activities & Contact Inbound</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Real-time feed of actions performed by visitors: WhatsApp chats, phone calls dialed, emails clicked, and inquiries sent.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={fetchActivities}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* WhatsApp Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-zinc-400">WhatsApp Inquiries</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-['Outfit'] text-stone-900 dark:text-white">
              {totalWhatsApp}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">Chats Initiated</span>
          </div>
        </div>

        {/* Calls Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-zinc-400">Phone Calls</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-['Outfit'] text-stone-900 dark:text-white">
              {totalCalls}
            </span>
            <span className="text-[10px] text-sky-600 font-bold">Dialed Calls</span>
          </div>
        </div>

        {/* Email Inquiries */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-zinc-400">Email Drafts</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-['Outfit'] text-stone-900 dark:text-white">
              {totalEmails}
            </span>
            <span className="text-[10px] text-indigo-600 font-bold">Direct Clicks</span>
          </div>
        </div>

        {/* Form Inquiries */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-zinc-400">Form Quotes</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-['Outfit'] text-stone-900 dark:text-white">
              {totalInquiries}
            </span>
            <span className="text-[10px] text-amber-600 font-bold">Leads Received</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-2xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900'
            }`}
          >
            All Actions ({activities.length})
          </button>
          <button
            onClick={() => setFilterType('contact_whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'contact_whatsapp'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-emerald-600'
            }`}
          >
            WhatsApp ({totalWhatsApp})
          </button>
          <button
            onClick={() => setFilterType('contact_call')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'contact_call'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-sky-600'
            }`}
          >
            Calls ({totalCalls})
          </button>
          <button
            onClick={() => setFilterType('contact_email')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'contact_email'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-indigo-600'
            }`}
          >
            Emails ({totalEmails})
          </button>
          <button
            onClick={() => setFilterType('contact_inquiry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'contact_inquiry'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-amber-600'
            }`}
          >
            Quotes ({totalInquiries})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by IP, number, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-3">
        {loading && activities.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
            <p className="text-xs">Loading visitor contact activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 rounded-2xl border-2 border-dashed border-stone-200 dark:border-zinc-800 text-center space-y-2">
            <Activity className="w-8 h-8 text-stone-300 dark:text-zinc-700 mx-auto" />
            <p className="text-sm font-bold text-stone-700 dark:text-zinc-300">
              No user contact activities found
            </p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              When visitors click WhatsApp, dial the phone number, click the email address, or submit quote inquiries, their live actions appear here automatically.
            </p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const badge = getActionBadge(act.type);
            const Icon = badge.icon;
            const target = act.metadata?.target;
            const details = act.metadata?.details;
            const timeAgo = formatTimeAgo(act.timestamp);

            return (
              <div
                key={act.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xs hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Action Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${badge.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.badgeColor}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>

                        <h3 className="font-extrabold text-sm text-stone-900 dark:text-white font-['Outfit']">
                          {act.title}
                        </h3>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp & Time Ago */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 shrink-0 self-end sm:self-auto font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeAgo}</span>
                  </div>
                </div>

                {/* Metadata Pill Grid */}
                <div className="pt-2 border-t border-stone-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-stone-500 dark:text-zinc-400 font-mono">
                  {/* IP Address */}
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-stone-400" />
                    <span>IP: {act.ip}</span>
                  </div>

                  {/* Page URL */}
                  <div className="flex items-center gap-1">
                    <span className="text-stone-400">Page:</span>
                    <span className="font-bold text-stone-800 dark:text-zinc-200">
                      {act.path || '/'}
                    </span>
                  </div>

                  {/* Target details */}
                  {target && (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <span>Target: {target}</span>
                    </div>
                  )}

                  {/* Browser/Device */}
                  {act.userAgent && (
                    <div className="flex items-center gap-1 truncate max-w-xs text-stone-400">
                      <Laptop className="w-3 h-3 shrink-0" />
                      <span className="truncate">{act.userAgent}</span>
                    </div>
                  )}
                </div>

                {/* Optional Inquiry Quick Details */}
                {details && (details.name || details.email || details.phone) && (
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      {details.name && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Client:</span>
                          <span className="font-bold text-stone-900 dark:text-white">
                            {details.name}
                          </span>
                        </div>
                      )}
                      {details.email && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Email:</span>
                          <a
                            href={`mailto:${details.email}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
                          >
                            {details.email}
                          </a>
                        </div>
                      )}
                      {details.phone && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Phone / WhatsApp:</span>
                          <a
                            href={`https://wa.me/${String(details.phone).replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono font-bold"
                          >
                            {details.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Quick WhatsApp response button if phone available */}
                    {details.phone && (
                      <a
                        href={`https://wa.me/${String(details.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${details.name || 'there'}, thank you for reaching out to JD Fusion Technologies. How can we assist you with your project?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-2xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
