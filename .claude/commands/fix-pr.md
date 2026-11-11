---
description: Fix unresolved review comments and failing CI checks on an existing GitHub PR, on its own branch. Never opens a new PR; doesn't commit or push unless asked.
argument-hint: <PR number or URL>
---
<!-- Adapted from anish-sahoo/agents-ecosystem (70118dd) with the author's permission. -->

PR: $ARGUMENTS

Needs `gh`. If it's missing or not authenticated, stop and say so.

1. **Check out the branch.** First run `git status --short`. If there are
   uncommitted changes, stop and ask rather than stashing them or carrying them
   onto the PR branch. Then run `gh pr checkout <pr>`.

2. **Collect what needs fixing.**
   - Open review threads. Only GraphQL reports whether a thread is resolved:
     ```
     gh api graphql -F owner='{owner}' -F name='{repo}' -F n=<number> -f query='
       query($owner:String!,$name:String!,$n:Int!){repository(owner:$owner,name:$name){
         pullRequest(number:$n){reviewThreads(first:100){nodes{isResolved isOutdated path line
           comments(first:20){nodes{author{login} body}}}}}}}' \
       --jq '.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved|not) | select(.isOutdated|not)'
     ```
     Then `gh pr view <pr> --comments` for top-level comments. Skip bot noise that
     has nothing to act on.
   - Failed checks: `gh pr checks <pr>`, then for each failed run
     `gh run view <run-id> --log-failed | grep -E -i -m 40 -A 4 'error|fail|panic'`.
     Don't use `tail`: the end of a failed log is post-job cleanup, not the error.
     Widen the grep only if it misses the cause. When a matrix of jobs fails the same
     way, read one. Don't pull full logs into context.

   List every item before fixing anything: the comment or check, the file, and what
   it asks for.

3. **Fix each item** at its root cause. If a comment asks for something you disagree
   with, or that goes past the PR's scope, don't change it. List it for me with your
   reason instead. For a CI failure you can reproduce locally, reproduce it first.
   For one you can't (secrets, platform), say so, and don't guess at a fix.

4. **Verify** with the project's own lint and test commands, and show the output.

5. **Report** a table with one row per item: fixed (file and what changed), declined
   (reason), or couldn't reproduce. Then stop. Don't commit, push, or reply on the PR
   unless I ask.
