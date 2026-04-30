---
name: /setup-claude
description: One-time repo setup — explore the codebase, ask clarifying questions, and create CLAUDE.md plus tailored rules, skills, agents, commands, and hooks in .claude/. Handles both fresh repos and partial setups.
preflight: superpowers
---

**Preflight:** before reading anything else, open `{{INSTALL_PATH}}/claude-setup-preflight.md` and run the **Superpowers Check**.

Then read all of the following files in full — together they are your complete guide:

- {{INSTALL_PATH}}/claude-setup-instructions.md
- {{INSTALL_PATH}}/claude-setup-workflow.md
- {{INSTALL_PATH}}/claude-setup-workflow-investigation.md
- {{INSTALL_PATH}}/claude-setup-workflow-agents.md
- {{INSTALL_PATH}}/claude-setup-rules.md
- {{INSTALL_PATH}}/claude-setup-skills.md
- {{INSTALL_PATH}}/claude-setup-agents.md
- {{INSTALL_PATH}}/claude-setup-commands.md
- {{INSTALL_PATH}}/claude-setup-hooks.md
- {{INSTALL_PATH}}/claude-setup-claude-md.md
- {{INSTALL_PATH}}/claude-setup-memory.md

Also read `{{INSTALL_PATH}}/meta.json` — it contains the kit's `version`, `package`, and `installed_at`. You will stamp these into every file you create or refresh as a `generated_by` / `generated_at` marker (see § Generated File Markers in `claude-setup-instructions.md` for the exact format).

**Running kit:** `{{KIT_PACKAGE}}@{{KIT_VERSION}}` — this is what installed the slash command you just ran. If `meta.json` disagrees with this, use `meta.json` (it's the source of truth for what's actually on disk in the guides directory).

Do not skip steps. Do not write any file before finishing the clarifying questions step.

**Before anything else — detect the current state:**
Check whether `.claude/` and `CLAUDE.md` already exist in the repo.

- If they **do not exist** → follow the **Fresh Setup** flow below
- If they **already exist** → follow the **Update Existing Setup** flow below

---

**Fresh Setup — single-app repo:**
1. Explore the repo — tech stack, folder structure, key abstractions, build/test/lint commands
2. Ask the user any clarifying questions before writing any files
3. Create rule files → `.claude/rules/`
4. Create skill files → `.claude/skills/`
5. Create agent files → `.claude/agents/` — always more than one coding agent
6. Create command files → `.claude/commands/` if needed
7. Create `CLAUDE.md` in the repo root last
8. Run the verify step

**Fresh Setup — monorepo:**
1. Explore the repo — understand all apps, shared code, and root structure
2. Ask the user any clarifying questions (including which apps need setup)
3. At root: create shared rules, global agents (`git`, `code-reviewer`), and root `CLAUDE.md`
4. For each app: create app-specific rules, skills, specialist agents, and per-app `CLAUDE.md`
5. Create commands at root or per-app level as appropriate
6. Run the verify step for root and each app

**Update Existing Setup:**
1. Read every existing file in `.claude/` and `CLAUDE.md` in full before touching anything
2. For each file, inspect its `generated_by` marker (YAML frontmatter for `.claude/` files, HTML comment at the top for `CLAUDE.md`):
   - **Marker present, version matches current kit** → safe to refresh the generated content
   - **Marker present, version older than current kit** → kit-generated but stale; propose a refresh and ask the user before overwriting
   - **Marker missing or edited** → user-owned; edit to fill gaps only, never overwrite
3. Explore the repo to understand what has changed since the setup was created
4. Ask the user any clarifying questions before making changes
5. Identify gaps — missing agents, outdated rules, incomplete CLAUDE.md sections
6. Do not overwrite user-owned files wholesale — edit to fill gaps and preserve what is correct
7. Every file you create or refresh gets a fresh marker using the current kit version and timestamp from `meta.json`
8. Update `CLAUDE.md` Project References table to reflect actual state of `.claude/`
9. Run the verify step
