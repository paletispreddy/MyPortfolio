export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  label: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface PillarItem {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
}

export interface BusinessInterest {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  tags: string[];
}

export interface WorkingPrinciple {
  title: string;
  description: string;
}

export const siteConfig = {
  name: 'Siva Prasad Reddy Paleti',
  eyebrow: 'TECHNOLOGY ENTREPRENEUR · BUSINESS ADMINISTRATOR · INNOVATOR',
  tagline: 'Business Builder | Strategy, Leadership & Growth',
  shortIntro: 'I build businesses, develop innovative products, and transform ideas into sustainable opportunities.',
  email: 'paletispreddy@gmail.com',
  philosophy: 'A successful business is not just built on ideas; it is built on vision, execution, trust, innovation, and the courage to grow.',
  
  socials: {
    linkedin: 'https://www.linkedin.com/in/paletispreddy',
    x: 'https://x.com/paletispreddy',
    instagram: 'https://www.instagram.com/paletispreddy',
    youtube: 'https://www.youtube.com/@paletispreddy',
    github: 'https://github.com/paletispreddy',
    whatsapp: 'https://wa.me/919912211045',
  },

  nav: [
    { name: 'HOME', href: '/' },
    { name: 'PHOTOS', href: '/photos' },
    { name: 'VIDEOS', href: '/videos' },
    { name: 'ABOUT', href: '/about' },
  ] as NavItem[],

  marqueeWords: [
    'Business Strategy',
    'Entrepreneurship',
    'SaaS Products',
    'Business Automation',
    'Operational Excellence',
    'Leadership',
    'Customer Success',
    'Strategic Expansion',
  ],

  pillars: [
    {
      id: 'vision',
      number: '01',
      title: 'Vision',
      description: 'Identifying emerging market trends, architecting long-term horizons, and envisioning transformative ventures.',
      iconName: 'Compass',
    },
    {
      id: 'execution',
      number: '02',
      title: 'Execution',
      description: 'Translating high-level concepts into rigorous operating rhythms, scalable architectures, and tangible business outcomes.',
      iconName: 'Activity',
    },
    {
      id: 'trust',
      number: '03',
      title: 'Trust',
      description: 'Cultivating authentic, enduring stakeholder relationships, governance integrity, and uncompromising customer loyalty.',
      iconName: 'ShieldCheck',
    },
    {
      id: 'innovation',
      number: '04',
      title: 'Innovation',
      description: 'Synthesizing modern technology stacks, lean process automation, and bold product experiments into defensible value.',
      iconName: 'Cpu',
    },
  ] as PillarItem[],

  storyParagraphs: [
    'I am passionate about building businesses, developing innovative products, and transforming ideas into sustainable business opportunities. My approach combines strategic thinking, operational excellence, technology, and customer-focused innovation to create solutions that deliver real business value.',
    'With experience in business administration, organizational management, product development, and technology-driven business operations, I enjoy identifying opportunities, streamlining processes, and building systems that support long-term growth.',
    'I believe successful businesses are built through a combination of clear vision, strong execution, continuous improvement, and the ability to adapt to changing market needs.',
    'My business interests include SaaS product development, technology entrepreneurship, business process automation, strategic planning, customer relationship management, and developing scalable solutions for emerging markets.',
  ],

  coreInterests: [
    {
      id: 1,
      title: 'Business Strategy',
      subtitle: 'Planning, Vision, Market Opportunities',
      iconName: 'TrendingUp',
      tags: ['Market Analysis', 'Growth Roadmaps', 'M&A Strategy'],
    },
    {
      id: 2,
      title: 'Entrepreneurship',
      subtitle: 'Building Products, New Ventures & Business Models',
      iconName: 'Sparkles',
      tags: ['Venture Creation', 'Business Modeling', 'Go-To-Market'],
    },
    {
      id: 3,
      title: 'Product Development',
      subtitle: 'SaaS Solutions & Technology Products',
      iconName: 'Layers',
      tags: ['SaaS Architecture', 'UX / Product Design', 'Agile Roadmaps'],
    },
    {
      id: 4,
      title: 'Business Operations',
      subtitle: 'Process Optimization & Operational Excellence',
      iconName: 'Settings',
      tags: ['SOP Systems', 'Resource Allocation', 'Lean Ops'],
    },
    {
      id: 5,
      title: 'Leadership & Administration',
      subtitle: 'Team Management, HR & Organizational Development',
      iconName: 'Users',
      tags: ['Executive Leadership', 'Culture & Talent', 'Corporate Governance'],
    },
    {
      id: 6,
      title: 'Business Automation',
      subtitle: 'Digital Transformation & Workflow Optimization',
      iconName: 'Workflow',
      tags: ['No-Code / Low-Code', 'API Integrations', 'AI Transformation'],
    },
    {
      id: 7,
      title: 'Customer Success',
      subtitle: 'Client Relationships, Service Quality & Business Growth',
      iconName: 'HeartHandshake',
      tags: ['Retention Engines', 'CSAT Frameworks', 'Enterprise Accounts'],
    },
    {
      id: 8,
      title: 'Strategic Expansion',
      subtitle: 'Partnerships, Market Development & Scalability',
      iconName: 'Globe',
      tags: ['Alliances', 'Cross-Border Scale', 'Distribution Channels'],
    },
  ] as BusinessInterest[],

  workingPrinciples: [
    {
      title: 'Practical',
      description: 'I prefer solutions that can actually be implemented.',
    },
    {
      title: 'Technology-Driven',
      description: 'I enjoy exploring new tools and technologies.',
    },
    {
      title: 'Detail-Oriented',
      description: 'I value step-by-step plans, precise configurations and complete implementation.',
    },
    {
      title: 'Cost-Conscious',
      description: 'I find economical alternatives without compromising essential functionality.',
    },
    {
      title: 'Innovative',
      description: 'I combine existing technologies to create new products.',
    },
    {
      title: 'Persistent',
      description: 'I keep solving until the solution works.',
    },
  ] as WorkingPrinciple[],
};
