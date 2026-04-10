# claude-setup-kit

Install Claude Code setup guides and the `/setup-claude` command on any machine — so you can set up Claude properly in any repo with a single command.

---

## What it does

Installs a collection of guide files that teach Claude how to set up a repo correctly — creating `CLAUDE.md`, agents, rules, skills, and commands that are tailored to the codebase.

After installation, open Claude Code in any repo and run `/setup-claude`. Claude will:

- Explore the repo and understand the tech stack
- Ask clarifying questions before writing anything
- Create rule files, skill files, and agent files in `.claude/`
- Create `CLAUDE.md` last, once everything else exists
- Handle both fresh setups and repos that already have a partial setup

---

## Installation

**One-time run (recommended):**
```bash
npx @rajdeepratan/claude-setup-kit
```

**Or install globally:**
```bash
npm install -g @rajdeepratan/claude-setup-kit
claude-setup-kit
```

Running it again on a machine that already has it installed will prompt you to update to the latest version.

---

## What gets installed

| What | Where |
|---|---|
| Guide files | `~/.claude/setup/claude-setup/` |
| `/setup-claude` command | `~/.claude/commands/setup-claude.md` |

The guide files cover:
- **Instructions** — golden rules, creation order, file structure, verification
- **Workflow** — end-to-end ticket-to-PR flow (branch → implement → review → push)
- **Rules** — how to create rule files for a repo
- **Skills** — how to create skill files for a repo
- **Agents** — how to create agent files, mandatory checklists, monorepo structure
- **CLAUDE.md** — how to create the entry point file for any repo

---

## Usage

Once installed, open Claude Code in any repo:

```
/setup-claude
```

Claude will detect whether the repo is fresh or already has a setup, and act accordingly.

---

## Monorepo support

`/setup-claude` handles monorepos — it creates a root `CLAUDE.md` with shared global agents, and a separate `CLAUDE.md` with app-specific rules, skills, and agents for each app.

---

## Updating

Re-run the install command to update your guide files to the latest version:

```bash
npx @rajdeepratan/claude-setup-kit
# → "claude-setup-kit is already installed. Update to the latest version? (y/n)"
```
