import axios, { AxiosError } from "axios";

const API_URL = process.env.HASHSCRAPER_API_URL || "https://api.hashscraper.com";
const API_KEY = process.env.HASHSCRAPER_API_KEY;

// 디버그용: 현재 사용 중인 API URL 반환
export function getApiUrl(): string {
  return API_URL;
}

function getApiKey(): string {
  if (!API_KEY) {
    throw new Error("HASHSCRAPER_API_KEY environment variable is not set.");
  }
  return API_KEY;
}

// MCP 모드 여부 (hsmcp_ 프리픽스)
export function isMcpMode(): boolean {
  return getApiKey().startsWith("hsmcp_");
}

// 마지막 응답의 MCP 헤더 정보
let lastMcpHeaders: McpResponseHeaders = {};

export interface McpResponseHeaders {
  creditsRemaining?: number;
  rateLimitRemaining?: number;
  rateLimitReset?: number;
  burstCurrent?: number;
  burstLimit?: number;
  dailyWarning?: string;
  idempotentReplayed?: boolean;
}

export function getLastMcpHeaders(): McpResponseHeaders {
  return lastMcpHeaders;
}

const client = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds timeout
});

// Request interceptor: Add API Key to header
client.interceptors.request.use((config) => {
  const apiKey = getApiKey();
  config.headers["Content-Type"] = "application/json; version=2";
  config.headers["X-API-Key"] = apiKey;
  return config;
});

// Response interceptor: Extract MCP headers + 429 retry
client.interceptors.response.use(
  (response) => {
    // MCP 헤더 추출
    const headers = response.headers;
    lastMcpHeaders = {
      creditsRemaining: headers["x-mcp-credits-remaining"]
        ? parseInt(headers["x-mcp-credits-remaining"], 10)
        : undefined,
      rateLimitRemaining: headers["x-ratelimit-remaining"]
        ? parseInt(headers["x-ratelimit-remaining"], 10)
        : undefined,
      rateLimitReset: headers["x-ratelimit-reset"]
        ? parseInt(headers["x-ratelimit-reset"], 10)
        : undefined,
      burstCurrent: headers["x-burst-current"]
        ? parseInt(headers["x-burst-current"], 10)
        : undefined,
      burstLimit: headers["x-burst-limit"]
        ? parseInt(headers["x-burst-limit"], 10)
        : undefined,
      dailyWarning: headers["x-mcp-daily-warning"] || undefined,
      idempotentReplayed: headers["x-idempotent-replayed"] === "true",
    };
    return response;
  },
  async (error: AxiosError) => {
    // 429 Too Many Requests → Retry-After 헤더 기반 재시도 (최대 1회)
    const config = error.config;
    if (
      error.response?.status === 429 &&
      config &&
      !(config as any).__retried
    ) {
      (config as any).__retried = true;
      const retryAfter = parseInt(
        error.response.headers["retry-after"] || "2",
        10
      );
      const waitMs = Math.min(retryAfter * 1000, 60000);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return client.request(config);
    }
    return Promise.reject(error);
  }
);

// ============================================
// Types
// ============================================

export interface ScrapeUrlOptions {
  url: string;
  format?: "markdown" | "text";
  javascript?: boolean;
  timeout?: number;
}

export interface UsageInfo {
  credits_used: number;
  credits_remaining: number;
}

export interface ScrapeUrlResponse {
  success: boolean;
  data: {
    content: string;
    title: string;
    url: string;
    metadata?: {
      description?: string;
      og_image?: string;
    };
  };
  usage?: UsageInfo;
  error?: string;
}

export interface GetUsageResponse {
  success: boolean;
  data: {
    plan: string;
    credits_total: number;
    credits_used: number;
    credits_remaining: number;
    reset_date: string;
  };
  error?: string;
}

// MCP Billing Types
export interface McpCreditsResponse {
  success: boolean;
  data: {
    mode: "mcp" | "legacy";
    // MCP mode fields
    subscription_credits?: number;
    purchased_credits?: number;
    total_remaining?: number;
    plan?: string;
    current_period_start?: string;
    current_period_end?: string;
    // Legacy mode fields
    credits_total?: number;
    credits_used?: number;
    credits_remaining?: number;
    reset_date?: string;
  };
  error?: string;
}

export interface McpSubscriptionResponse {
  success: boolean;
  data: {
    subscription: {
      plan: string;
      plan_name: string | null;
      status: string;
      monthly_credits: number;
      price_cents: number;
      rate_limit_rpm: number;
      burst_limit: number;
      current_period_start: string | null;
      current_period_end: string | null;
      daily_spending_limit: number | null;
    };
  };
  error?: string;
}

export interface McpPlansResponse {
  success: boolean;
  data: {
    plans: Array<{
      slug: string;
      name: string;
      monthly_credits: number;
      price_cents: number;
      rate_limit_rpm: number;
      burst_limit: number;
    }>;
  };
  error?: string;
}

export interface McpSpendingLimitsResponse {
  success: boolean;
  data: {
    daily_limit: number | null;
    current_usage: number;
  };
  error?: string;
}

export interface McpDailyUsageResponse {
  success: boolean;
  data: {
    daily_usage: Array<{
      date: string;
      requests: number;
      credits: number;
      tools: Record<string, number>;
    }>;
    period: { start: string; end: string };
  };
  error?: string;
}

export interface ScraperServerInfo {
  name: string;
  os: string;
  healthy: boolean | null;
  failure_count: number;
  circuit_open: boolean;
  circuit_open_until: string | null;
  last_success: string | null;
  last_failure: string | null;
  last_error: string | null;
}

export interface GetScraperServerStatusResponse {
  success: boolean;
  data: {
    total: number;
    available: number;
    servers: ScraperServerInfo[];
  };
  error?: string;
}

// ============================================
// API Functions
// ============================================

export async function scrapeUrl(options: ScrapeUrlOptions): Promise<ScrapeUrlResponse> {
  const response = await client.post<ScrapeUrlResponse>("/api/scrape", {
    url: options.url,
    format: options.format || "markdown",
    options: {
      javascript: options.javascript ?? true,
      timeout: options.timeout || 30000,
    },
  });

  return response.data;
}

export async function getUsage(): Promise<GetUsageResponse> {
  const response = await client.get<GetUsageResponse>("/api/usage");
  return response.data;
}

export async function getScraperServerStatus(): Promise<GetScraperServerStatusResponse> {
  const response = await client.get<GetScraperServerStatusResponse>("/api/scraper_servers/status");
  return response.data;
}

// ============================================
// MCP Billing API Functions
// ============================================

export async function getMcpCredits(): Promise<McpCreditsResponse> {
  const response = await client.get<McpCreditsResponse>("/api/mcp/credits");
  return response.data;
}

export async function getMcpSubscription(): Promise<McpSubscriptionResponse> {
  const response = await client.get<McpSubscriptionResponse>("/api/mcp/subscription");
  return response.data;
}

export async function getMcpPlans(): Promise<McpPlansResponse> {
  const response = await client.get<McpPlansResponse>("/api/mcp/plans");
  return response.data;
}

export async function getMcpSpendingLimits(): Promise<McpSpendingLimitsResponse> {
  const response = await client.get<McpSpendingLimitsResponse>("/api/mcp/spending-limits");
  return response.data;
}

export async function getMcpDailyUsage(
  startDate?: string,
  endDate?: string
): Promise<McpDailyUsageResponse> {
  const params: Record<string, string> = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  const response = await client.get<McpDailyUsageResponse>("/api/mcp/usage/daily", { params });
  return response.data;
}

// 크레딧 경고 메시지 생성 (tool 응답에 추가)
export function formatCreditWarning(): string | null {
  const h = lastMcpHeaders;
  const warnings: string[] = [];

  if (h.dailyWarning && h.dailyWarning !== "ok") {
    if (h.dailyWarning === "warn_75") warnings.push("Daily spending at 75% of limit");
    else if (h.dailyWarning === "warn_90") warnings.push("Daily spending at 90% of limit");
    else if (h.dailyWarning === "limit_reached") warnings.push("Daily spending limit reached");
  }

  if (h.creditsRemaining !== undefined && h.creditsRemaining <= 10) {
    warnings.push(`Only ${h.creditsRemaining} credits remaining`);
  }

  if (h.rateLimitRemaining !== undefined && h.rateLimitRemaining <= 2) {
    warnings.push(`Rate limit: ${h.rateLimitRemaining} requests remaining this minute`);
  }

  return warnings.length > 0 ? `\n\n> ⚠️ ${warnings.join(" | ")}` : null;
}
