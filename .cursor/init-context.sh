#!/usr/bin/env bash
set -euo pipefail

# --- paths ---
ROOT="$(pwd)"
CTX="$ROOT/context"
CURSOR_DIR="$ROOT/.cursor"

mkdir -p "$CTX"/{docs,agents,evaluation,orchestration/logs} "$CURSOR_DIR"

# ---------- /context/README.md ----------
cat > "$CTX/README.md" <<'EOF'
# Agentic SEO Machine — Context Pack (Law-Firm AI v1)
Pin these tabs in Cursor: docs/PRD.md, docs/Blueprint.md, docs/Tasks.md, agents/supervisor.md, orchestration/state.json.
EOF

# ---------- /context/context-pack.yaml ----------
cat > "$CTX/context-pack.yaml" <<'EOF'
name: "Agentic SEO Machine — Law-Firm AI Context Pack"
version: 1
includes:
  - path: ./docs/PRD.md
    purpose: Product goals, constraints, acceptance criteria (law-firm SEO)
  - path: ./docs/Blueprint.md
    purpose: Architecture, modules, interfaces, sequencing
  - path: ./docs/Tasks.md
    purpose: Work breakdown, DoD, next steps
  - path: ./policies.md
    purpose: Rules of engagement, orchestration loop, guardrails
  - path: ./evaluation/qa_criteria.md
    purpose: Cross-cutting QA before merges
  - path: ./agents/supervisor.md
    purpose: Supervisor role/system
  - path: ./agents/reviewer.md
    purpose: Reviewer/QA gate
  - path: ./agents/researcher.md
    purpose: Crawl/ingest & topic map
  - path: ./agents/strategist.md
    purpose: Weekly plan & prioritization
  - path: ./agents/outliner.md
    purpose: H2/H3, FAQ, links plan
  - path: ./agents/writer.md
    purpose: MDX drafts with citations + disclaimers
  - path: ./agents/editor.md
    purpose: Fact-check, tone, legal compliance
  - path: ./agents/publisher.md
    purpose: Publish (static/WP), sitemap/RSS
  - path: ./agents/indexer.md
    purpose: Search engine pings & GSC submission
  - path: ./agents/analyst.md
    purpose: GA4/GSC pulls → metrics
  - path: ./agents/reflector.md
    purpose: Weekly actions to improve CTR/conversions
  - path: ./orchestration/state.json
    purpose: Live plan, tasks, progress, risks
  - path: ./orchestration/decisions.md
    purpose: Decision log (why X over Y)
EOF

# ---------- /context/policies.md ----------
cat > "$CTX/policies.md" <<'EOF'
# Orchestration Policy (R-I-A-U)
1) Read: Load context-pack.yaml; read state.json goal/next_steps/constraints.
2) Interpret: Assign single owner (Supervisor resolves ambiguity).
3) Act: Smallest, reversible change; prefer PR/branch.
4) Update: Append outcome to orchestration/logs and update state.json.

## Rules
- Single Writer Rule per step.
- Reviewer Gate before merges/deletions/secrets/publishing.
- Scoped Context: each agent loads only its role spec + needed files.
- Token Discipline: summarize logs older than 10 steps in state.json.summary.
- Stop if DoD met, timebox exceeded, or 3 consecutive null improvements.

## Legal Content Guardrails
- No legal advice; include disclaimers; prefer primary sources (ABA/courts).
- Cite with access dates; avoid unsupported claims; redact PII.
EOF

# ---------- /context/evaluation/qa_criteria.md ----------
cat > "$CTX/evaluation/qa_criteria.md" <<'EOF'
# QA Criteria — Definition of Done
- Meets PRD acceptance criteria and Blueprint interfaces
- Evidence-backed claims (primary sources preferred)
- Command/smoke test exists; no type errors
- No secrets in code/logs; envs documented
- Editor approved; disclaimer present; internal links added
EOF

# ---------- /context/docs/PRD.md ----------
cat > "$CTX/docs/PRD.md" <<'EOF'
# PRD — Agentic SEO Machine (Law-Firm AI & RevOps)
## Goal
Automate a weekly content cycle for CA law-firm buyers across: AI Readiness, RevOps for Legal,
Attorney Workflows & AI, and AI & Consumer Legal — improving GSC impressions & CTR.

## Success Metrics
- M1: ↑ GSC impressions on pillar pages over 8 weeks
- M2: ↑ CTR on 3 target pages
- M3: ≥1 new post/week + 1 roundup with Editor approval

## Constraints
- Stack: Cursor + pnpm monorepo, Supabase (pgvector + Edge Functions), Next.js (MDX), GA4/GSC
- Legal/Sec: disclaimers; primary sources; redact PII

## Acceptance Criteria
- [ ] Weekly agents run: Research → Strategize → Outline → Write → Edit → Publish → Index → Analyze → Reflect
- [ ] Posts stored in DB and published (static MDX v1); sitemap/RSS updated
- [ ] Metrics pulled to DB and reflected into next plan
EOF

# ---------- /context/docs/Blueprint.md ----------
cat > "$CTX/docs/Blueprint.md" <<'EOF'
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
EOF

# ---------- /context/docs/Tasks.md ----------
cat > "$CTX/docs/Tasks.md" <<'EOF'
# Tasks & DoD
## Sprint 0
- [ ] Repo bootstrap & Supabase schema (DoD: broker connects; migrate runs)
- [ ] Context pack installed + .cursor config

## Sprint 1
- [ ] Broker polling + ingest_url Edge Function (DoD: can insert sources)
- [ ] Strategist plan outputs posts in "idea/outline"

## Sprint 2
- [ ] Writer/Editor produce MDX for 1 pillar + 2 spokes; Publisher live
- [ ] Metrics + Reflector produce 5 actions
EOF

# ---------- Agents ----------
agent() { cat > "$CTX/agents/$1.md" <<'EOF'
REPLACE_ME
EOF
}

cat > "$CTX/agents/supervisor.md" <<'EOF'
# Role: Supervisor
## Purpose
Own plan/sequence/quality; maintain state; enforce gates.
## Inputs
/context/docs/*.md, /context/orchestration/state.json, /context/agents/*
## Outputs
Updated state.json (next_steps/progress) and decisions.md (rationale)
## System Prompt
You are the Supervisor. Follow policies.md (R-I-A-U). Choose the smallest, highest-value next step.
Assign a single owner. Require Reviewer approval for destructive ops/publishing.
EOF

cat > "$CTX/agents/reviewer.md" <<'EOF'
# Role: Reviewer
## Purpose
Quality gate vs QA criteria; approve only when DoD met.
## System Prompt
Check changes against evaluation/qa_criteria.md and PRD/Blueprint. If risks, propose safer alt.
EOF

cat > "$CTX/agents/researcher.md" <<'EOF'
# Role: Researcher
## Purpose
Crawl trusted domains (ABA, CA courts, vendors, analysts), dedupe, filter by freshness/trust, embed.
## Output
sources rows + topic_map (links, dates)
## System Prompt
Gather high-authority facts for law-firm AI readiness, RevOps, workflows, consumer legal.
Prefer primary sources; attach access dates; avoid duplication; update state.json.evidence.
EOF

cat > "$CTX/agents/strategist.md" <<'EOF'
# Role: Strategist
## Purpose
Turn topic_map + metrics into weekly plan (pillars/spokes) with internal-link plan & SEO meta.
## Output
posts in idea/outline with seo_meta {intent, serpType, competitors, targetKeywords}
EOF

cat > "$CTX/agents/outliner.md" <<'EOF'
# Role: Outliner
## Purpose
H2/H3 outline, schema.org FAQ (≥4), internal/external link plan, compliance placeholders.
## Output
posts.status=outline with MDX scaffold
EOF

cat > "$CTX/agents/writer.md" <<'EOF'
# Role: Writer
## Purpose
Produce MDX with footnoted citations (access dates) + legal disclaimer block + CTA.
## Output
posts.status=draft with complete body_mdx
EOF

cat > "$CTX/agents/editor.md" <<'EOF'
# Role: Editor
## Purpose
Fact-check; ensure CA relevance; tighten titles/meta; verify disclaimers/CTAs; remove fluff.
## Output
posts.status=scheduled
EOF

cat > "$CTX/agents/publisher.md" <<'EOF'
# Role: Publisher
## Purpose
Publish via static MDX (or WordPress), update sitemap/RSS; return live URL.
## Output
posts.status=published with published_at
EOF

cat > "$CTX/agents/indexer.md" <<'EOF'
# Role: Indexer
## Purpose
Ping search engines; confirm GSC submission; resubmit sitemap on changes.
## Output
log entry with submission results
EOF

cat > "$CTX/agents/analyst.md" <<'EOF'
# Role: Analyst
## Purpose
Pull GA4/GSC, join into post_metrics, compute weekly deltas; highlight wins/gaps.
## Output
post_metrics rows + short trend notes
EOF

cat > "$CTX/agents/reflector.md" <<'EOF'
# Role: Reflector
## Purpose
Propose 5 actions to improve CTR/conversions; prefer edits to existing pages when feasible.
## Output
reflections row + enqueue actions (jobs) for Strategist
EOF

# ---------- Orchestration ----------
cat > "$CTX/orchestration/state.json" <<'EOF'
{
  "goal": "Ship v1 automated weekly cycle for law-firm SEO (CA focus)",
  "constraints": ["timebox: 90m/session", "no secrets in repo"],
  "context": {
    "spec_files": ["/context/docs/PRD.md", "/context/docs/Blueprint.md"],
    "policy": "/context/policies.md"
  },
  "next_steps": [
    { "id": "S0-001", "owner": "Supervisor", "desc": "Confirm Sprint 0 plan", "status": "todo" },
    { "id": "ING-101", "owner": "Researcher", "desc": "Seed trusted sources list + first 3 URLs", "status": "todo" },
    { "id": "PLAN-201", "owner": "Strategist", "desc": "Weekly plan: 1 pillar + 2 spokes", "status": "todo" }
  ],
  "progress": [],
  "evidence": [],
  "risks": []
}
EOF

cat > "$CTX/orchestration/decisions.md" <<'EOF'
# Decisions Log
- 2025-08-26: Adopted nine-agent pipeline + Supervisor/Reviewer gates for legal SEO domain.
EOF

# ---------- .cursor/config.json ----------
cat > "$CURSOR_DIR/config.json" <<'EOF'
{
  "$schema": "https://cursor.sh/schemas/v1/cursor.schema.json",
  "contextPacks": ["/context/context-pack.yaml"],
  "notes": "Load this pack at session start; agents read role files and state.json."
}
EOF

echo "✅ Context pack installed at $CTX"
echo "Next:"
echo "  1) In Cursor, pin: context/docs/PRD.md, Blueprint.md, Tasks.md, agents/supervisor.md, orchestration/state.json"
echo "  2) Composer:"
echo "     System: (paste from /context/agents/supervisor.md)"
echo "     User: Read /context/context-pack.yaml and adopt roles. Plan first three steps and update /context/orchestration/state.json and /context/orchestration/decisions.md."
