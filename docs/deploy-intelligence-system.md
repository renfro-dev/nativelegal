# Deploy Legal Tech Intelligence System

**Target Project:** SingleShot (gmcdnokfogtryliyhcoi)  
**Region:** East US (North Virginia)  
**Created:** January 28, 2025

---

## 📍 Project Information

- **Project Name:** SingleShot
- **Reference ID:** gmcdnokfogtryliyhcoi
- **Organization ID:** fsvrhxtlmlmcovmpqnsp
- **Region:** East US (North Virginia)
- **Project URL:** https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi

---

## 🚀 Deployment Options

### Option 1: Via Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run Migration:**
   - Copy contents of: `stack/supabase/migrations/008_create_legal_tech_intelligence.sql`
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Wait for "Success" message

4. **Verify Tables Created:**
   - Go to "Table Editor" in left sidebar
   - You should see:
     - `legal_tech_intelligence` ✅
     - `intelligence_summary` ✅
     - `tracked_vendors` ✅ (with 10 pre-populated vendors)

---

### Option 2: Via Supabase CLI (Alternative)

```bash
cd /Users/JoshR/Desktop/SEO\ Machine/stack/supabase

# Link to project (if not already linked)
supabase link --project-ref gmcdnokfogtryliyhcoi

# Enter database password when prompted
# (Get from: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/settings/database)

# Push migration
supabase db push
```

---

## 📊 After Database Migration

### Verify Tables:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%intelligence%';

-- Check vendors are inserted
SELECT COUNT(*) FROM tracked_vendors;
-- Should return: 10

-- List vendors
SELECT vendor_name, category FROM tracked_vendors;
```

### Expected Result:

```
vendor_name          | category
---------------------|------------------
Harvey AI            | general_purpose_ai
Spellbook            | contract_ai
LegalSifter          | contract_review
Thomson Reuters      | contract_analysis
Lexion               | contract_lifecycle
Latch                | contract_negotiation
vLex                 | legal_research
Casetext             | legal_research
Legal Robot          | contract_analysis
LawGeex              | contract_review
```

---

## 🔧 Deploy Edge Function

### Via Supabase Dashboard:

1. **Go to Edge Functions:**
   - Click "Edge Functions" in left sidebar
   - Click "Create a new function"

2. **Create Function:**
   - Name: `reddit_intelligence`
   - Copy contents from: `stack/supabase/functions/reddit_intelligence/index.ts`
   - Paste into editor
   - Click "Deploy"

### Via CLI:

```bash
cd /Users/JoshR/Desktop/SEO\ Machine

# Deploy function
supabase functions deploy reddit_intelligence --project-ref gmcdnokfogtryliyhcoi
```

---

## 🧪 Test the System

### 1. Get Project Credentials:

From: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/settings/api

- **Project URL:** `https://gmcdnokfogtryliyhcoi.supabase.co`
- **Anon Key:** (from Settings → API)

### 2. Update .env File:

```bash
cd /Users/JoshR/Desktop/SEO\ Machine

# Create/update .env file
cat > .env << 'EOF'
SUPABASE_URL=https://gmcdnokfogtryliyhcoi.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Get from: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/settings/api
EOF
```

### 3. Run Test Script:

```bash
node scripts/test-reddit-intelligence.js
```

---

## 📊 Expected Results

### First Run:
- Scrapes 7 subreddits (LawFirm, paralegal, LegalAdvice, etc.)
- Checks 100 hot posts per subreddit (~700 posts total)
- Matches against 10 vendor keywords
- Extracts sentiment and themes
- Stores results in database

### Output Example:
```
📊 REDDIT INTELLIGENCE RESULTS
======================================================================

✅ Success: Collected 23 intelligence items from 7 subreddits
⏱️  Duration: 45000ms (45.0s)

📈 Summary Statistics:
   Total Collected: 23

🏢 Mentions by Vendor:
   Harvey AI: 8
   Spellbook: 5
   LegalSifter: 4
   Lexion: 3
   Latch: 2
   Legal Robot: 1

😊 Sentiment Breakdown:
   positive: 12
   neutral: 7
   negative: 4
```

---

## 🎯 Next Steps

1. **Set Up Cron Job** (Daily at 9 AM):
   - Go to: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi
   - Settings → Database → Cron Jobs
   - Add: `0 9 * * *` → Call reddit_intelligence Edge Function

2. **Build Analytics Dashboard:**
   - Query `legal_tech_intelligence` table
   - Create visualizations for sentiment trends
   - Track vendor mentions over time

3. **Build Remaining Functions:**
   - Blog aggregator (using Puppeteer MCP)
   - Review scraper (G2/Capterra)

---

## 🐛 Troubleshooting

### Issue: "Cannot find tracked_vendors table"
**Solution:** Migration didn't run. Re-run via SQL Editor.

### Issue: "Function not found"
**Solution:** Redeploy Edge Function via Dashboard or CLI.

### Issue: "Rate limit exceeded"
**Solution:** Add delays between subreddit requests in function code.

---

## ✅ Verification Checklist

- [ ] Database migration runs without errors
- [ ] 3 tables created (legal_tech_intelligence, intelligence_summary, tracked_vendors)
- [ ] 10 vendors inserted into tracked_vendors
- [ ] Edge Function deployed successfully
- [ ] Test script runs and collects data
- [ ] Data appears in Supabase Table Editor

---

**Ready to deploy!** Start with Option 1 (Dashboard) for easiest experience.
