import React from 'react';
import { Founder, SiteSettings } from '../../types';
import { Users, Quote } from 'lucide-react';

interface FoundersSectionProps {
  founders?: Founder[];
  settings?: SiteSettings;
  onInquireClick?: () => void;
}

export const FoundersSection: React.FC<FoundersSectionProps> = ({
  founders,
  settings,
}) => {
  const defaultFounders: Founder[] = [
    {
      id: 'founder-diffan-mugwira',
      name: 'Diffan Mugwira',
      role: 'Founder',
      bio: 'Leading corporate strategy, digital scalability, and technical partnerships at JD Fusion Technologies. Diffan brings extensive expertise in deploying modern enterprise infrastructure, scalable digital platforms, and delivering mission-critical tech solutions.',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=85',
      quote:
        'We build digital technology that empowers enterprises to operate with speed, agility, and uncompromising resilience.',
      displayOrder: 1,
      isPublished: true,
    },
    {
      id: 'founder-joshua-mwenda',
      name: 'Joshua Mwenda',
      role: 'Founder',
      bio: 'Pioneering the creative and technical vision of JD Fusion Technologies. With deep expertise in digital product architecture, brand design systems, and client growth engineering, Joshua bridges cutting-edge aesthetics with high-performance business solutions across East Africa and globally.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=85',
      quote:
        'Great technology without impeccable design is invisible; great design without technical horsepower is fragile. At JD Fusion, we fuse both.',
      displayOrder: 2,
      isPublished: true,
    },
    {
      id: 'founder-gladies-kende',
      name: 'Gladies Kende',
      role: 'Co-Founder',
      bio: 'Directing organizational operations, client engagement, and digital project execution at JD Fusion Technologies. Gladies ensures high-precision delivery, seamless client workflows, and client success across all web and digital initiatives.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=85',
      quote:
        'Our focus is excellence in delivery—translating complex organizational needs into reliable, intuitive, and secure digital realities.',
      displayOrder: 3,
      isPublished: true,
    },
  ];

  const list = founders && founders.length > 0 ? founders : defaultFounders;
  const publishedList = list.filter((f) => f.isPublished !== false);

  return (
    <section
      id="founders"
      className="py-20 bg-stone-50/60 relative overflow-hidden border-t border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-[#155EEF]" />
            <span>Leadership &amp; Founders</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black font-['Outfit'] tracking-tight">
            The Founders Behind {settings?.brandName || 'JD Fusion Technologies'}
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            The dedicated engineering leadership guiding our technology, systems architecture, and client partnerships.
          </p>
        </div>

        {/* Founders Cards: Picture, Name, Place he or she holds, and Message */}
        <div className={`grid grid-cols-1 ${publishedList.length === 2 ? 'lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {publishedList.map((founder) => {
            const message = founder.quote || founder.bio;

            return (
              <div
                key={founder.id}
                className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-6"
              >
                {/* 1. Picture */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-stone-200 shadow-sm">
                  <img
                    src={founder.imageUrl}
                    alt={founder.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                {/* 2. Name, 3. Place he or she holds, 4. Message */}
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    {/* Name */}
                    <h3 className="text-2xl font-extrabold text-black font-['Outfit'] tracking-tight">
                      {founder.name}
                    </h3>
                    {/* Place he or she holds */}
                    <p className="text-sm font-semibold text-[#155EEF] mt-1">
                      {founder.role}
                    </p>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className="relative pt-1">
                      <Quote className="w-4 h-4 text-[#155EEF]/40 mb-1 inline-block sm:hidden" />
                      <p className="text-stone-600 text-sm sm:text-base leading-relaxed italic">
                        &ldquo;{message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
