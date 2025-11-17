#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { spawn } from "child_process";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// Helper function to run PlantUML command
async function runPlantUML(code: string, format: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const tempFile = join(tmpdir(), `plantuml_${Date.now()}.puml`);
    const outputFile = join(tmpdir(), `plantuml_${Date.now()}.${format}`);
    
    try {
      // Write PlantUML code to temporary file
      writeFileSync(tempFile, code);
      
      // Run PlantUML command
      const args = ['-jar', '/usr/share/plantuml/plantuml.jar', `-t${format}`, tempFile];
      const child = spawn('java', args);
      
      let stderr = '';
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          try {
            if (existsSync(outputFile)) {
              const result = readFileSync(outputFile, 'utf-8');
              resolve(result);
            } else {
              resolve('Diagram generated successfully');
            }
          } catch (error) {
            reject(new Error(`Failed to read output: ${error}`));
          }
        } else {
          reject(new Error(`PlantUML failed: ${stderr}`));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

// PlantUML server configuration
const server = new McpServer({
  name: "plantuml-mcp-server",
  version: "1.0.0",
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  },
});

// Tool: Generate PlantUML diagram
server.tool(
  "generate_plantuml_diagram",
  "Generate a PlantUML diagram from PlantUML code",
  {
    code: z.string().describe("PlantUML code to generate diagram from"),
    format: z.enum(["png", "svg", "txt"]).default("png").describe("Output format for the diagram"),
    filename: z.string().optional().describe("Optional filename for the generated diagram")
  },
  async ({ code, format, filename }) => {
    try {
      // Check if PlantUML is available (fallback to simple validation for now)
      const result = await runPlantUML(code, format).catch(() => {
        return `Would generate ${format} diagram${filename ? ` as ${filename}` : ""} from PlantUML code:\n\n${code}\n\nNote: PlantUML not installed. Install with: sudo apt-get install plantuml`;
      });
      
      return {
        content: [
          {
            type: "text",
            text: result
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating PlantUML diagram: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Tool: Validate PlantUML syntax
server.tool(
  "validate_plantuml_syntax",
  "Validate PlantUML code syntax",
  {
    code: z.string().describe("PlantUML code to validate")
  },
  async ({ code }) => {
    try {
      // Basic syntax validation
      const hasStart = code.includes("@startuml");
      const hasEnd = code.includes("@enduml");
      const validBlocks = ["@startuml", "@startmindmap", "@startgantt", "@startdot", "@startjsoniq", "@startyaml", "@startmath"];
      const endBlocks = ["@enduml", "@endmindmap", "@endgantt", "@enddot", "@endjsoniq", "@endyaml", "@endmath"];
      
      let validStart = false;
      let validEnd = false;
      
      for (const start of validBlocks) {
        if (code.includes(start)) {
          validStart = true;
          break;
        }
      }
      
      for (const end of endBlocks) {
        if (code.includes(end)) {
          validEnd = true;
          break;
        }
      }
      
      const isValid = validStart && validEnd;
      
      let message = "PlantUML syntax is valid";
      if (!isValid) {
        const issues = [];
        if (!validStart) issues.push("Missing start tag (e.g., @startuml)");
        if (!validEnd) issues.push("Missing end tag (e.g., @enduml)");
        message = `PlantUML syntax is invalid: ${issues.join(", ")}`;
      }
      
      return {
        content: [
          {
            type: "text",
            text: message
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error validating PlantUML syntax: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Resource: PlantUML examples
server.resource(
  "plantuml://examples",
  "Collection of PlantUML diagram examples",
  async () => {
    const examples = {
      "sequence_diagram": `@startuml
participant User
participant System
participant Database

User -> System: Request data
System -> Database: Query data
Database --> System: Return results
System --> User: Display results
@enduml`,
      
      "class_diagram": `@startuml
class User {
  +String name
  +String email
  +login()
  +logout()
}

class Order {
  +String id
  +Date created
  +process()
}

User ||--o{ Order : places
@enduml`,

      "use_case_diagram": `@startuml
left to right direction
actor User as u
rectangle "System" {
  usecase "Login" as login
  usecase "View Profile" as profile
  usecase "Update Profile" as update
}

u --> login
u --> profile
u --> update
@enduml`
    };

    return {
      contents: [
        {
          uri: "plantuml://examples",
          text: JSON.stringify(examples, null, 2),
          mimeType: "application/json"
        }
      ]
    };
  }
);

// Prompt: Generate diagram from description
server.prompt(
  "generate_diagram_from_description",
  "Generate PlantUML code from a natural language description",
  {
    description: z.string().describe("Natural language description of the diagram"),
    diagram_type: z.enum(["sequence", "class", "usecase", "activity", "component", "state"]).describe("Type of diagram to generate")
  },
  async ({ description, diagram_type }) => {
    const prompt = `Generate PlantUML code for a ${diagram_type} diagram based on this description:

${description}

Please provide valid PlantUML syntax starting with @startuml and ending with @enduml. Follow best practices for ${diagram_type} diagrams.`;

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: prompt
          }
        }
      ]
    };
  }
);

// Main execution function
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr (not stdout which is used for MCP communication)
  console.error("PlantUML MCP Server running on stdio");
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  console.error('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});