#!/usr/bin/env node

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import type { Request, Response, NextFunction } from "express";
import { createMcpServer } from "./server.js";
import { runWithApiKey } from "./utils/api.js";

const PORT = parseInt(process.env.PORT || "3000", 10);
const BIND = process.env.BIND || "127.0.0.1";
const ALLOWED_HOSTS = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
  : undefined;

const app = createMcpExpressApp(
  ALLOWED_HOSTS
    ? { host: BIND, allowedHosts: ALLOWED_HOSTS }
    : { host: BIND }
);

// ── Stats ──────────────────────────────────────
const stats = {
  startedAt: new Date(),
  requests: 0,
  errors: 0,
  lastRequestAt: null as Date | null,
};

// ── MCP endpoint paths ───────────────────────────
const MCP_PATHS = ["/api", "/mcp"];

// ── Request logging middleware ──────────────────
const loggingMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (req.method === "POST") {
    stats.requests++;
    stats.lastRequestAt = new Date();

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const body = req.body as { method?: string; id?: unknown } | undefined;
    const method = body?.method || "unknown";

    console.error(
      `[${new Date().toISOString()}] MCP ${method} from ${ip} (total: ${stats.requests})`
    );
  }
  next();
};
MCP_PATHS.forEach((p) => app.use(p, loggingMiddleware));

// ── MCP Server Card (well-known discovery) ────
app.get("/.well-known/mcp/server-card.json", (_req: Request, res: Response) => {
  res.json({
    $schema:
      "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    version: "1.0",
    serverInfo: {
      name: "scrapi",
      title: "Scrapi - Web Scraping for AI Agents",
      version: "2.0.6",
    },
    description:
      "Web scraping for AI agents. Converts URLs to clean, LLM-ready Markdown with anti-bot bypass. Powered by 8+ years of scraping expertise.",
    transport: {
      type: "streamable-http",
      url: "https://scrapi.ai/mcp",
    },
    capabilities: {
      tools: {},
    },
    authentication: {
      type: "bearer",
      description:
        "Scrapi API key (get one free at https://scrapi.ai/dashboard)",
    },
    documentationUrl: "https://github.com/bamchi/scrapi-mcp-server",
    iconUrl: "https://scrapi.ai/icon.png",
  });
});

// ── Health check ───────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  const uptimeMs = Date.now() - stats.startedAt.getTime();
  const uptimeHours = Math.floor(uptimeMs / 3600000);
  const uptimeMinutes = Math.floor((uptimeMs % 3600000) / 60000);

  res.json({
    status: "ok",
    uptime: `${uptimeHours}h ${uptimeMinutes}m`,
    requests: stats.requests,
    errors: stats.errors,
    lastRequestAt: stats.lastRequestAt?.toISOString() || null,
  });
});

// ── MCP Streamable HTTP handler ───────────────
// Read-only MCP methods that don't require authentication (allows Smithery scanning)
const MCP_PUBLIC_METHODS = new Set([
  "initialize",
  "notifications/initialized",
  "tools/list",
]);

const handleMcpPost = async (req: Request, res: Response) => {
  // API 키 추출 (Authorization: Bearer hsmcp_xxx)
  const authHeader = req.headers.authorization;
  const apiKey = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : undefined;

  const body = req.body as { method?: string; id?: unknown } | undefined;
  const method = body?.method;
  const isPublic = method != null && MCP_PUBLIC_METHODS.has(method);

  if (!apiKey && !isPublic) {
    res.status(401).json({
      jsonrpc: "2.0",
      error: {
        code: -32001,
        message: "Authorization required. Use 'Authorization: Bearer <api-key>' header.",
      },
      id: (req.body as any)?.id ?? null,
    });
    return;
  }

  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  try {
    await server.connect(transport);

    if (apiKey) {
      await runWithApiKey(apiKey, () =>
        transport.handleRequest(req, res, req.body)
      );
    } else {
      await transport.handleRequest(req, res, req.body);
    }

    res.on("close", () => {
      transport.close();
      server.close();
    });
  } catch (error) {
    stats.errors++;
    console.error(`[${new Date().toISOString()}] MCP error:`, error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
};

// GET handler — browser-friendly landing page
const handleMcpGet = (req: Request, res: Response) => {
  const accept = req.headers.accept || "";
  if (!accept.includes("text/html")) {
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed. Use POST for MCP requests." },
      id: null,
    });
    return;
  }

  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Scrapi MCP Server</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { max-width: 560px; padding: 2.5rem; text-align: center; }
    .logo { font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
    .logo span { color: #6366f1; }
    .badge { display: inline-block; background: #1e1b4b; color: #a5b4fc; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 9999px; margin-bottom: 1.5rem; letter-spacing: 0.05em; }
    p { color: #a3a3a3; line-height: 1.7; margin-bottom: 1.25rem; font-size: 0.95rem; }
    .endpoint { background: #171717; border: 1px solid #262626; border-radius: 0.5rem; padding: 1rem; margin: 1.5rem 0; font-family: 'SF Mono', Monaco, monospace; font-size: 0.85rem; color: #a5b4fc; word-break: break-all; }
    .links { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
    .links a { color: #818cf8; text-decoration: none; font-size: 0.875rem; font-weight: 500; padding: 0.5rem 1rem; border: 1px solid #312e81; border-radius: 0.375rem; transition: all 0.15s; }
    .links a:hover { background: #1e1b4b; border-color: #4338ca; }
    .divider { border: none; border-top: 1px solid #262626; margin: 1.5rem 0; }
    code { background: #171717; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.85rem; color: #c4b5fd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Scrapi<span>.ai</span></div>
    <div class="badge">MCP STREAMABLE HTTP</div>
    <p>This is a <strong>Model Context Protocol</strong> endpoint for AI agents. It accepts <code>POST</code> requests only and is not meant to be opened in a browser.</p>
    <div class="endpoint">POST https://scrapi.ai/api</div>
    <p>Connect your AI client (Claude Desktop, Cursor, Windsurf, etc.) to this endpoint to start scraping the web with AI.</p>
    <hr class="divider">
    <div class="links">
      <a href="https://scrapi.ai">Homepage</a>
      <a href="https://github.com/bamchi/scrapi-mcp-server">GitHub</a>
      <a href="https://www.npmjs.com/package/@scrapi.ai/mcp-server">npm</a>
    </div>
  </div>
</body>
</html>`);
};

const handleMethodNotAllowed = (_req: Request, res: Response) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
};

// Register handlers for all MCP paths
MCP_PATHS.forEach((p) => {
  app.post(p, handleMcpPost);
  app.get(p, handleMcpGet);
  app.delete(p, handleMethodNotAllowed);
});

// ── Start server ───────────────────────────────
app.listen(PORT, BIND, () => {
  console.error(`Scrapi MCP server running on http://${BIND}:${PORT} (endpoints: /api, /mcp)`);
});

process.on("SIGINT", () => {
  console.error("Shutting down...");
  process.exit(0);
});
