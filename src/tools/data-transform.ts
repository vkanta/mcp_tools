/**
 * Data Transformation Tools
 * 
 * Custom tools for transforming data between different formats.
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const dataTransformTools: Tool[] = [
  {
    name: "json_to_csv",
    description: "Converts a JSON array of objects to CSV format. Each object in the array becomes a row, with keys as column headers.",
    inputSchema: {
      type: "object",
      properties: {
        json: {
          type: "array",
          description: "Array of objects to convert to CSV",
          items: {
            type: "object",
          },
        },
      },
      required: ["json"],
    },
  },
  {
    name: "csv_to_json",
    description: "Converts CSV text to a JSON array of objects. The first row is treated as headers.",
    inputSchema: {
      type: "object",
      properties: {
        csv: {
          type: "string",
          description: "CSV text to convert to JSON",
        },
      },
      required: ["csv"],
    },
  },
  {
    name: "base64_encode",
    description: "Encodes text to base64 format.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to encode",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "base64_decode",
    description: "Decodes base64 encoded text back to plain text.",
    inputSchema: {
      type: "object",
      properties: {
        encoded: {
          type: "string",
          description: "Base64 encoded text to decode",
        },
      },
      required: ["encoded"],
    },
  },
];
