import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImageGenerationRequest {
  post_id: string
  title: string
  description: string
  category: string
  tags: string[]
  image_type: 'hero' | 'featured' | 'social' | 'thumbnail'
}

interface ImagePromptTemplate {
  style: string
  composition: string
  elements: string[]
  mood: string
  colors: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!
    
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { post_id, title, description, category, tags, image_type } = await req.json() as ImageGenerationRequest

    console.log(`🎨 Generating ${image_type} image for post: ${title}`)

    // Generate contextual image prompt based on content
    const imagePrompt = generateImagePrompt(title, description, category, tags, image_type)
    
    console.log(`🎯 Image prompt: ${imagePrompt}`)

    // Call Gemini Imagen API for image generation
    const imageUrl = await generateImageWithGemini(imagePrompt, geminiApiKey, image_type)
    
    if (!imageUrl) {
      throw new Error('Failed to generate image with Gemini')
    }

    // Download and store image in Supabase Storage
    const storedImageUrl = await storeImageInSupabase(imageUrl, post_id, image_type, supabase)

    // Update post record with image URL
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        [`${image_type}_image_url`]: storedImageUrl,
        images_generated: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', post_id)

    if (updateError) {
      console.error('Error updating post with image URL:', updateError)
    }

    // Log successful generation
    const { error: logError } = await supabase
      .from('content_quality_scores')
      .upsert({
        post_id,
        image_generation_score: 1.0,
        image_prompt: imagePrompt,
        image_url: storedImageUrl,
        generated_at: new Date().toISOString()
      })

    if (logError) {
      console.error('Error logging image generation:', logError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        image_url: storedImageUrl,
        image_type,
        prompt_used: imagePrompt,
        post_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Image generation error:', error)
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

function generateImagePrompt(
  title: string, 
  description: string, 
  category: string, 
  tags: string[], 
  imageType: string
): string {
  const templates: Record<string, ImagePromptTemplate> = {
    'AI Readiness': {
      style: 'modern, professional, tech-forward',
      composition: 'clean corporate layout with subtle tech elements',
      elements: ['AI brain icon', 'law scales', 'digital circuits', 'professional office'],
      mood: 'confident, innovative, trustworthy',
      colors: ['deep blue', 'silver', 'white', 'accent gold']
    },
    'Implementation': {
      style: 'step-by-step, process-oriented, professional',
      composition: 'workflow diagram style with clear progression',
      elements: ['connected nodes', 'progress arrows', 'checkmarks', 'legal documents'],
      mood: 'organized, systematic, achievable',
      colors: ['navy blue', 'green', 'gray', 'white']
    },
    'Compliance': {
      style: 'authoritative, secure, professional',
      composition: 'shield and protection focused layout',
      elements: ['security shield', 'legal gavel', 'compliance checkmarks', 'document seals'],
      mood: 'secure, compliant, authoritative',
      colors: ['dark blue', 'gold', 'white', 'gray']
    },
    'Revenue Operations': {
      style: 'data-driven, growth-focused, professional',
      composition: 'dashboard and metrics layout',
      elements: ['growth charts', 'revenue graphs', 'KPI dashboards', 'business icons'],
      mood: 'growth-oriented, analytical, successful',
      colors: ['blue', 'green', 'orange', 'white']
    },
    'Change Management': {
      style: 'transformation-focused, people-centered',
      composition: 'before/after or transformation flow',
      elements: ['transformation arrows', 'team silhouettes', 'process flows', 'success indicators'],
      mood: 'transformative, supportive, progressive',
      colors: ['teal', 'orange', 'blue', 'white']
    }
  }

  // Select template based on category or tags
  let template = templates['AI Readiness'] // default
  
  for (const [key, tmpl] of Object.entries(templates)) {
    if (category.toLowerCase().includes(key.toLowerCase()) || 
        tags.some(tag => tag.toLowerCase().includes(key.toLowerCase()))) {
      template = tmpl
      break
    }
  }

  // Customize prompt based on image type
  const typeSpecific = {
    'hero': 'wide banner format (16:9), prominent title space, professional hero image',
    'featured': 'square format (1:1), social media optimized, eye-catching',
    'social': 'optimized for social sharing (1200x630), text overlay friendly',
    'thumbnail': 'small format optimized, clear at reduced size, simple composition'
  }

  const basePrompt = `Create a ${template.style} image for a legal technology blog post titled "${title}". 
  
  Content focus: ${description.substring(0, 200)}...
  
  Visual style: ${template.composition}
  Include elements: ${template.elements.join(', ')}
  Mood: ${template.mood}
  Color palette: ${template.colors.join(', ')}
  
  Format: ${typeSpecific[imageType as keyof typeof typeSpecific]}
  
  Requirements:
  - Professional law firm appropriate
  - Modern, clean design
  - No faces or specific people
  - Suitable for legal technology audience
  - High contrast for readability
  - Brand-safe and copyright-free
  
  Style: Corporate illustration, vector-style graphics, professional photography aesthetic`

  return basePrompt
}

async function generateImageWithGemini(prompt: string, apiKey: string, imageType: string): Promise<string | null> {
  try {
    // Set aspect ratio based on image type
    const aspectRatios = {
      'hero': '16:9',      // Wide banner format
      'featured': '1:1',   // Square format
      'social': '1200:630', // Social media format (close to 16:9)
      'thumbnail': '4:3'   // Standard thumbnail
    }
    
    const aspectRatio = aspectRatios[imageType as keyof typeof aspectRatios] || '1:1'
    
    // Using Gemini API with Imagen 3 for image generation
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini Imagen API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    // Extract image data from Gemini response
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0]
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // The response contains base64 encoded image data
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
          }
        }
      }
    }
    
    return null

  } catch (error) {
    console.error('Gemini Imagen API error:', error)
    return null
  }
}

async function storeImageInSupabase(
  imageUrl: string, 
  postId: string, 
  imageType: string, 
  supabase: any
): Promise<string> {
  try {
    let imageBuffer: ArrayBuffer
    
    if (imageUrl.startsWith('data:image/')) {
      // Handle base64 data URL from Gemini
      const base64Data = imageUrl.split(',')[1]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      imageBuffer = bytes.buffer
    } else {
      // Handle regular URL
      const imageResponse = await fetch(imageUrl)
      imageBuffer = await imageResponse.arrayBuffer()
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${postId}-${imageType}-${timestamp}.png`
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filename, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600'
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename)

    return publicUrlData.publicUrl

  } catch (error) {
    console.error('Error storing image:', error)
    throw error
  }
}

/* Example usage:

POST /functions/v1/generate_images
{
  "post_id": "uuid-here",
  "title": "AI Readiness Assessment for Law Firms: A Comprehensive 2025 Guide",
  "description": "Complete framework for evaluating your law firm's AI preparedness...",
  "category": "AI Strategy",
  "tags": ["AI Readiness", "Assessment", "Strategy"],
  "image_type": "hero"
}

Response:
{
  "success": true,
  "image_url": "https://your-project.supabase.co/storage/v1/object/public/blog-images/post-hero-image.jpg",
  "image_type": "hero",
  "prompt_used": "Create a modern, professional...",
  "post_id": "uuid-here"
}

*/
