import React, { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'jdfusion_essential_notice_ack_v1';

export const CookieConsentBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'acknowledged';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const openNotice = () => setIsOpen(true);
    window.addEventListener('jdfusion:open-cookie-notice', openNotice);
    return () => window.removeEventListener('jdfusion:open-cookie-notice', openNotice);
  }, []);

  const acknowledgeNotice = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'acknowledged');
    } catch {
      // The notice remains informational if browser storage is unavailable.
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      role="dialog"
      aria-label="Essential storage notice"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5"
    >
      <div className="max-w-3xl mx-auto rounded-2xl border border-stone-200 bg-white text-stone-900 shadow-2xl shadow-black/20 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-base font-['Outfit']">Essential browser storage</h2>
            <p className="mt-1 text-xs sm:text-sm leading-6 text-stone-600">
              We use essential browser storage for core website functions, including keeping authorised admin sessions signed in. This notice is only an acknowledgement. Page-view analytics count visits without storing IP addresses or browser details in our analytics database.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={acknowledgeNotice}
                className="rounded-lg bg-[#155EEF] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
