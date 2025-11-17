# MariaDB MCP Server - Standalone Project# MariaDB / MySQL Database Access MCP Server



## 🎯 OverviewThis MCP server provides access to MariaDB / MySQL databases.



This is a standalone MariaDB Model Context Protocol (MCP) server that provides database access capabilities for AI assistants and applications. Originally developed as part of the CES Web Platform, it has been extracted into a reusable, independent project.It allows you to:

- List available databases

## 🏗️ Architecture- List tables in a database

- Describe table schemas

The MariaDB MCP Server provides:- Execute SQL queries

- **HTTP/SSE MCP Server** - Model Context Protocol over HTTP with Server-Sent Events

- **Database Tools** - Direct database access utilities<a href="https://glama.ai/mcp/servers/@bretoreta/mariadb-mcp-server">

- **Web Interface** - Browser-based database inspector  <img width="380" height="200" src="https://glama.ai/mcp/servers/@bretoreta/mariadb-mcp-server/badge" alt="MariaDB Server MCP server" />

- **Container Support** - Docker/Podman integration for MariaDB and Keycloak</a>



## 📁 Project Structure## Security Features

- **Read-only access Default**: SELECT, SHOW, DESCRIBE, and EXPLAIN

```- **Query validation**: Prevents SQL injection and blocks any data modification attempts

mariaDB_MCP/- **Query timeout**: Prevents long-running queries from consuming resources

├── src/                      # TypeScript source code- **Row limit**: Prevents excessive data return

│   ├── index.ts             # Main MCP server implementation

│   ├── connection.ts        # Database connection management## Installation

│   ├── types.ts             # Type definitions

│   └── validators.ts        # Input validation### Option 1: Build from Source

├── dist/                    # Compiled JavaScript```bash

├── package.json             # Node.js dependencies# Clone the repository

├── tsconfig.json           # TypeScript configurationgit clone https://github.com/bretoreta/mariadb-mcp-server.git

├── .env                    # Environment variablescd mariadb-mcp-server

├── mcp-settings-example.json # MCP configuration template

├── db-helper.sh            # Database utility script# Install dependencies and build

├── database-inspector.html # Web database interfacepnpm install

├── docker-compose.yml      # Container orchestrationpnpm run build

├── podman-compose/```

│   └── keycloak-realm.json # Keycloak authentication realm

└── README.md              # This file### 2. Configure environment variables

```The server requires the following environment variables:



## 🚀 Quick Start- MARIADB_HOST: Database server hostname

- MARIADB_PORT: Database server port (default: 3306)

### 1. Install Dependencies- MARIADB_USER: Database username

```bash- MARIADB_PASSWORD: Database password

npm install- MARIADB_DATABASE: Default database name (optional)

```- MARIADB_ALLOW_INSERT: false

- MARIADB_ALLOW_UPDATE: false

### 2. Build the Project- MARIADB_ALLOW_DELETE: false

```bash- MARIADB_TIMEOUT_MS: 10000

npm run build- MARIADB_ROW_LIMIT: 1000

```



### 3. Start Database Services### 3. Add to MCP settings

```bashAdd the following configuration to your MCP settings file:

# Using Docker Compose

docker-compose up -dIf you built from source:

```json

# Or using Podman Compose{

podman-compose -f docker-compose.yml up -d  "mcpServers": {

```    "mariadb": {

      "command": "node",

### 4. Start MCP Server      "args": ["/path/to/mariadb-mcp-server/dist/index.js"],

```bash      "env": {

# Default port 3001        "MARIADB_HOST": "your-host",

npm start        "MARIADB_PORT": "3306",

        "MARIADB_USER": "your-user",

# Custom port        "MARIADB_PASSWORD": "your-password",

APP_PORT=3004 npm start        "MARIADB_DATABASE": "your-default-database",

```        "MARIADB_ALLOW_INSERT": "false",

        "MARIADB_ALLOW_UPDATE": "false",

### 5. Verify Installation        "MARIADB_ALLOW_DELETE": "false",

```bash        "MARIADB_TIMEOUT_MS": "10000",

# Test database connection        "MARIADB_ROW_LIMIT": "1000",

./db-helper.sh status      },

      "disabled": false,

# Test MCP server health      "autoApprove": []

curl http://localhost:3004/health    }

  }

# Show database tables}

./db-helper.sh tables```

```

## Available Tools

## 🔧 Configuration

### list_databases

### Environment Variables (.env)Lists all accessible databases on the MariaDB / MySQL server.

```properties**Parameters**: None

# Database Configuration

MARIADB_HOST=127.0.0.1**Example**:

MARIADB_PORT=3307```json

MARIADB_USER=testuser{

MARIADB_PASSWORD=testpass  "jsonrpc": "2.0",

MARIADB_DATABASE=testdb  "id": 1,

  "method": "tools/call",

# Security Settings  "params": {

MARIADB_ALLOW_INSERT=false    "sessionId": "session_id from /sse call",

MARIADB_ALLOW_UPDATE=false    "name": "list_databases"

MARIADB_ALLOW_DELETE=false  }

}

# Performance Settings```

MARIADB_TIMEOUT_MS=10000

MARIADB_ROW_LIMIT=1000### list_tables

Lists all tables in a specified database.

# Server Configuration

APP_PORT=3004**Parameters**:

APP_HOSTNAME=localhost- `database` (optional): Database name (uses default if not specified)

```

**Example**:

### Docker Services```json

- **MariaDB**: Port 3307 (mapped from container port 3306){

- **Keycloak**: Port 8081 (for authentication)  "jsonrpc": "2.0",

- **MCP Server**: Port 3004 (configurable)  "id": 1,

  "method": "tools/call",

## 📊 Database Schema  "params": {

    "sessionId": "session_id from /sse call",

The project includes sample tables for demonstration:    "name": "list_tables",

    "database": "my_database_name"

### Tables  }

- **`campaigns`** - Campaign management with status tracking}

- **`components`** - Component definitions with versioning```

- **`campaign_components`** - Many-to-many relationships

### describe_table

### Sample DataShows the schema for a specific table.

- 3 sample campaigns (draft, active, completed)

- 4 sample components (shadow, production, test types)**Parameters**:

- 7 relationship mappings- `database` (optional): Database name (uses default if not specified)

- `table` (required): Table name

## 🛠️ Available Tools

**Example**:

### 1. Database Helper Script```json

```bash{

./db-helper.sh [command]  "jsonrpc": "2.0",

  "id": 1,

# Commands:  "method": "tools/call",

./db-helper.sh tables           # List all tables  "params": {

./db-helper.sh campaigns        # Show campaigns    "sessionId": "session_id from /sse call",

./db-helper.sh components       # Show components    "name": "describe_table",

./db-helper.sh relationships    # Show relationships    "database": "my_database_name",

./db-helper.sh query "SQL"      # Execute custom SQL    "table": "my_table_name"

./db-helper.sh describe TABLE   # Show table structure  }

./db-helper.sh interactive      # Start interactive session}

./db-helper.sh backup [file]    # Create backup```

./db-helper.sh status           # Connection status

```### execute_query

Executes a SQL query.

### 2. Web Database Inspector

Open `database-inspector.html` in a browser for a graphical interface to:**Parameters**:

- Execute SQL queries- `query` (required): SQL query

- Browse table data- `database` (optional): Database name (uses default if not specified)

- View relationships

- Quick query buttons**Example**:

```json

### 3. MCP Server Endpoints{

- **Health Check**: `GET /health`  "jsonrpc": "2.0",

- **SSE Endpoint**: `POST /sse` (for MCP clients)  "id": 1,

- **Messages**: `POST /messages` (for MCP communication)  "method": "tools/call",

  "params": {

### 4. MCP Tools Available    "sessionId": "session_id from /sse call",

- `list_databases` - Show all databases    "name": "execute_query",

- `list_tables` - Show tables in a database    "query": "SELECT * FROM my_table LIMIT 10"

- `describe_table` - Show table schema  }

- `execute_query` - Run arbitrary SQL queries}

```

## 🔌 Integration Options

## Testing

### VS Code MCP IntegrationThe server automatically tests MariaDB to verify functionality with your MariaDB setup:

This server is designed for HTTP/SSE communication, not stdio. For VS Code integration, use it as a background service:



1. **VS Code Task** (tasks.json):## Troubleshooting

```jsonIf you encounter issues:

{

  "label": "Start MariaDB MCP Server",1. Check the server logs for error messages

  "type": "shell",2. Verify your MariaDB credentials and connection details

  "command": "node dist/index.js",3. Ensure your MariaDB user has appropriate permissions

  "options": {4. Check that your query is read-only and properly formatted

    "cwd": "${workspaceFolder}/path/to/mariadb-mcp",

    "env": { "APP_PORT": "3004" }

  },**Inspiration**

  "isBackground": true,**https://github.com/rjsalgado/mariadb-mcp-server**

  "runOptions": { "runOn": "folderOpen" }

}## License

```

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
2. **Direct HTTP Access**:
```bash
# Health check
curl http://localhost:3004/health

# Use database tools
./db-helper.sh campaigns
```

### External Applications
Applications can integrate via:
- **HTTP API** - Direct REST-like access
- **SSE Streaming** - Real-time MCP communication
- **Database Tools** - Command-line utilities

## 🔒 Security

### Database Permissions
- **Read-Only by Default** - INSERT/UPDATE/DELETE disabled
- **Configurable Access** - Can be enabled via environment variables
- **Connection Limits** - Timeout and row limit controls

### Authentication
- **Keycloak Integration** - OAuth/OIDC authentication available
- **Environment Variables** - Sensitive data in .env file
- **Container Isolation** - Services run in isolated containers

## 📈 Performance

### Optimizations
- **Connection Pooling** - Efficient database connections
- **Row Limits** - Prevent large result sets
- **Timeout Controls** - Prevent hanging queries
- **Background Processing** - Non-blocking operations

### Monitoring
- **Health Endpoints** - Service status monitoring
- **Database Status** - Connection and query monitoring
- **Container Logs** - Docker/Podman logging

## 🧪 Development

### Building
```bash
npm run build        # Compile TypeScript
npm run watch        # Watch mode for development
npm run prepare      # Build and set permissions
```

### Testing
```bash
# Test database connection
./db-helper.sh status

# Test MCP server
curl http://localhost:3004/health

# Test sample queries
./db-helper.sh campaigns
./db-helper.sh components
```

### Debugging
```bash
# View server logs
node dist/index.js

# Interactive database session
./db-helper.sh interactive

# Check container status
docker-compose ps
# or
podman ps
```

## 📦 Dependencies

### Runtime Dependencies
- **@modelcontextprotocol/sdk** - MCP protocol implementation
- **@hono/node-server** - HTTP server framework
- **hono** - Web framework
- **mariadb** - MariaDB client library

### Development Dependencies
- **typescript** - TypeScript compiler
- **@types/node** - Node.js type definitions
- **dotenv** - Environment variable loading

## 🚀 Deployment

### Container Deployment
```bash
# Production deployment
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs mariadb
```

### Manual Deployment
```bash
# Install and build
npm install && npm run build

# Start database
# (ensure MariaDB is running on configured port)

# Start MCP server
NODE_ENV=production npm start
```

## 📋 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Change `APP_PORT` in .env
   - Check for conflicting services: `ss -tlnp | grep 3004`

2. **Database Connection Failed**
   - Verify MariaDB container: `docker ps | grep mariadb`
   - Check credentials in .env
   - Test connection: `./db-helper.sh status`

3. **MCP Server Won't Start**
   - Check if TypeScript is compiled: `ls dist/`
   - Verify Node.js version: `node --version`
   - Check logs for errors

4. **Permission Denied**
   - Make scripts executable: `chmod +x db-helper.sh`
   - Check file ownership and permissions

### Support
- Check logs in Docker/Podman containers
- Use `./db-helper.sh status` for database diagnostics
- Verify environment variables in .env file
- Test HTTP endpoints with curl

## 🎯 Use Cases

This MariaDB MCP Server is perfect for:
- **AI Assistant Integration** - Provide database access to AI models
- **Development Tools** - Database inspection and management
- **Microservices Architecture** - Standalone database service
- **Prototyping** - Quick database setup with sample data
- **Learning MCP** - Example MCP server implementation

## 📄 License

MIT License - See original CES Web Platform for licensing details.

## 🤝 Contributing

This project was extracted from the CES Web Platform. For contributions and issues, please refer to the original project or create issues in the appropriate repository.

---

**Ready to use!** Start with `npm install && npm run build && docker-compose up -d && npm start`