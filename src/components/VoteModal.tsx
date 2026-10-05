import React, { useState, useEffect } from 'react';
import { 
  X, 
  Vote, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../lib/api';
import { ContestantData } from './ContestantCard';

interface VotePackage {
  votes: number;
  amount: number;
  popular?: boolean;
  label?: string;
}

interface VoteModalProps {
  contestant: ContestantData | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteSuccess?: (newTotalVotes: number) => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  contestant,
  isOpen,
  onClose,
  onVoteSuccess
}) => {
  const [packages, setPackages] = useState<VotePackage[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<number>(50);
  const [voterName, setVoterName] = useState<string>('');
  const [voterEmail, setVoterEmail] = useState<string>('');
  const [voterPhone, setVoterPhone] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    votesAdded: number;
    newTotal: number;
    reference: string;
  } | null>(null);

  // Fetch packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/votes/packages');
        if (res.data.success && res.data.data.packages?.length) {
          setPackages(res.data.data.packages);
        }
      } catch {
        setPackages([]);
      }
    };
    fetchPackages();
  }, []);

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessData(null);
      setLoading(false);
      setVerifying(false);
    }
  }, [isOpen, contestant]);

  if (!isOpen || !contestant) return null;

  const votePrice = 100;
  const currentAmount = selectedVotes * votePrice;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored if canvas unavailable
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!voterEmail.trim()) {
      setError('Please provide a valid email address for receipt and verification');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/votes/initialize', {
        contestantId: contestant._id || contestant.id,
        votes: selectedVotes,
        voterName: voterName.trim() || 'Supporter',
        voterEmail: voterEmail.trim(),
        voterPhone: voterPhone.trim(),
        callbackUrl: `${window.location.origin}/payment/callback`
      });

      if (!res.data.success) {
        throw new Error(res.data.message || 'Payment initialization failed');
      }

      const { authorization_url, reference } = res.data.data;
      if (!authorization_url) {
        throw new Error('Paystack checkout URL was not returned by the backend');
      }

      setVerifying(true);
      setLoading(false);

      if (typeof window !== 'undefined') {
        window.location.href = authorization_url;
      }

      if (reference && onVoteSuccess) {
        onVoteSuccess(Number(contestant.voteCount || 0) + selectedVotes);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Payment could not be processed');
      setLoading(false);
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111218] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success View */}
        {successData ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-2xl text-white">
                Votes Verified & Credited!
              </h3>
              <p className="text-zinc-400 text-sm">
                You successfully added <span className="text-[#FFD066] font-bold">+{successData.votesAdded} votes</span> to {contestant.fullName}.
              </p>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 text-left space-y-2 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Contestant:</span>
                <span className="text-white font-medium">{contestant.fullName} ({contestant.contestantId})</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Updated Total Votes:</span>
                <span className="text-[#E5A93C] font-mono font-bold text-base">{successData.newTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-xs">
                <span>Paystack Reference:</span>
                <span className="font-mono text-zinc-300">{successData.reference}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#E5A93C]/20 hover:scale-[1.02] transition"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleProceedToPayment} className="space-y-6">
            
            {/* Contestant Header Summary */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <img
                src={contestant.profileImage}
                alt={contestant.fullName}
                className="w-14 h-14 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#E5A93C]">{contestant.contestantId}</span>
                  <span className="text-xs text-zinc-400">• {contestant.category}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white truncate">
                  {contestant.fullName}
                </h3>
                <p className="text-xs text-zinc-400">
                  Current votes: <span className="text-zinc-200 font-mono font-bold">{(contestant.voteCount || 0).toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Select Vote Package */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                1. Select Vote Package
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {packages.map((pkg) => (
                  <button
                    key={pkg.votes}
                    type="button"
                    onClick={() => setSelectedVotes(pkg.votes)}
                    className={`relative p-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
                      selectedVotes === pkg.votes
                        ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white shadow-md shadow-[#E5A93C]/10 scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E5A93C] text-black">
                        Popular
                      </span>
                    )}
                    <span className="text-base font-extrabold font-mono block">
                      {pkg.votes}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-tight">Votes</span>
                    <span className="text-xs font-semibold text-[#FFD066] mt-1 block">
                      ₦{pkg.amount.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom votes slider / input */}
              <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-zinc-400">Custom Count:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={selectedVotes}
                    onChange={(e) => setSelectedVotes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-2 py-1 bg-black/60 border border-white/15 rounded-lg text-right font-mono font-bold text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                  <span className="text-zinc-400">votes</span>
                </div>
              </div>
            </div>

            {/* Step 2: Supporter Information */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                2. Supporter Details (For Receipt & Leaderboard)
              </label>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Your Email Address *"
                  value={voterEmail}
                  onChange={(e) => setVoterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C] transition"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={voterPhone}
                  onChange={(e) => setVoterPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C] transition"
                />
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-sm">
              <span className="text-zinc-400">Total Payable Amount:</span>
              <span className="text-xl font-bold font-mono text-[#FFD066]">
                ₦{currentAmount.toLocaleString()}
              </span>
            </div>

            {/* Pay with Paystack Button */}
            <button
              type="submit"
              disabled={loading || verifying}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E5A93C] via-[#FFD066] to-[#D97706] text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#E5A93C]/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading || verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {verifying ? 'Redirecting to Paystack...' : 'Connecting to Gateway...'}
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ₦{currentAmount.toLocaleString()} via Paystack
                </>
              )}
            </button>

            {/* Guarantee footer */}
            <p className="text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Real-time payment verification. Votes are immediately recorded in the ledger.
            </p>

          </form>
        )}

      </div>
    </div>
  );
};
