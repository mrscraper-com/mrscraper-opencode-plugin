import type { Plugin as OpenCode1Plugin } from "@opencode-ai/plugin"
import type { Plugin as OpenCode2, Skill } from "@opencode/plugin"
import { readdir, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const SERVER_NAME = "mrscraper"
const MCP_URL = "https://mcp.mrscraper.com/mcp"
const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), "skills")

// OpenCode 1 reads `skills.paths` (see https://opencode.ai/config.json), but the
// plugin SDK's Config type does not declare it yet.
type SkillsConfig = { skills?: { paths?: string[]; urls?: string[] } }

// OpenCode 1: add the server and the skills directory through the config hook.
const server: OpenCode1Plugin = async () => ({
  async config(input) {
    input.mcp ??= {}
    // Keep a user-defined entry, such as the API-key fallback or `enabled: false`.
    input.mcp[SERVER_NAME] ??= { type: "remote", url: MCP_URL }

    const config = input as typeof input & SkillsConfig
    config.skills ??= {}
    config.skills.paths ??= []
    if (!config.skills.paths.includes(SKILLS_DIR)) config.skills.paths.push(SKILLS_DIR)
  },
})

// OpenCode 2: register the same server and skills through domain transforms.
const definition = {
  id: "mrscraper",
  async setup(ctx) {
    const skills = await readSkills()
    await ctx.mcp.transform((editor) => {
      // Keep a user-defined `mcp.servers.mrscraper`, such as the API-key fallback.
      if (!editor.get(SERVER_NAME)) editor.set(SERVER_NAME, { type: "remote", url: MCP_URL })
    })
    await ctx.skill.transform((editor) => {
      for (const skill of skills) if (!editor.get(skill.id)) editor.add(skill)
    })
  },
} satisfies OpenCode2.Plugin

// Mirrors OpenCode 2's own SKILL.md loading: the folder name is the ID, the
// frontmatter supplies `name` and `description`, and the body is the content.
async function readSkills(): Promise<Skill.Info[]> {
  const skills: Skill.Info[] = []
  const folders = await readdir(SKILLS_DIR, { withFileTypes: true }).catch(() => [])
  for (const folder of folders) {
    if (!folder.isDirectory()) continue
    const path = join(SKILLS_DIR, folder.name, "SKILL.md")
    const text = await readFile(path, "utf8").catch(() => undefined)
    const markdown = text === undefined ? undefined : parseMarkdown(text)
    if (!markdown) continue
    const { name, description } = markdown.frontmatter
    skills.push({
      id: folder.name as Skill.Info["id"],
      name: (name || folder.name) as Skill.Info["name"],
      ...(description ? { description } : {}),
      path: path as Skill.Info["path"],
      content: markdown.content,
    })
  }
  return skills
}

// Reads the flat frontmatter these skills use: plain or quoted scalars and
// `|` or `>` block scalars. Nested keys are ignored.
function parseMarkdown(text: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(text)
  if (!match) return undefined
  const frontmatter: Record<string, string> = {}
  const lines = match[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const field = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(lines[i])
    if (!field) continue
    const [, key, value] = field
    if (!/^[|>][-+]?$/.test(value)) {
      frontmatter[key] = value.replace(/^(["'])(.*)\1$/, "$2").trim()
      continue
    }
    const block: string[] = []
    while (i + 1 < lines.length && (lines[i + 1].trim() === "" || /^\s/.test(lines[i + 1]))) block.push(lines[++i])
    const indent = Math.min(...block.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length))
    const literal = block.map((line) => line.slice(indent)).join("\n")
    frontmatter[key] = (value.startsWith(">") ? literal.replace(/([^\n])\n(?=[^\n])/g, "$1 ") : literal).trim()
  }
  return { frontmatter, content: match[2] }
}

// One default export serves both majors: OpenCode 1 (1.18.29 or later) calls
// `server()`, and OpenCode 2 reads `id` and `setup()` and ignores `server()`.
export default { ...definition, server }
