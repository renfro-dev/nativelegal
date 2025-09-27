import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase client will be created inside the handler

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with environment variables
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const body = await request.json()
    const { user_id, assessment_id, ...questionnaireData } = body

    // Create secondary questionnaire record
    const { data: questionnaireRecord, error: questionnaireError } = await supabase
      .from('secondary_questionnaire')
      .insert({
        user_id,
        ...questionnaireData
      })
      .select()
      .single()

    if (questionnaireError) {
      console.error('Error creating questionnaire:', questionnaireError)
      return NextResponse.json({ error: 'Failed to create questionnaire' }, { status: 500 })
    }

    // Create consultation booking record
    const { data: bookingData, error: bookingError } = await supabase
      .from('consultation_bookings')
      .insert({
        user_id,
        assessment_id,
        questionnaire_id: questionnaireRecord.id,
        status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    return NextResponse.json({
      id: questionnaireRecord.id,
      bookingId: bookingData.id,
      success: true
    })

  } catch (error) {
    console.error('Error in questionnaire API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
