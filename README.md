# Hashscraper MCP Server

> MCP server that converts URLs to clean Markdown for LLM agents

<!-- TODO: Uncomment after npm publish
[![npm version](https://badge.fury.io/js/@hashscraper/mcp-server.svg)](https://www.npmjs.com/package/@hashscraper/mcp-server)
-->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **URL → Markdown**: Preserves headings, lists, links
- **Clean Output**: No ads, no navigation, no scripts
- **JavaScript Rendering**: Works with SPAs and dynamic content
- **Usage Tracking**: Monitor your API credits and usage

## Quick Start

### 1. Get API Key

1. Sign up at [hashscraper.com](https://www.hashscraper.com)
2. Log in and find your API key in [My Info](https://www.hashscraper.com/users/change_userinfo)

### 2. Install

> **Note**: npm package is not yet published. Please install from source for now.

```bash
git clone https://github.com/bamchi/hashscraper-mcp-server.git
cd hashscraper-mcp-server
npm install && npm run build
```

### 3. Configure MCP Client

Add to your MCP client configuration:

| Client | Config File Location |
|--------|----------------------|
| Claude Desktop (macOS) | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop (Windows) | `%APPDATA%\Claude\claude_desktop_config.json` |
| Cline (macOS) | `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` |
| Cline (Windows) | `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json` |

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key"
      }
    }
  }
}
```

> Replace `/absolute/path/to/` with your actual path.
> Example: `/Users/username/hashscraper-mcp-server/dist/index.js`

<!-- TODO: Uncomment after npm publish
**After npm publish:**

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "npx",
      "args": ["-y", "@hashscraper/mcp-server"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key"
      }
    }
  }
}
```
-->

For detailed setup instructions, see the **Usage Guide**:
- [English](./docs/USAGE_GUIDE_en.md)
- [한국어](./docs/USAGE_GUIDE_ko.md)

## MCP Tools

| Tool | Description |
|------|-------------|
| `scrape_url` | Scrapes a webpage and returns AI-readable Markdown |
| `scrape_urls` | Scrapes multiple URLs in parallel (max 10) |
| `get_usage` | Check API usage and remaining credits |

## Why Hashscraper?

Built by the [Hashscraper](https://www.hashscraper.com) team with 7+ years of web scraping experience:

- 5000+ production crawlers
- Reliably handles hard-to-access sites
- Fast response times
- JavaScript rendering support

## Development

```bash
npm install        # Install dependencies
npm run build      # Build
npm run dev        # Development mode (watch)
npm run inspector  # Test with MCP Inspector
```

## License

MIT © [Hashscraper](https://www.hashscraper.com)
