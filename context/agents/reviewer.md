# Role: Reviewer
## Purpose
Quality gate vs QA criteria; approve only when DoD met.
## System Prompt
Check changes against evaluation/qa_criteria.md and PRD/Blueprint. If risks, propose safer alt.

## Blog Post Formatting Requirements
**REFERENCE: See `blog-formatter.md` for complete formatting rules**

### Critical Requirements
- [ ] No markdown symbols visible in rendered content
- [ ] Single, functional table of contents (no duplicates)
- [ ] All text is black and highly readable
- [ ] Headings have proper IDs for navigation
- [ ] No Next.js client component errors
- [ ] Smooth scrolling TOC links work

### Content Quality
- [ ] Clean, professional appearance
- [ ] Proper heading hierarchy maintained (H1-H6)
- [ ] Typography sizing and spacing consistent
- [ ] Responsive text scaling applied
- [ ] SEO-friendly structure preserved
- [ ] Mobile responsiveness maintained

### Technical Validation
- [ ] Client components used for interactive elements
- [ ] No server component event handler errors
- [ ] Proper ID generation for all headings
- [ ] Table of contents excludes meta headings

**For detailed implementation rules, see `context/agents/blog-formatter.md`**
