# Changelog

All notable changes to the MrScraper OpenCode plugin are documented here. The
project follows [Semantic Versioning](https://semver.org/).

## 0.3.0 - 2026-10-14

- Updated the skills for the hosted MCP server's new tools: `scraperAPI`
  (pages as HTML, Markdown, or screenshots), `webSearch` (Google), and `status`
  (account usage). The `fetch`, `scrape`, `serp`, `rerun`, `results`, and
  `result` tools no longer exist.
- Removed the `mrscraper-scrape` skill. Skills are identical to the MrScraper
  Claude plugin 0.2.0.

## 0.2.0 - 2026-10-12

- Added OpenCode 2 support. OpenCode 2 does not run OpenCode 1 plugins; the
  package now default-exports one object with an OpenCode 2 `setup()`, which
  registers the `mrscraper` MCP server and the four skills through MCP and
  skill transforms, and an OpenCode 1 `server()`, which keeps the existing
  config hook.
- OpenCode 1 now needs 1.18.29 or later (the first release that loads the
  object form). On older releases, pin `@mrscraper/opencode@0.1.0`.
- The `MrScraperPlugin` named export was removed; use the default export.
- Documented OpenCode 2 install, sign-in, API-key configuration
  (`mcp.servers`), and update commands.

## 0.1.0 - 2026-10-05

- Added the initial `@mrscraper/opencode` plugin: registers the hosted
  MrScraper MCP server (`https://mcp.mrscraper.com/mcp`, OAuth 2.1) as
  `mrscraper` unless the user already defines that server, and loads the
  `mrscraper`, `mrscraper-fetch`, `mrscraper-scrape`, and `mrscraper-serp`
  skills from the MrScraper Claude plugin 0.1.4.
