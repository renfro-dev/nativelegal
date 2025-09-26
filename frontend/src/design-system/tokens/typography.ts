/**
 * Native Legal Design System - Typography Tokens
 * SEO-optimized typography scale for legal industry
 */

export const typography = {
  // Font Families
  fontFamily: {
    primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },

  // Font Sizes (SEO-optimized scale)
  fontSize: {
    xs: '0.75rem',    // 12px - Small labels, captions
    sm: '0.875rem',   // 14px - Body text, descriptions
    base: '1rem',     // 16px - Default body text
    lg: '1.125rem',   // 18px - Large body text
    xl: '1.25rem',    // 20px - Small headings
    '2xl': '1.5rem',  // 24px - Section headings
    '3xl': '1.875rem', // 30px - Page headings
    '4xl': '2.25rem', // 36px - Hero headings
    '5xl': '3rem',    // 48px - Main hero
    '6xl': '3.75rem', // 60px - Large hero
    '7xl': '4.5rem',  // 72px - Extra large hero
    '8xl': '6rem',    // 96px - Massive hero
    '9xl': '8rem',    // 128px - Ultra large hero
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line Heights (SEO-optimized for readability)
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Styles (Pre-defined combinations)
  textStyles: {
    // Headings (SEO-optimized hierarchy)
    h1: {
      fontSize: '3rem',        // 48px
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',     // 36px
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem',    // 30px
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',      // 24px
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '0em',
    },
    h5: {
      fontSize: '1.25rem',     // 20px
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem',    // 18px
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0em',
    },

    // Body Text
    body: {
      fontSize: '1rem',        // 16px
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0em',
    },
    bodyLarge: {
      fontSize: '1.125rem',    // 18px
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0em',
    },
    bodySmall: {
      fontSize: '0.875rem',    // 14px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0em',
    },

    // UI Text
    caption: {
      fontSize: '0.75rem',     // 12px
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
    label: {
      fontSize: '0.875rem',    // 14px
      fontWeight: '500',
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
    button: {
      fontSize: '1rem',        // 16px
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '0.025em',
    },
    link: {
      fontSize: '1rem',        // 16px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0em',
    },

    // Legal Industry Specific
    legal: {
      caseTitle: {
        fontSize: '1.5rem',    // 24px
        fontWeight: '700',
        lineHeight: '1.3',
        letterSpacing: '-0.025em',
      },
      practiceArea: {
        fontSize: '1.25rem',   // 20px
        fontWeight: '600',
        lineHeight: '1.4',
        letterSpacing: '0em',
      },
      attorneyName: {
        fontSize: '1.125rem',  // 18px
        fontWeight: '600',
        lineHeight: '1.4',
        letterSpacing: '0em',
      },
      testimonial: {
        fontSize: '1.125rem',  // 18px
        fontWeight: '400',
        lineHeight: '1.6',
        letterSpacing: '0em',
        fontStyle: 'italic',
      },
    },
  },

  // Responsive Typography (Mobile-first)
  responsive: {
    h1: {
      base: '2.5rem',    // 40px on mobile
      md: '3rem',        // 48px on tablet
      lg: '3.75rem',     // 60px on desktop
    },
    h2: {
      base: '2rem',      // 32px on mobile
      md: '2.25rem',     // 36px on tablet
      lg: '2.5rem',      // 40px on desktop
    },
    h3: {
      base: '1.5rem',    // 24px on mobile
      md: '1.875rem',    // 30px on tablet
      lg: '2rem',        // 32px on desktop
    },
    body: {
      base: '1rem',      // 16px on mobile
      md: '1.125rem',    // 18px on tablet
      lg: '1.125rem',    // 18px on desktop
    },
  },
} as const;

// CSS Custom Properties for easy theming
export const cssVariables = {
  '--font-family-primary': typography.fontFamily.primary.join(', '),
  '--font-family-heading': typography.fontFamily.heading.join(', '),
  '--font-family-mono': typography.fontFamily.mono.join(', '),
  
  '--font-size-xs': typography.fontSize.xs,
  '--font-size-sm': typography.fontSize.sm,
  '--font-size-base': typography.fontSize.base,
  '--font-size-lg': typography.fontSize.lg,
  '--font-size-xl': typography.fontSize.xl,
  '--font-size-2xl': typography.fontSize['2xl'],
  '--font-size-3xl': typography.fontSize['3xl'],
  '--font-size-4xl': typography.fontSize['4xl'],
  '--font-size-5xl': typography.fontSize['5xl'],
  '--font-size-6xl': typography.fontSize['6xl'],
  
  '--font-weight-normal': typography.fontWeight.normal,
  '--font-weight-medium': typography.fontWeight.medium,
  '--font-weight-semibold': typography.fontWeight.semibold,
  '--font-weight-bold': typography.fontWeight.bold,
  
  '--line-height-tight': typography.lineHeight.tight,
  '--line-height-normal': typography.lineHeight.normal,
  '--line-height-relaxed': typography.lineHeight.relaxed,
} as const;

export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;
export type TextStyle = keyof typeof typography.textStyles;
