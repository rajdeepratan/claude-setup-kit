---
name: /investigate
description: Research-only flow — reproduce and root-cause a bug or suspected issue. Produces a findings report. No branch, no PR, no code changes.
preflight: superpowers
---

**Preflight:** before reading anything else, open `{{INSTALL_PATH}}/claude-setup-preflight.md` and run the **Superpowers Check**.

Then read the following files in full:

- {{INSTALL_PATH}}/claude-setup-workflow-investigation.md
- {{INSTALL_PATH}}/claude-setup-workflow-agents.md

This command is **read-only**. Do not edit application code. Do not create branches. Do not open PRs. The deliverable is a findings report.

## Entry

The user invoked `/investigate` — the argument (if any) may be:
- A free-form symptom description
- A bug report or issue reference
- Nothing → ask: **"What's the symptom you want me to investigate?"**

**Begin Phase I1 — Investigation Intake** from the workflow doc's Investigation Flow section.

## Phases

- **I1 — Investigation Intake:** parse input, extract expected vs. actual behavior, ask clarifying questions
- **I2 — Investigate (read-only):** invoke `superpowers:systematic-debugging` (if installed); reproduce, bisect, trace, read code. **No edits to application code.**
- **I3 — Report & Hand-off:** produce findings report, write to file, print in chat

## Findings report — required sections

- **Summary** — one-line conclusion (confirmed / not reproducible / intended behavior / needs more info)
- **Reproduction** — exact steps, or "unable to reproduce" with what was tried
- **Root cause** — what's actually happening (or best hypothesis)
- **Affected scope** — which versions, environments, users
- **Suggested next step** — fix approach, deferral rationale, or further investigation needed

## Output

Write the report to a file AND print it in chat: `.claude/investigations/investigation-<YYYY-MM-DD-HHMM>.md`. Create `.claude/investigations/` if it doesn't exist.

## Hand-off

End with:
> *"Investigation complete. Want me to fix this? Run `/code` to start the fix."*

Follow `{{INSTALL_PATH}}/claude-setup-workflow-investigation.md` as the source of truth.
