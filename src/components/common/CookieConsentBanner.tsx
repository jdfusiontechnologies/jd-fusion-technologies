import React, { useEffect, useState } from 'react';
import { Cookie, Settings2, X } from 'lucide-react';

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
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => readChoice()?.analytics === true);

  useEffect(() => {
    const openPreferences = () => {
      setAnalyticsEnabled(readChoice()?.analytics === true);
      setShowPreferences(true);
      setIsOpen(true);
    };
    window.addEventListener('jdfusion:open-cookie-preferences', openPreferences);
    return () => window.removeEventListener('jdfusion:open-cookie-preferences', openPreferences);
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
      // If browser storage is unavailable, analytics remains disabled for this visit.
    }
    setAnalyticsEnabled(analytics);
    setShowPreferences(false);
    setIsOpen(false);
    window.dispatchEvent(new Event('jdfusion:consent-change'));
  };

  if (!isOpen) return null;

  return (
    <aside
      role="dialog"
      aria-label="Privacy and analytics preferences"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5"
    >
      <div className="max-w-5xl mx-auto rounded-2xl border border-stone-200 bg-white text-stone-900 shadow-2xl shadow-black/20 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-base font-['Outfit']">Your privacy choices</h2>
            <p className="mt-1 text-xs sm:text-sm leading-6 text-stone-600">
              Essential browser storage keeps requested site features working. Optional analytics helps us understand page visits and contact-link clicks and may process your IP address and browser information. Analytics stays off unless you allow it. Read our{' '}
              <a href="/privacy" className="font-semibold text-[#155EEF] underline">Privacy &amp; Cookies Notice</a>.
            </p>

            {showPreferences && (
              <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Essential storage</p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">Always active. Used for core site functions and to remember this preference.</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Always on</span>
                </div>
                <label className="mt-4 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#155EEF]"
                  />
                  <span>
                    <span className="block text-sm font-semibold">Optional usage analytics</span>
                    <span className="block mt-1 text-xs leading-5 text-stone-600">Allow page-visit and contact-interaction measurement. This can include IP address and browser information.</span>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => saveChoice(analyticsEnabled)}
                  className="mt-4 rounded-lg bg-[#155EEF] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Save my preferences
                </button>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => saveChoice(true)}
                className="rounded-lg bg-[#155EEF] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Accept analytics
              </button>
              <button
                type="button"
                onClick={() => saveChoice(false)}
                className="rounded-lg border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-100"
              >
                Reject optional
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences((current) => !current)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-950"
              >
                <Settings2 className="w-3.5 h-3.5" /> {showPreferences ? 'Hide settings' : 'Customise'}
              </button>
              {showPreferences && (
                <button
                  type="button"
                  onClick={() => { setShowPreferences(false); setIsOpen(false); }}
                  className="ml-auto p-2 text-stone-500 hover:text-stone-900"
                  aria-label="Close preferences without saving"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
