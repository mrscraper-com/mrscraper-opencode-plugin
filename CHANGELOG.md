# Changelog

All notable changes to the MrScraper OpenCode plugin are documented here. The
project follows [Semantic Versioning](https://semver.org/).

## 0.4.0 - 2026-11-02

- Updated the `mrscraper-serp` skill for MrScraper MCP server 0.3.0, which
  moved `webSearch` to MrScraper's new web search endpoint. Results are a
  ranked list (rank, title, url, description, source); `region` sets the
  results' country and the new `num_results` asks for 10 to 100 results. The
  `raw`, `format`, `language`, `page`, and `render_js` options are gone, and
  so is the search results URL example. Skills are identical to the MrScraper
  Claude plugin 0.3.0.

## 0.3.2 - 2026-10-29

- Reworded search as web search in the package
  description, keywords, README, and skills.
  The `webSearch` tool is unchanged. The skills now differ from the MrScraper
  Claude plugin 0.2.2 only in this wording.

## 0.3.1 - 2026-10-22

- Updated the `mrscraper` skill for the hosted server's three scopes:
  `scraperAPI` needs `scrape:write`, `webSearch` needs `scrape:read`, and
  `status` needs `account:read`. If `scraperAPI` returns 403
  `insufficient_scope`, run `opencode mcp auth mrscraper` again so OpenCode
  requests `scrape:write`. Skills are identical to the MrScraper Claude plugin
  0.2.2.

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
