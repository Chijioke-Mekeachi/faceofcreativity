import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import api from '../../lib/api';

export const AdminActivity: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/activity')
      .then(res => {
        if (res.data.success) {
          setLogs(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-white">System Audit & Compliance Log</h1>
        <p className="text-xs text-zinc-400">Non-repudiation audit trail recording all administrative interventions and transactions.</p>
      </div>

      <div className="bg-[#12131a] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">Loading audit records...</td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#E5A93C]">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {log.adminName || 'System'}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {log.description}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 uppercase text-[10px] font-mono">
                      {log.targetType}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">No audit logs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
