#!/usr/bin/env node

/**
 * JIRA MCP Server - TypeScript/Node.js Implementation
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Configuration and tools
import { loadConfig } from "./config.js";
import { registerIssueTools } from "./tools/issues.js";

async function main() {
  console.error("Starting JIRA MCP Server (TypeScript)...");

  // Load configuration
  const config = loadConfig();
  console.error(`Connected to: ${config.url}`);
  
  // Create MCP server instance with capabilities (matching plantUML pattern)
  const server = new McpServer(
    {
      name: "jira-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {}
      }
    }
  );

  console.error("Registering JIRA tools...");
  registerIssueTools(server);
  console.error("JIRA MCP Server is ready to accept connections");

  // Connect transport and start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("MCP transport connected");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
