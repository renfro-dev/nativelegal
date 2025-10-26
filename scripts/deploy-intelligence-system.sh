#!/bin/bash

# Deploy Legal Tech Intelligence System
# This script helps deploy the database migration and Edge Function

set -e

echo "🚀 Legal Tech Intelligence System Deployment"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "stack/supabase/migrations/008_create_legal_tech_intelligence.sql" ]; then
    echo "❌ Error: Migration file not found"
    echo "💡 Run this from the project root directory"
    exit 1
fi

echo "📋 Step 1: Open Supabase Dashboard"
echo "   URL: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/sql/new"
echo ""
echo "   Then copy and paste the contents of:"
echo "   stack/supabase/migrations/008_create_legal_tech_intelligence.sql"
echo ""
read -p "✅ Press enter once you've run the SQL migration..."

echo ""
echo "📋 Step 2: Verify Tables Created"
echo "   Go to: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/editor"
echo ""
echo "   You should see these tables:"
echo "   - legal_tech_intelligence"
echo "   - intelligence_summary"  
echo "   - tracked_vendors (with 10 vendors)"
echo ""
read -p "✅ Press enter once verified..."

echo ""
echo "📋 Step 3: Deploy Edge Function via Dashboard"
echo "   Go to: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/functions"
echo ""
echo "   Steps:"
echo "   1. Click 'Create a new function'"
echo "   2. Name it: reddit_intelligence"
echo "   3. Copy contents from: stack/supabase/functions/reddit_intelligence/index.ts"
echo "   4. Paste into the editor"
echo "   5. Click 'Deploy'"
echo ""
read -p "✅ Press enter once the function is deployed..."

echo ""
echo "📋 Step 4: Test the System"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating template..."
    cat > .env << 'EOF'
SUPABASE_URL=https://gmcdnokfogtryliyhcoi.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Get from: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/settings/api
EOF
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Update .env with your Supabase credentials:"
    echo "   1. Go to: https://supabase.com/dashboard/project/gmcdnokfogtryliyhcoi/settings/api"
    echo "   2. Copy the 'anon' key"
    echo "   3. Update SUPABASE_ANON_KEY in .env file"
    echo ""
    read -p "Press enter once .env is updated..."
fi

echo ""
echo "🧪 Testing Reddit Intelligence System..."
echo ""

node scripts/test-reddit-intelligence.js

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📊 Next Steps:"
echo "   1. Check Supabase dashboard → Table Editor → legal_tech_intelligence"
echo "   2. View collected data and insights"
echo "   3. Set up daily cron job for automatic collection"
echo ""
echo "📚 Documentation: docs/deploy-intelligence-system.md"
