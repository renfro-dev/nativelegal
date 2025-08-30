// Test fresh legal sources that haven't been ingested yet
const SUPABASE_URL = 'https://gmcdnokfogtryliyhcoi.supabase.co'
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/ingest_url_advanced`

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY2Rub2tmb2d0cnlsaXloY29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Mjc5NTgsImV4cCI6MjA3MjAwMzk1OH0.1ExH3B9EgaY1YWWO8fAXpomcI2IXK2b3wFn2ElOd3LM'

// Fresh URLs that should benefit from Puppeteer MCP
const freshUrls = [
  {
    url: "https://www.americanbar.org/groups/artificial_intelligence/",
    category: "ai_readiness",
    trust_score: 1.0,
    description: "ABA AI Section (fresh URL)"
  },
  {
    url: "https://www.abajournal.com/magazine/article/artificial-intelligence-changing-how-lawyers-practice",
    category: "attorney_workflows_ai",
    trust_score: 0.9,
    description: "ABA Journal AI Practice Article"
  },
  {
    url: "https://www.law.com/2024/12/20/artificial-intelligence-legal-technology/",
    category: "legal_tech",
    trust_score: 0.85,
    description: "Law.com AI Legal Tech Article"
  },
  {
    url: "https://www.ilta.net/resources/articles/artificial-intelligence",
    category: "legal_tech",
    trust_score: 0.85,
    description: "ILTA AI Resources"
  },
  {
    url: "https://www.legaltech.org/whitepapers/artificial-intelligence-law-firms",
    category: "ai_readiness",
    trust_score: 0.8,
    description: "Legal Tech Org AI Whitepaper"
  }
]

async function ingestFreshUrl(urlData) {
  try {
    console.log(`🆕 Testing: ${urlData.description}`)
    console.log(`   URL: ${urlData.url}`)
    
    const startTime = Date.now()
    
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...urlData,
        force_puppeteer: true // Force Puppeteer for high-authority sites
      })
    })

    const endTime = Date.now()
    const duration = endTime - startTime

    const result = await response.json()
    
    console.log(`   ⏱️  Duration: ${duration}ms`)
    console.log(`   📊 Status: ${response.status}`)
    
    if (response.status === 201 && result.success) {
      console.log(`   🎉 NEW SUCCESS!`)
      console.log(`   📄 Content length: ${result.content_length} chars`)
      console.log(`   🔧 Crawl method: ${result.crawl_method}`)
      console.log(`   🎯 Filtered: ${result.filtered ? 'Yes' : 'No'}`)
      
      if (result.crawl_error) {
        console.log(`   ⚠️  Crawl notes: ${result.crawl_error}`)
      }
      
      // Show content preview if available
      if (result.source?.content_text && result.source.content_text.length > 0) {
        const preview = result.source.content_text.substring(0, 300) + '...'
        console.log(`   📝 Preview: ${preview}`)
      }
      
      return { success: true, content_length: result.content_length, method: result.crawl_method }
      
    } else if (response.status === 200) {
      console.log(`   ℹ️  Already exists`)
      return { success: false, reason: 'duplicate' }
    } else {
      console.log(`   ❌ FAILED`)
      console.log(`   📝 Error: ${result.error || 'Unknown error'}`)
      return { success: false, reason: 'error', details: result.details }
    }
    
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`)
    return { success: false, reason: 'exception', error: error.message }
  } finally {
    console.log('   ' + '─'.repeat(80))
  }
}

async function main() {
  console.log('🆕 Testing Fresh Legal Sources with Advanced Ingestion')
  console.log('=' .repeat(90))
  console.log('')
  
  const results = []
  let totalNewContent = 0
  let successfulExtractions = 0
  
  for (const urlData of freshUrls) {
    const result = await ingestFreshUrl(urlData)
    results.push({ url: urlData.url, result })
    
    if (result.success) {
      successfulExtractions++
      totalNewContent += result.content_length || 0
    }
    
    // Delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
  
  console.log('')
  console.log('🏆 FINAL RESULTS:')
  console.log('=' .repeat(90))
  
  results.forEach(({ url, result }) => {
    const domain = url.split('/')[2]
    if (result.success) {
      console.log(`✅ ${domain} - ${result.content_length} chars (${result.method})`)
    } else if (result.reason === 'duplicate') {
      console.log(`🔄 ${domain} - Already exists`)
    } else {
      console.log(`❌ ${domain} - Failed (${result.reason})`)
    }
  })
  
  console.log('')
  console.log(`🎯 New Ingestions: ${successfulExtractions}/${freshUrls.length}`)
  console.log(`📄 Total New Content: ${totalNewContent.toLocaleString()} characters`)
  
  if (successfulExtractions > 0) {
    console.log(`🚀 SUCCESS! Puppeteer MCP unlocked new legal content sources!`)
  } else {
    console.log(`🤔 No new content - may need MCP service debugging`)
  }
  
  console.log('')
  console.log('🏁 Fresh source testing complete!')
}

main().catch(console.error)
