# JIRA MCP Server (TypeScript)

AI-friendly JIRA integration server using the Model Context Protocol (MCP). This TypeScript/Node.js implementation provides semantic tools for searching, retrieving, and interacting with JIRA issues without requiring knowledge of JQL syntax.

## ✨ Features

- **🤖 AI-Friendly Interface**: Semantic search parameters instead of JQL
- **🔄 Multiple Authentication**: Supports Bearer token and Basic auth
- **⚡ Fast API Calls**: Direct HTTP requests using undici
- **🛠️ Comprehensive Tools**: Search, issue details, comments, transitions
- **🔐 Secure**: Environment-based configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ with npm
- Access to a JIRA instance (Cloud or Server)
- JIRA authentication credentials

### Installation

```bash
cd jirats
npm install
npm run build
```

### Configuration

Set environment variables before running:

```bash
# Required: JIRA instance URL
export JIRA_URL="https://your-company.atlassian.net"

# Required: User email (for currentUser() resolution)
export JIRA_USER_EMAIL="your.email@company.com"

# Authentication (choose one)
export JIRA_AUTH_TYPE="bearer"  # or "basic"
export JIRA_TOKEN="your_pat_token"  # for bearer auth

# For Basic Auth instead:
# export JIRA_AUTH_TYPE="basic"
# export JIRA_USERNAME="your_username"
# export JIRA_PASSWORD="your_password"
```

### Running the Server

```bash
npm start
```

The server will start and wait for MCP connections via stdio.

## 🛠️ Available Tools

### `search_issues`
Search for JIRA issues using semantic parameters.

**Parameters:**
- `query_text` (string, optional): Free text search
- `project_key` (string, optional): Filter by project
- `issue_types` (array, optional): e.g., ["story", "bug"]
- `status` (array, optional): e.g., ["open", "in_progress"]
- `assigned_to` (string, optional): "me" or username

### `get_issue_details`
Get detailed information about a specific issue.

**Parameters:**
- `issue_key` (string): e.g., "PROJ-123"
- `include_comments` (boolean, optional)

### `add_comment`
Add a comment to an issue.

**Parameters:**
- `issue_key` (string)
- `comment_body` (string)

### `update_issue_description`
Update the description of an issue.

**Parameters:**
- `issue_key` (string)
- `content` (string)

## 🔌 MCP Integration

### opencode Configuration

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "jira": {
      "type": "local",
      "command": ["node", "/path/to/jirats/build/index.js"],
      "env": {
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_USER_EMAIL": "your.email@company.com",
        "JIRA_AUTH_TYPE": "bearer",
        "JIRA_TOKEN": "your_token_here"
      },
      "enabled": true
    }
  }
}
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["/path/to/jirats/build/index.js"],
      "env": {
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_USER_EMAIL": "your.email@company.com",
        "JIRA_AUTH_TYPE": "bearer",
        "JIRA_TOKEN": "your_token_here"
      }
    }
  }
}
```

## 📝 Example Usage

Once integrated, you can naturally ask:

```
User: "Show me all my open stories in project PROJ"
→ Tool call: search_issues with {"project_key": "PROJ", "issue_types": ["story"], "status": ["open"], "assigned_to": "me"}

User: "What's the status of PROJ-456?"
→ Tool call: get_issue_details with {"issue_key": "PROJ-456"}

User: "Add a comment to PROJ-789 saying 'Review complete'"
→ Tool call: add_comment with {"issue_key": "PROJ-789", "comment_body": "Review complete"}
```

## 📁 Project Structure

```
jirats/
├── package.json              # Dependencies and scripts
├── src/
│   ├── index.ts             # Server entry point
│   ├── config.ts            # Configuration management
│   ├── client.ts            # JIRA API client
│   └── tools/
│       ├── issues.ts        # Issue-related tools
│       ├── data-transform.ts
│       └── utilities.ts
└── README.md
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run watch

# Start server
npm start
```

## 📄 License

MIT

## 👤 Author

Vasileios Kantartzis <vkanta@yahoo.com>
