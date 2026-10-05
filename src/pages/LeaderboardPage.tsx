import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Vote, 
  Search, 
  RefreshCw, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  Award, 
  Share2,
  Eye
} from 'lucide-react';
import api from '../lib/api';
import { VoteModal } from '../components/VoteModal';
import { ShareModal } from '../components/ShareModal';
import { ContestantData } from '../components/ContestantCard';

const NIGERIAN_STATES = [
  'All States',
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Abuja FCT'
];

const CATEGORIES = [
  'All Categories',
  'Fashion & Modeling',
  'Creative Arts',
  'Digital & Tech Design',
  'Performing Arts',
  'Content Creation'
];

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [search, setSearch] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Modals
  const [voteContestant, setVoteContestant] = useState<ContestantData | null>(null);
  const [shareContestant, setShareContestant] = useState<ContestantData | null>(null);

  const fetchLeaderboard = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedState !== 'All States') params.state = selectedState;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/leaderboard', { params });
      if (res.data.success) {
        setLeaderboard(res.data.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedCategory, selectedState, search]);

  // Polling every 12 seconds for near-live updates
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLeaderboard(true);
    }, 12000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedCategory, selectedState, search]);

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  // Leader vote count for relative comparison
  const leaderVotes = leaderboard.length > 0 ? Math.max(...leaderboard.map(c => c.voteCount || 0), 1) : 1;

  const getRelativePercent = (votes: number) => {
    return Math.min(100, Math.max(2, Math.round(((votes || 0) / leaderVotes) * 100)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/20">
          <Trophy className="w-3.5 h-3.5" /> Official Standings
        </div>
        <h1 className="font-bold text-3xl sm:text-4xl text-white">
          Live Contestant Leaderboard
        </h1>
        <p className="text-zinc-400 text-sm">
          Rankings are calculated dynamically from verified Paystack transaction records.
        </p>

        {/* Live indicator and refresh status */}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
            <span>{autoRefresh ? 'Live Auto-Polling Active' : 'Auto-Poll Paused'}</span>
          </div>
          <span>•</span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="text-zinc-400 hover:text-white underline underline-offset-4"
          >
            {autoRefresh ? 'Pause' : 'Resume'}
          </button>
          <span>•</span>
          <button
            onClick={() => fetchLeaderboard()}
            className="flex items-center gap-1 text-[#E5A93C] hover:underline"
          >
            <RefreshCw className="w-3 h-3" /> Refresh Now
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      {top3.length === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-end pt-4 pb-8">
          
          {/* 2nd Place Silver */}
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-[#12131a] border border-zinc-400/20 text-center space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-zinc-300 text-zinc-900 font-bold text-sm flex items-center justify-center mx-auto shadow">
              #2
            </div>
            <img
              src={top3[1].profileImage}
              alt={top3[1].fullName}
              className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-zinc-400 shadow-md"
            />
            <div className="space-y-1">
              <Link to={`/contestants/${top3[1].slug}`} className="font-bold text-base text-white hover:text-[#E5A93C] block truncate">
                {top3[1].fullName}
              </Link>
              <span className="text-xs text-zinc-400 block">{top3[1].state}</span>
              <span className="text-lg font-bold text-white block pt-1">
                {(top3[1].voteCount || 0).toLocaleString()} votes
              </span>
            </div>

            {/* Visual Progress Bar beneath profile compared to leader */}
            <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5 text-left">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Leader Ratio:</span>
                <span className="font-bold text-zinc-200">{getRelativePercent(top3[1].voteCount)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${getRelativePercent(top3[1].voteCount)}%` }}
                  className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-full transition-all duration-500"
                />
              </div>
              <div className="text-[10px] text-zinc-400 text-right">
                -{(leaderVotes - (top3[1].voteCount || 0)).toLocaleString()} votes behind #1
              </div>
            </div>

            <button
              onClick={() => setVoteContestant(top3[1])}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
            >
              Vote
            </button>
          </div>

          {/* 1st Place Gold (Center Tall) */}
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-[#1c1910] to-[#12131a] border-2 border-[#E5A93C] text-center space-y-4 shadow-xl shadow-[#E5A93C]/20 transform md:-translate-y-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-base flex items-center justify-center mx-auto shadow-md">
              👑 #1
            </div>
            <img
              src={top3[0].profileImage}
              alt={top3[0].fullName}
              className="w-28 h-28 rounded-2xl object-cover mx-auto border-2 border-[#E5A93C] shadow-lg"
            />
            <div className="space-y-1">
              <Link to={`/contestants/${top3[0].slug}`} className="font-bold text-xl text-white hover:text-[#E5A93C] block truncate">
                {top3[0].fullName}
              </Link>
              <span className="text-xs text-zinc-400 block">{top3[0].state} • {top3[0].category}</span>
              <span className="text-2xl font-bold text-[#FFD066] block pt-1">
                {(top3[0].voteCount || 0).toLocaleString()} votes
              </span>
            </div>

            {/* Visual Progress Bar for Leader (100%) */}
            <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-[#E5A93C]/20 text-left">
              <div className="flex justify-between text-xs text-[#FFD066] font-semibold">
                <span>Current Leader:</span>
                <span>100% (Pacesetter)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  style={{ width: '100%' }}
                  className="h-full bg-gradient-to-r from-[#E5A93C] to-[#FFD066] rounded-full transition-all duration-500"
                />
              </div>
              <div className="text-[10px] text-zinc-400 text-right">
                Leading the competition
              </div>
            </div>

            <button
              onClick={() => setVoteContestant(top3[0])}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-xs shadow-md hover:scale-105 transition"
            >
              Cast Vote
            </button>
          </div>

          {/* 3rd Place Bronze */}
          <div className="order-3 md:order-3 p-6 rounded-3xl bg-[#12131a] border border-amber-800/30 text-center space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-amber-800 text-amber-100 font-bold text-sm flex items-center justify-center mx-auto shadow">
              #3
            </div>
            <img
              src={top3[2].profileImage}
              alt={top3[2].fullName}
              className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-amber-800 shadow-md"
            />
            <div className="space-y-1">
              <Link to={`/contestants/${top3[2].slug}`} className="font-bold text-base text-white hover:text-[#E5A93C] block truncate">
                {top3[2].fullName}
              </Link>
              <span className="text-xs text-zinc-400 block">{top3[2].state}</span>
              <span className="text-lg font-bold text-white block pt-1">
                {(top3[2].voteCount || 0).toLocaleString()} votes
              </span>
            </div>

            {/* Visual Progress Bar beneath profile compared to leader */}
            <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5 text-left">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Leader Ratio:</span>
                <span className="font-bold text-amber-400">{getRelativePercent(top3[2].voteCount)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${getRelativePercent(top3[2].voteCount)}%` }}
                  className="h-full bg-gradient-to-r from-amber-700 to-amber-500 rounded-full transition-all duration-500"
                />
              </div>
              <div className="text-[10px] text-zinc-400 text-right">
                -{(leaderVotes - (top3[2].voteCount || 0)).toLocaleString()} votes behind #1
              </div>
            </div>

            <button
              onClick={() => setVoteContestant(top3[2])}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
            >
              Vote
            </button>
          </div>

        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#12131a] rounded-2xl p-4 sm:p-5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search contestant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C]"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
          >
            {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Complete Table / Leaderboard List */}
      <div className="bg-[#12131a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Contestant</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">State</th>
                <th className="py-4 px-6 text-right">Votes</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    Loading live standings...
                  </td>
                </tr>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((c) => (
                  <tr
                    key={c._id || c.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 font-mono font-bold">
                      {c.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-black font-extrabold text-xs">
                          1
                        </span>
                      ) : c.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-300 text-black font-bold text-xs">
                          2
                        </span>
                      ) : c.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-800 text-amber-100 font-bold text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-xs">#{c.rank}</span>
                      )}
                    </td>

                    {/* Contestant info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.profileImage}
                          alt={c.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/contestants/${c.slug}`}
                              className="font-bold text-white group-hover:text-[#E5A93C] transition block truncate"
                            >
                              {c.fullName}
                            </Link>
                            <span className="font-mono text-xs text-[#E5A93C] shrink-0">
                              {c.contestantId}
                            </span>
                          </div>

                          {/* Visual Progress Bar beneath contestant profile */}
                          <div className="space-y-1 max-w-[260px]">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-400">
                                {c.rank === 1 ? '100% (Leader)' : `${getRelativePercent(c.voteCount)}% of leader`}
                              </span>
                              {c.rank !== 1 && (
                                <span className="text-zinc-500 text-[10px]">
                                  -{(leaderVotes - (c.voteCount || 0)).toLocaleString()} votes
                                </span>
                              )}
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                style={{ width: `${getRelativePercent(c.voteCount)}%` }}
                                className={`h-full rounded-full transition-all duration-500 ${
                                  c.rank === 1
                                    ? 'bg-gradient-to-r from-amber-400 to-[#FFD066]'
                                    : c.rank === 2
                                    ? 'bg-gradient-to-r from-zinc-400 to-zinc-200'
                                    : c.rank === 3
                                    ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                                    : 'bg-gradient-to-r from-[#E5A93C]/80 to-[#FFD066]'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-xs text-zinc-300 whitespace-nowrap">
                      {c.category}
                    </td>

                    {/* State */}
                    <td className="py-4 px-6 text-xs text-zinc-400 whitespace-nowrap">
                      {c.state}
                    </td>

                    {/* Votes */}
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-base text-[#FFD066] block">
                        {(c.voteCount || 0).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-zinc-400 block">
                        {getRelativePercent(c.voteCount)}% share
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/contestants/${c.slug}`}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setVoteContestant(c)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition"
                        >
                          Vote
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No contestants matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <VoteModal
        contestant={voteContestant}
        isOpen={!!voteContestant}
        onClose={() => setVoteContestant(null)}
        onVoteSuccess={(newTotal) => {
          if (voteContestant) {
            setLeaderboard(prev =>
              prev.map(c => (c._id === voteContestant._id ? { ...c, voteCount: newTotal } : c))
            );
          }
          fetchLeaderboard(true);
        }}
      />

      <ShareModal
        contestant={shareContestant}
        isOpen={!!shareContestant}
        onClose={() => setShareContestant(null)}
      />

    </div>
  );
};
