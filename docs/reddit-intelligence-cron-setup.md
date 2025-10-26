# Reddit Intelligence - Cron Job Setup

**Schedule:** Daily at 9:00 AM EST  
**Function:** smart-service Edge Function

---

## 🎯 Option 1: Supabase Dashboard (Easiest)

### Step 1: Go to Edge Functions
1. Navigate to: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/functions
2. Click on `smart-service` function

### Step 2: Add Cron Schedule
1. Scroll down to "Functions Triggers" section
2. Click "Add Trigger"
3. Configure:
   - **Name:** `daily-reddit-intelligence`
   - **Schedule:** `0 9 * * *` (Daily at 9 AM EST)
   - **Method:** POST
   - **Body:** Leave empty `{}`
   - **Headers:** (Optional) Add `Content-Type: application/json`

### Step 3: Save
4. Click "Create Trigger"
5. Done! ✅

---

## 🎯 Option 2: SQL pg_cron (Advanced)

Run this SQL in the SQL Editor:

```sql
-- Enable pg_cron extension (one-time setup)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily Reddit intelligence collection
SELECT cron.schedule(
  'daily-reddit-intelligence',
  '0 9 * * *', -- Daily at 9:00 AM UTC (adjust timezone as needed)
  $$
  SELECT net.http_post(
    url:='https://gmcdnokfogtryliyhcoi.supabase.co/functions/v1/smart-service',
    headers:=jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body:='{}'::jsonb
  ) AS request_id;
  $$
);

-- Verify cron job is scheduled
SELECT * FROM cron.job WHERE jobname = 'daily-reddit-intelligence';
```

**Note:** For SQL approach, you may need to enable the `http` extension:
```sql
CREATE EXTENSION IF NOT EXISTS http;
```

---

## 🕐 Timezone Considerations

### Default: UTC
- Cron: `0 9 * * *` = 9:00 AM UTC
- **EST:** 4:00 AM EST (early morning)
- **PST:** 1:00 AM PST (very early)

### Adjust for Your Timezone:

**EST (9 AM):** `0 14 * * *` (14:00 UTC = 9 AM EST)  
**PST (9 AM):** `0 17 * * *` (17:00 UTC = 9 AM PST)  
**CST (9 AM):** `0 15 * * *` (15:00 UTC = 9 AM CST)

Cron format: `minute hour day month weekday`
- Example: `0 14 * * *` = 14:00 (2 PM) UTC daily

---

## 📊 Verify It's Working

### Check Cron Jobs:
1. Go to: Supabase Dashboard → Database → Cron Jobs
2. Look for `daily-reddit-intelligence`
3. Should show next run time

### Check Logs:
1. Go to: Supabase Dashboard → Edge Functions → smart-service
2. Click "Logs" tab
3. Look for daily invocations at your scheduled time

### Test Manually:
Run the test script to verify function works:
```bash
node scripts/test-reddit-intelligence.js
```

---

## 🎯 Recommended Configuration

**Schedule:** `0 14 * * *` (9:00 AM EST / 2:00 PM UTC)  
**Reasoning:**
- Legal professionals active
- Avoids overnight hours
- Easy to monitor during business day

---

## 🔧 Modify or Disable

### Disable Cron Job:
```sql
SELECT cron.unschedule('daily-reddit-intelligence');
```

### Change Schedule:
```sql
-- Remove old schedule
SELECT cron.unschedule('daily-reddit-intelligence');

-- Add new schedule (e.g., twice daily)
SELECT cron.schedule(
  'daily-reddit-intelligence',
  '0 9,17 * * *', -- 9 AM and 5 PM
  $$...$$ -- same function call
);
```

---

## 📈 Expected Daily Results

Once running:
- **Collection time:** 10-20 seconds per run
- **Matches found:** 5-50+ intelligence items daily
- **Storage:** ~5-50KB per day
- **Cost:** ~$0.001 per day

---

**Ready to schedule?** Use Option 1 (Dashboard) for easiest setup!
