#!/bin/bash

# MariaDB MCP Server - Setup Script
# This script sets up the MariaDB MCP Server with all dependencies

set -e

echo "🚀 MariaDB MCP Server Setup"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the mariaDB_MCP directory."
    exit 1
fi

echo "📦 Step 1: Installing Node.js dependencies..."
npm install

echo ""
echo "🔨 Step 2: Building TypeScript..."
npm run build

echo ""
echo "🐳 Step 3: Starting database services..."
if command -v docker-compose >/dev/null 2>&1; then
    echo "Using Docker Compose..."
    docker-compose up -d
elif command -v podman-compose >/dev/null 2>&1; then
    echo "Using Podman Compose..."
    podman-compose -f docker-compose.yml up -d
else
    echo "⚠️  Warning: Neither docker-compose nor podman-compose found."
    echo "   Please start MariaDB manually or install Docker/Podman."
fi

echo ""
echo "⏳ Step 4: Waiting for database to be ready..."
sleep 10

echo ""
echo "🗄️  Step 5: Testing database connection..."
if ./db-helper.sh status >/dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "⚠️  Database connection test failed. You may need to:"
    echo "   - Wait a bit longer for MariaDB to start"
    echo "   - Check docker/podman container status"
    echo "   - Verify .env configuration"
fi

echo ""
echo "🚀 Step 6: Starting MCP Server..."
echo "The MCP server will start on port 3004..."
echo ""
echo "📋 Setup Complete!"
echo ""
echo "Available commands:"
echo "  npm start                    # Start MCP server"
echo "  ./db-helper.sh status        # Check database status"
echo "  ./db-helper.sh tables        # List database tables"
echo "  curl localhost:3004/health   # Test MCP server health"
echo ""
echo "📖 See README.md for detailed documentation."
echo ""

# Optionally start the server
read -p "🤔 Would you like to start the MCP server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting MCP server..."
    npm start
else
    echo "✨ Setup complete! Run 'npm start' when you're ready to start the server."
fi