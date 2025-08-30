import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log('🤖 Weekly scheduler triggered!')

    // Calculate current week number (weeks since project start)
    const projectStartDate = new Date('2024-12-30') // Adjust to your project start
    const currentDate = new Date()
    const weekNumber = Math.floor((currentDate.getTime() - projectStartDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1

    console.log(`📅 Triggering content cycle for week ${weekNumber}`)

    // Check if this week's content has already been generated
    const { data: existingJobs, error: checkError } = await supabase
      .from('jobs')
      .select('id')
      .eq('payload->>week_number', weekNumber.toString())
      .limit(1)

    if (checkError) {
      console.error('Error checking existing jobs:', checkError)
      throw checkError
    }

    if (existingJobs && existingJobs.length > 0) {
      console.log(`⚠️ Week ${weekNumber} content already exists, skipping...`)
      return new Response(
        JSON.stringify({
          success: true,
          message: `Week ${weekNumber} content already generated`,
          week_number: weekNumber,
          skipped: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Call the orchestrate_weekly_cycle function
    const orchestrateUrl = `${supabaseUrl}/functions/v1/orchestrate_weekly_cycle`
    
    const response = await fetch(orchestrateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'start_weekly_cycle',
        week_number: weekNumber
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to trigger weekly cycle: ${response.statusText}`)
    }

    const result = await response.json()

    // Log the successful trigger
    const { error: logError } = await supabase
      .from('workflow_runs')
      .insert({
        week_number: weekNumber,
        trigger_type: 'automated_cron',
        status: 'started',
        jobs_created: result.jobs_created || 6,
        triggered_at: new Date().toISOString(),
        metadata: {
          estimated_completion: result.estimated_completion,
          jobs: result.jobs
        }
      })

    if (logError) {
      console.error('Error logging workflow run:', logError)
    }

    console.log(`✅ Successfully triggered week ${weekNumber} content cycle`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Week ${weekNumber} content cycle triggered successfully`,
        week_number: weekNumber,
        jobs_created: result.jobs_created,
        estimated_completion: result.estimated_completion,
        trigger_time: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Weekly scheduler error:', error)
    
    // Log the failed trigger
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      await supabase
        .from('workflow_runs')
        .insert({
          week_number: Math.floor((new Date().getTime() - new Date('2024-12-30').getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1,
          trigger_type: 'automated_cron',
          status: 'failed',
          triggered_at: new Date().toISOString(),
          error_message: error.message
        })
    } catch (logError) {
      console.error('Error logging failed run:', logError)
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

/* 
This function is designed to be triggered by:
1. Supabase Cron (pg_cron extension)
2. GitHub Actions cron job
3. External cron service (cron-job.org, etc.)

Example cron schedule: "0 9 * * 1" (Every Monday at 9 AM)
*/
