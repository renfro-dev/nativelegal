import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PersonalizationData {
  user: {
    name: string
    email: string
    company: string
    firm_size: string
    practice_areas: string
  }
  assessment: {
    infrastructure_score: number
    data_score: number
    organizational_score: number
    financial_score: number
    overall_score: number
    readiness_level: string
    answers: Record<string, number>
  }
  questionnaire: {
    current_practice_management: string
    current_document_management: string
    current_billing_system: string
    cloud_adoption_level: string
    security_certifications: string
    integration_challenges: string
    change_management_experience: string
    staff_technology_comfort: string
    previous_ai_experience: string
    annual_revenue_range: string
    roi_expectations: string
    implementation_timeline: string
    primary_pain_points: string
    success_metrics: string
    concerns_about_ai: string
    preferred_communication: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, assessmentId, questionnaireId } = await req.json()

    // Fetch all user data
    const { data: user } = await supabaseClient
      .from('calculator_users')
      .select('*')
      .eq('id', userId)
      .single()

    const { data: assessment } = await supabaseClient
      .from('calculator_assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()

    const { data: questionnaire } = await supabaseClient
      .from('secondary_questionnaire')
      .select('*')
      .eq('id', questionnaireId)
      .single()

    if (!user || !assessment || !questionnaire) {
      throw new Error('Missing user data')
    }

    // Determine the best template based on user profile
    const practiceArea = user.practice_areas?.toLowerCase().includes('family') ? 'family_law' : 'general'
    const firmSize = getFirmSizeCategory(user.firm_size)
    const readinessLevel = getReadinessLevel(assessment.overall_score)

    // Get appropriate template
    const { data: template } = await supabaseClient
      .from('implementation_guide_templates')
      .select('*')
      .eq('practice_area', practiceArea)
      .eq('firm_size_category', firmSize)
      .eq('readiness_level', readinessLevel)
      .eq('is_active', true)
      .single()

    if (!template) {
      throw new Error('No template found for user profile')
    }

    // Get vendor recommendations
    const { data: vendors } = await supabaseClient
      .from('ai_vendor_recommendations')
      .select('*')
      .eq('is_recommended', true)
      .contains('practice_areas', [practiceArea])
      .contains('firm_size_suitable', [firmSize])

    // Generate personalized content
    const personalizationData: PersonalizationData = {
      user,
      assessment,
      questionnaire
    }

    const generatedContent = await generatePersonalizedGuide(
      template,
      personalizationData,
      vendors || []
    )

    // Save the generated guide
    const { data: guide } = await supabaseClient
      .from('generated_implementation_guides')
      .insert({
        user_id: userId,
        assessment_id: assessmentId,
        questionnaire_id: questionnaireId,
        guide_title: `AI Implementation Roadmap for ${user.company}`,
        template_id: template.id,
        personalization_data: personalizationData,
        generated_content: generatedContent,
        recommendations: generatedContent.recommendations,
        timeline: generatedContent.timeline,
        budget_estimates: generatedContent.budget_estimates,
        vendor_recommendations: generatedContent.vendor_recommendations,
        status: 'generated'
      })
      .select()
      .single()

    return new Response(
      JSON.stringify({ 
        success: true, 
        guideId: guide.id,
        guide: generatedContent
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error generating implementation guide:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function getFirmSizeCategory(firmSize: string): string {
  if (firmSize === '1-10') return 'small'
  if (firmSize === '11-50') return 'medium'
  return 'large'
}

function getReadinessLevel(score: number): string {
  if (score >= 4.0) return 'advanced'
  if (score >= 2.5) return 'intermediate'
  return 'beginner'
}

async function generatePersonalizedGuide(
  template: any,
  data: PersonalizationData,
  vendors: any[]
): Promise<any> {
  // This would integrate with your AI system (OpenAI, Claude, etc.)
  // For now, returning a structured template with personalized content
  
  const { user, assessment, questionnaire } = data
  
  return {
    executive_summary: {
      firm_name: user.company,
      readiness_score: assessment.overall_score,
      readiness_level: assessment.readiness_level,
      key_recommendations: [
        `Focus on ${assessment.infrastructure_score < 3 ? 'infrastructure modernization' : 'AI tool integration'}`,
        `Prioritize ${assessment.data_score < 3 ? 'data organization and quality' : 'advanced AI applications'}`,
        `Address ${assessment.organizational_score < 3 ? 'change management and training' : 'scaling AI across practice areas'}`
      ]
    },
    current_state_analysis: {
      strengths: getStrengths(assessment),
      weaknesses: getWeaknesses(assessment),
      opportunities: getOpportunities(questionnaire),
      threats: getThreats(questionnaire)
    },
    implementation_phases: generateImplementationPhases(assessment, questionnaire),
    vendor_recommendations: generateVendorRecommendations(vendors, questionnaire),
    timeline: generateTimeline(assessment, questionnaire),
    budget_estimates: generateBudgetEstimates(questionnaire, assessment),
    success_metrics: generateSuccessMetrics(questionnaire),
    risk_mitigation: generateRiskMitigation(questionnaire, assessment)
  }
}

function getStrengths(assessment: any): string[] {
  const strengths = []
  if (assessment.infrastructure_score >= 4) strengths.push('Strong technology infrastructure')
  if (assessment.data_score >= 4) strengths.push('Well-organized data systems')
  if (assessment.organizational_score >= 4) strengths.push('Effective change management capabilities')
  if (assessment.financial_score >= 4) strengths.push('Adequate budget for AI investment')
  return strengths
}

function getWeaknesses(assessment: any): string[] {
  const weaknesses = []
  if (assessment.infrastructure_score < 3) weaknesses.push('Legacy systems requiring modernization')
  if (assessment.data_score < 3) weaknesses.push('Data quality and organization challenges')
  if (assessment.organizational_score < 3) weaknesses.push('Limited change management experience')
  if (assessment.financial_score < 3) weaknesses.push('Budget constraints for AI implementation')
  return weaknesses
}

function getOpportunities(questionnaire: any): string[] {
  const opportunities = []
  if (questionnaire.primary_pain_points?.includes('efficiency')) opportunities.push('Automate routine tasks to improve efficiency')
  if (questionnaire.primary_pain_points?.includes('client')) opportunities.push('Enhance client experience with AI-powered tools')
  if (questionnaire.primary_pain_points?.includes('research')) opportunities.push('Accelerate legal research and case preparation')
  return opportunities
}

function getThreats(questionnaire: any): string[] {
  const threats = []
  if (questionnaire.concerns_about_ai?.includes('cost')) threats.push('Budget overruns during implementation')
  if (questionnaire.concerns_about_ai?.includes('staff')) threats.push('Staff resistance to new technology')
  if (questionnaire.concerns_about_ai?.includes('security')) threats.push('Data security and compliance risks')
  return threats
}

function generateImplementationPhases(assessment: any, questionnaire: any): any[] {
  const phases = []
  
  // Phase 1: Foundation (always first)
  phases.push({
    phase: 1,
    name: 'Foundation & Assessment',
    duration: '4-6 weeks',
    description: 'Establish AI readiness foundation',
    tasks: [
      'Complete current state assessment',
      'Identify quick wins and low-hanging fruit',
      'Establish AI governance framework',
      'Select pilot project and team'
    ]
  })
  
  // Phase 2: Based on readiness level
  if (assessment.overall_score < 2.5) {
    phases.push({
      phase: 2,
      name: 'Infrastructure Modernization',
      duration: '8-12 weeks',
      description: 'Upgrade core systems and data quality',
      tasks: [
        'Modernize practice management system',
        'Improve data organization and quality',
        'Implement basic security measures',
        'Train staff on new systems'
      ]
    })
  }
  
  // Phase 3: AI Implementation
  phases.push({
    phase: phases.length + 1,
    name: 'AI Tool Implementation',
    duration: '6-10 weeks',
    description: 'Deploy selected AI tools and applications',
    tasks: [
      'Implement document automation tools',
      'Deploy legal research AI',
      'Set up client intake automation',
      'Train staff on AI tools'
    ]
  })
  
  // Phase 4: Optimization
  phases.push({
    phase: phases.length + 1,
    name: 'Optimization & Scaling',
    duration: '4-8 weeks',
    description: 'Optimize AI tools and scale across practice areas',
    tasks: [
      'Measure and analyze AI tool performance',
      'Optimize workflows and processes',
      'Scale successful AI applications',
      'Plan next phase of AI adoption'
    ]
  })
  
  return phases
}

function generateVendorRecommendations(vendors: any[], questionnaire: any): any[] {
  // Filter and rank vendors based on questionnaire responses
  return vendors
    .filter(vendor => {
      // Match practice management system
      if (questionnaire.current_practice_management && 
          vendor.integration_requirements?.practice_management) {
        return vendor.integration_requirements.practice_management.includes(
          questionnaire.current_practice_management.toLowerCase()
        )
      }
      return true
    })
    .slice(0, 5) // Top 5 recommendations
    .map(vendor => ({
      name: vendor.vendor_name,
      category: vendor.category,
      why_recommended: `Best fit for ${questionnaire.current_practice_management} integration`,
      implementation_complexity: vendor.implementation_complexity,
      estimated_cost: getVendorCostEstimate(vendor, questionnaire),
      timeline: getVendorTimeline(vendor)
    }))
}

function generateTimeline(assessment: any, questionnaire: any): any {
  const totalDuration = assessment.overall_score < 2.5 ? '6-9 months' : '4-6 months'
  
  return {
    total_duration: totalDuration,
    phases: [
      { phase: 'Foundation', start: 'Week 1', duration: '4-6 weeks' },
      { phase: 'Implementation', start: 'Week 6', duration: '6-10 weeks' },
      { phase: 'Optimization', start: 'Week 16', duration: '4-8 weeks' }
    ],
    key_milestones: [
      { milestone: 'Pilot project launch', target_date: 'Week 8' },
      { milestone: 'First AI tool deployment', target_date: 'Week 12' },
      { milestone: 'Full implementation complete', target_date: 'Week 20' },
      { milestone: 'ROI measurement', target_date: 'Week 24' }
    ]
  }
}

function generateBudgetEstimates(questionnaire: any, assessment: any): any {
  const baseBudget = getBaseBudget(questionnaire.annual_revenue_range)
  const complexityMultiplier = assessment.overall_score < 2.5 ? 1.5 : 1.0
  
  return {
    total_estimated_cost: Math.round(baseBudget * complexityMultiplier),
    breakdown: {
      software_licenses: Math.round(baseBudget * 0.4 * complexityMultiplier),
      implementation_services: Math.round(baseBudget * 0.3 * complexityMultiplier),
      training: Math.round(baseBudget * 0.2 * complexityMultiplier),
      ongoing_support: Math.round(baseBudget * 0.1 * complexityMultiplier)
    },
    roi_timeline: questionnaire.roi_expectations || '12-18 months',
    cost_savings_potential: Math.round(baseBudget * 2.5)
  }
}

function generateSuccessMetrics(questionnaire: any): any[] {
  const metrics = [
    { metric: 'Time savings per attorney', target: '2-4 hours per week', measurement: 'Time tracking' },
    { metric: 'Client satisfaction score', target: '4.5+ out of 5', measurement: 'Client surveys' },
    { metric: 'Document processing speed', target: '50% faster', measurement: 'Process timing' }
  ]
  
  if (questionnaire.success_metrics) {
    // Add custom metrics based on user input
    metrics.push({
      metric: 'Custom metric',
      target: 'As defined by firm',
      measurement: 'Firm-specific tracking'
    })
  }
  
  return metrics
}

function generateRiskMitigation(questionnaire: any, assessment: any): any[] {
  const risks = []
  
  if (questionnaire.concerns_about_ai?.includes('staff')) {
    risks.push({
      risk: 'Staff resistance to AI adoption',
      mitigation: 'Comprehensive training program and change management support',
      probability: 'Medium',
      impact: 'High'
    })
  }
  
  if (assessment.financial_score < 3) {
    risks.push({
      risk: 'Budget overruns',
      mitigation: 'Phased implementation with clear budget controls',
      probability: 'Medium',
      impact: 'Medium'
    })
  }
  
  if (questionnaire.concerns_about_ai?.includes('security')) {
    risks.push({
      risk: 'Data security and compliance issues',
      mitigation: 'Security-first approach with regular audits',
      probability: 'Low',
      impact: 'High'
    })
  }
  
  return risks
}

function getBaseBudget(revenueRange: string): number {
  const budgets = {
    'Less than $500K': 25000,
    '$500K - $999K': 50000,
    '$1M - $1.9M': 100000,
    '$2M - $4.9M': 200000,
    '$5M - $9.9M': 400000,
    '$10M+': 750000
  }
  return budgets[revenueRange] || 100000
}

function getVendorCostEstimate(vendor: any, questionnaire: any): string {
  const baseCost = vendor.pricing_tier === 'budget' ? 5000 : 
                   vendor.pricing_tier === 'mid' ? 15000 : 50000
  
  const firmSizeMultiplier = questionnaire.annual_revenue_range?.includes('$10M+') ? 2 : 1
  
  return `$${(baseCost * firmSizeMultiplier).toLocaleString()} - $${(baseCost * firmSizeMultiplier * 1.5).toLocaleString()}`
}

function getVendorTimeline(vendor: any): string {
  const timelines = {
    'low': '2-4 weeks',
    'medium': '4-8 weeks',
    'high': '8-16 weeks'
  }
  return timelines[vendor.implementation_complexity] || '4-8 weeks'
}
