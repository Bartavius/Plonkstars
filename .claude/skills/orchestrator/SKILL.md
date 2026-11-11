---
name: orchestrator
description: Use when the user asks for a second opinion, says review this, or asks should I use /orchestrate, or you are weighing how much subagent delegation a task needs. Covers the control dial from direct work to full /orchestrate, one-writer-per-file discipline, and fresh-context review. Stays quiet for small, single-file changes.
---
<!-- Adapted from anish-sahoo/agents-ecosystem (70118dd) with the author's permission. -->

# Orchestrator

This skill guides the main agent on when and how to delegate to subagents. The
default posture is **minimal orchestration**: do the work yourself unless
delegation clearly adds value. Favor code quality and review over machinery.

## The control dial

Match the orchestration level to risk. Do not escalate past what the task needs.

| Level | When | Action |
|-------|------|--------|
| **0 — Direct** | Small, low-risk, single-file or obvious change | Just do it. No subagents. |
| **1 — One advisor** | A plan or piece of reasoning needs pressure-testing, or a done diff needs a second opinion | One `challenger` for a plan/reasoning, or one `reviewer` for a diff checked against requirements. With no requirements, the built-in `/code-review` bug sweep is enough |
| **2 — Parallel review** | A non-trivial diff is done and quality matters | `/parallel-review`: three fresh-context `reviewer`s, each with a distinct angle, then synthesize |
| **3 — Full loop** | Multi-step feature, cross-module change, or broad/risky work | `/orchestrate` — planner, approval, parallel implementers, verify, review, fix |

When in doubt, prefer Level 0-1. Suggest a higher level rather than silently
spending tokens on it.

## Core principles

### Only implementers write
One writer per file: only implementers dispatched by /orchestrate on file-disjoint
slices write; every other subagent is read-only. `planner`, `challenger`,
`reviewer`, `researcher`, and `Explore` inspect and advise but never edit. Never run two agents
that could touch the same file concurrently — sequence anything sharing a file, a
migration, or an API contract instead.

### Fresh-context reviewers
Adversarial reviewers must inspect the repo and diff directly, not rely on the
main conversation's history — that's what catches what accumulated context
glosses over. For level 2, run distinct `reviewer` passes rather than one broad
one: correctness/regressions, tests/validation, simplicity, and security when
warranted. The main session can run `reviewer` on Opus instead of the default
model for high-risk work.

### Narrow tasks beat vague mandates
"Review auth for missing authz checks" works far better than "review
everything." Give each subagent a goal, what to inspect, the evidence format you
want back, and any hard constraints (e.g. "do not edit files").

### Synthesize, don't rubber-stamp
After parallel reviewers return, sort findings into fixes worth doing now /
optional improvements / ignore (with a reason). Don't apply everything blindly.
If reviewers surface an unapproved scope/product/architecture decision, ask the
user before acting.

## The feature loop (Level 3 = /orchestrate)

For a non-trivial feature, `/orchestrate` runs the full staged loop:

1. **Recon** with `Explore` when context is needed before planning.
2. **Plan** with `planner` (Opus, read-only). It returns a goal, contracts, and
   file-disjoint slices with verification commands.
3. **Approve** — show the plan and wait for the user. Do not implement until
   approved.
4. **Implement** in parallel: one `implementer` (Sonnet) per slice marked
   `parallel: yes`, all launched in a single message. Hold back any slice with
   dependencies until the slices it depends on report success.
5. **Verify** — the main session runs the project's actual checks (lint, tests,
   build) across everything changed, not just each slice's own command.
6. **Review** with `reviewer` in requirements mode: feed it the plan's
   contracts/acceptance criteria and get back a pass/fail table.
7. **Fix** the blockers the review surfaces, then re-verify.
8. **Re-review** only if the fixes were substantial. Don't loop for polish.

Stop when the reviewer finds no blockers, remaining feedback is optional/deferred,
or an unapproved decision needs the user.

## Don't over-orchestrate

- Skip subagents for typos, one-liners, and obvious mechanical edits.
- Don't run a full review loop when a single `reviewer` pass would do.
- Three strong review angles beat five vague ones.
- Keep delegation one level deep (subagents don't spawn subagents).
- Run parallel subagents by issuing several delegations at once.
