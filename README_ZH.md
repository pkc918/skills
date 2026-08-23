# Reactor

[English](README.md) | **中文**

**Reactor** 取名自钢铁侠的核反应堆：它不是单个工具，而是驱动 **AI Agent** 持续工作的核心能源。对一人公司和独立开发者来说，Reactor 是做项目的 **AI agent 反应堆**，把 **PM、项目开发、项目维护、设计、发布、营销** 等流程沉淀成可复用的 **plugins、skills、commands、rules、agents、MCP/LSP 配置**，让 Codex、Claude Code 等 AI coding agent 可以按需安装和调用。

## 快速上手

### Codex 安装

<details>
<summary>添加 Codex marketplace</summary>

```bash
# GitHub 仓库
codex plugin marketplace add pkc918/reactor

# 指定 Git ref
codex plugin marketplace add pkc918/reactor --ref main

# 使用 HTTPS Git URL 和 sparse checkout
codex plugin marketplace add https://github.com/pkc918/reactor.git --sparse .agents/plugins

# 本地 marketplace 根目录
codex plugin marketplace add ./local-marketplace-root
```

</details>

<details>
<summary>安装指定 Codex 插件</summary>

```bash
codex plugin add git@pkc918
codex plugin add developer@pkc918
codex plugin add designer@pkc918
```

</details>

安装后请重新打开一个 Codex 会话，以加载插件。

### Claude Code 安装

<details>
<summary>从 GitHub 安装整个 Claude Code marketplace</summary>

```bash
/plugin marketplace add pkc918/reactor
```

</details>

<details>
<summary>安装指定 Claude Code 插件</summary>

```bash
/plugin install pkc918/reactor/plugins/git
/plugin install pkc918/reactor/plugins/developer
/plugin install pkc918/reactor/plugins/designer
```

</details>

## 功能特点

### 插件列表

| 插件 | 路径 | 主要能力 |
|------|------|----------|
| `git` | [`plugins/git`](plugins/git) | Git 工作流、GitHub `gh`、GitLab `glab`、commit / branch / rebase / conflict 等命令参考 |
| `developer` | [`plugins/developer`](plugins/developer) | Go 后端、项目结构、shadcn-vue 组件文档、MCP / LSP / hooks 配置 |
| `designer` | [`plugins/designer`](plugins/designer) | Apple Design 风格、布局、颜色、动效、组件设计原则 |

### Skill 列表

| Skill | 插件 | 路径 | 使用场景 |
|-------|------|------|----------|
| `git` | `git` | [`skills/git/git`](skills/git/git) | Git commit、branch、rebase、stash、undo、conflict、remote、tag 等基础工作流 |
| `github` | `git` | [`skills/git/github`](skills/git/github) | GitHub 仓库、Pull Request、Issue、Actions、Release，以及 `gh` CLI 命令组合 |
| `gitlab` | `git` | [`skills/git/gitlab`](skills/git/gitlab) | GitLab 仓库、Merge Request、Issue、Pipeline、Release，以及 `glab` CLI 命令组合 |
| `golang` | `developer` | [`skills/developer/golang`](skills/developer/golang) | Go 代码规范、Effective Go、错误处理、并发、测试、模块管理 |
| `backend` | `developer` | [`skills/developer/backend`](skills/developer/backend) | Go 后端项目结构、分层职责、命名和模块组织 |
| `shadcn-vue` | `developer` | [`skills/developer/shadcn-vue`](skills/developer/shadcn-vue) | shadcn-vue / Reka UI 组件安装、使用和 API 参考 |
| `apple design` | `designer` | [`skills/designer/apple`](skills/designer/apple) | Apple 风格 UI 设计、层级、布局、颜色、字体、动效和组件原则 |

## 项目目录结构

```text
.
├── .agents/plugins/         # Codex marketplace 入口
├── .claude/plugins/         # Claude Code marketplace 入口
├── agents/                  # Agent 角色定义，如 frontend / backend / cr / designer
├── commands/                # Slash command 风格文档，如 git-commit、git-rebase
├── config/                  # MCP、LSP、hooks 配置
├── plugins/                 # 可发布插件，每个插件包含自己的 manifest
│   ├── git/
│   ├── developer/
│   └── designer/
├── rules/                   # 编码规范，如 Go rules
├── scripts/                 # 生成脚本和维护工具
└── skills/                  # AI Agent Skills 与 references
    ├── git/
    ├── developer/
    └── designer/
```

## 许可证

本项目使用 [Apache-2.0](LICENSE) 许可证。
