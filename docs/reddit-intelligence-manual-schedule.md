# Reddit Intelligence - Manual Scheduling Options

**Since pg_cron requires admin access, here are alternative approaches:**

---

## ✅ Option 1: Use "Invoke Function" Daily (Manual)

**Steps:**
1. Bookmark: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/functions/smart-service
2. Click "Invoke Function" daily at 9 AM EST
3. Click "Invoke" (body stays empty `{}`)
4. Done!

**Pros:** Simple, works immediately  
**Cons:** Requires manual trigger each day

---

## ✅ Option 2: GitHub Actions (Free & Automated)

Create `.github/workflows/reddit-intelligence.yml`:

```yaml
name: Daily Reddit Intelligence

on:
  schedule:
    - cron: '0 14 * * *'  # 9 AM EST / 2 PM UTC daily
  workflow_dispatch:  # Allow manual trigger

jobs:
  collect-intelligence:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Reddit Intelligence
        run: |
          curl -X POST \
            'https://gmcdnokfogtryliyhcoi.supabase.co/functions/v1/smart-service' \
            -H 'Content-Type: application/json' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}' \
            -d '{}'
```

**Setup:**
1. Add to your GitHub repo
2. Add `SUPABASE_SERVICE_ROLE_KEY` to Secrets
3. Commits run daily

---

## ✅ Option 3: Replit Cron Job (If Using Replit)

Create `replit.nix` or use Replit's cron feature:

```javascript
// If Replit supports cron
cron.schedule('0 14 * * *', async () => {
  await fetch('https://gmcdnokfogtryliyhcoi.supabase.co/functions/v1/smart-service', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
});
```

---

## ✅ Option 4: External Cron Service (Free)

Use a free service like:
- **cron-job.org** (free tier: 1 job)
- **EasyCron** (free tier available)
- **Healthchecks.io** (monitoring + scheduling)

**Setup example (cron-job.org):**
1. Sign up at cron-job.org
2. Create new cron job:
   - **URL:** `https://gmcdnokfogtryliyhcoi.supabase.co/functions/v1/smart-service`
   - **Method:** POST
   - **Headers:** `Authorization: Bearer YOUR_SERVICE_ROLE_KEY`
   - **Body:** `{}`
   - **Schedule:** Daily at 14:00 UTC (9 AM EST)
3. Save

---

## ✅ Option 5: Local Mac Crontab (If Mac Always On)

Add to your Mac's crontab:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 9 AM EST)
0 14 * * * curl -X POST 'https://gmcdnokfogtryliyhcoi.supabase.co/functions/v1/smart-service' -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' -d '{}'

# Save and exit
```

**Note:** This only works if your Mac is always on

---

## 🎯 Recommended: GitHub Actions

**Why:**
- ✅ Free
- ✅ Reliable (runs in the cloud)
- ✅ Easy to set up
- ✅ Can trigger manually if needed

---

## 📊 Verify It's Working

After setting up any option:
1. Wait for scheduled run time
2. Check Supabase dashboard → Edge Functions → smart-service → Logs
3. Look for new intelligence in `legal_tech_intelligence` table

---

**Which option do you prefer?** I recommend GitHub Actions for automation.
