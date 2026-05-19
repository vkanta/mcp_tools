/**
 * JIRA Client using direct HTTP API calls
 * Uses the same authentication pattern as the Rust version
 */

import { Request, Response } from "undici";

const BASE_URL = process.env.JIRA_URL!;

export interface Issue {
  key: string;
  id: string;
  fields: Record<string, any>;
}

/**
 * Create an authenticated HTTP client for JIRA API
 */
function createHttpClient() {
  const authType = process.env.JIRA_AUTH_TYPE || "bearer";
  const token = process.env.JIRA_TOKEN!;
  
  return async function fetchJira<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    
    if (authType === "bearer") {
      headers["Authorization"] = `Bearer ${token}`;
    } else if (authType === "basic") {
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
    
    return (await response.json()) as T;
  };
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ displayName: string; email: string }> {
  const client = createHttpClient();
  const data = await client<{ account_id: string; display_name: string; email_address: string }>(
    "/rest/api/2/myself?fields=accountId,displayName,emailAddress"
  );
  
  return {
    displayName: data.display_name,
    email: data.email_address,
  };
}

/**
 * Search issues using JQL
 */
export async function searchIssues(params: {
  jql?: string;
  startAt?: number;
  maxResults?: number;
}): Promise<{ issues: Issue[]; total: number }> {
  const client = createHttpClient();
  
  let jql = params.jql || "assignee = currentUser()";
  if (jql.includes("currentUser()")) {
    // currentUser() needs to be replaced with actual user
    const me = await getCurrentUser();
    jql = jql.replace(/currentUser\(\)/g, `"${me.displayName}"`);
  }
  
  const data = await client<{
    issues: Issue[];
    total: number;
    startAt?: number;
    maxResults?: number;
  }>("/rest/api/2/search", {
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
    total: data.total || (data as any).total,
  };
}

/**
 * Get issue details
 */
export async function getIssueDetails(issueKey: string): Promise<Issue> {
  const client = createHttpClient();
  return client<Issue>(`/rest/api/2/issue/${issueKey}?fields=*all`);
}

/**
 * Add comment to issue
 */
export async function addComment(
  issueKey: string,
  body: string
): Promise<{ id: string; body: string }> {
  const client = createHttpClient();
  return client<{ id: string; body: string }>(
    `/rest/api/2/issue/${issueKey}/comment`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    }
  );
}

/**
 * Update issue description
 */
export async function updateIssueDescription(
  issueKey: string,
  content: string,
  mode: "replace" | "append" = "replace"
): Promise<void> {
  const client = createHttpClient();
  const current = await getIssueDetails(issueKey);
  
  let newDescription = content;
  if (mode === "append") {
    const existing = current.fields.description || "";
    newDescription = `${existing}\n\n${content}`;
  }
  
  await client(
    `/rest/api/2/issue/${issueKey}`,
    {
      method: "PUT",
      body: JSON.stringify({
        fields: { description: newDescription },
      }),
    }
  );
}

/**
 * Get available transitions for an issue
 */
export async function getAvailableTransitions(issueKey: string): Promise<{ id: string; name: string }[]> {
  const client = createHttpClient();
  const data = await client<{ transitions: { id: string; name: string; to: any }[] }>(
    `/rest/api/2/issue/${issueKey}/transitions`
  );
  
  return data.transitions.map((t) => ({
    id: t.id,
    name: t.name,
  }));
}

/**
 * Transition an issue
 */
export async function transitionIssue(
  issueKey: string,
  transitionId: string,
  comment?: string
): Promise<void> {
  const client = createHttpClient();
  
  await client(
    `/rest/api/2/issue/${issueKey}/transitions`,
    {
      method: "POST",
      body: JSON.stringify({
        transition: { id: transitionId },
        update: comment ? { comment: [{ add: { body: comment } }] } : undefined,
      }),
    }
  );
}

/**
 * Assign issue to user
 */
export async function assignIssue(
  issueKey: string,
  assignee: string
): Promise<void> {
  const client = createHttpClient();
  
  await client(
    `/rest/api/2/issue/${issueKey}/assignee`,
    {
      method: "PUT",
      body: JSON.stringify({
        name: assignee, // Use account ID or username
      }),
    }
  );
}

/**
 * Get server info
 */
export async function getServerInfo(): Promise<{ version: string; baseUrl: string }> {
  const client = createHttpClient();
  return client<{ version: string; versionNumbers: number[] }>(
    "/rest/api/2/serverInfo"
  ).then((data) => ({
    version: data.version,
    baseUrl: BASE_URL,
  }));
}
