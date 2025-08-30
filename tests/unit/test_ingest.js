// Test script for ingest_url Edge Function
const SUPABASE_URL = 'https://gmcdnokfogtryliyhcoi.supabase.co'
const FUNCTION_URL = `https://gmcdnokfogtryliyhcoi.supabase.co/functions/v1/ingest_url`

// You'll need to get your anon key from Supabase dashboard
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY2Rub2tmb2d0cnlsaXloY29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Mjc5NTgsImV4cCI6MjA3MjAwMzk1OH0.1ExH3B9EgaY1YWWO8fAXpomcI2IXK2b3wFn2ElOd3LM'

const initialUrls = [
  {
    url: "https://www.americanbar.org/groups/law_practice/publications/techreport/",
    category: "ai_readiness",
    trust_score: 1.0,
    priority: "high"
  },
  {
    url: "https://www.abajournal.com/web/article/artificial-intelligence-law-firms", 
    category: "attorney_workflows_ai",
    trust_score: 0.9,
    priority: "high"
  },
  {
    url: "https://www.clio.com/blog/legal-trends-report/",
    category: "revops_legal", 
    trust_score: 0.85,
    priority: "high"
  }
]

async function ingestUrl(urlData) {
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(urlData)
    })

    const result = await response.json()
    console.log(`✅ Ingested: ${urlData.url}`)
    console.log(`   Category: ${urlData.category}`)
    console.log(`   Status: ${response.status}`)
    console.log(`   Response:`, result)
    console.log('---')
    
    return result
  } catch (error) {
    console.error(`❌ Error ingesting ${urlData.url}:`, error)
    return null
  }
}

async function main() {
  console.log('🚀 Starting trusted sources ingestion...\n')
  
  for (const urlData of initialUrls) {
    await ingestUrl(urlData)
    // Add small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('✅ Ingestion complete!')
}

// Run the ingestion
main().catch(console.error)

console.log('📝 Instructions:')
console.log('1. Get your anon key from Supabase dashboard')
console.log('2. Replace YOUR_ANON_KEY_HERE with your actual key')
console.log('3. Uncomment the main() call at the bottom')
console.log('4. Run: node test_ingest.js')
