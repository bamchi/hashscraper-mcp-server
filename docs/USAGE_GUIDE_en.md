# Hashscraper MCP Server - Usage Guide

This guide explains how to set up and use the Hashscraper MCP Server with AI agents like Claude Desktop and Cursor.

---

## Prerequisites

- [Hashscraper](https://www.hashscraper.com) account
- Claude Desktop, Cline, or Cursor installed
- Node.js 20+

> **Note**: The npm package is not yet published. Please install from source for now. See [Installation from Source](#installation-from-source) below.

---

## Installation from Source

```bash
# Clone the repository
git clone https://github.com/bamchi/hashscraper-mcp-server.git
cd hashscraper-mcp-server

# Install dependencies and build
npm install && npm run build
```

---

## Step 1: Get Your API Key

1. Go to [https://www.hashscraper.com](https://www.hashscraper.com)
2. Sign up or log in
3. Navigate to [My Info](https://www.hashscraper.com/users/change_userinfo)
4. Find and copy your API key

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

**Configuration (using local build):**

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

> **Note:** Replace `/absolute/path/to/` with the actual path where you cloned the repository.
> Example: `/Users/username/hashscraper-mcp-server/dist/index.js`

<!-- TODO: Uncomment after npm publish
**Configuration (using npx - after npm publish):**

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

> **Note:** If you already have other settings in the file, just add the `mcpServers` section alongside them.

### Cline

**Config file location:**

- **macOS:** `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Windows:** `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

**Configuration (using local build):**

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

> **Note:** Replace `/absolute/path/to/` with the actual path where you cloned the repository.

### Cursor

Create or edit `.cursor/mcp.json` in your project root:

**Using local build:**

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

> **Note:** Replace `/absolute/path/to/` with the actual path where you cloned the repository.

<!-- TODO: Uncomment after npm publish
**Using npx (after npm publish):**

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
│ MCP Server      │────►│ Hashscraper API │
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
| wait_for | string | No | Page load condition: `load`, `networkidle`, `domcontentloaded`. Default: `networkidle` |

**Example:**

```json
{
  "url": "https://example.com/article",
  "wait_for": "networkidle"
}
```

### scrape_urls

Scrapes multiple webpages in parallel and returns AI-readable Markdown content.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| urls | string[] | Yes | URLs to scrape (max 10) |
| wait_for | string | No | Page load condition: `load`, `networkidle`, `domcontentloaded`. Default: `networkidle` |

**Example:**

```json
{
  "urls": ["https://example.com/page1", "https://example.com/page2"],
  "wait_for": "networkidle"
}
```

### get_usage

Check your API usage and remaining credits.

**Parameters:** None

---

## Local Development

For testing with a local Hashscraper backend, add `HASHSCRAPER_API_URL` to your configuration:

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key",
        "HASHSCRAPER_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

---

## Troubleshooting

### "API key is required"

Make sure your `HASHSCRAPER_API_KEY` environment variable is set correctly in the configuration file.

### "Invalid API key"

Verify that your API key is correct and active in your Hashscraper dashboard.

### "Insufficient credits"

Your account has run out of credits. Please recharge at [hashscraper.com](https://www.hashscraper.com).

### MCP Server not connecting

1. Ensure Node.js 20+ is installed
2. Try running `node /absolute/path/to/hashscraper-mcp-server/dist/index.js` manually to check for errors
3. Fully quit Claude Desktop (Cmd+Q on macOS, Alt+F4 on Windows) and restart
4. Check Settings > Developer to verify the server is listed

### Developer tab not visible

Update Claude Desktop to the latest version: Claude menu → "Check for Updates..."

---

## Support

- **Documentation**: [https://docs.hashscraper.com](https://docs.hashscraper.com)
- **Email**: support@hashscraper.com
- **Issues**: [GitHub Issues](https://github.com/bamchi/hashscraper-mcp-server/issues)
