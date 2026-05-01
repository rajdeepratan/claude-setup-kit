---
name: /code
description: End-to-end development workflow — gather requirements, plan, confirm, branch, implement, verify, review, push, PR. Uses superpowers skills at each phase when installed.
preflight: superpowers
---

**Preflight:** before reading anything else, open `{{INSTALL_PATH}}/claude-setup-preflight.md` and run the **Superpowers Check**.

Then read the following files in full — together they are your complete workflow guide:

- {{INSTALL_PATH}}/claude-setup-workflow.md
- {{INSTALL_PATH}}/claude-setup-workflow-agents.md

You MUST follow every phase in order. Do not skip phases. Do not combine phases.

**Entry:** Ask the user: **"What do you want to build, fix, or change?"**

Then begin Phase 1 — the workflow guide handles the auto-classification (trivial vs full) and decides whether `superpowers:brainstorming` applies. Do not invoke brainstorming unconditionally; let Phase 1 make that call.

The same classification also governs Graphify usage when installed: **full flow** consults the code graph (~10–25k tokens saved on real work); **trivial path** skips it (load overhead exceeds value on tiny edits). When announcing the classification to the user (per Phase 1), this is part of what the decision means.

**Mandatory gates** — stop and wait for the user at:
1. **Phase 3** — plan confirmation
2. **Phase 4** — branch decision (same / new + base + name)
3. **Phase 8** — PR target branch and reviewers
4. **Phase 10** — branch cleanup after merge

**Superpowers skills per phase (if superpowers is installed — use the `Skill` tool, do not paraphrase):**
- Phase 1 — `superpowers:brainstorming` (full path only — skipped on the trivial auto-detect path)
- Phase 2 — `superpowers:writing-plans`
- Phase 4 — `superpowers:using-git-worktrees` (when isolation is warranted)
- Phase 5 — **exactly one** of: `superpowers:systematic-debugging` (bug) · `superpowers:subagent-driven-development` (parallel units) · `superpowers:test-driven-development` (everything else testable). See Phase 5 table in the workflow file.
- Phase 6 — `superpowers:verification-before-completion`
- Phase 7 — `superpowers:requesting-code-review`
- Phase 8 — `superpowers:finishing-a-development-branch`
- Phase 9 — `superpowers:receiving-code-review`
- Phase 10 — (no skill; `git` agent handles the cleanup)

If superpowers is not installed, the workflow still runs — the skill steps degrade to following the written phase instructions without Skill tool invocations.

Follow the workflow file as the source of truth for phase details and success criteria.
