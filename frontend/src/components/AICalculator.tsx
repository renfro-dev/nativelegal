'use client'

import React, { useState } from 'react'
import { Container } from './Container'
import { CheckCircle, ArrowRight, ArrowLeft, Calculator, FileText, Users, DollarSign, Server, Check, HelpCircle } from 'lucide-react'

interface AssessmentStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  questions: Question[]
  weight: number
}

interface Question {
  id: string
  text: string
  helpText?: string
  options: {
    value: number
    label: string
    description: string
  }[]
}

interface AssessmentResults {
  infrastructure: number
  data: number
  organizational: number
  financial: number
  overall: number
  readiness: string
  recommendations: string[]
}

const assessmentSteps: AssessmentStep[] = [
  {
    id: 'infrastructure',
    title: 'Infrastructure Readiness',
    description: 'Evaluate your current technology systems and integration capabilities',
    icon: <Server className="w-6 h-6" />,
    weight: 0.25,
    questions: [
      {
        id: 'infra-1',
        text: 'What best describes your current technology infrastructure?',
        helpText: 'Consider your practice management software, document management systems, and how well they integrate with each other. Cloud-native means your systems are designed for the cloud with modern APIs.',
        options: [
          { value: 5, label: 'Cloud-native systems', description: 'Robust APIs and integration capabilities' },
          { value: 4, label: 'Modern systems', description: 'Good integration potential, minimal technical debt' },
          { value: 3, label: 'Mixed environment', description: 'Some legacy systems, manageable upgrade path' },
          { value: 2, label: 'Primarily legacy', description: 'Requires significant modernization efforts' },
          { value: 1, label: 'Outdated infrastructure', description: 'Major compatibility and security concerns' }
        ]
      },
      {
        id: 'infra-2',
        text: 'How would you rate your system integration capabilities?',
        helpText: 'Think about how easily your practice management software, document management, billing systems, and other tools work together. Can data flow between systems automatically?',
        options: [
          { value: 5, label: 'Excellent', description: 'Seamless integration with modern APIs' },
          { value: 4, label: 'Good', description: 'Most systems integrate well' },
          { value: 3, label: 'Moderate', description: 'Some integration challenges' },
          { value: 2, label: 'Limited', description: 'Significant integration barriers' },
          { value: 1, label: 'Poor', description: 'Major integration obstacles' }
        ]
      },
      {
        id: 'infra-3',
        text: 'What is your current security and compliance posture?',
        helpText: 'Consider your data encryption, access controls, backup systems, and compliance with legal industry standards. Do you have formal security policies and regular security audits?',
        options: [
          { value: 5, label: 'Enterprise-grade', description: 'Comprehensive security framework' },
          { value: 4, label: 'Strong', description: 'Good security practices in place' },
          { value: 3, label: 'Adequate', description: 'Basic security measures' },
          { value: 2, label: 'Basic', description: 'Limited security coverage' },
          { value: 1, label: 'Insufficient', description: 'Security gaps and concerns' }
        ]
      }
    ]
  },
  {
    id: 'data',
    title: 'Data Readiness',
    description: 'Assess your data organization, quality, and accessibility',
    icon: <FileText className="w-6 h-6" />,
    weight: 0.25,
    questions: [
      {
        id: 'data-1',
        text: 'How would you describe your data organization?',
        helpText: 'Think about how your client files, case documents, and matter information are organized. Are they consistently named, properly categorized, and easy to find?',
        options: [
          { value: 5, label: 'Excellent', description: 'Well-organized with strong governance' },
          { value: 4, label: 'Good', description: 'Generally organized, minor issues' },
          { value: 3, label: 'Moderate', description: 'Mixed quality, needs cleanup' },
          { value: 2, label: 'Poor', description: 'Requires significant restructuring' },
          { value: 1, label: 'Chaotic', description: 'Major accessibility challenges' }
        ]
      },
      {
        id: 'data-2',
        text: 'What is your data quality and accessibility level?',
        helpText: 'Consider the accuracy and completeness of your client information, case data, and documents. Is information up-to-date, properly formatted, and easily searchable?',
        options: [
          { value: 5, label: 'High quality', description: 'Clean, accessible, well-documented' },
          { value: 4, label: 'Good quality', description: 'Mostly clean and accessible' },
          { value: 3, label: 'Mixed quality', description: 'Some quality issues' },
          { value: 2, label: 'Poor quality', description: 'Significant quality problems' },
          { value: 1, label: 'Very poor', description: 'Major quality and access issues' }
        ]
      },
      {
        id: 'data-3',
        text: 'How mature are your data governance processes?',
        helpText: 'Data governance includes policies for data access, retention, privacy, and quality control. Do you have formal procedures for who can access what data, how long to keep it, and how to maintain its quality?',
        options: [
          { value: 5, label: 'Mature', description: 'Comprehensive governance framework' },
          { value: 4, label: 'Developing', description: 'Good governance practices' },
          { value: 3, label: 'Basic', description: 'Some governance in place' },
          { value: 2, label: 'Limited', description: 'Minimal governance' },
          { value: 1, label: 'None', description: 'No formal governance' }
        ]
      }
    ]
  },
  {
    id: 'organizational',
    title: 'Organizational Readiness',
    description: 'Evaluate leadership alignment and change management capabilities',
    icon: <Users className="w-6 h-6" />,
    weight: 0.30,
    questions: [
      {
        id: 'org-1',
        text: 'How would you rate leadership alignment on AI adoption?',
        helpText: 'Consider whether partners and senior leadership are committed to AI implementation, willing to invest resources, and have experience successfully managing technology changes in the firm.',
        options: [
          { value: 5, label: 'Strong alignment', description: 'Proven change management capabilities' },
          { value: 4, label: 'Good support', description: 'Adequate change management experience' },
          { value: 3, label: 'Moderate support', description: 'Mixed change management history' },
          { value: 2, label: 'Limited alignment', description: 'Poor change management track record' },
          { value: 1, label: 'Weak support', description: 'Resistance to organizational change' }
        ]
      },
      {
        id: 'org-2',
        text: 'What is your staff\'s readiness for technology change?',
        helpText: 'Think about how comfortable your attorneys, paralegals, and support staff are with new technology. Do they adapt quickly to new systems, or do they resist change?',
        options: [
          { value: 5, label: 'Highly ready', description: 'Strong technology skills and adaptability' },
          { value: 4, label: 'Ready', description: 'Good technology comfort levels' },
          { value: 3, label: 'Moderately ready', description: 'Mixed technology skills' },
          { value: 2, label: 'Limited readiness', description: 'Technology resistance' },
          { value: 1, label: 'Not ready', description: 'Strong resistance to change' }
        ]
      },
      {
        id: 'org-3',
        text: 'How effective is your training and development infrastructure?',
        helpText: 'Consider your firm\'s ability to train staff on new systems. Do you have dedicated training resources, ongoing professional development programs, and experience successfully training staff on new technology?',
        options: [
          { value: 5, label: 'Excellent', description: 'Comprehensive training programs' },
          { value: 4, label: 'Good', description: 'Adequate training resources' },
          { value: 3, label: 'Basic', description: 'Some training capabilities' },
          { value: 2, label: 'Limited', description: 'Minimal training support' },
          { value: 1, label: 'Insufficient', description: 'No formal training programs' }
        ]
      }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Readiness',
    description: 'Assess budget allocation and investment capacity',
    icon: <DollarSign className="w-6 h-6" />,
    weight: 0.20,
    questions: [
      {
        id: 'fin-1',
        text: 'What is your budget allocation for AI implementation?',
        helpText: 'Consider your firm\'s financial capacity for AI investment, including software licensing, implementation costs, training, and ongoing support. What percentage of your annual technology budget could be allocated to AI?',
        options: [
          { value: 5, label: 'Substantial budget', description: 'Flexible investment approach' },
          { value: 4, label: 'Adequate budget', description: 'Clear ROI expectations' },
          { value: 3, label: 'Moderate budget', description: 'Careful prioritization needed' },
          { value: 2, label: 'Limited budget', description: 'Constraining implementation scope' },
          { value: 1, label: 'Insufficient budget', description: 'No meaningful AI investment' }
        ]
      },
      {
        id: 'fin-2',
        text: 'How would you rate your ROI measurement capabilities?',
        helpText: 'Think about your firm\'s ability to track and measure the return on technology investments. Do you have systems to measure productivity gains, cost savings, and revenue improvements from new technology?',
        options: [
          { value: 5, label: 'Advanced', description: 'Sophisticated measurement frameworks' },
          { value: 4, label: 'Good', description: 'Clear measurement processes' },
          { value: 3, label: 'Basic', description: 'Some measurement capabilities' },
          { value: 2, label: 'Limited', description: 'Minimal measurement tools' },
          { value: 1, label: 'None', description: 'No measurement framework' }
        ]
      },
      {
        id: 'fin-3',
        text: 'What is your investment timeline flexibility?',
        helpText: 'Consider your firm\'s expectations for seeing returns on AI investment. Are you willing to invest for the long term, or do you need to see immediate results? AI implementation typically takes 6-18 months to show significant ROI.',
        options: [
          { value: 5, label: 'Very flexible', description: 'Long-term investment horizon' },
          { value: 4, label: 'Flexible', description: 'Reasonable timeline expectations' },
          { value: 3, label: 'Moderate', description: 'Some timeline constraints' },
          { value: 2, label: 'Limited', description: 'Tight timeline requirements' },
          { value: 1, label: 'Rigid', description: 'Immediate ROI expectations' }
        ]
      }
    ]
  }
]

export default function AIReadinessCalculator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    firmSize: '',
    practiceAreas: ''
  })

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const calculateResults = (): AssessmentResults => {
    const scores = {
      infrastructure: 0,
      data: 0,
      organizational: 0,
      financial: 0
    }

    assessmentSteps.forEach(step => {
      const stepAnswers = step.questions.map(q => answers[q.id] || 0)
      const stepScore = stepAnswers.reduce((sum, score) => sum + score, 0) / step.questions.length
      scores[step.id as keyof typeof scores] = stepScore
    })

    const overall = Object.entries(scores).reduce((sum, [key, score]) => {
      const step = assessmentSteps.find(s => s.id === key)
      return sum + (score * (step?.weight || 0))
    }, 0)

    let readiness = ''
    let recommendations: string[] = []

    if (overall >= 4.0) {
      readiness = 'Ready for comprehensive AI implementation with accelerated timeline'
      recommendations = [
        'Proceed with full AI implementation strategy',
        'Consider advanced AI use cases and automation',
        'Plan for rapid scaling and expansion',
        'Invest in cutting-edge AI technologies'
      ]
    } else if (overall >= 3.0) {
      readiness = 'Ready for strategic implementation with standard timeline and preparation'
      recommendations = [
        'Begin with pilot AI implementations',
        'Focus on high-impact, low-risk use cases',
        'Strengthen change management processes',
        'Plan for phased rollout approach'
      ]
    } else if (overall >= 2.0) {
      readiness = 'Requires preparation phase before AI implementation can begin'
      recommendations = [
        'Address infrastructure and data quality issues',
        'Strengthen organizational change management',
        'Develop comprehensive training programs',
        'Consider consulting support for implementation'
      ]
    } else {
      readiness = 'Significant foundational work needed before AI consideration'
      recommendations = [
        'Focus on basic technology infrastructure upgrades',
        'Implement data governance and quality programs',
        'Develop change management capabilities',
        'Consider external expertise and support'
      ]
    }

    return {
      ...scores,
      overall,
      readiness,
      recommendations
    }
  }

  const nextStep = () => {
    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: leadData,
          assessment: calculateResults(),
          answers: answers
        })
      })

      if (response.ok) {
        setShowLeadForm(false)
        alert(`🎉 Perfect, ${leadData.name}! We have everything we need to prepare for your video consultation. Our team will reach out within 24 hours to schedule your personalized AI strategy session.`)
      } else {
        throw new Error('Failed to submit assessment')
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('There was an error processing your assessment. Please try again.')
    }
  }

  if (showResults) {
    const results = calculateResults()

    return (
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Calculator className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your AI Readiness Assessment Results
            </h1>
            <p className="text-xl text-gray-600">
              Based on your responses, here&apos;s your comprehensive AI readiness evaluation
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-emerald-500 mb-2">
                {results.overall.toFixed(1)}
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-4">
                Overall Readiness Score
              </div>
              <div className="text-lg text-gray-600">
                {results.readiness}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Category Scores</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Infrastructure</span>
                    <span className="font-semibold">{results.infrastructure.toFixed(1)}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Data Readiness</span>
                    <span className="font-semibold">{results.data.toFixed(1)}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Organizational</span>
                    <span className="font-semibold">{results.organizational.toFixed(1)}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Financial</span>
                    <span className="font-semibold">{results.financial.toFixed(1)}/5.0</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🎯 Ready to Transform Your Practice?
                </h3>
                <p className="text-gray-600 mb-4">
                  Get your personalized AI implementation roadmap with specific next steps, vendor recommendations, and timeline guidance.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowLeadForm(true)
                  setShowResults(false)
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📋 Get My Personalized Implementation Guide
              </button>
              <p className="text-sm text-gray-500 mt-3">
                ✓ Free detailed report ✓ Vendor recommendations ✓ Timeline guidance ✓ No spam, ever
              </p>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (showLeadForm) {
    return (
      <Container className="py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🚀 Get Your Personalized AI Implementation Guide
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Based on your <strong>{calculateResults().overall.toFixed(1)}/5.0 readiness score</strong>, we&apos;ll create a customized implementation roadmap for your firm. First, tell us a bit about your practice:
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm text-gray-600">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Specific next steps for your firm
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Vendor recommendations
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Timeline and budget guidance
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Risk mitigation strategies
              </div>
            </div>
          </div>

          <form onSubmit={handleLeadSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={leadData.name}
                  onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={leadData.email}
                  onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Firm Name *
                </label>
                <input
                  type="text"
                  required
                  value={leadData.company}
                  onChange={(e) => setLeadData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={leadData.phone}
                  onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firm Size *
                </label>
                <select
                  required
                  value={leadData.firmSize}
                  onChange={(e) => setLeadData(prev => ({ ...prev, firmSize: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select firm size</option>
                  <option value="1-10">1-10 attorneys</option>
                  <option value="11-50">11-50 attorneys</option>
                  <option value="51-200">51-200 attorneys</option>
                  <option value="200+">200+ attorneys</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Practice Areas
                </label>
                <input
                  type="text"
                  value={leadData.practiceAreas}
                  onChange={(e) => setLeadData(prev => ({ ...prev, practiceAreas: e.target.value }))}
                  placeholder="e.g., Corporate Law, Litigation, Family Law"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowLeadForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← Back to Results
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                📋 Get My Implementation Guide
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Note:</strong> We&apos;ll send you a detailed implementation guide based on your assessment results.
              </p>
            </div>
          </form>
        </div>
      </Container>
    )
  }

  const currentStepData = assessmentSteps[currentStep]
  const isStepComplete = currentStepData.questions.every(q => answers[q.id])

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Calculator className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Readiness Assessment Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Evaluate your law firm&apos;s readiness for AI implementation with our comprehensive assessment tool
          </p>

          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {assessmentSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / assessmentSteps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep + 1) / assessmentSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="text-emerald-500 mr-4">
              {currentStepData.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600">
                {currentStepData.description}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {currentStepData.questions.map((question, qIndex) => (
              <div key={question.id} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {qIndex + 1}. {question.text}
                </h3>
                {question.helpText && (
                  <div className="flex items-start mb-4 p-3 bg-emerald-50 rounded-lg">
                    <HelpCircle className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-emerald-800">{question.helpText}</p>
                  </div>
                )}
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[question.id] === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={() => handleAnswer(question.id, option.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center mr-3">
                        {answers[question.id] === option.value ? (
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={!isStepComplete}
              className="flex items-center px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === assessmentSteps.length - 1 ? 'Get Results' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}