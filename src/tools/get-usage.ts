import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getUsage,
  getMcpCredits,
  isMcpMode,
  formatCreditWarning,
} from "../utils/api.js";

export function registerGetUsageTool(server: McpServer) {
  server.tool(
    "get_usage",
    "Check API usage and remaining credits. Returns current plan, total credits, usage, remaining credits, and reset date. Supports both MCP and Legacy API keys.",
    {},
    async () => {
      try {
        if (isMcpMode()) {
          return await getMcpUsage();
        }
        return await getLegacyUsage();
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

async function getLegacyUsage() {
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
}
