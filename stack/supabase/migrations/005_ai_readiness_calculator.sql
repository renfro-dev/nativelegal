-- AI Readiness Calculator tables
-- Users table for calculator participants
CREATE TABLE IF NOT EXISTS calculator_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    phone TEXT,
    firm_size TEXT,
    practice_areas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculator assessments table
CREATE TABLE IF NOT EXISTS calculator_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES calculator_users(id) ON DELETE CASCADE,
    infrastructure_score FLOAT NOT NULL,
    data_score FLOAT NOT NULL,
    organizational_score FLOAT NOT NULL,
    financial_score FLOAT NOT NULL,
    overall_score FLOAT NOT NULL,
    readiness_level TEXT NOT NULL,
    recommendations JSONB DEFAULT '[]',
    answers JSONB DEFAULT '{}', -- Store all question answers
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secondary questionnaire responses
CREATE TABLE IF NOT EXISTS secondary_questionnaire (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES calculator_users(id) ON DELETE CASCADE,
    
    -- Infrastructure details
    current_practice_management TEXT,
    current_document_management TEXT,
    current_billing_system TEXT,
    cloud_adoption_level TEXT,
    security_certifications TEXT,
    integration_challenges TEXT,
    
    -- Organizational structure
    decision_makers JSONB DEFAULT '[]', -- Array of decision maker info
    change_management_experience TEXT,
    training_budget_annual TEXT,
    staff_technology_comfort TEXT,
    previous_ai_experience TEXT,
    
    -- Financial details
    annual_revenue_range TEXT,
    technology_budget_annual TEXT,
    ai_investment_budget TEXT,
    roi_expectations TEXT,
    implementation_timeline TEXT,
    
    -- Additional context
    primary_pain_points TEXT,
    success_metrics TEXT,
    concerns_about_ai TEXT,
    preferred_communication TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultation bookings
CREATE TABLE IF NOT EXISTS consultation_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES calculator_users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES calculator_assessments(id) ON DELETE CASCADE,
    questionnaire_id UUID REFERENCES secondary_questionnaire(id) ON DELETE CASCADE,
    
    preferred_date DATE,
    preferred_time TEXT,
    timezone TEXT,
    meeting_type TEXT DEFAULT 'video' CHECK (meeting_type IN ('video', 'phone', 'in-person')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_calculator_users_email ON calculator_users(email);
CREATE INDEX IF NOT EXISTS idx_calculator_users_company ON calculator_users(company);
CREATE INDEX IF NOT EXISTS idx_calculator_users_created_at ON calculator_users(created_at);

CREATE INDEX IF NOT EXISTS idx_calculator_assessments_user_id ON calculator_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_calculator_assessments_overall_score ON calculator_assessments(overall_score);
CREATE INDEX IF NOT EXISTS idx_calculator_assessments_created_at ON calculator_assessments(created_at);

CREATE INDEX IF NOT EXISTS idx_secondary_questionnaire_user_id ON secondary_questionnaire(user_id);
CREATE INDEX IF NOT EXISTS idx_secondary_questionnaire_created_at ON secondary_questionnaire(created_at);

CREATE INDEX IF NOT EXISTS idx_consultation_bookings_user_id ON consultation_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_status ON consultation_bookings(status);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_preferred_date ON consultation_bookings(preferred_date);

-- RLS policies
ALTER TABLE calculator_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE secondary_questionnaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON calculator_users FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON calculator_assessments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON secondary_questionnaire FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON consultation_bookings FOR ALL TO authenticated USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_calculator_users_updated_at BEFORE UPDATE ON calculator_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculator_assessments_updated_at BEFORE UPDATE ON calculator_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secondary_questionnaire_updated_at BEFORE UPDATE ON secondary_questionnaire
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_bookings_updated_at BEFORE UPDATE ON consultation_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
