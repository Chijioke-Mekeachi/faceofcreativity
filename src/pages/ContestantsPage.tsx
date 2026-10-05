import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import api from '../lib/api';
import { ContestantCard, ContestantData } from '../components/ContestantCard';
import { VoteModal } from '../components/VoteModal';
import { ShareModal } from '../components/ShareModal';

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

export const ContestantsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All Categories';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('votes'); // votes, newest, name

  const [contestants, setContestants] = useState<ContestantData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalContestants, setTotalContestants] = useState<number>(0);

  // Modals
  const [voteContestant, setVoteContestant] = useState<ContestantData | null>(null);
  const [shareContestant, setShareContestant] = useState<ContestantData | null>(null);

  const fetchContestants = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: 12,
        sortBy
      };

      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedState !== 'All States') params.state = selectedState;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/contestants', { params });
      if (res.data.success) {
        setContestants(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotalContestants(res.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to load contestants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestants();
  }, [page, selectedCategory, selectedState, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchContestants();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/20">
          <Sparkles className="w-3.5 h-3.5" /> Official Directory
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">
          Meet the Contestants
        </h1>
        <p className="text-zinc-400 text-sm">
          Browse through Nigeria’s finest emerging models, designers, and performers. Every vote helps determine who makes the live televised finals!
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-[#12131a] rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, ID (e.g. FOC-2026-001), or talent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C] transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C] transition"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* State Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C] transition"
            >
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-44">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C] transition"
            >
              <option value="votes">Most Votes</option>
              <option value="newest">Newest First</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#E5A93C] text-black font-bold text-sm hover:bg-[#FFD066] transition shrink-0"
          >
            Filter
          </button>
        </form>

        {/* Results Count bar */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/5">
          <span>
            Showing <strong className="text-white">{contestants.length}</strong> of <strong className="text-white">{totalContestants}</strong> verified contestants
          </span>
          {(selectedCategory !== 'All Categories' || selectedState !== 'All States' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All Categories');
                setSelectedState('All States');
                setSearchQuery('');
                setPage(1);
              }}
              className="text-[#E5A93C] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Contestants */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-zinc-900/60 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : contestants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contestants.map((c) => (
            <ContestantCard
              key={c._id || c.id}
              contestant={c}
              onVoteClick={(item) => setVoteContestant(item)}
              onShareClick={(item) => setShareContestant(item)}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl bg-[#12131a] border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">No contestants found</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            We couldn't find any approved contestants matching your current search query or filter settings.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All Categories');
              setSelectedState('All States');
              setSearchQuery('');
              setPage(1);
            }}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-medium text-zinc-400">
            Page <strong className="text-white font-mono">{page}</strong> of <strong className="text-white font-mono">{totalPages}</strong>
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Interactive Modals */}
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
