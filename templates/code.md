---
name: /code
description: End-to-end development workflow — gather requirements, plan, confirm, branch, implement, verify, review, push, PR. Uses superpowers skills at each phase.
---

Read the following file in full before doing anything else — it is your complete workflow guide:

- {{INSTALL_PATH}}/claude-setup-workflow.md

You MUST follow every phase in order. Do not skip phases. Do not combine phases.

**Entry:** Ask the user: **"What do you want to build, fix, or change?"**

Then invoke the `superpowers:brainstorming` skill via the `Skill` tool to begin Phase 1 (Planning).

**Mandatory gates** — stop and wait for the user at:
1. **Phase 3** — plan confirmation
2. **Phase 4** — branch decision (same / new + base + name)
3. **Phase 8** — PR target branch and reviewers

**Skills to invoke at each phase** (use the `Skill` tool — do not paraphrase):
- Phase 1 — `superpowers:brainstorming`
- Phase 2 — `superpowers:writing-plans`
- Phase 4 — `superpowers:using-git-worktrees` (when isolation is warranted)
- Phase 5 — `superpowers:test-driven-development` + `superpowers:subagent-driven-development` (parallel tasks) + `superpowers:systematic-debugging` (bugfix tasks)
- Phase 6 — `superpowers:verification-before-completion`
- Phase 7 — `superpowers:requesting-code-review`
- Phase 8 — `superpowers:finishing-a-development-branch`
- Phase 9 — `superpowers:receiving-code-review`

Follow the workflow file as the source of truth for phase details and success criteria.
