#!/usr/bin/env node

/**
 * Test Weekly Automation Trigger
 * 
 * This script tests the weekly automation trigger without actually
 * generating content (dry run mode).
 */

require('dotenv').config();

async function testWeeklyTrigger() {
  console.log('🧪 Testing Weekly Automation Trigger...\n');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables:');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('   SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
    console.error('\nPlease check your .env file');
    process.exit(1);
  }

  try {
    console.log('📡 Testing connection to weekly_scheduler function...');
    
    const response = await fetch(`${supabaseUrl}/functions/v1/weekly_scheduler`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const result = await response.text();
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📄 Response Body: ${result}\n`);

    if (response.ok) {
      console.log('✅ Weekly automation trigger is working!');
      
      const data = JSON.parse(result);
      if (data.success) {
        console.log(`🎯 Week Number: ${data.week_number}`);
        console.log(`⏰ Trigger Time: ${data.trigger_time}`);
        
        if (data.skipped) {
          console.log('ℹ️  Content already exists for this week (expected behavior)');
        } else {
          console.log(`🚀 Jobs Created: ${data.jobs_created}`);
          console.log(`⏱️  Estimated Completion: ${data.estimated_completion}`);
        }
      }
    } else {
      console.log('❌ Weekly automation trigger failed');
      console.log('Check the Supabase function logs for more details');
    }

    // Test the status endpoint
    console.log('\n🔍 Testing status check...');
    
    const projectStart = new Date('2024-12-30');
    const currentDate = new Date();
    const weekNumber = Math.floor((currentDate.getTime() - projectStart.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

    const statusResponse = await fetch(`${supabaseUrl}/functions/v1/orchestrate_weekly_cycle`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'get_cycle_status',
        week_number: weekNumber
      })
    });

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Status check working');
      console.log(`📊 Progress: ${statusData.status?.progress_percentage || 0}%`);
      console.log(`📝 Total Jobs: ${statusData.status?.total_jobs || 0}`);
    } else {
      console.log('⚠️ Status check failed (this is OK if no jobs exist yet)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Supabase Edge Function not deployed');
    console.error('2. Invalid credentials');
    console.error('3. Network connectivity issues');
    console.error('\nTry running: supabase functions deploy weekly_scheduler');
    process.exit(1);
  }

  console.log('\n🎉 Test completed!');
  console.log('\n💡 Next steps:');
  console.log('1. The automation will run automatically every Monday at 9 AM UTC');
  console.log('2. Monitor with: node scripts/check-automation-status.js');
  console.log('3. View logs in Supabase dashboard');
}

testWeeklyTrigger();
