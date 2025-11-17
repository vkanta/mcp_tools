#!/bin/bash

# Test script for MariaDB MCP Server VS Code integration
# This simulates how VS Code will communicate with the MCP server

echo "🧪 Testing MariaDB MCP Server for VS Code Integration"
echo "=================================================="

# Set environment variables
export DB_HOST=127.0.0.1
export DB_PORT=3307
export DB_USER=testuser
export DB_PASSWORD=testpass
export DB_NAME=testdb
export APP_PORT=3005

cd /mnt/data/wspaces/mariaDB_MCP

echo "📍 Current directory: $(pwd)"
echo "🔧 Environment variables set:"
echo "   - DB_HOST: $DB_HOST"
echo "   - DB_PORT: $DB_PORT"
echo "   - DB_USER: $DB_USER"
echo "   - DB_NAME: $DB_NAME"
echo "   - APP_PORT: $APP_PORT"

echo ""
echo "🚀 Starting MCP server test..."
timeout 8s node dist/index.js 2>&1 | head -10

echo ""
echo "✅ Test completed!"
echo ""
echo "🔍 VS Code MCP Configuration:"
echo "File: ~/.config/Code/User/mcp.json"
echo "Server name: mariadb"
echo "Command: node /mnt/data/wspaces/mariaDB_MCP/dist/index.js"
echo ""
echo "📋 Available MCP Tools:"
echo "   - list_databases"
echo "   - list_tables" 
echo "   - describe_table"
echo "   - execute_query"
echo ""
echo "🎯 How to test in VS Code:"
echo "1. Restart VS Code"
echo "2. Open GitHub Copilot Chat"
echo "3. Ask: 'List all tables in the database'"
echo "4. Ask: 'Show me the campaigns table schema'"
echo "5. Ask: 'Execute a query to show active campaigns'"