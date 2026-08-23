# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Skills

A plugin system for AI coding agents (Claude Code, Cursor). Provides plugins, skills, commands, rules, and agent definitions that extend agent capabilities. Think of it as a modular toolkit — each plugin bundles related skills, commands, and config.

## Commands

```bash
pnpm lint            # ESLint (uses @antfu/eslint-config, covers .md/.mdc files)
pnpm lint:fix        # Auto-fix lint issues
pnpm gen:shadcn-vue  # Regenerate shadcn-vue component references via tsx
```

Package manager: **pnpm** (pinned to 10.30.3).

## Architecture

### Plugin system

Plugins live under `plugins/`. Each has a `.claude-plugin/plugin.json` manifest declaring its agents, skills, commands, hooks, MCP servers, and LSP servers. The marketplace index at `.claude-plugin/marketplace.json` registers available plugins.

Plugins use **symlinks** to reference shared resources without duplication:

```
plugins/developer/
  agents -> ../../agents/developer
  skills -> ../../skills/developer
  config -> ../../config/developer
```

Currently two published plugins: **git** and **developer**.

### Resource layout

| Directory    | Purpose                                                        |
|-------------|----------------------------------------------------------------|
| `agents/`   | Agent definitions by role (designer, developer, pm)            |
| `skills/`   | Domain knowledge bundles — each has `SKILL.md` + `references/` |
| `commands/`  | Slash commands (markdown with frontmatter), grouped by domain  |
| `rules/`    | Coding convention documents (e.g. Go style guide)              |
| `config/`   | MCP/LSP/hooks JSON configs, grouped by plugin                  |
| `scripts/`  | Code generation tooling (TypeScript)                           |

### Skills structure

Each skill is a directory with a `SKILL.md` (metadata + usage instructions) and a `references/` subdirectory of topic-specific docs. Current skills: `git/git`, `developer/golang`, `developer/shadcn-vue`, `developer/gofiber`.

### Commands

Git plugin commands follow `git-<operation>.md` naming (e.g. `git-commit.md`, `git-push.md`). Go commands use `go-<operation>.md`.

## Conventions

- **Commits**: Conventional Commits format — `type(scope): subject`
- **Content files**: Markdown with YAML frontmatter
- **New plugins**: Create `plugins/<name>/.claude-plugin/plugin.json`, add to marketplace.json, symlink shared resources
- **New skills**: Add `SKILL.md` + `references/` under the appropriate `skills/<role>/<skill-name>/` directory
