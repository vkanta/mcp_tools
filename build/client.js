"use strict";
/**
 * JIRA Client using direct HTTP API calls
 * Uses the same authentication pattern as the Rust version
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = getCurrentUser;
exports.searchIssues = searchIssues;
exports.getIssueDetails = getIssueDetails;
exports.addComment = addComment;
exports.updateIssueDescription = updateIssueDescription;
exports.getAvailableTransitions = getAvailableTransitions;
exports.transitionIssue = transitionIssue;
exports.assignIssue = assignIssue;
exports.getServerInfo = getServerInfo;
const BASE_URL = process.env.JIRA_URL;
/**
 * Create an authenticated HTTP client for JIRA API
 */
function createHttpClient() {
    const authType = process.env.JIRA_AUTH_TYPE || "bearer";
    const token = process.env.JIRA_TOKEN;
    return async function fetchJira(endpoint, options) {
        const url = `${BASE_URL}${endpoint}`;
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };
        if (authType === "bearer") {
            headers["Authorization"] = `Bearer ${token}`;
        }
        else if (authType === "basic") {
            // Basic auth handled by URL credentials
        }
        const response = await fetch(url, {
            ...options,
            headers,
        });
        if (!response.ok) {
            const errorBody = await response.text().catch(() => "");
            throw new Error(`JIRA API error: ${response.status} - ${errorBody}`);
        }
        return (await response.json());
    };
}
/**
 * Get current authenticated user
 */
async function getCurrentUser() {
    const client = createHttpClient();
    const data = await client("/rest/api/2/myself?fields=accountId,displayName,emailAddress");
    return {
        displayName: data.display_name,
        email: data.email_address,
    };
}
/**
 * Search issues using JQL
 */
async function searchIssues(params) {
    const client = createHttpClient();
    let jql = params.jql || "assignee = currentUser()";
    if (jql.includes("currentUser()")) {
        // currentUser() needs to be replaced with actual user
        const me = await getCurrentUser();
        jql = jql.replace(/currentUser\(\)/g, `"${me.displayName}"`);
    }
    const data = await client("/rest/api/2/search", {
        method: "POST",
        body: JSON.stringify({
            jql,
            startAt: params.startAt ?? 0,
            maxResults: params.maxResults ?? 50,
            fields: ["summary", "description", "status", "assignee", "reporter"],
        }),
    });
    return {
        issues: data.issues || [],
        total: data.total || data.total,
    };
}
/**
 * Get issue details
 */
async function getIssueDetails(issueKey) {
    const client = createHttpClient();
    return client(`/rest/api/2/issue/${issueKey}?fields=*all`);
}
/**
 * Add comment to issue
 */
async function addComment(issueKey, body) {
    const client = createHttpClient();
    return client(`/rest/api/2/issue/${issueKey}/comment`, {
        method: "POST",
        body: JSON.stringify({ body }),
    });
}
/**
 * Update issue description
 */
async function updateIssueDescription(issueKey, content, mode = "replace") {
    const client = createHttpClient();
    const current = await getIssueDetails(issueKey);
    let newDescription = content;
    if (mode === "append") {
        const existing = current.fields.description || "";
        newDescription = `${existing}\n\n${content}`;
    }
    await client(`/rest/api/2/issue/${issueKey}`, {
        method: "PUT",
        body: JSON.stringify({
            fields: { description: newDescription },
        }),
    });
}
/**
 * Get available transitions for an issue
 */
async function getAvailableTransitions(issueKey) {
    const client = createHttpClient();
    const data = await client(`/rest/api/2/issue/${issueKey}/transitions`);
    return data.transitions.map((t) => ({
        id: t.id,
        name: t.name,
    }));
}
/**
 * Transition an issue
 */
async function transitionIssue(issueKey, transitionId, comment) {
    const client = createHttpClient();
    await client(`/rest/api/2/issue/${issueKey}/transitions`, {
        method: "POST",
        body: JSON.stringify({
            transition: { id: transitionId },
            update: comment ? { comment: [{ add: { body: comment } }] } : undefined,
        }),
    });
}
/**
 * Assign issue to user
 */
async function assignIssue(issueKey, assignee) {
    const client = createHttpClient();
    await client(`/rest/api/2/issue/${issueKey}/assignee`, {
        method: "PUT",
        body: JSON.stringify({
            name: assignee, // Use account ID or username
        }),
    });
}
/**
 * Get server info
 */
async function getServerInfo() {
    const client = createHttpClient();
    return client("/rest/api/2/serverInfo").then((data) => ({
        version: data.version,
        baseUrl: BASE_URL,
    }));
}
//# sourceMappingURL=client.js.map