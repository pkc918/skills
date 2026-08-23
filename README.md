# Reactor

**English** | [中文](README_ZH.md)

青椒肉丝'skills

## Quick Start

### Codex Installation

<details>
<summary>Add the Codex marketplace</summary>

```bash
# GitHub repository
codex plugin marketplace add pkc918/reactor

# Specific Git ref
codex plugin marketplace add pkc918/reactor --ref main

# HTTPS Git URL with sparse checkout
codex plugin marketplace add https://github.com/pkc918/reactor.git --sparse .agents/plugins

# Local marketplace root
codex plugin marketplace add ./local-marketplace-root
```

</details>

<details>
<summary>Install a specific Codex plugin</summary>

```bash
codex plugin add git@pkc918
codex plugin add developer@pkc918
codex plugin add designer@pkc918
```

</details>

Open a new Codex session after installation so the plugins are loaded.

### Claude Code Installation

<details>
<summary>Install the full Claude Code marketplace from GitHub</summary>

```bash
/plugin marketplace add pkc918/reactor
```

</details>

<details>
<summary>Install specific Claude Code plugins</summary>

```bash
/plugin install pkc918/reactor/plugins/git
/plugin install pkc918/reactor/plugins/developer
/plugin install pkc918/reactor/plugins/designer
```

</details>

## Features

### Plugins

| Plugin | Path | Capabilities |
|--------|------|--------------|
| `git` | [`plugins/git`](plugins/git) | Git workflows, GitHub `gh`, GitLab `glab`, and command references for commit / branch / rebase / conflict workflows |
| `developer` | [`plugins/developer`](plugins/developer) | Go backend guidance, project structure, shadcn-vue component references, MCP / LSP / hooks configuration |
| `designer` | [`plugins/designer`](plugins/designer) | Apple Design style, layout, color, motion, and component design principles |

### Skills

| Skill | Plugin | Path | Use case |
|-------|--------|------|----------|
| `git` | `git` | [`skills/git/git`](skills/git/git) | Git commit, branch, rebase, stash, undo, conflict, remote, and tag workflows |
| `github` | `git` | [`skills/git/github`](skills/git/github) | GitHub repositories, pull requests, issues, Actions, releases, and `gh` CLI command composition |
| `gitlab` | `git` | [`skills/git/gitlab`](skills/git/gitlab) | GitLab repositories, merge requests, issues, pipelines, releases, and `glab` CLI command composition |
| `golang` | `developer` | [`skills/developer/golang`](skills/developer/golang) | Go conventions, Effective Go, error handling, concurrency, testing, and module management |
| `backend` | `developer` | [`skills/developer/backend`](skills/developer/backend) | Go backend project structure, layer responsibilities, naming, and module organization |
| `shadcn-vue` | `developer` | [`skills/developer/shadcn-vue`](skills/developer/shadcn-vue) | shadcn-vue / Reka UI component installation, usage, and API references |
| `apple design` | `designer` | [`skills/designer/apple`](skills/designer/apple) | Apple-style UI design, hierarchy, layout, color, typography, motion, and component principles |

## Project Structure

```text
.
├── .agents/plugins/         # Codex marketplace entrypoint
├── .claude/plugins/         # Claude Code marketplace entrypoint
├── agents/                  # Agent role definitions, such as frontend / backend / cr / designer
├── commands/                # Slash-command style docs, such as git-commit and git-rebase
├── config/                  # MCP, LSP, and hooks configuration
├── plugins/                 # Publishable plugins, each with its own manifest
│   ├── git/
│   ├── developer/
│   └── designer/
├── rules/                   # Coding conventions, such as Go rules
├── scripts/                 # Generation scripts and maintenance tools
└── skills/                  # AI Agent Skills and references
    ├── git/
    ├── developer/
    └── designer/
```

## License

This project is licensed under [Apache-2.0](LICENSE).
