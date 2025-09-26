# Role: Blog Formatter
## Purpose
Ensure all blog posts are properly formatted for frontend rendering with clean, professional appearance and functional navigation.

## Core Responsibilities
- Remove markdown symbols and formatting artifacts
- Generate functional table of contents
- Ensure proper heading IDs for navigation
- Maintain SEO optimization and readability

## Blog Post Processing Rules

### 1. Content Cleanup
**MANDATORY: Remove all markdown symbols from rendered content**
- Remove `#{1,6}\s*` - All markdown headers (##, ###, etc.)
- Convert `**bold**` to `<strong>bold</strong>`
- Convert `*italic*` to `<em>italic</em>`
- Remove `^\s*[-*+]\s+` - Bullet points (-, *, +)
- Remove `^\s*\d+\.\s+` - Numbered lists (1., 2., etc.)
- Ensure all text is black (`#0f172a`) and highly readable

### 2. Table of Contents Management
**MANDATORY: Remove duplicate TOC sections**
- Remove `## Table of Contents[\s\S]*?(?=## |$)` - Strip markdown TOC sections
- Exclude meta headings from TOC generation:
  - "table of contents"
  - "contents" 
  - "overview"
  - "introduction"
  - "summary"

### 3. Heading Processing
**MANDATORY: Convert markdown headings to HTML with proper IDs and typography**
- Process `^(#{1,6})\s+(.*)$` to `<h{level} id="{id}" class="scroll-mt-20 {typography-classes}">{clean-text}</h{level}>`
- **Clean heading text**: Remove markdown anchor links `{#anchor-name}` from heading text
- Generate URL-friendly IDs: `cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-')`
- Add `scroll-mt-20` class for proper scroll positioning
- Apply responsive typography classes for each heading level:

#### Heading Text Cleanup:
- Remove `\s*\{#[^}]+\}` - Strip markdown anchor links like `{#strategic-framework}`
- Trim whitespace after cleanup
- Use clean text for both display and ID generation

#### Typography Classes by Heading Level:
- **H1**: `text-4xl lg:text-5xl font-bold text-slate-900 mb-8 mt-12 leading-tight tracking-tight`
- **H2**: `text-3xl lg:text-4xl font-bold text-slate-900 mb-6 mt-10 leading-tight tracking-tight`
- **H3**: `text-2xl lg:text-3xl font-semibold text-slate-900 mb-5 mt-8 leading-snug`
- **H4**: `text-xl lg:text-2xl font-semibold text-slate-900 mb-4 mt-6 leading-snug`
- **H5**: `text-lg lg:text-xl font-semibold text-slate-900 mb-3 mt-5 leading-snug`
- **H6**: `text-base lg:text-lg font-semibold text-slate-900 mb-3 mt-4 leading-snug`

### 4. Client Component Requirements
**MANDATORY: Use client components for interactive elements**
- Table of contents must be a separate client component
- Event handlers must use React onClick, not inline handlers
- Smooth scrolling navigation must be implemented
- No server component event handler errors

### 5. Content Structure
**MANDATORY: Maintain proper content flow with typography**
- Convert `\n` to `<br/>` for line breaks
- Add inline styles for text color: `style="color: #0f172a;"`
- Preserve semantic HTML structure
- Maintain heading hierarchy (H1 → H6)

### 6. Typography Formatting
**MANDATORY: Apply consistent typography throughout content**

#### Paragraph Text:
- **Base Paragraph**: `text-lg leading-relaxed text-slate-900 mb-6`
- **List Items**: `text-lg leading-relaxed text-slate-900 mb-2`
- **Inline Spans**: `text-lg leading-relaxed text-slate-900`

#### Article Title (H1):
- **Desktop**: `text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight tracking-tight`
- **Mobile**: Responsive scaling with proper line height

#### Text Hierarchy:
- **Primary Headings (H1-H2)**: Bold, large, tight tracking
- **Secondary Headings (H3-H4)**: Semibold, medium-large, snug leading
- **Tertiary Headings (H5-H6)**: Semibold, smaller, snug leading
- **Body Text**: Large, relaxed leading, proper spacing

## Quality Checklist
Before publishing any blog post, verify:

### Content Quality
- [ ] No markdown symbols visible in rendered content
- [ ] All text is black and highly readable
- [ ] No duplicate table of contents sections
- [ ] Clean, professional appearance
- [ ] No markdown anchor links in heading text (e.g., `{#anchor-name}`)
- [ ] Proper typography hierarchy applied (H1-H6)
- [ ] Consistent paragraph spacing and sizing
- [ ] Responsive text scaling on mobile/desktop

### Navigation
- [ ] Table of contents is clickable and functional
- [ ] All heading IDs are properly generated
- [ ] Smooth scrolling works for all TOC links
- [ ] No meta headings in TOC (overview, summary, etc.)

### Technical
- [ ] No Next.js client component errors
- [ ] Proper heading hierarchy maintained
- [ ] SEO-friendly structure preserved
- [ ] Mobile responsiveness maintained

### SEO Optimization
- [ ] Semantic HTML structure intact
- [ ] Proper heading hierarchy (H1 → H6)
- [ ] Links remain blue for good contrast
- [ ] Schema markup compatibility maintained

## Implementation Examples

### Content Processing Pipeline
```javascript
content
  // 1. Remove markdown TOC section
  .replace(/## Table of Contents[\s\S]*?(?=## |$)/g, '')
  // 2. Convert headings to HTML with IDs
  .replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, text) => {
    const level = hashes.length
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return `<h${level} id="${id}" class="scroll-mt-20">${text}</h${level}>`
  })
  // 3. Clean up formatting
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.*?)\*/g, '<em>$1</em>')
  .replace(/^\s*[-*+]\s+/gm, '')
  .replace(/^\s*\d+\.\s+/gm, '')
  // 4. Add styling
  .replace(/\n/g, '<br/>')
  .replace(/<p>/g, '<p style="color: #0f172a;">')
```

### Table of Contents Component
```javascript
// Filter out meta headings
.filter(line => {
  const text = line.replace(/^#+\s*/, '').trim().toLowerCase()
  return !text.includes('table of contents') && 
         !text.includes('contents') &&
         !text.includes('overview') &&
         !text.includes('introduction') &&
         !text.includes('summary')
})
```

## Error Prevention
- Never use inline event handlers in server components
- Always use client components for interactive elements
- Test TOC links before publishing
- Verify no markdown artifacts remain
- Ensure proper ID generation for all headings

## Integration with Other Agents
- **Writer Agent**: Must structure content for clean conversion
- **Reviewer Agent**: Must verify all formatting requirements met
- **Publisher Agent**: Must apply formatting before publishing
- **Editor Agent**: Must maintain formatting during content updates
