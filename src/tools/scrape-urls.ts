import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { scrapeUrl } from "../utils/api.js";
import { htmlToMarkdown } from "../utils/markdown.js";

const ScrapeUrlsSchema = z.object({
  urls: z
    .array(z.string().url())
    .min(1)
    .max(10)
    .describe("URLs to scrape (max 10)"),
  wait_for: z
    .enum(["load", "networkidle", "domcontentloaded"])
    .default("networkidle")
    .describe("Page load condition to wait for (networkidle recommended for SPA sites)"),
});

export function registerScrapeUrlsTool(server: McpServer) {
  server.tool(
    "scrape_urls",
    "Scrapes multiple webpages in parallel and returns the content in AI-readable Markdown format. Can access blocked sites through browser rendering.",
    ScrapeUrlsSchema.shape,
    async (params) => {
      const { urls, wait_for } = ScrapeUrlsSchema.parse(params);

      try {
        // Scrape all URLs in parallel
        const results = await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await scrapeUrl({
                url,
                wait_for,
                javascript: true,
              });

              if (!response.success) {
                return {
                  url,
                  success: false,
                  error: response.error || "Failed to scrape the page.",
                };
              }

              const markdown = htmlToMarkdown(response.data.html, response.data.url);

              return {
                url,
                success: true,
                title: response.data.title || "Untitled",
                content: markdown,
              };
            } catch (error) {
              const message = error instanceof Error ? error.message : "Unknown error";
              return {
                url,
                success: false,
                error: message,
              };
            }
          })
        );

        // Format results
        const formattedResults = results.map((result, index) => {
          if (result.success) {
            return [
              `## ${index + 1}. ${result.title}`,
              "",
              `> Source: ${result.url}`,
              "",
              result.content,
            ].join("\n");
          } else {
            return [
              `## ${index + 1}. Error`,
              "",
              `> Source: ${result.url}`,
              "",
              `Error: ${result.error}`,
            ].join("\n");
          }
        });

        const successCount = results.filter((r) => r.success).length;
        const summary = `# Scrape Results (${successCount}/${results.length} successful)\n\n`;

        return {
          content: [
            {
              type: "text" as const,
              text: summary + formattedResults.join("\n\n---\n\n"),
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
