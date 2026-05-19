/**
 * JIRA Configuration Management
 * Loads configuration from environment variables
 */

export interface JiraConfig {
  url: string;
  userEmail: string;
  authType: "bearer" | "basic";
  token?: string;      // For bearer token auth
  username?: string;   // For basic auth
  password?: string;   // For basic auth
}

/**
 * Load configuration from environment variables
 */
export function loadConfig(): JiraConfig {
  const url = process.env.JIRA_URL;
  if (!url) {
    throw new Error("JIRA_URL environment variable is required");
  }

  const userEmail = process.env.JIRA_USER_EMAIL;
  if (!userEmail) {
    throw new Error("JIRA_USER_EMAIL environment variable is required");
  }

  const authType = (process.env.JIRA_AUTH_TYPE as "bearer" | "basic") || "bearer";

  if (authType === "bearer") {
    const token = process.env.JIRA_TOKEN;
    if (!token) {
      throw new Error("JIRA_TOKEN environment variable is required for bearer authentication");
    }
    
    return {
      url,
      userEmail,
      authType: "bearer",
      token,
    };
  } else if (authType === "basic") {
    const username = process.env.JIRA_USERNAME;
    const password = process.env.JIRA_PASSWORD;
    
    if (!username || !password) {
      throw new Error("JIRA_USERNAME and JIRA_PASSWORD are required for basic authentication");
    }
    
    return {
      url,
      userEmail,
      authType: "basic",
      username,
      password,
    };
  } else {
    throw new Error(`Unsupported JIRA_AUTH_TYPE: ${authType}. Use 'bearer' or 'basic'`);
  }
}
