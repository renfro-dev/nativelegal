#!/bin/bash

# n8n Quick Start Script for Native Legal

echo "🚀 Starting n8n for Native Legal..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p data

# Start n8n using Docker Compose
echo "Starting n8n container..."
docker-compose up -d

# Wait for n8n to be ready
echo "Waiting for n8n to start..."
sleep 5

# Check if n8n is running
if docker ps | grep -q nativelegal-n8n; then
    echo ""
    echo "✅ n8n is running!"
    echo ""
    echo "📊 Access n8n at: http://localhost:5678"
    echo ""
    echo "🔑 Default credentials:"
    echo "   Username: admin"
    echo "   Password: nativelegal2025"
    echo ""
    echo "📚 Next steps:"
    echo "   1. Open http://localhost:5678"
    echo "   2. Set up credentials (LinkedIn, Twitter, OpenAI, Supabase)"
    echo "   3. Import workflows from ./workflows/"
    echo "   4. Run 'Content Repurposing Pipeline' on your first blog post"
    echo ""
    echo "📖 Full documentation: ./README.md"
    echo ""
else
    echo "❌ Failed to start n8n. Check Docker logs:"
    echo "   docker logs nativelegal-n8n"
    exit 1
fi

