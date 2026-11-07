import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ContactSettings, LocationSettings, Inquiry } from '../types';
import { PageBackground } from '../components/common/PageBackground';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { api, trackUserAction } from '../lib/api';

interface ContactPageProps {
  contact?: ContactSettings;
  location?: LocationSettings;
  onInquirySubmitted?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  contact,
  location,
  onInquirySubmitted,
}) => {
  const routerLocation = useLocation();
  const searchParams = new URLSearchParams(routerLocation.search);
  const prefilled = (routerLocation.state as any)?.prefilledService || searchParams.get('service') || '';

  const cont = contact || {
    email: 'info@jdfusiontech.com',
    phone: '+254 700 000 000',
    whatsapp: '+254 700 000 000',
    description: 'Reach out directly for custom project scoping, technical consultations, or systems architecture planning.',
    businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM (EAT)',
    updatedAt: new Date().toISOString(),
  };

  const loc = location || {
    address: 'Commercial Business Centre, Suite 4B, Nairobi, Kenya',
    mapLink: 'https://maps.google.com/?q=Nairobi+Kenya',
    coordinates: '-1.286389, 36.817223',
    description: 'Centrally located for in-person consultations and architectural design sprints.',
    updatedAt: new Date().toISOString(),
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: prefilled || 'Website Development',
    description: '',
    preferredContact: 'whatsapp' as 'whatsapp' | 'email' | 'phone',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
    inquiryId?: string;
  } | null>(null);

  useEffect(() => {
    const currentService = (routerLocation.state as any)?.prefilledService || new URLSearchParams(routerLocation.search).get('service');
    if (currentService) {
      setFormData((prev) => ({ ...prev, service: currentService }));
    }
  }, [routerLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      setSubmissionStatus({
        success: false,
        message: 'Please provide your name, email, and project scope details.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const result = await api.submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        description: formData.description.trim(),
        preferredContact: formData.preferredContact,
      });

      if (result && result.success) {
        trackUserAction('inquiry', `Contact Form (${formData.service})`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          preferredContact: formData.preferredContact,
        });

        setSubmissionStatus({
          success: true,
          message: 'Thank you! Your inquiry has been received by us. We will respond promptly.',
          inquiryId: result.inquiryId,
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Website Development',
          description: '',
          preferredContact: 'whatsapp',
        });

        if (onInquirySubmitted) {
          onInquirySubmitted();
        }
      }
    } catch (err: any) {
      setSubmissionStatus({
        success: false,
        message: err.message || 'There was an error transmitting your inquiry. Please try WhatsApp direct.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-white text-stone-900 transition-colors duration-300">
      <PageBackground variant="contact" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
            <span>Where Ideas Become Innovation.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black font-['Outfit'] tracking-tight">
            Contact &amp; Project Inquiries
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            Fill out the project inquiry below or connect directly via WhatsApp. Every message is reviewed personally by us.
          </p>
        </div>

        {/* 2-Column Grid: Working Form (Left) & Verified Contact + Next Steps (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Working Form */}
          <div className="lg:col-span-7 rounded-3xl bg-stone-50 border border-stone-200 p-8 sm:p-10 shadow-xs relative">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-bold font-['Outfit'] text-black">
                Submit Your Project Details
              </h2>
              <p className="text-xs text-stone-600">
                Receive an architectural assessment and timeline roadmap directly from our engineering team.
              </p>
            </div>

            {submissionStatus && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs flex items-start gap-3 ${
                  submissionStatus.success
                    ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-800 border border-red-500/20'
                }`}
              >
                {submissionStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{submissionStatus.message}</p>
                  {submissionStatus.inquiryId && (
                    <span className="text-[11px] font-mono text-emerald-700 block mt-1">
                      Tracking Reference: #{submissionStatus.inquiryId.slice(0, 8)}
                    </span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Alex Kimani"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#155EEF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#155EEF] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#155EEF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Service Division of Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 focus:outline-hidden focus:border-[#155EEF] transition-colors"
                  >
                    {formData.service && ![
                      'Website Development',
                      'Systems Development',
                      'IT Support',
                      'IT Solutions',
                      'Other Custom Technology Inquiry'
                    ].includes(formData.service) && (
                      <option value={formData.service}>{formData.service}</option>
                    )}
                    <option value="Website Development">1. Website Development</option>
                    <option value="Systems Development">2. Systems Development</option>
                    <option value="IT Support">3. IT Support</option>
                    <option value="IT Solutions">4. IT Solutions</option>
                    <option value="Other Custom Technology Inquiry">Other Custom Technology Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Preferred Contact Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp' },
                    { id: 'email', label: 'Email' },
                    { id: 'phone', label: 'Phone Call' },
                  ].map((chan) => (
                    <button
                      type="button"
                      key={chan.id}
                      onClick={() => setFormData({ ...formData, preferredContact: chan.id as any })}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        formData.preferredContact === chan.id
                          ? 'bg-[#155EEF]/10 text-[#155EEF] border-[#155EEF]'
                          : 'bg-white text-stone-600 border-stone-200 hover:text-black'
                      }`}
                    >
                      {chan.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Project Scope &amp; Vision *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your project goals, current challenges, technical preferences, or timeline targets..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#155EEF] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#FF914D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Project Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Contact Cards + Clear Next Steps */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Contact Cards */}
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200 space-y-6">
              <h3 className="text-xl font-bold font-['Outfit'] text-black">
                Direct Communication Channels
              </h3>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${cont.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackUserAction('whatsapp', `Contact Page WhatsApp (${cont.whatsapp})`)}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 block font-medium">WhatsApp Instant Chat</span>
                      <span className="text-sm font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">
                        {cont.whatsapp}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href={`mailto:${cont.email}`}
                  onClick={() => trackUserAction('email', `Contact Page Email (${cont.email})`)}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#155EEF]/50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 block font-medium">Executive Email</span>
                      <span className="text-sm font-bold text-stone-900 group-hover:text-[#155EEF] transition-colors">
                        {cont.email}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#155EEF] group-hover:translate-x-1 transition-all" />
                </a>

                {cont.phone && cont.phone.includes('/') ? (
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#155EEF]/50 transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-stone-500 block font-medium">Direct Telephone Lines</span>
                        <span className="text-sm font-bold text-stone-900 font-mono">
                          {cont.phone}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2">
                      {cont.phone.split('/').map((rawNum, i) => {
                        const cleanNum = rawNum.trim();
                        return (
                          <a
                            key={i}
                            href={`tel:${cleanNum.replace(/[^0-9+]/g, '')}`}
                            onClick={() => trackUserAction('call', `Line ${i + 1} (${cleanNum})`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#155EEF]/10 hover:bg-[#155EEF] text-[#155EEF] hover:text-white text-xs font-bold font-mono transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Dial Line {i + 1} ({cleanNum})</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <a
                    href={`tel:${(cont.phone || '').replace(/[^0-9+]/g, '')}`}
                    onClick={() => trackUserAction('call', `Contact Page Telephone (${cont.phone})`)}
                    className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#155EEF]/50 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-stone-500 block font-medium">Direct Telephone</span>
                        <span className="text-sm font-bold text-stone-900 group-hover:text-[#155EEF] transition-colors font-mono">
                          {cont.phone}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#155EEF] group-hover:translate-x-1 transition-all" />
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#155EEF]" />
                  <span>{cont.businessHours}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF914D] shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
