# 🔗 Hashscraper MCP Server

> MCP server that converts URLs to clean Markdown/Text for LLM agents

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**⚡ Fast & Reliable** — Built on 7+ years of web scraping expertise, 1,900+ production crawlers, and battle-tested anti-bot handling.

## What is this?

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that lets AI agents fetch and read web pages. Simply give it a URL, and it returns clean, LLM-ready content — fast.

**Before:** AI can't read web pages directly  
**After:** "Summarize this article" just works ✨

---

## Features

- 🌐 **URL → Markdown**: Preserves headings, lists, links
- 📄 **URL → Text**: Plain text extraction
- 🏷️ **Metadata**: Title, author, date, images
- 🧹 **Clean Output**: No ads, no navigation, no scripts
- ⚡ **JavaScript Rendering**: Works with SPAs

---

## Prerequisites

- [Hashscraper](https://www.hashscraper.com) account
- Claude Desktop, Cline, or Cursor installed
- Node.js 20+

> Note: The npm package is not yet published. Please install from source for now. Once published, you can install via `npx hashscraper-mcp-server`.

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
2. Click Settings (gear icon, bottom left)
3. Select Developer tab
4. Click "Edit Config" button
5. Add the mcpServers configuration (see below)
6. Save and restart Claude Desktop (Cmd+Q, then reopen)

**Option B: Edit config file directly**

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration:**

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

> Note: Replace `/absolute/path/to/` with the actual path where you cloned the repository.

### Cline

Config file location:
- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

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

### Cursor

Create or edit `.cursor/mcp.json` in your project root:

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

---

## Step 3: Restart Your AI Client

- **Claude Desktop**: Fully quit (Cmd+Q on macOS, Alt+F4 on Windows) and reopen
- **Cline**: Restart VS Code
- **Cursor**: Restart the editor

You should see the MCP server connection indicator.

---

## Available Tools

### `scrape_url`

Scrapes a webpage and returns AI-readable content.

**Parameters:**

| Name     | Type   | Required | Description                              |
| -------- | ------ | -------- | ---------------------------------------- |
| `url`    | string | ✅        | URL to scrape                            |
| `format` | string |          | `markdown` (default) or `text`           |

**Example:**

```json
{
  "url": "https://example.com/article",
  "format": "markdown"
}
```

**Markdown Output:**

```markdown
# Article Title

> Author: John Doe | Published: 2024-01-15

## Introduction

This is the main content of the article, converted to clean markdown...

## Key Points

- Point 1: Important detail
- Point 2: Another insight
- [Related Link](https://example.com/related)
```

**Text Output:**

```text
Article Title

Author: John Doe | Published: 2024-01-15

Introduction

This is the main content of the article, converted to plain text...

Key Points

- Point 1: Important detail
- Point 2: Another insight
```

### `scrape_urls`

Scrapes multiple webpages in parallel and returns AI-readable content.

**Parameters:**

| Name     | Type     | Required | Description                              |
| -------- | -------- | -------- | ---------------------------------------- |
| `urls`   | string[] | ✅        | URLs to scrape (max 10)                  |
| `format` | string   |          | `markdown` (default) or `text`           |

**Example:**

```json
{
  "urls": ["https://example.com/page1", "https://example.com/page2"],
  "format": "text"
}
```

**Output:**

```json
[
  {
    "url": "https://example.com/page1",
    "content": "Page 1 Title\n\nThis is the content of page 1..."
  },
  {
    "url": "https://example.com/page2",
    "content": "Page 2 Title\n\nThis is the content of page 2..."
  }
]
```

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
```

### Example 2: Fetch Page Content

```
User: Get the content from https://example.com/data

Claude: [calls scrape_url]

# Page Title
> Source: https://example.com/data

The page content is returned in clean Markdown format...
```

### Example 3: Research Competitor Pricing

```
User: What's the pricing on https://competitor.com/product/abc

Claude: [calls scrape_url]

Here's the pricing information:
- **Product**: ABC Premium
- **Regular Price**: $99.00
- **Sale Price**: $79.00 (20% off)
```

### Example 4: Read API Documentation

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
│     User        │
│ "Summarize this │
│   URL for me"   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Claude Desktop │
│    / Cursor     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   MCP Server    │────►│ Hashscraper API │
│  (scrape_url)   │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │◄──────────────────────┘
         │      HTML Response
         ▼
┌─────────────────┐
│   Convert to    │
│ Markdown / Text │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI Response   │
│ (Summary, etc.) │
└─────────────────┘
```

---

## Why Hashscraper?

Built by the team behind [Hashscraper](https://hashscraper.com), with 7+ years of web scraping experience:

- ✅ 1,900+ production crawlers
- ✅ JavaScript rendering support
- ✅ Anti-bot handling
- ✅ 99.9% uptime

---

## Troubleshooting

### "API key is required"

Make sure your `HASHSCRAPER_API_KEY` environment variable is set correctly in the configuration file.

### "Invalid API key"

Verify that your API key is correct and active in your Hashscraper dashboard.

### MCP Server not connecting

1. Ensure Node.js 20+ is installed
2. Try running `node /absolute/path/to/hashscraper-mcp-server/dist/index.js` manually to check for errors
3. Fully quit Claude Desktop (Cmd+Q on macOS, Alt+F4 on Windows) and restart
4. Check Settings > Developer to verify the server is listed

### Developer tab not visible

Update Claude Desktop to the latest version: Claude menu → "Check for Updates..."

---

## Support

- Email: help@hashscraper.com
- Issues: [GitHub Issues](https://github.com/bamchi/hashscraper-mcp-server/issues)

---

## License

MIT © [Hashscraper](https://hashscraper.com)
