import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { user, assessment, answers } = await request.json()

    // Create user in Supabase
    const { data: userData, error: userError } = await supabase
      .from('calculator_users')
      .insert({
        email: user.email,
        name: user.name,
        company: user.company,
        phone: user.phone,
        firm_size: user.firmSize,
        practice_areas: user.practiceAreas
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user:', userError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Create assessment record
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('calculator_assessments')
      .insert({
        user_id: userData.id,
        infrastructure_score: assessment.infrastructure,
        data_score: assessment.data,
        organizational_score: assessment.organizational,
        financial_score: assessment.financial,
        overall_score: assessment.overall,
        readiness_level: assessment.readiness,
        recommendations: assessment.recommendations,
        answers: answers
      })
      .select()
      .single()

    if (assessmentError) {
      console.error('Error creating assessment:', assessmentError)
      return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 })
    }

    return NextResponse.json({
      userId: userData.id,
      assessmentId: assessmentData.id,
      success: true
    })

  } catch (error) {
    console.error('Error in calculator API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
