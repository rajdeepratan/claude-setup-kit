# claude-setup-kit

Install two slash commands for Claude Code — `/setup-claude` to scaffold any repo and `/code` to run a skill-driven, nine-phase development workflow end-to-end.

---

## What it does

Installs two slash commands and a collection of guide files that teach Claude how to set up a repo and how to run a full development loop.

**Commands installed:**

- **`/setup-claude`** — one-time repo setup. Explores the repo, asks clarifying questions, then creates `CLAUDE.md`, agents, rules, skills, and commands tailored to the codebase. Handles both fresh repos and partial setups.
- **`/code`** — end-to-end development workflow. Gathers requirements, proposes a plan, confirms with you, handles branching, implements, verifies (lint/test/build), runs code review, pushes, and opens the PR. Uses the `superpowers` skill library at each phase.

---

## Installation

**One-time run (recommended):**
```bash
npx claude-setup-kit
```

**Or install globally:**
```bash
npm install -g claude-setup-kit
claude-setup-kit
```

Running it again on a machine that already has it installed will prompt you to update to the latest version.

---

## What gets installed

| What | Where |
|---|---|
| Guide files | `~/.claude/setup/claude-setup/` |
| `/setup-claude` command | `~/.claude/commands/setup-claude.md` |
| `/code` command | `~/.claude/commands/code.md` |

The guide files cover:
- **Instructions** — golden rules, creation order, file structure, verification
- **Workflow** — the nine-phase `/code` loop (plan → confirm → branch → implement → verify → review → push+PR → PR feedback), with superpowers skills at each phase
- **Rules** — how to create rule files for a repo
- **Skills** — how to create skill files for a repo
- **Agents** — how to create agent files, mandatory checklists, monorepo structure
- **CLAUDE.md** — how to create the entry point file for any repo

---

## Usage

Once installed, open Claude Code in any repo:

**First time in a repo — set it up:**
```
/setup-claude
```
Claude will detect whether the repo is fresh or already has a setup, and act accordingly.

**Day-to-day work — run the development loop:**
```
/code
```
Claude will ask what you want to build, fix, or change, then walk through nine phases:

1. **Planning** — gather requirements (`superpowers:brainstorming`)
2. **Propose plan** — files changed, affected surface, env vars, risks (`superpowers:writing-plans`)
3. **Confirm** — you approve or send it back for re-planning
4. **Branch** — you choose: same branch or new (from where, named what)
5. **Implement** — TDD by default (`superpowers:test-driven-development`)
6. **Verify** — lint, tests, build must all pass (`superpowers:verification-before-completion`)
7. **Code review** — `code-reviewer` agent, max 3 retries before escalation
8. **Push + PR** — you choose target branch and reviewers
9. **PR feedback** — iterate on human reviewer comments (`superpowers:receiving-code-review`)

The loop runs hands-off except for the three gates: plan confirmation, branch decision, and PR target/reviewers.

---

## Monorepo support

`/setup-claude` handles monorepos — it creates a root `CLAUDE.md` with shared global agents, and a separate `CLAUDE.md` with app-specific rules, skills, and agents for each app.

---

## Updating

Re-run the install command to update your guide files to the latest version:

```bash
npx claude-setup-kit
# → "claude-setup-kit is already installed. Update to the latest version? (y/n)"
```
