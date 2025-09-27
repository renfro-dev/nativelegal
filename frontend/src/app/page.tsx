'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Brain, Scale, TrendingUp, Users, Zap, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">Native Legal</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/calculator" className="text-slate-700 hover:text-blue-600 transition-colors">
                AI Readiness Calculator
              </Link>
              <Link href="/blog" className="text-slate-700 hover:text-blue-600 transition-colors">
                Legal AI Insights
              </Link>
              <Link href="/analytics" className="text-slate-700 hover:text-blue-600 transition-colors">
                Analytics Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6"
            >
              AI Native Transformation Engine
              <span className="block text-blue-600">for Law Firms</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 max-w-4xl mx-auto mb-8"
            >
              The AI Native Transformation Engine for Family Law Firms. 
              Improve collections rates, modernize conflict checks, and reimagine your intake process.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                href="/calculator"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group"
              >
                Start AI Readiness Assessment
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/blog"
                className="inline-flex items-center px-8 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                View Our Portfolio
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Collections Rate Improvement', value: '25%', icon: TrendingUp },
              { label: 'Conflict Check Time Reduction', value: '40%', icon: Scale },
              { label: 'Intake Conversion Increase', value: '60%', icon: Users },
              { label: 'Languages Supported', value: '100+', icon: Brain },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Offerings Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Core Offerings for Established Firms
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Transform your family law practice with AI-native solutions that put people first
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Improve Collections Rates',
                description: 'Streamline communications and collect faster without additional headcount',
                icon: TrendingUp,
                color: 'green',
                details: [
                  'Automated payment reminders',
                  'Multi-channel communication',
                  'Real-time payment tracking',
                  'Reduced administrative overhead'
                ]
              },
              {
                title: 'Modernize Conflict Check System',
                description: 'Reduce risk and get to your new clients faster with AI-powered conflict detection',
                icon: Scale,
                color: 'blue',
                details: [
                  'Automated database searches',
                  'Risk assessment scoring',
                  'Compliance tracking',
                  'Faster client onboarding'
                ]
              },
              {
                title: 'Reimagine Intake Process',
                description: 'Only connect with vetted potential customers, in any language',
                icon: Users,
                color: 'purple',
                details: [
                  'Multi-language support (100+ languages)',
                  'Automated qualification scoring',
                  '24/7 intake availability',
                  'Vetted lead generation'
                ]
              },
            ].map((offering, index) => (
              <motion.div
                key={offering.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 ${
                  offering.color === 'green' ? 'bg-green-100' :
                  offering.color === 'blue' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  <offering.icon className={`w-6 h-6 ${
                    offering.color === 'green' ? 'text-green-600' :
                    offering.color === 'blue' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{offering.title}</h3>
                <p className="text-slate-600 mb-4">{offering.description}</p>
                <ul className="space-y-2">
                  {offering.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Firms Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              For New Firms
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Launch your family law practice with AI-native infrastructure from day one
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '24/7 Intake in 100+ Languages',
                description: 'Never miss a potential client, regardless of language or time zone',
                icon: Brain,
              },
              {
                title: 'Collect with Compassion',
                description: 'Automated collections that maintain client relationships',
                icon: TrendingUp,
              },
              {
                title: 'Establish Digital Presence',
                description: 'SEO-optimized content and online authority from day one',
                icon: FileText,
              },
              {
                title: 'Support Staff Without Turnover',
                description: 'AI-powered support that scales with your practice',
                icon: Users,
              },
              {
                title: 'Conflict Checks, Derisked',
                description: 'Built-in compliance and risk management from day one',
                icon: Scale,
              },
              {
                title: 'CRM Architecture for the Future',
                description: 'Scalable systems that grow with your practice',
                icon: Zap,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 mb-4">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Family Law Practice?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the AI-native transformation with solutions that put people first: 
              accessibility, inclusivity, and human-centered AI.
            </p>
            <Link 
              href="/consultation"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors group"
            >
              Schedule Consultation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-6 h-6" />
              <span className="text-lg font-semibold">SingleShot</span>
            </div>
            <p className="text-slate-400">
              © 2024 SingleShot. AI Readiness x Revenue Optimization for Law Firms.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}