-- Seed initial trusted sources for Sprint 1
INSERT INTO sources (url, content_text, trust_score, is_filtered, access_date) VALUES 
(
  'https://www.americanbar.org/groups/law_practice/publications/techreport/',
  'ABA Legal Technology Survey Report - Annual survey covering law firm technology adoption, AI readiness, and digital transformation trends. Primary source for legal tech statistics and implementation data across US law firms.',
  1.0,
  false,
  NOW()
),
(
  'https://www.abajournal.com/web/article/artificial-intelligence-law-firms',
  'ABA Journal AI coverage - How law firms are implementing artificial intelligence tools in practice management, document review, legal research, and client services. Covers ethics, best practices, and case studies.',
  0.9,
  false, 
  NOW()
),
(
  'https://www.clio.com/blog/legal-trends-report/',
  'Clio Legal Trends Report - Annual data on law firm operations, client expectations, billing practices, and technology adoption. Comprehensive RevOps insights for legal practice management and business development.',
  0.85,
  false,
  NOW()
);
