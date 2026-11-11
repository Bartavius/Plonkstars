---
paths:
  - "**/.claude/**"
  - "**/CLAUDE.md"
  - "**/SKILL.md"
  - "**/agents/*.md"
  - "**/commands/*.md"
---

# Writing Claude Code config

These apply when the file is Claude Code configuration (agents, commands, skills,
rules, settings, `CLAUDE.md`), not an app's own `agents/` or `commands/` code.

- `description` is what decides when an agent or skill is used. Say what it does and
  when to use it, and quote the phrases a user would actually type.
- Read-only agents get an explicit `tools:` list with no Write or Edit. Leave `tools`
  unset only when the agent really needs everything.
- Pick `model` on purpose: Opus for planning and judgment, Sonnet for implementation,
  Haiku for search. Use the full IDs `claude-opus-5-5` and `claude-sonnet-5-5`, not
  the `opus`/`sonnet` aliases. An agent with no `model` runs on
  `CLAUDE_CODE_SUBAGENT_MODEL`. Set `effort` only where the default (`medium`) is too low, such as planning or
  adversarial review. Haiku 4.5 doesn't support `effort`.
- Subagents do not see the conversation. An agent's prompt must say what it gets, what
  it may touch, and what it returns.
- Skills: keep `allowed-tools` as narrow as the job allows (`Bash(git status:*)`, not
  `Bash`). Put bulky reference material in files next to `SKILL.md` and load it on
  demand.
- Rules: leave out frontmatter only for guidance that applies to every file. Everything
  else gets `paths:` as a YAML list of globs, so it loads only when a matching file is
  read.
- `CLAUDE.md` and unscoped rules are loaded into every session. Only keep instructions
  there that change behavior. Leave out anything Claude can read from the code.
- `settings.json`: keep the `$schema` line. Deny reads of secrets rather than trusting
  instructions alone.
