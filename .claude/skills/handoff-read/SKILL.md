---
name: handoff-read
description: Reads HANDOFF.md at the repo root, checks its claims against the current repo state, and reports what is still true plus the next action. Use when picking up prior work or when the user says "read the handoff", "resume", "continue where we left off", "catch up", or "what was I working on".
argument-hint: "[optional: 'and continue' to start the next action]"
allowed-tools: Read Grep Glob Bash(git status:*) Bash(git log:*) Bash(git diff:*) Bash(git rev-parse:*) Bash(cat:*)
---

# Read a handoff

## Handoff document

```!
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
if [ -f "$ROOT/HANDOFF.md" ]; then cat "$ROOT/HANDOFF.md"; else echo "NO_HANDOFF_FILE"; fi
```

## Current repo state

```!
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
git -C "$ROOT" status --short --branch
echo "--- HEAD ---"
git -C "$ROOT" rev-parse --short HEAD
echo "--- commits since ---"
git -C "$ROOT" log --oneline -10
```

## Instructions

If the document above is `NO_HANDOFF_FILE`, say plainly that there is no handoff, and stop — do not guess at prior work from the git log.

Otherwise:

1. **Check for drift before trusting anything.** A handoff records what was true when it was written. Compare its `Branch` and `HEAD` against the current values above. Different branch, or commits landed since, means the "In progress" and "Verification" sections are suspect.

2. **Verify the claims you are about to rely on.** Confirm the files under *Key files* still exist at those paths and that the described code is still there. Run the *Verification* commands to see whether the failures listed are still the failures you get. Do not repeat a stated fact you were unable to confirm without labelling it unverified.

3. **Treat the *Findings* section as binding.** Do not re-attempt anything under *dead ends* unless something named in its explanation has since changed — and if you do retry it, say why you expect a different result. Adopt the corrected assumptions listed rather than the intuitive ones they replaced. Re-walking a recorded dead end is the specific failure this document exists to prevent.

4. **Report back, briefly:** the goal, the next action, anything in the handoff that no longer holds, and any open question that needs the user's decision. Keep it to a short paragraph or a few bullets — the user does not need the handoff read back to them verbatim.

5. **Then act on the next action** if it is non-destructive and unambiguous, or if $ARGUMENTS asks you to continue. Stop and ask first when the handoff is materially stale, when its open questions block the next step, or when that step would delete, overwrite, push, or deploy anything.

6. When the picked-up work reaches a natural stopping point, update `HANDOFF.md` via the `handoff` skill rather than leaving a stale document behind. Anything you learned this session — including dead ends of your own — belongs in its *Findings*.
