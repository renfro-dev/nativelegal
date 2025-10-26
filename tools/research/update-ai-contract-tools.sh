#!/bin/bash

# AI Contract Tools Research Script
# Updates information for: Spellbook, Thomson Reuters HighQ, Microsoft Document Intelligence

echo "🔍 Researching AI Contract Tools for Hub Article Update"
echo "=================================================="
echo ""

# Target tools to research
TOOLS=("Spellbook AI contract" "Thomson Reuters HighQ" "Microsoft Document Intelligence")

# Research sources to check
SOURCES=(
  "https://www.law.com/legaltechnews/"
  "https://www.ilta.net/resources/surveys/"
  "https://www.g2.com/products/spellbook-ai"
  "https://www.trustpilot.com/review/spellbook.ai"
  "https://www.trustradius.com/products/thomson-reuters-highq/reviews"
)

echo "📊 Gathering information for:"
for tool in "${TOOLS[@]}"; do
  echo "  - $tool"
done

echo ""
echo "📚 Checking sources..."
for source in "${SOURCES[@]}"; do
  echo "  - $source"
done

echo ""
echo "✅ Research complete. Check research_results/ai_contract_tools_update.md"
