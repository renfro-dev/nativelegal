# 🚀 SEO Machine - Quick Reference

## 📁 Where to Find Everything

### 🔧 **Technology Stack** (`/stack/`)
```bash
stack/
├── ga4/           # Google Analytics integration
├── gemini/        # AI image & content generation  
├── puppeteer/     # Web scraping & automation
└── supabase/      # Database & backend functions
```

### 🛠️ **Tools & Utilities** (`/tools/`)
```bash
tools/
├── automation/    # Workflow triggers & scheduling
├── scrapers/      # Content extraction & harvesting
└── analytics/     # Performance tracking
```

### 🧪 **Testing** (`/tests/`)
```bash
tests/
├── unit/          # Component tests
├── integration/   # Cross-system tests  
└── e2e/           # End-to-end workflows
```

### 📖 **Documentation** (`/docs/`)
```bash
docs/
├── setup/         # Installation & configuration
├── guides/        # How-to guides & tutorials
└── specs/         # Technical specifications
```

## 🎯 **Common Tasks**

### Start Development
```bash
cd frontend && npm run dev
```

### Run Tests
```bash
# Unit tests
node tests/unit/test-working-openai.js

# Integration tests  
node tests/integration/test-ga4-properties.js

# Check automation
node scripts/check-automation-status.js
```

### Deploy Functions
```bash
cd stack/supabase
supabase functions deploy generate_images
```

### Generate Images
```bash
node tests/integration/test-gemini-imagen.js
```

### Check Analytics
```bash
node stack/ga4/analytics-demo.js
```

## 📊 **Data & Configs**

### Configuration Files
- `data/configs/` - All JSON configs
- `stack/supabase/config.toml` - Supabase settings
- `frontend/package.json` - Frontend dependencies

### Generated Data
- `data/results/` - Processing outputs
- `data/sources/` - Source definitions
- `output/seo/` - SEO files (sitemap, RSS)

## 🏄‍♂️ **Your Organized SEO Machine!**

Everything is now:
- ✅ **Logically organized** by function
- ✅ **Easy to navigate** with clear folder names  
- ✅ **Scalable** for future additions
- ✅ **Maintainable** with separated concerns

Ready to surf the waves of organized development! 🤖✨
