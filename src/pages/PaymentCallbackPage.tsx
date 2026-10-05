import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../lib/api';

export const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Accept multiple possible Paystack callback query names
  const reference =
    searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('ref') ||
    // fallback to direct window search parsing if router didn't capture
    new URLSearchParams(window.location.search).get('reference') ||
    new URLSearchParams(window.location.search).get('trxref') ||
    new URLSearchParams(window.location.search).get('ref');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setMessage('No transaction reference provided in URL.');
      return;
    }

    // Try vote verification first, then fall back to registration verification
    api
      .get(`/votes/verify/${reference}`)
      .then(res => {
        if (res.data.success) {
          setSuccess(true);
          setMessage(res.data.message || 'Payment successfully verified!');
          setDetails(res.data.data);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } else {
          // If vote verify returned non-success, throw to trigger fallback
          throw new Error(res.data.message || 'Vote verification failed');
        }
      })
      .catch(() => {
        // Fallback: try registration verification endpoint
        return api.post('/contestants/verify-payment', { reference })
          .then(r => {
            if (r.data.success) {
              setSuccess(true);
              setMessage(r.data.message || 'Registration payment verified!');
              setDetails({ contestant: r.data.data.contestant });
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              // After brief celebration, navigate user to the contestant profile card
              const slug = r.data.data.contestant?.slug;
              if (slug) {
                setTimeout(() => {
                  navigate(`/contestants/${slug}`);
                }, 1400);
              }
            } else {
              setSuccess(false);
              setMessage(r.data.message || 'Verification failed');
            }
          })
          .catch(err2 => {
            setSuccess(false);
            setMessage(err2.response?.data?.message || 'Payment verification could not be confirmed');
          });
      })
      .finally(() => setLoading(false));
  }, [reference]);

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-[#12131a] rounded-3xl border border-white/10 p-8 shadow-2xl text-center space-y-6">
        {loading ? (
          <div className="space-y-3 py-6">
            <Loader2 className="w-10 h-10 animate-spin text-[#E5A93C] mx-auto" />
            <h2 className="font-heading font-bold text-lg text-white">Verifying Transaction</h2>
            <p className="text-xs text-zinc-400">Communicating with Paystack gateway ledger...</p>
          </div>
        ) : success ? (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="font-heading font-black text-2xl text-white">Transaction Verified!</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">{message}</p>
            {details?.contestant && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-left space-y-1">
                <div className="text-zinc-400">Contestant: <strong className="text-white">{details.contestant.name}</strong></div>
                <div className="text-zinc-400">Votes Credited: <strong className="text-[#FFD066]">+{details.votesAdded}</strong></div>
              </div>
            )}
            <div className="pt-2">
              <Link
                to="/leaderboard"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-xs uppercase tracking-wider block transition"
              >
                View Live Leaderboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-9 h-9" />
            </div>
            <h2 className="font-heading font-bold text-xl text-white">Payment Unconfirmed</h2>
            <p className="text-xs text-zinc-400">{message}</p>
            <Link
              to="/vote"
              className="inline-block px-6 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold"
            >
              Back to Voting Terminal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
