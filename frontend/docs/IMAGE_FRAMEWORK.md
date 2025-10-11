# Blog Post Image Framework

## Overview
Professional image generation system for Native Legal blog posts that maintains consistent branding and aesthetic with the site's dark theme.

## Design System

### Colors
- **Background**: Dark gradient (gray-900 to gray-800 to emerald-900)
- **Accent**: Emerald green (#10b981) for highlights and tech elements
- **Text**: White (#ffffff) for headlines, gray-300 (#d1d5db) for subtitles
- **Cards**: Gray-700 (#374151) with emerald accent border

### Visual Elements
- AI/Neural network representations
- Subtle tech patterns
- Professional gradients
- Clean typography
- Brand consistency

## Image Types Generated

### 1. Hero Images (1200x675px)
- **Usage**: Featured blog post headers (16:9 aspect ratio)
- **File**: `{slug}-hero-1200x675.svg`
- **Purpose**: Main visual impact, SEO optimization

### 2. Featured Images (400x300px)
- **Usage**: Blog post cards on listing pages (4:3 aspect ratio)
- **File**: `{slug}-featured-400x300.svg`
- **Purpose**: Preview thumbnails, grid layouts

### 3. Social Images (1200x630px)
- **Usage**: OpenGraph, Twitter cards, social sharing
- **File**: `{slug}-social-1200x630.svg`
- **Purpose**: Social media optimization

### 4. Thumbnail Images (300x200px)
- **Usage**: Small previews, related posts (3:2 aspect ratio)
- **File**: `{slug}-thumbnail-300x200.svg`
- **Purpose**: Compact displays, sidebars

## Usage

### Generate Single Post Images
```bash
node scripts/generate-blog-images.js "post-slug" "Post Title"
```

### Generate All Post Images
```bash
node scripts/generate-all-blog-images.js
```

### File Locations
All generated images are saved to `/public/images/` as SVG files.

### Integration
Images are already configured in the blog post frontmatter but currently not displayed (removed per requirements). To re-enable:

```markdown
---
heroImage: "/images/post-slug-hero-1200x675.svg"
featuredImage: "/images/post-slug-featured-400x300.svg"
socialImage: "/images/post-slug-social-1200x630.svg"
---
```

## Benefits

### ✅ SVG Format
- **Scalable**: Perfect quality at any size
- **Lightweight**: Small file sizes
- **Fast**: Quick loading times
- **Responsive**: Works on all devices

### ✅ Brand Consistency
- **Colors**: Matches site palette exactly
- **Typography**: Uses system fonts like the site
- **Style**: Professional, legal-tech aesthetic
- **Elements**: AI/tech motifs relevant to content

### ✅ SEO Optimized
- **Proper dimensions**: Optimized for each use case
- **Fast loading**: SVG efficiency
- **Alt-friendly**: Descriptive filenames
- **Social ready**: OpenGraph compliant

## Customization

Edit `/scripts/generate-blog-images.js` to:
- Modify color palette
- Adjust layouts
- Change tech elements
- Update typography
- Add new image types

## Current Status
- ❌ **Images not displayed** (per user requirements)
- ✅ **Framework ready** for future use
- ✅ **All images generated** for existing posts
- ✅ **Professional quality** matching site aesthetic