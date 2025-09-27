import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://native.legal'),
  title: 'Native Legal - AI Native Transformation Engine for Law Firms',
  description: 'Automate operations and modernized practice management.',
  keywords: [
    'legal AI',
    'law firm AI',
    'AI readiness assessment',
    'legal technology',
    'AI implementation',
    'legal AI ethics',
    'revenue operations legal',
    'AI vendor evaluation',
    'change management legal AI',
    'legal practice automation',
    'family law AI transformation',
    'legal collections improvement',
    'conflict check automation',
    'legal intake process',
    'legal practice management',
    'legal AI technology',
    'law firm modernization'
  ],
  authors: [{ name: 'Native Legal' }],
  creator: 'Native Legal',
  publisher: 'Native Legal',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nativelegal.com',
    siteName: 'Native Legal',
    title: 'Native Legal - AI Native Transformation Engine for Family Law Firms',
    description: 'The AI Native Transformation Engine for Family Law Firms. Automate what your team doesn\'t love doing, improve collections rates, modernize conflict checks, and reimagine your intake process.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Native Legal - AI Native Transformation Engine for Family Law Firms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Native Legal - AI Native Transformation Engine for Family Law Firms',
    description: 'The AI Native Transformation Engine for Family Law Firms. Automate what your team doesn\'t love doing, improve collections rates, modernize conflict checks, and reimagine your intake process.',
    images: ['/og-image.jpg'],
    creator: '@seomachine',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-YWPMEND405`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YWPMEND405', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>

        {/* Structured Data for Legal Website */}
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Native Legal",
              "description": "AI Readiness x Revenue Optimization for Law Firms",
              "url": "https://nativelegal.com",
              "logo": "https://nativelegal.com/logo.svg",
              "sameAs": [
                "https://twitter.com/seomachine",
                "https://linkedin.com/company/seomachine"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              },
              "areaServed": "US",
              "serviceType": "Legal Technology Consulting"
            }
          `}
        </Script>

        {/* Blog Article Structured Data */}
        <Script id="blog-structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Native Legal Studies",
              "description": "Thought leadership at the nexus of technology and revenue for law firms",
              "url": "https://nativelegal.com/blog",
              "publisher": {
                "@type": "Organization",
                "name": "Native Legal",
                "logo": "https://nativelegal.com/logo.svg"
              },
              "mainEntityOfPage": "https://nativelegal.com/blog"
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}