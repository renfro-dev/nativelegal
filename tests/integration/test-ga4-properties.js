#!/usr/bin/env node

const { google } = require('googleapis');

async function testGA4Properties() {
    console.log('🔍 GA4 Properties Discovery\n');
    
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './google-service-account.json',
            scopes: [
                'https://www.googleapis.com/auth/analytics.readonly',
                'https://www.googleapis.com/auth/analytics.admin.readonly'
            ]
        });
        
        const authClient = await auth.getClient();
        const analyticsAdmin = google.analyticsadmin('v1beta');
        
        // First, get all accounts
        console.log('📊 Getting GA4 accounts...');
        const accountsResponse = await analyticsAdmin.accounts.list({
            auth: authClient
        });
        
        console.log('✅ Accounts found:', accountsResponse.data.accounts?.length || 0);
        
        if (accountsResponse.data.accounts) {
            for (const account of accountsResponse.data.accounts) {
                console.log(`\n📈 Account: ${account.displayName}`);
                console.log(`   ID: ${account.name}`);
                
                // Get properties for this account
                try {
                    const propertiesResponse = await analyticsAdmin.properties.list({
                        auth: authClient,
                        filter: `parent:${account.name}`
                    });
                    
                    console.log(`   Properties: ${propertiesResponse.data.properties?.length || 0}`);
                    
                    if (propertiesResponse.data.properties) {
                        for (const property of propertiesResponse.data.properties) {
                            console.log(`     🏠 ${property.displayName}`);
                            console.log(`        ID: ${property.name}`);
                            console.log(`        Property ID: ${property.name.split('/')[1]}`);
                            
                            // Try to get some data from this property
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
                                
                                console.log(`        📊 Data available: ${dataResponse.data.rows?.length || 0} data points`);
                                
                                if (dataResponse.data.rows && dataResponse.data.rows.length > 0) {
                                    const latest = dataResponse.data.rows[dataResponse.data.rows.length - 1];
                                    console.log(`        📈 Latest sessions: ${latest.metricValues[0].value}`);
                                }
                                
                            } catch (dataError) {
                                console.log(`        ⚠️  Data access: ${dataError.message}`);
                            }
                        }
                    }
                } catch (propError) {
                    console.log(`   ❌ Properties error: ${propError.message}`);
                }
            }
        }
        
    } catch (error) {
        console.log('❌ Discovery failed:', error.message);
    }
}

testGA4Properties();
