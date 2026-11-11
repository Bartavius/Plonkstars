---
name: test-first
description: Red/green test-first workflow for new behavior or an already-diagnosed bug — write a failing test, watch it fail for the right reason, make it pass with the smallest change, then run the full suite. Use when the user says "TDD", "test first", "write a test for this", "red/green", or when adding new behavior in a project that has a test suite. For bugs, start with `root-cause`, which hands off here once the cause is found.
argument-hint: "[behavior or bug to cover]"
---

# Test first

Target: $ARGUMENTS

1. **Run the existing suite before touching anything.** Note what already fails, so
   those failures aren't blamed on this change later. If there is no test runner,
   say so and ask whether to add one rather than inventing a framework.

2. **Write one test for the behavior**, in the project's existing test style and
   location. It asserts what the user asked for, not what the current code happens
   to do.

3. **Run it and watch it fail.** Read the failure. It has to fail because the
   behavior is missing or wrong, not because of an import error, a typo, or a wrong
   fixture. A test that passes on the first run proves nothing: fix the test until
   it fails for the right reason.

4. **Make it pass with the smallest change** to non-test code. Don't edit the test to
   match the code. If the test itself was wrong, say so and why.

5. **Run the full suite**, not only the new test. Report the command and its real
   result, including any failures that were already there in step 1.

For several behaviors, repeat 2–4 once per behavior. Don't write every test up front.

Skip this skill for changes with nothing observable to assert (renames, docs,
config) and say that you skipped it.
