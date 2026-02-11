import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerScrapeUrlTool } from "./tools/scrape-url.js";
import { registerScrapeUrlsTool } from "./tools/scrape-urls.js";
import { registerGetUsageTool } from "./tools/get-usage.js";
import { registerScraperServerStatusTool } from "./tools/scraper-server-status.js";
import { registerGetBillingTool } from "./tools/get-billing.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "scrapi",
    version: "2.0.0",
  });

  registerScrapeUrlTool(server);
  registerScrapeUrlsTool(server);
  registerGetUsageTool(server);
  registerScraperServerStatusTool(server);
  registerGetBillingTool(server);

  return server;
}
