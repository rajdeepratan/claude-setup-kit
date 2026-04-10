---
name: Claude Setup Instructions
description: Entry point for setting up CLAUDE.md, agents, rules, and skills in any repo — golden rules, creation order, and verification
---

# Claude Setup Instructions

Reference this file whenever asked to create `CLAUDE.md`, agents, rules, or skills in any repo.

> **Also read:** [`claude-setup-workflow.md`](claude-setup-workflow.md) — required companion file covering the end-to-end ticket-to-PR workflow. Read both before proceeding.

---

## Golden Rules (always enforced)

- **Every `.md` file — including this one — must stay under 200 lines.** Split into focused files if exceeded.
- `CLAUDE.md` → repo root. Agents / rules / skills → inside `.claude/` only. Never in root.
- Rules and skills must reflect **actual patterns in this codebase**, not generic best practices.
- Agent files reference **directories** (`.claude/rules/`), never specific file paths — they go stale.
- No stale references — if a file is renamed or split, update every file that pointed to it.
- `CLAUDE.md` Project References table must list every rule and skill file by name.

---

## File Structure

| File | Location |
|---|---|
| `CLAUDE.md` | Repo root |
| Agents | `.claude/agents/*.md` |
| Rules | `.claude/rules/*.md` |
| Skills | `.claude/skills/*.md` |
| Commands | `.claude/commands/*.md` |

---

## Creation Order

Follow this order — each step depends on the previous:

1. Understand the codebase (see Step 1 below)
2. Ask clarifying questions (see Step 2 below)
3. Create rule files → see [`claude-setup-rules.md`](claude-setup-rules.md)
4. Create skill files → see [`claude-setup-skills.md`](claude-setup-skills.md)
5. Create agent files → see [`claude-setup-agents.md`](claude-setup-agents.md)
6. Create command files → `.claude/commands/` (see Step 6 below)
7. Create `CLAUDE.md` last → see [`claude-setup-claude-md.md`](claude-setup-claude-md.md)
8. Verify (see Step 8 below)

---

## Step 1 — Understand the Codebase

Read the repo before writing anything. Identify:

- **Language, runtime, framework** and primary libraries (state, HTTP, testing, UI, database)
- **Project structure** — monorepo? multiple apps? where is the main work target?
- **Existing patterns** — shared abstractions, naming conventions, import resolution
- **Build & dev commands** — install, dev, build, test, lint

Read: manifest files, config files, and representative source files across different layers.

**If it's a monorepo:** create one `CLAUDE.md` at the repo root (shared conventions, global agents, repo map) and one `CLAUDE.md` per app (app-specific stack, commands, rules, skills, and agents). Claude Code reads `CLAUDE.md` files and `.claude/` folders up the directory tree — place each file at the level where its context applies:

| What | Root | Per-app |
|---|---|---|
| `CLAUDE.md` | Repo overview, shared rules, links to apps | App-specific stack, commands, rules, skills, and agents |
| `.claude/agents/` | Global agents: `git`, `code-reviewer` | Specialist agents: `frontend-developer`, `api-builder`, `debugger`, etc. |
| `.claude/rules/` | Shared conventions (git, commit style) | App-specific coding standards |
| `.claude/skills/` | — | App-specific recipes |
| `.claude/commands/` | Shared commands (e.g. `/setup-claude`) | App-specific commands (e.g. `/run-checks`, `/add-metric`) |

---

## Step 2 — Ask Clarifying Questions

Ask before writing if any of the following are unclear:

- Is this a monorepo with multiple apps, or a single-app repo?
- What is this repo's primary purpose and who uses it?
- What are the most common day-to-day developer tasks?
- Are there workflows complex enough to warrant a specialist agent?
- Any team conventions or rules not visible from reading the code?

Do not guess — a wrong assumption produces misleading documentation.

---

## Step 6 — Custom Slash Commands (`.claude/commands/`)

Slash commands are shortcuts for workflows you trigger repeatedly in Claude Code (`/command-name`). Each `.md` file in `.claude/commands/` becomes one command.

**Create a command when:** a workflow is triggered often and has a fixed sequence of steps (e.g. `/review-pr`, `/add-metric`, `/run-checks`). Each command file must have a clear one-line purpose, the exact steps to follow, and be named in `kebab-case`.

**Do not create commands for:** one-off tasks or anything a naturally invoked agent already handles.

---

## Step 8 — Verify

```bash
# No file exceeds 200 lines
wc -l CLAUDE.md .claude/**/*.md

# No stale file references
grep -r "rules\.md\|skills\.md\|agents\.md" CLAUDE.md .claude/

# Every file listed in CLAUDE.md Project References actually exists
# (manually cross-check the table in CLAUDE.md against ls .claude/rules/ and ls .claude/skills/)
```

Fix anything found before finishing.

---

## Updating an Existing Setup

Whether adding to a partially set up repo or making ongoing updates to a complete one:

1. Read every affected file in full before touching anything
2. Identify gaps — missing agents, outdated rules, incomplete CLAUDE.md sections
3. Do not overwrite files wholesale — edit to fill gaps and preserve what is correct
4. New rule/skill/agent added → update `CLAUDE.md` Project References table
5. File renamed or split → grep for all references and update them
6. Always re-run the verify step after any change
7. If a rule file no longer applies, delete it and remove it from the CLAUDE.md Project References table

**Triggers for updating:** new major dependency adopted, team agrees on a new pattern, an agent consistently produces wrong output (signals a rule gap), a skill references files that have moved, or a significant refactor changes how a layer is structured.

## When to Split a File

Split at 200 lines by meaning — by phase (scaffold vs wiring), by concern (frontend vs backend), or by frequency (common vs rare tasks). Name splits clearly: `add-metric-scaffold.md` + `add-metric-wiring.md`, not `add-metric-part1.md`.

## What NOT to Put in These Files

| Don't put this here | It belongs here instead |
|---|---|
| Step-by-step recipes | Skills file |
| Coding standards | Rules file |
| Project history / decisions | Git commit messages / ADRs |
| Edge cases and exceptions | Inline code comments |
| Invented patterns not in the codebase | Nowhere — don't invent |
