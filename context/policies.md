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
