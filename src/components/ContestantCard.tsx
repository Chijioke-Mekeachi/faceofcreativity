import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Vote, MapPin, Share2, Eye } from 'lucide-react';

export interface ContestantData {
  _id: string;
  id?: string;
  contestantId: string;
  slug: string;
  fullName: string;
  category: string;
  state: string;
  city?: string;
  profileImage: string;
  voteCount: number;
  profileViews?: number;
  rank?: number;
  talent?: string;
}

interface ContestantCardProps {
  contestant: ContestantData;
  onVoteClick: (contestant: ContestantData) => void;
  onShareClick?: (contestant: ContestantData) => void;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  onVoteClick,
  onShareClick
}) => {
  const getRankBadge = (rank?: number) => {
    if (!rank) return null;
    if (rank === 1) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-black shadow">
          <Trophy className="w-3.5 h-3.5" /> #1 Rank
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-300 text-zinc-900 shadow">
          <Trophy className="w-3.5 h-3.5" /> #2 Rank
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-700 text-amber-100 shadow">
          <Trophy className="w-3.5 h-3.5" /> #3 Rank
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
        #{rank}
      </span>
    );
  };

  return (
    <div className="group relative bg-[#12131a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5A93C]/40 transition-all duration-300 flex flex-col hover:shadow-xl font-sans">
      
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
        <img
          src={contestant.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
          alt={contestant.fullName}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div>{getRankBadge(contestant.rank)}</div>

          <div className="flex items-center gap-1.5">
            {onShareClick && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShareClick(contestant);
                }}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 hover:text-white hover:bg-black/90 transition border border-white/10"
                title="Share contestant"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-[#E5A93C] border border-[#E5A93C]/30">
              {contestant.contestantId}
            </span>
          </div>
        </div>

        {/* Bottom tags on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-zinc-200 border border-white/10 flex items-center gap-1 text-[11px]">
            <MapPin className="w-3 h-3 text-[#E5A93C]" />
            {contestant.state}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#E5A93C]/20 backdrop-blur-md text-[#FFD066] border border-[#E5A93C]/30 font-medium text-[11px]">
            {contestant.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link
            to={`/contestants/${contestant.slug}`}
            className="font-bold text-base text-white hover:text-[#E5A93C] transition line-clamp-1"
          >
            {contestant.fullName}
          </Link>
          {contestant.talent && (
            <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
              {contestant.talent}
            </p>
          )}
        </div>

        {/* Vote count counter */}
        <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">Total Votes</span>
            <span className="text-base font-bold text-[#FFD066]">
              {(contestant.voteCount || 0).toLocaleString()}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-zinc-400 font-medium">Rank</span>
            <span className="text-sm font-bold text-zinc-200 block">
              #{contestant.rank || '-'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/contestants/${contestant.slug}`}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 text-center transition border border-white/10 flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            Profile
          </Link>

          <button
            onClick={() => onVoteClick(contestant)}
            className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] hover:from-[#F59E0B] hover:to-[#B45309] text-black text-xs font-bold text-center transition shadow-md shadow-[#E5A93C]/20 hover:scale-[1.02] flex items-center justify-center gap-1.5"
          >
            <Vote className="w-3.5 h-3.5" />
            Vote Now
          </button>
        </div>

      </div>

    </div>
  );
};
