<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization -->

# PlantUML MCP Server

This workspace contains a Model Context Protocol (MCP) server for PlantUML diagram generation and management.

## Project Structure

- `src/index.ts` - Main MCP server implementation
- `build/` - Compiled JavaScript output
- `README.md` - Project documentation
- `.vscode/mcp.json` - MCP server configuration
- `.vscode/tasks.json` - VS Code tasks configuration

## MCP Features

The server provides:

### Tools
- `generate_plantuml_diagram` - Generate diagrams from PlantUML code
- `validate_plantuml_syntax` - Validate PlantUML syntax

### Resources  
- `plantuml://examples` - Collection of PlantUML examples

### Prompts
- `generate_diagram_from_description` - Generate PlantUML from natural language

## Development

Use `npm run build` to compile the TypeScript code.
Use the "Start PlantUML MCP Server" task to run the server.

## Usage

Connect this server to MCP clients like Claude Desktop by configuring the server endpoint to point to `./build/index.js`.

## SDK Documentation

- [TypeScript MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification](https://modelcontextprotocol.io/specification/)