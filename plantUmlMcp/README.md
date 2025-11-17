# PlantUML MCP Server

A Model Context Protocol (MCP) server that provides PlantUML diagram generation and management capabilities.

## Features

- **Generate PlantUML Diagrams**: Convert PlantUML code to various formats (PNG, SVG, TXT)
- **Syntax Validation**: Validate PlantUML code syntax
- **Example Library**: Access to common PlantUML diagram patterns
- **Natural Language Generation**: Generate PlantUML code from descriptions

## Installation

```bash
npm install
npm run build
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "plantuml": {
      "command": "node",
      "args": ["/path/to/plantuml-mcp-server/build/index.js"]
    }
  }
}
```

### Direct Usage

```bash
npm start
```

## Tools

### `generate_plantuml_diagram`

Generate a PlantUML diagram from PlantUML code.

**Parameters:**
- `code` (string): PlantUML code to generate diagram from
- `format` (string): Output format - "png", "svg", or "txt" (default: "png")
- `filename` (string, optional): Filename for the generated diagram

### `validate_plantuml_syntax`

Validate PlantUML code syntax.

**Parameters:**
- `code` (string): PlantUML code to validate

## Resources

### `plantuml://examples`

Access a collection of PlantUML diagram examples including:
- Sequence diagrams
- Class diagrams  
- Use case diagrams

## Prompts

### `generate_diagram_from_description`

Generate PlantUML code from a natural language description.

**Parameters:**
- `description` (string): Natural language description of the diagram
- `diagram_type` (enum): Type of diagram to generate - "sequence", "class", "usecase", "activity", "component", or "state"

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Development mode with watch
npm run dev

# Clean build directory
npm run clean
```

## Dependencies

- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk): MCP TypeScript SDK
- [zod](https://github.com/colinhacks/zod): Schema validation
- [node-plantuml](https://github.com/markushedvall/node-plantuml): PlantUML integration

## License

MIT