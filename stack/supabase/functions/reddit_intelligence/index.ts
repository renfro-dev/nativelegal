import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RedditPost {
  title: string
  selftext: string
  score: number
  created_utc: number
  permalink: string
  url: string
  author: string
  subreddit: string
  num_comments: number
}

interface VendorMatch {
  vendorName: string
  productName: string
  keywords: string[]
  category: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🔍 Starting Reddit Intelligence Collection...')

    // Get tracked vendors from database
    const { data: vendors, error: vendorError } = await supabase
      .from('tracked_vendors')
      .select('vendor_name, product_name, category, reddit_keywords')
      .eq('is_active', true)

    if (vendorError || !vendors) {
      throw new Error(`Failed to fetch vendors: ${vendorError?.message}`)
    }

    console.log(`📊 Tracking ${vendors.length} vendors`)

    // Target subreddits
    const subreddits = ['LawFirm', 'paralegal', 'LegalAdvice', 'smallbusiness', 'LegalTech', 'law', 'Ask_Lawyers']
    
    const allIntelligence = []
    
    // Scrape each subreddit
    for (const subreddit of subreddits) {
      console.log(`\n🔎 Scraping r/${subreddit}...`)
      
      try {
        // Fetch hot posts from subreddit (using JSON API)
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=100`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 LegalTechIntelligence/1.0'
          }
        })

        if (!response.ok) {
          console.log(`⚠️  Failed to fetch r/${subreddit}: ${response.status}`)
          continue
        }

        const data = await response.json()
        const posts: RedditPost[] = data.data.children.map((child: any) => child.data)

        console.log(`   Found ${posts.length} posts`)

        // Process each post
        for (const post of posts) {
          const postText = `${post.title} ${post.selftext}`.toLowerCase()
          
          // Check if post mentions any tracked vendors
          for (const vendor of vendors) {
            const keywords = vendor.reddit_keywords || []
            const hasMatch = keywords.some((keyword: string) => 
              postText.includes(keyword.toLowerCase())
            )

            if (hasMatch) {
              console.log(`   ✅ Match: ${vendor.vendor_name} in "${post.title.substring(0, 50)}..."`)

              // Simple sentiment analysis (can be enhanced with AI)
              const sentiment = analyzeSentiment(postText)
              
              // Extract themes (simple keyword extraction)
              const themes = extractThemes(postText, keywords)
              
              // Prepare intelligence record
              const intelligence = {
                source_type: 'reddit',
                source_url: `https://reddit.com${post.permalink}`,
                source_name: `r/${subreddit}`,
                title: post.title,
                content_text: post.selftext,
                author: post.author,
                published_at: new Date(post.created_utc * 1000).toISOString(),
                vendor_name: vendor.vendor_name,
                product_name: vendor.product_name,
                mentioned_tools: [vendor.vendor_name],
                sentiment_score: sentiment.score,
                sentiment_label: sentiment.label,
                extracted_themes: themes,
                engagement_score: post.score,
                view_count: null, // Reddit API doesn't provide views easily
                extracted_metadata: {
                  subreddit: subreddit,
                  comments_count: post.num_comments,
                  post_score: post.score,
                  full_url: post.url
                },
                processing_method: 'reddit_api',
                raw_data: {
                  post_id: post.permalink,
                  subreddit: subreddit,
                  created_utc: post.created_utc
                }
              }

              allIntelligence.push(intelligence)
            }
          }
        }

        // Rate limiting: wait between subreddits
        await new Promise(resolve => setTimeout(resolve, 2000))

      } catch (error) {
        console.error(`❌ Error processing r/${subreddit}:`, error.message)
        continue
      }
    }

    console.log(`\n📊 Collected ${allIntelligence.length} intelligence items`)

    // Insert into database
    if (allIntelligence.length > 0) {
      const { error: insertError } = await supabase
        .from('legal_tech_intelligence')
        .insert(allIntelligence)

      if (insertError) {
        console.error('❌ Error inserting intelligence:', insertError.message)
        // Continue anyway - we still collected the data
      } else {
        console.log(`✅ Inserted ${allIntelligence.length} records`)
      }
    }

    // Generate summary statistics
    const summaryStats = {
      total_collected: allIntelligence.length,
      by_vendor: groupBy(allIntelligence, 'vendor_name'),
      by_sentiment: groupBy(allIntelligence, 'sentiment_label'),
      top_posts: allIntelligence
        .sort((a, b) => b.engagement_score - a.engagement_score)
        .slice(0, 5)
        .map(item => ({
          title: item.title,
          vendor: item.vendor_name,
          sentiment: item.sentiment_label,
          engagement: item.engagement_score
        }))
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        stats: summaryStats,
        message: `Collected ${allIntelligence.length} intelligence items from ${subreddits.length} subreddits`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error:', error.message)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Simple sentiment analysis (can be enhanced with AI/ML)
function analyzeSentiment(text: string): { score: number, label: string } {
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'good', 'helpful', 'recommend', 'perfect', 'best', 'fantastic', 'saved time', 'efficient', 'worth it', 'impressed']
  const negativeWords = ['terrible', 'awful', 'bad', 'hate', 'waste', 'disappointed', 'poor', 'worst', 'overpriced', 'glitch', 'bug', 'broken', 'slow', 'useless', 'don\'t recommend']
  
  const lowerText = text.toLowerCase()
  
  let positiveScore = 0
  let negativeScore = 0
  
  positiveWords.forEach(word => {
    const matches = (lowerText.match(new RegExp(word, 'g')) || []).length
    positiveScore += matches
  })
  
  negativeWords.forEach(word => {
    const matches = (lowerText.match(new RegExp(word, 'g')) || []).length
    negativeScore += matches
  })
  
  const total = positiveScore + negativeScore
  const score = total > 0 ? (positiveScore - negativeScore) / total : 0
  
  let label = 'neutral'
  if (score > 0.2) label = 'positive'
  else if (score < -0.2) label = 'negative'
  
  return { score, label }
}

// Extract themes from text
function extractThemes(text: string, keywords: string[]): string[] {
  const themes: string[] = []
  
  const themePatterns = {
    'pricing': ['price', 'cost', 'expensive', 'affordable', 'worth', 'value'],
    'ease_of_use': ['easy', 'simple', 'intuitive', 'user-friendly', 'interface', 'dashboard'],
    'features': ['feature', 'functionality', 'capability', 'does', 'can'],
    'support': ['support', 'customer service', 'help', 'assistance', 'response'],
    'integration': ['integrate', 'connect', 'sync', 'works with', 'api'],
    'speed': ['fast', 'slow', 'speed', 'performance', 'lag', 'quick'],
    'accuracy': ['accurate', 'correct', 'reliable', 'mistake', 'error', 'wrong'],
    'training': ['learn', 'training', 'setup', 'difficult', 'steep learning curve']
  }
  
  for (const [theme, patterns] of Object.entries(themePatterns)) {
    if (patterns.some(pattern => text.includes(pattern))) {
      themes.push(theme)
    }
  }
  
  return themes
}

// Helper function to group array by property
function groupBy<T>(array: T[], key: keyof T): Record<string, number> {
  return array.reduce((acc, item) => {
    const value = String(item[key])
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}
