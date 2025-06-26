#!/usr/bin/env node

import { exec } from "child_process";
import { writeFile, mkdir } from "fs/promises";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Use a static version string that will be updated by the version script
const packageVersion = "0.5.0";

const CREATE_PDF_TOOL: Tool = {
  name: "create_pdf",
  description:
    "Creates a PDF document from the provided LaTeX source code.",
  inputSchema: {
    type: "object",
    properties: {
      file_name: {
        type: "string",
        description: "The name of the output PDF file (must end with .pdf)",
      },
      latex_source: {
        type: "string",
        description: "The LaTeX source code to convert into a PDF document.",
      },
    },
    required: ["file_name", "latex_source"],
  },
};


// Server implementation
const server = new Server(
  {
    name: "tobioffice/latexpdf-mcp",
    version: packageVersion,
  },
  {
    capabilities: {
      resources: {},
      tools: {
        create_pdf: {
          description: CREATE_PDF_TOOL.description,
          schema: CREATE_PDF_TOOL.inputSchema,
        },
      },
    },
  }
);

interface CreatePDFResult {
  result: {
    file_name: string;
    download_url: string;
  };
};

function isCreatePDFArgs(args: unknown): args is {
  file_name: string;
  latex_source: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "file_name" in args &&
    typeof (args as { file_name: string }).file_name === "string" &&
    "latex_source" in args &&
    typeof (args as { latex_source: string }).latex_source === "string"
  );
}

async function performCreatePDF(
  file_name: string,
  latex_source: string
) {
  const LATEX_ENGINE = "latexmk -pdf -interaction=nonstopmode";
  const OUT_DIR = process.env.LATEXPDF_OUTPUT_DIR || "C:\\Users\\Admin\\Documents\\GeneratedPDF";

  if (!file_name.endsWith(".pdf")) {
    throw new Error("Output file name must end with .pdf");
  }
  const latexFilePath = `${OUT_DIR}\\${file_name.replace(/\.pdf$/, ".tex")}`;

  // Ensure output directory exists
  try {
    await mkdir(OUT_DIR, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create output directory: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    await writeFile(latexFilePath, latex_source);
  } catch (error) {
    throw new Error(`Failed to write LaTeX file: ${error instanceof Error ? error.message : String(error)}`);
  }

  const command = `${LATEX_ENGINE} --outdir="${OUT_DIR}" "${latexFilePath}"`;

  const executionResult = await new Promise<string>((resolve, reject) => {
    exec(command, (_error, stdout, _stderr) => {
      // Only treat it as an error if the specific fatal error message appears
      if (stdout && stdout.toLowerCase().includes("no output PDF file produced".toLowerCase())) {
        reject(new Error(`LaTeX compilation failed: Fatal error occurred, no output PDF file produced!\n\nFull output:\n${stdout}`));
      } else {
        // Even if there are warnings or other errors, if no fatal message, return success
        resolve(file_name);
      }
    });
  });

  const downloadUrl = `http://localhost:8000/${executionResult}`;
  const result: CreatePDFResult = {
    result: {
      file_name: file_name,
      download_url: downloadUrl,
    },
  };
  return `File Name: ${result.result.file_name}\n\nPDF Download LINK: ${result.result.download_url} `;
}

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [CREATE_PDF_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("No arguments provided");
    }

    if (name === "create_pdf") {
      if (!isCreatePDFArgs(args)) {
        throw new Error("Invalid arguments for create_pdf");
      }
      const {
        file_name,
        latex_source
      } = args;
      const results = await performCreatePDF(
        file_name,
        latex_source
      );
      return {
        content: [{ type: "text", text: results }],
        isError: false,
      };
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)
            }`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
