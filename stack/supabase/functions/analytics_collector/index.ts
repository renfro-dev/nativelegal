import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // For now, simulate analytics data until GA4 connection is fully working
    const mockAnalytics = {
      date: new Date().toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 500) + 100,
      users: Math.floor(Math.random() * 400) + 80,
      pageviews: Math.floor(Math.random() * 1200) + 300,
      bounce_rate: (Math.random() * 0.3 + 0.4).toFixed(3),
      avg_session_duration: Math.floor(Math.random() * 180) + 120,
      top_pages: [
        { page: '/blog/ai-readiness-assessment-law-firms-2025/', views: Math.floor(Math.random() * 200) + 50 },
        { page: '/blog/legal-ai-implementation-roadmap-mid-size-firms/', views: Math.floor(Math.random() * 150) + 40 },
        { page: '/blog/ai-ethics-compliance-law-firms-state-requirements/', views: Math.floor(Math.random() * 120) + 30 }
      ],
      conversion_metrics: {
        consultation_requests: Math.floor(Math.random() * 5) + 1,
        newsletter_signups: Math.floor(Math.random() * 15) + 5,
        resource_downloads: Math.floor(Math.random() * 25) + 10
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: mockAnalytics,
        message: 'Analytics data collected successfully (simulated pending GA4 connection)',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})