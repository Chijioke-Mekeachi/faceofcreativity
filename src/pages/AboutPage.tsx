import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Trophy, Award, ShieldCheck, Target, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/30">
          <Sparkles className="w-4 h-4 text-[#E5A93C]" />
          About The Competition
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-white">
          Empowering the Next Generation of African Creative Luminaries
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed">
          Face of Creativity Nigeria was founded on a singular conviction: that extraordinary talent exists in every corner of Nigeria, needing only an authentic, transparent, and globally-connected platform to shine.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#12131a] border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-white">
            Our Mission
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            To discover, spotlight, and equip talented Nigerian fashion models, designers, performing artists, and visual innovators with the capital, international agency representation, and commercial mentorship required to thrive on the world stage.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-[#12131a] border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-white">
            Our Vision
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            To build Africa’s most credible, technologically audited, and respected annual creative competition—bridging grassroots talent from Kano to Calabar with global creative economies in Milan, London, Paris, and New York.
          </p>
        </div>
      </div>

      {/* Judging & Tabulation Transparency */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#161722] to-[#0d0e14] border border-white/10 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#E5A93C] font-semibold">
            Uncompromising Integrity
          </span>
          <h2 className="font-heading font-black text-3xl text-white">
            Judging Methodology & Voting Audits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black font-mono text-[#E5A93C]">50%</span>
              <h3 className="font-heading font-bold text-lg text-white">Verified Public Votes</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every vote is securely generated through real financial transactions verified via Paystack. Automated bots, suspicious IP concentrations, and fraudulent chargebacks are actively scrubbed by our automated anti-fraud layer.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black font-mono text-emerald-400">50%</span>
              <h3 className="font-heading font-bold text-lg text-white">Grand Jury Panel</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A distinguished panel of international fashion directors, veteran runway coaches, media executives, and creative directors evaluate live stage execution, originality, poise, and commercial viability.
            </p>
          </div>
        </div>
      </div>

      {/* Stages of the Competition */}
      <div className="space-y-8">
        <h2 className="font-heading font-black text-3xl text-white text-center">
          Competition Road Map
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { phase: 'Stage 1', title: 'Nationwide Call & Registration', desc: 'Online submission across all 36 states and FCT with background screening.' },
            { phase: 'Stage 2', title: 'Public Voting Heats', desc: 'Contestants rally supporters on the live leaderboard to earn qualifying positions.' },
            { phase: 'Stage 3', title: 'Intensive Lagos Boot Camp', desc: 'Top 30 semi-finalists receive masterclasses in runway, branding, media, and contracts.' },
            { phase: 'Stage 4', title: 'Televised Grand Finale', desc: 'Live gala night in Lagos broadcast nationally with prize disbursements on stage.' }
          ].map((st) => (
            <div key={st.phase} className="p-6 rounded-2xl bg-[#12131a] border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase">{st.phase}</span>
              <h4 className="font-heading font-bold text-white text-base">{st.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#E5A93C]/20 hover:scale-105 transition"
        >
          <span>Apply to Compete in Season 2026</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
