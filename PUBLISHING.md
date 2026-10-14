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
  `index.ts`, `package.json`, and the three `skills/*/SKILL.md` files.

- [ ] Test the packed package in clean profiles (separate `HOME` and `XDG_*`
      directories) of OpenCode 2 and of the oldest supported OpenCode 1
      (1.18.29):
  - OpenCode 2: extract the tarball and add the extracted `package/`
    directory's absolute path to `plugins`; OpenCode 1: add
    `"plugin": ["@mrscraper/opencode@file:/absolute/path/mrscraper-opencode-<version>.tgz"]`;
  - `opencode mcp list` shows `mrscraper` as `needs authentication`;
  - `opencode mcp auth mrscraper` completes in the browser and
    `opencode mcp list` then shows `connected`;
  - the skills list (`opencode api skill.list` in OpenCode 2,
    `opencode debug skill` in OpenCode 1) includes `mrscraper`,
    `mrscraper-fetch`, and `mrscraper-serp`;
  - with the README's API-key configuration, `opencode mcp list` shows
    `connected`, which also proves that a user-defined server is kept;
  - the prompt `Fetch https://www.scrapethissite.com/pages/simple/ and summarize the page.`
    calls the `scraperAPI` tool and summarizes the page.

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
and that `opencode plugin add @mrscraper/opencode` (OpenCode 2) and
`opencode plugin @mrscraper/opencode --global` (OpenCode 1) install it in clean
profiles.

## Listings

- [OpenCode ecosystem](https://opencode.ai/docs/ecosystem#plugins): one row in
  the Plugins table of `packages/web/src/content/docs/ecosystem.mdx`, through a
  pull request to `anomalyco/opencode` against `dev` (OpenCode 2 since
  2026-10-10; V1 pull requests are closed) that follows its PR template.
- [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode):
  one YAML file in `data/plugins/`.
- [opencode.cafe](https://opencode.cafe/submit): community catalog form.
