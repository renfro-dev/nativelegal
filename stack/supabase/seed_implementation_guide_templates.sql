-- Seed data for implementation guide templates
-- These templates will be used to generate personalized AI implementation guides

INSERT INTO implementation_guide_templates (name, description, practice_area, firm_size_category, readiness_level, template_content) VALUES
(
  'Family Law AI Implementation - Small Firm - Beginner',
  'Comprehensive AI implementation guide for small family law firms with limited AI experience',
  'family_law',
  'small',
  'beginner',
  '{
    "sections": [
      {
        "id": "executive_summary",
        "title": "Executive Summary",
        "template": "Based on your {{readiness_score}}/5.0 AI readiness score, {{firm_name}} is positioned to begin a strategic AI implementation journey. This guide provides a step-by-step roadmap tailored specifically for your family law practice."
      },
      {
        "id": "current_state",
        "title": "Current State Analysis",
        "template": "Your assessment reveals {{strengths_count}} key strengths and {{weaknesses_count}} areas for improvement. The most significant opportunity lies in {{primary_opportunity}}."
      },
      {
        "id": "implementation_phases",
        "title": "Implementation Phases",
        "template": "We recommend a {{total_phases}}-phase approach over {{timeline}} months, starting with foundation building and progressing to advanced AI applications."
      },
      {
        "id": "vendor_recommendations",
        "title": "Recommended AI Tools",
        "template": "Based on your current {{practice_management}} system and {{firm_size}} size, we recommend starting with {{primary_vendor}} for {{primary_use_case}}."
      },
      {
        "id": "budget_guidance",
        "title": "Budget and ROI",
        "template": "Total implementation cost: ${{total_cost}}. Expected ROI: {{roi_percentage}}% within {{roi_timeline}} months through {{primary_benefit}}."
      }
    ],
    "variables": {
      "readiness_score": "assessment.overall_score",
      "firm_name": "user.company",
      "strengths_count": "calculated.strengths.length",
      "weaknesses_count": "calculated.weaknesses.length",
      "primary_opportunity": "calculated.primary_opportunity",
      "total_phases": "calculated.phases.length",
      "timeline": "calculated.total_months",
      "practice_management": "questionnaire.current_practice_management",
      "firm_size": "user.firm_size",
      "primary_vendor": "calculated.top_vendor.name",
      "primary_use_case": "calculated.top_vendor.use_case",
      "total_cost": "calculated.total_cost",
      "roi_percentage": "calculated.expected_roi",
      "roi_timeline": "questionnaire.roi_expectations",
      "primary_benefit": "calculated.primary_benefit"
    }
  }
),
(
  'Family Law AI Implementation - Medium Firm - Intermediate',
  'Advanced AI implementation guide for medium-sized family law firms with some AI experience',
  'family_law',
  'medium',
  'intermediate',
  '{
    "sections": [
      {
        "id": "executive_summary",
        "title": "Executive Summary",
        "template": "With your {{readiness_score}}/5.0 AI readiness score, {{firm_name}} is well-positioned for accelerated AI adoption. This guide focuses on scaling existing capabilities and implementing advanced AI applications."
      },
      {
        "id": "current_state",
        "title": "Current State Analysis",
        "template": "Your {{practice_management}} and {{document_management}} systems provide a solid foundation. The key opportunity is {{primary_opportunity}} to achieve {{success_metric}}."
      },
      {
        "id": "implementation_phases",
        "title": "Implementation Phases",
        "template": "A {{total_phases}}-phase implementation over {{timeline}} months, leveraging your existing {{cloud_adoption}} infrastructure."
      },
      {
        "id": "vendor_recommendations",
        "title": "Recommended AI Tools",
        "template": "Building on your {{current_ai_experience}} experience, we recommend {{primary_vendor}} for {{primary_use_case}} and {{secondary_vendor}} for {{secondary_use_case}}."
      },
      {
        "id": "budget_guidance",
        "title": "Budget and ROI",
        "template": "Total implementation cost: ${{total_cost}}. Expected ROI: {{roi_percentage}}% within {{roi_timeline}} months through {{primary_benefit}} and {{secondary_benefit}}."
      }
    ],
    "variables": {
      "readiness_score": "assessment.overall_score",
      "firm_name": "user.company",
      "practice_management": "questionnaire.current_practice_management",
      "document_management": "questionnaire.current_document_management",
      "primary_opportunity": "calculated.primary_opportunity",
      "success_metric": "questionnaire.success_metrics",
      "total_phases": "calculated.phases.length",
      "timeline": "calculated.total_months",
      "cloud_adoption": "questionnaire.cloud_adoption_level",
      "current_ai_experience": "questionnaire.previous_ai_experience",
      "primary_vendor": "calculated.top_vendor.name",
      "primary_use_case": "calculated.top_vendor.use_case",
      "secondary_vendor": "calculated.second_vendor.name",
      "secondary_use_case": "calculated.second_vendor.use_case",
      "total_cost": "calculated.total_cost",
      "roi_percentage": "calculated.expected_roi",
      "roi_timeline": "questionnaire.roi_expectations",
      "primary_benefit": "calculated.primary_benefit",
      "secondary_benefit": "calculated.secondary_benefit"
    }
  }
),
(
  'General Practice AI Implementation - Large Firm - Advanced',
  'Comprehensive AI implementation guide for large law firms with advanced AI readiness',
  'general',
  'large',
  'advanced',
  '{
    "sections": [
      {
        "id": "executive_summary",
        "title": "Executive Summary",
        "template": "With your {{readiness_score}}/5.0 AI readiness score, {{firm_name}} is ready for enterprise-scale AI implementation. This guide focuses on advanced AI applications and firm-wide transformation."
      },
      {
        "id": "current_state",
        "title": "Current State Analysis",
        "template": "Your {{practice_management}}, {{document_management}}, and {{billing_system}} systems provide an excellent foundation. The focus should be on {{primary_opportunity}} and {{secondary_opportunity}}."
      },
      {
        "id": "implementation_phases",
        "title": "Implementation Phases",
        "template": "A {{total_phases}}-phase enterprise implementation over {{timeline}} months, leveraging your {{cloud_adoption}} infrastructure and {{change_management}} capabilities."
      },
      {
        "id": "vendor_recommendations",
        "title": "Recommended AI Tools",
        "template": "Building on your {{current_ai_experience}} experience, we recommend a comprehensive AI stack: {{primary_vendor}} for {{primary_use_case}}, {{secondary_vendor}} for {{secondary_use_case}}, and {{tertiary_vendor}} for {{tertiary_use_case}}."
      },
      {
        "id": "budget_guidance",
        "title": "Budget and ROI",
        "template": "Total implementation cost: ${{total_cost}}. Expected ROI: {{roi_percentage}}% within {{roi_timeline}} months through {{primary_benefit}}, {{secondary_benefit}}, and {{tertiary_benefit}}."
      }
    ],
    "variables": {
      "readiness_score": "assessment.overall_score",
      "firm_name": "user.company",
      "practice_management": "questionnaire.current_practice_management",
      "document_management": "questionnaire.current_document_management",
      "billing_system": "questionnaire.current_billing_system",
      "primary_opportunity": "calculated.primary_opportunity",
      "secondary_opportunity": "calculated.secondary_opportunity",
      "total_phases": "calculated.phases.length",
      "timeline": "calculated.total_months",
      "cloud_adoption": "questionnaire.cloud_adoption_level",
      "change_management": "questionnaire.change_management_experience",
      "current_ai_experience": "questionnaire.previous_ai_experience",
      "primary_vendor": "calculated.top_vendor.name",
      "primary_use_case": "calculated.top_vendor.use_case",
      "secondary_vendor": "calculated.second_vendor.name",
      "secondary_use_case": "calculated.second_vendor.use_case",
      "tertiary_vendor": "calculated.third_vendor.name",
      "tertiary_use_case": "calculated.third_vendor.use_case",
      "total_cost": "calculated.total_cost",
      "roi_percentage": "calculated.expected_roi",
      "roi_timeline": "questionnaire.roi_expectations",
      "primary_benefit": "calculated.primary_benefit",
      "secondary_benefit": "calculated.secondary_benefit",
      "tertiary_benefit": "calculated.tertiary_benefit"
    }
  }
);

-- Seed vendor recommendations
INSERT INTO ai_vendor_recommendations (vendor_name, category, practice_areas, firm_size_suitable, pricing_tier, features, integration_requirements, implementation_complexity, roi_timeline, customer_support_rating, security_compliance) VALUES
(
  'Clio',
  'practice_management',
  ARRAY['family_law', 'general'],
  ARRAY['small', 'medium'],
  'mid',
  '{"ai_features": ["document automation", "client intake", "billing optimization"], "key_benefits": ["streamlined workflows", "client portal", "mobile access"]}',
  '{"practice_management": ["clio", "mycase", "practicepanther"], "document_management": ["netdocuments", "imanage"], "billing": ["quickbooks", "xero"]}',
  'low',
  '3_months',
  4,
  ARRAY['SOC 2', 'HIPAA']
),
(
  'MyCase',
  'practice_management',
  ARRAY['family_law', 'general'],
  ARRAY['small', 'medium'],
  'budget',
  '{"ai_features": ["document automation", "client communication", "case management"], "key_benefits": ["affordable pricing", "easy setup", "client portal"]}',
  '{"practice_management": ["mycase", "clio"], "document_management": ["google drive", "dropbox"], "billing": ["quickbooks"]}',
  'low',
  'immediate',
  4,
  ARRAY['SOC 2']
),
(
  'NetDocuments',
  'document_management',
  ARRAY['family_law', 'general', 'corporate'],
  ARRAY['small', 'medium', 'large'],
  'mid',
  '{"ai_features": ["document search", "version control", "collaboration"], "key_benefits": ["cloud-based", "secure", "scalable"]}',
  '{"practice_management": ["clio", "mycase", "imanage"], "document_management": ["netdocuments", "imanage"], "billing": ["quickbooks", "xero"]}',
  'medium',
  '6_months',
  5,
  ARRAY['SOC 2', 'ISO 27001', 'HIPAA']
),
(
  'iManage',
  'document_management',
  ARRAY['general', 'corporate', 'litigation'],
  ARRAY['medium', 'large'],
  'enterprise',
  '{"ai_features": ["advanced search", "workflow automation", "compliance"], "key_benefits": ["enterprise-grade", "advanced security", "integration"]}',
  '{"practice_management": ["imanage", "clio"], "document_management": ["imanage", "netdocuments"], "billing": ["quickbooks", "xero"]}',
  'high',
  '12_months',
  5,
  ARRAY['SOC 2', 'ISO 27001', 'HIPAA', 'GDPR']
),
(
  'LexisNexis',
  'research',
  ARRAY['family_law', 'general', 'corporate', 'litigation'],
  ARRAY['small', 'medium', 'large'],
  'mid',
  '{"ai_features": ["legal research", "case law analysis", "citation checking"], "key_benefits": ["comprehensive database", "AI-powered search", "citation analysis"]}',
  '{"practice_management": ["clio", "mycase", "imanage"], "document_management": ["netdocuments", "imanage"], "billing": ["quickbooks", "xero"]}',
  'medium',
  'immediate',
  4,
  ARRAY['SOC 2']
),
(
  'Westlaw',
  'research',
  ARRAY['family_law', 'general', 'corporate', 'litigation'],
  ARRAY['small', 'medium', 'large'],
  'mid',
  '{"ai_features": ["legal research", "case law analysis", "statute tracking"], "key_benefits": ["comprehensive database", "AI-powered search", "real-time updates"]}',
  '{"practice_management": ["clio", "mycase", "imanage"], "document_management": ["netdocuments", "imanage"], "billing": ["quickbooks", "xero"]}',
  'medium',
  'immediate',
  4,
  ARRAY['SOC 2']
),
(
  'DocuSign',
  'document_automation',
  ARRAY['family_law', 'general', 'corporate'],
  ARRAY['small', 'medium', 'large'],
  'budget',
  '{"ai_features": ["electronic signatures", "document workflow", "compliance tracking"], "key_benefits": ["faster execution", "reduced paper", "audit trail"]}',
  '{"practice_management": ["clio", "mycase", "imanage"], "document_management": ["netdocuments", "imanage"], "billing": ["quickbooks", "xero"]}',
  'low',
  'immediate',
  5,
  ARRAY['SOC 2', 'HIPAA']
),
(
  'LawGeex',
  'contract_analysis',
  ARRAY['corporate', 'general'],
  ARRAY['medium', 'large'],
  'mid',
  '{"ai_features": ["contract review", "risk analysis", "compliance checking"], "key_benefits": ["faster review", "risk identification", "consistency"]}',
  '{"practice_management": ["clio", "mycase", "imanage"], "document_management": ["netdocuments", "imanage"], "billing": ["quickbooks", "xero"]}',
  'medium',
  '6_months',
  4,
  ARRAY['SOC 2', 'ISO 27001']
),
(
  'Kira Systems',
  'contract_analysis',
  ARRAY['corporate', 'general'],
  ARRAY['large'],
  'enterprise',
  '{"ai_features": ["contract analysis", "due diligence", "risk assessment"], "key_benefits": ["advanced AI", "enterprise integration", "custom training"]}',
  '{"practice_management": ["imanage"], "document_management": ["imanage", "netdocuments"], "billing": ["quickbooks", "xero"]}',
  'high',
  '12_months',
  5,
  ARRAY['SOC 2', 'ISO 27001', 'GDPR']
),
(
  'Casetext',
  'research',
  ARRAY['family_law', 'general', 'corporate', 'litigation'],
  ARRAY['small', 'medium'],
  'budget',
  '{"ai_features": ["legal research", "case law analysis", "citation checking"], "key_benefits": ["affordable", "AI-powered", "user-friendly"]}',
  '{"practice_management": ["clio", "mycase"], "document_management": ["netdocuments", "google drive"], "billing": ["quickbooks"]}',
  'low',
  'immediate',
  4,
  ARRAY['SOC 2']
);
