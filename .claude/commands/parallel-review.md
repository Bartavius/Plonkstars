---
description: Level-2 review — three fresh-context reviewers on the current diff, each with a different angle, then one synthesized list of what to fix. Add "autofix" to apply the fix-now items.
argument-hint: "[path, focus, or base ref] [autofix]"
---
<!-- Adapted from anish-sahoo/agents-ecosystem (70118dd) with the author's permission. -->

Target and options: $ARGUMENTS

1. **Pick the scope.** Use the base ref if one was given. Otherwise use `HEAD` for
   uncommitted work, or `git merge-base HEAD main` for a branch with commits. Run
   `git diff --stat <base>` and `git status --short` to size it. If the diff is a
   few lines, say one `reviewer` is enough and run just that.

2. **Pick three angles** that fit this change. The default is correctness and
   regressions, tests and validation, and simplicity. Swap one in when the change
   calls for it: security for auth, input handling, or secrets; types for heavily
   typed code; docs or API for public interfaces.

3. **Launch three `reviewer` subagents in one message.** Give each of them:
   - its angle
   - the base ref
   - the requirements, if the conversation has any, as a numbered list
   - the instruction to run `git diff <base>` and `git status --short` itself and
     Read any untracked files

   Don't pass them the author's reasoning or this conversation's account of the
   change. Use `model: claude-opus-5-5` for high-risk changes.

4. **Synthesize.** Don't concatenate their reports. Sort every finding into:
   - **Fix now:** blockers, and anything clearly worth it
   - **Optional:** real, but it can wait
   - **Ignore:** give a one-line reason

   Where reviewers disagree, check the code and decide. Anything that needs a
   scope, product, or architecture call goes to me as a question, not a fix.

5. **Apply or ask.** With `autofix`, apply only the fix-now items, then run the
   project's lint and tests and show the output. Without it, present the list and
   ask which to apply. Don't launch a second round unless the fixes were
   substantial.
