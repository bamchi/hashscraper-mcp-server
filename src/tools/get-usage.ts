import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getMcpCredits,
  formatCreditWarning,
} from "../utils/api.js";

export function registerGetUsageTool(server: McpServer) {
  server.tool(
    "get_usage",
    "Check API usage and remaining credits. Returns current plan, subscription credits, purchased credits, and total remaining credits.",
    {},
    async () => {
      try {
        return await getMcpUsage();
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

async function getMcpUsage() {
  const response = await getMcpCredits();

  if (!response.success) {
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Error: ${response.error || "Failed to retrieve MCP credit information."}`,
        },
      ],
    };
  }

  const d = response.data;
  const lines = [
    "## MCP Credits",
    "",
    `| Item | Value |`,
    `|------|-------|`,
    `| Mode | MCP |`,
    `| Plan | ${d.plan || "none"} |`,
    `| Subscription Credits | ${(d.subscription_credits ?? 0).toLocaleString()} |`,
    `| Purchased Credits | ${(d.purchased_credits ?? 0).toLocaleString()} |`,
    `| Total Remaining | ${(d.total_remaining ?? 0).toLocaleString()} |`,
  ];

  if (d.current_period_end) {
    lines.push(`| Period End | ${d.current_period_end.split("T")[0]} |`);
  }

  const warning = formatCreditWarning();

  return {
    content: [
      {
        type: "text" as const,
        text: lines.join("\n") + (warning || ""),
      },
    ],
  };
}

