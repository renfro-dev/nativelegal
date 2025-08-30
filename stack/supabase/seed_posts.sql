-- Insert weekly content plan posts with idea status
INSERT INTO posts (slug, title, status, seo_meta) VALUES 
(
  'ai-readiness-assessment-law-firms-2025',
  'The Complete Guide to AI Readiness Assessment for US Law Firms',
  'idea',
  '{
    "intent": "informational",
    "serpType": "featured_snippet_opportunity", 
    "competitors": ["clio.com/blog/ai-for-lawyers", "americanbar.org/groups/law_practice/publications/techreport", "lawgeex.com/blog"],
    "targetKeywords": ["AI readiness assessment law firms", "law firm AI implementation", "legal technology readiness", "AI audit law practice"],
    "metaTitle": "AI Readiness Assessment for Law Firms: Complete 2025 Guide",
    "metaDescription": "Comprehensive guide to assessing AI readiness in law firms. Includes frameworks, checklists, and implementation strategies for nationwide legal practices.",
    "focusKeyword": "AI readiness assessment law firms",
    "schemaType": "HowTo",
    "category": "ai_readiness",
    "contentType": "pillar",
    "estimatedWordCount": 3500,
    "priority": "high"
  }'
),
(
  'ai-ethics-compliance-law-firms-state-requirements', 
  'AI Ethics and Compliance Requirements for Law Firms: State-by-State Analysis',
  'idea',
  '{
    "intent": "informational/commercial",
    "serpType": "long_form_article",
    "competitors": ["americanbar.org", "state bar associations"],
    "targetKeywords": ["AI ethics law firms", "legal AI compliance requirements", "attorney AI ethics rules", "state bar AI guidelines"],
    "metaTitle": "AI Ethics & Compliance for Law Firms: State Requirements 2025", 
    "metaDescription": "Navigate AI ethics and compliance requirements across all 50 states. Essential guide for attorneys implementing AI tools in legal practice.",
    "focusKeyword": "AI ethics law firms",
    "schemaType": "Article",
    "category": "attorney_workflows_ai",
    "contentType": "spoke",
    "estimatedWordCount": 2000,
    "priority": "medium"
  }'
),
(
  'revops-metrics-ai-roi-legal-practice-management',
  'RevOps Metrics That Matter: Measuring AI ROI in Legal Practice Management', 
  'idea',
  '{
    "intent": "commercial/transactional",
    "serpType": "how_to_guide",
    "competitors": ["clio.com/blog", "legal operations blogs"],
    "targetKeywords": ["law firm RevOps metrics", "legal practice management KPIs", "AI ROI law firms", "legal operations analytics"],
    "metaTitle": "RevOps Metrics for Legal: Measuring AI ROI in Law Firms",
    "metaDescription": "Essential RevOps metrics and KPIs for measuring AI return on investment in legal practice management. Data-driven insights for law firm operations.",
    "focusKeyword": "law firm RevOps metrics",
    "schemaType": "Article", 
    "category": "revops_legal",
    "contentType": "spoke",
    "estimatedWordCount": 1800,
    "priority": "medium"
  }'
);
