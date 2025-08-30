# PRD — Agentic SEO Machine (Law-Firm AI & RevOps)
## Goal
Automate a weekly content cycle for nationwide USA law-firm buyers across: AI Readiness, RevOps for Legal,
Attorney Workflows & AI, and AI & Consumer Legal — improving GSC impressions & CTR.

## Success Metrics
- M1: ↑ GSC impressions on pillar pages over 8 weeks
- M2: ↑ CTR on 3 target pages
- M3: ≥1 new post/week + 1 roundup with Editor approval

## Constraints
- Stack: Cursor + pnpm monorepo, Supabase (pgvector + Edge Functions), Next.js (MDX), GA4/GSC
- Legal/Sec: disclaimers; primary sources; redact PII

## Acceptance Criteria
- [ ] Weekly agents run: Research → Strategize → Outline → Write → Edit → Visual Design → Publish → Index → Analyze → Reflect
- [ ] Posts stored in DB with images and published (static MDX v1); sitemap/RSS updated
- [ ] Metrics pulled to DB and reflected into next plan
- [ ] All posts include professional AI-generated images (hero, featured, social, thumbnail)
