-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Sources table for crawled content
CREATE TABLE IF NOT EXISTS sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    content_text TEXT,
    embedding VECTOR(1536), -- OpenAI embedding dimension
    trust_score FLOAT DEFAULT 0.5 CHECK (trust_score >= 0 AND trust_score <= 1),
    is_filtered BOOLEAN DEFAULT FALSE,
    access_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table for content workflow
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'outline', 'draft', 'scheduled', 'published')),
    body_mdx TEXT,
    seo_meta JSONB DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post metrics for GA4/GSC data
CREATE TABLE IF NOT EXISTS post_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr FLOAT DEFAULT 0,
    avg_position FLOAT DEFAULT 0,
    source TEXT DEFAULT 'gsc' CHECK (source IN ('gsc', 'ga4')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, date, source)
);

-- Jobs table for agent task queue
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    owner TEXT,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sources_url ON sources(url);
CREATE INDEX IF NOT EXISTS idx_sources_trust_score ON sources(trust_score);
CREATE INDEX IF NOT EXISTS idx_sources_access_date ON sources(access_date);

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);

CREATE INDEX IF NOT EXISTS idx_post_metrics_post_date ON post_metrics(post_id, date);
CREATE INDEX IF NOT EXISTS idx_post_metrics_date ON post_metrics(date);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_at ON jobs(scheduled_at);

-- RLS policies (basic setup)
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust based on your auth needs)
CREATE POLICY "Allow all for authenticated users" ON sources FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON post_metrics FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON jobs FOR ALL TO authenticated USING (true);

-- Vector similarity search function for sources
CREATE OR REPLACE FUNCTION search_sources_by_embedding(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.8,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    url TEXT,
    content_text TEXT,
    trust_score FLOAT,
    similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
    SELECT 
        s.id,
        s.url,
        s.content_text,
        s.trust_score,
        1 - (s.embedding <=> query_embedding) AS similarity
    FROM sources s
    WHERE s.embedding IS NOT NULL
        AND 1 - (s.embedding <=> query_embedding) > match_threshold
    ORDER BY s.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
