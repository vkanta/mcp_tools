/**
 * Text Analysis Tools
 * 
 * Custom tools for analyzing and processing text content.
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const textAnalysisTools: Tool[] = [
  {
    name: "word_count",
    description: "Analyzes text and returns word count statistics including total words, unique words, and average word length.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to analyze",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "character_frequency",
    description: "Analyzes character frequency in text and returns the top 10 most common characters.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to analyze",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "text_statistics",
    description: "Provides comprehensive text statistics including character count, word count, sentence count, line count, and paragraph count.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to analyze",
        },
      },
      required: ["text"],
    },
  },
];
