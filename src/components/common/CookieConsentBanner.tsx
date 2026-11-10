import React, { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'jdfusion_cookie_consent_v1';

type ConsentChoice = {
  essential: true;
  analytics: boolean;
  updatedAt: string;
  policyVersion: string;
};

function readChoice(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value);
    if (typeof parsed.analytics !== 'boolean') return null;
    return parsed as ConsentChoice;
  } catch {
    return null;
  }
}

export const CookieConsentBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => !readChoice());

  useEffect(() => {
    const openBanner = () => setIsOpen(true);
    window.addEventListener('jdfusion:open-cookie-preferences', openBanner);
    return () => window.removeEventListener('jdfusion:open-cookie-preferences', openBanner);
  }, []);

  const saveChoice = (analytics: boolean) => {
    const choice: ConsentChoice = {
      essential: true,
      analytics,
      updatedAt: new Date().toISOString(),
      policyVersion: '2026-11-10',
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    } catch {
      // Analytics remains disabled if the browser cannot store the consent record.
    }
    setIsOpen(false);
    window.dispatchEvent(new Event('jdfusion:consent-change'));
  };

  if (!isOpen) return null;

  return (
    <aside
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5"
    >
      <div className="max-w-5xl mx-auto rounded-2xl border border-stone-200 bg-white text-stone-900 shadow-2xl shadow-black/20 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-base font-['Outfit']">Cookies on this website</h2>
            <p className="mt-1 text-xs sm:text-sm leading-6 text-stone-600">
              We use essential storage to keep the website working. With your permission, we also use optional analytics to understand page visits and contact-link clicks. Analytics may process your IP address and browser information. You can accept or reject optional analytics. Read our{' '}
              <a href="/privacy" className="font-semibold text-[#155EEF] underline">Privacy &amp; Cookies Notice</a>.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => saveChoice(true)}
                className="rounded-lg bg-[#155EEF] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Accept cookies
              </button>
              <button
                type="button"
                onClick={() => saveChoice(false)}
                className="rounded-lg border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-100"
              >
                Reject optional cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
