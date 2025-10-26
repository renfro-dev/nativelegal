-- Legal Tech Intelligence Database Schema
-- Purpose: Store insights from Reddit, blogs, reviews, and other sources

-- Main intelligence table
CREATE TABLE IF NOT EXISTS legal_tech_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Source metadata
  source_type VARCHAR(50) NOT NULL, -- 'reddit', 'blog', 'review', 'job', 'twitter'
  source_url TEXT NOT NULL,
  source_name VARCHAR(255), -- e.g., 'r/LawFirm', 'G2 Reviews', 'Legaltech News'
  
  -- Content
  title TEXT,
  content_text TEXT,
  author VARCHAR(255),
  published_at TIMESTAMP,
  
  -- Vendor/product intelligence
  vendor_name VARCHAR(255), -- Harvey AI, Spellbook, LegalSifter, etc.
  product_name VARCHAR(255),
  mentioned_tools TEXT[], -- Array of tool mentions
  
  -- Sentiment analysis
  sentiment_score DECIMAL(3,2), -- -1.0 to 1.0 (negative to positive)
  sentiment_label VARCHAR(20), -- 'positive', 'negative', 'neutral'
  extracted_themes TEXT[], -- Array of key themes
  
  -- Engagement metrics
  engagement_score INTEGER, -- Likes, upvotes, retweets, etc.
  view_count INTEGER,
  
  -- Extracted metadata
  extracted_metadata JSONB, -- Flexible field for source-specific data
  
  -- Processing metadata
  processed_at TIMESTAMP DEFAULT NOW(),
  processing_method VARCHAR(50), -- 'reddit_api', 'puppeteer', etc.
  raw_data JSONB, -- Store original data for debugging
  
  -- Indexing
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_intelligence_source_type ON legal_tech_intelligence(source_type);
CREATE INDEX idx_intelligence_vendor ON legal_tech_intelligence(vendor_name);
CREATE INDEX idx_intelligence_sentiment ON legal_tech_intelligence(sentiment_score);
CREATE INDEX idx_intelligence_published ON legal_tech_intelligence(published_at);
CREATE INDEX idx_intelligence_created ON legal_tech_intelligence(created_at);

-- Full-text search index
CREATE INDEX idx_intelligence_search ON legal_tech_intelligence 
  USING gin(to_tsvector('english', title || ' ' || content_text));

-- Intelligence summary table (aggregated insights)
CREATE TABLE IF NOT EXISTS intelligence_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Aggregation metadata
  vendor_name VARCHAR(255) NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  summary_period VARCHAR(20), -- 'daily', 'weekly', 'monthly'
  summary_date DATE NOT NULL,
  
  -- Aggregated metrics
  mention_count INTEGER DEFAULT 0,
  positive_count INTEGER DEFAULT 0,
  negative_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  avg_sentiment DECIMAL(3,2),
  
  -- Top themes and complaints
  top_themes JSONB, -- Array of {theme: string, count: integer}
  common_complaints TEXT[],
  common_praises TEXT[],
  
  -- Engagement metrics
  total_engagement INTEGER DEFAULT 0,
  avg_engagement DECIMAL(10,2),
  
  -- Computed at
  computed_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(vendor_name, source_type, summary_period, summary_date)
);

-- Indexes for summary
CREATE INDEX idx_summary_vendor ON intelligence_summary(vendor_name);
CREATE INDEX idx_summary_date ON intelligence_summary(summary_date);
CREATE INDEX idx_summary_type ON intelligence_summary(source_type);

-- Vendor tracking table
CREATE TABLE IF NOT EXISTS tracked_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  vendor_name VARCHAR(255) UNIQUE NOT NULL,
  product_name VARCHAR(255),
  category VARCHAR(100), -- 'contract_ai', 'legal_research', etc.
  
  -- Tracking configuration
  reddit_keywords TEXT[],
  twitter_handles TEXT[],
  blog_sources TEXT[],
  
  -- Last updated
  last_intelligence_update TIMESTAMP,
  intelligence_count INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert tracked vendors
INSERT INTO tracked_vendors (vendor_name, product_name, category, reddit_keywords, twitter_handles)
VALUES
  ('Harvey AI', 'Harvey AI Platform', 'general_purpose_ai', ARRAY['harvey ai', 'harvey', 'harveyai'], ARRAY['HarveyAIHQ']),
  ('Spellbook', 'Spellbook Contract AI', 'contract_ai', ARRAY['spellbook', 'spellbook ai', 'spellbook contract'], ARRAY['SpellbookAI']),
  ('LegalSifter', 'LegalSifter AI', 'contract_review', ARRAY['legalsifter', 'legal sifter', 'legalsifter ai'], ARRAY['LegalSifter']),
  ('Thomson Reuters', 'HighQ Contract Analysis', 'contract_analysis', ARRAY['thomson reuters', 'highq', 'westlaw edge'], ARRAY['thomsonreuters']),
  ('Lexion', 'Lexion CLM', 'contract_lifecycle', ARRAY['lexion', 'lexion ai', 'lexion clm'], ARRAY['LexionAI']),
  ('Latch', 'Latch AI', 'contract_negotiation', ARRAY['latch ai', 'latch', 'latchai'], ARRAY['LatchAI']),
  ('vLex', 'Vincent AI', 'legal_research', ARRAY['vlex', 'vincent ai', 'vlex vincent'], ARRAY['vLex']),
  ('Casetext', 'CoCounsel AI', 'legal_research', ARRAY['casetext', 'cocounsel', 'casetext ai'], ARRAY['Casetext']),
  ('Legal Robot', 'Legal Robot AI', 'contract_analysis', ARRAY['legal robot', 'legalrobot'], ARRAY['legal_robot']),
  ('LawGeex', 'LawGeex', 'contract_review', ARRAY['lawgeex', 'law geex'], ARRAY['LawGeex'])
ON CONFLICT (vendor_name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to legal_tech_intelligence
CREATE TRIGGER update_legal_tech_intelligence_updated_at 
  BEFORE UPDATE ON legal_tech_intelligence
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to tracked_vendors
CREATE TRIGGER update_tracked_vendors_updated_at 
  BEFORE UPDATE ON tracked_vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (if needed)
ALTER TABLE legal_tech_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_vendors ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to intelligence data
CREATE POLICY "Public read access" ON legal_tech_intelligence
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON intelligence_summary
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON tracked_vendors
  FOR SELECT USING (true);

-- Policy: Allow authenticated users to insert/update (for Edge Functions)
CREATE POLICY "Authenticated insert" ON legal_tech_intelligence
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update" ON legal_tech_intelligence
  FOR UPDATE USING (auth.role() = 'authenticated');

COMMENT ON TABLE legal_tech_intelligence IS 'Main table for storing intelligence from various sources (Reddit, blogs, reviews, etc.)';
COMMENT ON TABLE intelligence_summary IS 'Aggregated intelligence summaries by vendor and time period';
COMMENT ON TABLE tracked_vendors IS 'Configuration for which vendors to track and their associated keywords';
