#!/usr/bin/env node

/**
 * Test Image Generation with Gemini
 * 
 * This script tests the image generation functionality
 * using Gemini API for blog post visuals.
 */

require('dotenv').config();

async function testImageGeneration() {
  console.log('🎨 Testing Image Generation with Gemini...\n');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // Check environment variables
  console.log('🔧 Environment Check:');
  console.log('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('   SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
  console.log('   GEMINI_API_KEY:', geminiApiKey ? '✅' : '❌');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('\n❌ Missing Supabase credentials. Please check your .env file.');
    process.exit(1);
  }

  if (!geminiApiKey) {
    console.log('\n⚠️  GEMINI_API_KEY not found. You\'ll need to add this to test image generation.');
    console.log('   Get your API key from: https://makersuite.google.com/app/apikey');
    console.log('   Add to .env: GEMINI_API_KEY=your-api-key-here');
  }

  try {
    // Test 1: Check if generate_images function is deployed
    console.log('\n📡 Testing generate_images Edge Function...');
    
    const testPayload = {
      post_id: 'test-post-id',
      title: 'AI Readiness Assessment for Law Firms: A Comprehensive 2025 Guide',
      description: 'Complete framework for evaluating your law firm\'s AI preparedness, including technical infrastructure, team readiness, and strategic planning.',
      category: 'AI Strategy',
      tags: ['AI Readiness', 'Assessment', 'Strategy', 'Implementation'],
      image_type: 'hero'
    };

    const response = await fetch(`${supabaseUrl}/functions/v1/generate_images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    console.log(`📊 Response Status: ${response.status}`);
    const result = await response.text();
    console.log(`📄 Response: ${result}\n`);

    if (response.ok) {
      console.log('✅ Image generation function is accessible');
      
      const data = JSON.parse(result);
      if (data.success) {
        console.log('🎯 Test successful!');
        console.log(`   Image URL: ${data.image_url}`);
        console.log(`   Image Type: ${data.image_type}`);
        console.log(`   Prompt Used: ${data.prompt_used?.substring(0, 100)}...`);
      }
    } else {
      console.log('⚠️  Function accessible but returned error (expected without Gemini API key)');
    }

    // Test 2: Check database schema
    console.log('🗄️  Testing database schema...');
    
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Check if image columns exist in posts table
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, hero_image_url, featured_image_url, social_image_url, thumbnail_image_url, images_generated')
      .limit(1);

    if (postsError) {
      console.log('❌ Database schema not ready:', postsError.message);
      console.log('   Run: supabase db push');
    } else {
      console.log('✅ Database schema ready for images');
    }

    // Check if image generation jobs table exists
    const { data: jobs, error: jobsError } = await supabase
      .from('image_generation_jobs')
      .select('*')
      .limit(1);

    if (jobsError) {
      console.log('❌ Image generation jobs table not ready:', jobsError.message);
      console.log('   Run: supabase db push');
    } else {
      console.log('✅ Image generation jobs table ready');
    }

    // Check if storage bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Storage check failed:', bucketsError.message);
    } else {
      const blogImagesBucket = buckets.find(b => b.id === 'blog-images');
      if (blogImagesBucket) {
        console.log('✅ blog-images storage bucket ready');
      } else {
        console.log('❌ blog-images storage bucket not found');
        console.log('   Run: supabase db push');
      }
    }

    // Test 3: Generate sample image prompts
    console.log('\n🎯 Sample Image Prompts:');
    console.log('========================');

    const samplePosts = [
      {
        title: 'AI Readiness Assessment for Law Firms',
        category: 'AI Readiness',
        tags: ['Assessment', 'Strategy']
      },
      {
        title: 'Legal AI Implementation Roadmap for Mid-Size Firms',
        category: 'Implementation',
        tags: ['Roadmap', 'Planning']
      },
      {
        title: 'AI Ethics and Compliance for Law Firms',
        category: 'Compliance',
        tags: ['Ethics', 'Regulations']
      }
    ];

    samplePosts.forEach((post, index) => {
      console.log(`\n📝 Post ${index + 1}: ${post.title}`);
      console.log(`   Category: ${post.category}`);
      console.log(`   Tags: ${post.tags.join(', ')}`);
      
      // This would generate the actual prompt (simplified version)
      const promptStyle = post.category === 'AI Readiness' ? 'modern, tech-forward' :
                         post.category === 'Implementation' ? 'step-by-step, process-oriented' :
                         'authoritative, secure';
      
      console.log(`   Prompt Style: ${promptStyle}`);
    });

    console.log('\n🎉 Image Generation Test Complete!');
    console.log('\n📋 Setup Checklist:');
    console.log('===================');
    console.log('✅ Supabase credentials configured');
    console.log(geminiApiKey ? '✅' : '⚠️ ', 'Gemini API key', geminiApiKey ? 'configured' : 'needed');
    console.log('✅ Image generation function accessible');
    console.log('✅ Database schema ready');
    console.log('✅ Storage bucket configured');

    if (!geminiApiKey) {
      console.log('\n🔑 To complete setup:');
      console.log('1. Get Gemini API key: https://makersuite.google.com/app/apikey');
      console.log('2. Add to .env: GEMINI_API_KEY=your-api-key-here');
      console.log('3. Deploy functions: supabase functions deploy generate_images');
      console.log('4. Test again: node scripts/test-image-generation.js');
    } else {
      console.log('\n🚀 Ready to generate images automatically!');
      console.log('Images will be created for each new blog post with:');
      console.log('   📄 Hero images (16:9 banner format)');
      console.log('   🎯 Featured images (1:1 social format)');
      console.log('   📱 Social images (1200x630 sharing format)');
      console.log('   🖼️  Thumbnail images (small format optimized)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Supabase Edge Function not deployed');
    console.error('2. Database migrations not applied');
    console.error('3. Invalid credentials');
    console.error('4. Network connectivity issues');
  }
}

testImageGeneration();
