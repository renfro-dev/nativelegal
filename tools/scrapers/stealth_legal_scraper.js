// 🥷 STEALTH LEGAL SCRAPER - Advanced Cloudflare & Protection Bypass
const fetch = require('node-fetch');

const MCP_ENDPOINT = 'http://localhost:3001/scrape';

// Advanced stealth configuration for premium legal sites
const STEALTH_CONFIG = {
  // Multiple User-Agent rotation
  userAgents: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
  ],
  
  // Realistic browser behaviors
  behaviors: {
    scrollDelay: 2000,
    mouseMoveDelay: 1500,
    keyboardDelay: 100,
    waitAfterLoad: 5000
  },
  
  // Bypass techniques
  bypassTechniques: [
    'disable-blink-features',
    'disable-dev-shm-usage', 
    'disable-web-security',
    'disable-features=VizDisplayCompositor'
  ]
};

// High-value ABA targets that were blocked
const PREMIUM_ABA_TARGETS = [
  {
    url: 'https://www.americanbar.org/groups/artificial_intelligence/',
    description: 'ABA AI Section - Main Page',
    bypass_strategy: 'stealth_plus_delay'
  },
  {
    url: 'https://www.americanbar.org/groups/law_practice/publications/techreport/',
    description: 'ABA Legal Technology Survey - Root',
    bypass_strategy: 'stealth_plus_delay'
  },
  {
    url: 'https://www.americanbar.org/news/abanews/publications/yourlegal-update/2024/artificial-intelligence/',
    description: 'ABA AI Legal Updates',
    bypass_strategy: 'ultra_stealth'
  },
  {
    url: 'https://www.americanbar.org/groups/business_law/resources/business-lawyer-the/2024-issues/march-2024/artificial-intelligence/',
    description: 'ABA Business Law AI Resources',
    bypass_strategy: 'ultra_stealth'  
  }
];

async function stealthScrape(target, index) {
  console.log(`\n🥷 [${index + 1}] STEALTH TARGET: ${target.description}`);
  console.log(`   🎯 URL: ${target.url}`);
  console.log(`   🛡️ Bypass Strategy: ${target.bypass_strategy}`);
  
  const userAgent = STEALTH_CONFIG.userAgents[Math.floor(Math.random() * STEALTH_CONFIG.userAgents.length)];
  
  const stealthPayload = {
    url: target.url,
    waitFor: 'networkidle2', // Less aggressive waiting
    timeout: 60000, // Longer timeout for complex sites
    extractText: true,
    
    // Advanced stealth options
    userAgent: userAgent,
    viewport: { width: 1920, height: 1080 },
    
    // Remove detection vectors
    removeElements: [
      'script[src*="cloudflare"]',
      'script[src*="analytics"]', 
      'script[src*="tracking"]',
      '.cf-browser-verification',
      '#cf-wrapper',
      '.cloudflare-app'
    ],
    
    // Behavioral simulation
    humanBehavior: {
      scrollToBottom: true,
      randomMouseMoves: 3,
      simulateReading: true,
      waitBetweenActions: [1000, 3000]
    },
    
    // Extra stealth for ultra mode
    ...(target.bypass_strategy === 'ultra_stealth' && {
      disableImages: true,
      disableCSS: false,
      blockResources: ['font', 'media'],
      interceptRequests: true,
      spoofTimezone: 'America/New_York',
      spoofLanguage: 'en-US'
    })
  };
  
  const startTime = Date.now();
  
  try {
    console.log(`   🚀 Launching stealth extraction...`);
    console.log(`   🎭 User-Agent: ${userAgent.substring(0, 50)}...`);
    
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stealthPayload)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (response.ok) {
      const result = await response.json();
      
      // Check if we bypassed protection
      const isBlocked = result.content?.includes('Cloudflare') || 
                       result.content?.includes('blocked') ||
                       result.content?.includes('security solution') ||
                       result.metadata?.title?.includes('Attention Required');
      
      if (isBlocked) {
        console.log(`   🚫 STILL BLOCKED (${duration}ms)`);
        console.log(`   📋 Title: ${result.metadata?.title}`);
        console.log(`   📝 Content indicates protection active`);
        
        return {
          success: false,
          blocked: true,
          url: target.url,
          error: 'Cloudflare protection active',
          duration_ms: duration
        };
      } else {
        console.log(`   🎉 STEALTH SUCCESS! (${duration}ms)`);
        console.log(`   📊 Content: ${result.contentLength} chars`);
        console.log(`   📋 Title: ${result.metadata?.title}`);
        
        // Content quality assessment
        const hasLegalContent = /law|legal|attorney|bar|court|regulation|compliance/i.test(result.content);
        const qualityScore = result.contentLength > 2000 ? (hasLegalContent ? 8 : 5) : (hasLegalContent ? 4 : 2);
        
        console.log(`   ⭐ Quality Score: ${qualityScore}/10`);
        console.log(`   🔍 Legal Content: ${hasLegalContent ? 'YES' : 'NO'}`);
        
        if (result.content && result.contentLength > 0) {
          const preview = result.content.substring(0, 300).replace(/\s+/g, ' ') + '...';
          console.log(`   📝 Preview: ${preview}`);
        }
        
        return {
          success: true,
          blocked: false,
          url: target.url,
          content: result.content,
          content_length: result.contentLength,
          title: result.metadata?.title,
          quality_score: qualityScore,
          has_legal_content: hasLegalContent,
          duration_ms: duration,
          bypass_strategy: target.bypass_strategy,
          user_agent_used: userAgent
        };
      }
      
    } else {
      const error = await response.json();
      console.log(`   ❌ SCRAPING FAILED (${duration}ms)`);
      console.log(`   📝 Error: ${error.error}`);
      
      return {
        success: false,
        blocked: false,
        url: target.url,
        error: error.error,
        details: error.details,
        duration_ms: duration
      };
    }
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`   💥 EXCEPTION (${duration}ms)`);
    console.log(`   📝 Error: ${error.message}`);
    
    return {
      success: false,
      blocked: false,
      url: target.url,
      error: 'Exception',
      details: error.message,
      duration_ms: duration
    };
  }
}

async function main() {
  console.log('🥷 STEALTH LEGAL SCRAPER - Advanced Bypass Mode');
  console.log('=' .repeat(70));
  console.log(`🎯 Targeting ${PREMIUM_ABA_TARGETS.length} high-value ABA sources`);
  console.log(`🛡️ Using advanced Cloudflare bypass techniques`);
  console.log('=' .repeat(70));
  
  // Test MCP service
  try {
    const healthCheck = await fetch('http://localhost:3001/health');
    if (!healthCheck.ok) throw new Error('MCP not responding');
    const health = await healthCheck.json();
    console.log(`✅ MCP Service: ${health.status} (browser: ${health.browser})`);
  } catch (error) {
    console.log('❌ MCP Service not available. Start with: npm start');
    return;
  }
  
  console.log('\n🕵️ Beginning stealth operations...\n');
  
  const results = [];
  const longDelay = 15000; // 15 seconds between attempts
  
  for (let i = 0; i < PREMIUM_ABA_TARGETS.length; i++) {
    const target = PREMIUM_ABA_TARGETS[i];
    
    const result = await stealthScrape(target, i);
    results.push(result);
    
    // Long delay between attempts to avoid rate limiting
    if (i < PREMIUM_ABA_TARGETS.length - 1) {
      console.log(`   🧊 Cooling down for ${longDelay/1000}s to avoid detection...`);
      await new Promise(resolve => setTimeout(resolve, longDelay));
    }
  }
  
  console.log('\n🏆 STEALTH OPERATIONS COMPLETE!');
  console.log('=' .repeat(70));
  
  // Analysis
  const successful = results.filter(r => r.success && !r.blocked);
  const blocked = results.filter(r => r.blocked);
  const failed = results.filter(r => !r.success && !r.blocked);
  
  console.log(`📊 STEALTH RESULTS:`);
  console.log(`   🎯 Successful Bypasses: ${successful.length}/${PREMIUM_ABA_TARGETS.length}`);
  console.log(`   🚫 Still Blocked: ${blocked.length}/${PREMIUM_ABA_TARGETS.length}`);
  console.log(`   ❌ Technical Failures: ${failed.length}/${PREMIUM_ABA_TARGETS.length}`);
  
  if (successful.length > 0) {
    const totalContent = successful.reduce((sum, r) => sum + (r.content_length || 0), 0);
    console.log(`   📄 Total Bypassed Content: ${totalContent.toLocaleString()} characters`);
    
    console.log(`\n🏅 SUCCESSFUL BYPASSES:`);
    successful.forEach((result, idx) => {
      console.log(`   ${idx + 1}. ${result.content_length} chars - ${result.bypass_strategy} strategy`);
      console.log(`      📋 Title: ${result.title}`);
    });
  }
  
  if (blocked.length > 0) {
    console.log(`\n🛡️ CLOUDFLARE STILL ACTIVE ON:`);
    blocked.forEach(result => {
      console.log(`   • ${new URL(result.url).hostname}`);
    });
    console.log(`\n💡 Next steps: Try residential proxies or different timing`);
  }
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync('stealth_results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    total_targets: PREMIUM_ABA_TARGETS.length,
    successful_bypasses: successful.length,
    still_blocked: blocked.length,
    results: results
  }, null, 2));
  
  console.log(`\n💾 Stealth results saved to stealth_results.json`);
  
  if (successful.length > 0) {
    console.log(`\n🎉 BREAKTHROUGH! We cracked ${successful.length} premium ABA sources!`);
    console.log(`🥷 Stealth mode is WORKING - the legal fortress is breached!`);
  } else {
    console.log(`\n🤔 ABA's defenses are strong, but we're learning their patterns...`);
    console.log(`🔬 Next iteration: Try different timing and proxy strategies`);
  }
}

main().catch(console.error);
