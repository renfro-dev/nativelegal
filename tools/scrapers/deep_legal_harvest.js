// 🏄‍♂️ DEEP LEGAL HARVEST - Extract ALL premium legal content with Puppeteer MCP
const fetch = require('node-fetch');
const fs = require('fs');

const MCP_ENDPOINT = 'http://localhost:3001/scrape';
const RESULTS_FILE = 'harvest_results.json';

// Load our premium sources
const premiumSources = JSON.parse(fs.readFileSync('premium_legal_sources.json', 'utf8'));
const allSources = [
  ...premiumSources.premium_legal_sources.tier_1_authorities,
  ...premiumSources.premium_legal_sources.tier_2_industry,
  ...premiumSources.premium_legal_sources.tier_3_specialized
];

async function harvestLegalContent(source, index, total) {
  console.log(`\n🎯 [${index + 1}/${total}] TARGETING: ${source.description}`);
  console.log(`   🌐 Domain: ${source.domain} (Trust: ${source.trust_score})`);
  console.log(`   🔗 URL: ${source.url}`);
  console.log(`   📂 Category: ${source.category}`);
  
  const startTime = Date.now();
  
  try {
    // Enhanced Puppeteer configuration for legal sites
    const mcpPayload = {
      url: source.url,
      waitFor: 'networkidle0',
      timeout: 45000,
      extractText: true,
      removeElements: [
        'script', 'style', 'nav', 'footer', 'aside', 
        '.advertisement', '.ad', '.sidebar', '.social-share',
        '.cookie-banner', '.popup', '.modal'
      ],
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      // Additional options for complex legal sites
      waitForSelector: 'body',
      scrollToBottom: true,
      takeScreenshot: false
    };

    console.log(`   ⚡ Launching Puppeteer MCP...`);
    
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mcpPayload)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (response.ok) {
      const result = await response.json();
      
      // Analyze content quality
      const contentLength = result.contentLength || 0;
      const hasExpectedContent = source.expected_content.split(', ').some(keyword =>
        result.content?.toLowerCase().includes(keyword.toLowerCase())
      );
      
      const qualityScore = calculateQualityScore(result.content, source.expected_content, contentLength);
      
      console.log(`   ✅ SUCCESS! (${duration}ms)`);
      console.log(`   📊 Content: ${contentLength.toLocaleString()} chars`);
      console.log(`   🎯 Quality Score: ${qualityScore}/10`);
      console.log(`   📋 Title: ${result.metadata?.title || 'N/A'}`);
      console.log(`   🔍 Expected content match: ${hasExpectedContent ? 'YES' : 'NO'}`);
      
      // Show content preview
      if (result.content && contentLength > 0) {
        const preview = result.content.substring(0, 200).replace(/\s+/g, ' ') + '...';
        console.log(`   📝 Preview: ${preview}`);
      }
      
      return {
        success: true,
        url: source.url,
        domain: source.domain,
        category: source.category,
        trust_score: source.trust_score,
        content_length: contentLength,
        quality_score: qualityScore,
        title: result.metadata?.title,
        content: result.content,
        duration_ms: duration,
        timestamp: new Date().toISOString(),
        has_expected_content: hasExpectedContent
      };
      
    } else {
      const error = await response.json();
      console.log(`   ❌ FAILED (${duration}ms)`);
      console.log(`   📝 Error: ${error.error}`);
      console.log(`   📋 Details: ${error.details}`);
      
      return {
        success: false,
        url: source.url,
        domain: source.domain,
        error: error.error,
        details: error.details,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      };
    }
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`   💥 EXCEPTION (${duration}ms)`);
    console.log(`   📝 Error: ${error.message}`);
    
    return {
      success: false,
      url: source.url,
      domain: source.domain,
      error: 'Exception',
      details: error.message,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    };
  }
}

function calculateQualityScore(content, expectedKeywords, contentLength) {
  if (!content || contentLength < 500) return 1;
  
  let score = 0;
  
  // Length score (0-3 points)
  if (contentLength > 5000) score += 3;
  else if (contentLength > 2000) score += 2;
  else if (contentLength > 1000) score += 1;
  
  // Keyword relevance (0-4 points)
  const keywords = expectedKeywords.split(', ');
  const foundKeywords = keywords.filter(keyword =>
    content.toLowerCase().includes(keyword.toLowerCase())
  );
  score += Math.min(4, foundKeywords.length);
  
  // Legal content indicators (0-3 points)
  const legalTerms = ['law', 'legal', 'attorney', 'court', 'regulation', 'compliance', 'ethics'];
  const foundLegalTerms = legalTerms.filter(term =>
    content.toLowerCase().includes(term)
  );
  score += Math.min(3, foundLegalTerms.length);
  
  return Math.min(10, score);
}

async function saveResults(results) {
  const summary = {
    harvest_timestamp: new Date().toISOString(),
    total_sources: results.length,
    successful_extractions: results.filter(r => r.success).length,
    failed_extractions: results.filter(r => !r.success).length,
    total_content_chars: results.filter(r => r.success).reduce((sum, r) => sum + (r.content_length || 0), 0),
    average_quality_score: results.filter(r => r.success && r.quality_score).reduce((sum, r) => sum + r.quality_score, 0) / results.filter(r => r.success && r.quality_score).length || 0,
    results: results
  };
  
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(summary, null, 2));
  console.log(`\n💾 Results saved to ${RESULTS_FILE}`);
  
  return summary;
}

async function main() {
  console.log('🚀 DEEP LEGAL HARVEST - Premium Content Extraction');
  console.log('=' .repeat(80));
  console.log(`📊 Targeting ${allSources.length} premium legal sources`);
  console.log(`🎯 Using Puppeteer MCP for maximum extraction power`);
  console.log('=' .repeat(80));
  
  // Test MCP connection
  try {
    const healthCheck = await fetch('http://localhost:3001/health');
    if (healthCheck.ok) {
      const health = await healthCheck.json();
      console.log(`✅ MCP Service: ${health.status} (browser: ${health.browser})`);
    } else {
      throw new Error('MCP not responding');
    }
  } catch (error) {
    console.log('❌ MCP Service not available. Start with: npm start');
    return;
  }
  
  console.log('\n🎣 Beginning harvest...\n');
  
  const results = [];
  const batchSize = 3;
  const delay = 8000; // 8 seconds between requests
  
  // Process in batches to be respectful
  for (let i = 0; i < allSources.length; i += batchSize) {
    const batch = allSources.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allSources.length/batchSize)}`);
    
    // Process batch sequentially
    for (let j = 0; j < batch.length; j++) {
      const source = batch[j];
      const globalIndex = i + j;
      
      const result = await harvestLegalContent(source, globalIndex, allSources.length);
      results.push(result);
      
      // Delay between requests (except last in batch)
      if (j < batch.length - 1) {
        console.log(`   ⏳ Cooling down for ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Longer delay between batches
    if (i + batchSize < allSources.length) {
      console.log(`\n🧊 Batch complete. Resting for 15s before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }
  
  console.log('\n🏆 HARVEST COMPLETE!');
  console.log('=' .repeat(80));
  
  // Save and analyze results
  const summary = await saveResults(results);
  
  console.log(`📊 FINAL STATS:`);
  console.log(`   🎯 Success Rate: ${summary.successful_extractions}/${summary.total_sources} (${Math.round(summary.successful_extractions/summary.total_sources*100)}%)`);
  console.log(`   📄 Total Content: ${summary.total_content_chars.toLocaleString()} characters`);
  console.log(`   ⭐ Average Quality: ${summary.average_quality_score.toFixed(1)}/10`);
  
  // Top performers
  const topPerformers = results
    .filter(r => r.success && r.quality_score >= 7)
    .sort((a, b) => b.quality_score - a.quality_score)
    .slice(0, 5);
    
  if (topPerformers.length > 0) {
    console.log(`\n🏅 TOP PERFORMERS:`);
    topPerformers.forEach((result, idx) => {
      console.log(`   ${idx + 1}. ${result.domain} - ${result.quality_score}/10 (${result.content_length} chars)`);
    });
  }
  
  // Failed extractions
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log(`\n⚠️  FAILED EXTRACTIONS:`);
    failures.forEach(result => {
      console.log(`   ❌ ${result.domain} - ${result.error}`);
    });
  }
  
  console.log(`\n🎉 We just unlocked ${summary.successful_extractions} premium legal content sources!`);
  console.log(`💪 The legal content universe is now at our fingertips!`);
}

main().catch(console.error);
