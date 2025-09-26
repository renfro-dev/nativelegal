# Agent Workflow Reference Guide

## Overview
This document provides a comprehensive reference for all agents in the Native Legal content creation workflow, their specific actions, and how they work together to produce high-quality, SEO-optimized content.

## Content Creation Workflow

### 1. **Strategist** 🎯
**Purpose:** Turn topic_map + metrics into weekly plan with internal-link plan & SEO meta

**Actions:**
- Analyze topic map and performance metrics
- Create weekly content plan (pillars/spokes)
- Plan internal linking strategy
- Generate SEO metadata (intent, serpType, competitors, targetKeywords)
- Define content themes and target audiences

**Output:** `posts` in `idea/outline` status with `seo_meta` populated

---

### 2. **Researcher** 🔍
**Purpose:** Crawl trusted domains, dedupe, filter by freshness/trust, embed

**Actions:**
- Crawl trusted legal domains (ABA, CA courts, vendors, analysts)
- Deduplicate and filter content by freshness and trustworthiness
- Create embeddings for content discovery
- Gather high-authority facts for law-firm AI readiness, RevOps, workflows
- Prefer primary sources and attach access dates
- Update `state.json.evidence` with findings

**Output:** `sources` rows + `topic_map` (links, dates)

---

### 3. **Outliner** 📝
**Purpose:** Create H2/H3 outline, schema.org FAQ (≥4), internal/external link plan, compliance placeholders

**Actions:**
- Generate detailed H2/H3 content outline
- Create schema.org FAQ structure (minimum 4 questions)
- Plan internal and external linking strategy
- Add compliance placeholders for legal disclaimers
- Structure content for optimal SEO and readability

**Output:** `posts.status=outline` with MDX scaffold

---

### 4. **Writer** ✍️
**Purpose:** Produce MDX with footnoted citations, legal disclaimer block, and CTA

**Actions:**
- Write complete article content in MDX format
- Add footnoted citations with access dates
- Include legal disclaimer blocks where appropriate
- Add relevant CTAs for engagement
- Structure content for automatic TOC generation
- Write in clear, professional language
- Maintain SEO-friendly structure

**Output:** `posts.status=draft` with complete `body_mdx`

---

### 5. **Editor** ✏️
**Purpose:** Fact-check, ensure nationwide relevance, tighten titles/meta, verify disclaimers/CTAs, remove fluff

**Actions:**
- **Content Quality:** Fact-check, tone, legal compliance
- **SEO Optimization:** Refine titles, meta descriptions, keyword integration
- **Legal Compliance:** Verify disclaimers, citations, regulatory compliance
- **Visual Preparation:** Ensure content structure supports visual integration
- **Image SEO Optimization (PRIMARY):**
  - Generate keyword-rich file names
  - Write SEO-optimized alt text with target keywords
  - Create compelling, keyword-rich captions
  - Develop structured data for image SEO (ImageObject schema)
  - Optimize Open Graph and Twitter Card metadata
  - Ensure all image metadata aligns with target keywords

**Output:** `posts.status=scheduled` (ready for Visual Designer)

---

### 6. **Visual Designer** 🎨
**Purpose:** Generate professional, contextually-relevant images using AI

**Actions:**
- Generate 4 image types per post (hero, featured, social, thumbnail) using Gemini API
- Review images for professional appearance and legal appropriateness
- Ensure images match article tone, category, and target audience
- Verify image formats, sizes, and optimization for web delivery
- Maintain brand consistency across all generated content
- Focus on creating stunning, professional visuals

**Quality Gates:**
- Professional standards suitable for legal professionals
- Content relevance and brand alignment
- Legal appropriateness (no faces, copyrighted content)
- Technical quality and optimization

**Output:** 
- `posts` with populated image URLs
- `posts.images_generated=true`
- High-quality visuals ready for SEO optimization

---

### 7. **Reviewer** 🔍
**Purpose:** Quality gate vs QA criteria; approve only when Definition of Done is met

**Actions:**
- Check content against `evaluation/qa_criteria.md` and PRD/Blueprint
- **Critical Requirements:**
  - No markdown symbols visible in rendered content
  - Single, functional table of contents (no duplicates)
  - All text is black and highly readable
  - Headings have proper IDs for navigation
  - No Next.js client component errors
  - Smooth scrolling TOC links work
- **Content Quality:**
  - Clean, professional appearance
  - Proper heading hierarchy (H1-H6)
  - Typography sizing and spacing consistent
  - Responsive text scaling applied
  - SEO-friendly structure preserved
- **Technical Validation:**
  - Client components used for interactive elements
  - No server component event handler errors
  - Proper ID generation for all headings
  - Table of contents excludes meta headings

**Output:** Approval for publishing or rejection with feedback

---

### 8. **Publisher** 🚀
**Purpose:** Publish complete content with images via static MDX, update sitemap/RSS, verify assets

**Actions:**
- **Content Publishing:** Deploy MDX content to production
- **Image Integration:** Ensure all images are properly embedded and accessible
- **Asset Verification:** Confirm all image URLs are working and optimized
- **SEO Assets:** Update sitemap.xml and RSS feed with image metadata
- **Social Optimization:** Verify social sharing images are properly configured
- **Performance Check:** Ensure images don't negatively impact page load times
- **Image SEO Implementation:**
  - Implement ImageObject structured data for each image
  - Add images to XML sitemap with proper metadata
  - Test Facebook/LinkedIn sharing previews
  - Verify Twitter sharing displays correctly
  - Ensure all images have descriptive, keyword-rich alt text
  - Confirm SEO-optimized file names
  - Implement image lazy loading for performance
- **Blog Post Formatting (MANDATORY):**
  - Apply all formatting rules from `blog-formatter.md`
  - Remove markdown symbols and artifacts
  - Generate functional table of contents
  - Ensure proper heading IDs for navigation
  - Verify no Next.js client component errors
  - Test TOC links and smooth scrolling
  - Confirm black, readable text throughout

**Quality Gates:**
- All generated images accessible via CDN
- Image loading times <2 seconds
- Social sharing previews display correctly
- Alt text present for accessibility
- No broken image links in published content

**Output:** `posts.status=published` with `published_at`, verified image URLs, complete asset manifest

---

### 9. **Indexer** 🔍
**Purpose:** Ping search engines, confirm GSC submission, resubmit sitemap on changes

**Actions:**
- Ping search engines about new content
- Confirm Google Search Console submission
- Resubmit sitemap when changes are made
- Monitor indexing status

**Output:** Log entry with submission results

---

### 10. **Analyst** 📊
**Purpose:** Pull GA4/GSC data, join into post_metrics, compute weekly deltas

**Actions:**
- Pull Google Analytics 4 and Google Search Console data
- Join data into `post_metrics` table
- Compute weekly performance deltas
- Highlight wins and gaps in performance
- Generate trend analysis

**Output:** `post_metrics` rows + short trend notes

---

### 11. **Reflector** 🤔
**Purpose:** Propose 5 actions to improve CTR/conversions

**Actions:**
- Analyze performance data and user behavior
- Propose 5 specific actions to improve click-through rates and conversions
- Prefer edits to existing pages when feasible
- Focus on data-driven optimization opportunities

**Output:** `reflections` row + enqueue actions (jobs) for Strategist

---

### 12. **Supervisor** 👑
**Purpose:** Own plan/sequence/quality; maintain state; enforce gates

**Actions:**
- Maintain overall workflow state in `state.json`
- Enforce quality gates between agent handoffs
- Choose smallest, highest-value next steps
- Assign single owner for each task
- Require Reviewer approval for destructive operations/publishing
- Update `decisions.md` with rationale for major decisions

**Inputs:** `/context/docs/*.md`, `/context/orchestration/state.json`, `/context/agents/*`

**Output:** Updated `state.json` (next_steps/progress) and `decisions.md` (rationale)

---

## Workflow States

| State | Description | Next Agent |
|-------|-------------|------------|
| `idea` | Initial concept from Strategist | Researcher |
| `outline` | Structured outline from Outliner | Writer |
| `draft` | Complete content from Writer | Editor |
| `scheduled` | Ready for images from Editor | Visual Designer |
| `visual_approved` | Images approved from Visual Designer | Publisher |
| `published` | Live content from Publisher | Indexer |

## Quality Gates

1. **Content Quality:** Fact-checked, legally compliant, professional tone
2. **SEO Optimization:** Proper metadata, keyword integration, internal linking
3. **Visual Excellence:** Professional images, proper optimization, brand consistency
4. **Technical Quality:** Clean formatting, functional navigation, responsive design
5. **Performance:** Fast loading, accessible, mobile-friendly
6. **Legal Compliance:** Proper disclaimers, citations, regulatory adherence

## Key Files Referenced

- `context/agents/blog-formatter.md` - Complete formatting rules
- `context/agents/blog-formatting-automation.md` - Implementation code examples
- `context/evaluation/qa_criteria.md` - Quality assurance criteria
- `context/docs/PRD.md` - Product requirements
- `context/docs/Blueprint.md` - Technical architecture
- `context/orchestration/state.json` - Workflow state management
- `context/orchestration/decisions.md` - Decision rationale

## Agent Communication

Agents communicate through:
- **Database state changes** (post status updates)
- **State.json updates** (workflow progress)
- **Decisions.md entries** (rationale and choices)
- **Log files** (detailed action records)
- **Quality gate approvals** (Reviewer validation)

This workflow ensures consistent, high-quality, SEO-optimized content that meets professional standards for legal industry audiences.
