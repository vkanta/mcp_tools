#!/usr/bin/env node

/**
 * Custom MCP Tools Server
 * 
 * This server provides custom tools for the Model Context Protocol.
 * Add your custom tool implementations in the tools directory.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Import custom tools
import { textAnalysisTools } from "./tools/text-analysis.js";
import { dataTransformTools } from "./tools/data-transform.js";
import { utilityTools } from "./tools/utilities.js";

// Combine all tools
const allTools: Tool[] = [
  ...textAnalysisTools,
  ...dataTransformTools,
  ...utilityTools,
];

// Create server instance
const server = new Server(
  {
    name: "custom-mcp-tools",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Text Analysis Tools
      case "word_count":
        return handleWordCount(args);
      case "character_frequency":
        return handleCharacterFrequency(args);
      case "text_statistics":
        return handleTextStatistics(args);

      // Data Transform Tools
      case "json_to_csv":
        return handleJsonToCsv(args);
      case "csv_to_json":
        return handleCsvToJson(args);
      case "base64_encode":
        return handleBase64Encode(args);
      case "base64_decode":
        return handleBase64Decode(args);

      // Utility Tools
      case "generate_uuid":
        return handleGenerateUuid(args);
      case "calculate_hash":
        return handleCalculateHash(args);
      case "timestamp_converter":
        return handleTimestampConverter(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Tool implementations
function handleWordCount(args: any) {
  const text = String(args.text || "");
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          total_words: wordCount,
          unique_words: uniqueWords,
          average_word_length: words.length > 0 
            ? (words.reduce((sum, word) => sum + word.length, 0) / words.length).toFixed(2)
            : 0,
        }, null, 2),
      },
    ],
  };
}

function handleCharacterFrequency(args: any) {
  const text = String(args.text || "");
  const frequency: Record<string, number> = {};

  for (const char of text) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          total_characters: text.length,
          unique_characters: Object.keys(frequency).length,
          top_10_characters: sorted.map(([char, count]) => ({ char, count })),
        }, null, 2),
      },
    ],
  };
}

function handleTextStatistics(args: any) {
  const text = String(args.text || "");
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const lines = text.split('\n').filter(l => l.trim().length > 0);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          characters: text.length,
          words: words.length,
          sentences: sentences.length,
          lines: lines.length,
          paragraphs: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
        }, null, 2),
      },
    ],
  };
}

function handleJsonToCsv(args: any) {
  const jsonData = args.json;
  
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error("Input must be a non-empty array of objects");
  }

  const headers = Object.keys(jsonData[0]);
  const csvRows = [headers.join(',')];

  for (const obj of jsonData) {
    const values = headers.map(header => {
      const value = obj[header];
      const stringValue = value === null || value === undefined ? '' : String(value);
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
    });
    csvRows.push(values.join(','));
  }

  return {
    content: [
      {
        type: "text",
        text: csvRows.join('\n'),
      },
    ],
  };
}

function handleCsvToJson(args: any) {
  const csv = String(args.csv || "");
  const lines = csv.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row");
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const obj: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    result.push(obj);
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

function handleBase64Encode(args: any) {
  const text = String(args.text || "");
  const encoded = Buffer.from(text).toString('base64');

  return {
    content: [
      {
        type: "text",
        text: encoded,
      },
    ],
  };
}

function handleBase64Decode(args: any) {
  const encoded = String(args.encoded || "");
  
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    return {
      content: [
        {
          type: "text",
          text: decoded,
        },
      ],
    };
  } catch (error) {
    throw new Error("Invalid base64 string");
  }
}

function handleGenerateUuid(args: any) {
  const version = args.version || 4;
  
  if (version !== 4) {
    throw new Error("Only UUID v4 is currently supported");
  }

  // Simple UUID v4 generator
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  return {
    content: [
      {
        type: "text",
        text: uuid,
      },
    ],
  };
}

function handleCalculateHash(args: any) {
  const text = String(args.text || "");
  const algorithm = args.algorithm || "sha256";

  const crypto = require('crypto');
  
  try {
    const hash = crypto.createHash(algorithm).update(text).digest('hex');
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            algorithm,
            hash,
          }, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }
}

function handleTimestampConverter(args: any) {
  const input = args.timestamp;
  
  if (!input) {
    const now = new Date();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            unix: Math.floor(now.getTime() / 1000),
            milliseconds: now.getTime(),
            iso: now.toISOString(),
            utc: now.toUTCString(),
          }, null, 2),
        },
      ],
    };
  }

  // Try to parse the input
  let date: Date;
  
  if (typeof input === 'number' || /^\d+$/.test(input)) {
    const timestamp = Number(input);
    // Assume seconds if < 10 digits, milliseconds otherwise
    date = timestamp < 10000000000 
      ? new Date(timestamp * 1000) 
      : new Date(timestamp);
  } else {
    date = new Date(input);
  }

  if (isNaN(date.getTime())) {
    throw new Error("Invalid timestamp format");
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          unix: Math.floor(date.getTime() / 1000),
          milliseconds: date.getTime(),
          iso: date.toISOString(),
          utc: date.toUTCString(),
          local: date.toString(),
        }, null, 2),
      },
    ],
  };
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Custom MCP Tools Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
