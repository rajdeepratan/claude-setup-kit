---
name: Claude Setup — CLAUDE.md
description: How to create CLAUDE.md at the repo root when setting up Claude for a repo
---

# Creating CLAUDE.md

`CLAUDE.md` is the entry point for every agent. Keep it under 200 lines — it is a map, not a manual.

Create this **last** — after all rules, skills, and agents exist — so the references table is accurate.

---

## Required Sections (in this order)

1. **Agent orchestration table** — user intent phrases mapped to agent names (put this first)
2. **Project References table** — every rule and skill file listed by path
3. **Project overview** — what this repo does and who uses it
4. **Tech stack table** — language, framework, key libraries, package manager
5. **Commands** — install, dev, build, test, lint — must be **exact runnable commands**, not descriptions (agents execute these directly without asking)
6. **Project structure** — annotated directory tree of the main source
7. **Architecture overview** — how pieces connect; key shared abstractions
8. **Non-negotiable rules summary** — 6–10 bullets linking to `.claude/rules/` for detail

---

## Agent Orchestration Table

Maps natural language intent to agent names so Claude routes correctly:

```markdown
| When the user says... | Invoke |
|---|---|
| shares a Jira ticket / "work on [TICKET-ID]" | full workflow (intake → branch → implement → review → push) |
| "add a feature", "implement", "build" | `developer` or specialist |
| "fix a bug", "investigate", "debug" | `debugger` |
| "review", "check the code" | `code-reviewer` |
| "push", "create a PR", "branch" | `git` |
| "write tests", "add coverage" | `test-writer` |
| anything else | `developer` |
```

The catch-all row (`anything else → developer`) is **mandatory** and must always be the last row — it ensures every request has a handler even if it doesn't match a specific pattern.

---

## Project References Table

Lists every rule, skill, and agent file so agents know what exists:

```markdown
| Type | File |
|---|---|
| Rule | `.claude/rules/git.md` |
| Rule | `.claude/rules/typescript.md` |
| Skill | `.claude/skills/add-endpoint.md` |
| Agent | `.claude/agents/debugger.md` |
| Agent | `.claude/agents/frontend-developer.md` |
```

---

## If CLAUDE.md Exceeds 200 Lines

Move overflow content to a rule or skill file and replace it with a one-line link. Common offenders:

| Section that grows | Move it to |
|---|---|
| Architecture detail | `.claude/rules/architecture.md` |
| Complex commands / scripts | `.claude/rules/commands.md` |
| Onboarding notes | `.claude/rules/onboarding.md` |

Never truncate — always move and link.

---

## Monorepo — Per-app CLAUDE.md

Each app's `CLAUDE.md` is a complete, self-contained entry point for that app. Its agent orchestration table should only list the app's own specialist agents — **do not re-list `git` and `code-reviewer`**, they are global agents that live at the root and are inherited automatically.

```markdown
| When the user says... | Invoke |
|---|---|
| shares a Jira ticket / "work on [TICKET-ID]" | full workflow |
| "add a feature", "implement", "build" | `frontend-developer` |
| "fix a bug", "debug" | `debugger` |
| "write tests" | `test-writer` |
| anything else | `developer` |
```

The root `CLAUDE.md` orchestration table covers `git`, `code-reviewer`, and any cross-app workflows.

---

## Scope

- Summary only — detail belongs in rule or skill files, not here
- If a section grows past ~20 lines, move the detail to a rule or skill file and link it
- Agents read `CLAUDE.md` first — keep it fast to scan
