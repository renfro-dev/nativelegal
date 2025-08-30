#!/usr/bin/env node

/**
 * Alternative GA4 Connection Test
 * Using the Admin API approach that we know works
 */

const { google } = require('googleapis');
require('dotenv').config();

async function testGA4WorkingApproach() {
    console.log('🔍 GA4 Alternative Connection Test\n');
    
    try {
        // Use the same approach that worked before
        const auth = new google.auth.GoogleAuth({
            keyFile: './google-service-account.json',
            scopes: [
                'https://www.googleapis.com/auth/analytics.readonly',
                'https://www.googleapis.com/auth/analytics.admin.readonly'
            ]
        });
        
        const authClient = await auth.getClient();
        console.log('✅ Google Auth client created successfully');
        
        // Test Analytics Admin API (this worked before)
        const analyticsAdmin = google.analyticsadmin('v1beta');
        
        console.log('📊 Testing Analytics Admin API...');
        const accountsResponse = await analyticsAdmin.accounts.list({
            auth: authClient
        });
        
        console.log('✅ Admin API working! Accounts found:', accountsResponse.data.accounts?.length || 0);
        
        if (accountsResponse.data.accounts) {
            for (const account of accountsResponse.data.accounts) {
                console.log(`\n📈 Account: ${account.displayName}`);
                console.log(`   ID: ${account.name}`);
                
                // Try to get properties for this account
                try {
                    const propertiesResponse = await analyticsAdmin.properties.list({
                        auth: authClient,
                        filter: `parent:${account.name}`
                    });
                    
                    console.log(`   Properties: ${propertiesResponse.data.properties?.length || 0}`);
                    
                    if (propertiesResponse.data.properties) {
                        for (const property of propertiesResponse.data.properties) {
                            console.log(`     🏠 ${property.displayName}`);
                            console.log(`        Full ID: ${property.name}`);
                            console.log(`        Property ID: ${property.name.split('/').pop()}`);
                            
                            // Try the Data API on this specific property
                            if (property.name.includes('503108038')) {
                                console.log(`\n📊 Testing Data API on our property...`);
                                
                                const analyticsData = google.analyticsdata('v1beta');
                                try {
                                    const dataResponse = await analyticsData.properties.runReport({
                                        auth: authClient,
                                        property: property.name,
                                        requestBody: {
                                            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                                            metrics: [{ name: 'sessions' }],
                                            dimensions: [{ name: 'date' }]
                                        }
                                    });
                                    
                                    console.log('🎉 GA4 DATA API WORKING!');
                                    console.log(`📈 Data points available: ${dataResponse.data.rows?.length || 0}`);
                                    
                                    if (dataResponse.data.rows && dataResponse.data.rows.length > 0) {
                                        console.log('📊 Sample data from last 7 days:');
                                        dataResponse.data.rows.slice(-3).forEach(row => {
                                            console.log(`   ${row.dimensionValues[0].value}: ${row.metricValues[0].value} sessions`);
                                        });
                                    } else {
                                        console.log('📊 No traffic data yet (normal for new properties)');
                                    }
                                    
                                    return {
                                        success: true,
                                        propertyId: property.name.split('/').pop(),
                                        dataAvailable: dataResponse.data.rows?.length || 0
                                    };
                                    
                                } catch (dataError) {
                                    console.log(`❌ Data API failed: ${dataError.message}`);
                                    
                                    if (dataError.message.includes('User does not have sufficient permissions')) {
                                        console.log('💡 Permission issue - service account needs Viewer access to the property');
                                    }
                                }
                            }
                        }
                    }
                } catch (propError) {
                    console.log(`❌ Properties error: ${propError.message}`);
                }
            }
        }
        
        return { success: false, message: 'Property not found or data access denied' };
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        return { success: false, error: error.message };
    }
}

async function createAnalyticsFunction() {
    console.log('\n🔧 Creating Analytics Collection Function...');
    
    const functionCode = `import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // For now, simulate analytics data until GA4 connection is fully working
    const mockAnalytics = {
      date: new Date().toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 500) + 100,
      users: Math.floor(Math.random() * 400) + 80,
      pageviews: Math.floor(Math.random() * 1200) + 300,
      bounce_rate: (Math.random() * 0.3 + 0.4).toFixed(3),
      avg_session_duration: Math.floor(Math.random() * 180) + 120,
      top_pages: [
        { page: '/blog/ai-readiness-assessment-law-firms-2025/', views: Math.floor(Math.random() * 200) + 50 },
        { page: '/blog/legal-ai-implementation-roadmap-mid-size-firms/', views: Math.floor(Math.random() * 150) + 40 },
        { page: '/blog/ai-ethics-compliance-law-firms-state-requirements/', views: Math.floor(Math.random() * 120) + 30 }
      ],
      conversion_metrics: {
        consultation_requests: Math.floor(Math.random() * 5) + 1,
        newsletter_signups: Math.floor(Math.random() * 15) + 5,
        resource_downloads: Math.floor(Math.random() * 25) + 10
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: mockAnalytics,
        message: 'Analytics data collected successfully (simulated pending GA4 connection)',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})`;

    const fs = require('fs');
    const path = require('path');
    
    const functionDir = './supabase/functions/analytics_collector';
    if (!fs.existsSync(functionDir)) {
        fs.mkdirSync(functionDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(functionDir, 'index.ts'), functionCode);
    console.log('✅ Analytics function created: supabase/functions/analytics_collector/index.ts');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Deploy: supabase functions deploy analytics_collector');
    console.log('2. Test simulated analytics while GA4 propagates');
    console.log('3. Replace with real GA4 data once connection works');
}

testGA4WorkingApproach()
    .then(result => {
        if (!result.success) {
            createAnalyticsFunction();
        }
    })
    .catch(error => {
        console.log('❌ Test suite failed:', error);
        createAnalyticsFunction();
    });
