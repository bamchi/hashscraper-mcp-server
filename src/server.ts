import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createRequire } from "node:module";
import { registerScrapeUrlTool } from "./tools/scrape-url.js";
import { registerScrapeUrlsTool } from "./tools/scrape-urls.js";
import { registerGetUsageTool } from "./tools/get-usage.js";
import { registerScraperServerStatusTool } from "./tools/scraper-server-status.js";
import { registerGetBillingTool } from "./tools/get-billing.js";

const require = createRequire(import.meta.url);
const { version: PKG_VERSION } = require("../package.json");

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "scrapi",
    version: PKG_VERSION,
  });

  registerScrapeUrlTool(server);
  registerScrapeUrlsTool(server);
  registerGetUsageTool(server);
  registerScraperServerStatusTool(server);
  registerGetBillingTool(server);

  return server;
}
