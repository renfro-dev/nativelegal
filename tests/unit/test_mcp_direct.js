// Direct test of Puppeteer MCP service
const fetch = require('node-fetch');

async function testMCPDirect() {
  console.log('🧪 Testing Puppeteer MCP Service Directly...\n');

  // Test the ABA site that previously failed
  const testUrl = 'https://www.americanbar.org/groups/artificial_intelligence/';
  
  try {
    console.log(`🔍 Testing: ${testUrl}`);
    console.log('📡 Calling MCP service...');
    
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3001/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: testUrl,
        waitFor: 'networkidle0',
        timeout: 30000,
        extractText: true,
        removeElements: ['script', 'style', 'nav', 'footer', 'aside']
      })
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  Request duration: ${duration}ms`);
    console.log(`📊 Response status: ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      
      console.log(`✅ SUCCESS!`);
      console.log(`📄 Content length: ${result.contentLength} chars`);
      console.log(`📋 Title: ${result.metadata?.title || 'N/A'}`);
      console.log(`🕒 Timestamp: ${result.timestamp}`);
      
      // Check for legal content
      const legalKeywords = ['law', 'legal', 'attorney', 'bar', 'artificial intelligence'];
      const foundKeywords = legalKeywords.filter(keyword => 
        result.content.toLowerCase().includes(keyword.toLowerCase())
      );
      
      console.log(`🔍 Legal keywords found: ${foundKeywords.length}/${legalKeywords.length}`);
      if (foundKeywords.length > 0) {
        console.log(`   ✅ Found: ${foundKeywords.join(', ')}`);
      }
      
      // Show content preview
      if (result.content && result.content.length > 0) {
        const preview = result.content.substring(0, 500) + '...';
        console.log(`\n📝 Content Preview:`);
        console.log(`${preview}`);
      }
      
      console.log(`\n🎯 Assessment: ${result.contentLength > 500 ? 'HIGH QUALITY' : 'LOW QUALITY'} content extraction`);
      
    } else {
      const error = await response.json();
      console.log(`❌ FAILED`);
      console.log(`📝 Error: ${error.error}`);
      console.log(`📋 Details: ${error.details}`);
    }
    
  } catch (error) {
    console.error(`❌ Exception: ${error.message}`);
  }
  
  console.log('\n🏁 Direct MCP test complete!');
}

testMCPDirect().catch(console.error);
