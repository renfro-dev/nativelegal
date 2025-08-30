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
  force_puppeteer?: boolean
}

interface SourceRow {
  url: string
  content_text: string | null
  trust_score: number
  is_filtered: boolean
  access_date: string
}

// Sites that typically need Puppeteer due to bot protection or JavaScript rendering
const COMPLEX_SITES = [
  'americanbar.org',
  'uscourts.gov', 
  'supremecourt.gov',
  'westlaw.com',
  'lexisnexis.com',
  'bloomberg.com',
  'law.com',
  'legaltech.org'
]

function needsPuppeteer(url: string): boolean {
  return COMPLEX_SITES.some(domain => url.includes(domain))
}

async function fetchWithPuppeteer(url: string): Promise<{ content: string | null, success: boolean, error?: string }> {
  try {
    // Call Puppeteer MCP via HTTP (assuming it's running locally or accessible)
    // You'll need to adjust this endpoint based on your MCP setup
    const puppeteerEndpoint = Deno.env.get('PUPPETEER_MCP_ENDPOINT') || 'http://host.docker.internal:3001/scrape'
    
    const response = await fetch(puppeteerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        waitFor: 'networkidle0', // Wait for network to be idle
        timeout: 30000,
        extractText: true,
        removeElements: ['script', 'style', 'nav', 'footer', 'aside'], // Clean up content
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      })
    })

    if (!response.ok) {
      return { content: null, success: false, error: `Puppeteer MCP error: ${response.status}` }
    }

    const result = await response.json()
    return { 
      content: result.content || result.text || null, 
      success: true 
    }
  } catch (error) {
    console.error('Puppeteer MCP error:', error)
    return { content: null, success: false, error: error.message }
  }
}

async function fetchWithSimpleHttp(url: string): Promise<{ content: string | null, success: boolean, error?: string }> {
  try {
    const fetchResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (fetchResponse.ok) {
      const rawContent = await fetchResponse.text()
      
      // Basic content extraction (remove HTML tags)
      const content = rawContent
        .replace(/<script[^>]*>.*?<\/script>/gis, '')
        .replace(/<style[^>]*>.*?<\/style>/gis, '')
        .replace(/<nav[^>]*>.*?<\/nav>/gis, '')
        .replace(/<footer[^>]*>.*?<\/footer>/gis, '')
        .replace(/<aside[^>]*>.*?<\/aside>/gis, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 50000) // Limit content size

      return { content, success: true }
    } else {
      return { content: null, success: false, error: `HTTP ${fetchResponse.status}` }
    }
  } catch (error) {
    return { content: null, success: false, error: error.message }
  }
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

    const { url, trust_score = 0.8, category, priority, force_puppeteer = false }: IngestRequest = await req.json()

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

    // Determine crawling strategy
    const usePuppeteer = force_puppeteer || needsPuppeteer(url)
    
    console.log(`Fetching content from: ${url} (method: ${usePuppeteer ? 'Puppeteer' : 'HTTP'})`)
    
    let content_text = null
    let is_filtered = false
    let crawl_method = 'simple_http'
    let crawl_error = null

    // Try the appropriate method first
    if (usePuppeteer) {
      const puppeteerResult = await fetchWithPuppeteer(url)
      if (puppeteerResult.success && puppeteerResult.content) {
        content_text = puppeteerResult.content
        crawl_method = 'puppeteer_mcp'
      } else {
        crawl_error = puppeteerResult.error
        console.log(`Puppeteer failed for ${url}, trying simple HTTP:`, puppeteerResult.error)
        
        // Fallback to simple HTTP
        const simpleResult = await fetchWithSimpleHttp(url)
        if (simpleResult.success && simpleResult.content) {
          content_text = simpleResult.content
          crawl_method = 'simple_http_fallback'
        } else {
          crawl_error = `Both methods failed. Puppeteer: ${puppeteerResult.error}, HTTP: ${simpleResult.error}`
        }
      }
    } else {
      const simpleResult = await fetchWithSimpleHttp(url)
      if (simpleResult.success && simpleResult.content) {
        content_text = simpleResult.content
        crawl_method = 'simple_http'
      } else {
        crawl_error = simpleResult.error
        console.log(`Simple HTTP failed for ${url}, trying Puppeteer:`, simpleResult.error)
        
        // Fallback to Puppeteer
        const puppeteerResult = await fetchWithPuppeteer(url)
        if (puppeteerResult.success && puppeteerResult.content) {
          content_text = puppeteerResult.content
          crawl_method = 'puppeteer_fallback'
        } else {
          crawl_error = `Both methods failed. HTTP: ${simpleResult.error}, Puppeteer: ${puppeteerResult.error}`
        }
      }
    }

    // Content filtering
    if (content_text) {
      // Enhanced legal content validation
      const legalIndicators = [
        'law', 'legal', 'attorney', 'lawyer', 'court', 'judge', 
        'litigation', 'contract', 'compliance', 'regulation',
        'jurisdiction', 'statute', 'case', 'precedent', 'ruling',
        'bar association', 'legal technology', 'practice management',
        'ethics', 'professional responsibility', 'legal research'
      ]
      
      const hasLegalContent = legalIndicators.some(indicator => 
        content_text.toLowerCase().includes(indicator)
      )

      if (!hasLegalContent) {
        is_filtered = true
        console.log(`Content filtered: No legal indicators found for ${url}`)
      }

      // Additional quality filters
      if (content_text.length < 500) {
        is_filtered = true
        console.log(`Content filtered: Too short (${content_text.length} chars) for ${url}`)
      }
    } else {
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

    console.log(`Successfully ingested: ${url} via ${crawl_method}`)
    
    return new Response(
      JSON.stringify({
        success: true,
        source: insertedSource,
        category,
        priority,
        content_length: content_text?.length || 0,
        filtered: is_filtered,
        crawl_method,
        crawl_error: crawl_error || null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      },
    )

  } catch (error) {
    console.error('Error in ingest_url_advanced function:', error)
    
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
