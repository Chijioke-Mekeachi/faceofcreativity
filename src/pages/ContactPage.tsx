import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">
          Contact the Secretariat
        </h1>
        <p className="text-zinc-400 text-sm">
          Have inquiries regarding contestant applications, corporate partnerships, or press credentials? Reach out to our Lagos headquarters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#12131a] border border-white/10 space-y-6">
            <h2 className="font-heading font-bold text-xl text-white">Official Headquarters</h2>

            <div className="space-y-4 text-sm text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E5A93C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Creative Hub Tower</strong>
                  <span>Plot 14 Victoria Island, Lagos State, Nigeria</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#E5A93C] shrink-0" />
                <span>+234 812 345 6789</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#E5A93C] shrink-0" />
                <span>support@faceofcreativity.ng</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4" />
                Direct WhatsApp Support Channel
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-3xl bg-[#12131a] border border-white/10">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-heading font-bold text-xl text-white">Message Dispatched</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Thank you for contacting Face of Creativity Nigeria. A member of our executive committee will reply within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-heading font-bold text-xl text-white mb-2">Send an Inquiry</h2>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-xs uppercase tracking-wider transition hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
