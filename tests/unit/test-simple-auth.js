#!/usr/bin/env node

const { google } = require('googleapis');

async function testSimpleAuth() {
    console.log('🧪 Simple GA4 Auth Test\n');
    
    try {
        // Test basic auth
        const auth = new google.auth.GoogleAuth({
            keyFile: './google-service-account.json',
            scopes: ['https://www.googleapis.com/auth/analytics.readonly']
        });
        
        const authClient = await auth.getClient();
        console.log('✅ Google Auth client created successfully');
        
        // Test getting an access token
        const accessToken = await authClient.getAccessToken();
        console.log('✅ Access token obtained:', accessToken.token ? 'Token received' : 'No token');
        
        // Test Analytics Admin API (simpler than Data API)
        const analyticsAdmin = google.analyticsadmin('v1beta');
        
        const response = await analyticsAdmin.accounts.list({
            auth: authClient
        });
        
        console.log('✅ Analytics Admin API response:', response.data);
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        
        if (error.message.includes('permission')) {
            console.log('\n💡 Permission issue - wait 5-10 minutes for Google to propagate permissions');
        }
        
        if (error.message.includes('not found')) {
            console.log('\n💡 Property not found - check GA4 Property ID: 366782606');
        }
    }
}

testSimpleAuth();
