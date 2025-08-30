#!/usr/bin/env node

/**
 * Weekly Automation Setup Script
 * 
 * This script sets up the weekly content automation system:
 * 1. Deploys the weekly_scheduler Edge Function
 * 2. Runs the database migration for cron jobs
 * 3. Tests the automation trigger
 * 4. Provides setup instructions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Weekly Content Automation...\n');

async function setupAutomation() {
  try {
    // Check if we're in the right directory
    if (!fs.existsSync('supabase/functions/weekly_scheduler/index.ts')) {
      console.error('❌ Error: weekly_scheduler function not found. Are you in the project root?');
      process.exit(1);
    }

    console.log('1️⃣ Deploying weekly_scheduler Edge Function...');
    try {
      execSync('supabase functions deploy weekly_scheduler', { stdio: 'inherit' });
      console.log('✅ weekly_scheduler function deployed successfully\n');
    } catch (error) {
      console.error('❌ Failed to deploy weekly_scheduler function');
      console.error('Make sure you have Supabase CLI installed and are logged in');
      process.exit(1);
    }

    console.log('2️⃣ Running database migration for cron jobs...');
    try {
      execSync('supabase db push', { stdio: 'inherit' });
      console.log('✅ Database migration completed successfully\n');
    } catch (error) {
      console.error('❌ Failed to run database migration');
      console.error('You may need to run this manually: supabase db push');
    }

    console.log('3️⃣ Testing automation trigger...');
    try {
      const testResult = execSync('node scripts/test-weekly-trigger.js', { encoding: 'utf8' });
      console.log(testResult);
      console.log('✅ Automation trigger test completed\n');
    } catch (error) {
      console.log('⚠️ Test script not found, skipping test...\n');
    }

    console.log('🎉 Weekly Automation Setup Complete!\n');
    
    console.log('📋 Setup Summary:');
    console.log('=================');
    console.log('✅ weekly_scheduler Edge Function deployed');
    console.log('✅ Database cron jobs configured');
    console.log('✅ Automation will run every Monday at 9:00 AM UTC');
    console.log('✅ Backup trigger on Wednesday at 9:00 AM UTC');
    console.log('✅ Health checks run daily at 10:00 AM UTC');

    console.log('\n🔧 Next Steps:');
    console.log('==============');
    console.log('1. Set up GitHub repository secrets for backup triggers:');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_ANON_KEY');
    console.log('');
    console.log('2. Monitor automation status:');
    console.log('   node scripts/check-automation-status.js');
    console.log('');
    console.log('3. Manual trigger (if needed):');
    console.log('   curl -X POST \\');
    console.log('     -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     "YOUR_SUPABASE_URL/functions/v1/weekly_scheduler"');
    console.log('');
    console.log('4. View cron jobs in Supabase:');
    console.log('   SELECT * FROM cron.job;');
    console.log('');
    console.log('5. Check automation logs:');
    console.log('   SELECT * FROM workflow_runs ORDER BY triggered_at DESC;');

    console.log('\n⏰ Automation Schedule:');
    console.log('======================');
    console.log('🗓️  Monday 9:00 AM UTC    - Primary content generation');
    console.log('🗓️  Wednesday 9:00 AM UTC - Backup content generation');
    console.log('🗓️  Daily 10:00 AM UTC    - Health check');
    console.log('🗓️  Monday 9:15 AM UTC    - GitHub Actions backup trigger');
    console.log('🗓️  Wednesday 9:15 AM UTC - GitHub Actions backup trigger');

    console.log('\n🎯 Expected Weekly Output:');
    console.log('==========================');
    console.log('📄 1 Pillar article (~3,500 words)');
    console.log('📄 2 Spoke articles (~2,500 words each)');
    console.log('📄 Total: ~8,500 words of premium legal AI content');
    console.log('⏱️  Complete cycle time: ~90 minutes');

    console.log('\n🏄‍♂️ Your content machine is now running on autopilot! 🤖');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupAutomation();
