---
name: Claude Setup Instructions
description: Entry point for setting up CLAUDE.md, agents, rules, and skills in any repo — golden rules, creation order, and verification
---

# Claude Setup Instructions

Reference this file whenever asked to create `CLAUDE.md`, agents, rules, or skills in any repo.

> **Also read:** [`claude-setup-workflow.md`](claude-setup-workflow.md) — required companion file covering the end-to-end intake-to-PR workflow. Read both before proceeding.

---

## Golden Rules (always enforced)

- **Every `.md` file — including this one — must stay under 200 lines.** Split into focused files if exceeded.
- `CLAUDE.md` → repo root. Agents / rules / skills → inside `.claude/` only. Never in root.
- Rules and skills must reflect **actual patterns in this codebase**, not generic best practices.
- Agent files reference **directories** (`.claude/rules/`), never specific file paths — they go stale.
- No stale references — if a file is renamed or split, update every file that pointed to it.
- `CLAUDE.md` Project References table must list every rule and skill file by name.
- **Every file you create or regenerate in `.claude/` or `CLAUDE.md` must carry a generated-by marker** (see below).

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

## Generated File Markers

Every file you write into a target repo's `.claude/` (rules, skills, agents, commands, hooks) and the root `CLAUDE.md` must include a marker that identifies the kit version that created it. This is what makes safe, non-destructive re-runs possible.

**Read the kit's version first:** the installer writes `meta.json` at the root of the guides directory (same folder as this file). Read it to get `version`, `package`, and `installed_at`. Use those values as the `generated_by` and `generated_at` fields.

**For files with YAML frontmatter** (rules, skills, agents, commands, hooks — anything with `---` fences), add these fields alongside `name` and `description`:

```yaml
---
name: <file name>
description: <one-line description>
generated_by: <package>@<version>
generated_at: <ISO 8601 timestamp>
---
```

**For `CLAUDE.md`** (which does not use YAML frontmatter), add an HTML comment as the very first line, then a blank line, then the normal content:

```markdown
<!-- generated_by: <package>@<version> generated_at: <ISO 8601 timestamp> -->

# <project name>
...
```

**Why these matter:**
- On re-run, the Update Existing Setup flow reads the markers to tell kit-generated files from user-edited ones. Files with no marker — or with a marker the user has changed — are treated as user content and never overwritten without asking.
- The version marker lets the flow detect drift: if the installed kit is newer than the marker in a file, that file is a candidate for a refresh.
- If the user removes or edits a marker, the file is treated as user-owned. That's the opt-out.

**Never write a marker claiming a version the kit didn't actually produce.** Read `meta.json` every time. Do not hard-code.

---

## Creation Order

Follow this order — each step depends on the previous:

1. Understand the codebase (see Step 1 below)
2. Ask clarifying questions (see Step 2 below)
3. Create rule files → see [`claude-setup-rules.md`](claude-setup-rules.md)
4. Create skill files → see [`claude-setup-skills.md`](claude-setup-skills.md)
5. Create agent files → see [`claude-setup-agents.md`](claude-setup-agents.md)
6. Create slash commands → see [`claude-setup-commands.md`](claude-setup-commands.md)
7. Configure hooks if team wants automated behaviors → see [`claude-setup-hooks.md`](claude-setup-hooks.md)
8. Create `CLAUDE.md` last → see [`claude-setup-claude-md.md`](claude-setup-claude-md.md)
9. Verify (see Step 9 below)

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

## Step 9 — Verify

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

1. Read `meta.json` from the guides directory to learn the **current** kit version
2. Read every affected file in full before touching anything
3. For each file in the target repo's `.claude/` and `CLAUDE.md`:
   - If the file has a `generated_by` marker **matching the current kit version** → safe to refresh the generated content
   - If the marker is from an **older kit version** → the file is kit-generated but stale. Propose a refresh; ask the user before overwriting
   - If the marker is **missing or edited** → treat as user-owned. Edit to fill gaps only; do not overwrite
4. Identify gaps — missing agents, outdated rules, incomplete CLAUDE.md sections
5. Do not overwrite user-owned files wholesale — edit to fill gaps and preserve what is correct
6. Every file you create or refresh gets a fresh marker with the current version and timestamp
7. New rule/skill/agent added → update `CLAUDE.md` Project References table
8. File renamed or split → grep for all references and update them
9. Always re-run the verify step after any change
10. If a rule file no longer applies, delete it and remove it from the CLAUDE.md Project References table

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
