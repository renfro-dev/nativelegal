# n8n Social Media Automation Workflows

## Quick Start

### 1. Start n8n
```bash
# From the project root
cd ~/Desktop/SEO\ Machine

# Using Docker (recommended)
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v $(pwd)/stack/n8n/data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=nativelegal2025 \
  n8nio/n8n

# Access at: http://localhost:5678
```

### 2. Configure Credentials

Open http://localhost:5678 and add:

**LinkedIn OAuth2:**
- Go to: https://www.linkedin.com/developers/apps
- Create new app
- Set redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
- Add credentials in n8n

**Twitter OAuth2:**
- Go to: https://developer.twitter.com/
- Create app
- Get API keys
- Add credentials in n8n

**OpenAI API:**
- Go to: https://platform.openai.com/api-keys
- Create API key
- Add in n8n

**Supabase:**
- Use your existing Supabase project
- Add URL and API key in n8n

### 3. Import Workflows

1. Click "+" → "Import from File"
2. Import these workflows in order:
   - `1-blog-to-linkedin-article.json`
   - `2-blog-to-twitter-thread.json`
   - `3-content-repurposing-pipeline.json`
   - `4-daily-content-queue-manager.json`

3. For each workflow:
   - Open workflow
   - Update credential references
   - Set blog post path
   - Test with manual trigger

### 4. Set Up Content Queue Database

Run this SQL in Supabase:

```sql
-- Content queue table (if not exists)
CREATE TABLE IF NOT EXISTS content_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_post_slug TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_text TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  platform TEXT NOT NULL,
  engagement_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_queue_status ON content_queue(status, scheduled_for);

-- Function to get next post
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

## Workflow Descriptions

### 1. Blog to LinkedIn Article
**Trigger:** Manual
**Purpose:** Convert a blog post into an engaging LinkedIn post
**Steps:**
1. Reads MDX blog post
2. Extracts frontmatter and content
3. Uses GPT-4 to create LinkedIn-optimized post
4. Posts to LinkedIn
5. Logs to database

**Usage:**
```json
{
  "blogPostPath": "/Users/JoshR/Desktop/SEO Machine/frontend/content/posts/debt-burden-law-firms-strategic-framework.mdx"
}
```

### 2. Blog to Twitter Thread
**Trigger:** Manual
**Purpose:** Convert a blog post into a 10-tweet thread
**Steps:**
1. Reads MDX blog post
2. Generates 10-tweet thread with GPT-4
3. Posts thread to Twitter (with proper reply threading)
4. Logs to database

### 3. Content Repurposing Pipeline
**Trigger:** Manual
**Purpose:** Generate 30 days of content from one blog post
**Output:**
- 1 LinkedIn Article
- 3 LinkedIn Short Posts (scheduled 5, 10, 15 days out)
- 1 Twitter Thread
- 10 Quote Cards (scheduled throughout month)
- 1 Carousel Outline

All content is added to queue with scheduling.

### 4. Daily Content Queue Manager
**Trigger:** Scheduled (9am, 2pm, 5pm daily)
**Purpose:** Automatically post queued content
**Steps:**
1. Checks content_queue for pending posts
2. Posts to LinkedIn or Twitter based on platform
3. Marks as posted in database
4. Tracks engagement

## Usage Examples

### Repurpose Single Blog Post
```bash
# 1. Open n8n: http://localhost:5678
# 2. Open "Content Repurposing Pipeline"
# 3. Click "Execute Workflow"
# 4. Set input:
{
  "blogPostPath": "/Users/JoshR/Desktop/SEO Machine/frontend/content/posts/debt-burden-law-firms-strategic-framework.mdx"
}
# 5. Run workflow
# Result: 30 days of content added to queue
```

### Manual LinkedIn Post
```bash
# 1. Open "Blog to LinkedIn Article"
# 2. Set blog post path
# 3. Execute
# Result: Immediate post to LinkedIn
```

### Check Queue Status
```sql
-- See what's scheduled
SELECT 
  blog_post_slug,
  content_type,
  platform,
  scheduled_for,
  status
FROM content_queue
WHERE status = 'pending'
ORDER BY scheduled_for ASC;

-- See posted content performance
SELECT 
  platform,
  COUNT(*) as posts,
  MAX(posted_at) as last_post
FROM content_queue
WHERE status = 'posted'
GROUP BY platform;
```

## Posting Schedule

### LinkedIn (3x per week)
- **Monday 9am:** Blog post share
- **Wednesday 2pm:** Insight or carousel
- **Friday 10am:** Engagement post

### Twitter (3x per day)
- **9am:** Thread or educational content
- **2pm:** Quote card or stat
- **5pm:** Engagement tweet

## Cost Estimates

### Per Blog Post Repurposing:
- **OpenAI API:** ~$0.50-1.50 (GPT-4 Turbo)
- **Time Saved:** ~4-6 hours of manual content creation
- **Content Generated:** 15+ pieces

### Monthly Costs:
- **n8n Cloud:** $20/month (or $0 self-hosted)
- **OpenAI API:** $10-30/month (8 blog posts)
- **LinkedIn API:** Free
- **Twitter API:** Free (Basic tier)
- **Total:** $30-50/month (or $10-30 self-hosted)

## Monitoring

### View Workflow Executions
1. Go to "Executions" tab in n8n
2. Filter by workflow
3. View success/failure rates
4. Check execution logs

### Track Social Media Performance
```sql
-- Add engagement data (manually or via API)
UPDATE content_queue
SET engagement_data = '{
  "likes": 45,
  "comments": 12,
  "shares": 8,
  "clicks": 156
}'::jsonb
WHERE id = 'post-id';

-- Analyze performance
SELECT 
  content_type,
  platform,
  AVG((engagement_data->>'likes')::int) as avg_likes,
  AVG((engagement_data->>'clicks')::int) as avg_clicks
FROM content_queue
WHERE status = 'posted'
  AND engagement_data IS NOT NULL
GROUP BY content_type, platform;
```

## Troubleshooting

### "LinkedIn credentials not working"
- Verify OAuth redirect URI matches exactly
- Check scopes include `w_member_social`
- Request Marketing Developer Platform access

### "OpenAI API rate limit"
- Reduce concurrent executions
- Add delay between API calls
- Upgrade to higher tier

### "Twitter thread not posting in order"
- Check that reply-to-status-id is set correctly
- Ensure tweets post sequentially, not in parallel
- Add 2-second delay between tweets

### "Content queue not executing"
- Verify cron trigger is active
- Check that scheduled_for times are in UTC
- Confirm Supabase credentials are valid

## Next Steps

1. **Test Individual Workflows**
   - Run each workflow manually
   - Verify posts appear on platforms
   - Check database logs

2. **Build Content Queue**
   - Run repurposing pipeline on all 8 blog posts
   - Review generated content
   - Edit/approve before scheduling

3. **Activate Automated Posting**
   - Enable "Daily Content Queue Manager"
   - Monitor executions for first week
   - Adjust timing/frequency as needed

4. **Scale Up**
   - Add more content types (video, infographics)
   - Integrate analytics tracking
   - Build lead capture workflows

## Support

- **n8n Docs:** https://docs.n8n.io/
- **n8n Community:** https://community.n8n.io/
- **Workflow Issues:** Check execution logs in n8n dashboard
- **API Issues:** Verify credentials and rate limits

