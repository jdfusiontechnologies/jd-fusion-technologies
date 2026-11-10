import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Outfit']">{title}</h2>
    <div className="space-y-3 text-sm sm:text-base leading-7 text-stone-600">{children}</div>
  </section>
);

export const PrivacyPolicyPage: React.FC = () => (
  <div className="min-h-screen bg-white pt-32 pb-24 text-stone-900">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#155EEF] hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to website
      </Link>

      <header className="rounded-3xl bg-stone-950 text-white p-7 sm:p-10 mb-12">
        <div className="flex items-center gap-3 text-[#FF914D] mb-4">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">Privacy &amp; transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] tracking-tight">Privacy &amp; Cookies Notice</h1>
        <p className="mt-4 text-sm sm:text-base text-stone-300 leading-7">
          This notice explains how JD Fusion Technologies handles information when you visit this website or contact our team.
        </p>
        <p className="mt-5 text-xs text-stone-400">Last updated: 10 November 2026</p>
      </header>

      <div className="space-y-10">
        <Section title="1. Who we are">
          <p>JD Fusion Technologies operates this website and handles the personal information described in this notice. We are based in Nairobi, Kenya. For privacy questions or requests, contact us at <a className="font-semibold text-[#155EEF] underline" href="mailto:info@jdfusiontech.com">info@jdfusiontech.com</a>.</p>
        </Section>

        <Section title="2. Information we collect">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Enquiries:</strong> your name, email address, phone number (if provided), preferred contact method, requested service and project description when you submit the contact form.</li>
            <li><strong>Technical and security information:</strong> IP address, browser or device user-agent information, requested page paths and security events generated when the website is used.</li>
            <li><strong>Optional analytics:</strong> if you allow analytics, we may record page visits and broad interaction events such as clicks on contact links. These records can include IP address and browser information.</li>
            <li><strong>Administrator account information:</strong> login identifiers and authentication/session information for authorised website administrators.</li>
          </ul>
          <p>Please do not submit passwords, payment-card details or other unnecessary sensitive information through the public enquiry form.</p>
        </Section>

        <Section title="3. Why we use information">
          <p>We use enquiry details to review and respond to requests, discuss potential projects and provide services requested by prospective clients. We use technical and security information to operate, protect, troubleshoot and prevent misuse of the website. Optional usage analytics are used to understand website traffic and improve the visitor experience.</p>
          <p>Depending on the activity, our lawful basis may include taking steps at your request before entering a contract, our legitimate interests in operating and securing the website, compliance with legal obligations, or your consent where consent is required. You can withdraw consent for optional analytics at any time through Cookie Settings; withdrawal does not affect processing that took place before withdrawal.</p>
        </Section>

        <Section title="4. How we store and share information">
          <p>Enquiry and website records are stored in the website's database and systems used to host, operate and secure the service. We may share information with service providers supporting website hosting, database infrastructure, authentication, communications or technical delivery, and with professional advisers or public authorities where disclosure is legally required.</p>
          <p>The website currently uses a PostgreSQL database service, Vercel for deployment/hosting, and Google Fonts for typography. If you follow a WhatsApp, email, telephone or other external link, that service will handle information under its own privacy terms. We do not sell personal information.</p>
          <p>Some service providers may process information outside Kenya. Where personal data is transferred across borders, we will apply the safeguards required by applicable data-protection law.</p>
        </Section>

        <Section title="5. How long we keep information">
          <p>We keep information only for as long as it is reasonably needed for the purpose for which it was collected, including responding to enquiries, maintaining business records, resolving disputes, meeting legal requirements and protecting the website. Retention periods depend on the type of record and its purpose. Information that is no longer needed should be securely deleted or de-identified.</p>
        </Section>

        <Section title="6. Your privacy rights">
          <p>Subject to applicable law, you may ask to be informed about how your information is used, request access to it, ask for correction of inaccurate information, object to certain processing, request deletion or restriction where applicable, and withdraw consent where processing relies on consent.</p>
          <p>To make a request, email <a className="font-semibold text-[#155EEF] underline" href="mailto:info@jdfusiontech.com">info@jdfusiontech.com</a>. We may need to verify your identity before responding. You may also raise a concern with the Office of the Data Protection Commissioner in Kenya.</p>
        </Section>

        <Section title="7. Cookies and browser storage">
          <p>This website does not currently use advertising cookies or third-party advertising trackers. The application uses essential browser storage for functions such as administrator sessions and remembering your privacy preferences. These items are needed for requested site functionality or to remember your choices.</p>
          <p>Optional visitor analytics are controlled by your choice in the privacy preferences banner. Analytics are off unless you select “Accept analytics”. If you reject optional analytics, the website will not initiate its page-visit or contact-interaction analytics from this browser. Security and operational processing needed to run the service may still occur.</p>
          <p>Google Fonts may load from Google's servers when pages are displayed, which can disclose technical connection information to that provider. You can manage optional analytics at any time using the control below.</p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('jdfusion:open-cookie-preferences'))}
            className="inline-flex items-center rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-stone-700"
          >
            Open Cookie Settings
          </button>
        </Section>

        <Section title="8. Security">
          <p>We use access controls and technical measures intended to protect information against unauthorised access, loss, alteration or disclosure. No website or electronic transmission can be guaranteed completely secure. Please contact us promptly if you believe information submitted to us has been exposed or misused.</p>
        </Section>

        <Section title="9. Changes to this notice">
          <p>We may update this notice when our website, data practices or legal requirements change. The “Last updated” date at the top indicates the latest revision. Material changes will be reflected on this page.</p>
        </Section>
      </div>

      <div className="mt-14 border-t border-stone-200 pt-8 flex flex-wrap gap-5 text-sm font-semibold">
        <Link to="/contact" className="text-[#155EEF] hover:underline">Contact JD Fusion Technologies</Link>
        <Link to="/" className="text-stone-600 hover:text-stone-900">Return to homepage</Link>
      </div>
    </div>
  </div>
);
