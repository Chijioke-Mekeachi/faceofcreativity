import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { ContestantData } from './ContestantCard';

interface ShareModalProps {
  contestant: ContestantData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ contestant, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !contestant) return null;

  const url = `${window.location.origin}/contestants/${contestant.slug}`;
  const shareText = `Support ${contestant.fullName} (${contestant.contestantId}) in Face of Creativity Nigeria 2026! Cast your votes here: ${url}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#12131a] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center mx-auto border border-[#E5A93C]/20">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">
            Share Contestant Profile
          </h3>
          <p className="text-xs text-zinc-400">
            Rally friends, family, and supporters to vote for <span className="text-zinc-200 font-semibold">{contestant.fullName}</span>.
          </p>
        </div>

        {/* Copy Link field */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Profile Direct Link
          </label>
          <div className="flex items-center gap-2 bg-black/50 border border-white/15 rounded-xl p-2">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full bg-transparent text-xs text-zinc-300 px-2 focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-1.5 rounded-lg bg-[#E5A93C] text-black font-bold text-xs flex items-center gap-1.5 shrink-0 hover:bg-[#FFD066] transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={shareWhatsApp}
            className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition flex flex-col items-center gap-1.5 text-xs font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareTwitter}
            className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition flex flex-col items-center gap-1.5 text-xs font-medium"
          >
            <Twitter className="w-5 h-5" />
            <span>X (Twitter)</span>
          </button>

          <button
            onClick={shareFacebook}
            className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition flex flex-col items-center gap-1.5 text-xs font-medium"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </button>
        </div>

      </div>
    </div>
  );
};
