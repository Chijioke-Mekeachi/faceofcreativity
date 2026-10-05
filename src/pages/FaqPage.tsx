import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import api from '../lib/api';

export const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    api.get('/settings/faqs')
      .then(res => {
        if (res.data.success) {
          setFaqs(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredFaqs = faqs.filter(f => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/20">
          <HelpCircle className="w-3.5 h-3.5" /> Support Center
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-zinc-400 text-sm">
          Everything you need to know about contestant registration, voting packages, and tournament phases.
        </p>
      </div>

      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#12131a] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C]"
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading FAQs...</div>
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div
              key={faq._id || faq.id || index}
              className="rounded-2xl bg-[#12131a] border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-[#E5A93C] transition"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#E5A93C] shrink-0 transition-transform ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="p-5 pt-0 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-zinc-500">No questions found matching "{search}".</div>
        )}
      </div>
    </div>
  );
};
