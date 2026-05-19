/**
 * JIRA Client using direct HTTP API calls
 * Uses the same authentication pattern as the Rust version
 */
export interface Issue {
    key: string;
    id: string;
    fields: Record<string, any>;
}
/**
 * Get current authenticated user
 */
export declare function getCurrentUser(): Promise<{
    displayName: string;
    email: string;
}>;
/**
 * Search issues using JQL
 */
export declare function searchIssues(params: {
    jql?: string;
    startAt?: number;
    maxResults?: number;
}): Promise<{
    issues: Issue[];
    total: number;
}>;
/**
 * Get issue details
 */
export declare function getIssueDetails(issueKey: string): Promise<Issue>;
/**
 * Add comment to issue
 */
export declare function addComment(issueKey: string, body: string): Promise<{
    id: string;
    body: string;
}>;
/**
 * Update issue description
 */
export declare function updateIssueDescription(issueKey: string, content: string, mode?: "replace" | "append"): Promise<void>;
/**
 * Get available transitions for an issue
 */
export declare function getAvailableTransitions(issueKey: string): Promise<{
    id: string;
    name: string;
}[]>;
/**
 * Transition an issue
 */
export declare function transitionIssue(issueKey: string, transitionId: string, comment?: string): Promise<void>;
/**
 * Assign issue to user
 */
export declare function assignIssue(issueKey: string, assignee: string): Promise<void>;
/**
 * Get server info
 */
export declare function getServerInfo(): Promise<{
    version: string;
    baseUrl: string;
}>;
//# sourceMappingURL=client.d.ts.map