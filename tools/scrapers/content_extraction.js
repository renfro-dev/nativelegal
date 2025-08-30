// Extract and analyze the best content from our harvest
const fs = require('fs');

const harvestData = JSON.parse(fs.readFileSync('harvest_results.json', 'utf8'));
const stealthData = JSON.parse(fs.readFileSync('stealth_results.json', 'utf8'));

// Filter for high-quality content
const qualityContent = harvestData.results
  .filter(r => r.success && r.content_length > 1000 && r.has_expected_content)
  .sort((a, b) => b.quality_score - a.quality_score);

console.log('🎯 HIGH-QUALITY CONTENT SOURCES:');
qualityContent.forEach((source, idx) => {
  console.log(`${idx + 1}. ${source.domain} - ${source.content_length} chars (Quality: ${source.quality_score}/10)`);
  console.log(`   Category: ${source.category}`);
  console.log(`   URL: ${source.url}`);
});

// Extract key insights for each content category
const contentByCategory = {
  ai_readiness: qualityContent.filter(s => s.category === 'ai_readiness'),
  legal_tech: qualityContent.filter(s => s.category === 'legal_tech'),
  attorney_workflows_ai: qualityContent.filter(s => s.category === 'attorney_workflows_ai'),
  revops_legal: qualityContent.filter(s => s.category === 'revops_legal')
};

console.log('\n📊 CONTENT BY CATEGORY:');
Object.entries(contentByCategory).forEach(([category, sources]) => {
  const totalChars = sources.reduce((sum, s) => sum + s.content_length, 0);
  console.log(`${category}: ${sources.length} sources, ${totalChars} chars`);
});

// Save extracted insights
const contentInsights = {
  extracted_timestamp: new Date().toISOString(),
  quality_sources: qualityContent.length,
  total_quality_chars: qualityContent.reduce((sum, s) => sum + s.content_length, 0),
  category_breakdown: contentByCategory,
  best_sources: qualityContent.slice(0, 5).map(s => ({
    domain: s.domain,
    category: s.category, 
    content_length: s.content_length,
    quality_score: s.quality_score,
    title: s.title,
    url: s.url
  }))
};

fs.writeFileSync('content_insights.json', JSON.stringify(contentInsights, null, 2));
console.log('\n💾 Content insights saved to content_insights.json');
