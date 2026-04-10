---
name: Claude Setup — Skill Files
description: How to create skill files in .claude/skills/ when setting up Claude for a repo
---

# Creating Skill Files

Skills = **step-by-step recipes** for the most common repeatable tasks.

Derive tasks from the repo's domain — think "add a new X", "create a Y", "wire up a Z". Examples: `add-endpoint`, `add-migration`, `add-page`, `add-metric`, `add-handler`.

## What Deserves a Skill

Create a skill when a task meets all three:
1. **Repeatable** — done regularly, not once
2. **Multi-step** — more than 2–3 non-obvious steps
3. **Pattern-dependent** — getting it wrong without the recipe would produce inconsistent code

If a task is trivial, one-off, or fully handled by an agent's built-in workflow — skip it.

---

## What Each Skill File Must Include

1. **Reference file to read first** — the rule or source file that governs this area
2. **Steps in dependency order** — what to do and in what sequence
3. **Code snippets** — using this repo's actual patterns, not generic examples
4. **Verify checklist** — how to confirm the task was done correctly

Split into `[name]-scaffold.md` / `[name]-wiring.md` if over 200 lines.

---

## File Skeleton

Every skill file must start with frontmatter:

```markdown
---
name: [skill name]
description: [one-line description of what this skill does]
---

## Before Starting

Read: [path to relevant rule or source file]

## Steps

1. [first step]
2. [second step]
...

## Verify

- [ ] [check one]
- [ ] [check two]
```

---

## Scope

- The 80% happy path only — edge cases belong in code comments, not skill files
- Derive tasks from what developers actually do in this repo
- Do not create skills for one-off tasks or anything already handled by an agent workflow
