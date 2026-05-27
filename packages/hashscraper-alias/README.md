# @hashscraper/mcp-server

Official Hashscraper MCP server for AI agents. Bypasses anti-bot systems
(Cloudflare, Akamai, etc.) and returns clean, LLM-ready content via the
Model Context Protocol.

This package is an **alias for [`@scrapi.ai/mcp-server`](https://www.npmjs.com/package/@scrapi.ai/mcp-server)**
and forwards all behavior to it. Both names are interchangeable — install
whichever matches the convention you found in docs.

## Quick start

Add to your MCP client config (e.g. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "npx",
      "args": ["-y", "@hashscraper/mcp-server"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-key-from-hashscraper.com/mcp"
      }
    }
  }
}
```

Get an API key at [hashscraper.com/mcp](https://hashscraper.com/mcp).

## Documentation

Full docs, tool reference, and examples live in the main repository:
[github.com/bamchi/scrapi-mcp-server](https://github.com/bamchi/scrapi-mcp-server).

## License

MIT
