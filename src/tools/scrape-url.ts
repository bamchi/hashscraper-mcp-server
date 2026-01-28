import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { scrapeUrl } from "../utils/api.js";
import { htmlToMarkdown } from "../utils/markdown.js";

const ScrapeUrlSchema = z.object({
  url: z.string().url().describe("The URL of the webpage to scrape"),
  wait_for: z
    .enum(["load", "networkidle", "domcontentloaded"])
    .default("networkidle")
    .describe("Page load condition to wait for (networkidle recommended for SPA sites)"),
});

export function registerScrapeUrlTool(server: McpServer) {
  server.tool(
    "scrape_url",
    "Scrapes a webpage and returns the content in AI-readable Markdown format. Can access blocked sites through browser rendering.",
    ScrapeUrlSchema.shape,
    async (params) => {
      const { url, wait_for } = ScrapeUrlSchema.parse(params);

      try {
        // 1. Request browser rendering via Hashscraper API
        const response = await scrapeUrl({
          url,
          wait_for,
          javascript: true,
        });

        if (!response.success) {
          return {
            isError: true,
            content: [
              {
                type: "text" as const,
                text: `Error: ${response.error || "Failed to scrape the page."}`,
              },
            ],
          };
        }

        // 2. Convert HTML to Markdown (extract main content)
        const markdown = htmlToMarkdown(response.data.html, response.data.url);

        // 3. Return to AI
        const result = [
          `# ${response.data.title || "Untitled"}`,
          "",
          `> Source: ${response.data.url}`,
          "",
          markdown,
        ].join("\n");

        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Error: ${message}`,
            },
          ],
        };
      }
    }
  );
}
