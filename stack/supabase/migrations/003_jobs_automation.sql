-- Migration 003: Enhanced automation and scheduling capabilities
-- Adds automated job processing, performance tracking, and scheduling features

-- Add scheduling and automation columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 1;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS max_retries INTEGER DEFAULT 3;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS processing_time_ms INTEGER;

-- Create indexes for job processing performance
CREATE INDEX IF NOT EXISTS idx_jobs_processing ON jobs (status, scheduled_at, priority);
CREATE INDEX IF NOT EXISTS idx_jobs_retry ON jobs (status, retry_count, max_retries);

-- Add automation metadata to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS automation_metadata JSONB;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_score REAL DEFAULT 0.0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_score REAL DEFAULT 0.0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS readability_score REAL DEFAULT 0.0;

-- Create performance tracking tables
CREATE TABLE IF NOT EXISTS content_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    
    -- Traffic metrics
    organic_traffic INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    bounce_rate REAL DEFAULT 0.0,
    avg_session_duration REAL DEFAULT 0.0,
    pages_per_session REAL DEFAULT 1.0,
    
    -- Search performance
    avg_position REAL DEFAULT 0.0,
    total_impressions INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    ctr REAL DEFAULT 0.0,
    
    -- Engagement metrics
    time_on_page REAL DEFAULT 0.0,
    scroll_depth REAL DEFAULT 0.0,
    social_shares INTEGER DEFAULT 0,
    backlinks_acquired INTEGER DEFAULT 0,
    
    -- Conversion metrics
    lead_conversions INTEGER DEFAULT 0,
    email_signups INTEGER DEFAULT 0,
    consultation_requests INTEGER DEFAULT 0,
    
    -- Data collection date
    metric_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE (post_id, metric_date)
);

-- Create automation workflow tracking
CREATE TABLE IF NOT EXISTS workflow_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_number INTEGER NOT NULL,
    workflow_type TEXT NOT NULL, -- 'weekly_cycle', 'emergency_update', 'optimization'
    status TEXT DEFAULT 'running', -- running, completed, failed, cancelled
    
    -- Job tracking
    total_jobs INTEGER DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    failed_jobs INTEGER DEFAULT 0,
    
    -- Performance metrics
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    total_duration_ms INTEGER,
    
    -- Output tracking
    content_generated INTEGER DEFAULT 0,
    sources_processed INTEGER DEFAULT 0,
    quality_score REAL DEFAULT 0.0,
    
    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content quality scoring table
CREATE TABLE IF NOT EXISTS content_quality_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    
    -- Quality metrics
    content_depth_score REAL DEFAULT 0.0,
    seo_optimization_score REAL DEFAULT 0.0,
    readability_score REAL DEFAULT 0.0,
    legal_compliance_score REAL DEFAULT 0.0,
    authority_score REAL DEFAULT 0.0,
    
    -- Content analysis
    word_count INTEGER DEFAULT 0,
    heading_structure_score REAL DEFAULT 0.0,
    internal_links_count INTEGER DEFAULT 0,
    external_links_count INTEGER DEFAULT 0,
    image_optimization_score REAL DEFAULT 0.0,
    
    -- SEO metrics
    title_optimization_score REAL DEFAULT 0.0,
    meta_description_score REAL DEFAULT 0.0,
    keyword_density_score REAL DEFAULT 0.0,
    schema_markup_score REAL DEFAULT 0.0,
    
    -- Overall composite score
    composite_score REAL DEFAULT 0.0,
    
    scored_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create automated scheduling functions
CREATE OR REPLACE FUNCTION schedule_weekly_cycle(week_num INTEGER)
RETURNS JSON AS $$
DECLARE
    workflow_id UUID;
    job_ids JSON;
BEGIN
    -- Create workflow run record
    INSERT INTO workflow_runs (week_number, workflow_type, total_jobs)
    VALUES (week_num, 'weekly_cycle', 6)
    RETURNING id INTO workflow_id;
    
    -- Schedule the jobs (handled by the orchestrate_weekly_cycle function)
    -- This is a placeholder for integration with the Edge Function
    
    RETURN json_build_object(
        'workflow_id', workflow_id,
        'week_number', week_num,
        'status', 'scheduled',
        'message', 'Weekly cycle scheduled successfully'
    );
END;
$$ LANGUAGE plpgsql;

-- Create performance monitoring functions
CREATE OR REPLACE FUNCTION update_content_performance(
    p_post_id UUID,
    p_metric_date DATE,
    p_metrics JSONB
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO content_performance (
        post_id, 
        metric_date,
        organic_traffic,
        total_sessions,
        bounce_rate,
        avg_session_duration,
        pages_per_session,
        avg_position,
        total_impressions,
        total_clicks,
        ctr,
        time_on_page,
        scroll_depth,
        social_shares,
        backlinks_acquired,
        lead_conversions,
        email_signups,
        consultation_requests
    )
    VALUES (
        p_post_id,
        p_metric_date,
        COALESCE((p_metrics->>'organic_traffic')::INTEGER, 0),
        COALESCE((p_metrics->>'total_sessions')::INTEGER, 0),
        COALESCE((p_metrics->>'bounce_rate')::REAL, 0.0),
        COALESCE((p_metrics->>'avg_session_duration')::REAL, 0.0),
        COALESCE((p_metrics->>'pages_per_session')::REAL, 1.0),
        COALESCE((p_metrics->>'avg_position')::REAL, 0.0),
        COALESCE((p_metrics->>'total_impressions')::INTEGER, 0),
        COALESCE((p_metrics->>'total_clicks')::INTEGER, 0),
        COALESCE((p_metrics->>'ctr')::REAL, 0.0),
        COALESCE((p_metrics->>'time_on_page')::REAL, 0.0),
        COALESCE((p_metrics->>'scroll_depth')::REAL, 0.0),
        COALESCE((p_metrics->>'social_shares')::INTEGER, 0),
        COALESCE((p_metrics->>'backlinks_acquired')::INTEGER, 0),
        COALESCE((p_metrics->>'lead_conversions')::INTEGER, 0),
        COALESCE((p_metrics->>'email_signups')::INTEGER, 0),
        COALESCE((p_metrics->>'consultation_requests')::INTEGER, 0)
    )
    ON CONFLICT (post_id, metric_date)
    DO UPDATE SET
        organic_traffic = EXCLUDED.organic_traffic,
        total_sessions = EXCLUDED.total_sessions,
        bounce_rate = EXCLUDED.bounce_rate,
        avg_session_duration = EXCLUDED.avg_session_duration,
        pages_per_session = EXCLUDED.pages_per_session,
        avg_position = EXCLUDED.avg_position,
        total_impressions = EXCLUDED.total_impressions,
        total_clicks = EXCLUDED.total_clicks,
        ctr = EXCLUDED.ctr,
        time_on_page = EXCLUDED.time_on_page,
        scroll_depth = EXCLUDED.scroll_depth,
        social_shares = EXCLUDED.social_shares,
        backlinks_acquired = EXCLUDED.backlinks_acquired,
        lead_conversions = EXCLUDED.lead_conversions,
        email_signups = EXCLUDED.email_signups,
        consultation_requests = EXCLUDED.consultation_requests,
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create content scoring function
CREATE OR REPLACE FUNCTION calculate_content_score(p_post_id UUID)
RETURNS REAL AS $$
DECLARE
    post_data RECORD;
    score REAL := 0.0;
    word_count INTEGER;
    seo_meta JSONB;
BEGIN
    -- Get post data
    SELECT body_mdx, seo_meta INTO post_data
    FROM posts WHERE id = p_post_id;
    
    IF post_data IS NULL THEN
        RETURN 0.0;
    END IF;
    
    -- Calculate word count (approximate)
    word_count := array_length(string_to_array(post_data.body_mdx, ' '), 1);
    
    -- Scoring algorithm
    -- Word count score (max 25 points)
    IF word_count >= 3000 THEN
        score := score + 25;
    ELSIF word_count >= 2000 THEN
        score := score + 20;
    ELSIF word_count >= 1000 THEN
        score := score + 15;
    ELSE
        score := score + 10;
    END IF;
    
    -- SEO metadata score (max 25 points)
    IF post_data.seo_meta ? 'target_keywords' THEN score := score + 10; END IF;
    IF post_data.seo_meta ? 'meta_description' THEN score := score + 5; END IF;
    IF post_data.seo_meta ? 'focus_keyword' THEN score := score + 10; END IF;
    
    -- Content structure score (max 25 points)
    IF post_data.body_mdx LIKE '%## %' THEN score := score + 10; END IF; -- Has H2 headings
    IF post_data.body_mdx LIKE '%### %' THEN score := score + 5; END IF; -- Has H3 headings
    IF post_data.body_mdx LIKE '%**%' THEN score := score + 5; END IF; -- Has bold text
    IF post_data.body_mdx LIKE '%- %' THEN score := score + 5; END IF; -- Has lists
    
    -- Legal compliance score (max 25 points)
    IF post_data.body_mdx ILIKE '%disclaimer%' THEN score := score + 15; END IF;
    IF post_data.body_mdx ILIKE '%professional responsibility%' THEN score := score + 5; END IF;
    IF post_data.body_mdx ILIKE '%compliance%' THEN score := score + 5; END IF;
    
    -- Cap at 100
    score := LEAST(score, 100.0);
    
    -- Store the score
    INSERT INTO content_quality_scores (
        post_id, word_count, composite_score
    ) VALUES (
        p_post_id, word_count, score
    ) ON CONFLICT (post_id) DO UPDATE SET
        word_count = EXCLUDED.word_count,
        composite_score = EXCLUDED.composite_score,
        scored_at = NOW(),
        updated_at = NOW();
    
    -- Update post table
    UPDATE posts SET content_score = score WHERE id = p_post_id;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_performance_date ON content_performance (metric_date);
CREATE INDEX IF NOT EXISTS idx_content_performance_post ON content_performance (post_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_week ON workflow_runs (week_number);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs (status);
CREATE INDEX IF NOT EXISTS idx_quality_scores_post ON content_quality_scores (post_id);

-- Enable RLS on new tables
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_quality_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Allow read access for all users" ON content_performance FOR SELECT USING (TRUE);
CREATE POLICY "Allow authenticated inserts" ON content_performance FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for all users" ON workflow_runs FOR SELECT USING (TRUE);
CREATE POLICY "Allow authenticated inserts" ON workflow_runs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for all users" ON content_quality_scores FOR SELECT USING (TRUE);
CREATE POLICY "Allow authenticated inserts" ON content_quality_scores FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Calculate scores for existing posts
DO $$
DECLARE
    post_record RECORD;
BEGIN
    FOR post_record IN SELECT id FROM posts WHERE status = 'published' LOOP
        PERFORM calculate_content_score(post_record.id);
    END LOOP;
END $$;
