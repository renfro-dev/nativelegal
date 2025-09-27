# Agent Action Logging System Guide

## Overview
This guide explains how to use the detailed agent action logging system for tracking all agent activities in the Native Legal platform development workflow.

## Log File Structure

### Daily Action Logs
- **Format:** `YYYY-MM-DD-agent-actions.md`
- **Location:** `context/orchestration/logs/`
- **Purpose:** Detailed record of all agent actions performed on a specific date

### Sprint Completion Logs
- **Format:** `YYYY-MM-DD-sprintX-completion.md`
- **Location:** `context/orchestration/logs/`
- **Purpose:** High-level summary of sprint achievements and milestones

## Log Entry Format

Each agent action should be logged with the following structure:

```markdown
### HH:MM:SSZ - AgentName
**Action:** Brief description of the action performed
**Input:** What was required to perform this action
**Output:** What was produced or achieved
**Status:** ✅ Completed / ❌ Failed / 🚧 In Progress
**Next:** What action should follow this one
```

## Required Information

### For Each Action Log Entry:
1. **Timestamp** - Exact time in UTC (HH:MM:SSZ)
2. **Agent Name** - Which agent performed the action
3. **Action Description** - Clear, concise description
4. **Input** - What was needed to perform the action
5. **Output** - What was produced or achieved
6. **Status** - Current status of the action
7. **Next Action** - What should happen next

### For Daily Log Summary:
1. **Total Actions** - Count of actions performed
2. **Agents Involved** - List of agents that performed actions
3. **Duration** - Total time spent
4. **Status** - Overall status for the day
5. **Next Phase** - What comes next

## R-I-A-U Policy Compliance

### Step 4: Update
After each agent action, the Supervisor must:
1. **Append outcome to orchestration/logs** - Add detailed log entry
2. **Update state.json** - Update progress and next steps
3. **Update decisions.md** - Add rationale for major decisions

### Logging Requirements:
- **Real-time logging** - Log actions as they happen
- **Detailed descriptions** - Include input, output, and context
- **Status tracking** - Mark completion status clearly
- **Next action planning** - Specify what should happen next

## Quality Gates

### Log Entry Quality:
- ✅ Clear, actionable descriptions
- ✅ Specific input/output details
- ✅ Accurate timestamps
- ✅ Proper status indicators
- ✅ Logical next action planning

### Daily Log Quality:
- ✅ Complete action coverage
- ✅ Accurate agent attribution
- ✅ Proper summary information
- ✅ Clear next phase planning
- ✅ Issue tracking and resolution

## File Naming Convention

### Daily Action Logs:
```
2025-01-27-agent-actions.md
2025-01-28-agent-actions.md
2025-01-29-agent-actions.md
```

### Sprint Logs:
```
2025-01-27-sprint3-completion.md
2025-02-03-sprint4-completion.md
```

### Special Logs:
```
LOGGING_SYSTEM_GUIDE.md (this file)
```

## Integration with State Management

### State.json Updates:
- Progress array should reference log entries
- Next steps should align with logged actions
- Evidence should point to log files

### Decisions.md Updates:
- Major decisions should reference specific log entries
- Rationale should include context from logs
- Timestamps should match log entries

## Best Practices

### For Agents:
1. **Log immediately** - Don't wait to log actions
2. **Be specific** - Include detailed input/output
3. **Use clear language** - Avoid jargon and ambiguity
4. **Track status** - Mark completion clearly
5. **Plan next steps** - Specify what should happen next

### For Supervisor:
1. **Enforce logging** - Ensure all actions are logged
2. **Review quality** - Check log entry completeness
3. **Update state** - Keep state.json synchronized
4. **Track progress** - Monitor overall workflow
5. **Plan ahead** - Use logs for future planning

## Troubleshooting

### Common Issues:
- **Missing logs** - Check if R-I-A-U policy is being followed
- **Incomplete entries** - Ensure all required fields are filled
- **Timing issues** - Use consistent UTC timestamps
- **Status confusion** - Use clear status indicators
- **Next action gaps** - Always specify what should happen next

### Resolution Steps:
1. Identify missing or incomplete log entries
2. Update logs with missing information
3. Ensure state.json reflects log entries
4. Verify decisions.md includes major decisions
5. Plan next actions based on log analysis

## Examples

### Good Log Entry:
```markdown
### 14:30:00Z - Writer
**Action:** Created complete MDX content for AI Readiness Assessment article
**Input:** Outline from Outliner, research from Researcher, SEO metadata from Strategist
**Output:** 3,500-word MDX article with footnoted citations, legal disclaimers, and CTA
**Status:** ✅ Completed
**Next:** Editor review and fact-checking
```

### Poor Log Entry:
```markdown
### 14:30:00Z - Writer
**Action:** Wrote article
**Status:** Done
```

## Maintenance

### Daily Tasks:
- Create new daily log file
- Log all agent actions in real time
- Update state.json with progress
- Review log quality and completeness

### Weekly Tasks:
- Review all daily logs for the week
- Create sprint completion log
- Update decisions.md with major decisions
- Plan next week's actions based on logs

### Monthly Tasks:
- Archive old log files
- Summarize monthly progress
- Update project documentation
- Plan next month's objectives

This logging system ensures complete transparency and accountability in the Native Legal platform development process.
