import React, { useState, useEffect } from 'react';
import { Inbox, CheckCircle, XCircle, Clock, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import api from '../../lib/api';

export const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/applications');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    try {
      await api.post(`/admin/contestants/${id}/approve`);
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Approve failed');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Specify rejection reason:');
    if (!reason) return;
    try {
      await api.post(`/admin/contestants/${id}/reject`, { reason });
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Reject failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-white">Pending Application Review</h1>
        <p className="text-xs text-zinc-400">Applications submitted awaiting committee verification before public activation.</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-500">Loading applications queue...</div>
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id || app.id}
              className="p-6 rounded-3xl bg-[#12131a] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={app.profileImage}
                    alt={app.fullName}
                    className="w-20 h-24 rounded-2xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-[#E5A93C] font-bold block">{app.contestantId}</span>
                    <h3 className="font-heading font-bold text-lg text-white">{app.fullName}</h3>
                    <span className="text-xs text-zinc-300 font-medium block">{app.category}</span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                      {app.city ? `${app.city}, ` : ''}{app.state}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{app.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{app.phone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                    <span className="text-zinc-400">Reg Fee Payment:</span>
                    <span className="text-emerald-400 font-bold uppercase">
                      {app.registrationPayment?.status === 'success' ? '✓ Verified (₦1,000)' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Talent / Statement</span>
                  <p className="text-xs text-zinc-300 bg-black/20 p-3 rounded-xl border border-white/5 line-clamp-3">
                    {app.bio || app.talent}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => handleReject(app._id)}
                  className="py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleApprove(app._id, app.fullName)}
                  className="py-2.5 px-3 rounded-xl bg-[#E5A93C] hover:bg-[#FFD066] text-black font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md transition"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Activate
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl bg-[#12131a] border border-white/10 text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="font-heading font-bold text-xl text-white">Inbox Clean</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            All submitted contestant applications have been reviewed and approved.
          </p>
        </div>
      )}

    </div>
  );
};
