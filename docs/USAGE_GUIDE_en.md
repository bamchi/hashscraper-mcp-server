# Scrapi MCP Server - Usage Guide

This guide explains how to set up and use the Scrapi MCP Server with AI agents like Claude Desktop and Cursor.

---

## Prerequisites

- [Scrapi MCP](https://scrapi.ai) account (separate from the main Scrapi account)
- Claude Desktop, Cline, or Cursor installed
- Node.js 20+

---

## Installation

### Option A: npx (Recommended)

No installation needed. Just configure your MCP client:

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": ["-y", "@scrapi.ai/mcp-server"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Option B: Installation from Source

```bash
# Clone the repository
git clone https://github.com/bamchi/hashscraper-mcp-server.git
cd hashscraper-mcp-server

# Install dependencies and build
npm install && npm run build
```

---

## Step 1: Get Your API Key

1. Go to [https://scrapi.ai](https://scrapi.ai)
2. Sign up or log in
3. Visit the [MCP Dashboard](https://scrapi.ai/dashboard) — your Free plan (500 credits/month) and API key are created automatically
4. Copy your `hsmcp_` API key

---

## Step 2: Configure MCP Server

### Claude Desktop

**Option A: Via Settings (Recommended)**

1. Open Claude Desktop
2. Click **Settings** (gear icon, bottom left)
3. Select **Developer** tab
4. Click **"Edit Config"** button
5. Add the `mcpServers` configuration (see below)
6. Save and restart Claude Desktop (Cmd+Q, then reopen)

**Option B: Edit config file directly**

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Configuration (npx — Recommended):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": ["-y", "@scrapi.ai/mcp-server"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

**Configuration (from source):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

> **Note:** Replace `/absolute/path/to/` with the actual path where you cloned the repository.

> **Note:** If you already have other settings in the file, just add the `mcpServers` section alongside them.

### Cline

**Config file location:**

- **macOS:** `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Windows:** `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

**Configuration (npx — Recommended):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": ["-y", "@scrapi.ai/mcp-server"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

**Configuration (from source):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor

Create or edit `.cursor/mcp.json` in your project root:

**Configuration (npx — Recommended):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": ["-y", "@scrapi.ai/mcp-server"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

**Configuration (from source):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Streamable HTTP

Connect via Streamable HTTP — no Node.js installation needed on the client side.

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "scrapi": {
      "url": "https://scrapi.ai/api",
      "headers": {
        "X-API-Key": "your-api-key"
      }
    }
  }
}
```

**Claude Code** (CLI):

```bash
claude mcp add --transport http scrapi https://scrapi.ai/api \
  --header "X-API-Key: your-api-key"
```

**Cline** (`cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "scrapi": {
      "type": "streamableHttp",
      "url": "https://scrapi.ai/api",
      "headers": {
        "X-API-Key": "your-api-key"
      }
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://scrapi.ai/api",
        "--header",
        "X-API-Key: your-api-key"
      ]
    }
  }
}
```

> **Note:** Claude Desktop requires the [mcp-remote](https://www.npmjs.com/package/mcp-remote) proxy for HTTP connections.

<details>
<summary>Self-host the HTTP server (advanced)</summary>

Run your own instance instead of using the hosted endpoint:

```bash
SCRAPI_API_KEY=your-api-key npx -y @scrapi.ai/mcp-server-http
# or from source:
SCRAPI_API_KEY=your-api-key node dist/http.js
```

The server starts at `http://localhost:3000/api`. Configure with `PORT` and `HOST` environment variables. Replace the URL in the client configurations above with your self-hosted URL.

**Health check:** `GET http://localhost:3000/health`

</details>

---

## Step 3: Restart Your AI Client

- **Claude Desktop**: Fully quit (Cmd+Q on macOS, Alt+F4 on Windows) and reopen the app
- **Cline**: Restart VS Code
- **Cursor**: Restart the editor

You should see the MCP server connection indicator.

---

## Usage Examples

### Example 1: Summarize a News Article

```
User: Summarize this article: https://news.example.com/article/12345

Claude: [calls scrape_url]

Here's a summary of the article:

## Key Points
- Point 1: ...
- Point 2: ...
- Point 3: ...

## Conclusion
...
```

### Example 2: Fetch Page Content

```
User: Get the content from https://example.com/data

Claude: [calls scrape_url]

# Page Title

> Source: https://example.com/data

The page content is returned in clean Markdown format...
```

### Example 3: Check API Usage

```
User: Check my API usage

Claude: [calls get_usage]

## API Usage

| Item | Value |
|------|-------|
| Plan | Standard |
| Total Credits | 10,000 |
| Used Credits | 1,234 |
| Remaining Credits | 8,766 |
| Reset Date | 2026-02-27 |
```

### Example 4: Research Competitor Pricing

```
User: What's the pricing on https://competitor.com/product/abc

Claude: [calls scrape_url]

Here's the pricing information:

- **Product**: ABC Premium
- **Regular Price**: $99.00
- **Sale Price**: $79.00 (20% off)
- **Shipping**: Free
```

### Example 5: Read API Documentation (Developer Use Case)

```
User: Read https://docs.example.com/api/v2 and write integration code

Claude: [calls scrape_url]

I've analyzed the API documentation. Here's the integration code:

// api-client.ts
export class ExampleApiClient {
  private baseUrl = 'https://api.example.com/v2';

  async getData(): Promise<Response> {
    // ...
  }
}
```

---

## How It Works

```
┌─────────────────┐
│ User            │
│ "Summarize this │
│  URL for me"    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Claude Desktop  │
│ / Cursor        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ MCP Server      │────►│ Scrapi API │
│ (scrape_url)    │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │◄──────────────────────┘
         │      HTML Response
         ▼
┌─────────────────┐
│ Convert to      │
│ Markdown        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI Response     │
│ (Summary, etc.) │
└─────────────────┘
```

---

## Available Tools

### scrape_url

Scrapes a webpage and returns AI-readable Markdown content.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| url | string | Yes | URL to scrape |
| format | string | No | Output format: `markdown` (default) or `text` |

**Example:**

```json
{
  "url": "https://example.com/article",
  "format": "markdown"
}
```

### scrape_urls

Scrapes multiple webpages in parallel and returns AI-readable Markdown content.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| urls | string[] | Yes | URLs to scrape (max 10) |
| format | string | No | Output format: `markdown` (default) or `text` |

**Example:**

```json
{
  "urls": ["https://example.com/page1", "https://example.com/page2"],
  "format": "markdown"
}
```

### get_usage

Check your API usage and remaining credits.

**Parameters:** None

---

## Local Development

For testing with a local Scrapi backend, add `SCRAPI_API_URL` to your configuration:

**Stdio mode:**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key",
        "SCRAPI_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

**Streamable HTTP mode:**

```bash
SCRAPI_API_KEY=your-api-key SCRAPI_API_URL=http://localhost:3000 node dist/http.js
```

---

## Troubleshooting

### "API key is required"

Make sure your `SCRAPI_API_KEY` environment variable is set correctly in the configuration file.

### "Invalid API key"

Verify that your API key is correct and active in your Scrapi dashboard.

### "Insufficient credits"

Your account has run out of credits. Please recharge at the [MCP Dashboard](https://scrapi.ai/dashboard).

### MCP Server not connecting

1. Ensure Node.js 20+ is installed
2. Try running `node /absolute/path/to/hashscraper-mcp-server/dist/index.js` manually to check for errors
3. Fully quit Claude Desktop (Cmd+Q on macOS, Alt+F4 on Windows) and restart
4. Check Settings > Developer to verify the server is listed

### Developer tab not visible

Update Claude Desktop to the latest version: Claude menu → "Check for Updates..."

---

## Support

- **Documentation**: [https://scrapi.ai](https://scrapi.ai)
- **Email**: help@scrapi.ai
- **Issues**: [GitHub Issues](https://github.com/bamchi/hashscraper-mcp-server/issues)
