# Changelog

## [2.0.0] - 2026-02-11

### Changed
- **Rebranded to Scrapi** — Package renamed from `@hashscraper/mcp-server` to `@scrapi.ai/mcp-server`
- **CLI commands** — `hashscraper-mcp` → `scrapi`, `hashscraper-mcp-http` → `scrapi-http`
- **HTTP endpoint** — `/mcp-api` → `/api`
- **Environment variables** — `SCRAPI_API_KEY` / `SCRAPI_API_URL` (legacy `HASHSCRAPER_*` still accepted)
- **Domain** — `mcp.hashscraper.com` → `scrapi.ai`

## [1.2.0] - 2026-02-11

### Added
- **Streamable HTTP transport** — Run as a standalone HTTP server via `npx -p @scrapi.ai/mcp-server scrapi-http` or `node dist/http.js`
- **`/api` endpoint** — Stateless Streamable HTTP endpoint with request logging and error tracking
- **`/health` endpoint** — Health check with uptime, request count, and error stats
- **Dual transport support** — Stdio (default, for Claude Desktop/Cursor/Cline) and Streamable HTTP (for web apps/remote deployment)
- **`scrapi-http` binary** — New npm bin entry for HTTP transport

## [1.1.0] - 2026-02-07

### Added
- **`get_billing` tool** — Retrieve MCP billing information (subscription, plans, daily usage, spending limits)
- **Credit warning system** — Automatic warnings when credits are low, rate limits approaching, or daily spending limits hit
- **429 auto-retry** — Rate limit responses (HTTP 429) automatically retried once using `Retry-After` header
- **MCP response headers** — Extract and track `X-MCP-Credits-Remaining`, `X-RateLimit-*`, `X-Burst-*`, `X-MCP-Daily-Warning`
- **Dual-mode `get_usage`** — Enhanced to show MCP credits breakdown (subscription + purchased) or legacy usage

### Changed
- `scrape_url` and `scrape_urls` now append credit warnings to output when credits are low
- `get_usage` auto-detects MCP vs Legacy mode based on API key prefix (`hsmcp_`)

## [1.0.4] - 2026-01-30

### Fixed
- Fixed hashscraper.com URLs missing `www` prefix in README

## [1.0.3] - 2026-01-28

### Added
- Claude Code configuration example in README

## [1.0.2] - 2026-01-25

### Added
- npx installation method in README (Korean/English)

## [1.0.1] - 2026-01-20

### Added
- `scrape_urls` tool for parallel multi-URL scraping
- `scraper_server_status` tool for monitoring server health
- `get_usage` tool for checking API credits

## [1.0.0] - 2026-01-15

### Added
- Initial release
- `scrape_url` tool with markdown/text output formats
- JavaScript rendering support
- MCP protocol integration
