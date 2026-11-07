export interface CatalogueServiceItem {
  id: string;
  name: string;
  description: string;
  deliverables?: string[];
}

export interface CatalogueSubcategory {
  id: string;
  title: string;
  tagline: string;
  description: string;
  servicesIncluded: string[];
  keyHighlights: string[];
  targetAudience: string;
  technologies: string[];
}

export interface CatalogueCategory {
  id: 'website-development' | 'systems-development' | 'it-support' | 'it-solutions';
  slug: string;
  title: string;
  shortName: string;
  tagline: string;
  overview: string;
  isPrimary: boolean;
  priorityLabel: 'Core Practice' | 'Supporting Division';
  iconName: string;
  accentColor: string;
  subcategories: CatalogueSubcategory[];
}

export const OFFICIAL_SERVICE_CATALOGUE: CatalogueCategory[] = [
  // =================================================================
  // 1. WEBSITE DEVELOPMENT (CORE PRACTICE - MAXIMUM VISUAL EMPHASIS)
  // =================================================================
  {
    id: 'website-development',
    slug: 'website-development',
    title: 'Website Development',
    shortName: 'Web Development',
    tagline: 'High-performance, bespoke websites & web applications engineered for speed, authority, and conversion.',
    overview:
      'We architect modern, lightning-fast digital storefronts, corporate portals, and customized web platforms. Engineered with modern React 19, Next.js, and TypeScript, each web experience is built from the ground up for sub-second load times, mobile-first responsiveness, and top-tier search engine visibility.',
    isPrimary: true,
    priorityLabel: 'Core Practice',
    iconName: 'Globe',
    accentColor: '#155EEF',
    subcategories: [
      {
        id: 'business-corporate-websites',
        title: 'Business & Corporate Websites',
        tagline: 'Establish institutional credibility, corporate identity, and inbound lead generation.',
        description:
          'Bespoke corporate platforms designed to position your enterprise as an industry benchmark. Includes corporate storytelling, team directories, investor relations, service showcases, and automated lead capture.',
        servicesIncluded: [
          'Corporate identity and company profile websites',
          'Professional service firm websites (Law, Accounting, Consulting)',
          'B2B enterprise portals and partner directories',
          'Interactive lead generation funnels and consultation booking',
          'Multi-office location maps and organizational directories',
        ],
        keyHighlights: ['Sub-second page speeds', 'Enterprise SEO architecture', 'Brand-consistent visual identity', 'GDPR/Data privacy compliance'],
        targetAudience: 'Corporations, SMEs, professional practices, institutions, and consultancies.',
        technologies: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      },
      {
        id: 'personal-portfolio-websites',
        title: 'Personal & Portfolio Websites',
        tagline: 'Showcase your creative craftsmanship, executive reputation, and thought leadership.',
        description:
          'Tailor-made visual portfolios and executive profile websites crafted to highlight projects, creative achievements, published work, and personal brand authority.',
        servicesIncluded: [
          'Creative portfolios for designers, architects, and photographers',
          'Executive C-suite profile websites and resume showcases',
          'Consultant, keynote speaker, and author branding portals',
          'Interactive project case studies with high-resolution image galleries',
          'Media kits and press release archives',
        ],
        keyHighlights: ['Immersive visual storytelling', 'Interactive project modals', 'Integrated downloadable CV/resumes', 'Direct inquiry channels'],
        targetAudience: 'Executives, creatives, architects, freelance specialists, consultants, and public figures.',
        technologies: ['Vite', 'React 19', 'Framer Motion', 'Tailwind CSS', 'Cloudinary CDN'],
      },
      {
        id: 'ecommerce-websites',
        title: 'E-Commerce Websites',
        tagline: 'Drive online sales with frictionless checkout, inventory control, and payment gateways.',
        description:
          'End-to-end digital commerce stores and multi-vendor marketplaces engineered for high conversion rates. Features integrated local and international payment processing (M-Pesa Daraja, Stripe, PayPal), dynamic catalog filters, and automated order notifications.',
        servicesIncluded: [
          'Custom online stores and shopping cart architectures',
          'M-Pesa Daraja STK Push & credit card payment integration',
          'Real-time inventory tracking, low-stock alerts, and SKU management',
          'Customer account portals, order history, and shipment tracking',
          'Coupon, discount, and promotional campaign engines',
        ],
        keyHighlights: ['Zero-friction checkout flow', 'Automated SMS/Email order receipts', 'M-Pesa instant reconciliation', 'Mobile-first shopping UI'],
        targetAudience: 'Retailers, wholesalers, fashion brands, electronics distributors, and consumer product merchants.',
        technologies: ['Next.js', 'PostgreSQL', 'Stripe API', 'M-Pesa Daraja API', 'Redis'],
      },
      {
        id: 'educational-websites',
        title: 'Educational Websites',
        tagline: 'Empower learning institutions, academies, and online training providers.',
        description:
          'Comprehensive web portals for schools, universities, training institutes, and e-learning creators. Facilitates student admissions, downloadable curriculum materials, faculty directories, and academic calendars.',
        servicesIncluded: [
          'Primary, secondary, and higher learning institutional portals',
          'Online course catalogs and program registration workflows',
          'Prospectus downloads and digital admission application forms',
          'Departmental faculty pages and academic calendar boards',
          'Student and parent resource libraries with fee schedule downloads',
        ],
        keyHighlights: ['Accessible, clean navigation', 'High-volume admission form processing', 'Secure document distribution', 'Mobile friendly for students'],
        targetAudience: 'Schools, colleges, universities, professional training academies, and online educators.',
        technologies: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Cloud Storage'],
      },
      {
        id: 'media-publishing-websites',
        title: 'Media & Publishing Websites',
        tagline: 'Distribute journalism, digital magazines, editorial blogs, and multimedia broadcasts.',
        description:
          'High-throughput publishing platforms engineered for editorial teams and media houses. Includes categorized article architectures, multimedia embeds, author profiles, newsletter subscriptions, and social syndication.',
        servicesIncluded: [
          'Digital news portals and investigative journalism sites',
          'Online magazines with rich editorial typography and photo essays',
          'Corporate thought-leadership blogs and whitepaper libraries',
          'Podcast and video interview streaming embeds',
          'Automated newsletter capture and RSS syndication feeds',
        ],
        keyHighlights: ['Optimized for ad placement and sponsors', 'Lightning-fast article rendering', 'Full OpenGraph social share cards', 'Editor CMS tooling'],
        targetAudience: 'Publishers, media networks, content creators, think tanks, and editorial teams.',
        technologies: ['Next.js', 'React', 'Tailwind CSS', 'PostgreSQL', 'Edge Caching'],
      },
      {
        id: 'industry-specific-websites',
        title: 'Industry-Specific Websites',
        tagline: 'Purpose-built web solutions configured around unique industry regulatory and operational needs.',
        description:
          'Specialized websites crafted around vertical-specific workflows, including real estate property listings, medical clinic patient info, engineering portfolios, and manufacturing specification catalogs.',
        servicesIncluded: [
          'Real estate agency websites with interactive property listings and filters',
          'Healthcare and medical clinic information portals with doctor schedules',
          'Engineering and construction company project showcase sites',
          'Manufacturing, distribution, and equipment specification catalogs',
          'Hospitality, tour operator, and safari excursion websites',
        ],
        keyHighlights: ['Custom property/spec filter engines', 'Direct booking and inquiry CTAs', 'Interactive Google Maps & location routing', 'High-res image galleries'],
        targetAudience: 'Real estate brokers, medical clinics, construction firms, manufacturing plants, and tour operators.',
        technologies: ['React 19', 'TypeScript', 'PostgreSQL', 'Google Maps API', 'Tailwind CSS'],
      },
      {
        id: 'booking-community-websites',
        title: 'Booking & Community Websites',
        tagline: 'Connect audiences, manage reservations, and foster vibrant online communities.',
        description:
          'Interactive portals designed for scheduling, appointment reservations, member communities, and non-profit organization engagement. Enables real-time slot selection, calendar syncing, and member directories.',
        servicesIncluded: [
          'Online appointment scheduling for salons, spas, and consultants',
          'Event registration, ticket booking, and attendee confirmation passes',
          'Membership community websites with gated member-only content',
          'Non-profit, NGO, and charitable foundation donation portals',
          'Community forums, message boards, and volunteer registration',
        ],
        keyHighlights: ['Automated calendar sync (Google/Outlook)', 'Instant SMS/Email confirmations', 'Secure recurring donation processing', 'Role-based member logins'],
        targetAudience: 'Service providers, event organizers, clubs, religious organizations, and non-profits.',
        technologies: ['React 19', 'Node.js', 'PostgreSQL', 'Google Calendar API', 'JWT Auth'],
      },
      {
        id: 'custom-web-development',
        title: 'Custom Web Development',
        tagline: 'Bespoke web applications engineered from scratch to solve your exact business challenge.',
        description:
          'When off-the-shelf templates and generic CMSs fall short, we build tailored web applications with custom state logic, complex mathematical calculators, interactive portals, and proprietary business workflows.',
        servicesIncluded: [
          'Bespoke Single Page Applications (SPAs) and Progressive Web Apps (PWAs)',
          'Custom quotation calculators and automated pricing estimators',
          'Client self-service dashboards and secure customer portals',
          'Interactive data visualization tools and live telemetry graphs',
          'Full-stack API development and third-party software integration',
        ],
        keyHighlights: ['Zero technical debt', '100% proprietary code ownership', 'Tailored to unique business logic', 'Enterprise scalability baseline'],
        targetAudience: 'Enterprises with unique operational models, innovative startups, and tech-forward organizations.',
        technologies: ['React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM'],
      },
    ],
  },

  // =================================================================
  // 2. SYSTEMS DEVELOPMENT (CORE PRACTICE - MAXIMUM VISUAL EMPHASIS)
  // =================================================================
  {
    id: 'systems-development',
    slug: 'systems-development',
    title: 'Systems Development',
    shortName: 'Systems Development',
    tagline: 'Scalable, fault-tolerant enterprise software systems, management platforms & database backbones.',
    overview:
      'We engineer mission-critical operational systems that power organizations from the inside out. From complete enterprise resource planning (ERP) and hospital management to school administrative systems and automated inventory engines, we design resilient software architectures built for high concurrency, rock-solid security, and audit-ready data integrity.',
    isPrimary: true,
    priorityLabel: 'Core Practice',
    iconName: 'Cpu',
    accentColor: '#155EEF',
    subcategories: [
      {
        id: 'business-enterprise-systems',
        title: 'Business & Enterprise Systems',
        tagline: 'Streamline operational workflows, inter-departmental collaboration, and corporate intelligence.',
        description:
          'Centralized enterprise platforms that integrate customer relationship management (CRM), internal communication, operational approvals, and document management into one unified system.',
        servicesIncluded: [
          'Enterprise Resource Planning (ERP) systems tailored to company workflows',
          'Customer Relationship Management (CRM) with automated sales pipelines',
          'Internal document approval, electronic signature, and archival systems',
          'Inter-departmental ticketing and task dispatch management',
          'Executive management dashboards with real-time KPI telemetry',
        ],
        keyHighlights: ['Role-based access control (RBAC)', 'Audit trail logging', 'Automated notifications & alerts', 'Centralized data repository'],
        targetAudience: 'Mid-to-large enterprises, multi-branch corporations, and scaling business groups.',
        technologies: ['Node.js', 'PostgreSQL', 'React 19', 'TypeScript', 'Redis', 'Docker'],
      },
      {
        id: 'education-management-systems',
        title: 'Education Management Systems',
        tagline: 'Automate student lifecycles, fee collection, gradebooks, and academic administration.',
        description:
          'Comprehensive School Management Systems (SMS) and Student Information Systems (SIS) covering the entire educational journey from registration to alumni tracking.',
        servicesIncluded: [
          'Student Information Systems (SIS) and digital admission tracking',
          'Automated fee invoicing, M-Pesa fee reconciliation, and ledger tracking',
          'Exam grading, automated report card generation, and transcript issuing',
          'Timetable scheduling, teacher allocations, and classroom assignment',
          'Parent portal with real-time attendance, fee balance, and performance alerts',
        ],
        keyHighlights: ['Automated term-by-term fee reconciliation', 'One-click report card PDF generation', 'SMS notifications to parents', 'Teacher grading portals'],
        targetAudience: 'Primary schools, high schools, international academies, vocational colleges, and universities.',
        technologies: ['PostgreSQL', 'Express', 'React 19', 'PDFKit', 'SMS Gateway APIs'],
      },
      {
        id: 'healthcare-management-systems',
        title: 'Healthcare Management Systems',
        tagline: 'Elevate patient care with digital health records, clinic scheduling, and pharmacy inventory.',
        description:
          'Secure, compliance-aligned Hospital Management Systems (HMS) and Clinic Management Software designed for microsecond response times and rigorous patient confidentiality.',
        servicesIncluded: [
          'Electronic Health Records (EHR / EMR) and diagnostic history tracking',
          'Outpatient and inpatient registration, bed allocation, and nurse logging',
          'Doctor consultation scheduling, queue management, and triage recording',
          'Pharmacy prescription management, dispensing logs, and drug stock control',
          'Laboratory test ordering, specimen tracking, and automated result delivery',
        ],
        keyHighlights: ['Strict patient data privacy and zero-trust security', 'Real-time doctor queue display', 'Automated pharmacy stock alerts', 'Insurance billing support'],
        targetAudience: 'Hospitals, specialty clinics, dental centers, diagnostic laboratories, and pharmacy networks.',
        technologies: ['PostgreSQL', 'Node.js', 'React 19', 'TypeScript', 'Encrypted Blobs'],
      },
      {
        id: 'finance-accounting-systems',
        title: 'Finance & Accounting Systems',
        tagline: 'Maintain immaculate general ledgers, automated billing, payroll, and tax compliance.',
        description:
          'Financial management software engineered with double-entry principles, automatic bank & M-Pesa statement reconciliation, expenditure tracking, and automated tax filings.',
        servicesIncluded: [
          'Double-entry General Ledger (GL) and chart of accounts management',
          'Automated client invoicing, recurring billing, and aging debtor tracking',
          'Statutory payroll processing with PAYE, NSSF, NHIF/SHIF deductions',
          'Multi-currency exchange handling and financial statement generation',
          'Expense voucher approvals, petty cash tracking, and audit preparation',
        ],
        keyHighlights: ['Mathematically verified double-entry ledgers', 'Instant P&L and Balance Sheet reports', 'Automated payroll slip generation', 'Tamper-proof audit logs'],
        targetAudience: 'Corporate finance teams, accounting firms, retail enterprises, and commercial institutions.',
        technologies: ['PostgreSQL', 'Node.js', 'TypeScript', 'Drizzle ORM', 'Math.js'],
      },
      {
        id: 'retail-inventory-systems',
        title: 'Retail & Inventory Systems',
        tagline: 'Point of sale, barcode scanning, multi-warehouse stock management, and supplier ordering.',
        description:
          'High-speed Point of Sale (POS) and inventory control software built for fast checkouts, barcode integration, automated stock replenishment, and multi-branch synchronization.',
        servicesIncluded: [
          'Touchscreen Point of Sale (POS) with receipt printer & cash drawer support',
          'Multi-warehouse inventory tracking with serial and batch number tracking',
          'Barcode scanning, label generation, and price tag printing',
          'Automated low-stock threshold alerts and supplier purchase order generation',
          'Return merchandise authorization (RMA) and damaged stock logging',
        ],
        keyHighlights: ['Offline-first local caching for zero POS downtime', 'Direct M-Pesa till and prompt integration', 'Multi-store inventory visibility', 'Daily sales closeout audits'],
        targetAudience: 'Supermarkets, retail stores, hardware shops, wholesalers, auto-spares distributors, and pharmacies.',
        technologies: ['React 19', 'TypeScript', 'Node.js', 'SQLite/PostgreSQL', 'WebUSB / ESC-POS'],
      },
      {
        id: 'human-resource-systems',
        title: 'Human Resource Systems',
        tagline: 'Digitize employee records, biometric attendance, leave requests, and performance reviews.',
        description:
          'Human Resource Management Systems (HRMS) that streamline people operations from recruitment and biometric check-ins to leave tracking and employee appraisal cycles.',
        servicesIncluded: [
          'Employee records database, contract repository, and document vaults',
          'Biometric fingerprint & facial recognition clock-in hardware integration',
          'Self-service employee portal for leave applications and approval routing',
          'Performance appraisal workflows, KPI scoring, and 360-degree feedback',
          'Disciplinary record tracking, training certifications, and exit checklists',
        ],
        keyHighlights: ['Biometric clock-in sync', 'Mobile-friendly employee self-service', 'Automated leave balance calculation', 'Seamless payroll ledger integration'],
        targetAudience: 'Corporate organizations, manufacturing facilities, school staff, hospitality teams, and NGOs.',
        technologies: ['PostgreSQL', 'React 19', 'Node.js', 'Biometric SDKs', 'Tailwind CSS'],
      },
      {
        id: 'property-hospitality-systems',
        title: 'Property & Hospitality Systems',
        tagline: 'Automate tenant leases, utility meters, hotel reservations, and guest invoicing.',
        description:
          'Specialized Property Management Systems (PMS) and Hotel Reservation Engines covering commercial real estate, residential estates, hotels, and holiday lodges.',
        servicesIncluded: [
          'Hotel room booking, front-desk check-in, housekeeping status, and guest billing',
          'Residential and commercial tenant lease management and contract renewals',
          'Automated rent invoicing, utility bill sub-metering, and payment receipts',
          'Maintenance request dispatching and contractor repair tracking',
          'Landlord statements, property vacancy reports, and commission calculations',
        ],
        keyHighlights: ['Real-time room/unit occupancy grid', 'Automated SMS rent reminders', 'M-Pesa paybill rent reconciliation', 'Detailed landlord statements'],
        targetAudience: 'Property managers, estate agents, landlords, hotel operators, resort lodges, and Airbnb managers.',
        technologies: ['React 19', 'PostgreSQL', 'Node.js', 'SMS Gateway', 'Tailwind CSS'],
      },
      {
        id: 'transport-logistics-systems',
        title: 'Transport & Logistics Systems',
        tagline: 'Real-time fleet tracking, cargo dispatch, route planning, and driver manifests.',
        description:
          'End-to-end logistics platforms and vehicle management systems for freight operators, delivery services, fleet companies, and transport corporations.',
        servicesIncluded: [
          'Vehicle fleet tracking, GPS device integration, and speed telemetry',
          'Cargo manifest generation, dispatch scheduling, and waybill printing',
          'Driver assignment, fuel consumption monitoring, and maintenance logs',
          'Last-mile delivery tracking with customer proof-of-delivery signatures',
          'Trip profitability calculator and automated transport billing',
        ],
        keyHighlights: ['Live map telemetry integration', 'Driver mobile view and digital signatures', 'Automated maintenance service alerts', 'Waybill barcode generation'],
        targetAudience: 'Logistics companies, freight forwarders, courier services, transport operators, and distribution fleets.',
        technologies: ['React 19', 'Node.js', 'PostgreSQL', 'WebSockets', 'Mapbox / Leaflet'],
      },
      {
        id: 'organisational-management-systems',
        title: 'Organisational Management Systems',
        tagline: 'Empower NGOs, religious institutions, associations, and clubs with structured operational software.',
        description:
          'Tailored management systems designed for non-profit foundations, international NGOs, religious bodies, and professional member associations.',
        servicesIncluded: [
          'NGO project milestone tracking, donor reporting, and grant disbursement logs',
          'Church and religious institution member records, tithe recording, and fellowship directories',
          'Association membership registration, subscription renewals, and voting portals',
          'Committee meeting minutes, resolutions repository, and event attendance',
          'Field worker reporting, offline data collection, and community surveys',
        ],
        keyHighlights: ['Auditable donor grant reporting', 'Private and secure member directories', 'SMS broadcast communication', 'Offline field surveys'],
        targetAudience: 'NGOs, charities, religious organizations, sports federations, and professional trade bodies.',
        technologies: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'PWA Offline'],
      },
      {
        id: 'custom-systems-development',
        title: 'Custom Systems Development',
        tagline: 'Engineered from first principles for non-standard, high-throughput enterprise architectures.',
        description:
          'Bespoke systems engineering designed to solve complex computational problems, integrate disparate legacy hardware, or build greenfield SaaS platforms with proprietary logic.',
        servicesIncluded: [
          'High-throughput distributed microservice architectures',
          'Custom REST and WebSocket API backbones with strict schema contracts',
          'Legacy database modernization, data sanitization, and cloud migration',
          'Custom hardware and industrial sensor IoT integration protocols',
          'Automated data pipelines and scheduled background worker queues',
        ],
        keyHighlights: ['Zero reliance on bloated third-party monoliths', 'Microsecond latency optimization', 'Full database schema documentation', 'Enterprise SLA support'],
        targetAudience: 'Enterprises requiring non-standard logic, tech startups, and organizations scaling legacy infrastructure.',
        technologies: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Drizzle ORM', 'BullMQ'],
      },
    ],
  },

  // =================================================================
  // 3. IT SUPPORT (SUPPORTING SERVICE DIVISION)
  // =================================================================
  {
    id: 'it-support',
    slug: 'it-support',
    title: 'IT Support',
    shortName: 'IT Support',
    tagline: 'Dependable hardware, networking, server maintenance, and responsive technical helpdesk services.',
    overview:
      'As a vital supporting division, our IT Support team ensures your daily technological operations run smoothly without costly downtime. We provide hands-on workstation repair, certified network installations, on-premise and cloud server maintenance, peripheral diagnostics, and round-the-clock helpdesk assistance.',
    isPrimary: false,
    priorityLabel: 'Supporting Division',
    iconName: 'Wrench',
    accentColor: '#475467',
    subcategories: [
      {
        id: 'computer-hardware-support',
        title: 'Computer & Hardware Support',
        tagline: 'Keep workstations, laptops, and enterprise hardware running at peak performance.',
        description:
          'Comprehensive hardware diagnostics, physical repair, performance upgrades, and preventative servicing for all desktop PCs, laptops, and workstation setups.',
        servicesIncluded: [
          'Workstation and laptop diagnostics, component repair, and part replacement',
          'Performance upgrades (High-speed NVMe SSD installations, RAM expansions)',
          'Thermal paste re-application, internal cooling fan cleaning, and preventative maintenance',
          'New workstation provisioning, ergonomic desk setups, and dual-monitor deployment',
          'Hardware asset tagging, lifecycle auditing, and disposal compliance',
        ],
        keyHighlights: ['Same-day on-site diagnostics', 'Genuine replacement components', 'Extended hardware lifespan', 'Preventative maintenance contracts'],
        targetAudience: 'Offices, commercial businesses, educational computer labs, and remote workers.',
        technologies: ['Dell', 'HP', 'Lenovo', 'Apple macOS', 'Crucial / Samsung SSDs'],
      },
      {
        id: 'software-os-support',
        title: 'Software & Operating System Support',
        tagline: 'Clean OS installations, legitimate software licensing, driver stability, and malware eradication.',
        description:
          'Expert operating system deployment, official enterprise software licensing, system optimization, anti-virus protection, and troubleshooting of crashing applications.',
        servicesIncluded: [
          'Clean installations of Windows 11 Pro, macOS, and Ubuntu/Debian Linux',
          'Official software licensing and activation (Microsoft 365, Adobe, AutoCAD, Accounting)',
          'Malware, ransomware, spyware, and adware identification and removal',
          'System driver updates, registry cleanup, and boot time acceleration',
          'Troubleshooting application crashes, blue screen of death (BSOD), and software conflicts',
        ],
        keyHighlights: ['Licensed and legitimate software setups', 'Zero data loss during OS reinstallations', 'Optimized boot and processing speed', 'Remote desktop quick fixes'],
        targetAudience: 'Corporate office staff, creative agencies, accountants, and retail operators.',
        technologies: ['Windows 11/10 Pro', 'macOS', 'Ubuntu Linux', 'Microsoft 365', 'Bitdefender'],
      },
      {
        id: 'network-installation-support',
        title: 'Network Installation & Support',
        tagline: 'High-speed structured cabling, enterprise Wi-Fi coverage, routers, and managed switches.',
        description:
          'Professional design, structured Cat6/Cat6A cabling, Wi-Fi access point deployment, router configuration, and bandwidth prioritization for interference-free connectivity.',
        servicesIncluded: [
          'Structured Cat6/Cat6A and optical fiber network cabling and patch panel termination',
          'Enterprise mesh Wi-Fi access point deployment for deadzone-free office coverage',
          'Managed Gigabit switch, router, and firewall gateway configuration',
          'VLAN segmentation for guest Wi-Fi, office computers, and CCTV streams',
          'Internet Service Provider (ISP) failover routing and bandwidth traffic shaping',
        ],
        keyHighlights: ['Neat, certified rack cabling', 'Seamless roaming across office Wi-Fi', 'Zero packet loss optimization', 'Bandwidth throttling for streaming/torrents'],
        targetAudience: 'Multi-room offices, schools, hotels, warehouses, commercial buildings, and retail outlets.',
        technologies: ['Ubiquiti UniFi', 'MikroTik', 'Cisco', 'TP-Link Omada', 'Cat6A Shielded'],
      },
      {
        id: 'server-infrastructure-support',
        title: 'Server & Infrastructure Support',
        tagline: 'On-premise servers, Active Directory, network storage, and server rack health.',
        description:
          'Certified server administration covering Windows Server and Linux enterprise environments, centralized user permissions, shared network drives (NAS), and uninterrupted power setups.',
        servicesIncluded: [
          'Installation and setup of Windows Server and Linux enterprise servers',
          'Active Directory (AD), Domain Controller setup, and centralized user management',
          'Network Attached Storage (NAS) setup for shared office file archives and permissions',
          'Server rack cable management, patch panel auditing, and cooling optimization',
          'Uninterruptible Power Supply (UPS) battery health checks and automatic shutdown scripting',
        ],
        keyHighlights: ['Centralized user login credentials', 'Automated nightly NAS backups', 'UPS surge and battery protection', 'Proactive server health alerts'],
        targetAudience: 'Enterprises with on-premise databases, design studios, schools, and legal firms.',
        technologies: ['Windows Server 2022', 'Ubuntu Server', 'Synology NAS', 'TrueNAS', 'APC Smart-UPS'],
      },
      {
        id: 'printer-peripheral-support',
        title: 'Printer & Peripheral Support',
        tagline: 'Network printers, multi-function copiers, thermal POS receipt printers, and scanners.',
        description:
          'Configuration, network sharing, driver installation, and maintenance for office heavy-duty printers, multifunction copiers, thermal barcode units, and biometric timeclocks.',
        servicesIncluded: [
          'Office network printer setup and multi-computer driver distribution',
          'High-volume multifunction copier maintenance and scan-to-email/folder setup',
          'Thermal POS receipt printer and kitchen printer configuration',
          'Barcode scanner, magnetic card reader, and label printer diagnostics',
          'Clearing print spooler queues, paper jam troubleshooting, and roller servicing',
        ],
        keyHighlights: ['Scan-to-computer configuration', 'Shared network printing for all employees', 'Thermal receipt calibration', 'Rapid hardware unjamming'],
        targetAudience: 'Office administration, retail stores, supermarkets, clinics, and hospitality desks.',
        technologies: ['Kyocera', 'HP LaserJet', 'Epson POS', 'Canon', 'Zebra Barcode'],
      },
      {
        id: 'security-surveillance-support',
        title: 'Security & Surveillance Support',
        tagline: 'IP CCTV cameras, digital video recorders (NVR/DVR), biometric access control, and remote phone viewing.',
        description:
          'End-to-end security infrastructure including high-definition IP security cameras, night vision surveillance, remote smartphone monitoring, and magnetic door access control.',
        servicesIncluded: [
          'High-definition IP and analog CCTV camera installation with infrared night vision',
          'Network Video Recorder (NVR/DVR) setup, hard drive recording, and motion alert tuning',
          'Remote smartphone live viewing and playback configuration across mobile networks',
          'Biometric fingerprint and RFID keycard door access control systems',
          'Emergency panic button and intrusion alarm sensor testing',
        ],
        keyHighlights: ['24/7 crystal-clear recording', 'Live phone streaming from anywhere in the world', 'Tamper-proof storage vaults', 'Employee access audit trails'],
        targetAudience: 'Business premises, warehouses, retail shops, apartment buildings, and private estates.',
        technologies: ['Hikvision', 'Dahua', 'ZKTeco Biometrics', 'Seagate SkyHawk Surveillance HDDs'],
      },
      {
        id: 'data-technical-support',
        title: 'Data & Technical Support',
        tagline: 'Emergency data recovery, scheduled off-site backups, and dedicated SLA helpdesk assistance.',
        description:
          'Critical safety nets for your business data and daily technical workflow. From recovering files from formatted drives to automated cloud backups and phone/remote desktop helpdesk.',
        servicesIncluded: [
          'Emergency data recovery from corrupted hard drives, memory cards, and USBs',
          'Automated, encrypted daily backups to secure offsite cloud storage',
          'Rapid remote desktop support for immediate troubleshooting without waiting for visits',
          'New employee IT onboarding checklists, email provisioning, and security briefings',
          'Custom Service Level Agreements (SLAs) for monthly dedicated IT support',
        ],
        keyHighlights: ['Prompt remote assistance within minutes', 'Encrypted off-site disaster backups', 'Zero-data-loss guarantee protocols', 'Fixed monthly support plans'],
        targetAudience: 'Organizations seeking an outsourced IT department without full-time employee overhead.',
        technologies: ['AnyDesk / TeamViewer', 'Veeam Backup', 'Google Cloud Storage', 'R-Studio Recovery'],
      },
    ],
  },

  // =================================================================
  // 4. IT SOLUTIONS (SUPPORTING SERVICE DIVISION)
  // =================================================================
  {
    id: 'it-solutions',
    slug: 'it-solutions',
    title: 'IT Solutions',
    shortName: 'IT Solutions',
    tagline: 'Strategic cloud architecture, cybersecurity defense, automation, and enterprise digital solutions.',
    overview:
      'Our IT Solutions division provides forward-looking technological advantages for modern organizations. From corporate domain hosting and enterprise cloud engineering to automated AI workflows, cybersecurity hardening, and national compliance portal guidance (KRA, eCitizen), we build the digital infrastructure your business needs to excel.',
    isPrimary: false,
    priorityLabel: 'Supporting Division',
    iconName: 'Sparkles',
    accentColor: '#FF914D',
    subcategories: [
      {
        id: 'domain-hosting-email-solutions',
        title: 'Domain, Hosting & Email Solutions',
        tagline: 'Reliable domain registrations (.com, .co.ke, .org), NVMe cloud hosting, and branded business emails.',
        description:
          'Secure digital foundations for your enterprise brand. We handle DNS record architecture, SSL certificates, enterprise web hosting with 99.9% uptime, and professional corporate email accounts.',
        servicesIncluded: [
          'Domain registration, renewal, and DNS zone record configuration (.com, .co.ke, .org, .net)',
          'High-speed NVMe SSD cPanel and cloud hosting with automated daily backups',
          'Professional corporate email setup (info@yourcompany.com) on Google Workspace or Outlook',
          'Complimentary Wildcard SSL encryption certificates and HTTPS enforcement',
          'Spam assassin filtering, SPF, DKIM, and DMARC email deliverability verification',
        ],
        keyHighlights: ['100% email inbox delivery (no spam folder)', '99.9% verified uptime', 'Instant local domain registration (.co.ke)', 'Free migration from old hosts'],
        targetAudience: 'New businesses, expanding enterprises, brands upgrading from generic Gmail/Yahoo addresses.',
        technologies: ['Google Workspace', 'Microsoft 365 Exchange', 'Cloudflare DNS', 'cPanel / WHM', 'Let’s Encrypt'],
      },
      {
        id: 'cloud-computing-solutions',
        title: 'Cloud Computing Solutions',
        tagline: 'Google Cloud, AWS, and Azure architectures, containerization, and automated scaling.',
        description:
          'Transition your infrastructure to the modern cloud. We architect scalable, secure, and cost-effective cloud deployments that scale up under traffic spikes and scale down during off-hours.',
        servicesIncluded: [
          'Cloud infrastructure deployment on Google Cloud Platform (GCP), AWS, and Microsoft Azure',
          'Docker containerization and container orchestration for seamless portability',
          'Managed cloud SQL database setup (PostgreSQL, MySQL) with automated failover replication',
          'Cloud migration strategy: Transitioning on-premise legacy servers to secure cloud instances',
          'Continuous Integration & Continuous Deployment (CI/CD) pipelines for one-click releases',
        ],
        keyHighlights: ['Scale-to-zero cost efficiency', 'Zero-downtime rolling updates', 'Automated database snapshots', 'Global low-latency CDN routing'],
        targetAudience: 'Software startups, digital enterprises, and organizations modernizing legacy hardware.',
        technologies: ['Google Cloud (Cloud Run / Cloud SQL)', 'AWS (EC2, S3, RDS)', 'Docker', 'GitHub Actions', 'Terraform'],
      },
      {
        id: 'cybersecurity-solutions',
        title: 'Cybersecurity Solutions',
        tagline: 'Defend your assets with vulnerability audits, firewall hardening, and zero-trust policies.',
        description:
          'Comprehensive digital protection safeguarding customer data, company communications, and online portals against unauthorized access, ransomware, and automated web scanners.',
        servicesIncluded: [
          'Vulnerability assessment and systematic penetration testing of web apps and networks',
          'Next-generation web application firewall (WAF) setup and DDoS mitigation',
          'Multi-Factor Authentication (MFA) enforcement across all corporate accounts',
          'Employee cybersecurity awareness training and simulated phishing campaigns',
          'Security policy formulation, data encryption at rest and in transit, and audit documentation',
        ],
        keyHighlights: ['Tamper-proof audit logs', 'Automated intrusion blocking', 'Compliance with Data Protection Act', 'Real-time threat alerts'],
        targetAudience: 'Financial services, legal chambers, e-commerce stores, healthcare facilities, and corporations.',
        technologies: ['Cloudflare WAF', 'Sentinel Guard', 'OpenSSL', 'Fail2ban', 'Nessus'],
      },
      {
        id: 'digital-integration-solutions',
        title: 'Digital Integration Solutions',
        tagline: 'Connect disparate software systems via robust APIs, webhooks, and automated data bridges.',
        description:
          'Eliminate manual data re-entry between disconnected software platforms. We integrate custom web applications with payment gateways, SMS broadcasters, CRM databases, and accounting software.',
        servicesIncluded: [
          'M-Pesa Daraja API integration (C2B, B2C, B2B, STK Push, and automated balance checks)',
          'Bulk SMS gateway integration for automated alerts, OTP verification, and marketing',
          'Payment gateway integrations with Stripe, PayPal, Pesapal, and Flutterwave',
          'Biometric hardware data synchronization with centralized HR and payroll databases',
          'Custom webhook engineering and third-party SaaS connector development',
        ],
        keyHighlights: ['Instant payment reconciliation', 'Real-time two-way synchronization', 'Fail-safe retry mechanisms', 'Detailed API audit logs'],
        targetAudience: 'E-commerce stores, subscription portals, logistics operators, and service businesses.',
        technologies: ['M-Pesa Daraja', 'Twilio / Africa’s Talking SMS', 'Stripe API', 'RESTful Webhooks'],
      },
      {
        id: 'automation-ai-solutions',
        title: 'Automation & AI Solutions',
        tagline: 'Automate repetitive workflows, parse unstructured documents, and deploy smart chatbots.',
        description:
          'Harness modern automation and applied AI to eliminate tedious manual overhead, respond to customer inquiries 24/7, and generate business intelligence reports automatically.',
        servicesIncluded: [
          'Smart customer support chatbots integrated into websites and WhatsApp channels',
          'Automated invoice generation, PDF parsing, and optical character recognition (OCR)',
          'Automated business workflow pipelines (triggering email, SMS, and database updates)',
          'Automated daily and weekly sales report generation dispatched to executive inboxes',
          'Custom algorithmic data matching and smart search tools',
        ],
        keyHighlights: ['24/7 automated customer responses', 'Drastic reduction in manual paperwork', 'Zero human data entry errors', 'Fast operational throughput'],
        targetAudience: 'Customer-facing companies, distribution businesses, finance departments, and logistics firms.',
        technologies: ['OpenAI / Gemini SDK', 'Node.js', 'WhatsApp Business API', 'Python / Tesseract OCR'],
      },
      {
        id: 'data-business-intelligence-solutions',
        title: 'Data & Business Intelligence Solutions',
        tagline: 'Transform raw operational data into visual dashboards and actionable strategic insights.',
        description:
          'Uncover growth opportunities and bottlenecks in your business. We consolidate data from multiple databases, spreadsheets, and POS systems into clear executive dashboards.',
        servicesIncluded: [
          'Interactive executive business dashboards with live KPI tracking',
          'Data warehouse modeling and consolidation of multi-branch records',
          'Automated sales trend analysis, product affinity insights, and seasonal forecasting',
          'Customer churn prediction and retention analytics',
          'Scheduled automated PDF and Excel analytics reporting for board meetings',
        ],
        keyHighlights: ['Intuitive visual charts and graphs', 'Single source of business truth', 'Faster executive decision making', 'Automated data exports'],
        targetAudience: 'Business executives, directors, sales managers, and multi-branch retailers.',
        technologies: ['PostgreSQL', 'Chart.js / Recharts', 'Google Looker Studio', 'Node.js'],
      },
      {
        id: 'business-it-consultancy',
        title: 'Business & IT Consultancy',
        tagline: 'Expert guidance on digital transformation, technology procurement, and technical architecture.',
        description:
          'Strategic advisory services ensuring your technology budget is invested with precision. We evaluate software proposals, conduct tech audits, and map multi-year digital transformation roadmaps.',
        servicesIncluded: [
          'Digital transformation roadmaps and technology modernization strategy',
          'Independent software and vendor proposal evaluation (preventing overcharging and tech debt)',
          'IT infrastructure health audits and scalability readiness assessments',
          'Formulation of corporate IT acceptable-use policies and disaster recovery protocols',
          'Executive tech consulting and advisory for tenders and grant proposals',
        ],
        keyHighlights: ['Unbiased expert technical advice', 'Prevents costly vendor lock-in', 'Measurable ROI on tech investments', 'Clear executive-level roadmaps'],
        targetAudience: 'CEOs, boards of directors, business owners, and organizations planning digital overhaul.',
        technologies: ['Enterprise Architecture Frameworks', 'ITIL Best Practices', 'Security Standards'],
      },
      {
        id: 'additional-digital-solutions',
        title: 'Additional Digital Solutions',
        tagline: 'Comprehensive assistance with essential public, tax, and institutional e-government portals.',
        description:
          'Practical, verified digital solutions assisting enterprises, institutions, and individuals with national digital compliance portals, tax filing systems, and regulatory submissions.',
        servicesIncluded: [
          'KRA iTax solutions: PIN registration, tax compliance certificates (TCC), and return filing guidance',
          'eCitizen portal services: Business name searches, company registrations, and official renewals',
          'NTSA TIMS / Transport portal assistance: Vehicle transfer documentation and driving license renewals',
          'HELB and university education portal loan clearance and student account reconciliation',
          'Custom digital form drafting, PDF documentation conversions, and regulatory compliance kits',
        ],
        keyHighlights: ['Fast, error-free portal navigation', '100% compliant documentation', 'Guided step-by-step assistance', 'Secure handling of sensitive paperwork'],
        targetAudience: 'Local businesses, international investors registering in Kenya, students, and citizens.',
        technologies: ['KRA iTax', 'eCitizen', 'NTSA', 'HELB', 'Government Portals'],
      },
    ],
  },
];

// Helper functions for search & queries
export function searchCatalogue(query: string): { category: CatalogueCategory; subcategory: CatalogueSubcategory; matchSnippet: string }[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  const results: { category: CatalogueCategory; subcategory: CatalogueSubcategory; matchSnippet: string }[] = [];

  for (const cat of OFFICIAL_SERVICE_CATALOGUE) {
    for (const sub of cat.subcategories) {
      let matched = false;
      let snippet = '';

      if (sub.title.toLowerCase().includes(cleanQuery)) {
        matched = true;
        snippet = `Matches title: "${sub.title}"`;
      } else if (sub.description.toLowerCase().includes(cleanQuery)) {
        matched = true;
        snippet = sub.description;
      } else if (sub.tagline.toLowerCase().includes(cleanQuery)) {
        matched = true;
        snippet = sub.tagline;
      } else {
        const foundService = sub.servicesIncluded.find((s) => s.toLowerCase().includes(cleanQuery));
        if (foundService) {
          matched = true;
          snippet = `Includes: "${foundService}"`;
        } else {
          const foundTech = sub.technologies.find((t) => t.toLowerCase().includes(cleanQuery));
          if (foundTech) {
            matched = true;
            snippet = `Technology: ${foundTech}`;
          }
        }
      }

      if (matched) {
        results.push({
          category: cat,
          subcategory: sub,
          matchSnippet: snippet,
        });
      }
    }
  }

  return results;
}

export function getCategoryById(id: string): CatalogueCategory | undefined {
  return OFFICIAL_SERVICE_CATALOGUE.find((c) => c.id === id || c.slug === id);
}

export function getTotalSubcategoriesCount(): number {
  return OFFICIAL_SERVICE_CATALOGUE.reduce((acc, cat) => acc + cat.subcategories.length, 0);
}
