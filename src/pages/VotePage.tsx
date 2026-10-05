import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Search, Sparkles, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import { ContestantCard, ContestantData } from '../components/ContestantCard';
import { VoteModal } from '../components/VoteModal';
import { ShareModal } from '../components/ShareModal';

export const VotePage: React.FC = () => {
  const [contestants, setContestants] = useState<ContestantData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [voteContestant, setVoteContestant] = useState<ContestantData | null>(null);
  const [shareContestant, setShareContestant] = useState<ContestantData | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/contestants?limit=24&sortBy=votes')
      .then(res => {
        if (res.data.success) {
          setContestants(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredContestants = contestants.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.contestantId.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/20">
          <Vote className="w-3.5 h-3.5" /> Cast Your Votes
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">
          Vote for Face of Creativity 2026
        </h1>
        <p className="text-zinc-400 text-sm">
          Select your candidate below. 1 Vote = ₦100. Choose bundled packages to rapidly elevate your favorite creator to the televised Lagos finals!
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by contestant name, ID (e.g. FOC-2026-001), or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#12131a] border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C] shadow-lg transition"
          />
        </div>
      </div>

      {/* Grid of Contestants */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-zinc-900/60 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredContestants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredContestants.map((c) => (
            <ContestantCard
              key={c._id || c.id}
              contestant={c}
              onVoteClick={(item) => setVoteContestant(item)}
              onShareClick={(item) => setShareContestant(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-zinc-500">
          No contestants matching "{search}".
        </div>
      )}

      {/* Modals */}
      <VoteModal
        contestant={voteContestant}
        isOpen={!!voteContestant}
        onClose={() => setVoteContestant(null)}
        onVoteSuccess={(newTotal) => {
          if (voteContestant) {
            setContestants(prev =>
              prev.map(c => (c._id === voteContestant._id ? { ...c, voteCount: newTotal } : c))
            );
          }
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
