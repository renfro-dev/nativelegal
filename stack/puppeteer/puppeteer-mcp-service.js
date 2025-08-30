// Simple Puppeteer MCP Service for Legal Content Scraping
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

let browser = null;

// Initialize browser on startup
async function initBrowser() {
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-default-apps'
      ]
    });
    console.log('🚀 Puppeteer browser initialized');
  } catch (error) {
    console.error('❌ Failed to initialize browser:', error);
  }
}

// Scrape endpoint
app.post('/scrape', async (req, res) => {
  const {
    url,
    waitFor = 'networkidle0',
    timeout = 30000,
    extractText = true,
    removeElements = ['script', 'style', 'nav', 'footer', 'aside'],
    userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let page = null;
  
  try {
    console.log(`🔍 Scraping: ${url}`);
    
    if (!browser) {
      await initBrowser();
    }

    page = await browser.newPage();
    
    // Set user agent and viewport
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to page
    await page.goto(url, { 
      waitUntil: waitFor,
      timeout: timeout 
    });

    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);

    // Remove unwanted elements
    if (removeElements.length > 0) {
      await page.evaluate((elements) => {
        elements.forEach(selector => {
          const els = document.querySelectorAll(selector);
          els.forEach(el => el.remove());
        });
      }, removeElements);
    }

    let content = '';
    
    if (extractText) {
      // Extract clean text content
      content = await page.evaluate(() => {
        // Remove scripts, styles, etc.
        const unwanted = document.querySelectorAll('script, style, noscript, iframe');
        unwanted.forEach(el => el.remove());
        
        // Get main content areas
        const contentSelectors = [
          'main', 
          'article', 
          '.content', 
          '.main-content',
          '.post-content',
          '.entry-content',
          '#content'
        ];
        
        let mainContent = '';
        
        // Try to find main content area
        for (const selector of contentSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            mainContent = element.innerText || element.textContent || '';
            if (mainContent.length > 500) break;
          }
        }
        
        // Fallback to body if no main content found
        if (mainContent.length < 500) {
          mainContent = document.body.innerText || document.body.textContent || '';
        }
        
        // Clean up text
        return mainContent
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 50000); // Limit size
      });
    }

    // Get page metadata
    const metadata = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      url: window.location.href
    }));

    console.log(`✅ Successfully scraped ${url} (${content.length} chars)`);

    res.json({
      success: true,
      content,
      metadata,
      contentLength: content.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error);
    res.status(500).json({
      error: 'Scraping failed',
      details: error.message,
      url
    });
  } finally {
    if (page) {
      await page.close();
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    browser: browser ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down Puppeteer MCP service...');
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

// Start server
app.listen(port, async () => {
  console.log(`🏄‍♂️ Puppeteer MCP service running on port ${port}`);
  await initBrowser();
});

module.exports = app;
