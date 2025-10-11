/**
 * Generate images for all existing blog posts
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { generateBlogImages } = require('./generate-blog-images');

const postsDirectory = path.join(__dirname, '../content/posts');

// Get all MDX files
const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'));

console.log(`Found ${postFiles.length} blog posts. Generating images...`);

postFiles.forEach(file => {
  const fullPath = path.join(postsDirectory, file);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data } = matter(fileContents);

  const slug = data.slug || file.replace('.mdx', '');
  const title = data.title || 'Legal AI Guide';

  console.log(`\nGenerating images for: ${title}`);
  generateBlogImages(slug, title);
});

console.log('\n✅ All blog images generated successfully!');
console.log('\nImages are saved as SVG files in /public/images/');
console.log('They will automatically scale and maintain quality at any size.');
console.log('\nTo use images in your blog posts, reference them like:');
console.log('- Hero: /images/{slug}-hero-1200x675.svg');
console.log('- Featured: /images/{slug}-featured-400x300.svg');
console.log('- Social: /images/{slug}-social-1200x630.svg');
console.log('- Thumbnail: /images/{slug}-thumbnail-300x200.svg');