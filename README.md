# MCP Tools Repository

A collection of Model Context Protocol (MCP) servers for AI integration.

## 📦 Included Servers

### 1. JIRA MCP Server (`jirats/`)
AI-friendly JIRA integration server using the Model Context Protocol.

**Features:**
- Semantic search for JIRA issues
- Automatic JIRA Cloud/Server detection
- Smart caching with TTL
- Comprehensive toolset for issue management

**Tech Stack:** TypeScript/Node.js

**Quick Start:**
```bash
cd jirats
npm install
npm run build
npm start
```

### 2. Gouqi MCP Server (`gouqi-mcp-server/`)
Rust-based JIRA integration server providing advanced JIRA operations.

**Features:**
- AI-friendly parameter mapping (no JQL required)
- Semantic issue search
- User-specific issue filtering
- Comprehensive error handling

**Tech Stack:** Rust

**Quick Start:**
```bash
cd gouqi-mcp-server
cargo build --release
./target/release/jira-mcp-server
```

### 3. PlantUML MCP Server (`plantUmlMcp/`)
Generate and manage UML diagrams using PlantUML.

**Features:**
- Generate diagrams from PlantUML code (PNG, SVG, TXT)
- Syntax validation
- Example library access
- Natural language to diagram generation

**Tech Stack:** TypeScript/Node.js

**Quick Start:**
```bash
cd plantUmlMcp
npm install
npm run build
npm start
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/vkanta/mcp_tools.git
   cd mcp_tools
   ```

2. Choose a server and follow its quick start guide above.

3. Configure MCP in your AI client (Claude Desktop, Continue.dev, etc.)

## 📖 Documentation

Each server has its own detailed README with:
- Installation instructions
- Configuration options
- Tool usage examples
- Development guidelines

## 🔧 Configuration Example

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "jira-typescript": {
      "command": "node",
      "args": ["/path/to/mcp_tools/jirats/build/index.js"]
    },
    "jira-rust": {
      "command": "/path/to/mcp_tools/gouqi-mcp-server/target/release/jira-mcp-server"
    },
    "plantuml": {
      "command": "node",
      "args": ["/path/to/mcp_tools/plantUmlMcp/build/index.js"]
    }
  }
}
```

## 💡 Using with opencode

This repository is configured for use with **opencode** (an AI coding assistant). Here's how to integrate the MCP servers:

### Step 1: Build Each Server

```bash
# JIRA TypeScript server
cd jirats
npm install
npm run build

# PlantUML server  
cd plantUmlMcp
npm install
npm run build

# Gouqi Rust server
cd gouqi-mcp-server
cargo build --release
```

### Step 2: Configure opencode

Add the MCP section to your `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "sequentialthinking": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"],
      "enabled": true
    },
    "playwright": {
      "type": "local",
      "command": ["npx", "@playwright/mcp@latest"],
      "enabled": true
    },
    "plantuml": {
      "type": "local",
      "command": ["node", "/path/to/mcp_tools/plantUmlMcp/build/index.js"],
      "enabled": true
    },
    "jira": {
      "type": "local",
      "command": ["/path/to/mcp_tools/jirats/build/index.js"],
      "env": {
        "JIRA_URL": "https://your-instance.atlassian.net",
        "JIRA_AUTH_TYPE": "pat",
        "JIRA_TOKEN": "your_token_here"
      },
      "enabled": true
    }
  }
}
```

### Step 3: Enable MCP in opencode

The `mcp` section enables:

- **sequentialthinking**: Chain-of-thought reasoning for complex problems
- **playwright**: Browser automation and web testing
- **plantuml**: UML diagram generation from PlantUML code
- **jira**: Semantic JIRA issue search and management

### Step 4: Restart opencode

After updating the config, restart opencode to load the new MCP servers.

You can now use these tools naturally in your conversations:

```
User: "Generate a sequence diagram for my login flow"
→ Uses PlantUML server

User: "Show me all open issues assigned to me"
→ Uses JIRA server with semantic search

User: "Analyze this problem step by step"
→ Uses sequential thinking server
```

### Environment Variables

The JIRA server supports these environment variables:

| Variable | Description |
|----------|-------------|
| `JIRA_URL` | Your JIRA instance URL (required) |
| `JIRA_AUTH_TYPE` | Authentication type: "pat", "basic", "bearer", "anonymous" |
| `JIRA_TOKEN` | Personal access token or API token |
| `JIRA_USERNAME` / `JIRA_PASSWORD` | For basic auth |
| `JIRA_CACHE_TTL` | Cache TTL in seconds (default: 300) |

## 📄 License

All servers are licensed under MIT.

## 👤 Author

Vasileios Kantartzis <vkanta@yahoo.com>
