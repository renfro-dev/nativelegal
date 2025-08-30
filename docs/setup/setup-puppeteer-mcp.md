# 🏄‍♂️ Puppeteer MCP Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Puppeteer MCP Service
```bash
npm start
```
The service will run on `http://localhost:3001`

### 3. Test the Service
```bash
npm test
```

### 4. Use Advanced Ingestion
The `ingest_url_advanced` Edge Function will automatically:
- Try simple HTTP first for fast sites
- Fall back to Puppeteer MCP for complex sites
- Handle JavaScript-heavy legal sites like ABA

## Environment Variables

For production deployment, set:
```
PUPPETEER_MCP_ENDPOINT=http://your-mcp-service:3001/scrape
```

## Sites That Benefit from Puppeteer

### High-Priority Legal Sources:
- ✅ **americanbar.org** - ABA tech reports, journal articles
- ✅ **uscourts.gov** - Federal court documents and news
- ✅ **supremecourt.gov** - Supreme Court opinions and updates
- ✅ **law.com** - Legal industry news and analysis
- ✅ **legaltech.org** - Legal technology insights
- ✅ **westlaw.com** - Public legal research content

### Expected Results:
- **Before Puppeteer**: ~3 successful ingestions from 15+ sources
- **After Puppeteer**: ~12+ successful ingestions from same sources
- **Content Quality**: Full text extraction vs. filtered/empty content

## Testing Individual URLs

```javascript
// Test a specific URL
const response = await fetch('https://gmcdnokfogtryliyhcoi.supabase.co/functions/v1/ingest_url_advanced', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://www.americanbar.org/groups/law_practice/publications/techreport/',
    force_puppeteer: true, // Force Puppeteer for testing
    trust_score: 1.0,
    category: 'ai_readiness'
  })
})
```

## Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   Supabase Edge     │    │   Puppeteer MCP      │    │   Legal Websites    │
│   Function          │────│   Service            │────│   (ABA, Courts,     │
│   ingest_url_advanced│    │   localhost:3001     │    │    Legal Tech)      │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Supabase DB       │
│   sources table     │
│   (with full content)│
└─────────────────────┘
```

## Next Steps

1. **Test the ABA sources** that were previously filtered
2. **Expand trusted sources list** to include more complex sites
3. **Add embeddings** to the crawled content for semantic search
4. **Create content workflow** from sources → posts → published content

🚀 **Ready to unlock the full legal content universe!**
