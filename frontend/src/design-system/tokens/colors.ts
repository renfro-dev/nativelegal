/**
 * Native Legal Design System - Color Tokens
 * SEO-optimized color palette for legal industry
 */

export const colors = {
  // Primary Colors - Trust & Professionalism
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Primary blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af', // Primary blue dark
    900: '#1e3a8a',
    950: '#172554',
  },

  // Secondary Colors - Professional & Neutral
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Secondary slate light
    600: '#475569', // Secondary slate
    700: '#334155', // Secondary slate dark
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Accent Colors - Actions & States
  accent: {
    green: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669', // Success, positive actions
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    amber: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706', // Warnings, attention
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626', // Errors, urgent actions
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },

  // Neutral Colors - Backgrounds & Text
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f8fafc',   // Light backgrounds
      100: '#f1f5f9',  // Subtle borders
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',  // Dark text, headers
    },
  },

  // Semantic Colors - Context-specific
  semantic: {
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#3b82f6',
  },

  // Legal Industry Specific
  legal: {
    trust: '#1e40af',      // Trust and authority
    expertise: '#475569',  // Professional expertise
    action: '#3b82f6',     // Call-to-action
    success: '#059669',    // Positive outcomes
  },
} as const;

// CSS Custom Properties for easy theming
export const cssVariables = {
  '--color-primary': colors.primary[500],
  '--color-primary-dark': colors.primary[800],
  '--color-primary-light': colors.primary[300],
  '--color-secondary': colors.secondary[600],
  '--color-secondary-light': colors.secondary[500],
  '--color-secondary-dark': colors.secondary[700],
  '--color-accent-green': colors.accent.green[600],
  '--color-accent-amber': colors.accent.amber[600],
  '--color-accent-red': colors.accent.red[600],
  '--color-neutral-white': colors.neutral.white,
  '--color-neutral-gray-50': colors.neutral.gray[50],
  '--color-neutral-gray-100': colors.neutral.gray[100],
  '--color-neutral-gray-900': colors.neutral.gray[900],
  '--color-legal-trust': colors.legal.trust,
  '--color-legal-expertise': colors.legal.expertise,
  '--color-legal-action': colors.legal.action,
  '--color-legal-success': colors.legal.success,
} as const;

export type ColorToken = keyof typeof colors;
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
