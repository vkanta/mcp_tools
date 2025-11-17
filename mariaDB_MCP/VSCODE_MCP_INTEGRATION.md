# VS Code MCP Integration for MariaDB

This document explains how the standalone MariaDB MCP server is configured for VS Code integration.

## Configuration

The MariaDB MCP server has been added to your VS Code MCP configuration at:
`~/.config/Code/User/mcp.json`

### Server Configuration
```json
{
  "servers": {
    "mariadb": {
      "command": "node",
      "args": [
        "/mnt/data/wspaces/mariaDB_MCP/dist/index.js"
      ],
      "env": {
        "DB_HOST": "127.0.0.1",
        "DB_PORT": "3307",
        "DB_USER": "testuser",
        "DB_PASSWORD": "testpass",
        "DB_NAME": "testdb",
        "APP_PORT": "3005"
      }
    }
  }
}
```

## Available MCP Tools

When the MariaDB MCP server is running, you'll have access to these tools in VS Code:

1. **list_databases** - List all available databases
2. **list_tables** - List tables in a specific database
3. **describe_table** - Get detailed schema information for a table
4. **execute_query** - Execute SQL queries against the database

## Prerequisites

Before using the MCP server in VS Code:

1. **Database Must Be Running**: Ensure the MariaDB container is running on port 3307
   ```bash
   # Check if database is running
   ss -tlnp | grep :3307
   ```

2. **Start Database** (if not running):
   ```bash
   cd /mnt/data/wspaces/mariaDB_MCP
   ./start-for-vscode.sh
   ```

## Usage in VS Code

1. **Restart VS Code** after updating the MCP configuration
2. **Open GitHub Copilot Chat**
3. **Use Database Commands**: Ask Copilot to help with database operations like:
   - "List all tables in the database"
   - "Show me the schema for the campaigns table"
   - "Execute a query to find all active campaigns"

## Database Access Details

- **Host**: 127.0.0.1
- **Port**: 3307
- **Database**: testdb
- **User**: testuser
- **Password**: testpass
- **MCP Server Port**: 3005

## Troubleshooting

### MCP Server Not Starting
- Check if database is running: `ss -tlnp | grep :3307`
- Check if port 3005 is available: `ss -tlnp | grep :3005`
- Restart VS Code after configuration changes

### Database Connection Issues
- Verify database container is running
- Check credentials in MCP configuration
- Test connection manually: `cd /mnt/data/wspaces/mariaDB_MCP && ./db-helper.sh`

### Port Conflicts
- If port 3005 is in use, change `APP_PORT` in the MCP configuration
- Restart VS Code after changing ports

## Alternative Access Methods

Besides the VS Code MCP integration, you can also access the database through:

1. **Web Interface**: http://localhost:3005 (when server is running)
2. **Command Line**: `./db-helper.sh` script
3. **Direct SQL**: MariaDB client on port 3307

## Sample Database Content

The database includes sample data:
- **campaigns** table with marketing campaign data
- **components** table with reusable component definitions
- **campaign_components** junction table linking campaigns to components

You can explore this data using the MCP tools in VS Code Copilot Chat.