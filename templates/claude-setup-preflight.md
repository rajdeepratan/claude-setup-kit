---
name: Claude Setup — Preflight Checks
description: Shared preflight checks for superpowers — run before any command that depends on it. Detects missing dependencies, explains why they matter, offers the canonical install command, and proceeds or runs degraded based on the user's choice.
---

# Preflight Checks

This file is loaded by every command that depends on an external tool the user must install separately. The goal is simple: **never let a command run silently in a degraded state**. If a required dependency is missing, ask the user once, explain why, offer to install, and either proceed with full capability or continue explicitly degraded.

Each command's frontmatter notes which checks to run. Do not run a check a command did not ask for.

**Session-scoped answers.** If the user declines to install, remember that choice for the rest of the current conversation and do not re-ask. Re-asking on every command invocation is noise.

---

## Superpowers Check

Run this check when a command's frontmatter lists `preflight: superpowers`.

### Why it matters (show this to the user verbatim when prompting)

> **Why superpowers matters for this workflow:** the kit's 10-phase flow depends on five skills from the `superpowers` plugin:
>
> - `superpowers:brainstorming` — shapes the requirements gathering in Phase 1
> - `superpowers:writing-plans` — structures the Phase 2 plan
> - `superpowers:test-driven-development` — enforces red→green in Phase 5
> - `superpowers:systematic-debugging` — reproduces and root-causes before a bug fix is written
> - `superpowers:verification-before-completion` — requires evidence, not claims, in Phase 6
>
> Without superpowers, the phases still run — but the discipline layer is gone. For bug fixes in particular, you lose the "failing regression test must exist and must have failed before the fix" guarantee.

### Detection

Check for the superpowers plugin directory at `~/.claude/plugins/cache/*/superpowers`. Use the `Bash` tool:

```bash
ls ~/.claude/plugins/cache/*/superpowers 2>/dev/null && echo "INSTALLED" || echo "MISSING"
```

- `INSTALLED` → proceed. Do not say anything about superpowers.
- `MISSING` → continue to the install flow below.

### Install flow

1. Print the **Why it matters** block above.
2. Ask: **"Install superpowers now? (y/n)"**
3. If `y`:
   - Tell the user the exact command to run themselves in the Claude Code chat (Claude cannot invoke `/plugin install` on the user's behalf):
     > *"Please type this into the chat, then tell me when it's finished:*
     > `/plugin install superpowers@claude-plugins-official`*"*
   - Wait for the user to confirm the install completed.
   - Re-run the detection step. If it now reports `INSTALLED`, proceed with full capability. If still `MISSING`, say so and ask whether to continue in degraded mode or abort.
4. If `n`:
   - Warn once: **"Proceeding in degraded mode. These phases will skip their skill invocation: Phase 1 brainstorming, Phase 2 plan structuring, Phase 5 TDD / systematic debugging, Phase 6 verification. For bug fixes this means no enforced red→green regression test."**
   - Remember the decline for the rest of the session. Do not re-ask.

---

## What to do when a check blocks a command

- **Superpowers declined** → run the command with every `superpowers:` skill call replaced by its written fallback from the workflow files. State the degradation once at the top of the run. Never silently skip a skill.
