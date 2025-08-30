#!/usr/bin/env node

const { google } = require('googleapis');

async function testMinimal() {
    console.log('🧪 Minimal GA4 Test\n');
    console.log('Testing just the authentication without data queries...\n');
    
    try {
        // Test 1: Basic auth
        console.log('1️⃣  Testing basic authentication...');
        const auth = new google.auth.GoogleAuth({
            keyFile: './google-service-account.json',
            scopes: ['https://www.googleapis.com/auth/analytics.readonly']
        });
        
        const authClient = await auth.getClient();
        console.log('✅ Auth client created');
        
        // Test 2: Get access token
        console.log('\n2️⃣  Testing access token...');
        const tokenInfo = await authClient.getAccessToken();
        console.log('✅ Access token obtained:', tokenInfo.token ? 'YES' : 'NO');
        
        // Test 3: Test with property ID format that might work
        console.log('\n3️⃣  Testing property access...');
        const analyticsData = google.analyticsdata('v1beta');
        
        // Try different property ID formats
        const propertyFormats = [
            '503108038',
            'properties/503108038',
            'accounts/366782606/properties/503108038'
        ];
        
        for (const propId of propertyFormats) {
            try {
                console.log(`   Testing property format: ${propId}`);
                
                const response = await analyticsData.properties.getMetadata({
                    auth: authClient,
                    name: propId.startsWith('properties/') ? propId : `properties/${propId}`
                });
                
                console.log(`   ✅ SUCCESS with format: ${propId}`);
                console.log(`   Property name: ${response.data.name}`);
                break;
                
            } catch (error) {
                console.log(`   ❌ Failed with format: ${propId} - ${error.message.substring(0, 60)}...`);
            }
        }
        
    } catch (error) {
        console.log('\n❌ Minimal test failed:', error.message);
        
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Wait 10-15 minutes for Google permissions to propagate');
        console.log('2. In GA4, verify service account email is listed in Property access management');
        console.log('3. Ensure service account has at least "Viewer" role');
        console.log('4. Try again in a few minutes');
    }
}

testMinimal();
