'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import { getAllPosts } from '@/lib/posts'

export default function BlogPage() {
  const posts = getAllPosts()
  
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
              <Link href="/analytics" className="text-slate-700 hover:text-blue-600 transition-colors">
                Analytics Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Read our studies
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Thought leadership at the nexus of technology and revenue.
            </p>
          </motion.div>
        </div>
      </section>


      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="md:flex md:gap-6">
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="md:w-1/3 mb-6 md:mb-0">
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={`${post.title} - Professional legal AI guide`}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={`${post.featuredImage ? 'md:w-2/3' : 'w-full'} p-8`}>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between">
                      <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
                      >
                        Read Article
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are you ready for the future of family law?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Meet with Native Legal for a comprehensive assessment of your technology, revenue systems, and AI readiness.
          </p>
          <Link 
            href="/consultation"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group"
          >
            Book a meeting with us
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}