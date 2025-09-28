import Link from 'next/link'
import AIReadinessCalculator from '@/components/AICalculator'

export default function CalculatorPage() {
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
              <Link href="/" className="text-slate-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-slate-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link href="/calculator" className="text-blue-600 font-semibold">
                AI Calculator
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* AI Calculator Component */}
      <AIReadinessCalculator />
    </div>
  )
}