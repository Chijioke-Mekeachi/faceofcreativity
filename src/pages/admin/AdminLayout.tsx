import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Inbox, 
  Vote, 
  CreditCard, 
  Trophy, 
  Settings, 
  Activity, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Contestants', path: '/admin/contestants', icon: Users },
    { name: 'Applications', path: '/admin/applications', icon: Inbox },
    { name: 'Votes Ledger', path: '/admin/votes', icon: Vote },
    { name: 'Payments & Revenue', path: '/admin/payments', icon: CreditCard },
    { name: 'Leaderboard', path: '/admin/leaderboard', icon: Trophy },
    { name: 'Competition & Content', path: '/admin/settings', icon: Settings },
    { name: 'Audit Logs', path: '/admin/activity', icon: Activity },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex text-zinc-200">
      
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0d0e14] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          
          {/* Logo & Close button */}
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E5A93C] to-[#C78516] flex items-center justify-center text-black font-black text-xs">
                FOC
              </div>
              <div>
                <span className="font-heading font-black text-sm text-white tracking-wider block">
                  ADMIN CONSOLE
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">v2.0 Enterprise</span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-[#E5A93C]/15 text-[#E5A93C] font-bold border border-[#E5A93C]/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User footer & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="font-bold text-white block truncate">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-[#E5A93C] uppercase font-mono font-semibold">{user?.role || 'super_admin'}</span>
            </div>
            <Link
              to="/"
              target="_blank"
              className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
              title="Open Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#0d0e14]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-zinc-400">
              Face of Creativity Nigeria • Season 2026 Live Administration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Paystack Production Gateway Connected
            </span>
            <Link
              to="/"
              className="text-xs text-[#E5A93C] hover:underline flex items-center gap-1 font-semibold"
            >
              Live Website <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
