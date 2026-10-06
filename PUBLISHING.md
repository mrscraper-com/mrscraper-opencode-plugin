# Publishing MrScraper for OpenCode

Use this checklist for every public release of `@mrscraper/opencode`.

## Release gate

- [ ] Merge only reviewed changes into `main`.
- [ ] Bump `version` in `package.json` and record user-visible changes in
      `CHANGELOG.md`.
- [ ] Keep the skills identical to the canonical MCP-oriented skills. This
      must print nothing:

  ```bash
  git clone --depth 1 https://github.com/mrscraper-com/mrscraper-claude-plugin /tmp/mrscraper-claude-plugin
  diff -r /tmp/mrscraper-claude-plugin/plugins/mrscraper/skills skills
  ```

- [ ] Confirm that the repository contains no credentials or private target
      data.
- [ ] Run the checks from a clean checkout and confirm the GitHub workflow
      passes:

  ```bash
  npm ci
  npm run check
  npm pack --dry-run
  ```

  The package must contain `CHANGELOG.md`, `LICENSE`, `README.md`,
  `index.ts`, `package.json`, and the four `skills/*/SKILL.md` files.

- [ ] In a clean OpenCode profile, add the packed tarball
      (`"plugin": ["@mrscraper/opencode@file:/absolute/path/mrscraper-opencode-<version>.tgz"]`),
      then confirm:
  - `opencode mcp list` shows `mrscraper` as `needs authentication`;
  - `opencode mcp auth mrscraper` completes in the browser and
    `opencode mcp list` then shows `connected`;
  - `opencode debug skill` lists `mrscraper`, `mrscraper-fetch`,
    `mrscraper-scrape`, and `mrscraper-serp`;
  - the prompt `Fetch https://www.scrapethissite.com/pages/simple/ and summarize the page.`
    calls `mrscraper_fetch` and summarizes the page.

## Publish

Publishing needs an npm account with publish rights on the `@mrscraper` scope.

```bash
npm login
npm publish --access public
git tag v<version>
git push origin v<version>
gh release create v<version> --title "v<version>" --notes "See CHANGELOG.md for changes in v<version>."
```

Then confirm `npm view @mrscraper/opencode version` returns the new version
and `opencode plugin @mrscraper/opencode --global` installs it in a clean
profile.

## Listings

- [OpenCode ecosystem](https://opencode.ai/docs/ecosystem#plugins): one row in
  the Plugins table of `packages/web/src/content/docs/ecosystem.mdx`, through a
  pull request to `anomalyco/opencode` that follows its PR template.
- [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode):
  one YAML file in `data/plugins/`.
- [opencode.cafe](https://opencode.cafe/submit): community catalog form.
