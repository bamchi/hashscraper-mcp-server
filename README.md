# Hashscraper MCP Server

MCP server for AI agents that provides web scraping capabilities. Input a URL and get AI-readable Markdown content, even from sites that block bots.

**Usage Guide**: [English](./docs/USAGE_GUIDE_en.md) | [한국어](./docs/USAGE_GUIDE_ko.md)

## Features

- **Direct URL Scraping**: Just input a URL and get content instantly
- **AI-friendly Output**: Automatic HTML to Markdown conversion
- **Content Extraction**: Automatically removes ads, navigation, and other clutter
- **Usage Tracking**: Monitor your API credits and usage

## Installation

```bash
npm install -g @hashscraper/mcp-server
```

Or run directly with npx:

```bash
npx @hashscraper/mcp-server
```

## Configuration

### Environment Variables

```bash
export HASHSCRAPER_API_KEY=your-api-key
```

### Claude Desktop

`claude_desktop_config.json`:

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

### Cursor

`.cursor/mcp.json`:

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

## Usage Example

```
User: What's on this page? https://example.com/article

AI: [calls scrape_url]

# Article Title

> Source: https://example.com/article

The content is returned in clean Markdown format...
```

## MCP Tools

### scrape_url

Scrapes a webpage and returns the content in AI-readable Markdown format.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| url | string | Yes | The URL of the webpage to scrape |
| wait_for | string | No | Page load condition (load, networkidle, domcontentloaded). Default: networkidle |

**Example:**

```json
{
  "url": "https://example.com/article",
  "wait_for": "networkidle"
}
```

### get_usage

Check API usage and remaining credits.

**Parameters:** None

**Response Example:**

```
## API Usage

| Item | Value |
|------|-------|
| Plan | standard |
| Total Credits | 1,000 |
| Used Credits | 150 |
| Remaining Credits | 850 |
| Reset Date | 2026-02-01 |
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev

# Test with MCP Inspector
npm run inspector
```

## License

MIT
