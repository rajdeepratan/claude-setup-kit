Read all of the following files in full before doing anything else — together they are your complete guide:

- {{INSTALL_PATH}}/claude-setup-instructions.md
- {{INSTALL_PATH}}/claude-setup-workflow.md
- {{INSTALL_PATH}}/claude-setup-rules.md
- {{INSTALL_PATH}}/claude-setup-skills.md
- {{INSTALL_PATH}}/claude-setup-agents.md
- {{INSTALL_PATH}}/claude-setup-claude-md.md

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
2. Explore the repo to understand what has changed since the setup was created
3. Ask the user any clarifying questions before making changes
4. Identify gaps — missing agents, outdated rules, incomplete CLAUDE.md sections
5. Do not overwrite files wholesale — edit to fill gaps and preserve what is correct
6. Update `CLAUDE.md` Project References table to reflect actual state of `.claude/`
7. Run the verify step
