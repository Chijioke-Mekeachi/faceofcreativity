import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, Plus, Trash2, HelpCircle } from 'lucide-react';
import api from '../../lib/api';

export const AdminSettings: React.FC = () => {
  const [competition, setCompetition] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New FAQ inputs
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, faqsRes] = await Promise.all([
        api.get('/competition/current'),
        api.get('/settings/faqs')
      ]);
      if (compRes.data.success) setCompetition(compRes.data.data);
      if (faqsRes.data.success) setFaqs(faqsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCompetition((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await api.put(`/competition/${competition._id || competition.id}`, competition);
      if (res.data.success) {
        setStatusMessage('Competition parameters saved successfully!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion || !newFaqAnswer) return;
    try {
      const res = await api.post('/settings/faqs', {
        question: newFaqQuestion,
        answer: newFaqAnswer
      });
      if (res.data.success) {
        setFaqs(prev => [...prev, res.data.data]);
        setNewFaqQuestion('');
        setNewFaqAnswer('');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await api.delete(`/settings/faqs/${id}`);
      setFaqs(prev => prev.filter(f => f._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-zinc-500">Loading platform configuration...</div>;
  }

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="font-heading font-black text-2xl text-white">Competition Parameters & CMS</h1>
        <p className="text-xs text-zinc-400">Configure fees, timeline windows, prize pools, and landing page content dynamically.</p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Competition Form */}
      {competition && (
        <form onSubmit={handleSaveCompetition} className="p-6 sm:p-8 rounded-3xl bg-[#12131a] border border-white/10 space-y-6">
          <h2 className="font-heading font-bold text-lg text-white">General Season Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Competition Title</label>
              <input
                type="text"
                name="name"
                value={competition.name || ''}
                onChange={handleCompChange}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Current Season</label>
              <input
                type="text"
                name="season"
                value={competition.season || ''}
                onChange={handleCompChange}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-400 mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={competition.tagline || ''}
                onChange={handleCompChange}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Registration Fee (NGN)</label>
              <input
                type="number"
                name="registrationFee"
                value={competition.registrationFee || 1000}
                onChange={handleCompChange}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Vote Price per Vote (NGN)</label>
              <input
                type="number"
                name="votePrice"
                value={competition.votePrice || 100}
                onChange={handleCompChange}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Status Window</label>
              <select
                name="status"
                value={competition.status || 'voting_open'}
                onChange={handleCompChange}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white"
              >
                <option value="registration_open">Registration Open</option>
                <option value="voting_open">Voting Open (Live)</option>
                <option value="voting_closed">Voting Closed</option>
                <option value="completed">Season Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Total Prize Display</label>
              <input
                type="text"
                name="totalPrize"
                value={competition.totalPrize || ''}
                onChange={handleCompChange}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-bold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#E5A93C] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      )}

      {/* FAQ Manager */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#12131a] border border-white/10 space-y-6">
        <h2 className="font-heading font-bold text-lg text-white">Frequently Asked Questions (FAQ)</h2>

        {/* Existing FAQs */}
        <div className="space-y-3">
          {faqs.map(f => (
            <div key={f._id || f.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <strong className="text-white block">{f.question}</strong>
                <p className="text-zinc-400">{f.answer}</p>
              </div>
              <button
                onClick={() => handleDeleteFaq(f._id || f.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new FAQ */}
        <form onSubmit={handleCreateFaq} className="space-y-3 pt-4 border-t border-white/10 text-xs">
          <h3 className="font-bold text-white text-xs uppercase">Add New FAQ</h3>
          <input
            type="text"
            required
            placeholder="Question..."
            value={newFaqQuestion}
            onChange={(e) => setNewFaqQuestion(e.target.value)}
            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white"
          />
          <textarea
            required
            rows={2}
            placeholder="Answer..."
            value={newFaqAnswer}
            onChange={(e) => setNewFaqAnswer(e.target.value)}
            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </form>
      </div>

    </div>
  );
};
