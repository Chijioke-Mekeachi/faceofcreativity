import React, { useState, useEffect } from 'react';
import { CreditCard, Search, DollarSign, CheckCircle2, Clock, XCircle } from 'lucide-react';
import api from '../../lib/api';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        api.get('/payments', { params: { type: typeFilter, search, limit: 30 } }),
        api.get('/payments/stats')
      ]);

      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-white">Payment Gateway & Financial Audits</h1>
        <p className="text-xs text-zinc-400">Reconciled Paystack transactions for registration fees and supporter voting packages.</p>
      </div>

      {/* Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#12131a] border border-white/10 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Total Revenue</span>
            <div className="text-xl font-mono font-black text-white">₦{stats.totalRevenue?.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#12131a] border border-white/10 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Registration Revenue</span>
            <div className="text-xl font-mono font-black text-[#E5A93C]">₦{stats.registrationRevenue?.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#12131a] border border-white/10 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Voting Revenue</span>
            <div className="text-xl font-mono font-black text-[#FFD066]">₦{stats.votingRevenue?.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#12131a] border border-white/10 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Successful Invoices</span>
            <div className="text-xl font-mono font-black text-emerald-400">{stats.successfulCount}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#12131a] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                <th className="py-3 px-4">Paystack Ref</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contestant</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">Loading payments...</td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#E5A93C] font-semibold">{p.reference}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.type === 'registration' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-amber-500/10 text-[#FFD066] border border-amber-500/20'
                      }`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white block">{p.customerName || p.customerEmail}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {p.contestantName || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₦{p.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">No payment records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
