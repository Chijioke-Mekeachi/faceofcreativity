import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Inbox, 
  Vote, 
  CreditCard, 
  Eye, 
  TrendingUp, 
  Trophy, 
  DollarSign, 
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import api from '../../lib/api';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-400">
        <div className="w-10 h-10 rounded-full border-2 border-[#E5A93C] border-t-transparent animate-spin mx-auto mb-3" />
        Loading real-time executive telemetry...
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Operations & Financial Overview
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time telemetry across nationwide registrations, Paystack transactions, and live voting queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-zinc-300">
            Active: <strong className="text-[#E5A93C]">{metrics.activeCompetition?.name || 'Season 2026'}</strong>
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#12131a] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            ₦{(metrics.totalRevenue || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-white/5">
            <span>Reg: ₦{(metrics.registrationRevenue || 0).toLocaleString()}</span>
            <span>Votes: ₦{(metrics.votingRevenue || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Total Votes */}
        <div className="p-5 rounded-2xl bg-[#12131a] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Total Votes Cast</span>
            <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center">
              <Vote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#FFD066]">
            {(metrics.totalVotes || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-white/5">
            <span>Today: +{(metrics.todayVotes || 0).toLocaleString()}</span>
            <span>Today Rev: ₦{(metrics.todayRevenue || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Total Contestants */}
        <div className="p-5 rounded-2xl bg-[#12131a] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Approved Contestants</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {metrics.approvedContestants || 0}
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-white/5">
            <span>Total Enrolled: {metrics.totalContestants || 0}</span>
            <span className="text-amber-400">Pending: {metrics.pendingApplications || 0}</span>
          </div>
        </div>

        {/* Profile Views */}
        <div className="p-5 rounded-2xl bg-[#12131a] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Profile Views</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {(metrics.profileViews || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-400 pt-1 border-t border-white/5">
            Audited national traffic
          </div>
        </div>

      </div>

      {/* Activity Timeline Bar Chart */}
      <div className="p-6 rounded-3xl bg-[#12131a] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-white">Daily Voting & Revenue Trajectory</h2>
            <p className="text-xs text-zinc-400">Activity logged over the last 7 calendar days</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 pt-4 items-end h-52">
          {charts.activityTimeline?.map((day: any, i: number) => {
            const maxRev = Math.max(...charts.activityTimeline.map((d: any) => d.revenue || 1), 10000);
            const heightPercent = Math.max(15, Math.min(100, Math.round((day.revenue / maxRev) * 100)));

            return (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition">
                  ₦{day.revenue?.toLocaleString()}
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-[#E5A93C]/40 to-[#E5A93C] transition-all group-hover:from-[#E5A93C] group-hover:to-[#FFD066]"
                />
                <span className="text-[10px] text-zinc-400 truncate max-w-full text-center">
                  {day.date.split(',')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Contestants By Category */}
        <div className="p-6 rounded-3xl bg-[#12131a] border border-white/10 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white">Contestants by Creative Category</h2>
          <div className="space-y-3">
            {charts.contestantsByCategory?.map((cat: any) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium">{cat.category}</span>
                  <span className="text-white font-mono font-bold">{cat.count} contestants</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (cat.count / (metrics.totalContestants || 1)) * 100)}%` }}
                    className="h-full bg-gradient-to-r from-[#E5A93C] to-[#D97706] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contestants By State */}
        <div className="p-6 rounded-3xl bg-[#12131a] border border-white/10 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white">Top Represented Nigerian States</h2>
          <div className="space-y-3">
            {charts.contestantsByState?.map((st: any) => (
              <div key={st.state} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium">{st.state}</span>
                  <span className="text-white font-mono font-bold">{st.count} entries</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (st.count / (metrics.totalContestants || 1)) * 100)}%` }}
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
