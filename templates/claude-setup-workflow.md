---
name: Claude Development Workflow
description: End-to-end workflow invoked by /code — from requirements gathering through merged PR. Nine phases, skill-driven, with mandatory user gates.
---

# Claude Development Workflow

This is the standard workflow every time the user runs `/code`. Follow all phases in order. Each phase names the superpowers skill to invoke — you MUST invoke the skill via the `Skill` tool, not paraphrase it from memory.

The full loop runs without user intervention **except for the three mandatory gates**: plan confirmation (Phase 3), branch decision (Phase 4), and PR target (Phase 8).

---

## Phase 1 — Planning (Requirements Gathering)

**Skill:** `superpowers:brainstorming`

1. Open with: **"What do you want to build, fix, or change?"**
2. Invoke `superpowers:brainstorming` to explore intent, scope, and requirements — do not skip this even for "small" tasks
3. Cover: the goal, the user-visible behavior, constraints, out-of-scope items, and success criteria
4. Ask targeted clarifying questions until the request is unambiguous
5. Do not propose a plan yet

---

## Phase 2 — Propose Plan

**Skill:** `superpowers:writing-plans`

1. Invoke `superpowers:writing-plans` to produce a structured plan
2. The plan must cover, at minimum:
   - **Changes:** files/modules to be added, modified, or removed
   - **Affected surface:** public APIs, exported functions, shared interfaces, DB schemas, migrations
   - **Env vars:** any new variables (must also be added to `.env.example` or equivalent)
   - **Breaking changes:** called out explicitly
   - **Risks & edge cases:** what could go wrong, what needs extra care
   - **Test strategy:** what will be tested and how
3. Present the plan to the user in full — do not truncate

---

## Phase 3 — Confirm Plan (Gate)

1. Ask the user: **"Do you want to proceed with this plan? If not, what should change?"**
2. If the user approves → continue to Phase 4
3. If the user requests changes → return to Phase 1 with the new information and re-plan. Do not edit the plan in place without re-running Phase 1 — new info may change the scope
4. Do not start any code changes until the user explicitly approves the plan

---

## Phase 4 — Branch Decision (Gate)

**Skill:** `superpowers:using-git-worktrees` (when isolation is warranted)

1. Ask the user: **"Should I work on the current branch, or create a new one?"**
2. If **current branch**:
   - Verify the current branch is not `main` / `master` / `production` — if it is, warn the user and require explicit override
   - Check the working tree is clean — if not, warn: **"There is uncommitted work. Please stash or commit before I continue."** Do not proceed until clean
3. If **new branch**:
   - Ask: **"Which branch should I create it from?"** and **"What should the new branch be named?"**
   - Verify the working tree is clean (same check as above)
   - Fetch the latest remote state; if the base branch is behind its remote, warn: **"[branch] is behind its remote by N commit(s). Should I pull the latest before branching?"** Wait for confirmation
   - Follow the naming convention in `.claude/rules/git.md` if one exists
4. For larger changes or risky refactors, consider `superpowers:using-git-worktrees` to isolate the workspace
5. Invoke the `git` agent to execute the branching

---

## Phase 5 — Implement

**Skills:**
- `superpowers:test-driven-development` — default for any code change
- `superpowers:subagent-driven-development` — when the plan has independent tasks that can run in parallel
- `superpowers:systematic-debugging` — for bug investigation/fix tasks

1. Select the appropriate specialist coding agent based on the task type (see Agent Selection table). If no suitable agent exists, create it on the fly and notify the user:
   > "I created a `[name]` agent to handle this — saved to `.claude/agents/[name].md`"
2. Default to `superpowers:test-driven-development`. Soft-gate: skip TDD only if the user explicitly opts out, or the change is not testable (docs, config, infra-only tweaks). State which applies.
3. For bugfix tasks, invoke `superpowers:systematic-debugging` before writing any fix
4. For plans with 2+ independent tasks, invoke `superpowers:subagent-driven-development` to parallelize
5. Implement strictly to the approved plan — if you discover the plan is wrong mid-implementation, stop and return to Phase 1

---

## Phase 6 — Verify (Lint, Test, Build)

**Skill:** `superpowers:verification-before-completion`

1. Invoke `superpowers:verification-before-completion` — no success claims without evidence
2. Verify that lint, test, and build commands are defined in `CLAUDE.md`. If any are missing, ask the user for them before continuing
3. If new env vars were added, confirm they are in `.env.example` (or equivalent) before running anything
4. Run lint/format — fix all errors before continuing
5. Run tests — if any fail, return to Phase 5 with the failure output and loop until all pass
6. Run build — fix any failures before proceeding
7. Do not continue to review until lint, tests, and build all pass with evidence

---

## Phase 7 — Code Review

**Skill:** `superpowers:requesting-code-review`

1. Invoke `superpowers:requesting-code-review`, then hand off to the `code-reviewer` agent
2. Review must check:
   - Matches the approved plan — no scope creep, no missing pieces
   - No duplicate code, no dead code, no debug leftovers, no hardcoded secrets
   - Follows `.claude/rules/` and the user's coding style
   - No unintended breaking changes to public APIs, exports, or shared interfaces
   - Production-ready: error handling at boundaries, no unsafe assumptions
3. If review **fails** → return to Phase 5 with specific, actionable feedback
4. If review fails **3 times in a row**, stop looping and escalate: **"The code has failed review 3 times. Outstanding issues: [list]. Please advise."**
5. Loop until the review passes or the user intervenes

---

## Phase 8 — Push & PR (Gate)

**Skill:** `superpowers:finishing-a-development-branch`

1. Invoke `superpowers:finishing-a-development-branch` to structure the completion
2. Invoke the `git` agent to push the branch
3. If the push is rejected because the remote has diverged, rebase on top of the latest remote. If a conflict cannot be resolved automatically, stop and ask the user to resolve it manually
4. Ask the user: **"Which branch should I target for this PR?"** — do not guess
5. Ask the user: **"Who should I assign as reviewer(s)?"** — or read from a repo config if one exists. Do not guess
6. Create the PR with this structure:
   - **Title:** short, imperative — under 70 chars
   - **What:** what changed and why
   - **How:** brief summary of the approach
   - **Testing:** unit / integration / manual coverage
   - **New env vars:** list any added, with purpose (must also be in `.env.example`)
   - **Breaking changes:** explicit call-out of any API/export/interface changes
   - **Checklist:** lint ✓, tests ✓, build ✓, no console logs, no hardcoded values

---

## Phase 9 — PR Review Feedback

**Skill:** `superpowers:receiving-code-review`

If a human reviewer leaves comments on the PR:

1. Invoke `superpowers:receiving-code-review` — apply technical rigor, not performative agreement
2. Read all comments in full before making any changes
3. Group comments by type:
   - **Must fix** — blocking issues, bugs, broken logic
   - **Should fix** — quality/convention issues
   - **Discuss** — opinions or suggestions requiring a decision
4. For **Discuss** items, summarise to the user and ask for a decision before touching code
5. For **Must fix** and **Should fix** items, return to Phase 5 and implement
6. Re-run Phase 6 (verify) and Phase 7 (code review) before pushing the update
7. Push the updated branch — the existing PR updates automatically
8. If the same reviewer comments remain unresolved after 2 iterations, escalate: **"I've made 2 attempts to address [reviewer]'s comments but they remain unresolved. Please review and advise."**
9. Once the PR is approved, notify: **"The PR has been approved. Please merge when ready."** — do not merge autonomously unless the user explicitly asks

---

## Agent Selection Table

Claude self-selects the correct agent based on the task type. The user will never specify.

| Task type | Agent |
|---|---|
| Frontend / UI / components | `frontend-developer` or equivalent |
| API / backend / services | `api-builder` or equivalent |
| Database / migrations / queries | `database-developer` or equivalent |
| Tests only | `test-writer` or equivalent |
| Bug investigation and fix | `debugger` or equivalent |
| After any implementation | `code-reviewer` (always) |
| Branch, push, PR | `git` agent (always) |

If the required agent does not exist in `.claude/agents/`, create it on the fly and notify the user.

---

## Multiple Coding Agents — Mandatory

Always create more than one coding agent when setting up a repo. At minimum:

- `developer` — general-purpose fallback
- One specialist per major concern in the codebase (e.g. `frontend-developer`, `api-builder`, `test-writer`, `debugger`)

The `developer` agent is the last resort — invoke specialist agents first when the task clearly fits one.

---

## Self-Sufficiency Rules

- Claude selects agents based on task type — never ask the user which agent to use
- If a needed agent is missing, create it silently and notify the user after
- The full loop runs without user intervention except for the three mandatory gates: **plan confirmation** (Phase 3), **branch decision** (Phase 4), and **PR target + reviewers** (Phase 8)
- Every phase with a named skill MUST invoke that skill via the `Skill` tool before acting — do not paraphrase from memory
