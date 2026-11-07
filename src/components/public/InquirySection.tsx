import React, { useState } from 'react';
import { api, trackUserAction } from '../../lib/api';
import { Send, CheckCircle2, AlertCircle, Sparkles, MessageCircle, Mail, Phone, Loader2 } from 'lucide-react';
import { ContactSettings } from '../../types';

interface InquirySectionProps {
  contact: ContactSettings;
  prefilledService?: string;
  onClearPrefill?: () => void;
  onInquirySubmitted?: () => void;
}

export const InquirySection: React.FC<InquirySectionProps> = ({
  contact,
  prefilledService,
  onClearPrefill,
  onInquirySubmitted,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(prefilledService || 'Full-Stack Web Development');
  const [description, setDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync when prefilledService changes
  React.useEffect(() => {
    if (prefilledService) {
      setService(prefilledService);
    }
  }, [prefilledService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitInquiry({
        name,
        email,
        phone,
        service,
        description,
        preferredContact,
      });

      if (res.success) {
        trackUserAction('inquiry', `Homepage Inquiry Section (${service})`, {
          name,
          email,
          phone,
          service,
          preferredContact,
        });
        setSuccessMessage(res.message);
        setName('');
        setEmail('');
        setPhone('');
        setDescription('');
        if (onClearPrefill) onClearPrefill();
        if (onInquirySubmitted) onInquirySubmitted();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeWhatsapp = contact?.whatsapp || '+254 700 000 000';
  const safePhone = contact?.phone || '+254 700 000 000';
  const safeEmail = contact?.email || 'info@jdfusiontech.com';

  return (
    <section id="inquiry" className="py-24 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
      {/* Subtle Ambient Grid Texture */}
      <div className="absolute inset-0 bg-ambient-grid mask-radial-fade opacity-50 dark:opacity-30 pointer-events-none" />

      {/* Subtle Blue & Orange ambient glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & Direct Reach */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Initiate Collaboration</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white font-['Outfit'] tracking-tight">
              Let's Work Together
            </h2>

            <p className="text-stone-600 dark:text-zinc-400 text-base leading-relaxed">
              Have a website development project, brand design requirement, or need urgent cyber &amp; digital solutions? Fill in the form and our team will get in touch directly.
            </p>

            {/* Direct Connect Quick Cards */}
            <div className="pt-4 space-y-3">
              
              <a
                href={`https://wa.me/${safeWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackUserAction('whatsapp', `Homepage Quick WhatsApp (${safeWhatsapp})`)}
                className="flex items-center gap-4 p-4 rounded-xl bg-stone-50/90 dark:bg-zinc-900/90 backdrop-blur-xs border border-stone-200/90 dark:border-zinc-800 card-hover-effect hover:border-emerald-500/60 group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Quick WhatsApp Chat
                  </h4>
                  <p className="text-sm font-semibold text-stone-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                    {safeWhatsapp}
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${safeEmail}`}
                onClick={() => trackUserAction('email', `Homepage Direct Email (${safeEmail})`)}
                className="flex items-center gap-4 p-4 rounded-xl bg-stone-50/90 dark:bg-zinc-900/90 backdrop-blur-xs border border-stone-200/90 dark:border-zinc-800 card-hover-effect hover:border-orange-500/60 group"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Direct Email
                  </h4>
                  <p className="text-sm font-semibold text-stone-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {safeEmail}
                  </p>
                </div>
              </a>

              {safePhone.includes('/') ? (
                <div className="p-4 rounded-xl bg-stone-50/90 dark:bg-zinc-900/90 backdrop-blur-xs border border-stone-200/90 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                        Telephone Lines
                      </h4>
                      <p className="text-sm font-semibold text-stone-900 dark:text-white font-mono">
                        {safePhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-200/50 dark:border-zinc-800">
                    {safePhone.split('/').map((rawNum, i) => {
                      const clean = rawNum.trim();
                      return (
                        <a
                          key={i}
                          href={`tel:${clean.replace(/[^0-9+]/g, '')}`}
                          onClick={() => trackUserAction('call', `Inquiry Call Line ${i + 1} (${clean})`)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-white text-xs font-bold font-mono transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Dial {clean}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <a
                  href={`tel:${safePhone.replace(/[^0-9+]/g, '')}`}
                  onClick={() => trackUserAction('call', `Homepage Phone Call (${safePhone})`)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-stone-50/90 dark:bg-zinc-900/90 backdrop-blur-xs border border-stone-200/90 dark:border-zinc-800 card-hover-effect hover:border-amber-500/60 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                      Call Center
                    </h4>
                    <p className="text-sm font-semibold text-stone-900 dark:text-white group-hover:text-yellow-500 transition-colors font-mono">
                      {safePhone}
                    </p>
                  </div>
                </a>
              )}

            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-stone-50/90 dark:bg-zinc-900/90 backdrop-blur-md border border-stone-200/90 dark:border-zinc-800 p-8 sm:p-10 shadow-lg relative border-brand-glow transition-all duration-300">
              
              {/* Success Banner */}
              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Inquiry Received!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-red-700 dark:text-red-300">
                    {errorMessage}
                  </p>
                </div>
              )}

              <form id="project-inquiry-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mwangi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Service Required */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 700 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-2">
                      Service Required *
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    >
                      <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                      <option value="Business & Corporate Website">Business &amp; Corporate Website</option>
                      <option value="E-Commerce Website">E-Commerce Website</option>
                      <option value="Graphic Design & Brand Identity">Graphic Design &amp; Brand Identity</option>
                      <option value="Logo & Marketing Collateral">Logo &amp; Marketing Collateral</option>
                      <option value="KRA iTax & Returns Filing">KRA iTax &amp; Returns Filing</option>
                      <option value="HELB Student Portal Services">HELB Student Portal Services</option>
                      <option value="eCitizen & Digital Document Services">eCitizen &amp; Digital Document Services</option>
                      <option value="Cyber & Digital Portal Services">Cyber &amp; Digital Portal Services</option>
                      <option value="Cyber and Digital Solutions / Tech Issue Help">Cyber and Digital Solutions / Tech Issue Help</option>
                      <option value="General Cyber Assistance / Ask a Question">General Cyber Assistance / Ask a Question</option>
                      <option value="Step-by-Step Portal Guidance">Step-by-Step Portal Guidance</option>
                      <option value="Other Legitimate Digital Service">Other Legitimate Digital Service</option>
                      {service && ![
                        "Full-Stack Web Development",
                        "Business & Corporate Website",
                        "E-Commerce Website",
                        "Graphic Design & Brand Identity",
                        "Logo & Marketing Collateral",
                        "KRA iTax & Returns Filing",
                        "HELB Student Portal Services",
                        "eCitizen & Digital Document Services",
                        "Cyber & Digital Portal Services",
                        "General Cyber Assistance / Ask a Question",
                        "Step-by-Step Portal Guidance",
                        "Other Legitimate Digital Service"
                      ].includes(service) && (
                        <option value={service}>{service}</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      { id: 'email', label: 'Email', icon: Mail },
                      { id: 'phone', label: 'Phone Call', icon: Phone },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = preferredContact === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPreferredContact(method.id as any)}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-white dark:bg-zinc-950 border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-2">
                    Project Requirements / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your project vision, target timeline, or specific digital services needed..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-y"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] disabled:bg-orange-400 text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Let's Work Together</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
