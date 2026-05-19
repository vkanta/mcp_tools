"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIssueTools = registerIssueTools;
const zod_1 = require("zod");
const client_js_1 = require("../client.js");
/**
 * Register all issue-related tools with the MCP server (v2 API)
 */
function registerIssueTools(server) {
    // Search issues tool
    server.registerTool("search_issues", {
        description: "Search for JIRA issues using semantic parameters instead of JQL syntax",
        inputSchema: zod_1.z.object({
            query_text: zod_1.z.string().optional(),
            project_key: zod_1.z.string().optional(),
            issue_types: zod_1.z.array(zod_1.z.string()).optional(),
            status: zod_1.z.array(zod_1.z.string()).optional(),
            assigned_to: zod_1.z.string().optional(),
        }),
    }, async ({ query_text, project_key, issue_types, status, assigned_to }) => {
        const me = await (0, client_js_1.getCurrentUser)();
        let jqlParts = [];
        if (project_key) {
            jqlParts.push(`project = "${project_key}"`);
        }
        if (assigned_to === "me" || assigned_to === "current_user") {
            jqlParts.push(`assignee = "${me.displayName}"`);
        }
        else if (assigned_to) {
            jqlParts.push(`assignee = "${assigned_to}"`);
        }
        if (issue_types && issue_types.length > 0) {
            const typesStr = issue_types.map((t) => `"${t}"`).join(" OR ");
            jqlParts.push(`type IN (${typesStr})`);
        }
        if (status && status.length > 0) {
            const statusStr = status.map((s) => `"${s}"`).join(" OR ");
            jqlParts.push(`status IN (${statusStr})`);
        }
        if (query_text) {
            jqlParts.push(`text ~ "${query_text}"`);
        }
        const jql = jqlParts.join(" AND ");
        const result = await (0, client_js_1.searchIssues)({
            jql,
            maxResults: 50,
            startAt: 0,
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        issues: result.issues.map((issue) => ({
                            key: issue.key,
                            summary: issue.fields.summary || "No summary",
                            status: issue.fields.status?.name || "Unknown",
                            assignee: issue.fields.assignee?.displayName ||
                                issue.fields.assignee?.name ||
                                "Unassigned",
                        })),
                        total: result.total,
                    }, null, 2),
                },
            ],
        };
    });
    server.registerTool("get_issue_details", {
        description: "Get detailed information about a specific JIRA issue",
        inputSchema: zod_1.z.object({
            issue_key: zod_1.z.string(),
            include_comments: zod_1.z.boolean().optional(),
        }),
    }, async ({ issue_key }) => {
        const issue = await (0, client_js_1.getIssueDetails)(issue_key);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        key: issue.key,
                        summary: issue.fields.summary || "No summary",
                        description: issue.fields.description || "",
                        status: issue.fields.status?.name || "Unknown",
                        assignee: issue.fields.assignee?.displayName ||
                            issue.fields.assignee?.name ||
                            "Unassigned",
                    }, null, 2),
                },
            ],
        };
    });
    server.registerTool("add_comment", {
        description: "Add a comment to a JIRA issue",
        inputSchema: zod_1.z.object({
            issue_key: zod_1.z.string(),
            comment_body: zod_1.z.string(),
        }),
    }, async ({ issue_key, comment_body }) => {
        const result = await (0, client_js_1.addComment)(issue_key, comment_body);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        id: result.id,
                        body: result.body,
                    }, null, 2),
                },
            ],
        };
    });
    server.registerTool("update_issue_description", {
        description: "Update the description of a JIRA issue",
        inputSchema: zod_1.z.object({
            issue_key: zod_1.z.string(),
            content: zod_1.z.string(),
        }),
    }, async ({ issue_key, content }) => {
        await (0, client_js_1.updateIssueDescription)(issue_key, content);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ success: true }, null, 2),
                },
            ],
        };
    });
}
//# sourceMappingURL=issues.js.map