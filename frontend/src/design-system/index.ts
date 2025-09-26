/**
 * Native Legal Design System - Main Export
 * SEO-optimized design system for legal industry
 */

// Tokens
export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';

// SEO Components
export * from './components/SEO/SchemaMarkup';

// Layout Components
export * from './components/Layout/Container';

// Content Components
export * from './components/Content/Hero';

// Styles
import './styles/design-system.css';

// Design System Configuration
export const designSystem = {
  name: 'Native Legal Design System',
  version: '1.0.0',
  description: 'SEO-optimized design system for legal industry transformation',
  tokens: {
    colors: 'Available in colors.ts',
    typography: 'Available in typography.ts',
    spacing: 'Available in spacing.ts',
  },
  components: {
    seo: ['SchemaMarkup', 'LegalBusiness', 'Attorney', 'BreadcrumbList', 'FAQPage', 'Article'],
    layout: ['Container', 'Section', 'Article', 'Main', 'Aside'],
    content: ['Hero', 'LegalHero', 'ContentHero'],
  },
  features: [
    'SEO-optimized semantic HTML',
    'Schema.org structured data',
    'Mobile-first responsive design',
    'Accessibility compliance (WCAG 2.1 AA)',
    'Legal industry specific components',
    'Practice-area agnostic architecture',
    'Core Web Vitals optimization',
  ],
} as const;
