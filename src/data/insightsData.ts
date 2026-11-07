export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: 'Engineering' | 'Cybersecurity' | 'Brand Systems' | 'Cloud Architecture';
  readingTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  tags: string[];
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      takeaway?: string;
    }[];
    conclusion: string;
  };
}

export const sampleArticles: Article[] = [
  {
    id: 'art-1',
    slug: 'architecting-high-throughput-web-platforms',
    title: "Architecting High-Throughput Web Platforms for East Africa's Modern Enterprises",
    summary:
      'How to engineer reactive web architectures that withstand unstable network latencies, variable bandwidths, and surging traffic loads without sacrificing visual craftsmanship.',
    category: 'Engineering',
    readingTime: '5 min read',
    publishedDate: 'October 18, 2026',
    author: {
      name: 'JD Fusion Engineering Team',
      role: 'Systems Architecture & Infrastructure',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=85',
    },
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    tags: ['Web Performance', 'React 19', 'TypeScript', 'Node.js', 'East Africa Tech'],
    content: {
      intro:
        'Building software for rapidly expanding markets demands more than standard component libraries. In regions where mobile network conditions swing dramatically between 5G fiber and congested 3G towers, resilient full-stack architecture is a direct revenue driver.',
      sections: [
        {
          heading: '1. Zero-Jank Network Resilience & Client State Caching',
          body: [
            'Traditional single-page apps frequently freeze or flash blank screens during intermittent connection drops. At JD Fusion Technologies, we mandate an optimistic client-side hydration pattern combined with aggressive in-memory caching.',
            'By pre-fetching adjacent route payloads and validating data mutations using server-authoritative timestamps, user interactions feel instantaneous regardless of carrier bottlenecks.',
          ],
          takeaway: 'Optimistic UI updates paired with resilient background synchronization transform perceptions of application speed.',
        },
        {
          heading: '2. Database Scale-to-Zero and Connection Pooling',
          body: [
            'Relational integrity remains the gold standard for enterprise transactional data. Utilizing managed PostgreSQL with strict connection pooling ensures microsecond response times during peak demand surges while maintaining zero idle cost during off-hours.',
            'Indexing strategies should prioritize compound query paths common in multi-tenant portals, cutting query execution times from hundreds of milliseconds to under 4 milliseconds.',
          ],
          takeaway: 'Never let connection exhaustion degrade user experience during morning traffic spikes.',
        },
      ],
      conclusion:
        'Engineering excellence is not about using the newest experimental library; it is about building enduring systems that deliver uncompromising speed, reliability, and security for every user on any device.',
    },
  },
  {
    id: 'art-2',
    slug: 'zero-trust-cybersecurity-and-government-portals',
    title: 'Zero-Trust Cybersecurity & E-Government Portal Architecture in Kenya',
    summary:
      'An architectural blueprint for shielding public portals, KRA iTax workflows, and business licensing systems against credential stuffing, automated scrapers, and SQL injection probes.',
    category: 'Cybersecurity',
    readingTime: '6 min read',
    publishedDate: 'October 12, 2026',
    author: {
      name: 'JD Fusion Security Team',
      role: 'Cybersecurity & Cloud Infrastructure',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=85',
    },
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    tags: ['Cybersecurity', 'Sentinel', 'Zero Trust', 'Compliance', 'eCitizen'],
    content: {
      intro:
        'As public administration, tax compliance, and business registries move entirely into online digital environments, vulnerability scanners and rogue probing tools have become relentless. Securing these touchpoints requires a multi-layered defensive posture.',
      sections: [
        {
          heading: '1. Perimeter Threat Interception at the Edge',
          body: [
            'Automated scanners probe thousands of endpoints daily searching for unpatched vulnerabilities, environment dumps, or open admin interfaces. Our Sentinel security architecture intercepts malicious signatures before requests ever reach business logic.',
            'Every incoming request is screened for SQL injection vectors, path traversal anomalies, and suspicious user-agent fingerprints in real time, logging geographic and IP telemetry to audit databases.',
          ],
          takeaway: 'Block threats at the gateway before they consume computational or database resources.',
        },
        {
          heading: '2. Strict Audit Trails and Tamper-Resistant Logging',
          body: [
            'Security compliance is only as good as forensic visibility. When citizen records, tax clearances, or corporate identities are submitted, immutable activity logs must document exact timestamps, actors, and state mutations.',
            'Encrypted database logs guarantee accountability while giving regulatory compliance teams full audit transparency.',
          ],
          takeaway: 'Comprehensive logging turns security from a guessing game into an empirical science.',
        },
      ],
      conclusion:
        'Security must never be an afterthought bolted onto legacy software. At JD Fusion Technologies, zero-compromise security is baked into our foundational baseline from day zero.',
    },
  },
  {
    id: 'art-3',
    slug: 'brand-identity-engineering-precision-design',
    title: 'The Engineering of Brand Identity: Merging Vector Precision with Product UI',
    summary:
      'Why iconic brands cannot rely on disjointed graphics. How systematic design tokens, vector geometry, and digital agency principles create cohesive, memorable software products.',
    category: 'Brand Systems',
    readingTime: '4 min read',
    publishedDate: 'October 5, 2026',
    author: {
      name: 'JD Fusion Product Design Team',
      role: 'Brand Systems & Product UI/UX',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=85',
    },
    coverImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1200&auto=format&fit=crop&q=80',
    tags: ['Brand Identity', 'UI/UX Design', 'Design Systems', 'Typography', 'Aesthetics'],
    content: {
      intro:
        'Great technology without impeccable design is invisible; great design without technical horsepower is fragile. Bridging this divide requires treating visual identity not as decoration, but as an engineering discipline.',
      sections: [
        {
          heading: '1. The Geometry of Distinction',
          body: [
            'A memorable mark is mathematically harmonious. From golden ratio grid curves to responsive SVG icon scalability, every brand element we create is crafted to render crisply across massive billboards, mobile app headers, and tiny favicon resolutions.',
            'Color harmonies must be calibrated for digital screens and physical print simultaneously, avoiding muddy transitions and maintaining contrast accessibility.',
          ],
          takeaway: 'True brand authority is recognized in an instant, across any screen size or printed surface.',
        },
        {
          heading: '2. Connecting Brand Voice Directly to User Experience',
          body: [
            'A brand identity system extends far beyond a logo. It establishes typography hierarchies, button padding formulas, motion easing curves, and voice guidelines.',
            'When a customer transitions from seeing a social announcement to launching the web portal, every micro-interaction reinforces trust, precision, and forward momentum.',
          ],
          takeaway: 'Consistency breeds familiarity; familiarity breeds trust; trust converts into long-term customer loyalty.',
        },
      ],
      conclusion:
        'At JD Fusion Technologies, we build brands that command respect and software systems engineered to endure.',
    },
  },
];
