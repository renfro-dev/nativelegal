#!/usr/bin/env node

/**
 * Weekly Content Automation Status Checker
 * 
 * This script checks the health and status of the weekly content automation.
 * Run it manually or set up as a daily health check.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function checkAutomationStatus() {
  console.log('🤖 Checking Weekly Content Automation Status...\n');

  try {
    // Calculate current week number
    const projectStart = new Date('2024-12-30');
    const currentDate = new Date();
    const weekNumber = Math.floor((currentDate.getTime() - projectStart.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

    console.log(`📅 Current Week: ${weekNumber}`);
    console.log(`📅 Current Date: ${currentDate.toISOString().split('T')[0]}\n`);

    // Check recent workflow runs (if table exists)
    const { data: recentRuns, error: runsError } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (runsError) {
      console.error('❌ Error fetching workflow runs:', runsError);
      return;
    }

    console.log('📊 Recent Jobs:');
    console.log('===============');
    
    if (recentRuns.length === 0) {
      console.log('⚠️  No jobs found');
    } else {
      recentRuns.forEach((job, index) => {
        const status = job.status === 'completed' ? '✅' : 
                      job.status === 'failed' ? '❌' : 
                      job.status === 'in_progress' ? '🔄' : '⏳';
        
        const weekNumber = job.payload?.week_number || 'N/A';
        console.log(`${status} ${job.type} | Week ${weekNumber} | ${job.status} | ${new Date(job.created_at).toLocaleString()}`);
      });
    }

    // Check current week status
    console.log('\n🎯 Current Week Status:');
    console.log('======================');

    const { data: currentWeekJobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('payload->>week_number', weekNumber.toString())
      .order('scheduled_at');

    if (jobsError) {
      console.error('❌ Error fetching current week jobs:', jobsError);
      return;
    }

    if (currentWeekJobs.length === 0) {
      console.log(`⚠️  No jobs found for week ${weekNumber} - automation may not have run yet`);
      
      // Check if it's past Monday 9 AM UTC
      const now = new Date();
      const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday
      const hour = now.getUTCHours();
      
      if (dayOfWeek > 1 || (dayOfWeek === 1 && hour >= 9)) {
        console.log('🚨 ALERT: It\'s past the scheduled automation time but no jobs exist for this week!');
      }
    } else {
      console.log(`📝 Found ${currentWeekJobs.length} jobs for week ${weekNumber}:`);
      
      const jobStats = {
        pending: 0,
        in_progress: 0,
        completed: 0,
        failed: 0
      };

      currentWeekJobs.forEach(job => {
        jobStats[job.status]++;
        const status = job.status === 'completed' ? '✅' : 
                      job.status === 'failed' ? '❌' : 
                      job.status === 'in_progress' ? '🔄' : '⏳';
        
        console.log(`   ${status} ${job.type} | ${job.status}`);
      });

      console.log(`\n📈 Job Statistics:`);
      console.log(`   ✅ Completed: ${jobStats.completed}`);
      console.log(`   🔄 In Progress: ${jobStats.in_progress}`);
      console.log(`   ⏳ Pending: ${jobStats.pending}`);
      console.log(`   ❌ Failed: ${jobStats.failed}`);

      const totalJobs = currentWeekJobs.length;
      const completionRate = Math.round((jobStats.completed / totalJobs) * 100);
      console.log(`   📊 Completion Rate: ${completionRate}%`);

      if (jobStats.failed > 0) {
        console.log('\n🚨 ALERT: Some jobs have failed!');
      }
    }

    // Check for content files
    console.log('\n📄 Content Files Status:');
    console.log('========================');

    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (postsError) {
      console.error('❌ Error fetching posts:', postsError);
    } else if (posts.length === 0) {
      console.log('⚠️  No posts found in database');
    } else {
      console.log('📝 Recent Posts:');
      posts.forEach(post => {
        const status = post.status === 'published' ? '✅' : 
                      post.status === 'draft' ? '📝' : '⏳';
        console.log(`   ${status} ${post.title.substring(0, 50)}... | ${post.status} | ${new Date(post.created_at).toLocaleDateString()}`);
      });
    }

    // Health summary
    console.log('\n🏥 Health Summary:');
    console.log('==================');

    const lastRun = recentRuns[0];
    if (!lastRun) {
      console.log('🔴 UNHEALTHY: No automation jobs detected');
    } else {
      const daysSinceLastRun = Math.floor((currentDate - new Date(lastRun.created_at)) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastRun > 7) {
        console.log(`🔴 UNHEALTHY: Last run was ${daysSinceLastRun} days ago`);
      } else if (daysSinceLastRun > 3) {
        console.log(`🟡 WARNING: Last run was ${daysSinceLastRun} days ago`);
      } else {
        console.log(`🟢 HEALTHY: Last run was ${daysSinceLastRun} days ago`);
      }

      if (lastRun.status === 'failed') {
        console.log('🔴 UNHEALTHY: Last run failed');
      } else if (lastRun.status === 'completed') {
        console.log('🟢 HEALTHY: Last run completed successfully');
      }
    }

    console.log('\n✨ Status check complete!');

  } catch (error) {
    console.error('❌ Error checking automation status:', error);
  }
}

// Run the status check
checkAutomationStatus();
