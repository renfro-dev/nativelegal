import Link from 'next/link'
import { ArrowRight, Calculator, FileText, Users, Clock, Shield, Zap, Heart, Users2, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900">Native Legal</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-blue-600 font-semibold">
                Home
              </Link>
              <Link href="/blog" className="text-slate-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link href="/calculator" className="text-slate-700 hover:text-blue-600 transition-colors">
                AI Calculator
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Transform Your Law Firm with AI
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Comprehensive guides, assessment tools, and implementation strategies to help law firms successfully adopt artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/calculator"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors text-lg"
              >
                <Calculator className="mr-3 w-6 h-6" />
                Take AI Assessment
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg"
              >
                <FileText className="mr-3 w-6 h-6" />
                Read Our Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offerings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Support That Never Sleeps
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We help established law firms modernize their operations with AI-powered solutions that work around the clock.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Collections, Streamlined</h3>
              <p className="text-slate-600 leading-relaxed">
                Improve collections rates without additional headcount. Streamline communications and collect faster with AI-powered automation.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Conflict Checks, Derisked</h3>
              <p className="text-slate-600 leading-relaxed">
                Modernize your conflict check system. Reduce risk and get to your new clients faster with intelligent screening.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Intake, Reimagined</h3>
              <p className="text-slate-600 leading-relaxed">
                Only connect with vetted potential customers, in any language. Reimagine your intake process with AI-powered qualification.
              </p>
            </div>
          </div>

          {/* First Principles */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Our First Principles</h3>
              <p className="text-lg text-slate-600">
                Every solution we build is grounded in these core values
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Accessibility</h4>
                <p className="text-slate-600">
                  Technology should be accessible to all, regardless of technical expertise or resources.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users2 className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Inclusivity</h4>
                <p className="text-slate-600">
                  We build solutions that serve diverse communities and ensure equal access to legal services.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-10 h-10 text-red-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">People &gt; AI</h4>
                <p className="text-slate-600">
                  Technology enhances human capabilities but never replaces the human touch in legal practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Everything You Need for AI Implementation
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From readiness assessment to full implementation, we provide the tools and guidance for successful AI adoption in legal practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Readiness Assessment</h3>
              <p className="text-slate-600 mb-6">
                Comprehensive evaluation tool to measure your firm&apos;s readiness for AI implementation across all key dimensions.
              </p>
              <Link
                href="/calculator"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                Start Assessment
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Implementation Guides</h3>
              <p className="text-slate-600 mb-6">
                Step-by-step guides covering strategy, technology selection, compliance, and change management for legal AI adoption.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                Browse Guides
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Expert Consultation</h3>
              <p className="text-slate-600 mb-6">
                Personalized guidance from AI implementation experts who understand the unique challenges of legal practice.
              </p>
              <Link
                href="/consultation"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                Book Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Take our comprehensive AI readiness assessment and get a personalized implementation roadmap for your law firm.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center px-10 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg"
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