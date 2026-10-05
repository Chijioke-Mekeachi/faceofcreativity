import React, { useState, useEffect } from 'react';
import { Trophy, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../../lib/api';

export const AdminLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaderboard');
      if (res.data.success) {
        setLeaderboard(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-white">Live Leaderboard Standings Control</h1>
          <p className="text-xs text-zinc-400">Official ranking tabulation audited directly against verified vote transactions.</p>
        </div>

        <button
          onClick={fetchLeaderboard}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4 text-[#E5A93C]" /> Refresh Standings
        </button>
      </div>

      <div className="bg-[#12131a] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Contestant</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Verified Votes</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">Loading standings...</td>
                </tr>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono font-bold">
                      {c.rank === 1 ? '🥇 #1' : c.rank === 2 ? '🥈 #2' : c.rank === 3 ? '🥉 #3' : `#${c.rank}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.profileImage}
                          alt={c.fullName}
                          className="w-9 h-9 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <span className="font-bold text-white block">{c.fullName}</span>
                          <span className="font-mono text-[10px] text-[#E5A93C]">{c.contestantId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{c.state}</td>
                    <td className="py-3 px-4 text-zinc-300">{c.category}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#FFD066]">
                      {(c.voteCount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">No leaderboard data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
