import React, { useState } from 'react';
import { AdminDashboardStats, Inquiry, VisitorBreakdownItem } from '../../types';
import {
  Code2,
  Palette,
  Layers,
  Inbox,
  Clock,
  ExternalLink,
  Plus,
  Sparkles,
  HardDrive,
  Loader2,
  RefreshCw,
  MessageCircle,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
  Globe,
  Eye,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

interface AdminDashboardViewProps {
  stats: AdminDashboardStats | null;
  onNavigateTab: (tab: string) => void;
  onUpdateInquiryStatus: (id: string, status: 'new' | 'read' | 'archived') => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  stats,
  onNavigateTab,
  onUpdateInquiryStatus,
  onRefresh,
  isLoading = false,
}) => {
  const [visitorTimeframe, setVisitorTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('day');

  if (!stats) {
    return (
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm animate-in fade-in duration-200">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
        <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
          Loading JD Fusion CMS Overview...
        </h3>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          Gathering live project counts, traffic analytics, and inquiries.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors mt-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Overview</span>
          </button>
        )}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Projects & Portfolio',
      value: stats.totalWebProjects ?? 0,
      tab: 'web-projects',
      icon: Code2,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'User Activities',
      value: 'Live Log',
      highlight: 'WhatsApp & Calls',
      tab: 'user-activities',
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Active Services',
      value: stats.publishedServices ?? stats.totalServices ?? 0,
      tab: 'services',
      icon: Layers,
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Inquiries Received',
      value: stats.totalInquiries ?? 0,
      highlight: (stats.newInquiries ?? 0) > 0 ? `${stats.newInquiries} New` : 'All Read',
      tab: 'inquiries',
      icon: Inbox,
      color: 'text-orange-500 bg-orange-500/10',
    },
  ];

  // Never substitute sample traffic figures for real analytics.
  const visitorStats = stats.visitorStats || {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    totalAllTime: 0,
    uniqueToday: 0,
    uniqueThisWeek: 0,
    uniqueThisMonth: 0,
    uniqueThisYear: 0,
    dailyBreakdown: [],
    weeklyBreakdown: [],
    monthlyBreakdown: [],
    yearlyBreakdown: [],
  };

  const getActiveBreakdown = (): VisitorBreakdownItem[] => {
    switch (visitorTimeframe) {
      case 'day':
        return visitorStats.dailyBreakdown || [];
      case 'week':
        return visitorStats.weeklyBreakdown || [];
      case 'month':
        return visitorStats.monthlyBreakdown || [];
      case 'year':
        return visitorStats.yearlyBreakdown || [];
      default:
        return visitorStats.dailyBreakdown || [];
    }
  };

  const activeBreakdown = getActiveBreakdown();
  const maxVisits = Math.max(...activeBreakdown.map((item) => item.visits), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-900 to-black text-white p-8 shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-blue-600/40">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Welcome to JD Fusion Technologies CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
            Platform Overview &amp; Control
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Manage your web portfolio, services catalog, client testimonials, traffic statistics, and customer inquiries in real-time.
          </p>
        </div>

        {onRefresh && (
          <div className="relative z-10 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all backdrop-blur-sm cursor-pointer disabled:opacity-50"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Refresh Data'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-sm hover:border-orange-500/60 dark:hover:border-orange-500/60 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {card.highlight && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {card.highlight}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-['Outfit']">
                  {card.value}
                </span>
                <p className="text-xs font-semibold text-stone-500 dark:text-zinc-400 mt-1">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* VISITOR & TRAFFIC ANALYTICS SECTION (Day, Week, Month, Year) */}
      {/* ============================================================== */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header & Timeframe Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-stone-900 dark:text-white flex items-center gap-2">
                <span>Visitor &amp; Traffic Analytics</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Tracker
                </span>
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              Aggregated visitor numbers across daily, weekly, monthly, and yearly intervals.
            </p>
          </div>

          {/* Timeframe Toggle Buttons */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700/60 self-start sm:self-auto">
            <button
              onClick={() => setVisitorTimeframe('day')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                visitorTimeframe === 'day'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setVisitorTimeframe('week')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                visitorTimeframe === 'week'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setVisitorTimeframe('month')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                visitorTimeframe === 'month'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setVisitorTimeframe('year')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                visitorTimeframe === 'year'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* 4 Visitor Metric Cards: Day, Week, Month, Year */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Day / Today */}
          <div
            onClick={() => setVisitorTimeframe('day')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              visitorTimeframe === 'day'
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 shadow-xs'
                : 'bg-stone-50/50 dark:bg-zinc-800/40 border-stone-200 dark:border-zinc-800 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Today's Page Views</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-stone-900 dark:text-white">
              {visitorStats.today.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500 dark:text-zinc-400">
              <span>Page views recorded</span>
              <span>Today</span>
            </div>
          </div>

          {/* 2. Week */}
          <div
            onClick={() => setVisitorTimeframe('week')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              visitorTimeframe === 'week'
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 shadow-xs'
                : 'bg-stone-50/50 dark:bg-zinc-800/40 border-stone-200 dark:border-zinc-800 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">This Week's Page Views</span>
              <Calendar className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-stone-900 dark:text-white">
              {visitorStats.thisWeek.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500 dark:text-zinc-400">
              <span>Page views recorded</span>
              <span>This week</span>
            </div>
          </div>

          {/* 3. Monthly */}
          <div
            onClick={() => setVisitorTimeframe('month')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              visitorTimeframe === 'month'
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 shadow-xs'
                : 'bg-stone-50/50 dark:bg-zinc-800/40 border-stone-200 dark:border-zinc-800 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">This Month's Page Views</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-stone-900 dark:text-white">
              {visitorStats.thisMonth.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500 dark:text-zinc-400">
              <span>Page views recorded</span>
              <span>This month</span>
            </div>
          </div>

          {/* 4. Yearly */}
          <div
            onClick={() => setVisitorTimeframe('year')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              visitorTimeframe === 'year'
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 shadow-xs'
                : 'bg-stone-50/50 dark:bg-zinc-800/40 border-stone-200 dark:border-zinc-800 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">This Year's Page Views</span>
              <Globe className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-stone-900 dark:text-white">
              {visitorStats.thisYear.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500 dark:text-zinc-400">
              <span>Page views recorded</span>
              <span>Year to date</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {visitorTimeframe === 'day' && 'Daily Page Views (Last 14 Days)'}
                {visitorTimeframe === 'week' && 'Weekly Page Views (Last 8 Weeks)'}
                {visitorTimeframe === 'month' && 'Monthly Page Views (Last 12 Months)'}
                {visitorTimeframe === 'year' && 'Yearly Page Views (Past 4 Years)'}
              </span>
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              Max in period: {maxVisits.toLocaleString()} visits
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 sm:h-52 flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-1 overflow-x-auto">
            {activeBreakdown.map((item, idx) => {
              const heightPercent = Math.max(Math.round((item.visits / maxVisits) * 100), 10);
              const isLast = idx === activeBreakdown.length - 1;

              return (
                <div
                  key={idx}
                  className="flex-1 min-w-[36px] sm:min-w-[44px] flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Hover Floating Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 pointer-events-none bg-stone-900 dark:bg-zinc-800 text-white text-[10px] py-1 px-2 rounded-lg shadow-lg whitespace-nowrap text-center">
                    <p className="font-bold">{item.visits.toLocaleString()} visits</p>
                    <p className="text-[9px] text-stone-400">Aggregated page views</p>
                  </div>

                  {/* Value Above Bar */}
                  <span className="text-[9px] sm:text-[10px] font-bold font-mono text-stone-500 dark:text-zinc-400 mb-1.5 transition-colors group-hover:text-blue-500">
                    {item.visits >= 1000 ? `${(item.visits / 1000).toFixed(1)}k` : item.visits}
                  </span>

                  {/* Bar Element */}
                  <div className="w-full bg-stone-200 dark:bg-zinc-800 rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 group-hover:brightness-110 ${
                        isLast
                          ? 'bg-gradient-to-t from-blue-600 via-blue-500 to-orange-400 shadow-xs'
                          : 'bg-gradient-to-t from-blue-700/80 to-blue-500/80 group-hover:from-blue-600 group-hover:to-blue-400'
                      }`}
                    />
                  </div>

                  {/* Period Label Below Bar */}
                  <span className="text-[9px] sm:text-[10px] font-semibold text-stone-600 dark:text-zinc-400 mt-2 truncate max-w-full text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Footer Stats */}
          <div className="pt-3 border-t border-stone-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-zinc-400 gap-2">
            <div className="flex items-center gap-4">
              <span>Total Lifetime Page Views: <strong className="text-stone-900 dark:text-white font-bold">{visitorStats.totalAllTime.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
              <span>Page-view totals synchronised</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('user-activities')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live User Activities (WhatsApp/Calls/Email)</span>
          </button>

          <button
            onClick={() => onNavigateTab('web-projects')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>


          <button
            onClick={() => onNavigateTab('services')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>

          <button
            onClick={() => onNavigateTab('socials')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Manage Social Channels</span>
          </button>

          <button
            onClick={() => onNavigateTab('media')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Upload Media Files</span>
          </button>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-sm font-['Outfit'] text-stone-900 dark:text-white">
              Recent Inquiries &amp; Leads
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('inquiries')}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Inquiries</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {(!stats.recentInquiries || stats.recentInquiries.length === 0) ? (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-zinc-400">
            No inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-zinc-950 text-stone-500 dark:text-zinc-400 uppercase font-bold tracking-wider border-b border-stone-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Service Requested</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                {(stats.recentInquiries || []).map((inq) => (
                  <tr key={inq.id} className="hover:bg-stone-50/60 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-semibold text-stone-900 dark:text-white">
                      {inq.name}
                      <span className="block text-[11px] font-normal text-stone-500 dark:text-zinc-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-700 dark:text-zinc-300">
                      {inq.service}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="block text-stone-800 dark:text-zinc-200">{inq.phone}</span>
                        <span className="block text-stone-500 dark:text-zinc-400">{inq.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'new'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                            : inq.status === 'read'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {inq.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inq.status === 'new' && (
                          <button
                            onClick={() => onUpdateInquiryStatus(inq.id, 'read')}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-[11px] font-medium cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                        <a
                          href={`https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                          title="Reply on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
