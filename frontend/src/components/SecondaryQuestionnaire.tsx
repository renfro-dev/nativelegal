'use client'

import React, { useState } from 'react'
import { Container } from '@/design-system'
import { ArrowRight, ArrowLeft, Building, Users, DollarSign, CheckCircle } from 'lucide-react'

interface SecondaryQuestionnaireProps {
  userId: string
  assessmentId: string
  onComplete: (questionnaireId: string) => void
}

interface QuestionnaireData {
  // Infrastructure details
  current_practice_management: string
  current_document_management: string
  current_billing_system: string
  cloud_adoption_level: string
  security_certifications: string
  integration_challenges: string
  
  // Organizational structure
  decision_makers: Array<{
    name: string
    role: string
    email: string
    influence_level: string
  }>
  change_management_experience: string
  training_budget_annual: string
  staff_technology_comfort: string
  previous_ai_experience: string
  
  // Financial details
  annual_revenue_range: string
  technology_budget_annual: string
  ai_investment_budget: string
  roi_expectations: string
  implementation_timeline: string
  
  // Additional context
  primary_pain_points: string
  success_metrics: string
  concerns_about_ai: string
  preferred_communication: string
}

const questionnaireSteps = [
  {
    id: 'infrastructure',
    title: 'Infrastructure Details',
    description: 'Tell us about your current technology stack',
    icon: <Building className="w-6 h-6" />,
    questions: [
      {
        id: 'current_practice_management',
        label: 'What practice management software do you currently use?',
        type: 'select',
        options: [
          'Clio',
          'MyCase',
          'PracticePanther',
          'Smokeball',
          'TimeSolv',
          'Other',
          'None'
        ]
      },
      {
        id: 'current_document_management',
        label: 'What document management system do you use?',
        type: 'select',
        options: [
          'NetDocuments',
          'iManage',
          'Worldox',
          'SharePoint',
          'Google Drive',
          'Dropbox',
          'Other',
          'None'
        ]
      },
      {
        id: 'current_billing_system',
        label: 'What billing system do you use?',
        type: 'select',
        options: [
          'Built into practice management',
          'QuickBooks',
          'Xero',
          'FreshBooks',
          'Other',
          'Manual/Spreadsheet'
        ]
      },
      {
        id: 'cloud_adoption_level',
        label: 'How much of your infrastructure is cloud-based?',
        type: 'select',
        options: [
          'Fully cloud-based',
          'Mostly cloud with some on-premise',
          'Mixed cloud and on-premise',
          'Mostly on-premise with some cloud',
          'Fully on-premise'
        ]
      },
      {
        id: 'security_certifications',
        label: 'What security certifications or compliance frameworks do you have?',
        type: 'multiselect',
        options: [
          'SOC 2',
          'ISO 27001',
          'HIPAA',
          'State bar requirements',
          'Client-specific requirements',
          'None',
          'Other'
        ]
      },
      {
        id: 'integration_challenges',
        label: 'What are your biggest integration challenges?',
        type: 'textarea',
        placeholder: 'Describe any issues with systems not working together, data silos, or manual processes...'
      }
    ]
  },
  {
    id: 'organizational',
    title: 'Organizational Structure',
    description: 'Help us understand your decision-making process',
    icon: <Users className="w-6 h-6" />,
    questions: [
      {
        id: 'decision_makers',
        label: 'Who are the key decision makers for technology investments?',
        type: 'dynamic',
        fields: [
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'role', label: 'Role', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'influence_level', label: 'Influence Level', type: 'select', options: ['High', 'Medium', 'Low'] }
        ]
      },
      {
        id: 'change_management_experience',
        label: 'How would you rate your firm\'s experience with technology change management?',
        type: 'select',
        options: [
          'Excellent - We successfully implement new technology regularly',
          'Good - We have some experience with technology changes',
          'Moderate - We\'ve had mixed success with technology implementations',
          'Limited - We struggle with technology changes',
          'Poor - We have a history of failed technology implementations'
        ]
      },
      {
        id: 'training_budget_annual',
        label: 'What is your annual training budget per employee?',
        type: 'select',
        options: [
          '$5,000+',
          '$2,500 - $4,999',
          '$1,000 - $2,499',
          '$500 - $999',
          'Less than $500',
          'No formal training budget'
        ]
      },
      {
        id: 'staff_technology_comfort',
        label: 'How would you rate your staff\'s overall comfort with technology?',
        type: 'select',
        options: [
          'Very comfortable - Most staff are tech-savvy',
          'Comfortable - Staff generally adapt well to new technology',
          'Moderate - Mixed comfort levels across staff',
          'Limited - Many staff struggle with new technology',
          'Poor - Significant resistance to technology changes'
        ]
      },
      {
        id: 'previous_ai_experience',
        label: 'Does your firm have any experience with AI tools?',
        type: 'select',
        options: [
          'Yes, we use AI tools regularly',
          'Yes, we\'ve experimented with AI tools',
          'Limited experience with basic AI features',
          'No experience but interested',
          'No experience and skeptical'
        ]
      }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Details',
    description: 'Help us understand your investment capacity',
    icon: <DollarSign className="w-6 h-6" />,
    questions: [
      {
        id: 'annual_revenue_range',
        label: 'What is your firm\'s annual revenue range?',
        type: 'select',
        options: [
          '$10M+',
          '$5M - $9.9M',
          '$2M - $4.9M',
          '$1M - $1.9M',
          '$500K - $999K',
          'Less than $500K'
        ]
      },
      {
        id: 'technology_budget_annual',
        label: 'What is your annual technology budget?',
        type: 'select',
        options: [
          '$500K+',
          '$250K - $499K',
          '$100K - $249K',
          '$50K - $99K',
          '$25K - $49K',
          'Less than $25K'
        ]
      },
      {
        id: 'ai_investment_budget',
        label: 'What is your budget for AI implementation over the next 18 months?',
        type: 'select',
        options: [
          '$200K+',
          '$100K - $199K',
          '$50K - $99K',
          '$25K - $49K',
          '$10K - $24K',
          'Less than $10K',
          'Undecided'
        ]
      },
      {
        id: 'roi_expectations',
        label: 'What ROI expectations do you have for AI investments?',
        type: 'select',
        options: [
          '300%+ ROI within 12 months',
          '200-299% ROI within 12 months',
          '100-199% ROI within 12 months',
          '50-99% ROI within 12 months',
          'Break-even within 12 months',
          'Long-term investment (18+ months)'
        ]
      },
      {
        id: 'implementation_timeline',
        label: 'What is your preferred implementation timeline?',
        type: 'select',
        options: [
          'Immediate (0-3 months)',
          'Short-term (3-6 months)',
          'Medium-term (6-12 months)',
          'Long-term (12-18 months)',
          'Flexible timeline'
        ]
      }
    ]
  },
  {
    id: 'context',
    title: 'Additional Context',
    description: 'Help us understand your specific needs and concerns',
    icon: <CheckCircle className="w-6 h-6" />,
    questions: [
      {
        id: 'primary_pain_points',
        label: 'What are your biggest operational pain points?',
        type: 'textarea',
        placeholder: 'Describe the main challenges your firm faces in daily operations...'
      },
      {
        id: 'success_metrics',
        label: 'How do you measure success in your practice?',
        type: 'textarea',
        placeholder: 'What metrics matter most to you? (e.g., client satisfaction, efficiency, revenue growth)...'
      },
      {
        id: 'concerns_about_ai',
        label: 'What are your biggest concerns about implementing AI?',
        type: 'textarea',
        placeholder: 'What worries you most about AI adoption? (e.g., cost, complexity, staff resistance, client concerns)...'
      },
      {
        id: 'preferred_communication',
        label: 'How do you prefer to communicate about technology projects?',
        type: 'select',
        options: [
          'Email with detailed reports',
          'Video calls with presentations',
          'Phone calls for quick updates',
          'In-person meetings',
          'Combination of the above'
        ]
      }
    ]
  }
]

export default function SecondaryQuestionnaire({ userId, assessmentId, onComplete }: SecondaryQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<QuestionnaireData>({
    current_practice_management: '',
    current_document_management: '',
    current_billing_system: '',
    cloud_adoption_level: '',
    security_certifications: '',
    integration_challenges: '',
    decision_makers: [],
    change_management_experience: '',
    training_budget_annual: '',
    staff_technology_comfort: '',
    previous_ai_experience: '',
    annual_revenue_range: '',
    technology_budget_annual: '',
    ai_investment_budget: '',
    roi_expectations: '',
    implementation_timeline: '',
    primary_pain_points: '',
    success_metrics: '',
    concerns_about_ai: '',
    preferred_communication: ''
  })

  const handleInputChange = (questionId: string, value: any) => {
    setData(prev => ({ ...prev, [questionId]: value }))
  }

  const addDecisionMaker = () => {
    setData(prev => ({
      ...prev,
      decision_makers: [...prev.decision_makers, { name: '', role: '', email: '', influence_level: 'Medium' }]
    }))
  }

  const updateDecisionMaker = (index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      decision_makers: prev.decision_makers.map((dm, i) => 
        i === index ? { ...dm, [field]: value } : dm
      )
    }))
  }

  const removeDecisionMaker = (index: number) => {
    setData(prev => ({
      ...prev,
      decision_makers: prev.decision_makers.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          assessment_id: assessmentId,
          ...data
        })
      })
      
      const result = await response.json()
      onComplete(result.id)
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
    }
  }

  const currentStepData = questionnaireSteps[currentStep]
  const isStepComplete = currentStepData.questions.every(q => {
    if (q.id === 'decision_makers') {
      return data.decision_makers.length > 0
    }
    return data[q.id as keyof QuestionnaireData] !== ''
  })

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tell Us More About Your Firm
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Help us prepare for your consultation with detailed information about your practice
          </p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {questionnaireSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / questionnaireSteps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep + 1) / questionnaireSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="text-blue-600 mr-4">
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
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  {qIndex + 1}. {question.label}
                </label>
                
                {question.type === 'select' && (
                  <select
                    value={data[question.id as keyof QuestionnaireData] as string}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option</option>
                    {question.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}

                {question.type === 'multiselect' && (
                  <div className="space-y-2">
                    {question.options?.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(data[question.id as keyof QuestionnaireData] as string[] || []).includes(option)}
                          onChange={(e) => {
                            const current = data[question.id as keyof QuestionnaireData] as string[] || []
                            const updated = e.target.checked 
                              ? [...current, option]
                              : current.filter(item => item !== option)
                            handleInputChange(question.id, updated)
                          }}
                          className="mr-2"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'textarea' && (
                  <textarea
                    value={data[question.id as keyof QuestionnaireData] as string}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {question.type === 'dynamic' && question.id === 'decision_makers' && (
                  <div className="space-y-4">
                    {data.decision_makers.map((dm, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            placeholder="Name"
                            value={dm.name}
                            onChange={(e) => updateDecisionMaker(index, 'name', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Role"
                            value={dm.role}
                            onChange={(e) => updateDecisionMaker(index, 'role', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={dm.email}
                            onChange={(e) => updateDecisionMaker(index, 'email', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <select
                            value={dm.influence_level}
                            onChange={(e) => updateDecisionMaker(index, 'influence_level', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="High">High Influence</option>
                            <option value="Medium">Medium Influence</option>
                            <option value="Low">Low Influence</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDecisionMaker(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDecisionMaker}
                      className="px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50"
                    >
                      + Add Decision Maker
                    </button>
                  </div>
                )}
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
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === questionnaireSteps.length - 1 ? 'Complete Questionnaire' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}
