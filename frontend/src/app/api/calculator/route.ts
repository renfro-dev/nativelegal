import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For now, just return a success response
    // In production, this would save to Supabase
    return NextResponse.json({ 
      success: true, 
      message: 'Assessment submitted successfully',
      data: body 
    })
  } catch (error) {
    console.error('Error in calculator API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
