# Custom MCP Tools

A collection of custom tools for the Model Context Protocol (MCP), providing text analysis, data transformation, and utility functions for AI applications.

## Overview

This repository contains a custom MCP server implementation with various tools designed to extend AI capabilities with common text processing, data transformation, and utility operations.

## Features

### Text Analysis Tools
- **word_count**: Analyzes text and returns word count statistics
- **character_frequency**: Analyzes character frequency in text
- **text_statistics**: Provides comprehensive text statistics

### Data Transformation Tools
- **json_to_csv**: Converts JSON arrays to CSV format
- **csv_to_json**: Converts CSV text to JSON
- **base64_encode**: Encodes text to base64
- **base64_decode**: Decodes base64 back to text

### Utility Tools
- **generate_uuid**: Generates random UUIDs
- **calculate_hash**: Calculates cryptographic hashes
- **timestamp_converter**: Converts between timestamp formats

## Installation

```bash
# Clone the repository
git clone https://github.com/vkanta/mcp_tools.git
cd mcp_tools

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### As an MCP Server

The tools can be used as an MCP server that communicates via stdio:

```bash
npm run dev
```

### Configuration

To use this server with an MCP client (like Claude Desktop), add it to your MCP configuration:

```json
{
  "mcpServers": {
    "custom-tools": {
      "command": "node",
      "args": ["/path/to/mcp_tools/dist/index.js"]
    }
  }
}
```

For Claude Desktop on macOS, edit:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

For Windows:
```
%APPDATA%\Claude\claude_desktop_config.json
```

## Tool Examples

### Word Count
```json
{
  "tool": "word_count",
  "arguments": {
    "text": "Hello world, this is a sample text."
  }
}
```

### JSON to CSV
```json
{
  "tool": "json_to_csv",
  "arguments": {
    "json": [
      {"name": "John", "age": 30},
      {"name": "Jane", "age": 25}
    ]
  }
}
```

### Generate UUID
```json
{
  "tool": "generate_uuid",
  "arguments": {}
}
```

### Calculate Hash
```json
{
  "tool": "calculate_hash",
  "arguments": {
    "text": "hello world",
    "algorithm": "sha256"
  }
}
```

## Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

### Project Structure
```
mcp_tools/
├── src/
│   ├── index.ts              # Main server implementation
│   └── tools/
│       ├── text-analysis.ts  # Text analysis tool definitions
│       ├── data-transform.ts # Data transformation tools
│       └── utilities.ts      # Utility tools
├── dist/                     # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Adding Custom Tools

To add your own custom tools:

1. Create a new file in `src/tools/` with your tool definitions
2. Import and add your tools to the `allTools` array in `src/index.ts`
3. Implement the handler function in `src/index.ts`
4. Rebuild the project with `npm run build`

Example tool definition:
```typescript
export const myTools: Tool[] = [
  {
    name: "my_custom_tool",
    description: "Description of what this tool does",
    inputSchema: {
      type: "object",
      properties: {
        input: {
          type: "string",
          description: "Input parameter description",
        },
      },
      required: ["input"],
    },
  },
];
```

## Requirements

- Node.js 18 or higher
- npm or yarn

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop MCP Integration](https://docs.anthropic.com/claude/docs)