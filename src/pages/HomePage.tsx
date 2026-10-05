import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Trophy, 
  Vote, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  CheckCircle, 
  Layers, 
  Zap, 
  TrendingUp, 
  Award,
  ChevronDown
} from 'lucide-react';
import api from '../lib/api';
import { ContestantCard, ContestantData } from '../components/ContestantCard';
import { VoteModal } from '../components/VoteModal';
import { ShareModal } from '../components/ShareModal';
import { CountdownTimer } from '../components/CountdownTimer';

export const HomePage: React.FC = () => {
  const [competition, setCompetition] = useState<any>(null);
  const [topContestants, setTopContestants] = useState<ContestantData[]>([]);
  const [featuredContestants, setFeaturedContestants] = useState<ContestantData[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalContestants: 0,
    totalVotes: 0,
    totalStates: 36
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Modal states
  const [selectedContestantForVote, setSelectedContestantForVote] = useState<ContestantData | null>(null);
  const [selectedContestantForShare, setSelectedContestantForShare] = useState<ContestantData | null>(null);

  useEffect(() => {
    // 1. Fetch current competition
    api.get('/competition/current')
      .then(res => {
        if (res.data.success) setCompetition(res.data.data);
      })
      .catch(console.error);

    // 2. Fetch top 3 contestants for podium
    api.get('/leaderboard/top?limit=3')
      .then(res => {
        if (res.data.success) setTopContestants(res.data.data);
      })
      .catch(console.error);

    // 3. Fetch featured contestants
    api.get('/contestants?limit=6')
      .then(res => {
        if (res.data.success) {
          setFeaturedContestants(res.data.data);
          setStats(prev => ({
            ...prev,
            totalContestants: res.data.pagination?.total || res.data.data.length
          }));
        }
      })
      .catch(console.error);

    // 4. Fetch sponsors, faqs, testimonials
    api.get('/settings/sponsors')
      .then(res => { if (res.data.success) setSponsors(res.data.data); })
      .catch(console.error);

    api.get('/settings/testimonials')
      .then(res => { if (res.data.success) setTestimonials(res.data.data); })
      .catch(console.error);

    api.get('/settings/faqs')
      .then(res => { if (res.data.success) setFaqs(res.data.data.slice(0, 5)); })
      .catch(console.error);
  }, []);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'registration_open':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Registration Open
          </span>
        );
      case 'voting_open':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-[#FFD066] border border-[#E5A93C]/40">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-ping" />
            Live Public Voting Active
          </span>
        );
      case 'voting_closed':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            Voting Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/30">
            Season 2026 Active
          </span>
        );
    }
  };

  return (
    <div className="space-y-20 pb-20 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#E5A93C]/10 via-[#FFB800]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Status Pill */}
          <div className="flex justify-center">
            {getStatusBadge(competition?.status)}
          </div>

          {/* Main Title */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <h1 className="font-bold text-4xl sm:text-6xl text-white leading-tight">
              Face of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93C] via-[#FFD066] to-[#F59E0B]">Creativity</span>
            </h1>
            <p className="font-bold text-xl sm:text-2xl text-zinc-200">
              {competition?.tagline || 'Unleash Your Creativity. Be Seen. Be Celebrated.'}
            </p>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Nigeria’s premier creative and modeling stage. Empowering runway models, visual designers, performing artists, and digital innovators across all 36 states and Abuja.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] hover:from-[#F59E0B] hover:to-[#B45309] text-black font-bold text-sm shadow-lg shadow-[#E5A93C]/20 hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Register as Contestant
            </Link>

            <Link
              to="/vote"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-md hover:border-[#E5A93C]/40 transition flex items-center justify-center gap-2"
            >
              <Vote className="w-4 h-4 text-[#E5A93C]" />
              Vote for a Contestant
            </Link>
          </div>

          {/* Live Countdown & Prize Summary Card */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#12131a] border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Prize pool callout */}
              <div className="text-left space-y-1.5 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                <span className="text-xs text-[#E5A93C] font-semibold flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Total Prize Pool
                </span>
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  {competition?.totalPrize || '₦10,000,000'}
                </div>
                <p className="text-xs text-zinc-400">
                  Cash grants, international fashion agency contracts, and creative mentorships.
                </p>
              </div>

              {/* Countdown timer */}
              <div className="flex justify-center md:justify-end">
                <CountdownTimer
                  targetDate={competition?.votingEnd || '2026-12-15T23:59:59.000Z'}
                  label="Official Voting Closes In"
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE LEADERBOARD PODIUM PREVIEW (TOP 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/20">
            <Trophy className="w-3.5 h-3.5" /> Live Standings
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-white">
            Current Top Contenders
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
            Votes are updated live through authenticated Paystack payment processing.
          </p>
        </div>

        {/* Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end">
          {topContestants.length >= 3 ? (
            <>
              {/* 2nd Place (Silver) */}
              <div className="order-2 md:order-1 transform md:translate-y-4">
                <ContestantCard
                  contestant={topContestants[1]}
                  onVoteClick={(c) => setSelectedContestantForVote(c)}
                  onShareClick={(c) => setSelectedContestantForShare(c)}
                />
              </div>

              {/* 1st Place (Gold Center) */}
              <div className="order-1 md:order-2 transform md:-translate-y-4 ring-2 ring-[#E5A93C] rounded-2xl shadow-xl shadow-[#E5A93C]/20">
                <div className="bg-[#E5A93C] text-black text-xs font-bold py-1.5 text-center rounded-t-xl flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Leading Contender
                </div>
                <ContestantCard
                  contestant={topContestants[0]}
                  onVoteClick={(c) => setSelectedContestantForVote(c)}
                  onShareClick={(c) => setSelectedContestantForShare(c)}
                />
              </div>

              {/* 3rd Place (Bronze) */}
              <div className="order-3 md:order-3 transform md:translate-y-8">
                <ContestantCard
                  contestant={topContestants[2]}
                  onVoteClick={(c) => setSelectedContestantForVote(c)}
                  onShareClick={(c) => setSelectedContestantForShare(c)}
                />
              </div>
            </>
          ) : (
            <div className="col-span-3 text-center py-12 text-zinc-500">
              Loading live podium standings...
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 text-xs font-semibold border border-white/10 transition"
          >
            <span>View Complete Leaderboard Standings</span>
            <ArrowRight className="w-4 h-4 text-[#E5A93C]" />
          </Link>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-[#0e0f15] py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs text-[#E5A93C] font-semibold">
              Simple 4-Step Journey
            </span>
            <h2 className="font-bold text-2xl sm:text-3xl text-white">
              How Face of Creativity Works
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
              A transparent, equitable platform engineered to turn creative vision into a national career.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Register Online',
                desc: 'Complete your creative profile, state details, and talent category with a one-time ₦1,000 verification fee.'
              },
              {
                step: '02',
                title: 'Review & Approval',
                desc: 'The official jury board verifies all submission credentials and activates your public contestant portfolio.'
              },
              {
                step: '03',
                title: 'Mobilize Votes',
                desc: 'Share your dedicated profile URL with fans, family, and social followers to climb the live real-time leaderboard.'
              },
              {
                step: '04',
                title: 'Grand Finale',
                desc: 'Top national finalists perform in the televised Lagos grand showcase for ₦10,000,000 and international contracts.'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-5 rounded-2xl bg-[#14151e] border border-white/10 hover:border-[#E5A93C]/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="text-2xl font-bold text-[#E5A93C]/40 group-hover:text-[#E5A93C] transition-colors">
                  {item.step}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VOTING PACKAGES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs text-[#E5A93C] font-semibold">
            Support Rising Talent
          </span>
          <h2 className="font-bold text-2xl sm:text-3xl text-white">
            Transparent Voting Packages
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
            1 Vote = ₦100. Choose bundled packages to power your favorite contestant up the rankings.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { votes: 10, amount: '₦1,000', popular: false },
            { votes: 25, amount: '₦2,500', popular: false },
            { votes: 50, amount: '₦5,000', popular: true, tag: 'Most Popular' },
            { votes: 100, amount: '₦10,000', popular: false, tag: 'Power Boost' },
            { votes: 250, amount: '₦25,000', popular: false, tag: 'VIP Supporter' },
            { votes: 500, amount: '₦50,000', popular: false, tag: 'Champion' }
          ].map((pkg) => (
            <div
              key={pkg.votes}
              className={`p-4 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'bg-[#E5A93C]/10 border-[#E5A93C] shadow-md shadow-[#E5A93C]/10'
                  : 'bg-[#12131a] border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.tag && (
                <span className="text-[10px] font-bold text-[#E5A93C] mb-1.5 block">
                  {pkg.tag}
                </span>
              )}
              <div className="space-y-1 my-auto">
                <span className="text-2xl font-bold text-white block">
                  {pkg.votes}
                </span>
                <span className="text-[11px] text-zinc-400">
                  Votes
                </span>
                <span className="text-xs font-bold text-[#FFD066] block pt-1.5">
                  {pkg.amount}
                </span>
              </div>

              <Link
                to="/vote"
                className="mt-3 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-[#E5A93C] hover:text-black text-xs font-semibold text-zinc-300 transition"
              >
                Select
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED CONTESTANTS DIRECTORY TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-[#E5A93C] font-semibold">
              Explore Profiles
            </span>
            <h2 className="font-bold text-2xl text-white">
              Featured Contestants
            </h2>
          </div>

          <Link
            to="/contestants"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5A93C] hover:text-[#FFD066] transition"
          >
            <span>Browse All Contestants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContestants.map((c) => (
            <ContestantCard
              key={c._id || c.id}
              contestant={c}
              onVoteClick={(item) => setSelectedContestantForVote(item)}
              onShareClick={(item) => setSelectedContestantForShare(item)}
            />
          ))}
        </div>
      </section>

      {/* 6. COMPETITION PRIZES & BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-7 sm:p-10 rounded-2xl bg-[#14151e] border border-white/10 shadow-xl space-y-8">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs text-[#E5A93C] font-semibold">
              Life-Changing Opportunities
            </span>
            <h2 className="font-bold text-2xl sm:text-3xl text-white">
              Prizes & Winner Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-black/40 border border-[#E5A93C]/40 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-[#FFD066] flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">
                1st Place Champion
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {competition?.firstPrize || '₦5,000,000 Cash + International Modeling Contract + Milan Fashion Week Appearance'}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-300/10 text-zinc-300 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">
                2nd Place Runner Up
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {competition?.secondPrize || '₦3,000,000 Cash + Creative Studio Equipment Grant + Brand Ambassadorship'}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-700/10 text-amber-500 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">
                3rd Place Finalist
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {competition?.thirdPrize || '₦2,000,000 Cash + 1-Year Masterclass Mentorship with Top Industry Leaders'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ALUMNI TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs text-[#E5A93C] font-semibold">
              Success Stories
            </span>
            <h2 className="font-bold text-2xl text-white">
              Words From Past Winners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t._id || t.id}
                className="p-5 rounded-2xl bg-[#12131a] border border-white/10 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-1 text-[#E5A93C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-2.5 pt-1">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-zinc-400">{t.role} ({t.season})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. SPONSORS MARQUEE */}
      {sponsors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center">
            <span className="text-xs text-zinc-500 font-semibold">
              Official Partners & Endorsers
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all">
            {sponsors.map((sp) => (
              <div key={sp._id || sp.id} className="flex items-center gap-2 text-zinc-300 font-bold text-xs">
                <span className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  {sp.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. FAQ ACCORDION PREVIEW */}
      {faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs text-[#E5A93C] font-semibold">
              Got Questions?
            </span>
            <h2 className="font-bold text-2xl text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, index) => (
              <div
                key={faq._id || faq.id || index}
                className="rounded-xl bg-[#12131a] border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-[#E5A93C] transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#E5A93C] shrink-0 transition-transform ${
                      activeFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="p-4 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. FINAL CALL TO ACTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-12 rounded-2xl bg-[#14151e] border border-[#E5A93C]/30 text-center space-y-5 overflow-hidden">
          <h2 className="font-bold text-2xl sm:text-4xl text-white">
            Ready to Take Your Talent to the World?
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-lg mx-auto">
            Registrations are closing soon. Don't let your creative potential remain in the shadows.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-xs uppercase shadow-md shadow-[#E5A93C]/20 hover:scale-105 transition"
            >
              Start Application (₦1,000)
            </Link>
            <Link
              to="/vote"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition"
            >
              Cast Supporter Votes
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Modals */}
      <VoteModal
        contestant={selectedContestantForVote}
        isOpen={!!selectedContestantForVote}
        onClose={() => setSelectedContestantForVote(null)}
        onVoteSuccess={(newTotal) => {
          if (selectedContestantForVote) {
            setFeaturedContestants(prev =>
              prev.map(c => (c._id === selectedContestantForVote._id ? { ...c, voteCount: newTotal } : c))
            );
            setTopContestants(prev =>
              prev.map(c => (c._id === selectedContestantForVote._id ? { ...c, voteCount: newTotal } : c))
            );
          }
        }}
      />

      <ShareModal
        contestant={selectedContestantForShare}
        isOpen={!!selectedContestantForShare}
        onClose={() => setSelectedContestantForShare(null)}
      />

    </div>
  );
};
