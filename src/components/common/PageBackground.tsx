import React from 'react';

export type PageBackgroundVariant =
  | 'home-hero'
  | 'services'
  | 'projects'
  | 'about'
  | 'contact'
  | 'insights'
  | 'subtle';

interface PageBackgroundProps {
  variant: PageBackgroundVariant;
  className?: string;
}

export const PageBackground: React.FC<PageBackgroundProps> = ({ variant, className = '' }) => {
  if (variant === 'services') {
    // Services: Clean white background with subtle moving blue gradient orbs and understated geometric details
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {/* Subtle geometric dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(#155EEF 1.2px, transparent 1.2px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Moving blue gradient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#155EEF]/8 dark:bg-[#155EEF]/12 blur-3xl" />
        <div className="absolute top-1/3 -right-36 w-[30rem] h-[30rem] rounded-full bg-[#155EEF]/6 dark:bg-[#155EEF]/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-[#FF914D]/4 dark:bg-[#FF914D]/8 blur-3xl" />

        {/* Minimal fine architectural grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #155EEF 1px, transparent 1px), linear-gradient(to bottom, #155EEF 1px, transparent 1px)`,
            backgroundSize: '96px 96px',
          }}
        />
      </div>
    );
  }

  if (variant === 'projects') {
    // Projects: Black or deep blue background with restrained blue and orange glowing accents
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {/* Deep blue-black vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#060D1F] to-black" />

        {/* Restrained glowing accents */}
        <div className="absolute top-1/4 -left-24 w-[32rem] h-[32rem] rounded-full bg-[#155EEF]/15 blur-[120px]" />
        <div className="absolute bottom-1/3 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#FF914D]/10 blur-[110px]" />
        <div className="absolute top-3/4 left-1/3 w-80 h-80 rounded-full bg-[#155EEF]/10 blur-[90px]" />

        {/* Precision coordinate grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(21, 94, 239, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(21, 94, 239, 0.2) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>
    );
  }

  if (variant === 'about') {
    // About: Sophisticated blue-white gradient with subtle abstract shapes
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {/* Subtle gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-black dark:via-[#070E24] dark:to-black" />

        {/* Abstract organic shapes */}
        <div className="absolute top-10 left-1/4 w-[36rem] h-[36rem] rounded-full bg-[#155EEF]/7 dark:bg-[#155EEF]/14 blur-[130px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#FF914D]/5 dark:bg-[#FF914D]/10 blur-[100px]" />

        {/* Diagonal architectural accent lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="about-stripes" width="60" height="60" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="60" stroke="#155EEF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-stripes)" />
        </svg>
      </div>
    );
  }

  if (variant === 'contact') {
    // Contact: Black background with a soft blue glow and restrained orange highlights
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {/* Deep dark backdrop */}
        <div className="absolute inset-0 bg-black" />

        {/* Soft blue glow centered around contact card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-[#155EEF]/14 blur-[140px]" />

        {/* Restrained orange highlight */}
        <div className="absolute top-1/4 right-10 w-80 h-80 rounded-full bg-[#FF914D]/10 blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-[#155EEF]/10 blur-[90px]" />

        {/* Fine cyber network grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(rgba(21, 94, 239, 0.4) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>
    );
  }

  if (variant === 'insights') {
    // Insights / Blog: Editorial, clean modern tech backdrop
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-stone-50 dark:from-black dark:via-[#050B1A] dark:to-black" />
        <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] rounded-full bg-[#155EEF]/8 dark:bg-[#155EEF]/12 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-[#FF914D]/5 dark:bg-[#FF914D]/8 blur-3xl" />
      </div>
    );
  }

  // Fallback / subtle
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-[#155EEF]/5 blur-3xl" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-[#FF914D]/5 blur-3xl" />
    </div>
  );
};
