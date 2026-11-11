---
name: root-cause
description: Systematic debugging — reproduce, find the root cause with evidence, then fix once. Use when the user reports a bug, a failing test, an error message, or a regression, or says "debug this", "why is this failing", "it's broken", or when a first fix attempt didn't work.
argument-hint: "[symptom or failing command]"
---

# Root cause

Symptom: $ARGUMENTS

1. **Reproduce it first.** Find the exact command or steps and run them. Record the
   real error text. If it won't reproduce, stop and report what you tried, and don't
   fix something you can't observe.

2. **Ask whether it ever worked.** If it did, find the difference: `git log` and
   `git diff <last-good>` on the files involved, dependency or config changes. A
   regression usually has a commit.

3. **Narrow down before you theorize.** Bisect the input, the code path, or the
   history until the failure sits in a small region. Read that code rather than
   guessing at it. Keep noisy output out of context: `| tail -n 40`, or grep for the
   error.

4. **State one hypothesis and the evidence that would confirm it**, then gather that
   evidence (a log line, an assertion, a minimal script). Change one thing at a time.

5. **Fix the root cause, not the symptom.** Don't wrap the error in try/except, loosen
   an assertion, or add a retry unless the cause really is transient. If a test covers
   the area, add a case that failed before the fix (see the `test-first` skill).

6. **Verify with the reproduction from step 1**, then run the project's checks.

**Two failed fixes means stop.** Don't try a third variant of the same idea. Report
what you ruled out and why, what's left, and what you'd need to know next. If work
continues in a new session, record the dead ends with the `handoff` skill.
