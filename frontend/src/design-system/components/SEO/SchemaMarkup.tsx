/**
 * Native Legal Design System - Schema Markup Component
 * SEO-optimized structured data for legal industry
 */

import React from 'react';

export interface SchemaMarkupProps {
  type: 'LegalBusiness' | 'Attorney' | 'Organization' | 'WebSite' | 'BreadcrumbList' | 'FAQPage' | 'Article';
  data: Record<string, any>;
  children?: React.ReactNode;
}

/**
 * SchemaMarkup - Wrapper component for structured data
 * Automatically injects JSON-LD schema markup for SEO
 */
export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data, children }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData, null, 2),
        }}
      />
    </>
  );
};

/**
 * LegalBusiness - Schema markup for law firm
 */
export interface LegalBusinessProps {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  paymentAccepted?: string[];
  currenciesAccepted?: string;
  children?: React.ReactNode;
}

export const LegalBusiness: React.FC<LegalBusinessProps> = ({
  name,
  description,
  url,
  telephone,
  email,
  address,
  geo,
  openingHours,
  priceRange,
  paymentAccepted,
  currenciesAccepted,
  children,
}) => {
  const schemaData = {
    name,
    description,
    url,
    telephone,
    email,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        ...geo,
      },
    }),
    ...(openingHours && { openingHours }),
    ...(priceRange && { priceRange }),
    ...(paymentAccepted && { paymentAccepted }),
    ...(currenciesAccepted && { currenciesAccepted }),
  };

  return (
    <SchemaMarkup type="LegalBusiness" data={schemaData}>
      {children}
    </SchemaMarkup>
  );
};

/**
 * Attorney - Schema markup for attorney profiles
 */
export interface AttorneyProps {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  url?: string;
  email?: string;
  telephone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  worksFor?: {
    '@type': 'LegalBusiness';
    name: string;
  };
  alumniOf?: string[];
  knowsAbout?: string[];
  children?: React.ReactNode;
}

export const Attorney: React.FC<AttorneyProps> = ({
  name,
  jobTitle,
  description,
  image,
  url,
  email,
  telephone,
  address,
  worksFor,
  alumniOf,
  knowsAbout,
  children,
}) => {
  const schemaData = {
    name,
    jobTitle,
    description,
    ...(image && { image }),
    ...(url && { url }),
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...address,
      },
    }),
    ...(worksFor && { worksFor }),
    ...(alumniOf && { alumniOf }),
    ...(knowsAbout && { knowsAbout }),
  };

  return (
    <SchemaMarkup type="Attorney" data={schemaData}>
      {children}
    </SchemaMarkup>
  );
};

/**
 * BreadcrumbList - Schema markup for breadcrumb navigation
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbListProps {
  items: BreadcrumbItem[];
  children?: React.ReactNode;
}

export const BreadcrumbList: React.FC<BreadcrumbListProps> = ({ items, children }) => {
  const schemaData = {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <SchemaMarkup type="BreadcrumbList" data={schemaData}>
      {children}
    </SchemaMarkup>
  );
};

/**
 * FAQPage - Schema markup for FAQ sections
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQPageProps {
  faqs: FAQItem[];
  children?: React.ReactNode;
}

export const FAQPage: React.FC<FAQPageProps> = ({ faqs, children }) => {
  const schemaData = {
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <SchemaMarkup type="FAQPage" data={schemaData}>
      {children}
    </SchemaMarkup>
  );
};

/**
 * Article - Schema markup for blog posts and articles
 */
export interface ArticleProps {
  headline: string;
  description: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  children?: React.ReactNode;
}

export const Article: React.FC<ArticleProps> = ({
  headline,
  description,
  author,
  publisher,
  datePublished,
  dateModified,
  image,
  url,
  children,
}) => {
  const schemaData = {
    headline,
    description,
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.logo && { logo: publisher.logo }),
    },
    datePublished,
    ...(dateModified && { dateModified }),
    ...(image && { image }),
    url,
  };

  return (
    <SchemaMarkup type="Article" data={schemaData}>
      {children}
    </SchemaMarkup>
  );
};
