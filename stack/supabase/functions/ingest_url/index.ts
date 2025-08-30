import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IngestRequest {
  url: string
  trust_score?: number
  category?: string
  priority?: string
}

interface SourceRow {
  url: string
  content_text: string | null
  trust_score: number
  is_filtered: boolean
  access_date: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { url, trust_score = 0.8, category, priority }: IngestRequest = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if URL already exists
    const { data: existing, error: checkError } = await supabaseClient
      .from('sources')
      .select('id, url')
      .eq('url', url)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existing) {
      return new Response(
        JSON.stringify({ 
          message: 'URL already exists', 
          source_id: existing.id,
          url: existing.url 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Fetch content from URL
    console.log(`Fetching content from: ${url}`)
    
    let content_text = null
    let is_filtered = false

    try {
      const fetchResponse = await fetch(url, {
        headers: {
          'User-Agent': 'SEO Machine Bot 1.0 (Legal Research)'
        }
      })

      if (fetchResponse.ok) {
        const rawContent = await fetchResponse.text()
        
        // Basic content extraction (remove HTML tags for now)
        content_text = rawContent
          .replace(/<script[^>]*>.*?<\/script>/gis, '')
          .replace(/<style[^>]*>.*?<\/style>/gis, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 50000) // Limit content size

        // Basic filtering - check for legal content indicators
        const legalIndicators = [
          'law', 'legal', 'attorney', 'lawyer', 'court', 'judge', 
          'litigation', 'contract', 'compliance', 'regulation'
        ]
        
        const hasLegalContent = legalIndicators.some(indicator => 
          content_text.toLowerCase().includes(indicator)
        )

        if (!hasLegalContent) {
          is_filtered = true
          console.log(`Content filtered: No legal indicators found for ${url}`)
        }
      } else {
        console.log(`Failed to fetch ${url}: ${fetchResponse.status}`)
        is_filtered = true
      }
    } catch (fetchError) {
      console.log(`Error fetching ${url}:`, fetchError)
      is_filtered = true
    }

    // Insert into sources table
    const sourceData: SourceRow = {
      url,
      content_text,
      trust_score,
      is_filtered,
      access_date: new Date().toISOString()
    }

    const { data: insertedSource, error: insertError } = await supabaseClient
      .from('sources')
      .insert(sourceData)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // TODO: Generate embedding using OpenAI API (future enhancement)
    // For now, we'll insert without embeddings

    console.log(`Successfully ingested: ${url}`)
    
    return new Response(
      JSON.stringify({
        success: true,
        source: insertedSource,
        category,
        priority,
        content_length: content_text?.length || 0,
        filtered: is_filtered
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      },
    )

  } catch (error) {
    console.error('Error in ingest_url function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
