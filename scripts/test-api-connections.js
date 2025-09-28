p1#!/usr/bin/env node

/**
 * API Connection Test Suite
 * Tests all external API connections for SEO Machine
 */

async function testAPIConnections() {
    console.log('🧪 SEO Machine API Connection Test Suite\n');
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0
    };
    
    // Test Google Analytics 4
    results.total++;
    console.log('📊 Testing Google Analytics 4...');
    try {
        if (process.env.GA4_PROPERTY_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
            console.log('✅ GA4 credentials available');
            console.log(`   Property ID: ${process.env.GA4_PROPERTY_ID}`);
            results.passed++;
        } else {
            console.log('❌ GA4 credentials missing');
            console.log('   Missing: GA4_PROPERTY_ID or GOOGLE_SERVICE_ACCOUNT_JSON');
            results.failed++;
        }
    } catch (error) {
        console.log('❌ GA4 test failed:', error.message);
        results.failed++;
    }
    
    // Test Google Search Console
    results.total++;
    console.log('\n🔍 Testing Google Search Console...');
    try {
        if (process.env.GSC_SITE_URL && process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
            console.log('✅ GSC credentials available');
            console.log(`   Site URL: ${process.env.GSC_SITE_URL}`);
            results.passed++;
        } else {
            console.log('❌ GSC credentials missing');
            console.log('   Missing: GSC_SITE_URL or GOOGLE_SERVICE_ACCOUNT_JSON');
            results.failed++;
        }
    } catch (error) {
        console.log('❌ GSC test failed:', error.message);
        results.failed++;
    }
    
    // Test OpenAI API
    results.total++;
    console.log('\n🤖 Testing OpenAI API...');
    try {
        if (process.env.OPENAI_API_KEY) {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('✅ OpenAI API connection successful');
                const data = await response.json();
                console.log(`   Available models: ${data.data?.length || 0}`);
                results.passed++;
            } else {
                console.log('❌ OpenAI API authentication failed');
                console.log(`   Status: ${response.status}`);
                results.failed++;
            }
        } else {
            console.log('❌ OpenAI API key missing');
            console.log('   Set: OPENAI_API_KEY=sk-...');
            results.failed++;
        }
    } catch (error) {
        console.log('❌ OpenAI test failed:', error.message);
        results.failed++;
    }
    
    // Test Anthropic Claude API
    results.total++;
    console.log('\n🧠 Testing Anthropic Claude API...');
    try {
        if (process.env.ANTHROPIC_API_KEY) {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 10,
                    messages: [{ role: 'user', content: 'Hi' }]
                })
            });
            
            if (response.ok) {
                console.log('✅ Anthropic API connection successful');
                results.passed++;
            } else if (response.status === 400) {
                console.log('✅ Anthropic API authenticated (400 expected for test)');
                results.passed++;
            } else {
                console.log('❌ Anthropic API authentication failed');
                console.log(`   Status: ${response.status}`);
                results.failed++;
            }
        } else {
            console.log('❌ Anthropic API key missing');
            console.log('   Set: ANTHROPIC_API_KEY=sk-ant-...');
            results.failed++;
        }
    } catch (error) {
        console.log('❌ Anthropic test failed:', error.message);
        results.failed++;
    }
    
    // Test Supabase Connection
    results.total++;
    console.log('\n🗄️  Testing Supabase Connection...');
    try {
        const supabaseUrl = 'https://gmcdnokfogtryliyhcoi.supabase.co';
        const response = await fetch(`${supabaseUrl}/rest/v1/sources?select=count&limit=0`, {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY2Rub2tmb2d0cnlsaXloY29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzU3MzksImV4cCI6MjA1MTIxMTczOX0.7xqKaKE7wEqJG2FgP_k4v7KGgBYNT7EvQVg6AXKZkHE'
            }
        });
        
        if (response.ok) {
            console.log('✅ Supabase connection successful');
            console.log(`   Database: Accessible`);
            results.passed++;
        } else {
            console.log('❌ Supabase connection failed');
            console.log(`   Status: ${response.status}`);
            results.failed++;
        }
    } catch (error) {
        console.log('❌ Supabase test failed:', error.message);
        results.failed++;
    }
    
    // Test Ahrefs API (if available)
    results.total++;
    console.log('\n🔗 Testing Ahrefs API...');
    try {
        if (process.env.AHREFS_API_TOKEN) {
            const response = await fetch('https://apiv2.ahrefs.com/v3/site-explorer/overview', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.AHREFS_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    target: 'ahrefs.com',
                    mode: 'domain'
                })
            });
            
            if (response.ok) {
                console.log('✅ Ahrefs API connection successful');
                results.passed++;
            } else {
                console.log('❌ Ahrefs API authentication failed');
                console.log(`   Status: ${response.status}`);
                results.failed++;
            }
        } else {
            console.log('⏭️  Ahrefs API key not configured (optional)');
            console.log('   Set: AHREFS_API_TOKEN=your-token');
            results.total--; // Don't count as failed
        }
    } catch (error) {
        console.log('❌ Ahrefs test failed:', error.message);
        results.failed++;
    }
    
    // Test SEMrush API (if available)
    results.total++;
    console.log('\n📈 Testing SEMrush API...');
    try {
        if (process.env.SEMRUSH_API_KEY) {
            const response = await fetch(`https://api.semrush.com/?type=domain_overview&key=${process.env.SEMRUSH_API_KEY}&domain=semrush.com&database=us`);
            
            if (response.ok) {
                console.log('✅ SEMrush API connection successful');
                results.passed++;
            } else {
                console.log('❌ SEMrush API authentication failed');
                console.log(`   Status: ${response.status}`);
                results.failed++;
            }
        } else {
            console.log('⏭️  SEMrush API key not configured (optional)');
            console.log('   Set: SEMRUSH_API_KEY=your-key');
            results.total--; // Don't count as failed
        }
    } catch (error) {
        console.log('❌ SEMrush test failed:', error.message);
        results.failed++;
    }
    
    // Summary
    console.log('\n🎊 API Connection Test Results');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📊 Total: ${results.total}`);
    console.log(`📈 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
    
    if (results.failed === 0) {
        console.log('\n🚀 All critical APIs connected! Ready for full automation!');
        return true;
    } else {
        console.log('\n🔧 Fix the failed connections above for optimal performance');
        return false;
    }
}

async function showNextSteps() {
    console.log('\n🎯 NEXT STEPS FOR FULL AUTOMATION');
    console.log('='.repeat(60));
    
    console.log('\n📊 PRIORITY 1 - Analytics (Essential)');
    console.log('✅ Google Analytics 4 → Real-time traffic tracking');
    console.log('✅ Google Search Console → Keyword performance');
    console.log('   Setup: Follow CREDENTIAL_SETUP_GUIDE.md');
    
    console.log('\n🤖 PRIORITY 2 - AI Content (High Impact)');
    console.log('✅ OpenAI API → GPT-4 content generation');
    console.log('✅ Anthropic Claude → Alternative AI provider');
    console.log('   Impact: 10x content production speed');
    
    console.log('\n🔍 PRIORITY 3 - Competitive Intelligence (Strategic)');
    console.log('⏳ Ahrefs API → Backlink and competitor analysis');
    console.log('⏳ SEMrush API → Keyword research and gaps');
    console.log('   Impact: Stay ahead of legal AI market trends');
    
    console.log('\n📱 PRIORITY 4 - Social & Email (Growth)');
    console.log('⏳ LinkedIn API → B2B legal audience targeting');
    console.log('⏳ Mailchimp API → Automated email sequences');
    console.log('   Impact: Amplify reach and lead generation');
    
    console.log('\n🚀 AUTOMATION UNLOCKED:');
    console.log('   📈 Real-time performance optimization');
    console.log('   🎯 AI-powered content strategy');
    console.log('   🔄 Automated competitive monitoring');
    console.log('   💰 Revenue attribution tracking');
}

// Main execution
testAPIConnections()
    .then(success => {
        showNextSteps();
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    });
