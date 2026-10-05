import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const RulesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/20">
          <FileText className="w-3.5 h-3.5" /> Official Regulations
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">
          Competition Rules & Code of Conduct
        </h1>
        <p className="text-zinc-400 text-sm">
          Face of Creativity is governed by stringent fairness, verified payment audits, and professional guidelines.
        </p>
      </div>

      <div className="space-y-6">
        {[
          {
            title: '1. Contestant Eligibility',
            rules: [
              'Contestants must be Nigerian citizens or legal residents possessing valid proof of identification.',
              'Contestants must be at least 18 years of age on or before the registration closing deadline.',
              'Contestants must not be under conflicting exclusive agency contracts that prohibit third-party national ambassadorships.'
            ]
          },
          {
            title: '2. Registration & Material Submission',
            rules: [
              'All personal and artistic credentials submitted must be accurate, authentic, and verifiable.',
              'A non-refundable registration processing fee of ₦1,000 applies to every new application.',
              'Photographs must be of high resolution, unaltered by misleading filters, and depict the contestant authentically.'
            ]
          },
          {
            title: '3. Voting Integrity & Fraud Protection',
            rules: [
              'Public votes cost ₦100 per vote and are processed exclusively through authorized Paystack channels.',
              'Automated bot voting, chargeback abuse, script injection, or unauthorized card usage results in immediate disqualification and forfeiture of accrued votes.',
              'The platform maintains an automated IP & behavioral audit trail that flags irregular voting spikes for forensic scrutiny.'
            ]
          },
          {
            title: '4. Finals Selection & Grand Jury Weighting',
            rules: [
              'Final standing is determined by 50% verified public voting totals + 50% Grand Jury Panel live scoring.',
              'Semi-finalists invited to the Lagos Bootcamp must abide by the residency code of conduct, punctuality, and mutual respect.',
              'The decision of the tabulation audit firm and Grand Jury is final and incontestable.'
            ]
          },
          {
            title: '5. Prize Grants & Endorsements',
            rules: [
              'Cash grants are disbursed in tranches governed by brand ambassadorship milestones over 12 months.',
              'The reigning Face of Creativity champion agrees to represent the brand with dignity, integrity, and ethical conduct.'
            ]
          }
        ].map((sec) => (
          <div key={sec.title} className="p-6 sm:p-8 rounded-3xl bg-[#12131a] border border-white/10 space-y-4">
            <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#E5A93C]" />
              {sec.title}
            </h2>
            <ul className="space-y-2.5">
              {sec.rules.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
