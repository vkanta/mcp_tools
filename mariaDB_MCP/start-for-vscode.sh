#!/bin/bash

# Start MariaDB MCP Server for VS Code MCP Integration
# This script ensures the database is running before starting the MCP server

echo "Starting MariaDB MCP Server for VS Code..."

# Check if Docker/Podman is available
if command -v docker &> /dev/null; then
    CONTAINER_CMD="docker"
elif command -v podman &> /dev/null; then
    CONTAINER_CMD="podman"
else
    echo "Error: Neither Docker nor Podman is available"
    exit 1
fi

# Change to the project directory
cd "$(dirname "$0")"

# Start the database containers if not running
echo "Checking database containers..."
if ! $CONTAINER_CMD ps | grep -q mariadb-mcp; then
    echo "Starting MariaDB container..."
    $CONTAINER_CMD compose up -d mariadb
    
    # Wait for MariaDB to be ready
    echo "Waiting for MariaDB to be ready..."
    sleep 10
    
    # Load sample data if needed
    if [ -f sample_data.sql ]; then
        echo "Loading sample data..."
        $CONTAINER_CMD exec mariadb-mcp-mariadb-1 mariadb -u root -ppassword ces_db < sample_data.sql 2>/dev/null || true
    fi
fi

echo "MariaDB MCP Server is ready for VS Code!"
echo "Database running on localhost:3307"
echo "You can now use the MariaDB MCP server in VS Code."