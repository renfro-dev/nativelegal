/**
 * Native Legal Design System - Spacing Tokens
 * Consistent spacing system for legal industry design
 */

export const spacing = {
  // Base spacing scale (8px grid system)
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Semantic spacing tokens
export const semanticSpacing = {
  // Component spacing
  component: {
    xs: spacing[1],      // 4px - Tight spacing
    sm: spacing[2],      // 8px - Small spacing
    md: spacing[4],      // 16px - Medium spacing
    lg: spacing[6],      // 24px - Large spacing
    xl: spacing[8],      // 32px - Extra large spacing
    '2xl': spacing[12],  // 48px - 2x large spacing
    '3xl': spacing[16],  // 64px - 3x large spacing
  },

  // Layout spacing
  layout: {
    section: spacing[16],    // 64px - Section spacing
    container: spacing[8],   // 32px - Container padding
    grid: spacing[6],        // 24px - Grid gaps
    stack: spacing[4],       // 16px - Stack spacing
  },

  // Content spacing
  content: {
    paragraph: spacing[4],   // 16px - Paragraph spacing
    heading: spacing[6],     // 24px - Heading spacing
    list: spacing[2],        // 8px - List item spacing
    block: spacing[8],       // 32px - Block spacing
  },

  // Form spacing
  form: {
    field: spacing[4],       // 16px - Form field spacing
    group: spacing[6],       // 24px - Form group spacing
    section: spacing[8],     // 32px - Form section spacing
  },

  // Legal industry specific
  legal: {
    caseStudy: spacing[8],   // 32px - Case study spacing
    testimonial: spacing[6], // 24px - Testimonial spacing
    practiceArea: spacing[4], // 16px - Practice area spacing
    attorney: spacing[6],    // 24px - Attorney profile spacing
  },
} as const;

// Responsive spacing (Mobile-first)
export const responsiveSpacing = {
  // Section spacing
  section: {
    mobile: spacing[12],     // 48px on mobile
    tablet: spacing[16],     // 64px on tablet
    desktop: spacing[20],    // 80px on desktop
  },

  // Container padding
  container: {
    mobile: spacing[4],      // 16px on mobile
    tablet: spacing[6],      // 24px on tablet
    desktop: spacing[8],     // 32px on desktop
  },

  // Grid gaps
  grid: {
    mobile: spacing[4],      // 16px on mobile
    tablet: spacing[6],      // 24px on tablet
    desktop: spacing[8],     // 32px on desktop
  },
} as const;

// CSS Custom Properties
export const cssVariables = {
  '--spacing-0': spacing[0],
  '--spacing-1': spacing[1],
  '--spacing-2': spacing[2],
  '--spacing-3': spacing[3],
  '--spacing-4': spacing[4],
  '--spacing-5': spacing[5],
  '--spacing-6': spacing[6],
  '--spacing-8': spacing[8],
  '--spacing-10': spacing[10],
  '--spacing-12': spacing[12],
  '--spacing-16': spacing[16],
  '--spacing-20': spacing[20],
  '--spacing-24': spacing[24],
  '--spacing-32': spacing[32],
  
  '--spacing-component-xs': semanticSpacing.component.xs,
  '--spacing-component-sm': semanticSpacing.component.sm,
  '--spacing-component-md': semanticSpacing.component.md,
  '--spacing-component-lg': semanticSpacing.component.lg,
  '--spacing-component-xl': semanticSpacing.component.xl,
  
  '--spacing-layout-section': semanticSpacing.layout.section,
  '--spacing-layout-container': semanticSpacing.layout.container,
  '--spacing-layout-grid': semanticSpacing.layout.grid,
  '--spacing-layout-stack': semanticSpacing.layout.stack,
  
  '--spacing-content-paragraph': semanticSpacing.content.paragraph,
  '--spacing-content-heading': semanticSpacing.content.heading,
  '--spacing-content-list': semanticSpacing.content.list,
  '--spacing-content-block': semanticSpacing.content.block,
} as const;

export type Spacing = keyof typeof spacing;
export type SemanticSpacing = keyof typeof semanticSpacing;
export type ResponsiveSpacing = keyof typeof responsiveSpacing;
