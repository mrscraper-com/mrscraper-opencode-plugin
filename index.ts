import type { Plugin } from "@opencode-ai/plugin"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const MCP_URL = "https://mcp.mrscraper.com/mcp"
const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), "skills")

// OpenCode reads `skills.paths` (see https://opencode.ai/config.json), but the
// plugin SDK's Config type does not declare it yet.
type SkillsConfig = { skills?: { paths?: string[]; urls?: string[] } }

export const MrScraperPlugin: Plugin = async () => ({
  async config(input) {
    input.mcp ??= {}
    // Keep a user-defined entry, such as the API-key fallback or `enabled: false`.
    input.mcp.mrscraper ??= { type: "remote", url: MCP_URL }

    const config = input as typeof input & SkillsConfig
    config.skills ??= {}
    config.skills.paths ??= []
    if (!config.skills.paths.includes(SKILLS_DIR)) config.skills.paths.push(SKILLS_DIR)
  },
})

export default MrScraperPlugin
