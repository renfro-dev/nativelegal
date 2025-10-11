import Link from 'next/link'
import AIReadinessCalculator from '@/components/AICalculator'

export default function CalculatorPage() {
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

      {/* AI Calculator Component */}
      <AIReadinessCalculator />
    </div>
  )
}