# 🎨 Gemini Image Generation Setup Guide

## 🎯 Overview

Your **SingleShot** content automation now includes **AI-powered image generation** using Google's Gemini API! Every blog post will automatically get professional, branded visuals that perfectly match your legal AI content.

### 🖼️ **What Gets Generated:**

1. **🎯 Hero Images** (16:9 banner format)
   - Perfect for blog post headers
   - Professional, wide-format visuals
   - Optimized for desktop and mobile

2. **📱 Featured Images** (1:1 square format)
   - Social media optimized
   - Eye-catching thumbnails
   - Perfect for cards and previews

3. **🔗 Social Images** (1200x630 sharing format)
   - Optimized for Facebook, Twitter, LinkedIn
   - Text overlay friendly
   - Maximum engagement potential

4. **🖼️ Thumbnail Images** (small format)
   - Clear at reduced sizes
   - Simple, recognizable compositions
   - Fast loading for lists and grids

## 🚀 Quick Setup (3 Minutes)

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Add API Key to Environment

Edit your `.env` file:

```bash
# Gemini API for Image Generation
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

### Step 3: Deploy Image Generation Functions

```bash
# Deploy the image generation function
supabase functions deploy generate_images

# Apply database migrations for image support
supabase db push

# Test the setup
node scripts/test-image-generation.js
```

## 🎨 Image Generation Workflow

### Automatic Integration
Images are now automatically generated as **Step 6** in your weekly content cycle:

1. **Strategy** (0 min) → Content planning
2. **Research** (+5 min) → Source harvesting  
3. **Outlines** (+15 min) → Article structure
4. **Content** (+30 min) → Article writing
5. **Editorial** (+45 min) → Quality review
6. **🎨 Images** (+50 min) → **Visual generation**
7. **Publishing** (+70 min) → Content deployment

### Smart Prompt Generation
Each image is generated with contextually-aware prompts based on:

- **Article Title & Description**
- **Content Category** (AI Readiness, Implementation, Compliance, etc.)
- **Tags & Keywords**
- **Image Type** (hero, featured, social, thumbnail)

## 🎯 Professional Image Styles

### AI Readiness Content
- **Style:** Modern, tech-forward, professional
- **Elements:** AI brain icons, law scales, digital circuits
- **Colors:** Deep blue, silver, white, accent gold
- **Mood:** Confident, innovative, trustworthy

### Implementation Guides  
- **Style:** Step-by-step, process-oriented
- **Elements:** Connected nodes, progress arrows, checkmarks
- **Colors:** Navy blue, green, gray, white
- **Mood:** Organized, systematic, achievable

### Compliance & Ethics
- **Style:** Authoritative, secure, professional
- **Elements:** Security shields, legal gavels, compliance seals
- **Colors:** Dark blue, gold, white, gray
- **Mood:** Secure, compliant, authoritative

### Revenue Operations
- **Style:** Data-driven, growth-focused
- **Elements:** Growth charts, revenue graphs, KPI dashboards
- **Colors:** Blue, green, orange, white
- **Mood:** Growth-oriented, analytical, successful

## 📊 Database Schema

### New Image Columns in Posts Table
```sql
ALTER TABLE posts ADD COLUMN hero_image_url TEXT;
ALTER TABLE posts ADD COLUMN featured_image_url TEXT;
ALTER TABLE posts ADD COLUMN social_image_url TEXT;
ALTER TABLE posts ADD COLUMN thumbnail_image_url TEXT;
ALTER TABLE posts ADD COLUMN images_generated BOOLEAN DEFAULT FALSE;
```

### Image Generation Jobs Tracking
```sql
CREATE TABLE image_generation_jobs (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  image_type TEXT CHECK (image_type IN ('hero', 'featured', 'social', 'thumbnail')),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  generated_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Supabase Storage Bucket
- **Bucket:** `blog-images`
- **Public Access:** Yes (for web display)
- **File Size Limit:** 5MB
- **Allowed Types:** JPEG, PNG, WebP

## 🔧 Management Commands

### Test Image Generation
```bash
node scripts/test-image-generation.js
```

### Check Image Generation Status
```bash
# View recent image generation jobs
supabase sql --query "SELECT * FROM image_generation_jobs ORDER BY created_at DESC LIMIT 10;"

# Check posts with generated images
supabase sql --query "SELECT title, images_generated, hero_image_url FROM posts WHERE images_generated = true;"
```

### Manual Image Generation
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "your-post-id",
    "title": "Your Post Title",
    "description": "Your post description...",
    "category": "AI Strategy",
    "tags": ["AI", "Legal"],
    "image_type": "hero"
  }' \
  "YOUR_SUPABASE_URL/functions/v1/generate_images"
```

## 🎨 Expected Weekly Output

With image generation enabled, each week you'll get:

### Content
- **📄 1 Pillar Article** (~3,500 words)
- **📄 2 Spoke Articles** (~2,500 words each)

### Visuals  
- **🎯 12 Professional Images** (4 types × 3 articles)
- **📱 Social Media Ready** visuals
- **🖼️ Blog-Optimized** graphics
- **⚡ Fast-Loading** thumbnails

### Total Assets
- **~8,500 words** of premium content
- **12 custom images** perfectly matched to content
- **Complete visual branding** for your law firm
- **Social sharing optimization**

## 🚨 Troubleshooting

### Common Issues

**❌ "GEMINI_API_KEY environment variable is required"**
- Solution: Add your Gemini API key to the .env file

**❌ "Failed to generate image with Gemini"**
- Check API key validity
- Verify Gemini API quotas/billing
- Check function logs: `supabase functions logs generate_images`

**❌ "blog-images bucket not found"**
- Solution: Run `supabase db push` to create storage bucket

**❌ "Permission denied for storage"**
- Check RLS policies are applied
- Verify function has proper permissions

### Debug Commands

```bash
# Check function deployment
supabase functions list

# View image generation logs
supabase functions logs generate_images

# Test database schema
node scripts/test-image-generation.js

# Check storage bucket
supabase storage ls blog-images
```

## 💰 Cost Considerations

### Gemini API Pricing
- **Free Tier:** 60 requests per minute
- **Paid Tier:** $0.002 per image (very affordable)
- **Weekly Cost:** ~$0.024 (12 images × $0.002)
- **Monthly Cost:** ~$0.10 (48 images)

### Storage Costs
- **Supabase Storage:** $0.021 per GB/month
- **Estimated Usage:** <100MB/month
- **Monthly Cost:** <$0.01

**Total Monthly Cost: ~$0.11** 🎉

## 🎉 You're All Set!

Your **SingleShot** content automation now includes:

### ✅ **Automated Visual Creation**
- Professional images for every post
- Brand-consistent styling
- Multiple format optimization

### ✅ **Smart Content Matching**
- Context-aware image prompts
- Category-specific visual styles
- SEO-optimized alt text

### ✅ **Complete Integration**
- Seamless workflow integration
- Automatic storage and CDN
- Social media optimization

### 🏄‍♂️ **Your Content Authority Now Has Visual Impact!**

**Every week, your automation will:**
- 🎯 Generate premium legal AI content
- 🎨 Create matching professional visuals
- 📱 Optimize for all platforms and devices
- 🚀 Build your visual brand authority

**Your law firm's content marketing is now visually stunning and completely automated! 🤖✨**
