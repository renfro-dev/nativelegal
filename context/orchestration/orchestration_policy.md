# Orchestration Policy (R-I-A-U)
1) Read: Load context-pack.yaml; read state.json goal/next_steps/constraints.
2) Interpret: Assign single owner (Supervisor resolves ambiguity).
3) Act: Smallest, reversible change; prefer PR/branch.
4) Update: Append outcome to orchestration/logs and update state.json.

## Logging Requirements (Step 4)
**MANDATORY:** After each agent action, the Supervisor MUST:
1. **Log the action** - Append detailed entry to `context/orchestration/logs/YYYY-MM-DD-agent-actions.md`
2. **Update state.json** - Add progress entry with timestamp, action, and outcome
3. **Update decisions.md** - Add rationale for major decisions

### Log Entry Format:
```markdown
### HH:MM:SSZ - AgentName
**Action:** Brief description of the action performed
**Input:** What was required to perform this action
**Output:** What was produced or achieved
**Status:** ✅ Completed / ❌ Failed / 🚧 In Progress
**Next:** What action should follow this one
```

### Daily Log File:
- **Format:** `YYYY-MM-DD-agent-actions.md`
- **Location:** `context/orchestration/logs/`
- **Purpose:** Detailed record of all agent actions performed on a specific date

## Rules
- Single Writer Rule per step.
- Reviewer Gate before merges/deletions/secrets/publishing.
- Scoped Context: each agent loads only its role spec + needed files.
- Token Discipline: summarize logs older than 10 steps in state.json.summary.
- Stop if DoD met, timebox exceeded, or 3 consecutive null improvements.

## Legal Content Guardrails
- No legal advice; include disclaimers; prefer primary sources (ABA/courts).
- Cite with access dates; avoid unsupported claims; redact PII.
