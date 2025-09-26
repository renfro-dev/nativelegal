# Blog Formatting Automation Guide
## Purpose
Comprehensive automation rules for consistent blog post formatting across all agents.

## Automated Processing Pipeline

### 1. Content Pre-Processing
```javascript
// Remove markdown table of contents sections
content = content.replace(/## Table of Contents[\s\S]*?(?=## |$)/g, '')

// Remove other common meta sections
content = content.replace(/## Overview[\s\S]*?(?=## |$)/g, '')
content = content.replace(/## Summary[\s\S]*?(?=## |$)/g, '')
content = content.replace(/## Introduction[\s\S]*?(?=## |$)/g, '')
```

### 2. Heading Processing
```javascript
// Convert markdown headings to HTML with proper IDs and typography
content = content.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, text) => {
  const level = hashes.length
  
  // Clean up heading text - remove markdown anchor links {#anchor-name}
  const cleanText = text.replace(/\s*\{#[^}]+\}/g, '').trim()
  const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  // Define typography classes for each heading level
  const typographyClasses = {
    1: 'text-4xl lg:text-5xl font-bold text-slate-900 mb-8 mt-12 leading-tight tracking-tight',
    2: 'text-3xl lg:text-4xl font-bold text-slate-900 mb-6 mt-10 leading-tight tracking-tight',
    3: 'text-2xl lg:text-3xl font-semibold text-slate-900 mb-5 mt-8 leading-snug',
    4: 'text-xl lg:text-2xl font-semibold text-slate-900 mb-4 mt-6 leading-snug',
    5: 'text-lg lg:text-xl font-semibold text-slate-900 mb-3 mt-5 leading-snug',
    6: 'text-base lg:text-lg font-semibold text-slate-900 mb-3 mt-4 leading-snug'
  }
  
  const classes = typographyClasses[level] || typographyClasses[6]
  return `<h${level} id="${id}" class="scroll-mt-20 ${classes}">${cleanText}</h${level}>`
})
```

### 3. Markdown Cleanup
```javascript
// Convert bold and italic
content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')

// Remove bullet points and numbered lists
content = content.replace(/^\s*[-*+]\s+/gm, '')
content = content.replace(/^\s*\d+\.\s+/gm, '')

// Convert line breaks
content = content.replace(/\n/g, '<br/>')
```

### 4. Styling Application
```javascript
// Add typography classes and inline styles
content = content.replace(/<p>/g, '<p class="text-lg leading-relaxed text-slate-900 mb-6" style="color: #0f172a;">')
content = content.replace(/<li>/g, '<li class="text-lg leading-relaxed text-slate-900 mb-2" style="color: #0f172a;">')
content = content.replace(/<span>/g, '<span class="text-lg leading-relaxed text-slate-900" style="color: #0f172a;">')
```

### 5. Table of Contents Generation
```javascript
// Extract headings for TOC (excluding meta headings)
const headings = content
  .split('\n')
  .filter(line => line.match(/^#{1,6}\s+/))
  .filter(line => {
    const text = line.replace(/^#+\s*/, '').trim().toLowerCase()
    return !text.includes('table of contents') && 
           !text.includes('contents') &&
           !text.includes('overview') &&
           !text.includes('introduction') &&
           !text.includes('summary')
  })
  .map((heading, index) => {
    const level = heading.match(/^#+/)?.[0].length || 1
    const text = heading.replace(/^#+\s*/, '').trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const indent = level > 2 ? `ml-${(level - 2) * 4}` : ''
    
    return { id, text, level, indent }
  })
```

## Agent Integration Rules

### Writer Agent
- Structure content for clean conversion
- Use proper heading hierarchy
- Avoid markdown artifacts
- Include clear section breaks

### Reviewer Agent
- Verify all formatting requirements met
- Check for markdown symbols
- Validate TOC functionality
- Confirm text readability

### Publisher Agent
- Apply formatting before publishing
- Generate client TOC component
- Test all navigation links
- Validate final output

### Editor Agent
- Maintain formatting during updates
- Re-apply processing pipeline
- Preserve heading IDs
- Update TOC if needed

## Quality Validation Checklist

### Content Quality
- [ ] No markdown symbols visible
- [ ] All text is black and readable
- [ ] Clean, professional appearance
- [ ] Proper content flow
- [ ] No markdown anchor links in heading text (e.g., `{#anchor-name}`)
- [ ] Typography hierarchy applied (H1-H6)
- [ ] Consistent paragraph spacing and sizing
- [ ] Responsive text scaling on mobile/desktop

### Navigation
- [ ] Single, functional table of contents
- [ ] All heading IDs properly generated
- [ ] Smooth scrolling navigation works
- [ ] No meta headings in TOC

### Technical
- [ ] No Next.js client component errors
- [ ] Proper heading hierarchy maintained
- [ ] SEO structure preserved
- [ ] Mobile responsiveness maintained

### SEO Optimization
- [ ] Semantic HTML structure intact
- [ ] Proper heading hierarchy (H1 → H6)
- [ ] Links remain blue for contrast
- [ ] Schema markup compatibility

## Error Prevention
- Always use client components for interactive elements
- Never use inline event handlers in server components
- Test TOC links before publishing
- Verify no markdown artifacts remain
- Ensure proper ID generation for all headings

## Implementation Notes
- These rules must be applied to ALL blog posts
- Processing should happen before content rendering
- TOC generation requires client component
- All agents must reference `blog-formatter.md` for details
- Quality validation is mandatory before publishing
