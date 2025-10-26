# Legal Tech Intelligence - Quick Start Guide 🚀

**Created:** January 28, 2025  
**Status:** Phase 1 Implementation Ready

---

## 🎯 Overview

Automated intelligence gathering system to track legal tech industry insights from:
- ✅ Reddit (user sentiment)
- ✅ Legal Tech Blogs (trending topics)
- ✅ Review Sites (G2, Capterra)

---

## 📋 Prerequisites

- ✅ Supabase project set up
- ✅ Puppeteer MCP running
- ✅ Database schema migrated (see `stack/supabase/migrations/008_create_legal_tech_intelligence.sql`)

---

## 🚀 Implementation Steps

### Step 1: Deploy Database Schema

```bash
# Deploy the migration
cd stack/supabase
supabase db push
```

This creates:
- `legal_tech_intelligence` - Main intelligence table
- `intelligence_summary` - Aggregated insights
- `tracked_vendors` - Vendor configuration (pre-populated with 10 vendors)

---

### Step 2: Start with Reddit Sentiment Analysis

**File to Create:** `stack/supabase/functions/reddit_intelligence/index.ts`

**Target Subreddits:**
- r/LawFirm (2.1k members)
- r/paralegal (45k members)
- r/LegalAdvice (7.8M members)
- r/smallbusiness (legal discussions)

**Implementation Plan:**
```typescript
// 1. Scrape Reddit posts mentioning legal AI tools
// 2. Extract: title, content, upvotes, date
// 3. Detect vendor mentions (Harvey AI, Spellbook, etc.)
// 4. Run sentiment analysis
// 5. Store in legal_tech_intelligence table
```

**Schedule:** Daily cron job

---

### Step 3: Legal Tech Blog Aggregator

**File to Create:** `stack/supabase/functions/blog_aggregator/index.ts`

**Target Blogs:**
- Legaltech News (law.com)
- ABA Tech Report
- Clio Blog
- Legaltech Hub
- ILTA Blog
- Bloomberg Law AI News

**Implementation Plan:**
```typescript
// 1. Use Puppeteer MCP to scrape blog posts
// 2. Extract: title, author, date, excerpt, full content
// 3. Detect legal AI tool mentions
// 4. Extract key quotes
// 5. Store in legal_tech_intelligence table
```

**Schedule:** Daily cron job

---

### Step 4: Review Site Aggregator

**File to Create:** `stack/supabase/functions/review_aggregator/index.ts`

**Target Sites:**
- G2.com (Legal AI category)
- Capterra.com (Legal Software)
- TrustRadius.com

**Implementation Plan:**
```typescript
// 1. Scrape recent reviews for tracked vendors
// 2. Extract: rating, review text, pros/cons, author
// 3. Sentiment analysis on review text
// 4. Extract themes and pain points
// 5. Store in legal_tech_intelligence table
```

**Schedule:** Weekly cron job

---

## 📊 Next: Create Edge Functions

I'll create the three Edge Functions next. Here's the priority:

1. **Reddit Intelligence** (highest value, user sentiment)
2. **Blog Aggregator** (trend detection, content gaps)
3. **Review Aggregator** (aggregated user experience)

Would you like me to:
1. ✅ Start building the Reddit intelligence function?
2. ✅ Create all three at once?
3. ✅ Build a test script to verify the database setup first?

---

## 🎯 Expected Output

Once running, you'll have:

### Daily Insights Dashboard:
- **Reddit**: "3 new posts mentioning Harvey AI, 2 positive, 1 neutral sentiment"
- **Blogs**: "Legaltech News published article on contract AI trends"
- **Reviews**: "G2 reviews show 4.2/5 avg for Spellbook, up from 4.0"

### Content Strategy Insights:
- "Users complaining about [X tool] pricing - opportunity for comparison article"
- "Spike in negative sentiment for [Y vendor] on Reddit - content gap"
- "Job postings showing demand for Harvey AI expertise - emerging trend"

---

Ready to build! Which option do you prefer? (1, 2, or 3)
