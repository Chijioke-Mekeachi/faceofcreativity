import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07080b] border-t border-white/10 text-zinc-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E5A93C] to-[#C78516] p-[2px]">
                <div className="w-full h-full bg-[#0b0c10] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#E5A93C]" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl tracking-wider text-white">
                FACE OF <span className="text-[#E5A93C]">CREATIVITY</span>
              </span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Nigeria’s premier creative competition uniting runway models, fashion pioneers, performing artists, and digital visualizers across all 36 states and Abuja.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#E5A93C] hover:border-[#E5A93C]/40 transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#E5A93C] hover:border-[#E5A93C]/40 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#E5A93C] hover:border-[#E5A93C]/40 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-[#E5A93C] hover:border-[#E5A93C]/40 transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Payments securely processed with 256-bit Paystack encryption</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/contestants" className="hover:text-[#E5A93C] transition">Contestant Directory</Link></li>
              <li><Link to="/leaderboard" className="hover:text-[#E5A93C] transition">Live Leaderboard</Link></li>
              <li><Link to="/register" className="hover:text-[#E5A93C] transition">Contestant Registration</Link></li>
              <li><Link to="/vote" className="hover:text-[#E5A93C] transition">Cast Votes</Link></li>
              <li><Link to="/rules" className="hover:text-[#E5A93C] transition">Official Rules & Terms</Link></li>
              <li><Link to="/faq" className="hover:text-[#E5A93C] transition">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Creative Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/contestants?category=Fashion %26 Modeling" className="hover:text-[#E5A93C] transition">Fashion & Runway</Link></li>
              <li><Link to="/contestants?category=Creative Arts" className="hover:text-[#E5A93C] transition">Creative Arts & Painting</Link></li>
              <li><Link to="/contestants?category=Digital %26 Tech Design" className="hover:text-[#E5A93C] transition">Digital & 3D Design</Link></li>
              <li><Link to="/contestants?category=Performing Arts" className="hover:text-[#E5A93C] transition">Performing Arts & Dance</Link></li>
              <li><Link to="/contestants?category=Content Creation" className="hover:text-[#E5A93C] transition">Content Creation</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Official Hub</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">Plot 14 Victoria Island, Lagos State, Nigeria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span className="text-xs">+234 812 345 6789</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span className="text-xs">support@faceofcreativity.ng</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4"
                >
                  Admin Management Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Face of Creativity Nigeria. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            Proudly Celebrating Nigerian Creative Excellence 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
};
