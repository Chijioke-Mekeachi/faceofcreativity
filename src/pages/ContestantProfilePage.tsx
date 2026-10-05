import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, 
  Vote, 
  Share2, 
  MapPin, 
  Sparkles, 
  Eye, 
  Instagram, 
  Facebook, 
  Twitter, 
  ChevronLeft, 
  ShieldCheck, 
  Heart, 
  Copy, 
  Check,
  TrendingUp,
  MessageCircle,
  Clock
} from 'lucide-react';
import api from '../lib/api';
import { VoteModal } from '../components/VoteModal';
import { ShareModal } from '../components/ShareModal';
import { ContestantData } from '../components/ContestantCard';

export const ContestantProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [contestant, setContestant] = useState<any>(null);
  const [votesHistory, setVotesHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [voteModalOpen, setVoteModalOpen] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchContestant = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/contestants/slug/${slug}`);
      if (res.data.success) {
        const data = res.data.data;
        setContestant(data);

        // Dynamic SEO document title update
        document.title = `Vote for ${data.fullName} (${data.contestantId}) | Face of Creativity 2026`;

        // Fetch recent supporter votes for this contestant
        const votesRes = await api.get(`/contestants/${data._id || data.id}/votes`);
        if (votesRes.data.success) {
          setVotesHistory(votesRes.data.data);
        }
      } else {
        setError('Contestant not found');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load contestant profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchContestant();
    }
  }, [slug]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#E5A93C] border-t-transparent animate-spin mx-auto" />
        <p className="text-zinc-400 text-sm">Loading contestant portfolio...</p>
      </div>
    );
  }

  if (error || !contestant) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-8 rounded-3xl bg-[#12131a] border border-white/10 space-y-3">
          <h2 className="font-heading font-bold text-xl text-white">Contestant Not Found</h2>
          <p className="text-xs text-zinc-400">
            {error || 'This contestant profile does not exist or may currently be under committee review.'}
          </p>
          <Link
            to="/contestants"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-bold text-xs uppercase"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back navigation */}
      <div>
        <Link
          to="/contestants"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to All Contestants
        </Link>
      </div>

      {/* Main Profile Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: High-resolution photo */}
        <div className="lg:col-span-5 relative group">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
            <img
              src={contestant.profileImage}
              alt={contestant.fullName}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Rank tag on photo */}
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black shadow-lg flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                Rank #{contestant.rank || '-'}
              </span>
            </div>

            {/* Verification badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Official Contestant
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 flex items-center gap-1 text-[11px]">
                <Eye className="w-3 h-3 text-[#E5A93C]" /> {contestant.profileViews || 1} Views
              </span>
            </div>
          </div>
        </div>

        {/* Right: Contestant Information & Vote Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#E5A93C]/10 text-[#FFD066] font-mono text-xs font-bold border border-[#E5A93C]/30">
                {contestant.contestantId}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-zinc-300 text-xs font-medium border border-white/10">
                {contestant.category}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-zinc-300 text-xs font-medium border border-white/10 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E5A93C]" />
                {contestant.city ? `${contestant.city}, ` : ''}{contestant.state} State
              </span>
            </div>

            <h1 className="font-bold text-3xl sm:text-4xl text-white">
              {contestant.fullName}
            </h1>

            {contestant.talent && (
              <p className="text-base font-semibold text-[#FFD066]">
                {contestant.talent}
              </p>
            )}
          </div>

          {/* Live Votes Ledger Callout */}
          <div className="p-5 rounded-2xl bg-[#14151e] border border-white/10 shadow-xl grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 font-medium block">Total Votes</span>
              <span className="text-2xl font-bold text-[#FFD066]">
                {(contestant.voteCount || 0).toLocaleString()}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-zinc-400 font-medium block">Standing</span>
              <span className="text-2xl font-bold text-white">
                #{contestant.rank || '-'}
              </span>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-xs text-zinc-400 font-medium block">Competition</span>
              <span className="text-sm font-semibold text-zinc-200 block pt-1">
                Season 2026
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setVoteModalOpen(true)}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] hover:from-[#F59E0B] hover:to-[#B45309] text-black font-bold text-sm shadow-lg shadow-[#E5A93C]/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              <Vote className="w-5 h-5" />
              Vote for {contestant.fullName.split(' ')[0]} Now
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-[#E5A93C]" />
              Share
            </button>

            <button
              onClick={copyProfileLink}
              className="py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition flex items-center justify-center"
              title="Copy voting link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Bio statement */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold text-zinc-400">
              Creative Statement & Biography
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed bg-[#12131a] p-5 rounded-2xl border border-white/5 whitespace-pre-line">
              {contestant.bio || 'Passionate Nigerian creative contending for the Face of Creativity crown.'}
            </p>
          </div>

          {/* Social Links */}
          {contestant.socialLinks && Object.values(contestant.socialLinks).some(Boolean) && (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Connect With {contestant.fullName.split(' ')[0]}
              </span>
              <div className="flex flex-wrap gap-2">
                {contestant.socialLinks.instagram && (
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {contestant.socialLinks.instagram}
                  </span>
                )}
                {contestant.socialLinks.tiktok && (
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {contestant.socialLinks.tiktok}
                  </span>
                )}
                {contestant.socialLinks.twitter && (
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {contestant.socialLinks.twitter}
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Supporter Stream / Recent Votes Table */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              Supporter Votes
            </h3>
            <p className="text-xs text-zinc-400">
              Recent verified votes cast by fans and community sponsors for {contestant.fullName}.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {votesHistory.length} Recorded Transactions
          </span>
        </div>

        {votesHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {votesHistory.map((v) => (
              <div
                key={v._id}
                className="p-3.5 rounded-xl bg-[#12131a] border border-white/10 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">{v.voterName}</span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#FFD066] text-sm">+{v.votes} Votes</span>
                  <span className="text-[10px] text-zinc-400 block">₦{v.amount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#12131a] border border-white/5 text-center text-xs text-zinc-400">
            Be the first to vote and ignite {contestant.fullName}'s leaderboard momentum!
          </div>
        )}
      </div>

      {/* Modals */}
      <VoteModal
        contestant={contestant}
        isOpen={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        onVoteSuccess={(newTotal) => {
          setContestant((prev: any) => ({ ...prev, voteCount: newTotal }));
          // Refresh votes stream
          if (contestant) {
            api.get(`/contestants/${contestant._id || contestant.id}/votes`)
              .then(res => { if (res.data.success) setVotesHistory(res.data.data); })
              .catch(console.error);
          }
        }}
      />

      <ShareModal
        contestant={contestant}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

    </div>
  );
};
