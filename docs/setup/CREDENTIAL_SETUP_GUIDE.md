# 🔑 SEO Machine Credential Setup Guide

## 🎯 Overview
To unlock full automation capabilities, we need to connect external APIs for real-time performance tracking, content optimization, and competitive intelligence.

## 📊 Google Analytics 4 (GA4) Setup

### Step 1: Google Cloud Project Setup
1. **Go to Google Cloud Console** → https://console.cloud.google.com/
2. **Create New Project** (or use existing)
   - Project Name: "SEO Machine Analytics"
   - Enable billing (required for API access)

### Step 2: Enable APIs
Enable these APIs in your Google Cloud project:
```
✅ Google Analytics Reporting API v4
✅ Google Analytics Data API v1 (GA4)
✅ Google Search Console API
✅ YouTube Analytics API (if doing video content)
```

### Step 3: Create Service Account
1. **IAM & Admin** → **Service Accounts** → **Create Service Account**
2. **Service Account Details:**
   - Name: `seo-machine-analytics`
   - Description: `SEO Machine automated analytics access`
3. **Grant Roles:**
   - `Viewer` (basic access)
   - `Analytics Viewer` (GA4 access)
4. **Create Key:**
   - Key type: JSON
   - Download and save as `google-service-account.json`

### Step 4: GA4 Property Setup
1. **Add Service Account to GA4:**
   - Go to GA4 → Admin → Property → Property Access Management
   - Add User: `seo-machine-analytics@your-project.iam.gserviceaccount.com`
   - Role: `Viewer`

### Step 5: Get Property IDs
```bash
# GA4 Property ID (format: 123456789)
# Find in: GA4 → Admin → Property → Property Details

# Example for our setup:
GA4_PROPERTY_ID=your-ga4-property-id
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔍 Google Search Console Setup

### Step 1: Verify Domain
1. **Add Property** in Google Search Console
2. **Domain Verification** (recommended for full site coverage)
   - Add DNS TXT record to your domain
   - Or use HTML file verification

### Step 2: Add Service Account
1. **Settings** → **Users and permissions**
2. **Add User**: `seo-machine-analytics@your-project.iam.gserviceaccount.com`
3. **Permission**: `Full`

### Step 3: Site URL
```bash
# Your verified site URL
GSC_SITE_URL=https://seomachine.legal/
# Or domain property format
GSC_SITE_URL=sc-domain:seomachine.legal
```

## 🤖 Additional Power-Up APIs

### OpenAI API (Content Generation)
```bash
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-... (optional)
```

### Anthropic Claude API (Alternative AI)
```bash
# Get from: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-...
```

### Ahrefs API (Competitive Intelligence)
```bash
# Get from: https://ahrefs.com/api
AHREFS_API_TOKEN=your-token
```

### SEMrush API (Keyword Research)
```bash
# Get from: https://www.semrush.com/api-documentation/
SEMRUSH_API_KEY=your-key
```

### Screaming Frog API (Technical SEO)
```bash
# Get from: https://www.screamingfrog.co.uk/seo-spider/
SCREAMINGFROG_API_KEY=your-key
```

## 🎛️ Environment Variables Setup

### Option 1: Supabase Secrets (Recommended)
```bash
# Set in Supabase Dashboard → Project Settings → API → Project Configuration

supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON="$(cat google-service-account.json)"
supabase secrets set GA4_PROPERTY_ID="123456789"
supabase secrets set GSC_SITE_URL="https://seomachine.legal/"
supabase secrets set OPENAI_API_KEY="sk-..."
supabase secrets set ANTHROPIC_API_KEY="sk-ant-..."
supabase secrets set AHREFS_API_TOKEN="your-token"
supabase secrets set SEMRUSH_API_KEY="your-key"
```

### Option 2: Local .env File (Development)
```bash
# Create .env file (never commit to git)
echo "GOOGLE_SERVICE_ACCOUNT_JSON='$(cat google-service-account.json)'" > .env
echo "GA4_PROPERTY_ID=123456789" >> .env
echo "GSC_SITE_URL=https://seomachine.legal/" >> .env
echo "OPENAI_API_KEY=sk-..." >> .env
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env
echo "AHREFS_API_TOKEN=your-token" >> .env
echo "SEMRUSH_API_KEY=your-key" >> .env
```

## 🔐 Security Best Practices

### Service Account Permissions
```
✅ Principle of Least Privilege
✅ Rotate keys every 90 days
✅ Monitor API usage and quotas
✅ Use different accounts for dev/prod
```

### API Key Management
```
✅ Never commit keys to git
✅ Use environment variables
✅ Monitor for leaked keys
✅ Set up usage alerts
```

## 🚀 Next-Level Integrations

### Social Media APIs
```bash
# LinkedIn API (B2B legal audience)
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-secret

# Twitter API (real-time engagement)
TWITTER_API_KEY=your-key
TWITTER_API_SECRET=your-secret
TWITTER_BEARER_TOKEN=your-token
```

### Email Marketing
```bash
# Mailchimp (newsletter automation)
MAILCHIMP_API_KEY=your-key
MAILCHIMP_LIST_ID=your-list-id

# SendGrid (transactional emails)
SENDGRID_API_KEY=SG.xxx
```

### CRM Integration
```bash
# HubSpot (lead tracking)
HUBSPOT_API_KEY=your-key

# Salesforce (enterprise clients)
SALESFORCE_CLIENT_ID=your-id
SALESFORCE_CLIENT_SECRET=your-secret
```

## ⚡ Automation Capabilities Unlocked

### Real-Time Analytics
- **GA4 Traffic Monitoring:** Hourly visitor tracking
- **GSC Keyword Performance:** Daily ranking updates
- **Conversion Tracking:** Lead generation metrics
- **ROI Calculation:** Revenue attribution analysis

### Competitive Intelligence
- **Ahrefs Backlink Monitoring:** Track competitor link building
- **SEMrush Keyword Gaps:** Find untapped opportunities
- **Content Gap Analysis:** Identify trending topics
- **SERP Feature Tracking:** Monitor featured snippets

### Content Optimization
- **AI Content Generation:** Multiple AI provider fallbacks
- **Technical SEO Audits:** Automated site health checks
- **Social Media Automation:** Cross-platform content distribution
- **Email Marketing:** Automated lead nurturing sequences

## 🎯 Implementation Priority

### Phase 1: Core Analytics (Week 1)
```
1. Google Analytics 4 → Real-time traffic tracking
2. Google Search Console → Keyword performance monitoring
3. OpenAI API → Enhanced content generation
```

### Phase 2: Competitive Intelligence (Week 2)
```
1. Ahrefs API → Backlink and competitor analysis
2. SEMrush API → Keyword research and gap analysis
3. Social Media APIs → Automated content distribution
```

### Phase 3: Advanced Automation (Week 3+)
```
1. CRM Integration → Lead tracking and nurturing
2. Email Marketing → Automated campaign sequences
3. Technical SEO → Automated site optimization
```

## 🛠️ Quick Setup Commands

### Google Analytics Setup Script
```bash
# Run this after getting credentials
node scripts/setup-ga4-connection.js
```

### Test All Connections
```bash
# Verify all API connections
node scripts/test-api-connections.js
```

### Deploy Analytics Functions
```bash
# Deploy enhanced analytics Edge Functions
supabase functions deploy analytics_collector
supabase functions deploy performance_tracker
supabase functions deploy competitor_monitor
```

## 🎊 What This Unlocks

### Immediate Benefits
- **Real-time performance tracking** across all content
- **Automated keyword monitoring** for 100+ target terms
- **Competitive intelligence** on legal AI market leaders
- **ROI calculation** with actual revenue attribution

### Long-term Advantages
- **Predictive content strategy** based on performance data
- **Automated A/B testing** for title and meta optimization
- **Dynamic keyword targeting** based on search trends
- **Intelligent content distribution** across optimal channels

---

## 🏄‍♂️ Ready to Level Up?

Once you get these credentials setup, we can:

1. **Deploy Real-Time Analytics** → Track every visitor and conversion
2. **Automate Competitive Research** → Stay ahead of legal AI trends  
3. **Optimize Content Performance** → AI-powered continuous improvement
4. **Scale Revenue Attribution** → Prove ROI with real data

**Which credentials do you want to tackle first? GA4 is probably the biggest impact for immediate insights!**
