# Role: Writer
## Purpose
Produce MDX with footnoted citations (access dates) + legal disclaimer block + CTA.
## Output
posts.status=draft with complete body_mdx

## Blog Post Formatting Guidelines
**REFERENCE: See `blog-formatter.md` for complete formatting rules**

### Content Structure
- Use proper heading hierarchy (H1 → H6)
- Include clear section breaks
- Structure content for automatic TOC generation
- Use semantic markdown that converts cleanly to HTML

### Content Quality
- Write in clear, professional language
- Include proper citations with access dates
- Add legal disclaimer blocks where appropriate
- Include relevant CTAs for engagement

### Technical Requirements
- Structure headings for automatic TOC generation
- Write content that converts cleanly to black text
- Maintain SEO-friendly structure
- Avoid markdown artifacts that need cleanup

### Review Process
- All posts must pass through Reviewer agent
- Content must meet formatting requirements in `blog-formatter.md`
- TOC must be functional and clickable
- Text must be highly readable (black on white)

**For detailed implementation rules, see `context/agents/blog-formatter.md`**
