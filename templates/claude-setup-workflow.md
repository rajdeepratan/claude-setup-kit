---
name: Claude Development Workflow
description: End-to-end workflow from Jira ticket to merged PR — intake, branching, implementation, review, and push
---

# Claude Development Workflow

This is the standard workflow every time a user shares a Jira ticket. Follow all phases in order.

---

## Phase 1 — Ticket Intake

1. User shares a Jira ticket (file, link, or pasted content)
2. Read and fully understand the ticket — acceptance criteria, scope, affected areas
3. If anything is unclear, ask the user targeted questions before proceeding
4. Do not start work until requirements are understood and confirmed
5. If the ticket scope is large (multiple unrelated concerns, touches many layers), flag it to the user and suggest splitting into smaller PRs — wait for their decision before proceeding

---

## Phase 2 — Branch Creation

1. Check for uncommitted or staged work in the repo — if any exists, warn the user before doing anything: **"There is uncommitted work in the repo. Please stash or commit it before I create a new branch."** Do not proceed until the working tree is clean.
2. Invoke the `git` agent to handle branching
3. Before creating, ask the user: **"Which branch should I create this from?"**
4. Once the user names the base branch, fetch the latest remote state and check if that branch is behind its remote tracking branch — if it is, warn the user: **"[branch] is behind its remote by N commit(s). Should I pull the latest before branching?"** Do not proceed until the user confirms or declines.
5. Name the branch following the pattern in `.claude/rules/git.md` (ticket ID + short description)

---

## Phase 3 — Implementation

1. Determine the ticket type and select the appropriate specialist agent automatically (see Agent Selection table below)
2. If no suitable agent exists → create it on the fly and inform the user:
   > "I created a `[name]` agent to handle this — saved to `.claude/agents/[name].md`"
3. Hand off to the agent. Claude selects agents autonomously — the user will never need to specify which agent to use
4. Multiple coding agents must always exist and be used — never rely on a single agent for all implementation work

---

## Phase 4 — Code Review

1. On implementation completion, invoke the `code-reviewer` agent automatically — no user prompt needed
2. Review must check:
   - No duplicate code
   - Proper component/module structure
   - Code quality and conventions match `.claude/rules/`
   - No leftover debug code, dead code, or temporary hacks
   - No breaking changes to public APIs, exported functions, or shared interfaces — if found, flag explicitly to the user before continuing
3. If review **fails** → return to the implementing agent with specific, actionable feedback and repeat from Phase 3
4. If the review fails **3 times in a row**, stop looping and escalate to the user: **"The code has failed review 3 times. Here are the outstanding issues: [list]. Please advise how you'd like to proceed."**
5. Loop until the review passes or the user intervenes

---

## Phase 5 — Build, Test & Lint Verification

1. Verify that lint, test, and build commands are all defined in `CLAUDE.md` — if any are missing, ask the user to provide them before continuing
2. If the implementation added new environment variables, ensure they are added to `.env.example` (or equivalent) before running any verification commands
3. Run the lint/format command defined in `CLAUDE.md` — fix all errors before continuing
4. Run the test command defined in `CLAUDE.md` — if tests fail, return to the implementing agent with the failure output and loop until all tests pass
5. Run the build command defined in `CLAUDE.md` — fix any build failures before proceeding
6. Do not push until lint, tests, and build all pass

---

## Phase 6 — Push & PR

1. Invoke the `git` agent to push the branch to GitHub
2. If the push is rejected because the remote has diverged, rebase the branch on top of the latest remote and resolve any merge conflicts — if a conflict cannot be resolved automatically, stop and ask the user to resolve it manually before continuing
3. Before creating the PR, always ask the user: **"Which branch should I target for this PR?"**
4. Create the PR only after the user confirms the target branch
5. PR description must follow this structure:
   - **Title:** `[TICKET-ID] Short description of the change`
   - **What:** What was changed and why
   - **How:** Brief summary of the approach taken
   - **Testing:** What was tested and how (unit, integration, manual)
   - **New env vars:** list any new environment variables added and their purpose (must also be added to `.env.example` or equivalent before pushing)
   - **Breaking changes:** explicitly call out any removed or changed public APIs, exports, or shared interfaces
   - **Checklist:** lint passes, tests pass, build passes, no console logs, no hardcoded values

---

## Phase 7 — PR Review Feedback (Human Reviewers)

If a teammate leaves review comments on the PR:

1. Read all comments in full before making any changes
2. Group comments by type:
   - **Must fix** — blocking issues, bugs, broken logic
   - **Should fix** — quality/convention issues the reviewer flagged
   - **Discuss** — opinions or suggestions that need a decision
3. For **Discuss** items, summarise them to the user and ask for a decision before touching code
4. For **Must fix** and **Should fix** items, invoke the appropriate agent to implement the changes
5. After changes are made, run the full Phase 5 verification (lint → test → build) again
6. Invoke `code-reviewer` agent again before pushing the update
7. Push the updated branch — the existing PR updates automatically, no new PR needed
8. If the same reviewer comments are not addressed after 2 iterations, escalate to the user: **"I've made 2 attempts to address [reviewer]'s comments but they remain unresolved. Please review and advise."**
9. Once the PR is approved, notify the user: **"The PR has been approved. Please merge when ready."** — do not merge autonomously unless the user explicitly asks

---

## Phase 8 — Hotfix Workflow

Use this flow only for urgent production bugs — not for regular tickets.

1. Confirm with the user: **"Is this a hotfix for production?"** — do not assume
2. Skip the normal ticket intake questions — move fast
3. Check for uncommitted work (same as Phase 2, step 1)
4. Invoke the `git` agent to branch directly from `main` or `production` (ask user which) — name the branch `hotfix/[short-description]` unless the user specifies a different convention
5. Invoke the `debugger` agent to investigate and fix the issue
6. Run Phase 5 verification (lint → test → build) — all must pass
7. Invoke `code-reviewer` — one pass only, no loop limit for hotfixes
8. Push and create PR — ask user for target branch (typically `main` or `production`)
9. After the hotfix PR is merged, ask the user: **"Should I backport this fix to the development branch as well?"** — if yes, cherry-pick the commit onto the dev branch and open a second PR

---

## Agent Selection Table

Claude must self-select the correct agent. The user will never specify.

| Ticket / task type | Agent to invoke |
|---|---|
| Frontend / UI / components | `frontend-developer` or equivalent |
| API / backend / services | `api-builder` or equivalent |
| Database / migrations / queries | `database-developer` or equivalent |
| Tests only | `test-writer` or equivalent |
| Bug investigation and fix | `debugger` or equivalent |
| After any implementation | `code-reviewer` (always) |
| Branch, push, PR | `git` agent (always) |

If the required agent does not exist in `.claude/agents/`, create it and notify the user.

---

## Multiple Coding Agents — Mandatory

Always create more than one coding agent when setting up a repo. At minimum:

- `developer` — general-purpose fallback
- One specialist per major concern in the codebase (e.g. `frontend-developer`, `api-builder`, `test-writer`, `debugger`)

The `developer` agent is the last resort — invoke specialist agents first when the task clearly fits one.

---

## Self-Sufficiency Rules

- Claude selects agents based on ticket type — never ask the user which agent to use
- If a needed agent is missing, create it silently and notify the user after
- The full loop (intake → branch → implement → review → build → PR) runs without user intervention except for the two mandatory confirmations: **base branch** and **PR target branch**
