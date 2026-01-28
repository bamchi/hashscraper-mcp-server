import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerScrapeUrlTool } from "./tools/scrape-url.js";
import { registerGetUsageTool } from "./tools/get-usage.js";

export function createServer() {
  const server = new McpServer({
    name: "hashscraper",
    version: "0.1.0",
  });

  // Register tools
  registerScrapeUrlTool(server);
  registerGetUsageTool(server);

  return {
    server,
    async start() {
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error("Hashscraper MCP server running on stdio");
    },
  };
}
