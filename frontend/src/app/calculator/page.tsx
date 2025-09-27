import { Metadata } from 'next'
import AIReadinessCalculator from '@/components/AIReadinessCalculator'

export const metadata: Metadata = {
  title: 'AI Readiness Assessment Calculator | Native Legal',
  description: 'Evaluate your law firm\'s readiness for AI implementation with our comprehensive assessment tool. Get personalized recommendations and implementation guidance.',
  keywords: ['AI readiness assessment', 'legal AI implementation', 'law firm technology', 'AI calculator', 'legal technology assessment'],
  openGraph: {
    title: 'AI Readiness Assessment Calculator | Native Legal',
    description: 'Evaluate your law firm\'s readiness for AI implementation with our comprehensive assessment tool.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Readiness Assessment Calculator | Native Legal',
    description: 'Evaluate your law firm\'s readiness for AI implementation with our comprehensive assessment tool.',
  },
}

export default function CalculatorPage() {
  return <AIReadinessCalculator />
}
