import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Vote, 
  ChevronLeft, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../lib/api';

export const VoteContestantPage: React.FC = () => {
  const { contestantId } = useParams<{ contestantId: string }>();

  const [contestant, setContestant] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [packages, setPackages] = useState<any[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<number>(50);
  const [voterName, setVoterName] = useState<string>('');
  const [voterEmail, setVoterEmail] = useState<string>('');
  const [voterPhone, setVoterPhone] = useState<string>('');

  const [processing, setProcessing] = useState<boolean>(false);
  const [successResult, setSuccessResult] = useState<any>(null);

  useEffect(() => {
    if (!contestantId) return;
    setLoading(true);

    // Try fetch by ID or slug
    api.get(`/contestants/${contestantId}`)
      .then(res => {
        if (res.data.success) {
          setContestant(res.data.data);
        }
      })
      .catch(() => {
        // Fallback to slug search
        api.get(`/contestants/slug/${contestantId}`)
          .then(res => {
            if (res.data.success) setContestant(res.data.data);
            else setError('Contestant not found');
          })
          .catch(() => setError('Contestant not found'));
      })
      .finally(() => setLoading(false));

    api.get('/votes/packages')
      .then(res => {
        if (res.data.success && res.data.data.packages?.length) {
          setPackages(res.data.data.packages);
        }
      })
      .catch(console.error);
  }, [contestantId]);

  const currentAmount = selectedVotes * 100;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterEmail.trim()) {
      setError('Voter email address is required');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const initRes = await api.post('/votes/initialize', {
        contestantId: contestant._id || contestant.id,
        votes: selectedVotes,
        voterName: voterName.trim() || 'Supporter',
        voterEmail: voterEmail.trim(),
        voterPhone: voterPhone.trim(),
        callbackUrl: `${window.location.origin}/payment/callback`
      });

      if (!initRes.data.success) {
        throw new Error(initRes.data.message || 'Payment initialization failed');
      }

      const { authorization_url } = initRes.data.data;
      if (!authorization_url) {
        throw new Error('Paystack checkout URL is missing');
      }

      if (typeof window !== 'undefined') {
        window.location.href = authorization_url;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-20 text-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#E5A93C]" />
        Loading contestant voting terminal...
      </div>
    );
  }

  if (error || !contestant) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-zinc-400">{error || 'Contestant not found'}</p>
        <Link to="/vote" className="px-4 py-2 rounded-xl bg-[#E5A93C] text-black font-bold text-xs">
          Return to Voting Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link to="/vote" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition">
          <ChevronLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>

      <div className="bg-[#12131a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Contestant summary */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
          <img
            src={contestant.profileImage}
            alt={contestant.fullName}
            className="w-16 h-16 rounded-2xl object-cover border border-white/10"
          />
          <div>
            <span className="text-xs font-mono font-bold text-[#E5A93C]">{contestant.contestantId}</span>
            <h1 className="font-heading font-black text-2xl text-white">{contestant.fullName}</h1>
            <p className="text-xs text-zinc-400">{contestant.state} State • {contestant.category}</p>
          </div>
        </div>

        {successResult ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="font-heading font-black text-2xl text-white">Votes Verified & Credited!</h2>
            <p className="text-sm text-zinc-300">
              You added <strong className="text-[#FFD066]">+{successResult.votes} votes</strong> for {contestant.fullName}.
            </p>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-zinc-400 space-y-1">
              <div>New Total Votes: <strong className="text-white font-mono">{successResult.newTotal?.toLocaleString()}</strong></div>
              <div>Reference: <span className="font-mono text-zinc-300">{successResult.reference}</span></div>
            </div>
            <Link
              to={`/contestants/${contestant.slug}`}
              className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-xs uppercase"
            >
              View Updated Contestant Profile
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Packages */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                Select Vote Bundle
              </label>
              <div className="grid grid-cols-3 gap-3">
                {packages.map((pkg) => (
                  <button
                    key={pkg.votes}
                    type="button"
                    onClick={() => setSelectedVotes(pkg.votes)}
                    className={`p-3.5 rounded-2xl border text-center transition ${
                      selectedVotes === pkg.votes
                        ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg font-mono font-black block">{pkg.votes}</span>
                    <span className="text-[10px] text-zinc-400 uppercase">Votes</span>
                    <span className="text-xs font-bold text-[#FFD066] block mt-1">₦{pkg.amount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voter Details */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Supporter Details
              </label>
              <input
                type="email"
                required
                placeholder="Email Address (Required for Receipt) *"
                value={voterEmail}
                onChange={(e) => setVoterEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
                <input
                  type="tel"
                  placeholder="Phone (Optional)"
                  value={voterPhone}
                  onChange={(e) => setVoterPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between text-sm">
              <span className="text-zinc-400">Total Payable:</span>
              <span className="text-2xl font-black font-mono text-[#FFD066]">₦{currentAmount.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5A93C] via-[#FFD066] to-[#D97706] text-black font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-[#E5A93C]/25 hover:scale-[1.01] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting to Paystack...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ₦{currentAmount.toLocaleString()} via Paystack
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
