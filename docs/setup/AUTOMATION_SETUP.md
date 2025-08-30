# 🤖 Weekly Content Automation Setup Guide

## 🎯 Overview

Your **SingleShot** content automation system is now configured to run completely hands-free! Here's what we've built:

### 🏗️ **What's Included:**

1. **🕘 Automated Weekly Triggers**
   - Primary: Every Monday at 9:00 AM UTC (Supabase Cron)
   - Backup: Every Wednesday at 9:00 AM UTC (Supabase Cron)
   - GitHub Actions backup triggers (15 minutes after Supabase)

2. **📊 Monitoring & Health Checks**
   - Daily health checks at 10:00 AM UTC
   - Automatic failure detection and alerting
   - Status dashboard and reporting

3. **🔄 Content Pipeline**
   - 1 Pillar article (~3,500 words)
   - 2 Spoke articles (~2,500 words each)
   - 12 AI-generated images (4 types × 3 articles)
   - Total: ~8,500 words + professional visuals per week
   - Complete cycle time: ~100 minutes (includes image generation)

## ✅ Setup Status: COMPLETE!

### ✅ Step 1: Supabase Credentials - CONFIGURED

Your Supabase credentials are already configured:

```bash
# Supabase Configuration ✅ ACTIVE
SUPABASE_URL=https://gmcdnokfogtryliyhcoi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ✅ CONFIGURED
```

**✅ Connected to SingleShot project:** gmcdnokfogtryliyhcoi

### ✅ Step 2: Automation Deployed - ACTIVE

All functions are deployed and active:

```bash
✅ weekly_scheduler         - ACTIVE (v2)
✅ generate_images          - ACTIVE (v2) 
✅ orchestrate_weekly_cycle - ACTIVE (v2)
✅ job_processor           - ACTIVE (v2)
✅ analytics_collector     - ACTIVE (v2)
✅ ingest_url_advanced     - ACTIVE (v2)
```

**✅ Database migrations applied**
**✅ Image generation configured**
**✅ Automation tested and working**

### Step 3: Set Up GitHub Actions (Optional Backup)

Add these secrets to your GitHub repository:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key

**How to add secrets:**
1. Go to your GitHub repo
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add both secrets

## 📅 Automation Schedule

| Trigger | Time | Purpose |
|---------|------|---------|
| 🎯 **Primary** | Monday 9:00 AM UTC | Main content generation |
| 🔄 **Backup** | Wednesday 9:00 AM UTC | Retry if Monday failed |
| 🏥 **Health Check** | Daily 10:00 AM UTC | Monitor system health |
| 🐙 **GitHub Backup** | Monday 9:15 AM UTC | External backup trigger |
| 🐙 **GitHub Backup** | Wednesday 9:15 AM UTC | External backup trigger |

## 🛠️ Management Commands

### Check Automation Status
```bash
node scripts/check-automation-status.js
```

### Manual Trigger (Emergency)
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  "YOUR_SUPABASE_URL/functions/v1/weekly_scheduler"
```

### View Cron Jobs in Database
```sql
SELECT * FROM cron.job;
```

### Check Recent Workflow Runs
```sql
SELECT * FROM workflow_runs ORDER BY triggered_at DESC LIMIT 10;
```

## 📊 Expected Weekly Output

Every week, your automation will generate:

- **📄 1 Pillar Article** (~3,500 words)
  - Deep, comprehensive content
  - High-value topic for law firms
  - SEO optimized with target keywords

- **📄 2 Spoke Articles** (~2,500 words each)
  - Supporting topics that link to pillar
  - Specific, actionable content
  - Compliance and ethics focused

- **🎨 Visual Assets** (NEW!)
  - 3 Hero images (blog headers, 16:9 format)
  - 3 Featured images (social cards, 1:1 format)
  - 3 Social images (sharing optimized, 1200x630)
  - 3 Thumbnail images (lists & grids)

- **🔗 Supporting Assets**
  - Updated sitemap.xml with image metadata
  - Updated RSS feed with visual content
  - Social media promotion ready with images
  - Analytics tracking enabled

## 🚨 Monitoring & Alerts

### Automatic Health Checks
- ✅ **Daily health monitoring** at 10 AM UTC
- 🚨 **Automatic alerts** for failed runs
- 📊 **Performance tracking** and reporting

### Alert Conditions
- No successful runs in 10+ days
- 3+ failed runs in 7 days
- Jobs stuck in "in_progress" for 4+ hours

### GitHub Issue Creation
Failed automation runs automatically create GitHub issues with:
- Detailed error information
- Manual recovery instructions
- Links to logs and debugging info

## 🔧 Troubleshooting

### Common Issues

**❌ "Missing environment variables"**
- Solution: Add SUPABASE_URL and SUPABASE_ANON_KEY to .env file

**❌ "Function not found"**
- Solution: Run `supabase functions deploy weekly_scheduler`

**❌ "Database error"**
- Solution: Run `supabase db push` to apply migrations

**❌ "Jobs stuck in pending"**
- Solution: Check job_processor function deployment

### Debug Commands

```bash
# Check function deployment status
supabase functions list

# View function logs
supabase functions logs weekly_scheduler

# Test database connection
supabase db ping

# Check cron job status
supabase sql --query "SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;"
```

## 📈 Performance Monitoring

### Key Metrics to Track
- **Content Generation Rate**: 3 articles/week
- **Word Count**: ~8,500 words/week
- **Visual Assets**: 12 images/week (4 types × 3 articles)
- **Completion Time**: <100 minutes per cycle (includes images)
- **Success Rate**: >95% automation success
- **Image Quality**: >4.0/5.0 visual quality scores
- **SEO Performance**: GSC impressions & CTR growth

### Dashboard Access
- **Supabase Dashboard**: Real-time function logs
- **GitHub Actions**: Backup trigger status
- **Analytics Dashboard**: Content performance metrics

## 🎉 You're All Set!

Your **SingleShot** content automation is now running completely hands-free! 

### What Happens Next:
1. **Monday 9 AM UTC**: First content cycle triggers automatically
2. **90 minutes later**: 3 new premium articles are published
3. **Daily 10 AM UTC**: Health check ensures everything is running smoothly
4. **Weekly**: Consistent, high-quality content builds your authority

### 🏄‍♂️ **Sit back and watch your content machine work its magic!** 

The system will:
- ✅ Generate premium legal AI content weekly
- ✅ Create professional images for every article
- ✅ Optimize for SEO and compliance
- ✅ Track performance and improve over time
- ✅ Alert you only if manual intervention is needed

**Your law firm content authority is now on autopilot! 🚀**
