import Link from 'next/link'
import { ArrowRight, Calculator, FileText, Users, Clock, Shield, Zap } from 'lucide-react'

export default function Home() {
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
              <Link href="/" className="text-emerald-400 font-semibold">
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
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Technology and Revenue Optimization Partner for Family Law Firms
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              We build AI Native family law firms from the ground up, and help established firms to modernize, simplify, and optimize their practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/calculator"
                className="inline-flex items-center px-8 py-4 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors text-lg shadow-lg hover:shadow-emerald-500/25"
              >
                <Calculator className="mr-3 w-6 h-6" />
                Are you AI Ready?
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-emerald-400 text-emerald-400 font-bold rounded-lg hover:bg-emerald-400 hover:text-gray-900 transition-colors text-lg"
              >
                <FileText className="mr-3 w-6 h-6" />
                Read our studies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offerings Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Support That Never Sleeps
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Collections, Streamlined</h3>
              <p className="text-gray-300 leading-relaxed">
                Improve collections rates without additional headcount. Streamline communications and collect faster with AI-powered automation.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Conflict Checks, Derisked</h3>
              <p className="text-gray-300 leading-relaxed">
                Modernize your conflict check system. Reduce risk and get to your new clients faster with intelligent screening.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-500/25">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Intake, Reimagined</h3>
              <p className="text-gray-300 leading-relaxed">
                Only connect with vetted potential customers, in any language. Reimagine your intake process with AI-powered qualification.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Everything You Need for AI Implementation
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From readiness assessment to full implementation, we provide the tools and guidance for successful AI adoption in legal practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-700 hover:border-emerald-500/50 transition-colors">
              <Calculator className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">AI Readiness Assessment</h3>
              <p className="text-gray-300 mb-6">
                Comprehensive evaluation tool to measure your firm&apos;s readiness for AI implementation across all key dimensions.
              </p>
              <Link
                href="/calculator"
                className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Start Assessment
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-700 hover:border-cyan-500/50 transition-colors">
              <FileText className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Implementation Guides</h3>
              <p className="text-gray-300 mb-6">
                Step-by-step guides covering strategy, technology selection, compliance, and change management for legal AI adoption.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Browse Guides
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-700 hover:border-violet-500/50 transition-colors">
              <Users className="w-12 h-12 text-violet-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Expert Consultation</h3>
              <p className="text-gray-300 mb-6">
                Personalized guidance from AI implementation experts who understand the unique challenges of legal practice.
              </p>
              <Link
                href="/consultation"
                className="inline-flex items-center text-violet-400 hover:text-violet-300 font-semibold"
              >
                Book Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Take our comprehensive AI readiness assessment and get a personalized implementation roadmap for your law firm.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center px-10 py-4 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors text-lg"
          >
            <Calculator className="mr-3 w-6 h-6" />
            Start Your AI Journey
            <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}