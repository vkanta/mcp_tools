/**
 * Utility Tools
 * 
 * Custom utility tools for common development tasks.
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const utilityTools: Tool[] = [
  {
    name: "generate_uuid",
    description: "Generates a random UUID (Universally Unique Identifier). Currently supports UUID v4.",
    inputSchema: {
      type: "object",
      properties: {
        version: {
          type: "number",
          description: "UUID version (only 4 is supported)",
          default: 4,
        },
      },
    },
  },
  {
    name: "calculate_hash",
    description: "Calculates cryptographic hash of text using specified algorithm (sha256, sha512, md5, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to hash",
        },
        algorithm: {
          type: "string",
          description: "Hash algorithm to use",
          default: "sha256",
          enum: ["md5", "sha1", "sha256", "sha512"],
        },
      },
      required: ["text"],
    },
  },
  {
    name: "timestamp_converter",
    description: "Converts timestamps between different formats (Unix, ISO, UTC) or returns current timestamp if no input provided.",
    inputSchema: {
      type: "object",
      properties: {
        timestamp: {
          type: ["string", "number"],
          description: "Timestamp to convert (Unix seconds, milliseconds, or ISO string). If omitted, returns current timestamp.",
        },
      },
    },
  },
];
