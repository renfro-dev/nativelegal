-- Expand Reddit Keywords for Better Intelligence Collection
-- Purpose: Add missing keywords and improve matching accuracy

-- Update Thomson Reuters (add westlaw, practical law, etc.)
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY[
  'westlaw',
  'practical law',
  'contract express',
  'westlaw edge',
  'westlaw ai',
  'westlaw precision',
  'checkpoint',
  'high q',
  'highq',
  'thomson reuters ai',
  'tr legal',
  'thomson reuters'
]
WHERE vendor_name = 'Thomson Reuters';

-- Expand Harvey AI keywords
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY[
  'harvey ai',
  'harvey',
  'harveyai',
  'harveylegal',
  'harvey the ai',
  '@harveyai',
  'harvey openai',
  'harvey gpt'
]
WHERE vendor_name = 'Harvey AI';

-- Expand Spellbook keywords
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY[
  'spellbook',
  'spellbook ai',
  'spellbook contract',
  'spellbook legal',
  'spellbook contract review',
  'rally spellbook',
  'rwt spellbook',
  '@spellbookai'
]
WHERE vendor_name = 'Spellbook';

-- Expand Lexion keywords
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY[
  'lexion',
  'lexion ai',
  'lexion clm',
  'lexion contract',
  '@lexionai',
  'lexion lifecycle'
]
WHERE vendor_name = 'Lexion';

-- Expand Latch keywords (make more specific to avoid false positives)
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY[
  'latch ai contract',
  'latch legal',
  'latch ai',
  'latch contract negotiation',
  'latchtech',
  '@latchai'
]
WHERE vendor_name = 'Latch';

-- Expand LegalSifter keywords
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY[
  'legalsifter',
  'legal sifter',
  'legalsifter ai',
  '@legalsifter',
  'legal-sifter'
]
WHERE vendor_name = 'LegalSifter';

-- Expand vLex keywords
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY[
  'vlex',
  'vincent ai',
  'vlex vincent',
  '@vlex',
  'v-lex',
  'vlex ai'
]
WHERE vendor_name = 'vLex';

-- Expand Casetext keywords
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY[
  'casetext',
  'cocounsel',
  'casetext ai',
  '@casetext',
  'casetext cocounsel',
  'co counsel'
]
WHERE vendor_name = 'Casetext';

-- Add new major vendors

-- Clio
INSERT INTO tracked_vendors (vendor_name, product_name, category, reddit_keywords, twitter_handles)
VALUES (
  'Clio',
  'Clio Manage + Clio Grow',
  'practice_management',
  ARRAY['clio', 'clio ai', 'clio cloud', 'clio manage', 'clio grow', '@goclio'],
  ARRAY['goclio']
)
ON CONFLICT (vendor_name) DO UPDATE
SET reddit_keywords = ARRAY['clio', 'clio ai', 'clio cloud', 'clio manage', 'clio grow', '@goclio'];

-- DocuSign (Legal adjacent)
INSERT INTO tracked_vendors (vendor_name, product_name, category, reddit_keywords, twitter_handles)
VALUES (
  'DocuSign',
  'DocuSign CLM',
  'contract_lifecycle',
  ARRAY['docusign clm', 'docusign ai', 'docusign contract', '@docusign'],
  ARRAY['DocuSignInc']
)
ON CONFLICT (vendor_name) DO UPDATE
SET reddit_keywords = ARRAY['docusign clm', 'docusign ai', 'docusign contract', '@docusign'];

-- Ironclad
INSERT INTO tracked_vendors (vendor_name, product_name, category, reddit_keywords, twitter_handles)
VALUES (
  'Ironclad',
  'Ironclad Workflow Designer',
  'contract_lifecycle',
  ARRAY['ironclad', 'ironclad ai', 'ironclad contract', '@ironcladhq'],
  ARRAY['ironcladhq']
)
ON CONFLICT (vendor_name) DO UPDATE
SET reddit_keywords = ARRAY['ironclad', 'ironclad ai', 'ironclad contract', '@ironcladhq'];

-- Icertis
INSERT INTO tracked_vendors (vendor_name, product_name, category, reddit_keywords, twitter_handles)
VALUES (
  'Icertis',
  'Icertis Contract Intelligence',
  'contract_lifecycle',
  ARRAY['icertis', 'icertis contract', '@icertis'],
  ARRAY['icertis']
)
ON CONFLICT (vendor_name) DO UPDATE
SET reddit_keywords = ARRAY['icertis', 'icertis contract', '@icertis'];

-- Evisort
INSERT INTO tracked_vendors (vendor_name, product_name, category, reddit_keywords, twitter_handles)
VALUES (
  'Evisort',
  'Evisort AI',
  'contract_analysis',
  ARRAY['evisort', 'evisort ai', 'evisort contract', '@evisort'],
  ARRAY['evisort']
)
ON CONFLICT (vendor_name) DO UPDATE
SET reddit_keywords = ARRAY['evisort', 'evisort ai', 'evisort contract', '@evisort'];

-- LinkSquares
INSERT INTO tracked_vendors (vendor_name, product_name, category, reddit_keywords, twitter_handles)
VALUES (
  'LinkSquares',
  'LinkSquares CLM',
  'contract_lifecycle',
  ARRAY['linksquares', 'link squares', 'linksquares clm', '@linksquares'],
  ARRAY['LinkSquaresInc']
)
ON CONFLICT (vendor_name) DO UPDATE
SET reddit_keywords = ARRAY['linksquares', 'link squares', 'linksquares clm', '@linksquares'];

-- ThoughtRiver
INSERT INTO tracked_vendors (vendor_name, product_name, category, reddit_keywords, twitter_handles)
VALUES (
  'ThoughtRiver',
  'ThoughtRiver AI',
  'contract_analysis',
  ARRAY['thoughtriver', 'thought river', 'thoughtriver ai', '@thoughtriver'],
  ARRAY['ThoughtRiverAI']
)
ON CONFLICT (vendor_name) DO UPDATE
SET reddit_keywords = ARRAY['thoughtriver', 'thought river', 'thoughtriver ai', '@thoughtriver'];

-- Note: We're intentionally NOT adding "latch" as a standalone keyword to avoid false positives
-- (since "latch" is a common English word)
-- The updated Latch keywords above are more specific

COMMENT ON TABLE tracked_vendors IS 'Updated with expanded keywords for better Reddit intelligence collection';
