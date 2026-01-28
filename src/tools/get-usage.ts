import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getUsage } from "../utils/api.js";

export function registerGetUsageTool(server: McpServer) {
  server.tool(
    "get_usage",
    "Check API usage and remaining credits. Returns current plan, total credits, usage, remaining credits, and reset date.",
    {},
    async () => {
      try {
        const response = await getUsage();

        if (!response.success) {
          return {
            isError: true,
            content: [
              {
                type: "text" as const,
                text: `Error: ${response.error || "Failed to retrieve usage information."}`,
              },
            ],
          };
        }

        const { plan, credits_total, credits_used, credits_remaining, reset_date } = response.data;

        const result = [
          "## API Usage",
          "",
          `| Item | Value |`,
          `|------|-------|`,
          `| Plan | ${plan} |`,
          `| Total Credits | ${credits_total.toLocaleString()} |`,
          `| Used Credits | ${credits_used.toLocaleString()} |`,
          `| Remaining Credits | ${credits_remaining.toLocaleString()} |`,
          `| Reset Date | ${reset_date} |`,
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
