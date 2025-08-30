// Test script for Puppeteer MCP service
const fetch = require('node-fetch');

const TEST_URLS = [
  {
    url: 'https://www.americanbar.org/groups/law_practice/publications/techreport/',
    description: 'ABA Tech Report (complex JavaScript site)',
    expectedKeywords: ['legal', 'technology', 'survey']
  },
  {
    url: 'https://www.abajournal.com/web/article/artificial-intelligence-law-firms',
    description: 'ABA Journal AI Article',
    expectedKeywords: ['artificial intelligence', 'law firms', 'legal']
  },
  {
    url: 'https://www.clio.com/blog/legal-trends-report/',
    description: 'Clio Legal Trends (should work with both methods)',
    expectedKeywords: ['legal trends', 'law firm', 'billing']
  }
];

async function testPuppeteerMCP() {
  const MCP_ENDPOINT = 'http://localhost:3001';
  
  console.log('🧪 Testing Puppeteer MCP Service...\n');

  // Test health check first
  try {
    console.log('📡 Testing health endpoint...');
    const healthResponse = await fetch(`${MCP_ENDPOINT}/health`);
    const health = await healthResponse.json();
    console.log('✅ Health check:', health);
    console.log('');
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('🚨 Make sure to start the MCP service first: npm start');
    return;
  }

  // Test scraping
  for (const test of TEST_URLS) {
    console.log(`🔍 Testing: ${test.description}`);
    console.log(`   URL: ${test.url}`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch(`${MCP_ENDPOINT}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: test.url,
          waitFor: 'networkidle0',
          timeout: 30000,
          extractText: true
        })
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (response.ok) {
        const result = await response.json();
        
        console.log(`   ✅ Success (${duration}ms)`);
        console.log(`   📄 Content length: ${result.contentLength} chars`);
        console.log(`   📋 Title: ${result.metadata?.title || 'N/A'}`);
        
        // Check for expected keywords
        const foundKeywords = test.expectedKeywords.filter(keyword => 
          result.content.toLowerCase().includes(keyword.toLowerCase())
        );
        
        console.log(`   🔍 Keywords found: ${foundKeywords.length}/${test.expectedKeywords.length}`);
        if (foundKeywords.length > 0) {
          console.log(`      ✅ ${foundKeywords.join(', ')}`);
        }
        
        const missingKeywords = test.expectedKeywords.filter(keyword => 
          !result.content.toLowerCase().includes(keyword.toLowerCase())
        );
        if (missingKeywords.length > 0) {
          console.log(`      ❌ Missing: ${missingKeywords.join(', ')}`);
        }

        // Show content preview
        const preview = result.content.substring(0, 200) + '...';
        console.log(`   📝 Preview: ${preview}`);
        
      } else {
        const error = await response.json();
        console.log(`   ❌ Failed: ${error.error}`);
        console.log(`   📝 Details: ${error.details}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
    
    // Small delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('🏁 Testing complete!');
}

// Run tests if called directly
if (require.main === module) {
  testPuppeteerMCP().catch(console.error);
}

module.exports = { testPuppeteerMCP };
