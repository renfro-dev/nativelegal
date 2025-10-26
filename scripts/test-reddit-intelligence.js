#!/usr/bin/env node

/**
 * Test Reddit Intelligence Edge Function
 * Tests the Reddit intelligence gathering system
 */

const fs = require('fs');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testRedditIntelligence() {
  console.log('🧪 Testing Reddit Intelligence Collection...\n');
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
    console.log('💡 Create a .env file with these values');
    return;
  }

  const functionUrl = `${SUPABASE_URL}/functions/v1/smart-service`;
  
  console.log('📡 Calling Edge Function:', functionUrl);
  console.log('⏳ This may take 30-60 seconds to scrape all subreddits...\n');

  const startTime = Date.now();

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error:', response.status, error);
      return;
    }

    const result = await response.json();

    console.log('\n' + '='.repeat(70));
    console.log('📊 REDDIT INTELLIGENCE RESULTS');
    console.log('='.repeat(70));
    
    if (result.success) {
      console.log(`\n✅ Success: ${result.message}`);
      console.log(`⏱️  Duration: ${duration}ms (${(duration/1000).toFixed(1)}s)`);
      
      if (result.stats) {
        console.log(`\n📈 Summary Statistics:`);
        console.log(`   Total Collected: ${result.stats.total_collected}`);
        
        if (result.stats.by_vendor && Object.keys(result.stats.by_vendor).length > 0) {
          console.log(`\n🏢 Mentions by Vendor:`);
          Object.entries(result.stats.by_vendor).forEach(([vendor, count]) => {
            console.log(`   ${vendor}: ${count}`);
          });
        }
        
        if (result.stats.by_sentiment && Object.keys(result.stats.by_sentiment).length > 0) {
          console.log(`\n😊 Sentiment Breakdown:`);
          Object.entries(result.stats.by_sentiment).forEach(([sentiment, count]) => {
            console.log(`   ${sentiment}: ${count}`);
          });
        }
        
        if (result.stats.top_posts && result.stats.top_posts.length > 0) {
          console.log(`\n🔥 Top 5 Most Engaged Posts:`);
          result.stats.top_posts.forEach((post, index) => {
            console.log(`\n   ${index + 1}. ${post.title.substring(0, 60)}${post.title.length > 60 ? '...' : ''}`);
            console.log(`      👤 Vendor: ${post.vendor} | 😊 Sentiment: ${post.sentiment} | 👍 Engagement: ${post.engagement}`);
          });
        }
      }
      
      console.log('\n💡 Next Steps:');
      console.log('   1. Check Supabase dashboard → legal_tech_intelligence table');
      console.log('   2. Query insights for content strategy:');
      console.log('      - Negative sentiment = content opportunities');
      console.log('      - Top engaged posts = trending topics');
      console.log('      - Vendor mentions = competitive intelligence');
      
    } else {
      console.log('\n⚠️  Function returned success:false');
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Error calling function:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Is the Edge Function deployed? (run: supabase functions deploy reddit_intelligence)');
    console.log('   2. Is your Supabase URL correct?');
    console.log('   3. Check Supabase logs for errors');
  }
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('⚠️  No .env file found');
  console.log('💡 Creating .env template...');
  fs.writeFileSync('.env', `# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Get these from: https://app.supabase.com/project/_/settings/api
`);
  console.log('✅ Created .env template - please fill in your values\n');
}

// Run the test
testRedditIntelligence()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
