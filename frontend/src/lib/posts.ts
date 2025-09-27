export interface Post {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  tags: string[]
  author: string
  content: string
  heroImage?: string
  featuredImage?: string
  socialImage?: string
  thumbnailImage?: string
}

// Static post data that can be used in both client and server components
export function getAllPosts(): Post[] {
  const posts = [
    {
      slug: 'ai-readiness-assessment-law-firms-2025',
      title: 'AI Readiness Assessment for Law Firms: A Comprehensive 2025 Guide',
      description: 'Complete framework for evaluating your law firm\'s AI preparedness, including technical infrastructure, team readiness, and strategic planning.',
      date: '2025-09-01',
      readTime: '12 min read',
      category: 'AI Strategy',
      tags: ['AI Readiness', 'Assessment', 'Strategy', 'Implementation'],
      author: 'SingleShot AI',
      content: '',
      heroImage: '/images/ai-readiness-assessment-law-firms-2025-hero-1200x675.svg',
      featuredImage: '/images/ai-readiness-assessment-law-firms-2025-featured-400x300.svg',
      socialImage: '/images/ai-readiness-assessment-law-firms-2025-social-1200x630.svg',
      thumbnailImage: '/images/ai-readiness-assessment-law-firms-2025-thumbnail-300x200.svg',
    },
    {
      slug: 'legal-ai-implementation-roadmap-mid-size-firms',
      title: 'Legal AI Implementation Roadmap for Mid-Size Firms',
      description: 'Step-by-step guide for mid-size law firms to successfully implement AI technologies while maintaining operational excellence.',
      date: '2025-08-01',
      readTime: '15 min read',
      category: 'Implementation',
      tags: ['Implementation', 'Mid-Size Firms', 'Roadmap', 'Planning'],
      author: 'SEO Machine AI',
      content: '',
      heroImage: '/images/legal-ai-implementation-roadmap-mid-size-firms-hero-1200x675.svg',
      featuredImage: '/images/legal-ai-implementation-roadmap-mid-size-firms-featured-400x300.svg',
      socialImage: '/images/legal-ai-implementation-roadmap-mid-size-firms-social-1200x630.svg',
      thumbnailImage: '/images/legal-ai-implementation-roadmap-mid-size-firms-thumbnail-300x200.svg',
    },
    {
      slug: 'ai-ethics-compliance-law-firms-state-requirements',
      title: 'AI Ethics and Compliance for Law Firms: State Requirements',
      description: 'Navigate the complex landscape of AI ethics and compliance requirements across different states and jurisdictions.',
      date: '2025-07-01',
      readTime: '10 min read',
      category: 'Compliance',
      tags: ['Ethics', 'Compliance', 'Regulations', 'State Requirements'],
      author: 'SEO Machine AI',
      content: '',
      heroImage: '/images/ai-ethics-compliance-law-firms-state-requirements-hero-1200x675.svg',
      featuredImage: '/images/ai-ethics-compliance-law-firms-state-requirements-featured-400x300.svg',
      socialImage: '/images/ai-ethics-compliance-law-firms-state-requirements-social-1200x630.svg',
      thumbnailImage: '/images/ai-ethics-compliance-law-firms-state-requirements-thumbnail-300x200.svg',
    },
    {
      slug: 'ai-tool-vendor-evaluation-framework-legal',
      title: 'AI Tool Vendor Evaluation Framework for Legal Practices',
      description: 'Comprehensive framework for evaluating and selecting AI tool vendors that align with your legal practice needs.',
      date: '2025-06-01',
      readTime: '11 min read',
      category: 'Vendor Selection',
      tags: ['Vendor Evaluation', 'Tool Selection', 'Framework', 'Legal Tech'],
      author: 'SEO Machine AI',
      content: '',
      heroImage: '/images/ai-tool-vendor-evaluation-framework-legal-hero-1200x675.svg',
      featuredImage: '/images/ai-tool-vendor-evaluation-framework-legal-featured-400x300.svg',
      socialImage: '/images/ai-tool-vendor-evaluation-framework-legal-social-1200x630.svg',
      thumbnailImage: '/images/ai-tool-vendor-evaluation-framework-legal-thumbnail-300x200.svg',
    },
    {
      slug: 'change-management-strategies-legal-ai-adoption',
      title: 'Change Management Strategies for Legal AI Adoption',
      description: 'Proven strategies for managing organizational change during AI adoption in legal practices.',
      date: '2025-05-01',
      readTime: '13 min read',
      category: 'Change Management',
      tags: ['Change Management', 'AI Adoption', 'Organizational Change', 'Strategy'],
      author: 'SEO Machine AI',
      content: '',
      heroImage: '/images/change-management-strategies-legal-ai-adoption-hero-1200x675.svg',
      featuredImage: '/images/change-management-strategies-legal-ai-adoption-featured-400x300.svg',
      socialImage: '/images/change-management-strategies-legal-ai-adoption-social-1200x630.svg',
      thumbnailImage: '/images/change-management-strategies-legal-ai-adoption-thumbnail-300x200.svg',
    },
    {
      slug: 'revops-metrics-ai-roi-legal-practice-management',
      title: 'RevOps Metrics and AI ROI in Legal Practice Management',
      description: 'Key metrics and ROI measurement strategies for AI investments in legal revenue operations.',
      date: '2025-04-01',
      readTime: '9 min read',
      category: 'Revenue Operations',
      tags: ['RevOps', 'Metrics', 'ROI', 'AI Investment'],
      author: 'SEO Machine AI',
      content: '',
      heroImage: '/images/revops-metrics-ai-roi-legal-practice-management-hero-1200x675.svg',
      featuredImage: '/images/revops-metrics-ai-roi-legal-practice-management-featured-400x300.svg',
      socialImage: '/images/revops-metrics-ai-roi-legal-practice-management-social-1200x630.svg',
      thumbnailImage: '/images/revops-metrics-ai-roi-legal-practice-management-thumbnail-300x200.svg',
    },
    {
      slug: 'ai-powered-client-intake-automation-family-law',
      title: 'AI-Powered Client Intake Automation for Family Law Firms: Complete 2025 Guide',
      description: 'Transform your family law practice with AI-powered client intake automation. Reduce no-shows, improve data quality, and enhance client experience while maintaining ethical compliance.',
      date: '2025-03-01',
      readTime: '14 min read',
      category: 'Family Law Automation',
      tags: ['AI Client Intake', 'Family Law Automation', 'Client Experience', 'Intake Optimization', 'Legal Technology'],
      author: 'Native Legal Team',
      content: '',
      heroImage: '/images/ai-powered-client-intake-automation-family-law-hero-1200x675.svg',
      featuredImage: '/images/ai-powered-client-intake-automation-family-law-featured-400x300.svg',
      socialImage: '/images/ai-powered-client-intake-automation-family-law-social-1200x630.svg',
      thumbnailImage: '/images/ai-powered-client-intake-automation-family-law-thumbnail-300x200.svg',
    },
  ]

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts()
  return posts.find(post => post.slug === slug) || null
}

// Note: getPostContent is now handled server-side in the page component
// This function is kept for compatibility but returns null
export function getPostContent(slug: string): string | null {
  // This function is deprecated - content is now read server-side
  // in the page component to avoid client-side fs module issues
  return null
}
