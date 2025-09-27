import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { TableOfContents } from '@/components/TableOfContents'
import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'

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
    // Try the new content directory first
    const newContentPath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`)
    if (fs.existsSync(newContentPath)) {
      return fs.readFileSync(newContentPath, 'utf8')
    }
    
    // Fallback to old location
    const oldContentPath = path.join(process.cwd(), 'frontend', 'src', 'content', 'posts', `${slug}.mdx`)
    if (fs.existsSync(oldContentPath)) {
      return fs.readFileSync(oldContentPath, 'utf8')
    }
    
    return null
  } catch (error) {
    console.error(`Error reading post content for ${slug}:`, error)
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Content Not Found</h1>
          <p className="text-slate-600 mb-8">The content for this blog post could not be loaded.</p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const { content: mdxContent } = matter(content)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Native Legal" width={32} height={32} />
              <span className="text-xl font-bold text-slate-900">Native Legal</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-slate-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-blue-100 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-100">
              {post.category}
            </span>
            <div className="flex items-center text-sm text-blue-100">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center text-sm text-blue-100">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime}
            </div>
            <div className="flex items-center text-sm text-blue-100">
              <User className="w-4 h-4 mr-1" />
              {post.author}
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-blue-100 leading-relaxed">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-100"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {post.heroImage && (
        <section className="py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={post.heroImage}
                alt={`${post.title} - Professional legal AI guide`}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <TableOfContents content={content} />
              </div>
            </div>

            {/* Article Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-slate prose-lg max-w-none">
                <MDXRemote source={mdxContent} />
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Law Firm?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get a personalized AI implementation roadmap for your practice. Our team will help you modernize your operations and boost revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/calculator"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group"
            >
              Take AI Readiness Assessment
            </Link>
            <Link 
              href="/consultation"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
