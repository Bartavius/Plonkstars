---
name: handoff
description: Writes or updates HANDOFF.md at the repo root to capture in-progress work — goal, current state, findings and dead ends, decisions and their rationale, blockers, and the single next action. Use when wrapping up a session, when the user says "hand off", "write a handoff", "save state", "I'm stopping here", or when context is running low mid-task.
argument-hint: "[optional focus, e.g. 'auth refactor only']"
allowed-tools: Read Write Edit Glob Bash(git status:*) Bash(git log:*) Bash(git diff:*) Bash(git rev-parse:*)
---

# Write a handoff

## Repo state

```!
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
echo "root: $ROOT"
git -C "$ROOT" status --short --branch
echo "--- HEAD ---"
git -C "$ROOT" rev-parse --short HEAD
echo "--- recent commits ---"
git -C "$ROOT" log --oneline -10
echo "--- changed vs HEAD ---"
git -C "$ROOT" diff --stat HEAD
```

## Instructions

Target file: `HANDOFF.md` at the repo root. Focus, if given: $ARGUMENTS

1. **Read the existing `HANDOFF.md` first if it exists.** Never blind-overwrite it. If it describes the same task, update it in place and carry forward every finding and still-open question. If it describes unrelated finished work, replace it and say so in your reply.

2. **Write only what the repo cannot already tell the reader.** The diff, the log, and the file contents are all recoverable — a handoff that summarizes them is wasted. The irrecoverable parts are the intent behind the change and everything learned along the way.

3. **Findings are the highest-value section — write them first and do not skip them.** Everything discovered by doing the work, which the next session would otherwise pay for again:
   - **Dead ends:** what was tried, the symptom it produced, and why it was abandoned. Include the near-misses that *look* correct on paper.
   - **What worked and wasn't obvious:** the API that actually behaves as needed, the flag that fixed it, the version that matters, the order operations must run in.
   - **Reconnaissance:** where things live in this codebase, which file owns a behavior, which docs or source files were worth reading (and which were misleading or stale).
   - **Corrected assumptions:** anything believed at the start of the session that turned out to be false. State the false belief explicitly — that is what stops it being re-adopted.

4. **Be specific and verifiable.** Name real files with line references, real commands, real error text. "Fix the auth bug" is useless; "`validateSession` returns before the refresh resolves — see [auth.ts:88](auth.ts#L88)" is not. A dead end recorded as "tried middleware, didn't work" is equally useless: name the approach and the failure.

5. Fill the template below. **Drop any section that would be empty** rather than writing "N/A" under it — except *Findings*, where an empty section usually means insufficient thought about what was learned. Aim for under ~100 lines total; findings may earn more room than the rest.

6. `HANDOFF.md` is session state. Do not commit it unless the user asks.

## Template

```markdown
# Handoff

**Branch:** <branch> · **HEAD:** <short-sha> · **Written:** <YYYY-MM-DD>

## Goal
<One or two sentences: what this work is meant to achieve, and for whom.>

## Next action
<The single most immediate concrete step, written so it can be started without
re-deriving anything. One item, not a list.>

## State
- **Done:** <what is finished and verified, and how it was verified>
- **In progress:** <what is half-built, and precisely where it stops>
- **Not started:** <known-required work not yet touched>

## Findings

**Worked:**
- <Non-obvious thing that turned out to be correct, and the evidence it works.>

**Dead ends — do not retry:**
- <Approach tried> → <what actually happened / error text>. <Why it can't work.>

**Learned about this codebase:**
- <Where something lives, what owns a behavior, which reference was worth reading.>

**Assumptions that were wrong:**
- Believed <X>; actually <Y>. <How that surfaced.>

## Key files
- [path/to/file.ts](path/to/file.ts) — <why it matters to this task>

## Decisions
- **<Decision>:** <what was chosen> — because <reason>. Rejected: <alternative> because <reason>.

## Blockers and open questions
- <Blocker, plus what would unblock it. Mark anything needing a human decision.>

## Verification
<Exact commands to confirm the current state, and what they do right now —
including which tests fail and the actual failure message.>

## Gotchas
<Non-obvious setup, ordering requirements, or traps that cost time. Name any
required config variable but never record its value.>
```

## Anti-patterns

- Restating the git log as prose.
- Findings written so vaguely they can't prevent the repeat: "had some trouble with the config" prevents nothing.
- Omitting a dead end because it feels like an admission of wasted time. That entry is the most valuable line in the file.
- Vague status ("mostly working", "needs cleanup") with no location or failure mode.
- Claiming something is verified without having run it — if you did not run the tests, write that you did not.
- A next-action list of eight items. Pick the one that comes first.
