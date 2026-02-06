import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { scrapeUrl, formatCreditWarning } from "../utils/api.js";

const ScrapeUrlsSchema = z.object({
  urls: z
    .array(z.string().url())
    .min(1)
    .max(10)
    .describe("URLs to scrape (max 10)"),
  format: z
    .enum(["markdown", "text"])
    .default("markdown")
    .describe("Output format: markdown (default) or text"),
});

export function registerScrapeUrlsTool(server: McpServer) {
  server.tool(
    "scrape_urls",
    "Scrapes multiple webpages in parallel and returns the content in AI-readable Markdown format. Can access blocked sites through browser rendering.",
    ScrapeUrlsSchema.shape,
    async (params) => {
      const { urls, format } = ScrapeUrlsSchema.parse(params);

      try {
        // Scrape all URLs in parallel
        const results = await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await scrapeUrl({
                url,
                format,
                javascript: true,
              });

              if (!response.success) {
                return {
                  url,
                  success: false,
                  error: response.error || "Failed to scrape the page.",
                };
              }

              return {
                url,
                success: true,
                title: response.data.title || "Untitled",
                content: response.data.content,
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
        const warning = formatCreditWarning();

        return {
          content: [
            {
              type: "text" as const,
              text: summary + formattedResults.join("\n\n---\n\n") + (warning || ""),
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
