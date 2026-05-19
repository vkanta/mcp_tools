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

## 📄 License

All servers are licensed under MIT.

## 👤 Author

Vasileios Kantartzis <vkanta@yahoo.com>
