import React, { useState, useEffect } from 'react';
import { Vote, Search, Filter, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import api from '../../lib/api';

export const AdminVotes: React.FC = () => {
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/votes', {
        params: {
          page,
          limit: 25,
          status: statusFilter,
          search
        }
      });
      if (res.data.success) {
        setVotes(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVotes();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-white">Live Votes Transaction Ledger</h1>
        <p className="text-xs text-zinc-400">Cryptographically verified Paystack voting transactions and voter identities.</p>
      </div>

      <div className="bg-[#12131a] rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search reference, voter email, or contestant name..."
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
            <option value="all">All Transactions</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="suspicious">Suspicious</option>
          </select>
        </div>
      </div>

      <div className="bg-[#12131a] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Contestant</th>
                <th className="py-3 px-4">Voter</th>
                <th className="py-3 px-4 text-right">Votes</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">Loading ledger records...</td>
                </tr>
              ) : votes.length > 0 ? (
                votes.map((v) => (
                  <tr key={v._id || v.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                      {v.paymentReference || v._id.slice(0, 12)}
                    </td>

                    <td className="py-3 px-4 font-semibold text-white">
                      {v.contestantName || v.contestant}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-zinc-200 block">{v.voter?.name || 'Supporter'}</span>
                      <span className="text-[10px] text-zinc-400 block">{v.voter?.email}</span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-[#FFD066]">
                      +{v.votes}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-zinc-200">
                      ₦{v.amount?.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {v.status || 'successful'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">No vote records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
