import { db, pool, isPostgresConfigured } from './index.ts';
import {
  siteSettings,
  aboutContent,
  services,
  webProjects,
  graphicProjects,
  testimonials,
  founders,
  inquiries,
  contactSettings,
  locationSettings,
  socialLinks,
  seoSettings,
  mediaFiles,
  mediaBlobs,
  activityLogs,
} from './schema.ts';
import { eq, desc, asc } from 'drizzle-orm';
import {
  PublicSiteData,
  AdminDashboardStats,
  Inquiry,
  MediaItem,
  ServiceItem,
  WebProject,
  GraphicProject,
  Testimonial,
  Founder,
  SocialLink,
  SiteSettings,
  AboutContent,
  ContactSettings,
  LocationSettings,
  SEOSettings,
  ActivityLog,
  SecurityStats,
  VisitorStats,
  VisitorBreakdownItem,
} from '../types';


export const initialSiteSettings: SiteSettings = {
  id: 'main',
  siteName: 'JD Fusion Technologies',
  brandName: 'JD Fusion Technologies',
  tagline: 'Where Ideas Become Innovation.',
  logoUrl: '/logo.svg',
  iconUrl: '/logo-icon.svg',
  heroHeadline: 'Building Digital Experiences. Creating Powerful Systems.',
  heroSubheadline:
    'Engineering-first technology solutions. We build scalable corporate websites, mission-critical systems, dependable IT support networks, and strategic IT solutions tailored for modern organizations.',
  heroBadgeText: 'Where Ideas Become Innovation.',
  primaryCtaText: 'Explore Our Services',
  secondaryCtaText: 'Contact Us',
  updatedAt: new Date().toISOString(),
};

export const initialAboutContent: AboutContent = {
  id: 'main',
  title: 'Where Ideas Become Innovation',
  intro:
    'JD Fusion Technologies is an engineering-driven technology company specialising primarily in Website Development and Systems Development, reinforced by dependable IT Support and strategic IT Solutions.',
  bio:
    'Founded to deliver uncompromising technical rigor and purposeful digital design, JD Fusion Technologies engineers mission-critical software, enterprise management platforms, and robust digital infrastructure for ambitious businesses and institutions.',
  mission:
    'To build scalable, resilient, and intuitive technology solutions that empower enterprises to operate with speed, agility, and absolute reliability.',
  vision:
    'To be the most trusted, transformative technology partner recognized for engineering excellence and genuine client success.',
  approach:
    'We reject generic templates and brittle shortcuts. Every system, website, and network architecture is engineered with clean code, modern standards, and direct founder accountability.',
  highlights: [
    'Modern TypeScript, React 19, and robust relational backbones',
    'Custom business ERPs, HMS, SMS, and operational systems',
    'Structured network cabling, managed servers, and hardware diagnostics',
    'Zero-trust cybersecurity, NVMe cloud hosting, and automation',
  ],
  updatedAt: new Date().toISOString(),
};

export const initialServices: Omit<ServiceItem, 'updatedAt' | 'createdAt'>[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    category: 'web',
    iconName: 'Globe',
    shortDescription: 'High-performance, bespoke corporate websites, e-commerce stores, portals, and custom web applications.',
    fullDescription:
      'We architect modern, lightning-fast digital storefronts, corporate portals, and customized web platforms engineered with React 19, Next.js, TypeScript, and responsive modern architecture.',
    features: [
      'Business & Corporate Websites (Enterprises, SMEs, Startups)',
      'E-Commerce & Online Marketplaces (Payment Gateways, Product Catalogs)',
      'Personal, Portfolio & Professional Showcase Websites',
      'Educational, Media & Publishing Websites',
      'Booking, Reservation & Community Platforms',
      'Custom Web Applications, Single Page Apps & PWAs',
    ],
    displayOrder: 1,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: 'systems-development',
    title: 'Systems Development',
    category: 'systems',
    iconName: 'Cpu',
    shortDescription: 'Scalable, fault-tolerant enterprise software systems, management platforms & database backbones.',
    fullDescription:
      'Mission-critical operational software: ERPs, hospital HMS, school SMS, finance & accounting ledgers, POS inventory, and custom database backbones built for scale and data integrity.',
    features: [
      'Business & Enterprise Systems (Custom ERPs, CRM Platforms)',
      'Education Management Systems (SMS, SIS, Grading & Portals)',
      'Healthcare Management Systems (HMS, EMR, Clinic & Pharmacy)',
      'Finance & Accounting Systems (Invoicing, Auditing, Multi-currency)',
      'Retail & Inventory Systems (Multi-Branch POS, Warehouse Management)',
      'Human Resource, Property, Hospitality & Logistics Systems',
      'Custom Software Architecture & Relational PostgreSQL Systems',
    ],
    displayOrder: 2,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: 'it-support',
    title: 'IT Support',
    category: 'support',
    iconName: 'Wrench',
    shortDescription: 'Dependable computer hardware diagnostics, structured Cat6 network cabling, servers, and helpdesk SLAs.',
    fullDescription:
      'Our supporting IT Support division provides computer and hardware repairs, operating system licensing, Cat6/fiber cabling, server maintenance, CCTV surveillance, and dedicated helpdesks.',
    features: [
      'Computer & Hardware Diagnostics, Repairs & Component Upgrades',
      'Software & OS Installation, Licensing & Optimization',
      'Structured Cat6 Network Installation, Routers & Wi-Fi Access Points',
      'Server & IT Infrastructure Setup, Virtualization & Active Directory',
      'Printer, Scanner & Peripheral Networking',
      'Security, CCTV Surveillance & Biometric Access Systems',
      'Data Backup, Emergency Recovery & Preventive Maintenance Contracts',
    ],
    displayOrder: 3,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: 'it-solutions',
    title: 'IT Solutions',
    category: 'cyber',
    iconName: 'Sparkles',
    shortDescription: 'Strategic cloud architecture, cybersecurity defense, workflow automation, and enterprise digital solutions.',
    fullDescription:
      'Our supporting IT Solutions division provides domain & NVMe hosting, cloud computing (GCP/AWS), zero-trust cybersecurity, workflow automation, and e-government portal guidance (KRA, eCitizen).',
    features: [
      'Domain Registration, High-Speed NVMe Hosting & Branded Email',
      'Cloud Computing Solutions (GCP, AWS, Azure, Cloud Migration)',
      'Cybersecurity Solutions (Penetration Testing, Sentinel Threat Defense)',
      'Digital Integration, Payment Gateways & API Middleware',
      'Automation & AI Solutions (Robotic Workflows, Chatbots, Smart Tools)',
      'Data & Business Intelligence (Power BI, PostgreSQL Analytics)',
      'Business & IT Consultancy (Technology Audits, Vendor Procurement)',
      'Additional Digital Solutions (KRA iTax, eCitizen, HELB & KUCCPS Portals)',
    ],
    displayOrder: 4,
    isPublished: true,
    isFeatured: true,
  },
];

export const initialWebProjects: Omit<WebProject, 'updatedAt' | 'createdAt'>[] = [
  {
    id: 'enterprise-pos-inventory',
    title: 'Enterprise Multi-Branch Inventory & POS System',
    category: 'Systems Development',
    description:
      'Distributed inventory tracking, multi-warehouse synchronization, and high-speed point-of-sale terminal engine built for retail and supply chain operations.',
    mainImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    projectUrl: '',
    githubUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'apex-logistics-portal',
    title: 'Apex Freight & Logistics Digital Web Portal',
    category: 'Website Development',
    description:
      'Responsive corporate portal and consignment tracking interface with dynamic client quote calculation and document generation.',
    mainImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    ],
    technologies: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    projectUrl: '',
    githubUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'clinic-patient-hms',
    title: 'Unified Clinic & Patient Records System (HMS)',
    category: 'Systems Development',
    description:
      'HIPAA-aligned electronic medical records management system with role-based access for triage, doctors, laboratory, and pharmacy dispensing.',
    mainImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    ],
    technologies: ['TypeScript', 'Express', 'PostgreSQL', 'Drizzle ORM'],
    projectUrl: '',
    githubUrl: null,
    displayOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'cloud-devops-sentinel',
    title: 'Cloud DevOps & Sentinel Security Defense Suite',
    category: 'IT Solutions',
    description:
      'Zero-trust perimeter architecture, automated continuous deployment pipelines, and edge intrusion interception for enterprise server deployments.',
    mainImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    additionalImages: [],
    technologies: ['Docker', 'Linux', 'Cloud SQL', 'CI/CD Pipelines'],
    projectUrl: '',
    githubUrl: null,
    displayOrder: 4,
    isFeatured: true,
    isPublished: true,
  },
];

export const initialGraphicProjects: Omit<GraphicProject, 'updatedAt' | 'createdAt'>[] = [];

export const initialTestimonials: Omit<Testimonial, 'updatedAt' | 'createdAt'>[] = [
  {
    id: 'test-1',
    clientName: 'David K. Omondi',
    clientCompany: 'Nexura Logistics Ltd',
    clientRole: 'Managing Director',
    message: 'JD Fusion Technologies delivered our cloud fleet system ahead of schedule. The UI is exceptionally fast, easy for our drivers and dispatchers to use, and our operational turnaround improved by 40%.',
    clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'test-2',
    clientName: 'Grace Wangari',
    clientCompany: 'Aura Artisan Coffee',
    clientRole: 'Founder & CEO',
    message: 'The brand identity and e-commerce platform built by JD Fusion Technologies gave our company immediate credibility. Their attention to detail in visual design and M-Pesa checkout flow is world-class.',
    clientImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    displayOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'test-3',
    clientName: 'Brian Mutua',
    clientCompany: 'Solaria Energy Kenya',
    clientRole: 'Head of Brand Marketing',
    message: 'Working with JD Fusion Technologies was effortless. They listened to our vision and translated it into a cohesive visual brand that stands out across East Africa. Highly recommended!',
    clientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    displayOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'test-4',
    clientName: 'Mercy Achieng',
    clientCompany: 'Equator Health Group',
    clientRole: 'Operations Director',
    message: 'Their systems engineering transformed our patient record workflows and staff scheduling. The platform is responsive, rock-solid, and backed by prompt technical support.',
    clientImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    displayOrder: 4,
    isFeatured: true,
    isPublished: true,
  },
];

export const initialFounders: Founder[] = [
  {
    id: 'founder-diffan-mugwira',
    name: 'Diffan Mugwira',
    role: 'Founder',
    bio: 'Leading corporate strategy, digital scalability, and technical partnerships at JD Fusion Technologies. Diffan brings extensive expertise in deploying modern enterprise infrastructure, scalable digital platforms, and delivering mission-critical tech solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=85',
    linkedInUrl: 'https://linkedin.com/company/jdfusiontech',
    twitterUrl: 'https://twitter.com/jdfusiontech',
    githubUrl: 'https://github.com/jdfusion-technologies',
    email: 'diffan@jdfusiontech.com',
    specialties: ['Corporate Strategy', 'Enterprise Systems', 'Digital Transformation', 'Strategic Partnerships'],
    quote: 'We build digital technology that empowers enterprises to operate with speed, agility, and uncompromising resilience.',
    displayOrder: 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'founder-joshua-mwenda',
    name: 'Joshua Mwenda',
    role: 'Founder',
    bio: 'Pioneering the creative and technical vision of JD Fusion Technologies. With deep expertise in digital product architecture, brand design systems, and client growth engineering, Joshua bridges cutting-edge aesthetics with high-performance business solutions across East Africa and globally.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=85',
    linkedInUrl: 'https://linkedin.com/company/jdfusiontech',
    twitterUrl: 'https://twitter.com/jdfusiontech',
    githubUrl: 'https://github.com/jdfusion-technologies',
    email: 'joshua@jdfusiontech.com',
    specialties: ['Brand Identity & Systems', 'UI/UX Architecture', 'Enterprise Digital Strategy', 'Client Growth Engineering'],
    quote: 'Great technology without impeccable design is invisible; great design without technical horsepower is fragile. At JD Fusion, we fuse both.',
    displayOrder: 2,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'founder-gladies-kende',
    name: 'Gladies Kende',
    role: 'Co-Founder',
    bio: 'Directing organizational operations, client engagement, and digital project execution at JD Fusion Technologies. Gladies ensures high-precision delivery, seamless client workflows, and client success across all web and digital initiatives.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=85',
    linkedInUrl: 'https://linkedin.com/company/jdfusiontech',
    twitterUrl: 'https://twitter.com/jdfusiontech',
    githubUrl: 'https://github.com/jdfusion-technologies',
    email: 'gladies@jdfusiontech.com',
    specialties: ['Operations Management', 'Client Solutions', 'Project Orchestration', 'Quality Assurance'],
    quote: 'Our focus is excellence in delivery—translating complex organizational needs into reliable, intuitive, and secure digital realities.',
    displayOrder: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


export const initialContactSettings: ContactSettings = {
  id: 'main',
  email: 'info@jdfusiontech.com',
  phone: '+254 700 000 000',
  whatsapp: '+254700000000',
  description:
    'Reach out to our team directly for customized project estimates, design inquiries, or e-government portal guidance.',
  businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM (EAT)',
  updatedAt: new Date().toISOString(),
};

export const initialLocationSettings: LocationSettings = {
  id: 'main',
  locationName: 'JD Fusion Technologies Hub',
  address: 'Commercial Business Centre, Suite 4B, Nairobi / Meru, Kenya',
  mapLink: 'https://maps.google.com/?q=Nairobi+Kenya',
  coordinates: '-1.286389, 36.817223',
  description:
    'Visit our physical office for in-person consultations, technical strategy sessions, and on-site cyber services.',
  updatedAt: new Date().toISOString(),
};

export const initialSocialLinks: Omit<SocialLink, 'updatedAt'>[] = [
  {
    id: 'facebook',
    platform: 'facebook',
    platformName: 'Facebook',
    url: 'https://facebook.com/jdfusiontech',
    icon: 'Facebook',
    displayOrder: 1,
    isPublished: true,
    isEnabled: true,
  },
  {
    id: 'linkedin',
    platform: 'linkedin',
    platformName: 'LinkedIn',
    url: 'https://linkedin.com/company/jd-fusion-technologies',
    icon: 'Linkedin',
    displayOrder: 2,
    isPublished: true,
    isEnabled: true,
  },
  {
    id: 'whatsapp',
    platform: 'whatsapp',
    platformName: 'WhatsApp',
    url: 'https://wa.me/254700000000?text=Hello%20JD%20Fusion%20Technologies%2C%20I%20would%20like%20to%20discuss%20a%20project.',
    icon: 'MessageCircle',
    displayOrder: 3,
    isPublished: true,
    isEnabled: true,
  },
];

export const initialSEOSettings: SEOSettings = {
  id: 'main',
  siteTitle: 'JD Fusion Technologies | Web Development, Graphic Design & Cyber Services',
  metaDescription:
    'JD Fusion Technologies provides premium full-stack web development, custom graphic design and branding, and e-government cyber services (KRA, HELB, eCitizen). Contact us today for tailored digital solutions.',
  ogImageUrl: '/logo.svg',
  keywords:
    'JD Fusion Technologies, Web Development Kenya, Graphic Design, Brand Identity, Cyber Services, KRA Returns, HELB Student Loans, eCitizen, Full-Stack Developer, Nairobi Tech Hub',
  canonicalUrl: 'https://jdfusiontech.com',
  robotsDirective: 'index, follow',
  updatedAt: new Date().toISOString(),
};

// Database Service with automatic seeding and error sanitization
export class PostgresStore {
  private static instance: PostgresStore;
  private isInitialized = false;
  private isDbOnline = isPostgresConfigured;
  private cachedPublicData: PublicSiteData | null = null;
  private cachedTimestamp: number = 0;
  private readonly CACHE_TTL_MS = 1000; // Keep cross-instance public content freshness within one second.

  private memorySiteSettings: SiteSettings = { ...initialSiteSettings };
  private memoryAboutContent: AboutContent = { ...initialAboutContent };
  private memoryContactSettings: ContactSettings = { ...initialContactSettings };
  private memoryLocationSettings: LocationSettings = { ...initialLocationSettings };
  private memorySEOSettings: SEOSettings = { ...initialSEOSettings };
  private memoryServices: ServiceItem[] = initialServices.map((s) => ({
    ...s,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  private memoryWebProjects: WebProject[] = initialWebProjects.map((p) => ({
    ...p,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  private memoryGraphicProjects: GraphicProject[] = initialGraphicProjects.map((g) => ({
    ...g,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  private memoryTestimonials: Testimonial[] = initialTestimonials.map((t) => ({
    ...t,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  private memoryFounders: Founder[] = initialFounders.map((f) => ({
    ...f,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  private memorySocialLinks: SocialLink[] = initialSocialLinks.map((sl) => ({
    ...sl,
    updatedAt: new Date().toISOString(),
  }));
  private memoryInquiries: Inquiry[] = [];

  private memoryActivityLogs: ActivityLog[] = [
    {
      id: 'log-baseline-init',
      type: 'admin_action',
      title: 'JD Fusion Security Sentinel Activated',
      description: 'Zero-trust perimeter protection, brute-force rate limiter, and injection firewalls initialized.',
      severity: 'info',
      ip: '127.0.0.1',
      userAgent: 'JD Fusion Security Engine/v2.0 (Ubuntu x86_64)',
      location: 'Nairobi, Kenya',
      path: '/api/security/engine',
      timestamp: new Date().toISOString(),
    },
  ];

  private constructor() {}

  public static getInstance(): PostgresStore {
    if (!PostgresStore.instance) {
      PostgresStore.instance = new PostgresStore();
    }
    return PostgresStore.instance;
  }

  public invalidateCache(): void {
    this.cachedPublicData = null;
    this.cachedTimestamp = 0;
  }

  private getCompiledMemoryPublicData(): PublicSiteData {
    return {
      settings: { ...this.memorySiteSettings },
      about: { ...this.memoryAboutContent },
      services: this.memoryServices.filter((s) => s.isPublished).map((s) => ({ ...s })),
      webProjects: this.memoryWebProjects.filter((p) => p.isPublished).map((p) => ({ ...p })),
      graphicProjects: this.memoryGraphicProjects.filter((g) => g.isPublished).map((g) => ({ ...g })),
      testimonials: this.memoryTestimonials.filter((t) => t.isPublished).map((t) => ({ ...t })),
      founders: this.memoryFounders.filter((f) => f.isPublished).map((f) => ({ ...f })),
      contact: { ...this.memoryContactSettings },
      location: { ...this.memoryLocationSettings },
      socials: this.memorySocialLinks
        .filter((s) => s.isPublished !== false && s.isEnabled !== false)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((s) => ({ ...s })),
      seo: { ...this.memorySEOSettings },
    };
  }

  private async requireDatabase(): Promise<void> {
    await this.initSeedIfNeeded();
    if (!this.isDbOnline) {
      throw new Error('The database is unavailable. No persistent change was confirmed; please try again.');
    }
  }

  public async ensureTablesExist(): Promise<void> {
    if (!isPostgresConfigured) throw new Error('DATABASE_URL or POSTGRES_URL is required for persistent database storage.');

    const expectedColumns: Record<string, string[]> = {
      users: ['id','uid','email','name','role','created_at','updated_at','last_login_at'],
      site_settings: ['id','site_name','brand_name','tagline','logo_url','icon_url','hero_headline','hero_subheadline','hero_badge_text','primary_cta_text','secondary_cta_text','updated_at'],
      about_content: ['id','title','intro','bio','mission','vision','approach','highlights','updated_at'],
      services: ['id','title','category','icon_name','short_description','full_description','features','display_order','is_published','is_featured','created_at','updated_at'],
      web_projects: ['id','title','category','description','main_image','additional_images','technologies','project_url','github_url','display_order','is_featured','is_published','created_at','updated_at'],
      graphic_projects: ['id','title','category','description','main_image','gallery_images','tags','display_order','is_featured','is_published','created_at','updated_at'],
      testimonials: ['id','client_name','client_company','client_role','message','client_image','rating','display_order','is_featured','is_published','created_at','updated_at'],
      founders: ['id','name','role','bio','image_url','linkedin_url','twitter_url','github_url','email','specialties','quote','display_order','is_published','created_at','updated_at'],
      inquiries: ['id','name','email','phone','service','description','preferred_contact','status','created_at','updated_at'],
      contact_settings: ['id','email','phone','whatsapp','description','business_hours','updated_at'],
      location_settings: ['id','location_name','address','map_link','coordinates','description','updated_at'],
      social_links: ['id','platform','platform_name','url','icon','display_order','is_published','updated_at'],
      media_files: ['id','filename','original_name','mime_type','size','url','provider','created_at'],
      media_blobs: ['id','data','mime_type','created_at'],
      seo_settings: ['id','site_title','meta_description','og_image_url','keywords','canonical_url','robots_directive','updated_at'],
      activity_logs: ['id','type','title','description','severity','ip','user_agent','location','path','metadata','created_at'],
      visitor_visits: ['id','ip','path','user_agent','referrer','device_type','visited_at'],
      visitor_daily_rollups: ['id','date_key','total_visits','unique_visitors','top_path','updated_at'],
    };

    const tableNames = Object.keys(expectedColumns);
    const result = await pool.query(
      `SELECT table_name, column_name
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [tableNames]
    );
    const actual = new Map<string, Set<string>>();
    for (const row of result.rows as Array<{ table_name: string; column_name: string }>) {
      if (!actual.has(row.table_name)) actual.set(row.table_name, new Set());
      actual.get(row.table_name)!.add(row.column_name);
    }

    const problems: string[] = [];
    for (const [table, columns] of Object.entries(expectedColumns)) {
      const found = actual.get(table);
      if (!found) {
        problems.push(`missing table ${table}`);
        continue;
      }
      const missingColumns = columns.filter((column) => !found.has(column));
      if (missingColumns.length) problems.push(`${table}: missing columns ${missingColumns.join(', ')}`);
    }
    if (problems.length) {
      throw new Error(`Database schema is incomplete or incompatible: ${problems.join('; ')}. No automatic schema changes were made.`);
    }
  }

  public async initSeedIfNeeded(): Promise<void> {
    if (this.isInitialized) return;
    if (!isPostgresConfigured) {
      this.isDbOnline = false;
      this.isInitialized = true;
      return;
    }
    try {
      await this.ensureTablesExist();
      // Check if site_settings has row
      const existingSettings = await db.select().from(siteSettings).where(eq(siteSettings.id, 'main'));
      if (existingSettings.length === 0) {
        console.log('[PostgresStore] Seeding initial data into PostgreSQL...');
        await this.seedAll();
      }
      this.isDbOnline = true;
      this.isInitialized = true;
    } catch (err: any) {
      this.isDbOnline = false;
      this.isInitialized = false;
      console.warn('[PostgresStore] Database connection failed; a later request will retry:', err?.message || err);
    }
  }

  public async seedAll(): Promise<void> {
    try {
      // 1. Settings
      await db.insert(siteSettings).values({
        ...initialSiteSettings,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 2. About
      await db.insert(aboutContent).values({
        ...initialAboutContent,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 3. Contact
      await db.insert(contactSettings).values({
        ...initialContactSettings,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 4. Location
      await db.insert(locationSettings).values({
        ...initialLocationSettings,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 5. SEO
      await db.insert(seoSettings).values({
        ...initialSEOSettings,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 6. Services
      for (const s of initialServices) {
        await db.insert(services).values({
          ...s,
          features: s.features,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 7. Web Projects
      for (const p of initialWebProjects) {
        await db.insert(webProjects).values({
          ...p,
          additionalImages: p.additionalImages,
          technologies: p.technologies,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 8. Graphic Projects
      for (const g of initialGraphicProjects) {
        await db.insert(graphicProjects).values({
          ...g,
          galleryImages: g.galleryImages,
          tags: g.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 9. Testimonials
      for (const t of initialTestimonials) {
        await db.insert(testimonials).values({
          ...t,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 10. Social Links
      for (const sl of initialSocialLinks) {
        await db.insert(socialLinks).values({
          ...sl,
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 11. Founders
      for (const f of initialFounders) {
        await db.insert(founders).values({
          ...f,
          specialties: f.specialties || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      console.log('[PostgresStore] Seeding complete in PostgreSQL!');
    } catch (error: any) {
      throw new Error('Database initialization seeding failed; startup cannot be marked healthy.', { cause: error });
    }
  }

  // --- Public Site Data ---
  public async getPublicSiteData(): Promise<PublicSiteData> {
    const now = Date.now();
    if (this.cachedPublicData && (now - this.cachedTimestamp < this.CACHE_TTL_MS)) {
      return this.cachedPublicData;
    }

    await this.initSeedIfNeeded();

    if (!this.isDbOnline) {
      const fallback = this.getCompiledMemoryPublicData();
      this.cachedPublicData = fallback;
      this.cachedTimestamp = Date.now();
      return fallback;
    }

    try {
      const [
        settingsList,
        aboutList,
        servicesList,
        webList,
        graphicList,
        testimonialsList,
        foundersList,
        contactList,
        locationList,
        socialsList,
        seoList,
      ] = await Promise.all([
        db.select().from(siteSettings).where(eq(siteSettings.id, 'main')),
        db.select().from(aboutContent).where(eq(aboutContent.id, 'main')),
        db.select().from(services).where(eq(services.isPublished, true)).orderBy(asc(services.displayOrder)),
        db.select().from(webProjects).where(eq(webProjects.isPublished, true)).orderBy(asc(webProjects.displayOrder)),
        db.select().from(graphicProjects).where(eq(graphicProjects.isPublished, true)).orderBy(asc(graphicProjects.displayOrder)),
        db.select().from(testimonials).where(eq(testimonials.isPublished, true)).orderBy(asc(testimonials.displayOrder)),
        db.select().from(founders).where(eq(founders.isPublished, true)).orderBy(asc(founders.displayOrder)),
        db.select().from(contactSettings).where(eq(contactSettings.id, 'main')),
        db.select().from(locationSettings).where(eq(locationSettings.id, 'main')),
        db.select().from(socialLinks).where(eq(socialLinks.isPublished, true)).orderBy(asc(socialLinks.displayOrder)),
        db.select().from(seoSettings).where(eq(seoSettings.id, 'main')),
      ]);

      const s = settingsList[0];
      const a = aboutList[0];
      const c = contactList[0];
      const l = locationList[0];
      const se = seoList[0];

      const compiledData: PublicSiteData = {
        settings: s
          ? {
              id: s.id,
              siteName: s.siteName,
              brandName: s.brandName || '',
              tagline: s.tagline,
              logoUrl: s.logoUrl,
              iconUrl: s.iconUrl,
              heroHeadline: s.heroHeadline || '',
              heroSubheadline: s.heroSubheadline,
              heroBadgeText: s.heroBadgeText,
              primaryCtaText: s.primaryCtaText,
              secondaryCtaText: s.secondaryCtaText,
              updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memorySiteSettings,
        about: a
          ? {
              id: a.id,
              title: a.title,
              intro: a.intro,
              bio: a.bio,
              mission: a.mission,
              vision: a.vision,
              approach: a.approach,
              highlights: (a.highlights as string[]) || [],
              updatedAt: a.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memoryAboutContent,
        services: servicesList.map((srv) => ({
          ...srv,
          features: (srv.features as string[]) || [],
          category: srv.category as any,
          createdAt: srv.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: srv.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        webProjects: webList.map((p) => ({
          ...p,
          additionalImages: (p.additionalImages as string[]) || [],
          technologies: (p.technologies as string[]) || [],
          createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: p.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        graphicProjects: graphicList.map((g) => ({
          ...g,
          galleryImages: (g.galleryImages as string[]) || [],
          tags: (g.tags as string[]) || [],
          createdAt: g.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: g.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        testimonials: testimonialsList.map((t) => ({
          ...t,
          createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        founders: foundersList.map((f) => ({
          ...f,
          specialties: (f.specialties as string[]) || [],
          createdAt: f.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: f.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        contact: c
          ? {
              id: c.id,
              email: c.email,
              phone: c.phone,
              whatsapp: c.whatsapp,
              description: c.description,
              businessHours: c.businessHours,
              updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memoryContactSettings,
        location: l
          ? {
              id: l.id,
              locationName: l.locationName,
              address: l.address,
              mapLink: l.mapLink,
              coordinates: l.coordinates,
              description: l.description,
              updatedAt: l.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memoryLocationSettings,
        socials: socialsList
          .filter((sl) => sl.isPublished !== false)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((sl) => ({
            ...sl,
            platformName: sl.platformName,
            updatedAt: sl.updatedAt?.toISOString() || new Date().toISOString(),
          })),
        seo: se
          ? {
              id: se.id,
              siteTitle: se.siteTitle || '',
              metaDescription: se.metaDescription,
              ogImageUrl: se.ogImageUrl || '',
              keywords: se.keywords,
              canonicalUrl: se.canonicalUrl || '',
              robotsDirective: se.robotsDirective || 'index, follow',
              updatedAt: se.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memorySEOSettings,
      };

      this.cachedPublicData = compiledData;
      this.cachedTimestamp = Date.now();
      return compiledData;
    } catch (err: any) {
      this.isDbOnline = false;
      console.warn('[PostgresStore] getPublicSiteData retrieved from memory fallback:', err?.message || err);
      const fallback = this.getCompiledMemoryPublicData();
      this.cachedPublicData = fallback;
      this.cachedTimestamp = Date.now();
      return fallback;
    }
  }

  // --- Full Admin Site Data ---
  public async getFullAdminSiteData(): Promise<PublicSiteData> {
    await this.initSeedIfNeeded();

    if (!this.isDbOnline) {
      return {
        ...this.getCompiledMemoryPublicData(),
        services: [...this.memoryServices],
        webProjects: [...this.memoryWebProjects],
        graphicProjects: [...this.memoryGraphicProjects],
        testimonials: [...this.memoryTestimonials],
        socials: [...this.memorySocialLinks],
      };
    }

    try {
      const [
        settingsList,
        aboutList,
        servicesList,
        webList,
        graphicList,
        testimonialsList,
        foundersList,
        contactList,
        locationList,
        socialsList,
        seoList,
      ] = await Promise.all([
        db.select().from(siteSettings).where(eq(siteSettings.id, 'main')),
        db.select().from(aboutContent).where(eq(aboutContent.id, 'main')),
        db.select().from(services).orderBy(asc(services.displayOrder)),
        db.select().from(webProjects).orderBy(asc(webProjects.displayOrder)),
        db.select().from(graphicProjects).orderBy(asc(graphicProjects.displayOrder)),
        db.select().from(testimonials).orderBy(asc(testimonials.displayOrder)),
        db.select().from(founders).orderBy(asc(founders.displayOrder)),
        db.select().from(contactSettings).where(eq(contactSettings.id, 'main')),
        db.select().from(locationSettings).where(eq(locationSettings.id, 'main')),
        db.select().from(socialLinks).orderBy(asc(socialLinks.displayOrder)),
        db.select().from(seoSettings).where(eq(seoSettings.id, 'main')),
      ]);

      const s = settingsList[0];
      const a = aboutList[0];
      const c = contactList[0];
      const l = locationList[0];
      const se = seoList[0];

      return {
        settings: s
          ? {
              id: s.id,
              siteName: s.siteName,
              brandName: s.brandName || '',
              tagline: s.tagline,
              logoUrl: s.logoUrl,
              iconUrl: s.iconUrl,
              heroHeadline: s.heroHeadline || '',
              heroSubheadline: s.heroSubheadline,
              heroBadgeText: s.heroBadgeText,
              primaryCtaText: s.primaryCtaText,
              secondaryCtaText: s.secondaryCtaText,
              updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memorySiteSettings,
        about: a
          ? {
              id: a.id,
              title: a.title,
              intro: a.intro,
              bio: a.bio,
              mission: a.mission,
              vision: a.vision,
              approach: a.approach,
              highlights: (a.highlights as string[]) || [],
              updatedAt: a.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memoryAboutContent,
        services: servicesList.map((srv) => ({
          ...srv,
          features: (srv.features as string[]) || [],
          category: srv.category as any,
          createdAt: srv.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: srv.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        webProjects: webList.map((p) => ({
          ...p,
          additionalImages: (p.additionalImages as string[]) || [],
          technologies: (p.technologies as string[]) || [],
          createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: p.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        graphicProjects: graphicList.map((g) => ({
          ...g,
          galleryImages: (g.galleryImages as string[]) || [],
          tags: (g.tags as string[]) || [],
          createdAt: g.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: g.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        testimonials: testimonialsList.map((t) => ({
          ...t,
          createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        founders: foundersList.map((f) => ({
          ...f,
          specialties: (f.specialties as string[]) || [],
          createdAt: f.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: f.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        contact: c
          ? {
              id: c.id,
              email: c.email,
              phone: c.phone,
              whatsapp: c.whatsapp,
              description: c.description,
              businessHours: c.businessHours,
              updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memoryContactSettings,
        location: l
          ? {
              id: l.id,
              locationName: l.locationName,
              address: l.address,
              mapLink: l.mapLink,
              coordinates: l.coordinates,
              description: l.description,
              updatedAt: l.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memoryLocationSettings,
        socials: socialsList.map((sl) => ({
          ...sl,
          platformName: sl.platformName,
          updatedAt: sl.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        seo: se
          ? {
              id: se.id,
              siteTitle: se.siteTitle || '',
              metaDescription: se.metaDescription,
              ogImageUrl: se.ogImageUrl || '',
              keywords: se.keywords,
              canonicalUrl: se.canonicalUrl || '',
              robotsDirective: se.robotsDirective || 'index, follow',
              updatedAt: se.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : this.memorySEOSettings,
      };
    } catch (err: any) {
      this.isDbOnline = false;
      console.warn('[PostgresStore] getFullAdminSiteData retrieved from memory fallback:', err?.message || err);
      return {
        ...this.getCompiledMemoryPublicData(),
        services: [...this.memoryServices],
        webProjects: [...this.memoryWebProjects],
        graphicProjects: [...this.memoryGraphicProjects],
        testimonials: [...this.memoryTestimonials],
        founders: [...this.memoryFounders],
        socials: [...this.memorySocialLinks],
      };
    }
  }

  // --- Admin Dashboard Stats ---
  public async getDashboardStats(): Promise<AdminDashboardStats> {
    await this.initSeedIfNeeded();
    const visitorStats = await this.getVisitorStats();

    const computeMemoryStats = (): AdminDashboardStats => {
      const recentProjects: Array<{ id: string; title: string; type: 'web' | 'graphic'; createdAt: string }> = [
        ...this.memoryWebProjects.map((p) => ({
          id: p.id,
          title: p.title,
          type: 'web' as const,
          createdAt: p.createdAt,
        })),
        ...this.memoryGraphicProjects.map((g) => ({
          id: g.id,
          title: g.title,
          type: 'graphic' as const,
          createdAt: g.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      return {
        totalWebProjects: this.memoryWebProjects.length,
        totalGraphicProjects: this.memoryGraphicProjects.length,
        totalServices: this.memoryServices.length,
        publishedServices: this.memoryServices.filter((s) => s.isPublished).length,
        publishedTestimonials: this.memoryTestimonials.filter((t) => t.isPublished).length,
        newInquiries: this.memoryInquiries.filter((i) => i.status === 'new').length,
        totalInquiries: this.memoryInquiries.length,
        recentProjects,
        recentInquiries: this.memoryInquiries.slice(0, 5),
        visitorStats,
      };
    };

    if (!this.isDbOnline) {
      return computeMemoryStats();
    }

    try {
      const [
        allWeb,
        allGraphic,
        allServ,
        allTest,
        allInquiries,
      ] = await Promise.all([
        db.select().from(webProjects),
        db.select().from(graphicProjects),
        db.select().from(services),
        db.select().from(testimonials),
        db.select().from(inquiries).orderBy(desc(inquiries.createdAt)),
      ]);

      const newInquiries = allInquiries.filter((i) => i.status === 'new').length;

      const recentProjects: Array<{ id: string; title: string; type: 'web' | 'graphic'; createdAt: string }> = [
        ...allWeb.map((p) => ({
          id: p.id,
          title: p.title,
          type: 'web' as const,
          createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
        })),
        ...allGraphic.map((g) => ({
          id: g.id,
          title: g.title,
          type: 'graphic' as const,
          createdAt: g.createdAt?.toISOString() || new Date().toISOString(),
        })),
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      return {
        totalWebProjects: allWeb.length,
        totalGraphicProjects: allGraphic.length,
        totalServices: allServ.length,
        publishedServices: allServ.filter((s) => s.isPublished).length,
        publishedTestimonials: allTest.filter((t) => t.isPublished).length,
        newInquiries,
        totalInquiries: allInquiries.length,
        recentProjects,
        recentInquiries: allInquiries.slice(0, 5).map((i) => ({
          ...i,
          preferredContact: i.preferredContact as any,
          status: i.status as any,
          createdAt: i.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: i.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        visitorStats,
      };
    } catch (err: any) {
      this.isDbOnline = false;
      console.warn('[PostgresStore] getDashboardStats fallback to memory stats:', err?.message || err);
      return computeMemoryStats();
    }
  }

  // --- Inquiries ---
  public async getInquiries(): Promise<Inquiry[]> {
    await this.initSeedIfNeeded();
    if (!this.isDbOnline) {
      return [...this.memoryInquiries];
    }
    try {
      const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
      return rows.map((r) => ({
        ...r,
        preferredContact: r.preferredContact as any,
        status: r.status as any,
        createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: r.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (err: any) {
      this.isDbOnline = false;
      console.warn('[PostgresStore] getInquiries fallback to memory:', err?.message || err);
      return [...this.memoryInquiries];
    }
  }

  public async addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Inquiry> {
    await this.initSeedIfNeeded();
    if (!this.isDbOnline) throw new Error('The database is currently unavailable. Your inquiry was not accepted; please try again shortly.');
    const id = 'inq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const [inserted] = await db.insert(inquiries).values({
      id, name: data.name, email: data.email, phone: data.phone, service: data.service,
      description: data.description, preferredContact: data.preferredContact, status: 'new',
    }).returning();
    if (!inserted) throw new Error('The inquiry could not be confirmed as saved.');
    const saved: Inquiry = {
      ...inserted,
      preferredContact: inserted.preferredContact as any,
      status: inserted.status as any,
      createdAt: inserted.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: inserted.updatedAt?.toISOString() || new Date().toISOString(),
    };
    this.memoryInquiries.unshift(saved);
    return saved;
  }

  public async updateInquiryStatus(id: string, status: 'new' | 'read' | 'archived'): Promise<Inquiry | null> {
    await this.requireDatabase();
    const memItem = this.memoryInquiries.find((i) => i.id === id);
    if (memItem) {
      memItem.status = status;
      memItem.updatedAt = new Date().toISOString();
    }

    if (this.isDbOnline) {
      try {
        const [updated] = await db
          .update(inquiries)
          .set({ status, updatedAt: new Date() })
          .where(eq(inquiries.id, id))
          .returning();

        if (updated) {
          return {
            ...updated,
            preferredContact: updated.preferredContact as any,
            status: updated.status as any,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return memItem || null;
  }

  public async deleteInquiry(id: string): Promise<boolean> {
    await this.requireDatabase();
    const initialLen = this.memoryInquiries.length;
    this.memoryInquiries = this.memoryInquiries.filter((i) => i.id !== id);

    if (this.isDbOnline) {
      try {
        const res = await db.delete(inquiries).where(eq(inquiries.id, id)).returning();
        return res.length > 0 || this.memoryInquiries.length < initialLen;
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return this.memoryInquiries.length < initialLen;
  }

  // --- Site Settings Update ---
  public async updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memorySiteSettings = {
      ...this.memorySiteSettings,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (this.isDbOnline) {
      try {
        const [updated] = await db
          .insert(siteSettings)
          .values({
            id: 'main',
            siteName: patch.siteName ?? initialSiteSettings.siteName,
            brandName: patch.brandName ?? initialSiteSettings.brandName,
            tagline: patch.tagline ?? initialSiteSettings.tagline,
            logoUrl: patch.logoUrl ?? initialSiteSettings.logoUrl,
            iconUrl: patch.iconUrl ?? initialSiteSettings.iconUrl,
            heroHeadline: patch.heroHeadline ?? initialSiteSettings.heroHeadline,
            heroSubheadline: patch.heroSubheadline ?? initialSiteSettings.heroSubheadline,
            heroBadgeText: patch.heroBadgeText ?? initialSiteSettings.heroBadgeText,
            primaryCtaText: patch.primaryCtaText ?? initialSiteSettings.primaryCtaText,
            secondaryCtaText: patch.secondaryCtaText ?? initialSiteSettings.secondaryCtaText,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: siteSettings.id,
            set: {
              ...patch,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (updated) {
          return {
            id: updated.id,
            siteName: updated.siteName,
            brandName: updated.brandName || '',
            tagline: updated.tagline,
            logoUrl: updated.logoUrl,
            iconUrl: updated.iconUrl,
            heroHeadline: updated.heroHeadline || '',
            heroSubheadline: updated.heroSubheadline,
            heroBadgeText: updated.heroBadgeText,
            primaryCtaText: updated.primaryCtaText,
            secondaryCtaText: updated.secondaryCtaText,
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return { ...this.memorySiteSettings };
  }

  // --- About Update ---
  public async updateAboutContent(patch: Partial<AboutContent>): Promise<AboutContent> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memoryAboutContent = {
      ...this.memoryAboutContent,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (this.isDbOnline) {
      try {
        const [updated] = await db
          .insert(aboutContent)
          .values({
            id: 'main',
            title: patch.title ?? initialAboutContent.title,
            intro: patch.intro ?? initialAboutContent.intro,
            bio: patch.bio ?? initialAboutContent.bio,
            mission: patch.mission ?? initialAboutContent.mission,
            vision: patch.vision ?? initialAboutContent.vision,
            approach: patch.approach ?? initialAboutContent.approach,
            highlights: patch.highlights ?? initialAboutContent.highlights,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: aboutContent.id,
            set: {
              ...patch,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (updated) {
          return {
            id: updated.id,
            title: updated.title,
            intro: updated.intro,
            bio: updated.bio,
            mission: updated.mission,
            vision: updated.vision,
            approach: updated.approach,
            highlights: (updated.highlights as string[]) || [],
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return { ...this.memoryAboutContent };
  }

  // --- Contact Update ---
  public async updateContactSettings(patch: Partial<ContactSettings>): Promise<ContactSettings> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memoryContactSettings = {
      ...this.memoryContactSettings,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (this.isDbOnline) {
      try {
        const [updated] = await db
          .insert(contactSettings)
          .values({
            id: 'main',
            email: patch.email ?? initialContactSettings.email,
            phone: patch.phone ?? initialContactSettings.phone,
            whatsapp: patch.whatsapp ?? initialContactSettings.whatsapp,
            description: patch.description ?? initialContactSettings.description,
            businessHours: patch.businessHours ?? initialContactSettings.businessHours,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: contactSettings.id,
            set: {
              ...patch,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (updated) {
          this.invalidateCache();
          return {
            id: updated.id,
            email: updated.email,
            phone: updated.phone,
            whatsapp: updated.whatsapp,
            description: updated.description,
            businessHours: updated.businessHours,
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return { ...this.memoryContactSettings };
  }

  // --- Location Update ---
  public async updateLocationSettings(patch: Partial<LocationSettings>): Promise<LocationSettings> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memoryLocationSettings = {
      ...this.memoryLocationSettings,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (this.isDbOnline) {
      try {
        const [updated] = await db
          .insert(locationSettings)
          .values({
            id: 'main',
            locationName: patch.locationName ?? initialLocationSettings.locationName,
            address: patch.address ?? initialLocationSettings.address,
            mapLink: patch.mapLink ?? initialLocationSettings.mapLink,
            coordinates: patch.coordinates ?? initialLocationSettings.coordinates,
            description: patch.description ?? initialLocationSettings.description,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: locationSettings.id,
            set: {
              ...patch,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (updated) {
          this.invalidateCache();
          return {
            id: updated.id,
            locationName: updated.locationName,
            address: updated.address,
            mapLink: updated.mapLink,
            coordinates: updated.coordinates,
            description: updated.description,
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return { ...this.memoryLocationSettings };
  }

  // --- SEO Update ---
  public async updateSEOSettings(patch: Partial<SEOSettings>): Promise<SEOSettings> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memorySEOSettings = {
      ...this.memorySEOSettings,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (this.isDbOnline) {
      try {
        const [updated] = await db
          .insert(seoSettings)
          .values({
            id: 'main',
            siteTitle: patch.siteTitle ?? initialSEOSettings.siteTitle,
            metaDescription: patch.metaDescription ?? initialSEOSettings.metaDescription,
            ogImageUrl: patch.ogImageUrl ?? initialSEOSettings.ogImageUrl,
            keywords: patch.keywords ?? initialSEOSettings.keywords,
            canonicalUrl: patch.canonicalUrl ?? initialSEOSettings.canonicalUrl,
            robotsDirective: patch.robotsDirective ?? initialSEOSettings.robotsDirective,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: seoSettings.id,
            set: {
              ...patch,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (updated) {
          return {
            id: updated.id,
            siteTitle: updated.siteTitle || '',
            metaDescription: updated.metaDescription,
            ogImageUrl: updated.ogImageUrl || '',
            keywords: updated.keywords,
            canonicalUrl: updated.canonicalUrl || '',
            robotsDirective: updated.robotsDirective || 'index, follow',
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return { ...this.memorySEOSettings };
  }

  // --- Services CRUD ---
  public async getServices(): Promise<ServiceItem[]> {
    if (!this.isDbOnline) return [...this.memoryServices];
    try {
      const rows = await db.select().from(services).orderBy(asc(services.displayOrder));
      return rows.map((s) => ({
        ...s,
        features: (s.features as string[]) || [],
        category: s.category as any,
        createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (err: any) {
      console.warn('[PostgresStore] getServices fallback to memory:', err?.message || err);
      return [...this.memoryServices];
    }
  }

  public async saveService(item: Partial<ServiceItem> & { title: string }): Promise<ServiceItem> {
    await this.requireDatabase();
    this.invalidateCache();
    const id = item.id || 'serv-' + Date.now();
    const serviceItem: ServiceItem = {
      id,
      title: item.title,
      category: item.category || 'web',
      iconName: item.iconName || 'Code',
      shortDescription: item.shortDescription || '',
      fullDescription: item.fullDescription || '',
      features: item.features || [],
      displayOrder: item.displayOrder ?? item.order ?? 0,
      isPublished: item.isPublished ?? true,
      isFeatured: item.isFeatured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const existingIdx = this.memoryServices.findIndex(s => s.id === id);
    if (existingIdx >= 0) {
      this.memoryServices[existingIdx] = serviceItem;
    } else {
      this.memoryServices.push(serviceItem);
    }

    if (this.isDbOnline) {
      try {
        const [saved] = await db
          .insert(services)
          .values({
            id,
            title: item.title,
            category: item.category || 'web',
            iconName: item.iconName || 'Code',
            shortDescription: item.shortDescription || '',
            fullDescription: item.fullDescription || '',
            features: item.features || [],
            displayOrder: item.displayOrder ?? item.order ?? 0,
            isPublished: item.isPublished ?? true,
            isFeatured: item.isFeatured ?? false,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: services.id,
            set: {
              title: item.title,
              category: item.category || 'web',
              iconName: item.iconName || 'Code',
              shortDescription: item.shortDescription || '',
              fullDescription: item.fullDescription || '',
              features: item.features || [],
              displayOrder: item.displayOrder ?? item.order ?? 0,
              isPublished: item.isPublished ?? true,
              isFeatured: item.isFeatured ?? false,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (saved) {
          return {
            ...saved,
            features: (saved.features as string[]) || [],
            category: saved.category as any,
            createdAt: saved.createdAt?.toISOString() || serviceItem.createdAt,
            updatedAt: saved.updatedAt?.toISOString() || serviceItem.updatedAt,
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return serviceItem;
  }

  public async deleteService(id: string): Promise<boolean> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memoryServices = this.memoryServices.filter(s => s.id !== id);
    if (this.isDbOnline) {
      try {
        const res = await db.delete(services).where(eq(services.id, id)).returning();
        return res.length > 0;
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return true;
  }

  // --- Web Projects CRUD ---
  public async getWebProjects(): Promise<WebProject[]> {
    if (!this.isDbOnline) return [...this.memoryWebProjects];
    try {
      const rows = await db.select().from(webProjects).orderBy(asc(webProjects.displayOrder));
      return rows.map((p) => ({
        ...p,
        additionalImages: (p.additionalImages as string[]) || [],
        technologies: (p.technologies as string[]) || [],
        createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: p.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (err: any) {
      console.warn('[PostgresStore] getWebProjects fallback to memory:', err?.message || err);
      return [...this.memoryWebProjects];
    }
  }

  public async saveWebProject(item: Partial<WebProject> & { title: string }): Promise<WebProject> {
    await this.requireDatabase();
    this.invalidateCache();
    const id = item.id || 'web-' + Date.now();
    const webItem: WebProject = {
      id,
      title: item.title,
      category: item.category || 'Website',
      description: item.description || '',
      mainImage: item.mainImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      additionalImages: item.additionalImages || [],
      technologies: item.technologies || [],
      projectUrl: item.projectUrl || undefined,
      githubUrl: item.githubUrl || undefined,
      displayOrder: item.displayOrder ?? item.order ?? 0,
      isFeatured: item.isFeatured ?? false,
      isPublished: item.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const existingIdx = this.memoryWebProjects.findIndex(p => p.id === id);
    if (existingIdx >= 0) {
      this.memoryWebProjects[existingIdx] = webItem;
    } else {
      this.memoryWebProjects.push(webItem);
    }

    if (this.isDbOnline) {
      try {
        const [saved] = await db
          .insert(webProjects)
          .values({
            id,
            title: item.title,
            category: item.category || 'Website',
            description: item.description || '',
            mainImage: item.mainImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
            additionalImages: item.additionalImages || [],
            technologies: item.technologies || [],
            projectUrl: item.projectUrl || null,
            githubUrl: item.githubUrl || null,
            displayOrder: item.displayOrder ?? item.order ?? 0,
            isFeatured: item.isFeatured ?? false,
            isPublished: item.isPublished ?? true,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: webProjects.id,
            set: {
              title: item.title,
              category: item.category || 'Website',
              description: item.description || '',
              mainImage: item.mainImage || '',
              additionalImages: item.additionalImages || [],
              technologies: item.technologies || [],
              projectUrl: item.projectUrl || null,
              githubUrl: item.githubUrl || null,
              displayOrder: item.displayOrder ?? item.order ?? 0,
              isFeatured: item.isFeatured ?? false,
              isPublished: item.isPublished ?? true,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (saved) {
          return {
            ...saved,
            additionalImages: (saved.additionalImages as string[]) || [],
            technologies: (saved.technologies as string[]) || [],
            createdAt: saved.createdAt?.toISOString() || webItem.createdAt,
            updatedAt: saved.updatedAt?.toISOString() || webItem.updatedAt,
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return webItem;
  }

  public async deleteWebProject(id: string): Promise<boolean> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memoryWebProjects = this.memoryWebProjects.filter(p => p.id !== id);
    if (this.isDbOnline) {
      try {
        const res = await db.delete(webProjects).where(eq(webProjects.id, id)).returning();
        return res.length > 0;
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return true;
  }

  // --- Graphic Projects CRUD ---
  public async getGraphicProjects(): Promise<GraphicProject[]> {
    if (!this.isDbOnline) return [...this.memoryGraphicProjects];
    try {
      const rows = await db.select().from(graphicProjects).orderBy(asc(graphicProjects.displayOrder));
      return rows.map((g) => ({
        ...g,
        galleryImages: (g.galleryImages as string[]) || [],
        tags: (g.tags as string[]) || [],
        createdAt: g.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: g.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (err: any) {
      console.warn('[PostgresStore] getGraphicProjects fallback to memory:', err?.message || err);
      return [...this.memoryGraphicProjects];
    }
  }

  public async saveGraphicProject(item: Partial<GraphicProject> & { title: string }): Promise<GraphicProject> {
    await this.requireDatabase();
    this.invalidateCache();
    const id = item.id || 'graph-' + Date.now();
    const graphItem: GraphicProject = {
      id,
      title: item.title,
      category: item.category || 'Graphic Design',
      description: item.description || '',
      mainImage: item.mainImage || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
      galleryImages: item.galleryImages || [],
      tags: item.tags || [],
      displayOrder: item.displayOrder ?? item.order ?? 0,
      isFeatured: item.isFeatured ?? false,
      isPublished: item.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const existingIdx = this.memoryGraphicProjects.findIndex(g => g.id === id);
    if (existingIdx >= 0) {
      this.memoryGraphicProjects[existingIdx] = graphItem;
    } else {
      this.memoryGraphicProjects.push(graphItem);
    }

    if (this.isDbOnline) {
      try {
        const [saved] = await db
          .insert(graphicProjects)
          .values({
            id,
            title: item.title,
            category: item.category || 'Graphic Design',
            description: item.description || '',
            mainImage: item.mainImage || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
            galleryImages: item.galleryImages || [],
            tags: item.tags || [],
            displayOrder: item.displayOrder ?? item.order ?? 0,
            isFeatured: item.isFeatured ?? false,
            isPublished: item.isPublished ?? true,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: graphicProjects.id,
            set: {
              title: item.title,
              category: item.category || 'Graphic Design',
              description: item.description || '',
              mainImage: item.mainImage || '',
              galleryImages: item.galleryImages || [],
              tags: item.tags || [],
              displayOrder: item.displayOrder ?? item.order ?? 0,
              isFeatured: item.isFeatured ?? false,
              isPublished: item.isPublished ?? true,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (saved) {
          return {
            ...saved,
            galleryImages: (saved.galleryImages as string[]) || [],
            tags: (saved.tags as string[]) || [],
            createdAt: saved.createdAt?.toISOString() || graphItem.createdAt,
            updatedAt: saved.updatedAt?.toISOString() || graphItem.updatedAt,
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return graphItem;
  }

  public async deleteGraphicProject(id: string): Promise<boolean> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memoryGraphicProjects = this.memoryGraphicProjects.filter(g => g.id !== id);
    if (this.isDbOnline) {
      try {
        const res = await db.delete(graphicProjects).where(eq(graphicProjects.id, id)).returning();
        return res.length > 0;
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return true;
  }

  // --- Testimonials CRUD ---
  public async getTestimonials(): Promise<Testimonial[]> {
    if (!this.isDbOnline) return [...this.memoryTestimonials];
    try {
      const rows = await db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
      return rows.map((t) => ({
        ...t,
        createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (err: any) {
      console.warn('[PostgresStore] getTestimonials fallback to memory:', err?.message || err);
      return [...this.memoryTestimonials];
    }
  }

  public async saveTestimonial(item: Partial<Testimonial> & { clientName: string }): Promise<Testimonial> {
    await this.requireDatabase();
    this.invalidateCache();
    const id = item.id || 'test-' + Date.now();
    const testItem: Testimonial = {
      id,
      clientName: item.clientName,
      clientCompany: item.clientCompany || '',
      clientRole: item.clientRole || '',
      message: item.message || '',
      clientImage: item.clientImage || undefined,
      rating: item.rating ?? 5,
      displayOrder: item.displayOrder ?? item.order ?? 0,
      isFeatured: item.isFeatured ?? true,
      isPublished: item.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const existingIdx = this.memoryTestimonials.findIndex(t => t.id === id);
    if (existingIdx >= 0) {
      this.memoryTestimonials[existingIdx] = testItem;
    } else {
      this.memoryTestimonials.push(testItem);
    }

    if (this.isDbOnline) {
      try {
        const [saved] = await db
          .insert(testimonials)
          .values({
            id,
            clientName: item.clientName,
            clientCompany: item.clientCompany || '',
            clientRole: item.clientRole || '',
            message: item.message || '',
            clientImage: item.clientImage || null,
            rating: item.rating ?? 5,
            displayOrder: item.displayOrder ?? item.order ?? 0,
            isFeatured: item.isFeatured ?? true,
            isPublished: item.isPublished ?? true,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: testimonials.id,
            set: {
              clientName: item.clientName,
              clientCompany: item.clientCompany || '',
              clientRole: item.clientRole || '',
              message: item.message || '',
              clientImage: item.clientImage || null,
              rating: item.rating ?? 5,
              displayOrder: item.displayOrder ?? item.order ?? 0,
              isFeatured: item.isFeatured ?? true,
              isPublished: item.isPublished ?? true,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (saved) {
          return {
            ...saved,
            createdAt: saved.createdAt?.toISOString() || testItem.createdAt,
            updatedAt: saved.updatedAt?.toISOString() || testItem.updatedAt,
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return testItem;
  }

  public async deleteTestimonial(id: string): Promise<boolean> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memoryTestimonials = this.memoryTestimonials.filter(t => t.id !== id);
    if (this.isDbOnline) {
      try {
        const res = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
        return res.length > 0;
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return true;
  }

  // --- Founders CRUD ---
  public async getFounders(): Promise<Founder[]> {
    if (!this.isDbOnline) return [...this.memoryFounders];
    try {
      const rows = await db.select().from(founders).orderBy(asc(founders.displayOrder));
      return rows.map((f) => ({
        ...f,
        specialties: (f.specialties as string[]) || [],
        createdAt: f.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: f.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (err: any) {
      console.warn('[PostgresStore] getFounders fallback to memory:', err?.message || err);
      return [...this.memoryFounders];
    }
  }

  public async saveFounder(item: Partial<Founder> & { name: string; role: string; bio: string; imageUrl: string }): Promise<Founder> {
    await this.requireDatabase();
    this.invalidateCache();
    const id = item.id || 'founder-' + Date.now();
    const founderItem: Founder = {
      id,
      name: item.name,
      role: item.role,
      bio: item.bio,
      imageUrl: item.imageUrl,
      linkedInUrl: item.linkedInUrl || null,
      twitterUrl: item.twitterUrl || null,
      githubUrl: item.githubUrl || null,
      email: item.email || null,
      specialties: item.specialties || [],
      quote: item.quote || null,
      displayOrder: item.displayOrder ?? item.order ?? 0,
      isPublished: item.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingIdx = this.memoryFounders.findIndex(f => f.id === id);
    if (existingIdx >= 0) {
      this.memoryFounders[existingIdx] = founderItem;
    } else {
      this.memoryFounders.push(founderItem);
    }

    if (this.isDbOnline) {
      try {
        const [saved] = await db
          .insert(founders)
          .values({
            id,
            name: item.name,
            role: item.role,
            bio: item.bio,
            imageUrl: item.imageUrl,
            linkedInUrl: item.linkedInUrl || null,
            twitterUrl: item.twitterUrl || null,
            githubUrl: item.githubUrl || null,
            email: item.email || null,
            specialties: item.specialties || [],
            quote: item.quote || null,
            displayOrder: item.displayOrder ?? item.order ?? 0,
            isPublished: item.isPublished ?? true,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: founders.id,
            set: {
              name: item.name,
              role: item.role,
              bio: item.bio,
              imageUrl: item.imageUrl,
              linkedInUrl: item.linkedInUrl || null,
              twitterUrl: item.twitterUrl || null,
              githubUrl: item.githubUrl || null,
              email: item.email || null,
              specialties: item.specialties || [],
              quote: item.quote || null,
              displayOrder: item.displayOrder ?? item.order ?? 0,
              isPublished: item.isPublished ?? true,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (saved) {
          return {
            ...saved,
            specialties: (saved.specialties as string[]) || [],
            createdAt: saved.createdAt?.toISOString() || founderItem.createdAt,
            updatedAt: saved.updatedAt?.toISOString() || founderItem.updatedAt,
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return founderItem;
  }

  public async deleteFounder(id: string): Promise<boolean> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memoryFounders = this.memoryFounders.filter(f => f.id !== id);
    if (this.isDbOnline) {
      try {
        const res = await db.delete(founders).where(eq(founders.id, id)).returning();
        return res.length > 0;
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return true;
  }


  // --- Social Links CRUD ---
  public async getSocialLinks(): Promise<SocialLink[]> {
    if (!this.isDbOnline) return [...this.memorySocialLinks];
    try {
      const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.displayOrder));
      return rows.map((sl) => ({
        ...sl,
        platformName: sl.platformName,
        updatedAt: sl.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (err: any) {
      console.warn('[PostgresStore] getSocialLinks fallback to memory:', err?.message || err);
      return [...this.memorySocialLinks];
    }
  }

  public async saveSocialLink(item: Partial<SocialLink> & { platform: string; url: string }): Promise<SocialLink> {
    await this.requireDatabase();
    this.invalidateCache();
    const id = item.id || item.platform.toLowerCase();
    const socialItem: SocialLink = {
      id,
      platform: item.platform,
      platformName: item.platformName || item.platform,
      url: item.url,
      icon: item.icon || 'Globe',
      displayOrder: item.displayOrder ?? item.order ?? 0,
      isPublished: item.isPublished ?? item.isEnabled ?? true,
      updatedAt: new Date().toISOString(),
    };
    const existingIdx = this.memorySocialLinks.findIndex(sl => sl.id === id);
    if (existingIdx >= 0) {
      this.memorySocialLinks[existingIdx] = socialItem;
    } else {
      this.memorySocialLinks.push(socialItem);
    }

    if (this.isDbOnline) {
      try {
        const [saved] = await db
          .insert(socialLinks)
          .values({
            id,
            platform: item.platform,
            platformName: item.platformName || item.platform,
            url: item.url,
            icon: item.icon || 'Globe',
            displayOrder: item.displayOrder ?? item.order ?? 0,
            isPublished: item.isPublished ?? item.isEnabled ?? true,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: socialLinks.id,
            set: {
              platform: item.platform,
              platformName: item.platformName || item.platform,
              url: item.url,
              icon: item.icon || 'Globe',
              displayOrder: item.displayOrder ?? item.order ?? 0,
              isPublished: item.isPublished ?? item.isEnabled ?? true,
              updatedAt: new Date(),
            },
          })
          .returning();

        if (saved) {
          return {
            ...saved,
            platformName: saved.platformName,
            updatedAt: saved.updatedAt?.toISOString() || socialItem.updatedAt,
          };
        }
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return socialItem;
  }

  public async deleteSocialLink(id: string): Promise<boolean> {
    await this.requireDatabase();
    this.invalidateCache();
    this.memorySocialLinks = this.memorySocialLinks.filter(sl => sl.id !== id);
    if (this.isDbOnline) {
      try {
        const res = await db.delete(socialLinks).where(eq(socialLinks.id, id)).returning();
        return res.length > 0;
      } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    }
    return true;
  }

  // --- PostgreSQL Media Storage (Files + Binary Data) - NO BUCKETS NEEDED ---
  public async getMediaFiles(): Promise<MediaItem[]> {
    const rows = await db.select().from(mediaFiles).orderBy(desc(mediaFiles.createdAt));
    return rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      originalName: r.originalName,
      mimeType: r.mimeType,
      size: r.size,
      url: r.url,
      provider: 'postgres' as any,
      createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
    }));
  }

  public async storeMediaInPostgres(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<MediaItem> {
    await this.requireDatabase();
    const id = 'media-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    const filename = `${id}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const base64Data = fileBuffer.toString('base64');
    const url = `/api/media/blob/${id}`;

    // Store metadata
    await db.insert(mediaFiles).values({
      id,
      filename,
      originalName,
      mimeType,
      size: fileBuffer.length,
      url,
      provider: 'postgres',
    });

    // Store actual binary blob in Postgres
    await db.insert(mediaBlobs).values({
      id,
      data: base64Data,
      mimeType,
    });

    return {
      id,
      filename,
      originalName,
      mimeType,
      size: fileBuffer.length,
      url,
      provider: 'postgres' as any,
      createdAt: new Date().toISOString(),
    };
  }

  public async getMediaBlob(id: string): Promise<{ data: Buffer; mimeType: string } | null> {
    try {
      const rows = await db.select().from(mediaBlobs).where(eq(mediaBlobs.id, id));
      if (rows.length === 0) return null;
      const blob = rows[0];
      const buffer = Buffer.from(blob.data, 'base64');
      return {
        data: buffer,
        mimeType: blob.mimeType,
      };
    } catch (err: any) {
      console.warn('[PostgresStore] getMediaBlob notice:', err?.message || err);
      return null;
    }
  }

  public async deleteMedia(id: string): Promise<boolean> {
    await this.requireDatabase();
    try {
      await db.delete(mediaBlobs).where(eq(mediaBlobs.id, id));
      const res = await db.delete(mediaFiles).where(eq(mediaFiles.id, id)).returning();
      return res.length > 0;
    } catch (err: any) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
  }

  // ==========================================
  // ACTIVITY & SECURITY AUDIT LOGGING
  // ==========================================

  public async recordActivity(
    data: Omit<ActivityLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
  ): Promise<ActivityLog> {
    await this.requireDatabase();
    const id = data.id || `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = data.timestamp || new Date().toISOString();

    const logEntry: ActivityLog = {
      id,
      type: data.type,
      title: data.title,
      description: data.description,
      severity: data.severity,
      ip: data.ip,
      userAgent: data.userAgent,
      location: data.location,
      path: data.path,
      timestamp,
      metadata: data.metadata,
    };

    // Persist to PostgreSQL before reporting success or updating the local cache.
    try {
      await db.insert(activityLogs).values({
        id: logEntry.id,
        type: logEntry.type,
        title: logEntry.title,
        description: logEntry.description,
        severity: logEntry.severity,
        ip: logEntry.ip,
        userAgent: logEntry.userAgent || null,
        location: logEntry.location || null,
        path: logEntry.path || null,
        metadata: logEntry.metadata || null,
        createdAt: new Date(timestamp),
      });
    } catch (dbErr) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: dbErr });
      }

    this.memoryActivityLogs.unshift(logEntry);
    if (this.memoryActivityLogs.length > 500) this.memoryActivityLogs.pop();
    return logEntry;
  }

  public async getActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
    await this.requireDatabase();
    try {
      const rows = await db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit);

      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          type: r.type as any,
          title: r.title,
          description: r.description,
          severity: r.severity as any,
          ip: r.ip,
          userAgent: r.userAgent || undefined,
          location: r.location || undefined,
          path: r.path || undefined,
          timestamp: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          metadata: r.metadata as any,
        }));
      }
    } catch (err) {
      throw new Error('Activity log retrieval failed; results may be incomplete.', { cause: err });
    }

    return this.memoryActivityLogs.slice(0, limit);
  }

  public async clearActivityLogs(): Promise<void> {
    await this.requireDatabase();
    try {
      await db.delete(activityLogs);
    } catch (err) {
        throw new Error('Persistent database operation failed; no change was confirmed.', { cause: err });
      }
    this.memoryActivityLogs = [];
  }

  public async getSecurityStats(): Promise<SecurityStats> {
    const logs = await this.getActivityLogs(250);

    const loginSuccesses = logs.filter((l) => l.type === 'login_success');
    const loginFailures = logs.filter((l) => l.type === 'login_failed');
    const hackAttempts = logs.filter((l) => l.type === 'hack_attempt' || l.type === 'security_alert');

    const lastLogin = loginSuccesses[0];

    const threatLevel: 'normal' | 'elevated' | 'high' =
      hackAttempts.length >= 5 ? 'high' : hackAttempts.length > 0 || loginFailures.length >= 3 ? 'elevated' : 'normal';

    return {
      totalLogins: loginSuccesses.length,
      lastLoginTime: lastLogin ? lastLogin.timestamp : null,
      lastLoginIp: lastLogin ? lastLogin.ip : null,
      failedLoginsCount: loginFailures.length,
      blockedAttacksCount: hackAttempts.length,
      threatLevel,
      activeFirewallRulesCount: 18,
      recentAttacks: hackAttempts.slice(0, 10),
    };
  }

  // --- Persistent Visitor & Traffic Analytics Engine ---
  public async recordVisit(path: string): Promise<{ success: boolean; totalToday: number }> {
    await this.requireDatabase();
    const visitedPath = (path || '/').slice(0, 2048);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Keep the existing analytics table compatible, but intentionally store
      // no IP address or user-agent value. Only page path and visit time remain.
      await client.query(
        `INSERT INTO visitor_visits (ip, path, user_agent, referrer, device_type, visited_at) VALUES ('', $1, NULL, NULL, NULL, NOW())`,
        [visitedPath]
      );
      await client.query(
        `INSERT INTO visitor_daily_rollups (date_key, total_visits, unique_visitors, top_path, updated_at)
         SELECT TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'), COUNT(*)::int, 0,
           COALESCE((SELECT path FROM visitor_visits WHERE visited_at::date = CURRENT_DATE GROUP BY path ORDER BY COUNT(*) DESC LIMIT 1), '/'), NOW()
         FROM visitor_visits WHERE visited_at::date = CURRENT_DATE
         ON CONFLICT (date_key) DO UPDATE SET total_visits=EXCLUDED.total_visits, unique_visitors=0, top_path=EXCLUDED.top_path, updated_at=NOW()`
      );
      const count = await client.query(`SELECT total_visits FROM visitor_daily_rollups WHERE date_key = TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')`);
      await client.query('COMMIT');
      return { success: true, totalToday: Number(count.rows[0]?.total_visits || 0) };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  public async getVisitorStats(): Promise<VisitorStats> {
    await this.requireDatabase();
    const [daily, weekly, monthly, yearly, totals] = await Promise.all([
      pool.query(`SELECT date_key,total_visits,unique_visitors FROM visitor_daily_rollups WHERE date_key >= TO_CHAR(CURRENT_DATE - INTERVAL '13 days','YYYY-MM-DD') ORDER BY date_key`),
      pool.query(`SELECT TO_CHAR(DATE_TRUNC('week',visited_at),'YYYY-MM-DD') AS period,COUNT(*)::int AS visits,0::int AS uniques FROM visitor_visits WHERE visited_at >= NOW()-INTERVAL '8 weeks' GROUP BY DATE_TRUNC('week',visited_at) ORDER BY DATE_TRUNC('week',visited_at)`),
      pool.query(`SELECT TO_CHAR(DATE_TRUNC('month',visited_at),'YYYY-MM') AS period,COUNT(*)::int AS visits,0::int AS uniques FROM visitor_visits WHERE visited_at >= NOW()-INTERVAL '12 months' GROUP BY DATE_TRUNC('month',visited_at) ORDER BY DATE_TRUNC('month',visited_at)`),
      pool.query(`SELECT EXTRACT(YEAR FROM visited_at)::int AS period,COUNT(*)::int AS visits,0::int AS uniques FROM visitor_visits WHERE visited_at >= DATE_TRUNC('year',NOW())-INTERVAL '3 years' GROUP BY EXTRACT(YEAR FROM visited_at) ORDER BY period`),
      pool.query(`SELECT COUNT(*) FILTER(WHERE visited_at::date=CURRENT_DATE)::int AS today,0::int AS unique_today,COUNT(*) FILTER(WHERE visited_at>=DATE_TRUNC('week',NOW()))::int AS this_week,0::int AS unique_week,COUNT(*) FILTER(WHERE visited_at>=DATE_TRUNC('month',NOW()))::int AS this_month,0::int AS unique_month,COUNT(*) FILTER(WHERE visited_at>=DATE_TRUNC('year',NOW()))::int AS this_year,0::int AS unique_year,COUNT(*)::int AS total FROM visitor_visits`),
    ]);
    const n=(v:unknown)=>Number(v||0);
    const dailyMap=new Map(daily.rows.map((r:any)=>[r.date_key,r]));
    const dailyBreakdown:VisitorBreakdownItem[]=[];
    for(let offset=13;offset>=0;offset--){
      const d=new Date();d.setDate(d.getDate()-offset);const key=d.toISOString().slice(0,10);const row:any=dailyMap.get(key);
      dailyBreakdown.push({label:offset===0?'Today':d.toLocaleDateString('en',{month:'short',day:'numeric'}),dateKey:key,visits:n(row?.total_visits),uniqueVisitors:n(row?.unique_visitors)});
    }
    const weeklyMap=new Map(weekly.rows.map((r:any)=>[r.period,r]));
    const weeklyBreakdown:VisitorBreakdownItem[]=[];
    for(let offset=7;offset>=0;offset--){
      const d=new Date();d.setDate(d.getDate()-offset*7);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));
      const key=d.toISOString().slice(0,10);const row:any=weeklyMap.get(key);
      weeklyBreakdown.push({label:offset===0?'This Week':`Week -${offset}`,visits:n(row?.visits),uniqueVisitors:n(row?.uniques)});
    }
    const monthlyMap=new Map(monthly.rows.map((r:any)=>[r.period,r]));
    const monthlyBreakdown:VisitorBreakdownItem[]=[];
    for(let offset=11;offset>=0;offset--){
      const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-offset);const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;const row:any=monthlyMap.get(key);
      monthlyBreakdown.push({label:d.toLocaleDateString('en',{month:'short',year:'2-digit'}),dateKey:key,visits:n(row?.visits),uniqueVisitors:n(row?.uniques)});
    }
    const yearlyMap=new Map(yearly.rows.map((r:any)=>[String(r.period),r]));
    const yearNow=new Date().getFullYear();const yearlyBreakdown:VisitorBreakdownItem[]=[];
    for(let year=yearNow-3;year<=yearNow;year++){const row:any=yearlyMap.get(String(year));yearlyBreakdown.push({label:year===yearNow?`${year} (YTD)`:String(year),visits:n(row?.visits),uniqueVisitors:n(row?.uniques)});}
    const t=totals.rows[0]||{};
    return {today:n(t.today),thisWeek:n(t.this_week),thisMonth:n(t.this_month),thisYear:n(t.this_year),totalAllTime:n(t.total),uniqueToday:n(t.unique_today),uniqueThisWeek:n(t.unique_week),uniqueThisMonth:n(t.unique_month),uniqueThisYear:n(t.unique_year),dailyBreakdown,weeklyBreakdown,monthlyBreakdown,yearlyBreakdown};
  }

}

export const postgresStore = PostgresStore.getInstance();
