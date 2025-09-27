/**
 * Native Legal Design System - Hero Component
 * SEO-optimized hero sections for legal industry
 */

import React from 'react';
import { Container } from '../Layout/Container';

export interface HeroProps {
  children?: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    primary: {
      text: string;
      href: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      href: string;
      onClick?: () => void;
    };
  };
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  alignment?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
  'data-testid'?: string;
}

const sizeMap = {
  sm: 'py-12 lg:py-16',      // 48px / 64px
  md: 'py-16 lg:py-24',      // 64px / 96px
  lg: 'py-24 lg:py-32',      // 96px / 128px
  xl: 'py-32 lg:py-40',      // 128px / 160px
} as const;

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

/**
 * Hero - Main hero section component
 * Optimized for SEO with proper heading hierarchy and semantic structure
 */
export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  cta,
  backgroundImage,
  backgroundVideo,
  overlay = true,
  alignment = 'center',
  size = 'lg',
  className = '',
  id,
  'data-testid': dataTestId,
}) => {
  const heroStyles = {
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }),
  };

  return (
    <section
      id={id}
      data-testid={dataTestId}
      className={`native-legal-hero relative ${sizeMap[size]} ${className}`}
      style={heroStyles}
    >
      {/* Background Video */}
      {backgroundVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}

      {/* Content */}
      <div className="relative z-10">
        <Container maxWidth="xl" padding="lg">
          <div className={`${alignmentMap[alignment]} max-w-4xl mx-auto`}>
            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg text-blue-100 mb-4 font-medium">
                {subtitle}
              </p>
            )}

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
                {description}
              </p>
            )}

            {/* Call to Action */}
            {cta && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={cta.primary.href}
                  onClick={cta.primary.onClick}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  {cta.primary.text}
                </a>
                {cta.secondary && (
                  <a
                    href={cta.secondary.href}
                    onClick={cta.secondary.onClick}
                    className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors text-lg"
                  >
                    {cta.secondary.text}
                  </a>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
};

/**
 * LegalHero - Specialized hero for legal services
 * Includes trust signals and legal-specific elements
 */
export interface LegalHeroProps extends Omit<HeroProps, 'title' | 'subtitle'> {
  practiceArea: string;
  location?: string;
  trustSignals?: {
    yearsExperience?: number;
    casesWon?: number;
    clientSatisfaction?: number;
    awards?: string[];
  };
}

export const LegalHero: React.FC<LegalHeroProps> = ({
  practiceArea,
  location,
  trustSignals,
  description,
  cta,
  className = '',
  ...props
}) => {
  const title = `Expert ${practiceArea} Services${location ? ` in ${location}` : ''}`;
  const subtitle = 'Trusted Legal Representation';

  return (
    <Hero
      title={title}
      subtitle={subtitle}
      description={description}
      cta={cta}
      className={`native-legal-legal-hero ${className}`}
      {...props}
    >
      {/* Trust Signals */}
      {trustSignals && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {trustSignals.yearsExperience && (
            <div className="native-legal-trust-signal">
              <div className="text-3xl font-bold text-white">
                {trustSignals.yearsExperience}+
              </div>
              <div className="text-sm text-gray-200">Years Experience</div>
            </div>
          )}
          {trustSignals.casesWon && (
            <div className="native-legal-trust-signal">
              <div className="text-3xl font-bold text-white">
                {trustSignals.casesWon}+
              </div>
              <div className="text-sm text-gray-200">Cases Won</div>
            </div>
          )}
          {trustSignals.clientSatisfaction && (
            <div className="native-legal-trust-signal">
              <div className="text-3xl font-bold text-white">
                {trustSignals.clientSatisfaction}%
              </div>
              <div className="text-sm text-gray-200">Client Satisfaction</div>
            </div>
          )}
          {trustSignals.awards && trustSignals.awards.length > 0 && (
            <div className="native-legal-trust-signal">
              <div className="text-3xl font-bold text-white">
                {trustSignals.awards.length}
              </div>
              <div className="text-sm text-gray-200">Awards</div>
            </div>
          )}
        </div>
      )}
    </Hero>
  );
};

/**
 * ContentHero - Hero for content pages (blog, articles)
 * Optimized for content marketing and SEO
 */
export interface ContentHeroProps extends Omit<HeroProps, 'title' | 'subtitle'> {
  headline: string;
  author?: string;
  publishDate?: string;
  readingTime?: string;
  category?: string;
  tags?: string[];
}

export const ContentHero: React.FC<ContentHeroProps> = ({
  headline,
  author,
  publishDate,
  readingTime,
  category,
  tags,
  description,
  className = '',
  ...props
}) => {
  return (
    <Hero
      title={headline}
      description={description}
      className={`native-legal-content-hero ${className}`}
      {...props}
    >
      {/* Content Meta */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-200">
        {category && (
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full">
            {category}
          </span>
        )}
        {author && (
          <span>By {author}</span>
        )}
        {publishDate && (
          <time dateTime={publishDate}>
            {new Date(publishDate).toLocaleDateString()}
          </time>
        )}
        {readingTime && (
          <span>{readingTime} read</span>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-200 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Hero>
  );
};
