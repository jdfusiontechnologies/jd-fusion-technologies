import React from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings, ContactSettings, LocationSettings, SocialLink } from '../../types';
import { DynamicIcon } from './DynamicIcon';
import { trackUserAction } from '../../lib/api';
import { Mail, Phone, MapPin, Clock, ArrowUp, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  settings?: SiteSettings;
  contact?: ContactSettings;
  location?: LocationSettings;
  socials?: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  contact,
  location,
  socials = [],
}) => {
  const setts = settings || {
    siteName: 'JD Fusion Technologies',
    brandName: 'JD Fusion Technologies',
    tagline: 'Where Ideas Become Innovation.',
    logoUrl: '/logo-icon.svg',
    iconUrl: '/logo-icon.svg',
  };

  const cont = contact || {
    email: 'info@jdfusiontech.com',
    phone: '+254 700 000 000',
    whatsapp: '+254 700 000 000',
    businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM (EAT)',
  };

  const loc = location || {
    address: 'Commercial Business Centre, Nairobi, Kenya',
    mapLink: 'https://maps.google.com/?q=Nairobi+Kenya',
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-black text-stone-300 border-t border-zinc-900 relative overflow-hidden">
      {/* Subtle fine geometric detail */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #155EEF 1px, transparent 1px), linear-gradient(to bottom, #155EEF 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-zinc-800/80">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 inline-block">
              <div className="w-10 h-10 rounded-xl bg-black border border-[#155EEF]/50 flex items-center justify-center overflow-hidden shadow-xs">
                <img
                  src={setts.iconUrl || '/logo-icon.svg'}
                  alt="JD Fusion Technologies"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex items-center gap-1.5 font-['Outfit']">
                <span className="font-extrabold text-2xl text-[#155EEF]">JD</span>
                <span className="font-extrabold text-2xl text-[#FF914D]">FUSION</span>
                <span className="font-bold text-2xl text-white">TECH</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 text-xs font-bold text-[#FF914D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Where Ideas Become Innovation.</span>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Engineering-driven technology company specialising primarily in Website Development and Systems Development, reinforced by dependable IT Support and strategic IT Solutions.
            </p>

            {/* Social Links - Render any social channel activated by the admin */}
            {(() => {
              const activeSocials = (socials || []).filter(
                (s) => s.isPublished !== false && s.isEnabled !== false
              );
              if (activeSocials.length === 0) return null;
              return (
                <div className="pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-3">
                    Connect With Our Team
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {activeSocials.map((social) => (
                      <a
                        key={social.id}
                        id={`footer-social-${social.platform}`}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          if ((social.platform || '').toLowerCase() === 'whatsapp') {
                            trackUserAction('whatsapp', `Footer WhatsApp Link (${social.url})`);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-[#155EEF] text-zinc-400 hover:text-white transition-all duration-200 border border-zinc-800 hover:-translate-y-0.5 shadow-2xs"
                        title={social.platformName}
                        aria-label={social.platformName}
                      >
                        <DynamicIcon name={social.icon} className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-zinc-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-zinc-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-zinc-400 hover:text-white transition-colors">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The 4 Official Divisions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Official Services
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link
                  to="/services/website-development"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Website Development</span>
                  <span className="text-[10px] uppercase font-bold text-[#155EEF] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/services/systems-development"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Systems Development</span>
                  <span className="text-[10px] uppercase font-bold text-[#155EEF] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/services/it-support"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>IT Support</span>
                  <span className="text-[10px] uppercase text-zinc-500 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/services/it-solutions"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>IT Solutions</span>
                  <span className="text-[10px] uppercase text-[#FF914D]">Solutions</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-zinc-900">
                <Link
                  to="/services"
                  className="text-xs font-bold text-[#155EEF] hover:underline"
                >
                  Complete 33-Service Catalogue &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#155EEF] shrink-0 mt-0.5" />
                <span>{loc.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />
                <a
                  href={`mailto:${cont.email}`}
                  onClick={() => trackUserAction('email', cont.email)}
                  className="hover:text-white transition-colors"
                >
                  {cont.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />
                <div className="flex flex-wrap items-center gap-1 font-mono">
                  {cont.phone && cont.phone.includes('/') ? (
                    cont.phone.split('/').map((num, i, arr) => {
                      const clean = num.trim();
                      return (
                        <React.Fragment key={i}>
                          <a
                            href={`tel:${clean.replace(/[^0-9+]/g, '')}`}
                            onClick={() => trackUserAction('call', clean)}
                            className="hover:text-white transition-colors"
                          >
                            {clean}
                          </a>
                          {i < arr.length - 1 && <span className="text-zinc-600">/</span>}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <a
                      href={`tel:${(cont.phone || '').replace(/[^0-9+]/g, '')}`}
                      onClick={() => trackUserAction('call', cont.phone)}
                      className="hover:text-white transition-colors"
                    >
                      {cont.phone}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span>{cont.businessHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF914D] hover:text-[#ffa56b] transition-colors"
              >
                <span>Schedule a Consultation</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} {setts.brandName || 'JD Fusion Technologies'}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="font-medium text-stone-400 hidden sm:inline">
              Where Ideas Become Innovation.
            </span>
            <Link to="/about" className="hover:text-zinc-300 transition-colors">
              Leadership
            </Link>
            <Link to="/contact" className="hover:text-zinc-300 transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy &amp; Cookies
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('jdfusion:open-cookie-preferences'))}
              className="hover:text-zinc-300 transition-colors"
            >
              Cookie Settings
            </button>


            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
