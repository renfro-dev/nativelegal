# Social Media Automation To-Do List

## Overview
Complete n8n automation system for LinkedIn and Twitter content repurposing from blog posts.

**Goal:** Transform 8 blog posts into 120+ social media posts with automated scheduling

**Timeline:** 3-4 weeks to full automation

**Cost:** $30-50/month (n8n Cloud + OpenAI) or $10-30/month (self-hosted + OpenAI)

---

## Phase 1: Setup & Configuration 🔧

### [ ] Task 1: Install and Start n8n
**Status:** In Progress  
**Time:** 10 minutes  
**Action:**
```bash
cd ~/Desktop/SEO\ Machine/stack/n8n
./start-n8n.sh
```
**Result:** Access n8n at http://localhost:5678 (admin/nativelegal2025)

---

### [ ] Task 2: Create LinkedIn Developer App
**Status:** Pending  
**Time:** 15 minutes  
**Action:**
1. Go to https://www.linkedin.com/developers/apps
2. Create new app
3. Request Marketing Developer Platform access
4. Set redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
5. Note: Client ID, Client Secret
6. Required scopes: `w_member_social`, `r_basicprofile`, `r_organization_social`, `w_organization_social`

**Documentation:** `docs/setup/N8N_SOCIAL_AUTOMATION_SETUP.md`

---

### [ ] Task 3: Create Twitter Developer Account
**Status:** Pending  
**Time:** 20 minutes  
**Action:**
1. Apply at https://developer.twitter.com/
2. Create app in Developer Portal
3. Enable OAuth 2.0
4. Get credentials:
   - API Key
   - API Secret
   - Bearer Token
   - Access Token
   - Access Token Secret

**Note:** May require approval (1-2 days)

---

### [ ] Task 4: Get OpenAI API Key
**Status:** Pending  
**Time:** 5 minutes  
**Action:**
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Add $10-20 credit to account
4. Note: API key (starts with sk-)

**Cost:** ~$1-2 per blog post repurposing

---

### [ ] Task 5: Configure Credentials in n8n
**Status:** Pending  
**Time:** 15 minutes  
**Action:**
1. Open n8n: http://localhost:5678
2. Click Settings (gear icon) → Credentials
3. Add credentials:
   - **LinkedIn OAuth2:** Add Client ID, Client Secret, complete OAuth flow
   - **Twitter OAuth2:** Add all API keys and tokens
   - **OpenAI API:** Add API key
   - **Supabase:** Add project URL and anon key (already have from main project)

**Test:** Each credential should show "Connected" status

---

### [ ] Task 6: Create Supabase Content Queue Database
**Status:** Pending  
**Time:** 5 minutes  
**Action:**
1. Open Supabase SQL Editor
2. Run this SQL:

```sql
-- Content queue table
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

CREATE INDEX IF NOT EXISTS idx_content_queue_status 
  ON content_queue(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_content_queue_platform 
  ON content_queue(platform, status);

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

**Verify:** Check that `content_queue` table appears in Supabase Table Editor

---

## Phase 2: Import Workflows 📥

### [ ] Task 7: Import "Blog to LinkedIn Article" Workflow
**Status:** Pending  
**Time:** 5 minutes  
**Action:**
1. In n8n, click "+" → "Import from File"
2. Select: `stack/n8n/workflows/1-blog-to-linkedin-article.json`
3. Update credential references (LinkedIn OAuth2, OpenAI, Supabase)
4. Save workflow

---

### [ ] Task 8: Import "Blog to Twitter Thread" Workflow
**Status:** Pending  
**Time:** 5 minutes  
**Action:**
1. Import: `stack/n8n/workflows/2-blog-to-twitter-thread.json`
2. Update credential references (Twitter OAuth2, OpenAI, Supabase)
3. Save workflow

---

### [ ] Task 9: Import "Content Repurposing Pipeline" Workflow ⭐ MOST IMPORTANT
**Status:** Pending  
**Time:** 5 minutes  
**Action:**
1. Import: `stack/n8n/workflows/3-content-repurposing-pipeline.json`
2. Update credential references (OpenAI, Supabase)
3. Save workflow

**Note:** This is the key workflow that generates 15+ content pieces from 1 blog post

---

### [ ] Task 10: Import "Daily Content Queue Manager" Workflow
**Status:** Pending  
**Time:** 5 minutes  
**Action:**
1. Import: `stack/n8n/workflows/4-daily-content-queue-manager.json`
2. Update credential references (LinkedIn, Twitter, Supabase)
3. **DO NOT ACTIVATE YET** - wait until content is reviewed
4. Save workflow

---

## Phase 3: Testing 🧪

### [ ] Task 11: Test LinkedIn Article Workflow
**Status:** Pending  
**Time:** 10 minutes  
**Action:**
1. Open "Blog to LinkedIn Article" workflow
2. Click "Execute Workflow"
3. Set input:
```json
{
  "blogPostPath": "/Users/JoshR/Desktop/SEO Machine/frontend/content/posts/debt-burden-law-firms-strategic-framework.mdx"
}
```
4. Run workflow
5. Check LinkedIn profile for post
6. Verify post appears in Supabase `content_queue` table

**Success Criteria:** Post appears on LinkedIn with proper formatting and link

---

### [ ] Task 12: Test Twitter Thread Workflow
**Status:** Pending  
**Time:** 10 minutes  
**Action:**
1. Open "Blog to Twitter Thread" workflow
2. Execute with same blog post path
3. Verify 10-tweet thread posts to Twitter
4. Check that thread replies work correctly
5. Verify database logging

**Success Criteria:** Full thread appears on Twitter with proper threading

---

### [ ] Task 13: Test Content Repurposing Pipeline (Critical Test!)
**Status:** Pending  
**Time:** 15 minutes  
**Action:**
1. Open "Content Repurposing Pipeline" workflow
2. Execute with debt-burden blog post
3. Wait for GPT-4 to generate all content (~2-3 minutes)
4. Check Supabase `content_queue` table

**Expected Results:**
- 1 LinkedIn Article (immediate)
- 3 LinkedIn Short Posts (scheduled 5, 10, 15 days out)
- 1 Twitter Thread (scheduled 1 day out)
- 10 Quote Cards (scheduled every 3 days)
- 1 Carousel Outline (scheduled 7 days out)

**Total:** 15+ content pieces added to queue

**Success Criteria:** All 15+ items appear in `content_queue` with correct scheduling

---

## Phase 4: Content Creation 📝

### [ ] Task 14: Run Content Repurposing on All 8 Blog Posts
**Status:** Pending  
**Time:** 60-90 minutes  
**Action:**
Run "Content Repurposing Pipeline" on each blog post:

1. ✅ debt-burden-law-firms-strategic-framework.mdx
2. ⬜ ai-readiness-assessment-law-firms-2025.mdx
3. ⬜ legal-ai-implementation-roadmap-mid-size-firms.mdx
4. ⬜ ai-ethics-compliance-law-firms-state-requirements.mdx
5. ⬜ ai-tool-vendor-evaluation-framework-legal.mdx
6. ⬜ change-management-strategies-legal-ai-adoption.mdx
7. ⬜ revops-metrics-ai-roi-legal-practice-management.mdx
8. ⬜ ai-powered-client-intake-automation-family-law.mdx

**Expected Output:** ~120 social media posts scheduled over next 3 months

**OpenAI Cost:** ~$10-16 total

---

### [ ] Task 15: Review and Approve Generated Content
**Status:** Pending  
**Time:** 2-3 hours  
**Action:**
1. Query Supabase to see all pending content:
```sql
SELECT 
  blog_post_slug,
  content_type,
  LEFT(content_text, 100) as preview,
  platform,
  scheduled_for
FROM content_queue
WHERE status = 'pending'
ORDER BY scheduled_for ASC;
```

2. Review each piece of content
3. Edit content_text if needed
4. Delete any low-quality pieces
5. Adjust scheduled_for dates if needed

**Quality Check:**
- Professional tone ✓
- Clear CTA and link ✓
- Proper hashtags ✓
- No errors or weird formatting ✓

---

### [ ] Task 16: Verify Posting Schedule
**Status:** Pending  
**Time:** 15 minutes  
**Action:**
1. Check content distribution:
```sql
-- LinkedIn posts per week
SELECT 
  DATE_TRUNC('week', scheduled_for) as week,
  COUNT(*) as posts
FROM content_queue
WHERE platform = 'linkedin' AND status = 'pending'
GROUP BY week
ORDER BY week;

-- Twitter posts per day
SELECT 
  DATE_TRUNC('day', scheduled_for) as day,
  COUNT(*) as posts
FROM content_queue
WHERE platform = 'twitter' AND status = 'pending'
GROUP BY day
ORDER BY day;
```

**Target Schedule:**
- **LinkedIn:** 3 posts per week (Mon 9am, Wed 2pm, Fri 10am)
- **Twitter:** 3 posts per day (9am, 2pm, 5pm)

**Action if needed:** Adjust scheduled_for timestamps to match target schedule

---

## Phase 5: Automation Activation 🤖

### [ ] Task 17: Activate Daily Content Queue Manager
**Status:** Pending  
**Time:** 5 minutes  
**Action:**
1. Open "Daily Content Queue Manager" workflow
2. Verify schedule triggers: 9am, 2pm, 5pm daily
3. **Click "Active" toggle** to enable workflow
4. Confirm activation

**Result:** Workflow will now run automatically 3x per day

**Important:** Make sure you've completed Task 15 (review content) first!

---

### [ ] Task 18: Monitor First Week of Automated Posts
**Status:** Pending  
**Time:** 15 minutes/day for 7 days  
**Action:**
Daily monitoring checklist:
1. Check n8n "Executions" tab for workflow runs
2. Verify posts appear on LinkedIn and Twitter
3. Check for any failed executions
4. Review any error logs

**Track:**
```sql
-- Daily posting summary
SELECT 
  DATE(posted_at) as date,
  platform,
  COUNT(*) as posts_made
FROM content_queue
WHERE status = 'posted'
  AND posted_at >= NOW() - INTERVAL '7 days'
GROUP BY date, platform
ORDER BY date DESC;
```

**Success Criteria:** 
- 21 LinkedIn posts in first week (3/day)
- 21 Twitter posts in first week (3/day)
- <5% failure rate

---

## Phase 6: Optimization & Analytics 📊

### [ ] Task 19: Track Engagement Metrics
**Status:** Pending  
**Time:** 30 minutes/week (ongoing)  
**Action:**
1. Manually collect engagement data from LinkedIn and Twitter
2. Update content_queue with metrics:

```sql
UPDATE content_queue
SET engagement_data = jsonb_build_object(
  'likes', 45,
  'comments', 12,
  'shares', 8,
  'clicks', 156,
  'impressions', 1250
)
WHERE id = 'post-uuid-here';
```

3. Track weekly:
   - Total impressions
   - Engagement rate
   - Click-through rate
   - Lead generation

**Future Enhancement:** Build API integration to auto-fetch metrics

---

### [ ] Task 20: Analyze Best-Performing Content Types
**Status:** Pending  
**Time:** 1 hour  
**Action:**
Run analytics queries:

```sql
-- Best performing content types
SELECT 
  content_type,
  platform,
  COUNT(*) as posts,
  AVG((engagement_data->>'likes')::int) as avg_likes,
  AVG((engagement_data->>'comments')::int) as avg_comments,
  AVG((engagement_data->>'clicks')::int) as avg_clicks
FROM content_queue
WHERE status = 'posted' 
  AND engagement_data IS NOT NULL
GROUP BY content_type, platform
ORDER BY avg_clicks DESC;

-- Best performing blog topics
SELECT 
  blog_post_slug,
  COUNT(*) as posts,
  AVG((engagement_data->>'clicks')::int) as avg_clicks
FROM content_queue
WHERE status = 'posted'
  AND engagement_data IS NOT NULL
GROUP BY blog_post_slug
ORDER BY avg_clicks DESC;
```

**Insights to Track:**
- Which content format performs best? (article, thread, carousel, quote card)
- Which blog topics resonate most?
- Best time of day for engagement?
- LinkedIn vs Twitter effectiveness?

---

### [ ] Task 21: Optimize Schedule and Content Mix
**Status:** Pending  
**Time:** 30 minutes  
**Action:**
Based on analytics from Task 20:

1. **Adjust posting schedule** if different times perform better
2. **Increase frequency** of high-performing content types
3. **Reduce frequency** of low-performing formats
4. **Update GPT-4 prompts** to generate more effective content
5. **Create new content types** based on what works

**Example Optimizations:**
- If carousels perform 2x better → generate more carousels
- If morning posts get 50% more engagement → shift schedule
- If certain topics drive more leads → write more on those topics

---

## Success Metrics 🎯

### Week 1 (Setup)
- ✅ n8n running
- ✅ All credentials configured
- ✅ All workflows imported and tested

### Week 2 (Content Creation)
- ✅ 120+ social posts generated
- ✅ Content reviewed and approved
- ✅ Posting schedule optimized

### Week 3 (Activation)
- ✅ Automated posting active
- ✅ 3 posts per day to LinkedIn
- ✅ 3 posts per day to Twitter

### Month 2-3 (Growth)
- 📈 500-1,000 new LinkedIn followers
- 📈 200-500 new Twitter followers
- 📈 50-100 qualified leads
- 📈 2-5 consultation bookings
- 📈 40-60% increase in blog traffic

---

## Quick Reference Links

**n8n Dashboard:** http://localhost:5678

**Documentation:**
- Setup Guide: `docs/setup/N8N_SOCIAL_AUTOMATION_SETUP.md`
- Workflow Details: `stack/n8n/README.md`
- n8n Docs: https://docs.n8n.io/

**Supabase Content Queue:** 
- Table: `content_queue`
- Function: `get_next_queued_post(platform)`

**API Documentation:**
- LinkedIn: https://docs.microsoft.com/en-us/linkedin/
- Twitter: https://developer.twitter.com/en/docs
- OpenAI: https://platform.openai.com/docs

**Credentials Needed:**
- LinkedIn Client ID & Secret
- Twitter API Keys (5 values)
- OpenAI API Key
- Supabase URL & Key

---

## Troubleshooting

### n8n won't start
```bash
# Check if Docker is running
docker ps

# Check logs
docker logs nativelegal-n8n

# Restart
docker-compose restart
```

### LinkedIn posts not working
- Verify OAuth callback URL matches exactly
- Check scopes include `w_member_social`
- Request Marketing Developer Platform access

### Twitter thread not threading
- Ensure reply-to-status-id is set correctly
- Add 2-second delay between tweets
- Check API rate limits

### OpenAI API errors
- Verify API key is correct
- Check account has credits
- Reduce token limits if hitting rate limits

### Content not posting automatically
- Verify "Daily Content Queue Manager" is ACTIVE
- Check scheduled_for times are in future
- Verify Supabase function exists

---

## Notes

**Cost Tracking:**
- OpenAI API usage: Check at https://platform.openai.com/usage
- n8n executions: View in dashboard
- Expected monthly: $30-50 (cloud) or $10-30 (self-hosted)

**Time Savings:**
- Manual content creation: 4-6 hours per blog post
- Automated with n8n: 15 minutes per blog post
- **Total time saved:** 30-45 hours per 8 blog posts

**Content Output:**
- 8 blog posts → 120+ social posts
- 3 months of scheduled content
- Consistent posting 6x per day across platforms

---

**Last Updated:** October 11, 2025
**Status:** Ready to begin implementation
**Next Action:** Task 1 - Install and start n8n

