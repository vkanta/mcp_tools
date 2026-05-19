#!/usr/bin/env node
"use strict";
/**
 * JIRA MCP Server - TypeScript/Node.js Implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
// Configuration and tools
const config_js_1 = require("./config.js");
const issues_js_1 = require("./tools/issues.js");
async function main() {
    console.error("Starting JIRA MCP Server (TypeScript)...");
    // Load configuration
    const config = (0, config_js_1.loadConfig)();
    console.error(`Connected to: ${config.url}`);
    // Create MCP server instance with capabilities (matching plantUML pattern)
    const server = new mcp_js_1.McpServer({
        name: "jira-mcp-server",
        version: "1.0.0",
    }, {
        capabilities: {
            tools: {},
            resources: {},
            prompts: {}
        }
    });
    console.error("Registering JIRA tools...");
    (0, issues_js_1.registerIssueTools)(server);
    console.error("JIRA MCP Server is ready to accept connections");
    // Connect transport and start server
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("MCP transport connected");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map