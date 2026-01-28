#!/usr/bin/env node

import { createServer } from "./server.js";

async function main() {
  const server = createServer();
  await server.start();
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
