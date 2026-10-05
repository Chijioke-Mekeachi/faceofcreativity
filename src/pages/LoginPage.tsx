import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/admin');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#12131a] rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E5A93C] to-[#C78516] p-[2px] mx-auto shadow-lg shadow-[#E5A93C]/20">
            <div className="w-full h-full bg-[#0b0c10] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#E5A93C]" />
            </div>
          </div>
          <h1 className="font-heading font-black text-2xl text-white">
            Staff & Committee Access
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in with administrative privileges to manage contestants, audit votes, and oversee the live leaderboard.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@faceofcreativity.ng"
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E5A93C]/20 hover:scale-[1.01] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In to Console'}
          </button>
        </form>

        {/* Demo Fast Logins for reviewers & evaluators */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 block text-center">
            One-Click Evaluator Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@faceofcreativity.ng', 'AdminPassword2026!')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 font-semibold transition"
            >
              👑 Super Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('moderator@faceofcreativity.ng', 'Moderator2026!')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 font-semibold transition"
            >
              🛡️ Moderator Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
