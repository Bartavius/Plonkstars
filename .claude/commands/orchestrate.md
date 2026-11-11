---
description: Plan a change with Opus, fan it out to parallel Sonnet implementers, then have a fresh Sonnet reviewer check the diff.
argument-hint: <what to build>
---

Build: $ARGUMENTS

Run this in three phases. Do not skip to phase 2.

**1. Plan.** Delegate to the `planner` subagent (Opus). Give it the request verbatim
plus any constraints from our conversation it cannot see — it does not inherit this
context.

**2. Approve.** Show me the plan's goal, contracts, and slice list, then wait. Do not
start implementing until I say go. If the planner flagged a blocker, lead with that.

**3. Execute.** Before launching anything, record the base ref with
`git rev-parse HEAD`, and run the project's lint and test checks once, noting what
already fails. Failures that were there before the change are reported as
pre-existing, not treated as regressions. Launch one `implementer` subagent (Sonnet) per slice marked `parallel: yes`, all in a
single message so they run concurrently. Hold back any slice with dependencies until
the slices it depends on report success. Each task prompt must restate, in full: the
slice's files, its requirements, the shared contracts, and its verification command.

Then verify the whole thing yourself — run the project's lint and test checks for
everything that changed, not just the per-slice commands — and report what passed,
what failed with its output, and anything an implementer flagged. Do not report
success on a check you did not run.

Finally, launch one `reviewer` subagent (Sonnet, fresh context) to check the diff.
Hand it: the original $ARGUMENTS request verbatim plus the approved plan's contracts,
as a numbered list of requirements; the base ref recorded above; and the instruction to
run `git diff <base>` and `git status --short` itself, and to Read any untracked files.
Do not pass it the planner's or implementers' reasoning. Fix any FAIL row or Blocker it
reports that this change caused (not pre-existing failures), then rerun the project's checks; launch another reviewer only if the fixes
were substantial. Include the reviewer's requirements table in your report to me.
