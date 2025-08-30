#!/usr/bin/env node

const { google } = require('googleapis');

async function findProperties() {
    console.log('🔍 Finding Your GA4 Properties\n');
    
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './google-service-account.json',
            scopes: [
                'https://www.googleapis.com/auth/analytics.readonly',
                'https://www.googleapis.com/auth/analytics.admin.readonly'
            ]
        });
        
        const authClient = await auth.getClient();
        
        // Use a different approach - try to list properties directly
        console.log('📋 Method 1: Direct property listing...');
        const analyticsAdmin = google.analyticsadmin('v1beta');
        
        try {
            // Try to list all properties the service account can see
            const response = await analyticsAdmin.properties.list({
                auth: authClient,
                filter: 'parent:accounts/366782606'  // Use your account ID
            });
            
            console.log('✅ Properties found:', response.data.properties?.length || 0);
            
            if (response.data.properties) {
                response.data.properties.forEach(property => {
                    console.log(`\n🏠 Property: ${property.displayName}`);
                    console.log(`   Full ID: ${property.name}`);
                    console.log(`   Property ID: ${property.name.split('/').pop()}`);
                    console.log(`   Created: ${property.createTime}`);
                });
                
                // Test data access on the first property
                if (response.data.properties.length > 0) {
                    const firstProperty = response.data.properties[0];
                    console.log(`\n📊 Testing data access on: ${firstProperty.displayName}`);
                    
                    const analyticsData = google.analyticsdata('v1beta');
                    try {
                        const dataResponse = await analyticsData.properties.runReport({
                            auth: authClient,
                            property: firstProperty.name,
                            requestBody: {
                                dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                                metrics: [{ name: 'sessions' }],
                                dimensions: [{ name: 'date' }]
                            }
                        });
                        
                        console.log('✅ Data API working!');
                        console.log(`📈 Data points: ${dataResponse.data.rows?.length || 0}`);
                        
                        if (dataResponse.data.rows && dataResponse.data.rows.length > 0) {
                            const latest = dataResponse.data.rows[dataResponse.data.rows.length - 1];
                            console.log(`📊 Latest sessions: ${latest.metricValues[0].value}`);
                        } else {
                            console.log('📊 No data yet (normal for new properties)');
                        }
                        
                        // Show the correct property ID to use
                        console.log(`\n🎯 CORRECT PROPERTY ID TO USE: ${firstProperty.name.split('/').pop()}`);
                        
                    } catch (dataError) {
                        console.log('❌ Data API failed:', dataError.message);
                    }
                }
            } else {
                console.log('\n⚠️  No properties found. This could mean:');
                console.log('1. Permissions are still propagating (wait 10-15 minutes)');
                console.log('2. Service account needs to be added to the property');
                console.log('3. Property was created under a different account');
            }
            
        } catch (listError) {
            console.log('❌ Property listing failed:', listError.message);
            
            console.log('\n🔧 This usually means:');
            console.log('1. Permissions are still propagating');
            console.log('2. Service account not properly added to GA4 property');
            console.log('3. Need to wait 10-15 minutes and try again');
        }
        
    } catch (error) {
        console.log('❌ Discovery failed:', error.message);
    }
}

findProperties();
