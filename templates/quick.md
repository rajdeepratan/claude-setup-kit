---
name: /quick
description: Lean development workflow for small changes — skips brainstorming, uses a minimal plan, and replaces the agent-driven Phase 7 code review with an inline self-review checklist. Keeps every user gate (plan confirmation, branch, PR, cleanup) and Phase 6 lint/test/build verification. Use this when the full /code ceremony is overkill but you still want safety rails on what leaves your machine.
preflight: superpowers
---

**Preflight:** before reading anything else, open `{{INSTALL_PATH}}/claude-setup-preflight.md` and run the **Superpowers Check**.

Then read the following files in full:

- {{INSTALL_PATH}}/claude-setup-workflow.md
- {{INSTALL_PATH}}/claude-setup-workflow-agents.md

You follow the same ten phases as `/code`, with the **Lean-mode overrides** below applied on top. Do not skip any phase not listed in the table — especially not the user gates.

## What `/quick` is for

Small, well-scoped changes where the full `/code` ceremony is overkill: single-file fixes, copy changes, config tweaks, renames, minor refactors touching ≤ 2 files.

**Not for:** new abstractions, work that touches multiple layers, ambiguous requirements, bug fixes where the root cause isn't already understood (use `/code` so `superpowers:systematic-debugging` runs in Phase 5).

`/quick` **does not auto-escalate to `/code`**. If you're unsure, start with `/code` — its fast path already handles trivial tasks without the ceremony.

**Code graph (Graphify) on `/quick`:** skip it. If Graphify is installed and its PreToolUse hook would normally surface a graph summary before Glob/Grep, that's fine — but do not read `GRAPH_REPORT.md` proactively, do not run graph queries, and **do not run the freshness check** described in `claude-setup-graph.md` Runtime section. The overhead (~2–5k tokens, plus ~50 for the freshness check) exceeds the value on tasks small enough to reach for `/quick`.

**`.claude/` coverage check on `/quick`:** also skipped. The coverage check (`claude-setup-coverage.md`) detects when a feature introduces a new domain that needs new agents/rules/`CLAUDE.md` updates. Tasks small enough for `/quick` (typos, copy changes, single-file refactors) don't introduce new domains by definition — running the matrix scan would just be overhead. If the change really does introduce a new domain, that's a signal to restart with `/code`.

## Entry

Open with: **"What do you want to build, fix, or change? (Lean mode — I'll skip brainstorming and go straight to a short plan.)"**

## Lean-mode overrides

| Phase | Standard `/code` behaviour | `/quick` override |
|---|---|---|
| **1 Intake** | `superpowers:brainstorming` | **SKIP** — go straight to Phase 2 with the user's description as-is |
| **2 Plan** | Full template: Changes, Affected surface, Env vars, Breaking changes, Risks, Test strategy | **LEAN** — include only **Changes** and **Test strategy**. If a section genuinely applies (e.g. a new env var was added), include it; otherwise omit it. Do not write "N/A" — a missing section *is* the N/A. |
| **3 Confirm plan** | User gate | **KEEP** |
| **4 Branch decision** | User gate | **KEEP** |
| **5 Implement** | TDD + systematic-debugging + subagent-driven as applicable | **ONE SKILL ONLY** — `superpowers:test-driven-development` if the change is testable, else straight implement. Do not invoke `systematic-debugging` (`/quick` is not a bug flow). Do not invoke `subagent-driven-development` (tasks are single-threaded by assumption) |
| **6 Verify** | lint + test + build | **KEEP** — cheap, catches real regressions |
| **7 Code review** | `code-reviewer` agent + `superpowers:requesting-code-review` | **REPLACE** with the inline self-review checklist below |
| **8 Push + PR** | User gate | **KEEP** |
| **9 PR feedback** | `superpowers:receiving-code-review` if reviewer comments | **KEEP** (applies only if human reviewer comments) |
| **10 Cleanup** | User gate | **KEEP** |

## Inline self-review checklist (replaces Phase 7 agent pass)

Before handing off to Phase 8, check every item against the staged diff:

- [ ] **Plan match** — every change listed in the Phase 2 plan is implemented; nothing extra has been added
- [ ] **No debug leftovers** — no `console.log` / `print` / commented-out blocks / `TODO` markers added in this change
- [ ] **No hardcoded secrets or environment values** — URLs, tokens, paths, account IDs all come from config/env
- [ ] **Repo conventions** — naming, file placement, and imports follow `.claude/rules/`
- [ ] **No unintended public-API change** — for a `/quick` task there should be none; if there is, stop and re-run as `/code`

If **any** item fails → return to Phase 5 and fix. If **2 or more** items fail on the same task → stop and tell the user: *"This change isn't as small as `/quick` assumed. Recommend restarting with `/code` so the full plan + code-reviewer pass runs."*

## When to bail out of `/quick` mid-run

Stop and recommend the user restart with `/code` if **any** of the following becomes true after Phase 2:

- The plan reveals more than 2 files, or a new module / new abstraction / new dependency
- Phase 6 verification fails 3 or more times in a row on the same issue
- The self-review checklist fails on 2+ items

Do not try to quietly do the `/code`-sized work under the `/quick` header — the user reached for `/quick` for a reason, and silently expanding scope violates that intent.

## Token footprint

`/quick` typically runs in the **40–70k token** range for a small change, vs **100–250k** for `/code` on the same task. Savings come from:
- skipping brainstorming (~10–15k)
- lean plan format (~3–5k)
- replacing the agent-driven Phase 7 review with the inline checklist (~10–25k)

The gates, Phase 5 TDD, and Phase 6 verification are preserved as-is — that's where most of the remaining token cost sits, and also most of the safety.
