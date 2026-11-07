import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Testimonial } from '../../types';
import { Star, MessageSquareQuote, Sparkles, ChevronLeft, ChevronRight, MessageSquarePlus, X, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // User testimonial submission modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    message: '',
    rating: 5,
    clientImage: '',
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientRole: '',
      clientCompany: '',
      message: '',
      rating: 5,
      clientImage: '',
    });
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.message.trim()) {
      setSubmitError('Please provide your name and your testimonial message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.submitPublicTestimonial({
        clientName: formData.clientName.trim(),
        clientRole: formData.clientRole.trim() || 'Client',
        clientCompany: formData.clientCompany.trim(),
        message: formData.message.trim(),
        rating: formData.rating,
        clientImage: formData.clientImage.trim() || undefined,
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!testimonials || testimonials.length === 0) return null;

  const total = testimonials.length;

  const scrollToCard = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (index === 0) {
      container.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
      return;
    }
    const cards = container.querySelectorAll<HTMLElement>('.testimonial-card');
    if (cards[index]) {
      const card = cards[index];
      container.scrollTo({
        left: card.offsetLeft - 24,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % total;
      scrollToCard(next);
      return next;
    });
  }, [total, scrollToCard]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIdx = (prev - 1 + total) % total;
      scrollToCard(prevIdx);
      return prevIdx;
    });
  }, [total, scrollToCard]);

  const handleSelectDot = (idx: number) => {
    setCurrentIndex(idx);
    scrollToCard(idx);
  };

  // Stepped movement: stays stationary for readable pause, then slides smoothly to the next (not continuous)
  useEffect(() => {
    if (total <= 1 || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, 2200);

    return () => clearInterval(timer);
  }, [total, isHovered, handleNext]);

  return (
    <section
      id="testimonials"
      className="py-24 bg-stone-50/80 relative overflow-hidden border-t border-stone-200"
    >
      {/* Subtle fine geometric dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#155EEF 1.2px, transparent 1.2px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient gradient glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#155EEF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Step Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
              <span>Verified Client Success</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black font-['Outfit'] tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Authentic reviews from enterprise partners, tech founders, and organizations powered by JD Fusion Technologies.
            </p>
          </div>

          {/* Controls: Leave a Review Button + Stepper Navigation */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124ec4] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-[#155EEF]/20 transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-white" />
              <span>Share Your Experience</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-black hover:border-stone-400 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
                title="Previous testimony"
                aria-label="Previous testimony"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-black hover:border-stone-400 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
                title="Next testimony"
                aria-label="Next testimony"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stepped Testimonies Slider (Slides smoothly from right to left after pause) */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft edge gradient masks */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-stone-50 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-stone-50 to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 gap-6 py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              id={`testimonial-card-${item.id}`}
              className={`testimonial-card w-[310px] sm:w-[390px] shrink-0 rounded-3xl bg-white border transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl select-none ${
                currentIndex === index
                  ? 'border-[#155EEF]/60 ring-2 ring-[#155EEF]/10 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="space-y-4">
                {/* Rating stars & Quote decoration */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-[#FF914D]/40" />
                </div>

                {/* Message */}
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>

              {/* Client Profile */}
              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center gap-3.5">
                {item.clientImage ? (
                  <img
                    src={item.clientImage}
                    alt={item.clientName}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200 shadow-2xs"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#155EEF]/10 text-[#155EEF] font-bold flex items-center justify-center text-sm border border-[#155EEF]/20 shadow-2xs">
                    {item.clientName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-sm text-black font-['Outfit']">
                    {item.clientName}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {item.clientRole}, {item.clientCompany}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicator dots */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 pb-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDot(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 bg-[#155EEF]'
                    : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                title={`Go to testimonial ${idx + 1}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Public Testimonial Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-black hover:bg-stone-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-['Outfit'] text-black">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                  Your testimonial has been submitted successfully! To protect authentic client reviews, our administrative team reviews all submissions before they appear live on the website.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124ec4] text-white text-xs font-bold transition-all"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#155EEF]/10 text-[#155EEF] text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
                    <span>Client Endorsement</span>
                  </div>
                  <h3 className="text-2xl font-bold font-['Outfit'] text-black">
                    Share Your Experience
                  </h3>
                  <p className="text-xs text-stone-500">
                    Your authentic review helps fellow businesses make confident decisions. Submissions are approved by our administration before appearing live.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="e.g. Sarah Mwangi"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={formData.clientRole}
                        onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                        placeholder="e.g. Managing Director"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.clientCompany}
                        onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                        placeholder="e.g. Apex Logistics"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Star Rating
                      </label>
                      <div className="flex items-center gap-1.5 py-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                            title={`${star} Star${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= (hoverRating ?? formData.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-stone-500 font-bold ml-1.5">
                          {hoverRating ?? formData.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Your Review / Testimonial *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your experience working with JD Fusion Technologies..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Profile Photo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.clientImage}
                      onChange={(e) => setFormData({ ...formData, clientImage: e.target.value })}
                      placeholder="https://... (or leave blank for avatar with initials)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124ec4] disabled:bg-blue-400 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Testimonial</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
