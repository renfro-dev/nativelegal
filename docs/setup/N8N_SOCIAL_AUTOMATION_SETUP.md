# n8n Social Media Automation Setup Guide

## Overview

Automated content repurposing system using n8n to transform blog posts into multi-platform social media content for LinkedIn, Twitter/X, and other channels.

## Architecture

```
Blog Post (MDX) 
  ↓
n8n Workflow Engine
  ↓
├─→ LinkedIn (Native API)
├─→ Twitter/X (API v2)
├─→ Buffer (Schedule)
└─→ Analytics (Track)
```

## Prerequisites

### 1. n8n Installation Options

**Option A: n8n Cloud (Recommended for Quick Start)**
- Visit: https://n8n.io/cloud/
- Cost: Free tier (5,000 executions/month) or $20/month (unlimited)
- No hosting required
- Sign up and you're ready

**Option B: Self-Hosted (Recommended for Full Control)**
```bash
# Using Docker (easiest)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Or using npm
npm install n8n -g
n8n start
```

**Option C: Deploy to Railway/Render/Fly.io**
- One-click deploy options available
- Cost: $5-10/month
- Production-ready with persistence

### 2. API Credentials Needed

#### LinkedIn
1. Create LinkedIn App: https://www.linkedin.com/developers/apps
2. Request access to Marketing Developer Platform
3. Get credentials:
   - Client ID
   - Client Secret
   - Redirect URI
4. Required scopes:
   - `w_member_social` (post to profile)
   - `r_basicprofile`
   - `r_organization_social` (post to company page)
   - `w_organization_social`

#### Twitter/X
1. Apply for Developer Account: https://developer.twitter.com/
2. Create App in Developer Portal
3. Get credentials:
   - API Key
   - API Secret
   - Bearer Token
   - Access Token
   - Access Token Secret
4. Enable OAuth 2.0

#### OpenAI (for content generation)
1. Get API key: https://platform.openai.com/api-keys
2. Cost: ~$0.50-2.00 per blog post repurposing

#### Buffer (Optional - for scheduling)
1. Get API token: https://buffer.com/developers/api
2. Connect accounts (LinkedIn, Twitter)

## n8n Workflows

### Workflow 1: Blog Post to LinkedIn Article

**Trigger:** Manual or RSS feed from your blog
**Actions:**
1. Read blog post MDX file
2. Extract metadata (title, description, tags)
3. Generate LinkedIn-optimized summary (OpenAI)
4. Post to LinkedIn as article
5. Log success/failure

### Workflow 2: Blog Post to LinkedIn Carousel

**Trigger:** Manual or scheduled
**Actions:**
1. Read blog post content
2. Extract key sections (OpenAI)
3. Generate 10-slide carousel content
4. Create carousel images (Canva API or custom)
5. Post to LinkedIn
6. Track engagement

### Workflow 3: Blog Post to Twitter Thread

**Trigger:** Manual or scheduled
**Actions:**
1. Read blog post
2. Generate tweet thread (8-12 tweets)
3. Add statistics and hooks
4. Post thread to Twitter
5. Monitor engagement

### Workflow 4: Daily Content Queue

**Trigger:** Schedule (9am, 2pm, 5pm daily)
**Actions:**
1. Check content queue database
2. Get next post from queue
3. Post to LinkedIn or Twitter
4. Mark as posted
5. Track analytics

### Workflow 5: Content Repurposing Pipeline

**Trigger:** New blog post published
**Actions:**
1. Extract blog content
2. Generate multiple formats:
   - LinkedIn article
   - LinkedIn short post (3 variants)
   - Twitter thread
   - 10 quote cards
   - Carousel outline
3. Add to content queue
4. Notify for review

## Installation & Setup Steps

### Step 1: Install n8n

**Using Docker:**
```bash
cd ~/Desktop/SEO\ Machine
mkdir n8n-data
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v $(pwd)/n8n-data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your_secure_password \
  n8nio/n8n

# Access at: http://localhost:5678
```

### Step 2: Configure Credentials

1. Open n8n: http://localhost:5678
2. Go to Credentials (gear icon)
3. Add credentials for:
   - LinkedIn OAuth2
   - Twitter OAuth2
   - OpenAI API
   - HTTP Request (for custom APIs)

### Step 3: Import Workflows

Workflows are stored in `/stack/n8n/workflows/` directory.

To import:
1. Open n8n
2. Click "+" → "Import from File"
3. Select workflow JSON file
4. Configure credentials
5. Activate workflow

### Step 4: Test Workflows

1. Start with manual trigger
2. Run "Blog Post to LinkedIn Article" workflow
3. Verify post appears on LinkedIn
4. Check logs for any errors
5. Adjust as needed

## Workflow Configurations

### Environment Variables

Create `.env` file in n8n directory:
```bash
# OpenAI
OPENAI_API_KEY=sk-...

# LinkedIn
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
LINKEDIN_REDIRECT_URI=http://localhost:5678/rest/oauth2-credential/callback

# Twitter
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_BEARER_TOKEN=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_TOKEN_SECRET=...

# Blog
BLOG_RSS_URL=https://nativelegal.com/rss.xml
BLOG_CONTENT_PATH=/Users/JoshR/Desktop/SEO Machine/frontend/content/posts

# Database (for content queue)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=...
```

## Content Queue Database Schema

Add to your Supabase:

```sql
-- Content queue table
CREATE TABLE content_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_post_slug TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'linkedin_post', 'twitter_thread', 'carousel', etc.
  content_text TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'posted', 'failed'
  platform TEXT NOT NULL, -- 'linkedin', 'twitter'
  engagement_data JSONB, -- likes, comments, shares
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX idx_content_queue_status ON content_queue(status, scheduled_for);
CREATE INDEX idx_content_queue_platform ON content_queue(platform, status);

-- Function to get next post in queue
CREATE OR REPLACE FUNCTION get_next_queued_post(p_platform TEXT)
RETURNS TABLE (
  id UUID,
  blog_post_slug TEXT,
  content_type TEXT,
  content_text TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cq.id,
    cq.blog_post_slug,
    cq.content_type,
    cq.content_text
  FROM content_queue cq
  WHERE cq.platform = p_platform
    AND cq.status = 'pending'
    AND cq.scheduled_for <= NOW()
  ORDER BY cq.scheduled_for ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

## Posting Schedule Strategy

### LinkedIn
- **Monday 9am:** Blog post share with excerpt
- **Wednesday 2pm:** Carousel or insight post
- **Friday 10am:** Engagement post (poll, question)

### Twitter
- **Daily 9am:** Thread or insight
- **Daily 2pm:** Quote card or stat
- **Daily 5pm:** Engagement or retweet

## Content Templates

### LinkedIn Post Template
```
[Hook - 1 sentence problem statement]

[Context - 2-3 sentences explaining the issue]

[Solution/Insight - 3-4 bullets with key points]

[Call to Action]

Read the full guide: [link]

#LegalTech #LawFirm #PracticeManagement
```

### Twitter Thread Template
```
Tweet 1: [Hook with statistic]
Tweet 2: [Problem context]
Tweet 3-8: [Key insights, one per tweet]
Tweet 9: [Summary]
Tweet 10: [CTA + link]
```

## Monitoring & Analytics

### Track These Metrics in n8n
- Posts published per platform
- Engagement rate (likes, comments, shares)
- Click-through rate to blog
- Lead generation from social
- Best performing content types

### Analytics Workflow
```
Daily 11pm:
1. Fetch engagement data from LinkedIn API
2. Fetch engagement data from Twitter API
3. Store in Supabase analytics table
4. Generate weekly report
5. Email summary to team
```

## Troubleshooting

### Common Issues

**LinkedIn API Rate Limits:**
- 100 posts per day per user
- 25 posts per day per company page
- Solution: Space out posts, use Buffer for scheduling

**Twitter API Rate Limits:**
- 300 tweets per 3 hours (free tier)
- Solution: Upgrade to Basic tier ($100/month) for higher limits

**n8n Execution Limits:**
- Free tier: 5,000 executions/month
- Solution: Optimize workflows, upgrade to paid tier

## Next Steps

1. Set up n8n (cloud or self-hosted)
2. Configure API credentials
3. Import workflow templates
4. Test with one blog post
5. Build content queue for next 30 days
6. Activate scheduled workflows
7. Monitor and optimize

## Cost Breakdown

**Self-Hosted Option:**
- Server: $5-10/month (Railway/Render)
- OpenAI API: $1-3/month (for content generation)
- **Total: $6-13/month**

**n8n Cloud Option:**
- n8n Cloud: $20/month
- OpenAI API: $1-3/month
- **Total: $21-23/month**

**APIs:**
- LinkedIn: Free
- Twitter: Free (Basic tier)
- Buffer: $6/month (optional)

## Support Resources

- n8n Documentation: https://docs.n8n.io/
- n8n Community: https://community.n8n.io/
- Workflow Templates: https://n8n.io/workflows/
- Video Tutorials: https://www.youtube.com/@n8n-io

