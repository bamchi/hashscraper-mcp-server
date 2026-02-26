import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getMcpSubscription,
  getMcpPlans,
  getMcpDailyUsage,
  getMcpSpendingLimits,
  formatCreditWarning,
} from "../utils/api.js";

const BillingSchema = z.object({
  action: z
    .enum(["subscription", "plans", "daily_usage", "spending_limits"])
    .describe(
      "What billing info to retrieve: subscription (current plan details), plans (available plans), daily_usage (credit usage history), spending_limits (daily spend limit status)"
    ),
  start_date: z
    .string()
    .optional()
    .describe("Start date for daily_usage (YYYY-MM-DD). Default: 30 days ago"),
  end_date: z
    .string()
    .optional()
    .describe("End date for daily_usage (YYYY-MM-DD). Default: today"),
});

export function registerGetBillingTool(server: McpServer) {
  server.tool(
    "get_billing",
    "Retrieve MCP billing information: subscription details, available plans, daily usage history, or spending limits.",
    BillingSchema.shape,
    async (params) => {
      const { action, start_date, end_date } = BillingSchema.parse(params);

      try {
        switch (action) {
          case "subscription":
            return await handleSubscription();
          case "plans":
            return await handlePlans();
          case "daily_usage":
            return await handleDailyUsage(start_date, end_date);
          case "spending_limits":
            return await handleSpendingLimits();
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
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

async function handleSubscription() {
  const response = await getMcpSubscription();
  if (!response.success) {
    return {
      isError: true,
      content: [
        { type: "text" as const, text: `Error: ${response.error}` },
      ],
    };
  }

  const s = response.data.subscription;
  const lines = [
    "## MCP Subscription",
    "",
    `| Item | Value |`,
    `|------|-------|`,
    `| Plan | ${s.plan} (${s.plan_name || "-"}) |`,
    `| Status | ${s.status} |`,
    `| Monthly Credits | ${s.monthly_credits.toLocaleString()} |`,
    `| Price | $${(s.price_cents / 100).toFixed(2)}/mo |`,
    `| Rate Limit | ${s.rate_limit_rpm} RPM |`,
    `| Burst Limit | ${s.burst_limit} concurrent |`,
  ];

  if (s.current_period_end) {
    lines.push(`| Period End | ${s.current_period_end.split("T")[0]} |`);
  }
  if (s.daily_spending_limit != null) {
    lines.push(
      `| Daily Spending Limit | ${s.daily_spending_limit.toLocaleString()} credits |`
    );
  }

  const warning = formatCreditWarning();

  return {
    content: [
      { type: "text" as const, text: lines.join("\n") + (warning || "") },
    ],
  };
}

async function handlePlans() {
  const response = await getMcpPlans();
  if (!response.success) {
    return {
      isError: true,
      content: [
        { type: "text" as const, text: `Error: ${response.error}` },
      ],
    };
  }

  const lines = [
    "## Available MCP Plans",
    "",
    "| Plan | Credits/mo | Price | RPM | Burst |",
    "|------|-----------|-------|-----|-------|",
  ];

  for (const p of response.data.plans) {
    const price =
      p.price_cents === 0 ? "Free" : `$${(p.price_cents / 100).toFixed(2)}/mo`;
    lines.push(
      `| ${p.name} (${p.slug}) | ${p.monthly_credits.toLocaleString()} | ${price} | ${p.rate_limit_rpm} | ${p.burst_limit} |`
    );
  }

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
  };
}

async function handleDailyUsage(startDate?: string, endDate?: string) {
  const response = await getMcpDailyUsage(startDate, endDate);
  if (!response.success) {
    return {
      isError: true,
      content: [
        { type: "text" as const, text: `Error: ${response.error}` },
      ],
    };
  }

  const { daily_usage, period } = response.data;
  const lines = [
    `## Daily Usage (${period.start} ~ ${period.end})`,
    "",
    "| Date | Requests | Credits | Top Tool |",
    "|------|----------|---------|----------|",
  ];

  for (const d of daily_usage) {
    const topTool = Object.entries(d.tools || {}).sort(
      ([, a], [, b]) => b - a
    )[0];
    const toolStr = topTool ? `${topTool[0]} (${topTool[1]})` : "-";
    lines.push(
      `| ${d.date} | ${d.requests.toLocaleString()} | ${d.credits.toLocaleString()} | ${toolStr} |`
    );
  }

  if (daily_usage.length === 0) {
    lines.push("| (no usage data) | - | - | - |");
  }

  const totalCredits = daily_usage.reduce((sum, d) => sum + d.credits, 0);
  const totalRequests = daily_usage.reduce((sum, d) => sum + d.requests, 0);
  lines.push("");
  lines.push(
    `**Total**: ${totalRequests.toLocaleString()} requests, ${totalCredits.toLocaleString()} credits`
  );

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
  };
}

async function handleSpendingLimits() {
  const response = await getMcpSpendingLimits();
  if (!response.success) {
    return {
      isError: true,
      content: [
        { type: "text" as const, text: `Error: ${response.error}` },
      ],
    };
  }

  const { daily_limit, current_usage } = response.data;
  const pct =
    daily_limit && daily_limit > 0
      ? ((current_usage / daily_limit) * 100).toFixed(1)
      : "N/A";

  const lines = [
    "## Spending Limits",
    "",
    `| Item | Value |`,
    `|------|-------|`,
    `| Daily Limit | ${daily_limit != null ? daily_limit.toLocaleString() + " credits" : "Unlimited"} |`,
    `| Today's Usage | ${current_usage.toLocaleString()} credits |`,
    `| Usage % | ${pct}${pct !== "N/A" ? "%" : ""} |`,
  ];

  const warning = formatCreditWarning();

  return {
    content: [
      { type: "text" as const, text: lines.join("\n") + (warning || "") },
    ],
  };
}
