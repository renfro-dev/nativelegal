# Content SEO Specification for Native Legal

## Overview
This document defines the SEO content requirements and best practices for all blog posts and content on the Native Legal platform. It ensures consistency, quality, and optimal search engine performance.

## Core SEO Requirements

### 1. Complete SEO Metadata

All posts must include comprehensive metadata in the frontmatter:

```markdown
---
title: "Descriptive Title with Primary Keyword (Year)"
description: "Meta description 150-160 characters including primary keyword and value proposition"
slug: "primary-keyword-secondary-keyword-year"
date: "YYYY-MM-DD"
category: "Legal Technology"
tags: ["Primary Keyword", "Secondary Keyword", "Related Keywords", "Platform Names"]
author: "Native Legal"
featured: true
heroImage: "/images/post-slug-hero-1200x675.svg"
featuredImage: "/images/post-slug-featured-400x300.svg"
socialImage: "/images/post-slug-social-1200x630.svg"
thumbnailImage: "/images/post-slug-thumbnail-300x200.svg"
imageAlt: "Descriptive alt text with primary keyword"
seo:
  focusKeyword: "Primary target keyword phrase"
  metaTitle: "SEO-optimized title with keyword"
  metaDescription: "SEO-optimized meta description"
  schema: "Article|HowTo|Comparison"
relatedPosts:
  - "related-post-slug-1"
  - "related-post-slug-2"
  - "related-post-slug-3"
---
```

### 2. Content Structure Requirements

#### Executive Summary
- **Required:** Yes, for all posts
- **Length:** 3-5 paragraphs
- **Must Include:**
  - Primary value proposition
  - Key findings or takeaways (bullet points)
  - Target audience identification
  - Outcome/benefit summary

#### Main Content Sections
- **Minimum Length:** 2,500 words for hub posts, 2,000 words for spoke posts
- **Structure:**
  - H2 section headings with keyword optimization
  - H3 subsections for detailed topics
  - Bullet points and lists for scannability
  - Internal links to related content (3-5 per post)

## Best Practice: Third-Party Tool Reviews

### NEW MANDATORY SECTION: "What Legal Professionals Are Saying"

**When to Use:** ALL posts about third-party tools, platforms, or vendors

**Location:** Immediately after Executive Summary, before main content

**Purpose:**
- Provide social proof and credibility
- Include real user feedback and testimonials
- Reference third-party review sources
- Present market adoption data
- Build trust through transparency

### Required Sub-Sections

#### 1. Third-Party Reviews and Market Feedback

**Format:**
```markdown
## What Legal Professionals Are Saying About [Platform Name]

### Third-Party Reviews and Market Feedback

Based on extensive user feedback from legal professionals:

**[Platform] User Feedback ([Source] Rating: [X.X]/[Y]):**^[citation number]
- **Positive Themes:** [Quote themes from reviews]
- **Considerations:** [Common complaint themes]  
- **Best For:** [Target firm size/type]

**Law Firm Leadership Feedback:**
- "[Compelling quote]" - [Title], [Size]-attorney firm
- "[Compelling quote]" - [Title], [Type] firm
- "[Compelling quote]" - [Title], [Department type]

**Practicing Attorney Feedback:**
- "[Relevant quote]" - [Practice Area] Attorney
- "[Relevant quote]" - [Role] Attorney
- "[Relevant quote]" - [Seniority] Attorney
```

**Required Sources:**
- G2 Product Reviews
- Capterra Reviews
- TrustRadius Enterprise Reviews
- Software Advice
- Industry analyst reports (Legaltech News, Bloomberg Law)

#### 2. Market Reception and Adoption

**Format:**
```markdown
### Market Reception and Adoption

According to [Source] and industry analyst reports:^[citation number]
- [Platform] adoption increased **X% year-over-year** in [Year]
- Strong adoption particularly among **[firm size/type]**
- Average user satisfaction: **X.X/Y stars** based on [user type]
- Primary value drivers: **[benefit 1 (XX%) and benefit 2]**
```

**Required Data Points:**
- Year-over-year adoption growth percentage
- Target demographic showing strongest adoption
- Average user satisfaction rating
- Primary value drivers/benefits

### Citation Requirements

- Add new citations to References section
- Include G2, Capterra, or other review platform citations
- Include industry analyst report citations
- Follow academic citation format
- Number citations sequentially

### Quality Standards

- **Authenticity:** Real, meaningful feedback themes
- **Balance:** Both positive themes and considerations
- **Attribution:** Real firm types and roles (generic to protect privacy)
- **Relevance:** Feedback specifically related to legal professionals
- **Currency:** Latest available review data (typically 2024-2025)

### Examples

See `harvey-ai-law-firms-complete-guide-2025.mdx` and `latch-ai-contract-negotiation-law-firms-2025.mdx` for complete implementation examples.

## LLM SEO Best Practices

### 3. FAQ Sections (Required)

All posts must include a "Frequently Asked Questions" section with:

- **Minimum:** 8-10 questions
- **Must Cover:**
  - What is [platform/topic]?
  - How much does it cost?
  - What can it do?
  - How does it compare to alternatives?
  - What's the ROI?
  - How long to implement?
  - Security concerns
  - Training requirements
  - Best fit scenarios

**Format:**
```markdown
## Frequently Asked Questions

### What is [Topic]?

[Comprehensive 2-3 sentence answer with primary keyword and value proposition]

### How much does [Platform] cost?

[Specific pricing with ranges and factors, include key differentiators]
```

### 4. People Also Asked Section (Required)

All posts must include a "People Also Asked" section with:

- **Minimum:** 5 questions
- **Format:** Brief answers (1-2 sentences)
- **Purpose:** Long-tail keyword targeting and voice search optimization

**Format:**
```markdown
## People Also Asked

- **[Question]?** - [Brief, informative answer that includes relevant keywords]

- **[Question]?** - [Brief, informative answer that includes relevant keywords]
```

## Content Quality Standards

### Internal Linking Strategy

**Hub Posts (Tool Comparisons):**
- Link to 8-12 related spoke posts
- Link to implementation guides
- Link to ROI calculators
- Create natural, contextual links

**Spoke Posts (Individual Tool Guides):**
- Link to relevant hub posts (comparison guides)
- Link to implementation guides
- Link to related tools (competitors/alternatives)
- Minimum 5 internal links per post

### Academic Citations (Required)

All posts must include a References section with:

- **Minimum:** 5-8 citations
- **Sources Include:**
  - Industry surveys (ILTA, ABA, Bloomberg Law)
  - Third-party reviews (G2, Capterra, TrustRadius)
  - Industry publications (Legaltech News, Law.com)
  - Vendor documentation
  - Research reports

**Format:**
```markdown
## References

1. Organization. (Year). *Title*. Publisher. Retrieved from [URL]

2. Author. (Year). *Title*. Publication. Retrieved from [URL]
```

### Image Optimization

All posts must include:
- Hero image (1200x675)
- Featured image (400x300)
- Social sharing image (1200x630)
- Thumbnail (300x200)
- Descriptive alt text for all images
- Image names with keywords

## Hub and Spoke SEO Structure

### Hub Posts
- **Purpose:** Comprehensive tool comparisons
- **Examples:** AI Contract Tools Comparison, AI Legal Research Tools
- **SEO Focus:** High-traffic comparison keywords
- **Required:** 8-12 internal links to spoke posts

### Spoke Posts
- **Purpose:** Deep dives on individual tools
- **Examples:** Harvey AI Guide, Latch AI Guide
- **SEO Focus:** Long-tail, specific tool keywords
- **Required:** 5-8 internal links to hub posts and related content

## Content Enhancement Checklist

### Pre-Publication Requirements

- [ ] Complete SEO metadata (title, description, keywords)
- [ ] Image optimization (4 sizes + alt text)
- [ ] Internal linking (minimum 5 strategic links)
- [ ] FAQ section (8-10 questions)
- [ ] People Also Asked section (5 questions)
- [ ] Academic citations (5-8 references)
- [ ] Related posts specified
- [ ] Schema markup added
- [ ] Third-party reviews section (if applicable)

### Post-Publication

- [ ] Verify schema markup in Google Rich Results Test
- [ ] Test social sharing previews (LinkedIn, Twitter, Facebook)
- [ ] Submit updated sitemap
- [ ] Monitor initial indexing
- [ ] Track keyword rankings

## Success Metrics

### SEO Performance Targets

- **Traffic:** 100+ organic visits per month within 6 months
- **Rankings:** Top 10 for primary keyword within 3 months
- **Engagement:** Average time on page > 3 minutes
- **Conversion:** Lead generation from content

### Content Quality Targets

- **Word Count:** 2,500+ words for hub posts, 2,000+ for spoke posts
- **Reading Level:** Professional but accessible (grade 12-14)
- **Citations:** 5-8 authoritative sources
- **Internal Links:** 5-12 strategic links per post

---

*This specification ensures all content meets the highest SEO standards while providing exceptional value to legal professionals. Last updated: January 28, 2025*
