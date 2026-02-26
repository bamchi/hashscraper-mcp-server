import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { scrapeUrl, formatCreditWarning } from "../utils/api.js";

const ScrapeUrlSchema = z.object({
  url: z.string().url().describe("The URL of the webpage to scrape"),
  format: z
    .enum(["markdown", "text"])
    .default("markdown")
    .describe("Output format: markdown (default) or text"),
});

export function registerScrapeUrlTool(server: McpServer) {
  server.tool(
    "scrape_url",
    "Scrapes a webpage and returns the content in AI-readable Markdown format. Can access blocked sites through browser rendering.",
    ScrapeUrlSchema.shape,
    async (params) => {
      const { url, format } = ScrapeUrlSchema.parse(params);

      try {
        // 1. Request browser rendering via Scrapi API
        const response = await scrapeUrl({
          url,
          format,
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

        // 2. Return to AI
        const result = [
          `# ${response.data.title || "Untitled"}`,
          "",
          `> Source: ${response.data.url}`,
          "",
          response.data.content,
        ].join("\n");

        const warning = formatCreditWarning();

        return {
          content: [
            {
              type: "text" as const,
              text: result + (warning || ""),
            },
          ],
        };
      } catch (error) {
        let message = "Unknown error";
        if (error instanceof Error) {
          message = error.message;
          // axios 에러인 경우 더 자세한 정보 추출
          const axiosError = error as any;
          if (axiosError.response) {
            // 서버가 응답했지만 에러 상태
            message = `HTTP ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`;
          } else if (axiosError.request) {
            // 요청은 보냈지만 응답 없음
            message = `No response received: ${axiosError.code || 'Unknown'} (API URL: https://scrapi.ai)`;
          }
        }
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
