import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  searchIssues,
  getIssueDetails,
  addComment,
  updateIssueDescription,
  getCurrentUser,
} from "../client.js";

/**
 * Register all issue-related tools with the MCP server (v2 API)
 */
export function registerIssueTools(server: McpServer) {
  // Search issues tool
  server.registerTool(
    "search_issues",
    {
      description: "Search for JIRA issues using semantic parameters instead of JQL syntax",
      inputSchema: z.object({
        query_text: z.string().optional(),
        project_key: z.string().optional(),
        issue_types: z.array(z.string()).optional(),
        status: z.array(z.string()).optional(),
        assigned_to: z.string().optional(),
      }),
    },
    async ({ query_text, project_key, issue_types, status, assigned_to }) => {
      const me = await getCurrentUser();
      
      let jqlParts: string[] = [];
      
      if (project_key) {
        jqlParts.push(`project = "${project_key}"`);
      }
      
      if (assigned_to === "me" || assigned_to === "current_user") {
        jqlParts.push(`assignee = "${me.displayName}"`);
      } else if (assigned_to) {
        jqlParts.push(`assignee = "${assigned_to}"`);
      }
      
      if (issue_types && issue_types.length > 0) {
        const typesStr = issue_types.map((t: string) => `"${t}"`).join(" OR ");
        jqlParts.push(`type IN (${typesStr})`);
      }
      
      if (status && status.length > 0) {
        const statusStr = status.map((s: string) => `"${s}"`).join(" OR ");
        jqlParts.push(`status IN (${statusStr})`);
      }
      
      if (query_text) {
        jqlParts.push(`text ~ "${query_text}"`);
      }
      
      const jql = jqlParts.join(" AND ");
      
      const result = await searchIssues({
        jql,
        maxResults: 50,
        startAt: 0,
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              issues: (result.issues as any[]).map((issue) => ({
                key: issue.key,
                summary: issue.fields.summary || "No summary",
                status: issue.fields.status?.name || "Unknown",
                assignee:
                  issue.fields.assignee?.displayName ||
                  issue.fields.assignee?.name ||
                  "Unassigned",
              })),
              total: result.total,
            }, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "get_issue_details",
    {
      description: "Get detailed information about a specific JIRA issue",
      inputSchema: z.object({
        issue_key: z.string(),
        include_comments: z.boolean().optional(),
      }),
    },
    async ({ issue_key }) => {
      const issue = await getIssueDetails(issue_key);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              key: issue.key,
              summary: issue.fields.summary || "No summary",
              description: issue.fields.description || "",
              status: issue.fields.status?.name || "Unknown",
              assignee:
                issue.fields.assignee?.displayName ||
                issue.fields.assignee?.name ||
                "Unassigned",
            }, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "add_comment",
    {
      description: "Add a comment to a JIRA issue",
      inputSchema: z.object({
        issue_key: z.string(),
        comment_body: z.string(),
      }),
    },
    async ({ issue_key, comment_body }) => {
      const result = await addComment(issue_key, comment_body);
      
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
    }
  );

  server.registerTool(
    "update_issue_description",
    {
      description: "Update the description of a JIRA issue",
      inputSchema: z.object({
        issue_key: z.string(),
        content: z.string(),
      }),
    },
    async ({ issue_key, content }) => {
      await updateIssueDescription(issue_key, content);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: true }, null, 2),
          },
        ],
      };
    }
  );
}
