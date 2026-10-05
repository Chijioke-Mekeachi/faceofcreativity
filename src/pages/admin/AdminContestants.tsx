import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Slash, 
  Trash2, 
  Edit3, 
  Download, 
  Plus, 
  ShieldAlert,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../lib/api';

export const AdminContestants: React.FC = () => {
  const [contestants, setContestants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Vote adjustment modal
  const [adjustModalContestant, setAdjustModalContestant] = useState<any | null>(null);
  const [newVoteCount, setNewVoteCount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [submittingAdjust, setSubmittingAdjust] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const fetchContestants = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/contestants', {
        params: {
          page,
          limit: 20,
          status: statusFilter,
          search
        }
      });
      if (res.data.success) {
        setContestants(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestants();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchContestants();
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/admin/contestants/${id}/approve`);
      fetchContestants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Specify rejection reason:');
    if (!reason) return;
    try {
      await api.post(`/admin/contestants/${id}/reject`, { reason });
      fetchContestants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleSuspend = async (id: string) => {
    const reason = prompt('Reason for suspension/disqualification:');
    if (!reason) return;
    try {
      await api.post(`/admin/contestants/${id}/disqualify`, { reason });
      fetchContestants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${name}? This action cannot be reversed.`)) return;
    try {
      await api.delete(`/contestants/${id}`);
      fetchContestants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // Submit audited vote adjustment
  const handleVoteAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustReason || adjustReason.trim().length < 5) {
      setAdjustError('A mandatory reason (at least 5 characters) must be provided for audit logging.');
      return;
    }

    setSubmittingAdjust(true);
    setAdjustError(null);

    try {
      const res = await api.post(`/admin/contestants/${adjustModalContestant._id}/adjust-votes`, {
        newVoteCount,
        reason: adjustReason.trim()
      });

      if (res.data.success) {
        setAdjustModalContestant(null);
        fetchContestants();
      }
    } catch (err: any) {
      setAdjustError(err.response?.data?.message || 'Adjustment failed');
    } finally {
      setSubmittingAdjust(false);
    }
  };

  // CSV Export
  const exportCSV = () => {
    if (!contestants.length) return;
    const headers = ['ContestantID', 'FullName', 'Category', 'State', 'Votes', 'Status', 'Email', 'Phone'];
    const rows = contestants.map(c => [
      c.contestantId,
      `"${c.fullName}"`,
      `"${c.category}"`,
      `"${c.state}"`,
      c.voteCount,
      c.status,
      c.email,
      c.phone
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foc_contestants_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-white">Contestant Registry</h1>
          <p className="text-xs text-zinc-400">Complete database of enrolled candidates across all states.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-[#E5A93C]" /> Export CSV
          </button>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-[#12131a] rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search candidate name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C]"
          />
        </form>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#E5A93C]"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved & Live</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
            <option value="disqualified">Disqualified</option>
          </select>
        </div>
      </div>

      {/* Contestant Data Table */}
      <div className="bg-[#12131a] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                <th className="py-3 px-4">Contestant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Votes</th>
                <th className="py-3 px-4 text-center">Audit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">Loading contestants...</td>
                </tr>
              ) : contestants.length > 0 ? (
                contestants.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.profileImage}
                          alt={c.fullName}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <span className="font-bold text-white block">{c.fullName}</span>
                          <span className="font-mono text-[10px] text-[#E5A93C]">{c.contestantId}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-300">{c.category}</td>
                    <td className="py-3 px-4 text-zinc-400">{c.state}</td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        c.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        c.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-[#FFD066]">
                      {(c.voteCount || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {c.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(c._id)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                            title="Approve Contestant"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {c.status === 'pending' && (
                          <button
                            onClick={() => handleReject(c._id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Reject Application"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setAdjustModalContestant(c);
                            setNewVoteCount(c.voteCount || 0);
                            setAdjustReason('');
                            setAdjustError(null);
                          }}
                          className="p-1.5 rounded-lg bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 text-[#E5A93C]"
                          title="Adjust Votes (Audited)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleSuspend(c._id)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                          title="Suspend/Disqualify"
                        >
                          <Slash className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(c._id, c.fullName)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">No contestants found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDITED VOTE ADJUSTMENT MODAL */}
      {adjustModalContestant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12131a] rounded-3xl border border-white/10 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#E5A93C]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base text-white">
                Audited Vote Adjustment
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Modifying votes creates an immutable audit trail tagged with your administrator ID and timestamp.
            </p>

            {adjustError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleVoteAdjustmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Contestant</label>
                <div className="p-2.5 rounded-xl bg-black/40 text-white font-bold">
                  {adjustModalContestant.fullName} ({adjustModalContestant.contestantId})
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">New Total Vote Count</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newVoteCount}
                  onChange={(e) => setNewVoteCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Mandatory Administrative Reason *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Audit correction after chargeback investigation, manual cash deposit verification..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalContestant(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjust}
                  className="px-5 py-2 rounded-xl bg-[#E5A93C] text-black font-bold uppercase"
                >
                  {submittingAdjust ? 'Logging...' : 'Save Audit Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
