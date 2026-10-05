import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Menu, 
  X, 
  Trophy, 
  Users, 
  UserPlus, 
  Vote, 
  ShieldCheck, 
  HelpCircle, 
  Phone,
  LayoutDashboard,
  ChevronDown,
  Info,
  Palette,
  Camera,
  Music,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const categories = [
    { name: 'Fashion & Modeling', path: '/contestants?category=Fashion %26 Modeling', desc: 'Runway, editorial, and commercial models' },
    { name: 'Creative Arts', path: '/contestants?category=Creative Arts', desc: 'Painting, sculpture, and mixed media' },
    { name: 'Digital & Tech Design', path: '/contestants?category=Digital %26 Tech Design', desc: '3D CGI, motion, and visual design' },
    { name: 'Performing Arts', path: '/contestants?category=Performing Arts', desc: 'Choreography, vocals, and drama' },
    { name: 'Content Creation', path: '/contestants?category=Content Creation', desc: 'Cinematography and digital storytelling' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0c10]/95 border-b border-white/10 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E5A93C] via-[#FFD066] to-[#C78516] p-[2px] shadow-md shadow-[#E5A93C]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0c10] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#E5A93C]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white flex items-center gap-1.5">
                FACE OF <span className="text-[#E5A93C]">CREATIVITY</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">
                Nigeria 2026 Season
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Hover Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            
            {/* Home Link */}
            <Link
              to="/"
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            {/* Contestants Dropdown (Hover) */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/contestants') || isActive('/leaderboard') || isActive('/vote')
                    ? 'text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                    : 'text-zinc-300 group-hover:text-white group-hover:bg-white/5'
                }`}
              >
                <span>Contestants</span>
                <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-[#E5A93C] group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 rounded-2xl bg-[#12131a] border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1">
                  
                  <Link
                    to="/contestants"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">Contestant Directory</span>
                      <span className="text-xs text-zinc-400">Search and discover all 36 state contestants</span>
                    </div>
                  </Link>

                  <Link
                    to="/leaderboard"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#FFD066] flex items-center justify-center shrink-0 mt-0.5">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">Live Leaderboard</span>
                      <span className="text-xs text-zinc-400">Real-time standings & podium ranks</span>
                    </div>
                  </Link>

                  <Link
                    to="/vote"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Vote className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">Cast Votes</span>
                      <span className="text-xs text-zinc-400">Power your candidate to the finals</span>
                    </div>
                  </Link>

                </div>
              </div>
            </div>

            {/* Categories Dropdown (Hover) */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-zinc-300 rounded-lg group-hover:text-white group-hover:bg-white/5 transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-[#E5A93C] group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full left-0 pt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 rounded-2xl bg-[#12131a] border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 text-[#E5A93C] flex items-center justify-center shrink-0 mt-0.5">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">{cat.name}</span>
                        <span className="text-xs text-zinc-400">{cat.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Information & Guidelines Dropdown (Hover) */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/about') || isActive('/rules') || isActive('/faq') || isActive('/contact')
                    ? 'text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                    : 'text-zinc-300 group-hover:text-white group-hover:bg-white/5'
                }`}
              >
                <span>Information</span>
                <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-[#E5A93C] group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full left-0 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 rounded-2xl bg-[#12131a] border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1">
                  
                  <Link
                    to="/about"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-[#E5A93C] flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">About Competition</span>
                      <span className="text-xs text-zinc-400">Our mission, vision, and jury panel</span>
                    </div>
                  </Link>

                  <Link
                    to="/rules"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-[#E5A93C] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">Official Rules</span>
                      <span className="text-xs text-zinc-400">Eligibility, voting ethics, and criteria</span>
                    </div>
                  </Link>

                  <Link
                    to="/faq"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-[#E5A93C] flex items-center justify-center shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">Frequently Asked Questions</span>
                      <span className="text-xs text-zinc-400">Common questions answered</span>
                    </div>
                  </Link>

                  <Link
                    to="/contact"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-[#E5A93C] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">Contact Secretariat</span>
                      <span className="text-xs text-zinc-400">Victoria Island Lagos headquarters</span>
                    </div>
                  </Link>

                </div>
              </div>
            </div>

          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-[#E5A93C]" />
                Admin ({user?.role})
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium text-zinc-400 hover:text-zinc-200 px-2 py-1"
              >
                Admin Login
              </Link>
            )}

            <Link
              to="/vote"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-[#E5A93C] border border-[#E5A93C]/40 hover:bg-[#E5A93C]/10 transition shadow-sm"
            >
              <Vote className="w-4 h-4" />
              Vote
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#D97706] hover:from-[#F59E0B] hover:to-[#B45309] text-black font-semibold shadow-md shadow-[#E5A93C]/20 hover:scale-[1.02] transition"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/vote"
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#E5A93C] text-black"
            >
              Vote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0d0e14] px-4 pt-3 pb-6 space-y-2">
          
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5"
          >
            Home
          </Link>

          <div>
            <button
              onClick={() => setMobileSubmenu(mobileSubmenu === 'contestants' ? null : 'contestants')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5"
            >
              <span>Contestants</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'contestants' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSubmenu === 'contestants' && (
              <div className="pl-6 pr-2 py-2 space-y-1 bg-white/5 rounded-xl mt-1">
                <Link to="/contestants" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-zinc-300">
                  Directory
                </Link>
                <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-zinc-300">
                  Live Leaderboard
                </Link>
                <Link to="/vote" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-zinc-300">
                  Cast Votes
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setMobileSubmenu(mobileSubmenu === 'info' ? null : 'info')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5"
            >
              <span>Information</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'info' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSubmenu === 'info' && (
              <div className="pl-6 pr-2 py-2 space-y-1 bg-white/5 rounded-xl mt-1">
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-zinc-300">
                  About Competition
                </Link>
                <Link to="/rules" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-zinc-300">
                  Official Rules
                </Link>
                <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-zinc-300">
                  FAQ
                </Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-zinc-300">
                  Contact
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-sm shadow-md"
            >
              Contestant Registration
            </Link>

            {isAuthenticated ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-zinc-800 text-zinc-200 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#E5A93C]" />
                Go to Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-zinc-400 hover:text-zinc-200 text-xs"
              >
                Staff / Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
