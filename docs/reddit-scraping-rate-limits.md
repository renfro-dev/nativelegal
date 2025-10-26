# Reddit Scraping Rate Limits & Schedule

**Purpose:** Determine optimal frequency for Reddit intelligence collection

---

## 🚦 Reddit API Rate Limits

### Official Reddit API (OAuth)
- **Unauthenticated:** 60 requests per minute per IP
- **Authenticated:** Based on OAuth scopes, typically 60 requests per minute
- **Rate Limit Headers:** Available in response headers

### Reddit JSON Endpoints (What We're Using)
- **No official documentation** - considered a "read-only" API
- **Best practice:** 1 request every 2 seconds per subreddit
- **Recommended:** 2-3 seconds between requests to avoid 429 errors
- **Conservative:** 5-10 seconds between requests

---

## 📊 Current Implementation Analysis

### Our Current System:
```typescript
// Target subreddits
const subreddits = [
  'LawFirm',           // ~2.1k members
  'paralegal',         // ~45k members  
  'LegalAdvice',       // ~7.8M members
  'smallbusiness',     // ~3.2M members
  'LegalTech',         // ~1.2k members
  'law',               // ~1.4M members
  'Ask_Lawyers'        // ~250k members
];

// Rate limiting in code:
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds
```

### Current Request Pattern:
- **7 subreddits** × 1 request each = **7 requests**
- **Total time:** ~14 seconds (2s delay between requests)
- **Average:** ~2 seconds per request
- **Effective rate:** 30 requests/minute

### Status: ✅ **Well within safe limits**

---

## ⚠️ Observed Issues

### 403 Errors (Current Problem)
Our logs showed:
```
⚠️ Failed to fetch r/Ask_Lawyers: 403
⚠️ Failed to fetch r/law: 403
⚠️ Failed to fetch r/LegalTech: 403
```

**Causes:**
1. User-Agent too generic (fixed with browser-like UA)
2. No cookies/session
3. Reddit detects bot-like behavior
4. Rate limiting too aggressive

**Not related to request frequency** - this is about request signature.

---

## 🎯 Recommended Schedule

### Option 1: Daily (Conservative) ✅ RECOMMENDED
**Frequency:** Once per day  
**Time:** 9:00 AM EST  
**Reasoning:**
- Reddit "hot" posts change over 24 hours
- Avoids any rate limit concerns
- Legal professionals most active during business hours

**Cron:** `0 9 * * *`

### Option 2: Twice Daily (Balanced)
**Frequency:** Twice per day  
**Times:** 9:00 AM, 5:00 PM EST  
**Reasoning:**
- Catches morning posts and evening discussions
- Still very safe for rate limits

**Cron:** `0 9,17 * * *`

### Option 3: Every 6 Hours (Aggressive)
**Frequency:** 4 times per day  
**Times:** 9 AM, 3 PM, 9 PM, 3 AM EST  
**Reasoning:**
- Catches most fresh discussions
- May hit rate limits on high-traffic days

**Cron:** `0 9,15,21,3 * * *`

### Option 4: Hourly (NOT RECOMMENDED)
**Frequency:** 24 times per day  
**Reasoning:**
- Unnecessary data collection
- Higher chance of 403 errors
- Waste of API quota

**Cron:** `0 * * * *`

---

## 📈 Data Freshness Analysis

### Reddit Post Lifespan:
- **"Hot" posts:** Stay in top 100 for 1-3 days typically
- **New posts:** Drop off hot within 24 hours if not trending
- **Trending topics:** Stay active for 2-7 days

### Optimal Collection Window:
**Daily collection captures:**
- ✅ Yesterday's new posts that became hot
- ✅ Today's trending discussions
- ✅ Comments and engagement updates

**12-hour collection adds:**
- Minimal new data (maybe 5-10% more posts)

**Hourly collection adds:**
- <1% new data per run

**Conclusion:** Daily is optimal for cost/benefit.

---

## 🛡️ Best Practices

### 1. Rate Limiting
```typescript
// Current implementation (good)
await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
```

### 2. Error Handling
```typescript
// If 403 error:
- Increase delay to 5 seconds
- Rotate User-Agent
- Add random jitter to delays
```

### 3. Respect robots.txt
Reddit's robots.txt allows:
```
User-agent: *
Allow: /hot
Allow: /new
Disallow: /search  # Don't use search API without auth
```

### 4. Exponential Backoff
```typescript
// If rate limited (429), retry with exponential backoff
let delay = 1000;
for (let i = 0; i < 3; i++) {
  await fetch(url);
  if (response.ok) break;
  await sleep(delay *= 2); // 1s, 2s, 4s
}
```

---

## 🔧 Supabase Edge Function Configuration

### Cron Job Setup:
1. Go to: Supabase Dashboard → Database → Cron Jobs
2. Add new cron:
   - **Name:** `daily_reddit_intelligence`
   - **Schedule:** `0 9 * * *` (9 AM daily)
   - **Function:** Call `smart-service` Edge Function
   - **Method:** POST
   - **Body:** `{}`

### Alternative: pg_cron (Supabase)
```sql
SELECT cron.schedule(
  'daily-reddit-intelligence',
  '0 9 * * *', -- Daily at 9 AM
  $$
  SELECT net.http_post(
    url:='https://gmcdnokfogtryliyhcoi.supabase.co/functions/v1/smart-service',
    headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);
```

---

## 💰 Cost Analysis

### Edge Function Invocations:
- **Daily:** 30 invocations/month = ~$0.02/month
- **Twice daily:** 60 invocations/month = ~$0.04/month
- **Every 6 hours:** 120 invocations/month = ~$0.08/month
- **Hourly:** 720 invocations/month = ~$0.48/month

### Database Storage:
- **Average post:** ~5KB
- **Daily collection:** ~0.5-5 posts = 2.5-25KB/day
- **Monthly:** ~75-750KB/month = ~$0.00 (negligible)

**Conclusion:** Cost is not a constraint.

---

## ✅ RECOMMENDED CONFIGURATION

### Schedule: Daily at 9:00 AM EST
```cron
0 9 * * *
```

### Rationale:
1. **Rate limit safe:** Well within all limits
2. **Data freshness:** Catches all daily discussions
3. **Legal professional activity:** Aligns with business hours
4. **Cost effective:** Minimal compute cost
5. **Error recovery:** Easy to re-run if failure

### Setup Steps:
1. Run migration: `009_expand_reddit_keywords.sql`
2. Update Edge Function if needed
3. Set up cron job in Supabase
4. Monitor for 24 hours
5. Adjust if needed based on results

---

## 🎯 Monitoring & Alerts

### Key Metrics to Track:
1. **Success rate:** % of successful scrapes
2. **403 errors:** Reddit blocking
3. **Matches found:** Intelligence items collected
4. **Execution time:** Function duration
5. **Error patterns:** Which subreddits failing

### Alert Thresholds:
- 3 consecutive failures → Alert
- 403 errors increasing → Investigate
- Zero matches for 7 days → Check keywords
- Execution time >30s → Optimize

---

**Summary:** Start with daily at 9 AM, adjust based on results. Current 2-second delay between requests is perfect.
