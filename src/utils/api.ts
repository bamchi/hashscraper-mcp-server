import axios from "axios";

const API_URL = process.env.HASHSCRAPER_API_URL || "http://api.hashscraper.com";
const API_KEY = process.env.HASHSCRAPER_API_KEY;

function getApiKey(): string {
  if (!API_KEY) {
    throw new Error("HASHSCRAPER_API_KEY environment variable is not set.");
  }
  return API_KEY;
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

// ============================================
// Types
// ============================================

export interface ScrapeUrlOptions {
  url: string;
  wait_for?: "load" | "networkidle" | "domcontentloaded";
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
    html: string;
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

// ============================================
// API Functions
// ============================================

export async function scrapeUrl(options: ScrapeUrlOptions): Promise<ScrapeUrlResponse> {
  const response = await client.post<ScrapeUrlResponse>("/api/scrape", {
    url: options.url,
    options: {
      wait_for: options.wait_for || "networkidle",
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
