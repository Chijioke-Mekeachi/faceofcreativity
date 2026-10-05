import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../lib/api';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Abuja FCT'
];

const CATEGORIES = [
  'Fashion & Modeling',
  'Creative Arts',
  'Digital & Tech Design',
  'Performing Arts',
  'Content Creation'
];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [registrationFee, setRegistrationFee] = useState<number>(1000);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    username: '',
    email: '',
    phone: '',
    gender: 'Female',
    dateOfBirth: '',
    state: 'Lagos',
    city: '',
    country: 'Nigeria',

    // Step 2: Creative
    category: 'Fashion & Modeling',
    talent: '',
    bio: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    twitter: '',

    // Step 3: Photo
    profileImage: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [verifyingPayment, setVerifyingPayment] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Success result
  const [registeredContestant, setRegisteredContestant] = useState<any>(null);

  useEffect(() => {
    api.get('/competition/current')
      .then(res => {
        if (res.data.success && res.data.data.registrationFee) {
          setRegistrationFee(res.data.data.registrationFee);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setFormData(prev => ({ ...prev, profileImage: base64 }));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill your full name, email, and phone number');
      return false;
    }
    setError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.talent.trim() || !formData.bio.trim()) {
      setError('Please enter your specific talent and a brief bio');
      return false;
    }
    setError(null);
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!formData.profileImage) {
      // Provide high quality default image if user hasn't uploaded one
      const sampleImg = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
      setFormData(prev => ({ ...prev, profileImage: sampleImg }));
      setImagePreview(sampleImg);
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Step 5: Final Submission & Payment
  const handleFinalPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Initialize registration & invoice with backend
      const payload = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || undefined,
        state: formData.state,
        city: formData.city || formData.state,
        country: formData.country,
        category: formData.category,
        talent: formData.talent.trim(),
        bio: formData.bio.trim(),
        profileImage: formData.profileImage,
        socialLinks: {
          instagram: formData.instagram.trim(),
          tiktok: formData.tiktok.trim(),
          facebook: formData.facebook.trim(),
          twitter: formData.twitter.trim()
        }
      };

      const initRes = await api.post('/contestants/register', {
        ...payload,
        callbackUrl: `${window.location.origin}/payment/callback`
      });

      if (!initRes.data.success) {
        throw new Error(initRes.data.message || 'Registration initiation failed');
      }

      const { reference, authorization_url } = initRes.data.data.payment;

      // 2. Redirect user to Paystack checkout to complete payment
      if (authorization_url) {
        // allow a short loading state then redirect
        setLoading(false);
        window.location.href = authorization_url;
        return;
      }

      // If no authorization_url returned, attempt server-side verification fallback
      setVerifyingPayment(true);
      const verifyRes = await api.post('/contestants/verify-payment', { reference });

      if (verifyRes.data.success) {
        setRegisteredContestant(verifyRes.data.data.contestant);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else {
        throw new Error(verifyRes.data.message || 'Payment could not be verified');
      }

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration could not be completed');
    } finally {
      setLoading(false);
      setVerifyingPayment(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E5A93C]/10 text-[#FFD066] border border-[#E5A93C]/20">
          <Sparkles className="w-3.5 h-3.5" /> Official Application
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
          Contestant Registration
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Complete the application to showcase your creative portfolio to all of Nigeria and international scouts.
        </p>
      </div>

      {/* Wizard Progress Indicator */}
      {!registeredContestant && (
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-white/10 -z-0" />
          {[
            { num: 1, label: 'Personal' },
            { num: 2, label: 'Creative' },
            { num: 3, label: 'Photo' },
            { num: 4, label: 'Review' },
            { num: 5, label: 'Payment' }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentStep >= s.num
                    ? 'bg-[#E5A93C] text-black shadow-lg shadow-[#E5A93C]/30'
                    : 'bg-[#181922] text-zinc-500 border border-white/10'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold hidden sm:block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-[#12131a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
        
        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && !registeredContestant && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-white">
              Step 1: Personal & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Amara Chioma Okonkwo"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Stage / Username (Optional)</label>
                <input
                  type="text"
                  name="username"
                  placeholder="e.g. amara_chic"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+234 803 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">State of Residence *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                >
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">City / Town</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Lekki / Victoria Island"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CREATIVE INFORMATION */}
        {currentStep === 2 && !registeredContestant && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-white">
              Step 2: Creative Category & Social Presence
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Competition Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Primary Creative Talent / Discipline *</label>
                <input
                  type="text"
                  name="talent"
                  required
                  placeholder="e.g. High-Fashion Runway Modeling, Afro-fusion Contemporary Dance, 3D CGI Visuals"
                  value={formData.talent}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Contestant Biography / Artist Statement *</label>
                <textarea
                  name="bio"
                  rows={4}
                  required
                  placeholder="Tell your story. What makes your creative vision distinct? Why should Nigeria crown you Face of Creativity 2026?"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    name="instagram"
                    placeholder="@yourhandle"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">TikTok Handle</label>
                  <input
                    type="text"
                    name="tiktok"
                    placeholder="@yourhandle"
                    value={formData.tiktok}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Facebook Profile / Page</label>
                  <input
                    type="text"
                    name="facebook"
                    placeholder="e.g. facebook.com/profile"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">X (Twitter) Handle</label>
                  <input
                    type="text"
                    name="twitter"
                    placeholder="@yourhandle"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PHOTO UPLOAD */}
        {currentStep === 3 && !registeredContestant && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-white">
              Step 3: Contestant Portfolio Photograph
            </h2>
            <p className="text-xs text-zinc-400">
              Upload a clear, high-resolution portrait or modeling headshot. This will be featured prominently on your public profile and the live voting leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-black/40 border border-white/10">
              <div className="w-36 h-48 rounded-2xl overflow-hidden bg-zinc-900 border border-white/15 shrink-0 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-3 text-zinc-600">
                    <User className="w-10 h-10 mx-auto mb-1" />
                    <span className="text-[10px]">No Photo</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer transition border border-white/10">
                  <Upload className="w-4 h-4 text-[#E5A93C]" />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Recommended: Vertical 3:4 aspect ratio, PNG or JPG, max 5MB. Clear lighting, high resolution.
                </p>
                {imagePreview && (
                  <p className="text-xs text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Ready for submission
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW APPLICATION */}
        {currentStep === 4 && !registeredContestant && (
          <div className="space-y-5">
            <h2 className="font-heading font-bold text-lg text-white">
              Step 4: Review Application
            </h2>
            <p className="text-xs text-zinc-400">
              Please double check all submitted details before proceeding to the registration fee payment.
            </p>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Full Name:</span>
                <span className="text-white font-bold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Email:</span>
                <span className="text-white">{formData.email}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Phone:</span>
                <span className="text-white">{formData.phone}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">State / Location:</span>
                <span className="text-white">{formData.city ? `${formData.city}, ` : ''}{formData.state} State</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Category:</span>
                <span className="text-[#FFD066] font-semibold">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Talent Statement:</span>
                <span className="text-white text-right max-w-xs">{formData.talent}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REGISTRATION PAYMENT VIA PAYSTACK */}
        {currentStep === 5 && !registeredContestant && (
          <div className="space-y-6 text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center mx-auto border border-[#E5A93C]/20">
              <CreditCard className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="font-heading font-black text-2xl text-white">
                Complete Registration Fee
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                A non-refundable administrative processing fee of <strong className="text-white">₦{registrationFee.toLocaleString()}</strong> is required to generate your official contestant badge and activate profile review.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 max-w-sm mx-auto flex items-center justify-between text-sm">
              <span className="text-zinc-400">Payable Fee:</span>
              <span className="text-2xl font-black font-mono text-[#FFD066]">
                ₦{registrationFee.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              disabled={loading || verifyingPayment}
              onClick={handleFinalPayment}
              className="w-full max-w-sm mx-auto py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E5A93C] via-[#FFD066] to-[#D97706] text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-[#E5A93C]/25 hover:scale-[1.02] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading || verifyingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {verifyingPayment ? 'Verifying with Paystack...' : 'Initializing Gateway...'}
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Pay ₦{registrationFee.toLocaleString()} via Paystack
                </>
              )}
            </button>
          </div>
        )}

        {/* SUCCESS CONFIRMATION */}
        {registeredContestant && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                Application Received & Payment Verified!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                Congratulations <strong className="text-white">{registeredContestant.fullName}</strong>! Your registration is confirmed under ID <strong className="text-[#E5A93C] font-mono">{registeredContestant.contestantId}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Contestant ID:</span>
                <span className="font-mono font-bold text-[#E5A93C]">{registeredContestant.contestantId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Profile URL:</span>
                <span className="font-mono text-zinc-300">/contestants/{registeredContestant.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Review Status:</span>
                <span className="text-amber-400 font-bold uppercase">Pending Committee Review</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/contestants/${registeredContestant.slug}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D97706] text-black font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Preview Contestant Profile
              </Link>
              <Link
                to="/contestants"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-xs transition"
              >
                Explore Directory
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        {!registeredContestant && (
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {currentStep < 5 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#FFD066] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
