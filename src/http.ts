#!/usr/bin/env node

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import type { Request, Response, NextFunction } from "express";
import { createMcpServer } from "./server.js";

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "127.0.0.1";

const app = createMcpExpressApp({ host: HOST });

// ── Stats ──────────────────────────────────────
const stats = {
  startedAt: new Date(),
  requests: 0,
  errors: 0,
  lastRequestAt: null as Date | null,
};

// ── Request logging middleware ──────────────────
app.use("/api", (req: Request, _res: Response, next: NextFunction) => {
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

// ── MCP Streamable HTTP endpoint ───────────────
app.post("/api", async (req: Request, res: Response) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

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
});

// GET and DELETE are not supported in stateless mode
app.get("/api", (_req: Request, res: Response) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed. Use POST." },
    id: null,
  });
});

app.delete("/api", (_req: Request, res: Response) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
});

// ── Start server ───────────────────────────────
app.listen(PORT, HOST, () => {
  console.error(`Scrapi MCP server running on http://${HOST}:${PORT}/api`);
});

process.on("SIGINT", () => {
  console.error("Shutting down...");
  process.exit(0);
});
