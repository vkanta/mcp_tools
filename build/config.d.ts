/**
 * JIRA Configuration Management
 * Loads configuration from environment variables
 */
export interface JiraConfig {
    url: string;
    userEmail: string;
    authType: "bearer" | "basic";
    token?: string;
    username?: string;
    password?: string;
}
/**
 * Load configuration from environment variables
 */
export declare function loadConfig(): JiraConfig;
//# sourceMappingURL=config.d.ts.map