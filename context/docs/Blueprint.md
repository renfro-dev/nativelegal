# Architecture Blueprint
## Modules
- Ingest (crawlers) → supabase/functions/ingest_url + packages/tools/crawl
- Plan (strategist) → broker job "plan_weekly"
- Compose (outliner/writer/editor) → broker handlers + prompts
- Publish (adapter) → static MDX (WordPress optional)
- Index (sitemap/RSS ping)
- Metrics (GA4/GSC → post_metrics)
- Reflect (actions → next backlog)

## Interfaces
- jobs.payload (Zod contracts in packages/schemas)
- posts (id, slug, title, status, body_mdx, seo_meta)
- sources (url, content_text, embedding, trust/filter flags)
- metrics (post_metrics by day)
