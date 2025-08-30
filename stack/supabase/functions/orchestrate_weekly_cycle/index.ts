import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Job {
  id?: string
  type: string
  payload: any
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  scheduled_at: string
  completed_at?: string
}

interface ContentPlan {
  pillar_topic: string
  spoke_topics: string[]
  target_keywords: string[]
  content_strategy: string
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

    const { action, week_number } = await req.json()

    if (action === 'start_weekly_cycle') {
      console.log(`🎯 Starting automated weekly cycle for week ${week_number}`)

      // Step 1: Generate weekly content strategy
      const strategyJob: Job = {
        type: 'generate_strategy',
        payload: { 
          week_number,
          focus_areas: ['AI implementation', 'Legal technology', 'Practice management'],
          target_audience: 'nationwide USA law firm decision makers'
        },
        status: 'pending',
        scheduled_at: new Date().toISOString()
      }

      const { data: strategy, error: strategyError } = await supabase
        .from('jobs')
        .insert(strategyJob)
        .select()
        .single()

      if (strategyError) throw strategyError

      // Step 2: Research and harvest new sources
      const researchJob: Job = {
        type: 'research_harvest',
        payload: {
          week_number,
          target_sources: 15,
          use_puppeteer: true,
          quality_threshold: 0.7
        },
        status: 'pending',
        scheduled_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 min delay
      }

      const { data: research, error: researchError } = await supabase
        .from('jobs')
        .insert(researchJob)
        .select()
        .single()

      if (researchError) throw researchError

      // Step 3: Generate content outlines
      const outlineJob: Job = {
        type: 'generate_outlines',
        payload: {
          week_number,
          pillar_count: 1,
          spoke_count: 2,
          word_targets: { pillar: 3500, spoke: 2500 }
        },
        status: 'pending',
        scheduled_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min delay
      }

      const { data: outline, error: outlineError } = await supabase
        .from('jobs')
        .insert(outlineJob)
        .select()
        .single()

      if (outlineError) throw outlineError

      // Step 4: Content generation
      const contentJob: Job = {
        type: 'generate_content',
        payload: {
          week_number,
          quality_level: 'premium',
          seo_optimization: true,
          legal_compliance: true
        },
        status: 'pending',
        scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min delay
      }

      const { data: content, error: contentError } = await supabase
        .from('jobs')
        .insert(contentJob)
        .select()
        .single()

      if (contentError) throw contentError

      // Step 5: Editorial review and optimization
      const editJob: Job = {
        type: 'editorial_review',
        payload: {
          week_number,
          compliance_check: true,
          seo_optimization: true,
          fact_checking: true
        },
        status: 'pending',
        scheduled_at: new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 min delay
      }

      const { data: edit, error: editError } = await supabase
        .from('jobs')
        .insert(editJob)
        .select()
        .single()

      if (editError) throw editError

      // Step 6: Image generation
      const imageJob: Job = {
        type: 'generate_images',
        payload: {
          week_number,
          image_types: ['hero', 'featured', 'social', 'thumbnail'],
          style_preference: 'professional_legal_tech'
        },
        status: 'pending',
        scheduled_at: new Date(Date.now() + 50 * 60 * 1000).toISOString() // 50 min delay
      }

      const { data: images, error: imageError } = await supabase
        .from('jobs')
        .insert(imageJob)
        .select()
        .single()

      if (imageError) throw imageError

      // Step 7: Publication and deployment
      const publishJob: Job = {
        type: 'publish_content',
        payload: {
          week_number,
          update_sitemap: true,
          update_rss: true,
          social_promotion: true,
          include_images: true
        },
        status: 'pending',
        scheduled_at: new Date(Date.now() + 70 * 60 * 1000).toISOString() // 70 min delay (after images)
      }

      const { data: publish, error: publishError } = await supabase
        .from('jobs')
        .insert(publishJob)
        .select()
        .single()

      if (publishError) throw publishError

      return new Response(
        JSON.stringify({
          success: true,
          message: `Weekly cycle ${week_number} scheduled successfully`,
          jobs_created: 7,
          estimated_completion: '100 minutes',
          jobs: {
            strategy: strategy.id,
            research: research.id,
            outline: outline.id,
            content: content.id,
            edit: edit.id,
            images: images.id,
            publish: publish.id
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    if (action === 'get_cycle_status') {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('payload->>week_number', week_number)
        .order('scheduled_at')

      if (error) throw error

      const status = {
        week_number,
        total_jobs: jobs.length,
        completed: jobs.filter(j => j.status === 'completed').length,
        in_progress: jobs.filter(j => j.status === 'in_progress').length,
        pending: jobs.filter(j => j.status === 'pending').length,
        failed: jobs.filter(j => j.status === 'failed').length,
        progress_percentage: Math.round((jobs.filter(j => j.status === 'completed').length / jobs.length) * 100),
        jobs
      }

      return new Response(
        JSON.stringify({ success: true, status }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "start_weekly_cycle" or "get_cycle_status"' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )

  } catch (error) {
    console.error('Orchestration error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

/* Example usage:

POST /functions/v1/orchestrate_weekly_cycle
{
  "action": "start_weekly_cycle",
  "week_number": 2
}

Response:
{
  "success": true,
  "message": "Weekly cycle 2 scheduled successfully",
  "jobs_created": 6,
  "estimated_completion": "90 minutes",
  "jobs": {
    "strategy": "uuid-1",
    "research": "uuid-2",
    "outline": "uuid-3", 
    "content": "uuid-4",
    "edit": "uuid-5",
    "publish": "uuid-6"
  }
}

GET /functions/v1/orchestrate_weekly_cycle
{
  "action": "get_cycle_status",
  "week_number": 2
}

Response:
{
  "success": true,
  "status": {
    "week_number": 2,
    "total_jobs": 6,
    "completed": 3,
    "in_progress": 1,
    "pending": 2,
    "failed": 0,
    "progress_percentage": 50,
    "jobs": [...]
  }
}

*/
