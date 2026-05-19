# Contributing to Custom MCP Tools

Thank you for your interest in contributing to this project! This guide will help you add your own custom tools to the MCP server.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a new branch for your feature

## Adding a New Tool

### Step 1: Define Your Tool

Create a new file in `src/tools/` or add to an existing category file. Define your tool using the MCP Tool interface:

```typescript
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const myTools: Tool[] = [
  {
    name: "my_tool_name",
    description: "Clear description of what your tool does",
    inputSchema: {
      type: "object",
      properties: {
        param1: {
          type: "string",
          description: "Description of parameter 1",
        },
        param2: {
          type: "number",
          description: "Description of parameter 2",
          default: 10,
        },
      },
      required: ["param1"],
    },
  },
];
```

### Step 2: Import Your Tools

In `src/index.ts`, import your new tools:

```typescript
import { myTools } from "./tools/my-tools.js";
```

Add them to the `allTools` array:

```typescript
const allTools: Tool[] = [
  ...textAnalysisTools,
  ...dataTransformTools,
  ...utilityTools,
  ...myTools,  // Add your tools here
];
```

### Step 3: Implement the Handler

Add a case for your tool in the `CallToolRequestSchema` handler in `src/index.ts`:

```typescript
case "my_tool_name":
  return handleMyTool(args);
```

Then implement the handler function:

```typescript
function handleMyTool(args: any) {
  const param1 = String(args.param1 || "");
  const param2 = Number(args.param2 || 10);
  
  // Your tool logic here
  const result = doSomething(param1, param2);
  
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
```

### Step 4: Test Your Tool

1. Build the project: `npm run build`
2. Start the server: `npm run dev`
3. Test with an MCP client or create a test script

### Step 5: Document Your Tool

Update the README.md with:
- Tool name and description in the Features section
- Usage example
- Any specific requirements or limitations

## Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Add JSDoc comments for public functions
- Keep functions focused and single-purpose
- Handle errors gracefully with try-catch blocks

## Error Handling

Always wrap your tool logic in try-catch and return errors in the proper format:

```typescript
try {
  // Your tool logic
} catch (error) {
  return {
    content: [
      {
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
      },
    ],
    isError: true,
  };
}
```

## Testing

Before submitting a PR:

1. Ensure the code compiles: `npm run build`
2. Test your tool with real inputs
3. Check for edge cases and error conditions
4. Verify the tool works with an MCP client

## Submitting Changes

1. Commit your changes with a clear message
2. Push to your fork
3. Create a Pull Request with:
   - Clear title describing the new tool
   - Description of what the tool does
   - Examples of usage
   - Any breaking changes or dependencies

## Tool Categories

Organize tools into logical categories:

- **Text Analysis**: Tools for analyzing and processing text
- **Data Transformation**: Tools for converting between formats
- **Utilities**: General-purpose helper tools
- **File Operations**: Tools for file manipulation
- **Network Tools**: Tools for network operations
- **Development Tools**: Tools for developers

## Best Practices

1. **Keep it simple**: Tools should do one thing well
2. **Clear naming**: Use descriptive names (verb_noun pattern)
3. **Good descriptions**: Help users understand what the tool does
4. **Validate inputs**: Check and sanitize all inputs
5. **Return useful output**: Provide clear, structured results
6. **Handle edge cases**: Consider empty inputs, invalid data, etc.
7. **Document parameters**: Clearly explain what each parameter does

## Questions?

If you have questions or need help, please open an issue on GitHub.

Thank you for contributing! 🎉
