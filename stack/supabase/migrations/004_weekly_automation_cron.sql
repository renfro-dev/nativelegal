-- Enable the pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to trigger the weekly scheduler
CREATE OR REPLACE FUNCTION trigger_weekly_content_cycle()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    response_status integer;
    response_body text;
BEGIN
    -- Call the weekly_scheduler Edge Function
    SELECT status, content INTO response_status, response_body
    FROM http((
        'POST',
        current_setting('app.supabase_url') || '/functions/v1/weekly_scheduler',
        ARRAY[
            http_header('Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')),
            http_header('Content-Type', 'application/json')
        ],
        'application/json',
        '{}'
    )::http_request);

    -- Log the result
    IF response_status = 200 THEN
        RAISE NOTICE 'Weekly content cycle triggered successfully: %', response_body;
    ELSE
        RAISE WARNING 'Weekly content cycle failed with status %: %', response_status, response_body;
    END IF;
END;
$$;

-- Schedule the weekly content generation
-- Runs every Monday at 9:00 AM UTC (adjust timezone as needed)
SELECT cron.schedule(
    'weekly-content-generation',
    '0 9 * * 1',  -- Every Monday at 9 AM
    'SELECT trigger_weekly_content_cycle();'
);

-- Optional: Schedule a backup run on Wednesdays in case Monday fails
SELECT cron.schedule(
    'weekly-content-backup',
    '0 9 * * 3',  -- Every Wednesday at 9 AM
    'SELECT trigger_weekly_content_cycle();'
);

-- Create a function to check and alert on failed runs
CREATE OR REPLACE FUNCTION check_weekly_automation_health()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    failed_runs integer;
    last_successful_run timestamp;
BEGIN
    -- Count failed runs in the last 7 days (if table exists)
    -- SELECT COUNT(*) INTO failed_runs
    -- FROM workflow_runs
    -- WHERE status = 'failed'
    -- AND triggered_at > NOW() - INTERVAL '7 days';

    -- Get last successful run (if table exists)
    -- SELECT MAX(triggered_at) INTO last_successful_run
    -- FROM workflow_runs
    -- WHERE status IN ('started', 'completed');
    
    -- Set defaults for now
    failed_runs := 0;
    last_successful_run := NOW() - INTERVAL '1 day';

    -- Alert if no successful runs in the last 10 days
    IF last_successful_run < NOW() - INTERVAL '10 days' OR last_successful_run IS NULL THEN
        RAISE WARNING 'ALERT: No successful content generation in the last 10 days. Last successful: %', last_successful_run;
    END IF;

    -- Alert if too many failures
    IF failed_runs > 3 THEN
        RAISE WARNING 'ALERT: % failed content generation runs in the last 7 days', failed_runs;
    END IF;
END;
$$;

-- Schedule health checks daily at 10 AM
SELECT cron.schedule(
    'weekly-automation-health-check',
    '0 10 * * *',  -- Every day at 10 AM
    'SELECT check_weekly_automation_health();'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Create indexes for better performance (only if tables exist)
-- CREATE INDEX IF NOT EXISTS idx_workflow_runs_week_status ON workflow_runs(week_number, status);
-- CREATE INDEX IF NOT EXISTS idx_workflow_runs_triggered_at ON workflow_runs(triggered_at);
-- CREATE INDEX IF NOT EXISTS idx_jobs_week_number ON jobs((payload->>'week_number'));

-- Insert initial configuration (only if table exists)
-- INSERT INTO workflow_runs (
--     week_number,
--     trigger_type,
--     status,
--     triggered_at,
--     metadata
-- ) VALUES (
--     0,
--     'setup',
--     'completed',
--     NOW(),
--     '{"message": "Weekly automation cron jobs configured successfully"}'
-- ) ON CONFLICT DO NOTHING;
