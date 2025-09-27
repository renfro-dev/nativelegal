/**
 * Native Legal Design System - Container Component
 * SEO-optimized responsive container for legal industry
 */

import React from 'react';
import { spacing } from '../../tokens/spacing';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';
  id?: string;
  role?: string;
  'data-testid'?: string;
}

const maxWidthMap = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

const paddingMap = {
  none: '0',
  sm: spacing[4],    // 16px
  md: spacing[6],    // 24px
  lg: spacing[8],    // 32px
  xl: spacing[12],   // 48px
} as const;

/**
 * Container - Responsive container component
 * Provides consistent max-width and padding across the application
 * Optimized for SEO with semantic HTML and proper structure
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className = '',
  as: Component = 'div',
  id,
  'data-testid': dataTestId,
}) => {
  const containerStyles = {
    maxWidth: maxWidthMap[maxWidth],
    margin: '0 auto',
    paddingLeft: paddingMap[padding],
    paddingRight: paddingMap[padding],
    width: '100%',
  };

  return (
    <Component
      id={id}
      data-testid={dataTestId}
      className={`native-legal-container ${className}`}
      style={containerStyles}
    >
      {children}
    </Component>
  );
};

/**
 * Section - Semantic section container
 * Provides proper HTML5 semantic structure for SEO
 */
export interface SectionProps extends Omit<ContainerProps, 'as'> {
  title?: string;
  description?: string;
  ariaLabel?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  title,
  description,
  ariaLabel,
  className = '',
  ...props
}) => {
  return (
    <Container
      as="section"
      className={`native-legal-section ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {title && (
        <header className="native-legal-section-header">
          <h2 className="native-legal-section-title">{title}</h2>
          {description && (
            <p className="native-legal-section-description">{description}</p>
          )}
        </header>
      )}
      {children}
    </Container>
  );
};

/**
 * Article - Semantic article container
 * Optimized for blog posts and content articles
 */
export interface ArticleProps extends Omit<ContainerProps, 'as'> {
  title?: string;
  author?: string;
  publishDate?: string;
  readingTime?: string;
}

export const Article: React.FC<ArticleProps> = ({
  children,
  title,
  author,
  publishDate,
  readingTime,
  className = '',
  ...props
}) => {
  return (
    <Container
      as="article"
      className={`native-legal-article ${className}`}
      {...props}
    >
      {(title || author || publishDate || readingTime) && (
        <header className="native-legal-article-header">
          {title && <h1 className="native-legal-article-title">{title}</h1>}
          {(author || publishDate || readingTime) && (
            <div className="native-legal-article-meta">
              {author && (
                <span className="native-legal-article-author">By {author}</span>
              )}
              {publishDate && (
                <time className="native-legal-article-date" dateTime={publishDate}>
                  {publishDate}
                </time>
              )}
              {readingTime && (
                <span className="native-legal-article-reading-time">
                  {readingTime} read
                </span>
              )}
            </div>
          )}
        </header>
      )}
      {children}
    </Container>
  );
};

/**
 * Main - Semantic main content container
 * Provides proper HTML5 semantic structure for main content
 */
export interface MainProps extends Omit<ContainerProps, 'as'> {
  role?: string;
}

export const Main: React.FC<MainProps> = ({
  children,
  className = '',
  role = 'main',
  ...props
}) => {
  return (
    <Container
      as="main"
      role={role}
      className={`native-legal-main ${className}`}
      {...props}
    >
      {children}
    </Container>
  );
};

/**
 * Aside - Semantic aside container
 * For sidebar content and related information
 */
export interface AsideProps extends Omit<ContainerProps, 'as'> {
  title?: string;
  ariaLabel?: string;
}

export const Aside: React.FC<AsideProps> = ({
  children,
  title,
  ariaLabel,
  className = '',
  ...props
}) => {
  return (
    <Container
      as="aside"
      className={`native-legal-aside ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {title && (
        <header className="native-legal-aside-header">
          <h2 className="native-legal-aside-title">{title}</h2>
        </header>
      )}
      {children}
    </Container>
  );
};
