import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { TableOfContents } from '@/components/TableOfContents'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Native Legal`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      images: [
        {
          url: post.socialImage || post.heroImage || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.socialImage || post.heroImage || '/og-image.jpg'],
    },
  }
}

async function getPostContent(slug: string): Promise<string | null> {
  try {
    // Try the content directory
    const contentPath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`)
    if (fs.existsSync(contentPath)) {
      return fs.readFileSync(contentPath, 'utf8')
    }

    return null
  } catch {
    console.error(`Error reading post content for ${slug}`)
    return null
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const content = await getPostContent(slug)

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
          <p className="text-gray-300 mb-8">The content for this blog post could not be loaded.</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  // Parse the MDX content
  const { content: mdxContent } = matter(content)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">Native Legal</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Implementation Guides
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-300">
              {post.category}
            </span>
            <div className="flex items-center text-sm text-gray-300">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <User className="w-4 h-4 mr-1" />
              {post.author}
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-300"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* Main Content */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Table of Contents */}
          <TableOfContents content={mdxContent} />

          {/* Article Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-emerald-400 mb-2">📚 {post.title}</h2>
              <p className="text-gray-300">
                {post.description}
              </p>
            </div>

            {/* Render the actual MDX content */}
            <div className="prose prose-invert max-w-none">
              {mdxContent
                .split('\n')
                .filter(line => line.trim()) // Remove empty lines
                .filter(line => {
                  const text = line.trim().toLowerCase();
                  // Filter out duplicate TOC entries and list-like TOC content
                  return !text.includes('table of contents') &&
                         !text.includes('## table of contents') &&
                         !text.includes('### table of contents') &&
                         !text.includes('contents') &&
                         !text.match(/^-\s*\[.*\]\(#.*\)/) && // Remove markdown TOC links like "- [Section](#section)"
                         !text.match(/^\d+\.\s*\[.*\]\(#.*\)/) && // Remove numbered TOC links
                         !text.match(/^-\s*[a-z\s]+:\s*[a-z\s]+$/i) && // Remove plain TOC entries like "- Section: Description"
                         !(text.startsWith('-') && text.includes(':') && text.length < 100); // Remove short colon-separated list items
                })
                .map((line, index) => {
                  const trimmed = line.trim();

                  // Clean up symbols first
                  const cleanLine = trimmed
                    .replace(/\{[^}]*\}/g, '') // Remove {anything}
                    .replace(/^\s*\*+\s*/, '') // Remove leading asterisks
                    .trim();

                  // Skip if empty after cleaning
                  if (!cleanLine) return null;

                  // Main Headers (##)
                  if (trimmed.startsWith('## ')) {
                    const headerText = cleanLine.replace(/^#+\s*/, '');
                    const headerId = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <h2 key={index} id={headerId} className="text-3xl font-bold text-white mb-6 mt-12 first:mt-8">
                        {headerText}
                      </h2>
                    );
                  }

                  // Sub Headers (###)
                  if (trimmed.startsWith('### ')) {
                    const headerText = cleanLine.replace(/^#+\s*/, '');
                    const headerId = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <h3 key={index} id={headerId} className="text-xl font-semibold text-emerald-400 mb-4 mt-8">
                        {headerText}
                      </h3>
                    );
                  }

                  // Minor Headers (####)
                  if (trimmed.startsWith('#### ')) {
                    const headerText = cleanLine.replace(/^#+\s*/, '');
                    const headerId = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <h4 key={index} id={headerId} className="text-lg font-medium text-emerald-300 mb-3 mt-6">
                        {headerText}
                      </h4>
                    );
                  }

                  // List items
                  if (trimmed.startsWith('- ') || trimmed.match(/^\d+\.\s/)) {
                    const listText = cleanLine.replace(/^[-\d.]\s*/, '');
                    // Handle bold and italic within list items
                    const formattedText = listText
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-emerald-300">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-400">$1</em>');

                    return (
                      <li key={index} className="text-gray-300 mb-3 list-disc list-inside">
                        <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                      </li>
                    );
                  }

                  // Regular paragraphs
                  if (cleanLine.length > 0) {
                    // Handle bold and italic formatting
                    const formattedText = cleanLine
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-emerald-300">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-400">$1</em>');

                    return (
                      <p key={index} className="text-gray-300 mb-6 leading-relaxed text-base">
                        <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                      </p>
                    );
                  }

                  return null;
                })
                .filter(Boolean)}
            </div>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Law Firm?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get a personalized AI implementation roadmap for your practice. Our team will help you modernize your operations and boost revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calculator"
              className="inline-flex items-center px-8 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors group"
            >
              Take AI Readiness Assessment
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}