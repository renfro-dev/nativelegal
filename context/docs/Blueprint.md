# Native Legal Architecture Blueprint
## Core SEO Content Generation Engine (Existing)
- **Ingest (crawlers)** → supabase/functions/ingest_url + packages/tools/crawl
- **Plan (strategist)** → broker job "plan_weekly"
- **Compose (outliner/writer/editor)** → broker handlers + prompts
- **Publish (adapter)** → static MDX (WordPress optional)
- **Index (sitemap/RSS ping)**
- **Metrics (GA4/GSC → post_metrics)**
- **Reflect (actions → next backlog)**

## Native Legal Transformation Modules (New)
- **Intake Optimization** → Multi-language client qualification and vetting (configurable by practice area)
- **Conflict Check Automation** → AI-powered conflict detection and resolution (practice-area specific rules)
- **Collections Enhancement** → Automated communication and payment workflows
- **AI Strategy Planning** → People-first automation roadmap development

## Practice-Area Specialization System
- **Phase 1: Family Law** → Family law-specific content, workflows, and compliance
- **Phase 2: Expansion** → Personal injury, criminal defense, estate planning modules
- **Phase 3: Full Agnostic** → Configurable practice-area templates and content generation

## Technical Architecture
- **AI Models** → Practice-area agnostic base models with specialization layers
- **Content Engine** → SEO-optimized article generation with practice-area customization
- **Integration Layer** → APIs for Clio, MyCase, PracticePanther, and other PM systems
- **Multi-language Support** → Spanish, Chinese, and other high-demand languages
- **Compliance Engine** → Practice-area specific ethics and regulation compliance

## Data Interfaces (Existing + New)
- **jobs.payload** (Zod contracts in packages/schemas)
- **posts** (id, slug, title, status, body_mdx, seo_meta)
- **sources** (url, content_text, embedding, trust/filter flags)
- **metrics** (post_metrics by day)
- **content_articles** (SEO metadata, performance metrics, practice-area tags)
- **seo_metrics** (traffic data, keyword rankings, conversion rates)
- **client_data** (intake forms, qualification scores, communication history)
- **conflict_checks** (search results, risk levels, resolution status)
- **collections_metrics** (payment rates, communication effectiveness, revenue impact)
- **ai_strategy** (automation recommendations, implementation status, ROI tracking)
