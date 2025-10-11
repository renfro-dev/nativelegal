/**
 * Blog Image Generator
 * Creates professional images that match Native Legal's dark theme aesthetic
 */

const fs = require('fs');
const path = require('path');

// Site color palette
const colors = {
  background: '#111827',     // gray-900
  backgroundAlt: '#1f2937',  // gray-800
  card: '#374151',           // gray-700
  accent: '#10b981',         // emerald-500
  accentLight: '#6ee7b7',    // emerald-300
  text: '#ffffff',           // white
  textSecondary: '#d1d5db',  // gray-300
};

// Image templates
const templates = {
  hero: {
    width: 1200,
    height: 675,
    aspectRatio: '16:9'
  },
  featured: {
    width: 400,
    height: 300,
    aspectRatio: '4:3'
  },
  social: {
    width: 1200,
    height: 630,
    aspectRatio: 'OpenGraph'
  },
  thumbnail: {
    width: 300,
    height: 200,
    aspectRatio: '3:2'
  }
};

// SVG template function
function createBlogImageSVG(title, type = 'hero') {
  const template = templates[type];
  const { width, height } = template;

  // Create gradient background
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.background};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${colors.backgroundAlt};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#064e3b;stop-opacity:1" />
      </linearGradient>

      <!-- Tech pattern -->
      <pattern id="tech-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="25" cy="25" r="2" fill="${colors.accent}" opacity="0.1"/>
        <circle cx="75" cy="75" r="2" fill="${colors.accentLight}" opacity="0.1"/>
        <line x1="25" y1="25" x2="75" y2="75" stroke="${colors.accent}" stroke-width="1" opacity="0.05"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#${gradientId})"/>
    <rect width="100%" height="100%" fill="url(#tech-pattern)"/>

    <!-- Main content area -->
    <rect x="80" y="${height * 0.25}" width="${width - 160}" height="${height * 0.5}"
          fill="${colors.card}" rx="12" opacity="0.9"/>

    <!-- Accent elements -->
    <rect x="80" y="${height * 0.25}" width="8" height="${height * 0.5}"
          fill="${colors.accent}" rx="4"/>

    <!-- AI/Tech icon representation -->
    <g transform="translate(${width - 150}, ${height * 0.3})">
      <circle cx="40" cy="40" r="30" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.6"/>
      <circle cx="40" cy="40" r="20" fill="none" stroke="${colors.accentLight}" stroke-width="2" opacity="0.4"/>
      <circle cx="40" cy="40" r="10" fill="${colors.accent}" opacity="0.3"/>

      <!-- Neural network nodes -->
      <circle cx="20" cy="25" r="3" fill="${colors.accent}"/>
      <circle cx="60" cy="25" r="3" fill="${colors.accent}"/>
      <circle cx="20" cy="55" r="3" fill="${colors.accent}"/>
      <circle cx="60" cy="55" r="3" fill="${colors.accent}"/>

      <!-- Connections -->
      <line x1="20" y1="25" x2="40" y2="40" stroke="${colors.accentLight}" stroke-width="1" opacity="0.6"/>
      <line x1="60" y1="25" x2="40" y2="40" stroke="${colors.accentLight}" stroke-width="1" opacity="0.6"/>
      <line x1="20" y1="55" x2="40" y2="40" stroke="${colors.accentLight}" stroke-width="1" opacity="0.6"/>
      <line x1="60" y1="55" x2="40" y2="40" stroke="${colors.accentLight}" stroke-width="1" opacity="0.6"/>
    </g>

    <!-- Title text -->
    <text x="120" y="${height * 0.45}"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="${Math.min(width / 25, 48)}"
          font-weight="700"
          fill="${colors.text}">
      ${title.split(' ').slice(0, 6).join(' ')}
    </text>

    <!-- Subtitle -->
    <text x="120" y="${height * 0.55}"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="${Math.min(width / 40, 24)}"
          font-weight="500"
          fill="${colors.textSecondary}">
      Native Legal Implementation Guide
    </text>

    <!-- Brand accent -->
    <text x="120" y="${height * 0.65}"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="${Math.min(width / 50, 18)}"
          font-weight="600"
          fill="${colors.accent}">
      NATIVE LEGAL
    </text>
  </svg>`;
}

// Function to generate images for a blog post
function generateBlogImages(postSlug, postTitle) {
  const imageDir = path.join(__dirname, '../public/images');

  // Ensure images directory exists
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  // Generate all image types
  Object.keys(templates).forEach(type => {
    const svg = createBlogImageSVG(postTitle, type);
    const filename = `${postSlug}-${type}-${templates[type].width}x${templates[type].height}.svg`;
    const filepath = path.join(imageDir, filename);

    fs.writeFileSync(filepath, svg);
    console.log(`Generated: ${filename}`);
  });
}

// Export for use
module.exports = { generateBlogImages, createBlogImageSVG };

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node generate-blog-images.js <slug> <title>');
    console.log('Example: node generate-blog-images.js "ai-readiness-2025" "AI Readiness Assessment for Law Firms"');
    process.exit(1);
  }

  const [slug, title] = args;
  generateBlogImages(slug, title);
}