// Test script for advanced ingest_url_advanced Edge Function with Puppeteer MCP
const SUPABASE_URL = 'https://gmcdnokfogtryliyhcoi.supabase.co'
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/ingest_url_advanced`

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY2Rub2tmb2d0cnlsaXloY29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Mjc5NTgsImV4cCI6MjA3MjAwMzk1OH0.1ExH3B9EgaY1YWWO8fAXpomcI2IXK2b3wFn2ElOd3LM'

// Test both previously failed URLs and new complex ones
const testUrls = [
  {
    url: "https://www.americanbar.org/groups/law_practice/publications/techreport/",
    category: "ai_readiness",
    trust_score: 1.0,
    priority: "high",
    force_puppeteer: true, // Force Puppeteer for testing
    description: "ABA Tech Report (previously failed)"
  },
  {
    url: "https://www.abajournal.com/web/article/artificial-intelligence-law-firms", 
    category: "attorney_workflows_ai",
    trust_score: 0.9,
    priority: "high",
    force_puppeteer: true,
    description: "ABA Journal AI Article (previously failed)"
  },
  {
    url: "https://www.clio.com/blog/legal-trends-report/",
    category: "revops_legal", 
    trust_score: 0.85,
    priority: "high",
    force_puppeteer: false, // Test simple HTTP first
    description: "Clio Legal Trends (should work with simple HTTP)"
  },
  {
    url: "https://www.law.com/",
    category: "legal_news",
    trust_score: 0.85,
    priority: "medium",
    force_puppeteer: true,
    description: "Law.com homepage (complex site)"
  }
]

async function ingestUrlAdvanced(urlData) {
  try {
    console.log(`🔍 Testing: ${urlData.description}`)
    console.log(`   URL: ${urlData.url}`)
    console.log(`   Method: ${urlData.force_puppeteer ? 'Puppeteer MCP' : 'Simple HTTP (with fallback)'}`)
    
    const startTime = Date.now()
    
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(urlData)
    })

    const endTime = Date.now()
    const duration = endTime - startTime

    const result = await response.json()
    
    console.log(`   ⏱️  Duration: ${duration}ms`)
    console.log(`   📊 Status: ${response.status}`)
    
    if (response.status === 201 && result.success) {
      console.log(`   ✅ SUCCESS!`)
      console.log(`   📄 Content length: ${result.content_length} chars`)
      console.log(`   🔧 Crawl method: ${result.crawl_method}`)
      console.log(`   🎯 Filtered: ${result.filtered ? 'Yes' : 'No'}`)
      
      if (result.crawl_error) {
        console.log(`   ⚠️  Crawl issues: ${result.crawl_error}`)
      }
      
      // Show content preview if available
      if (result.source?.content_text && result.source.content_text.length > 0) {
        const preview = result.source.content_text.substring(0, 200) + '...'
        console.log(`   📝 Preview: ${preview}`)
      }
      
    } else if (response.status === 200) {
      console.log(`   ℹ️  Already exists: ${result.message}`)
    } else {
      console.log(`   ❌ FAILED`)
      console.log(`   📝 Error: ${result.error || 'Unknown error'}`)
      if (result.details) {
        console.log(`   📋 Details: ${result.details}`)
      }
    }
    
    console.log('   ' + '─'.repeat(80))
    
    return result
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`)
    console.log('   ' + '─'.repeat(80))
    return null
  }
}

async function main() {
  console.log('🚀 Testing Advanced Ingestion with Puppeteer MCP Support')
  console.log('=' .repeat(90))
  console.log('')
  
  // Check if MCP service is running
  try {
    console.log('📡 Checking Puppeteer MCP service...')
    const mcpCheck = await fetch('http://localhost:3001/health')
    if (mcpCheck.ok) {
      const health = await mcpCheck.json()
      console.log(`   ✅ MCP Service: ${health.status} (browser: ${health.browser})`)
    } else {
      console.log('   ⚠️  MCP Service: Not responding')
      console.log('   💡 Tip: Start with "npm start" in another terminal')
    }
  } catch (error) {
    console.log('   ❌ MCP Service: Not running')
    console.log('   💡 Tip: Start with "npm start" in another terminal')
    console.log('   📝 Note: Advanced function will fall back to simple HTTP')
  }
  
  console.log('')
  console.log('🧪 Starting ingestion tests...')
  console.log('')
  
  const results = []
  
  for (const urlData of testUrls) {
    const result = await ingestUrlAdvanced(urlData)
    results.push({ url: urlData.url, result })
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
  
  console.log('')
  console.log('📊 SUMMARY RESULTS:')
  console.log('=' .repeat(90))
  
  let successful = 0
  let failed = 0
  let totalContent = 0
  
  results.forEach(({ url, result }) => {
    if (result && result.success && result.content_length > 0) {
      successful++
      totalContent += result.content_length
      console.log(`✅ ${url} (${result.content_length} chars, ${result.crawl_method})`)
    } else if (result && result.message && result.message.includes('already exists')) {
      console.log(`ℹ️  ${url} (already exists)`)
    } else {
      failed++
      console.log(`❌ ${url} (failed)`)
    }
  })
  
  console.log('')
  console.log(`🎯 Success Rate: ${successful}/${testUrls.length} (${Math.round(successful/testUrls.length*100)}%)`)
  console.log(`📄 Total Content: ${totalContent.toLocaleString()} characters`)
  console.log('')
  console.log('🏁 Testing complete!')
}

// Run the tests
main().catch(console.error)
