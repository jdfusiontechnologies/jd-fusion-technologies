import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown, Globe, Cpu, Wrench, Sparkles, ShieldCheck } from 'lucide-react';
import { SiteSettings, ContactSettings } from '../../types';

interface NavbarProps {
  settings?: SiteSettings;
  contact?: ContactSettings;
  onOpenInquiry?: (prefill?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const setts = settings || {
    siteName: 'JD Fusion Technologies',
    brandName: 'JD Fusion Technologies',
    tagline: 'Where Ideas Become Innovation.',
    logoUrl: '/logo-icon.svg',
    iconUrl: '/logo-icon.svg',
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setIsMobileServicesOpen(false);
  }, [location.pathname]);

  const serviceCategories = [
    {
      to: '/services/website-development',
      title: 'Website Development',
      badge: 'Core',
      desc: 'Bespoke corporate platforms, e-commerce stores, and high-performance web applications.',
      icon: Globe,
      accent: 'text-[#155EEF]',
      badgeBg: 'bg-[#155EEF]/10 text-[#155EEF]',
    },
    {
      to: '/services/systems-development',
      title: 'Systems Development',
      badge: 'Core',
      desc: 'Mission-critical enterprise ERPs, healthcare HMS, school SMS, and POS database architectures.',
      icon: Cpu,
      accent: 'text-[#155EEF]',
      badgeBg: 'bg-[#155EEF]/10 text-[#155EEF]',
    },
    {
      to: '/services/it-support',
      title: 'IT Support',
      badge: 'Support',
      desc: 'Computer hardware diagnostics, structured Cat6 network cabling, servers, and helpdesk SLAs.',
      icon: Wrench,
      accent: 'text-stone-700',
      badgeBg: 'bg-stone-100 text-stone-700',
    },
    {
      to: '/services/it-solutions',
      title: 'IT Solutions',
      badge: 'Solutions',
      desc: 'Domain & NVMe hosting, cloud computing (GCP/AWS), zero-trust cybersecurity, and automation.',
      icon: Sparkles,
      accent: 'text-[#FF914D]',
      badgeBg: 'bg-[#FF914D]/10 text-[#FF914D]',
    },
  ];

  const handleMouseEnterServices = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 180);
  };

  const handleCtaClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/contact');
  };

  const isServicesActive = location.pathname.startsWith('/services');

  return (
    <header
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* 1. Official Moving Slogan Bar */}
      <div className="bg-black text-white text-[11px] sm:text-xs font-semibold py-1.5 overflow-hidden border-b border-zinc-900 select-none relative z-30">
        <div className="flex animate-slogan-ticker whitespace-nowrap">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex items-center gap-6 px-6 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[#FF914D] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
                <span>JD FUSION TECHNOLOGIES</span>
              </span>
              <span className="text-zinc-600">✦</span>
              <span className="text-white font-semibold tracking-wide">
                Where Ideas Become Innovation.
              </span>
              <span className="text-zinc-600">✦</span>
              <span className="text-stone-300 font-medium">
                Website Development · Systems Development · IT Support · IT Solutions
              </span>
              <span className="text-zinc-600">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div
        className={`transition-all duration-300 ${
          !isHome || isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs'
            : 'bg-white/90 backdrop-blur-xs border-b border-stone-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded-xl"
              aria-label="JD Fusion Technologies Homepage"
            >
              <div className="w-10 h-10 rounded-xl bg-black border border-[#155EEF]/50 flex items-center justify-center overflow-hidden shadow-xs group-hover:border-[#FF914D] transition-colors duration-200">
                <img
                  src={setts.iconUrl || '/logo-icon.svg'}
                  alt="JD Fusion Technologies"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-xl tracking-tight text-[#155EEF] font-['Outfit']">
                    JD
                  </span>
                  <span className="font-extrabold text-xl tracking-tight text-[#FF914D] font-['Outfit']">
                    FUSION
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-black mt-0.5">
                  TECHNOLOGIES
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
              {/* Home */}
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-medium transition-colors hover:text-[#155EEF] ${
                    isActive
                      ? 'text-[#155EEF] font-bold border-b-2 border-[#155EEF]'
                      : 'text-stone-700'
                  }`
                }
              >
                Home
              </NavLink>

              {/* About Us */}
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-medium transition-colors hover:text-[#155EEF] ${
                    isActive
                      ? 'text-[#155EEF] font-bold border-b-2 border-[#155EEF]'
                      : 'text-stone-700'
                  }`
                }
              >
                About Us
              </NavLink>

              {/* Services with Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterServices}
                onMouseLeave={handleMouseLeaveServices}
              >
                <div className="flex items-center">
                  <NavLink
                    to="/services"
                    className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors hover:text-[#155EEF] ${
                      isServicesActive
                        ? 'text-[#155EEF] font-bold border-b-2 border-[#155EEF]'
                        : 'text-stone-700'
                    }`}
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isServicesDropdownOpen ? 'rotate-180 text-[#155EEF]' : 'text-stone-400'
                      }`}
                    />
                  </NavLink>
                </div>

                {/* Services Dropdown Menu */}
                {isServicesDropdownOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[460px] z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xl space-y-1">
                      <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                          Official Service Categories
                        </span>
                        <Link
                          to="/services"
                          onClick={() => setIsServicesDropdownOpen(false)}
                          className="text-xs font-bold text-[#155EEF] hover:underline"
                        >
                          View Full Catalogue &rarr;
                        </Link>
                      </div>

                      <div className="space-y-1 pt-1">
                        {serviceCategories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <Link
                              key={cat.to}
                              to={cat.to}
                              onClick={() => setIsServicesDropdownOpen(false)}
                              className="group p-3 rounded-xl hover:bg-stone-50 transition-colors flex items-start gap-3.5"
                            >
                              <div className={`w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 group-hover:bg-[#155EEF]/10 transition-colors`}>
                                <Icon className={`w-4 h-4 ${cat.accent}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-sm text-stone-900 group-hover:text-[#155EEF] transition-colors">
                                    {cat.title}
                                  </span>
                                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${cat.badgeBg}`}>
                                    {cat.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                                  {cat.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Our Projects / Portfolio */}
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-medium transition-colors hover:text-[#155EEF] ${
                    isActive
                      ? 'text-[#155EEF] font-bold border-b-2 border-[#155EEF]'
                      : 'text-stone-700'
                  }`
                }
              >
                Our Projects
              </NavLink>

              {/* Contact Us */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-medium transition-colors hover:text-[#155EEF] ${
                    isActive
                      ? 'text-[#155EEF] font-bold border-b-2 border-[#155EEF]'
                      : 'text-stone-700'
                  }`
                }
              >
                Contact Us
              </NavLink>
            </nav>

            {/* Right Action Cluster: Prominent Orange CTA */}
            <div className="hidden lg:flex items-center gap-3">

              <button
                id="navbar-cta-btn"
                onClick={handleCtaClick}
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-[#FF914D]/25 hover:shadow-lg hover:shadow-[#FF914D]/35 transition-all duration-200 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF914D]"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-stone-800 hover:bg-stone-100 transition-colors focus:outline-hidden cursor-pointer"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 bg-white px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            <NavLink
              to="/"
              end
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive ? 'bg-[#155EEF]/10 text-[#155EEF]' : 'text-stone-800 hover:bg-stone-100'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive ? 'bg-[#155EEF]/10 text-[#155EEF]' : 'text-stone-800 hover:bg-stone-100'
                }`
              }
            >
              About Us
            </NavLink>

            {/* Services with expandable sub-links */}
            <div className="rounded-xl border border-stone-200/80 overflow-hidden my-1">
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-base font-semibold text-stone-900 bg-stone-50"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isMobileServicesOpen ? 'rotate-180 text-[#155EEF]' : 'text-stone-500'
                  }`}
                />
              </button>

              {isMobileServicesOpen && (
                <div className="p-2 space-y-1 bg-white border-t border-stone-200">
                  <Link
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-bold text-[#155EEF] hover:underline"
                  >
                    View Complete Service Catalogue &rarr;
                  </Link>

                  {serviceCategories.map((cat) => (
                    <Link
                      key={cat.to}
                      to={cat.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50 text-sm font-medium text-stone-800"
                    >
                      <span>{cat.title}</span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${cat.badgeBg}`}>
                        {cat.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive ? 'bg-[#155EEF]/10 text-[#155EEF]' : 'text-stone-800 hover:bg-stone-100'
                }`
              }
            >
              Our Projects
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive ? 'bg-[#155EEF]/10 text-[#155EEF]' : 'text-stone-800 hover:bg-stone-100'
                }`
              }
            >
              Contact Us
            </NavLink>



            <div className="pt-4 mt-2 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={handleCtaClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white font-bold text-sm shadow-md"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-stone-500 font-medium pt-1">
                Where Ideas Become Innovation.
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
