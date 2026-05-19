"use strict";
/**
 * JIRA Configuration Management
 * Loads configuration from environment variables
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
/**
 * Load configuration from environment variables
 */
function loadConfig() {
    const url = process.env.JIRA_URL;
    if (!url) {
        throw new Error("JIRA_URL environment variable is required");
    }
    const userEmail = process.env.JIRA_USER_EMAIL;
    if (!userEmail) {
        throw new Error("JIRA_USER_EMAIL environment variable is required");
    }
    const authType = process.env.JIRA_AUTH_TYPE || "bearer";
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
    }
    else if (authType === "basic") {
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
    }
    else {
        throw new Error(`Unsupported JIRA_AUTH_TYPE: ${authType}. Use 'bearer' or 'basic'`);
    }
}
//# sourceMappingURL=config.js.map