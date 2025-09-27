-- AI Implementation Guides and Personalization System
-- This extends the calculator data to generate hyper-customized implementation guides

-- Implementation guide templates
CREATE TABLE IF NOT EXISTS implementation_guide_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    practice_area TEXT, -- 'family_law', 'corporate', 'litigation', 'general'
    firm_size_category TEXT, -- 'small', 'medium', 'large'
    readiness_level TEXT, -- 'beginner', 'intermediate', 'advanced'
    template_content JSONB NOT NULL, -- Structured template with variables
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated implementation guides for users
CREATE TABLE IF NOT EXISTS generated_implementation_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES calculator_users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES calculator_assessments(id) ON DELETE CASCADE,
    questionnaire_id UUID REFERENCES secondary_questionnaire(id) ON DELETE CASCADE,
    
    -- Guide metadata
    guide_title TEXT NOT NULL,
    guide_version TEXT DEFAULT '1.0',
    template_id UUID REFERENCES implementation_guide_templates(id),
    
    -- Personalization data
    personalization_data JSONB NOT NULL, -- All data used for customization
    generated_content JSONB NOT NULL, -- The actual guide content
    recommendations JSONB DEFAULT '[]', -- Specific recommendations
    timeline JSONB DEFAULT '{}', -- Implementation timeline
    budget_estimates JSONB DEFAULT '{}', -- Cost estimates
    vendor_recommendations JSONB DEFAULT '[]', -- Specific vendor suggestions
    
    -- Status and delivery
    status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'delivered', 'viewed', 'implemented')),
    delivery_method TEXT DEFAULT 'email', -- 'email', 'download', 'consultation'
    delivered_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor recommendations database
CREATE TABLE IF NOT EXISTS ai_vendor_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'practice_management', 'document_ai', 'research', 'billing'
    practice_areas TEXT[], -- Array of supported practice areas
    firm_size_suitable TEXT[], -- Array of suitable firm sizes
    pricing_tier TEXT, -- 'budget', 'mid', 'enterprise'
    features JSONB DEFAULT '{}', -- Key features and capabilities
    integration_requirements JSONB DEFAULT '{}', -- What systems it integrates with
    implementation_complexity TEXT, -- 'low', 'medium', 'high'
    roi_timeline TEXT, -- 'immediate', '3_months', '6_months', '12_months'
    customer_support_rating INTEGER CHECK (customer_support_rating >= 1 AND customer_support_rating <= 5),
    security_compliance TEXT[], -- Array of compliance standards
    is_recommended BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Implementation tracking and feedback
CREATE TABLE IF NOT EXISTS implementation_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id UUID REFERENCES generated_implementation_guides(id) ON DELETE CASCADE,
    user_id UUID REFERENCES calculator_users(id) ON DELETE CASCADE,
    
    -- Implementation progress
    current_phase TEXT, -- 'planning', 'vendor_selection', 'implementation', 'training', 'optimization'
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Feedback and results
    implementation_feedback JSONB DEFAULT '{}', -- User feedback on implementation
    challenges_encountered TEXT[], -- Array of challenges faced
    success_metrics JSONB DEFAULT '{}', -- Measured outcomes
    roi_achieved FLOAT, -- Actual ROI achieved
    timeline_variance INTEGER, -- Days ahead/behind schedule
    
    -- Follow-up data
    last_check_in TIMESTAMPTZ,
    next_check_in TIMESTAMPTZ,
    support_requests INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_implementation_guide_templates_practice_area ON implementation_guide_templates(practice_area);
CREATE INDEX IF NOT EXISTS idx_implementation_guide_templates_firm_size ON implementation_guide_templates(firm_size_category);
CREATE INDEX IF NOT EXISTS idx_implementation_guide_templates_readiness ON implementation_guide_templates(readiness_level);

CREATE INDEX IF NOT EXISTS idx_generated_guides_user_id ON generated_implementation_guides(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_guides_status ON generated_implementation_guides(status);
CREATE INDEX IF NOT EXISTS idx_generated_guides_created_at ON generated_implementation_guides(created_at);

CREATE INDEX IF NOT EXISTS idx_vendor_recommendations_category ON ai_vendor_recommendations(category);
CREATE INDEX IF NOT EXISTS idx_vendor_recommendations_practice_areas ON ai_vendor_recommendations USING GIN(practice_areas);
CREATE INDEX IF NOT EXISTS idx_vendor_recommendations_firm_size ON ai_vendor_recommendations USING GIN(firm_size_suitable);

CREATE INDEX IF NOT EXISTS idx_implementation_tracking_guide_id ON implementation_tracking(guide_id);
CREATE INDEX IF NOT EXISTS idx_implementation_tracking_user_id ON implementation_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_implementation_tracking_phase ON implementation_tracking(current_phase);

-- RLS policies
ALTER TABLE implementation_guide_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_implementation_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_vendor_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementation_tracking ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON implementation_guide_templates FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON generated_implementation_guides FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON ai_vendor_recommendations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON implementation_tracking FOR ALL TO authenticated USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_implementation_guide_templates_updated_at BEFORE UPDATE ON implementation_guide_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_implementation_guides_updated_at BEFORE UPDATE ON generated_implementation_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_vendor_recommendations_updated_at BEFORE UPDATE ON ai_vendor_recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_implementation_tracking_updated_at BEFORE UPDATE ON implementation_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
