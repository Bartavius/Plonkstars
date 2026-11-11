#!/usr/bin/env bash
# block-secrets.sh - PreToolUse hook for the Bash tool.
#
# Blocks Bash commands that would print or export raw environment-variable
# values: env/printenv dumps, export/set/declare/typeset dumps, echo/printf
# of an uppercase $VAR, reading a .env file directly, or a scripting
# one-liner (python/node/ruby/perl/awk/...) that reaches into the environment.
#
# This backs up the CLAUDE.md rule "never read or print environment
# variable values" -- Claude Code's `permissions.deny` only matches exact
# command prefixes, so a hook is needed to catch the many other shapes a
# secret leak can take. It is a guard rail, not a sandbox: a determined
# command can still get past it (see Known gaps in the README).
#
# Contract: exit 2 + a one-line reason on stderr blocks the tool call and
# feeds the reason back to Claude. Exit 0 allows it silently.
#
# Must run under bash 3.2 (macOS) using only grep -E, sed -E, awk and tr -- no
# jq, python, mapfile, associative arrays, \b, or GNU-only \| in EREs.
# BSD grep also mis-matches a `^` alternative nested in an optional group
# mid-pattern, so `^` appears only in the leading command-start group.

input="$(cat)"

# Nothing on stdin -- nothing to check.
if [ -z "$input" ]; then
  exit 0
fi

# Extract the tool_input.command JSON string value: find an unescaped
# "command" key (one not preceded by a backslash -- a backslash there would
# mean it's part of an already-escaped nested string, not the real key) and
# capture its escaped string body.
match="$(printf '%s' "$input" | grep -oE '(^|[^\\])"command"[[:space:]]*:[[:space:]]*"(\\.|[^"\\])*"' | head -n 1)"

if [ -n "$match" ]; then
  cmd="$(printf '%s' "$match" | sed -E 's/^.*"command"[[:space:]]*:[[:space:]]*"//; s/"$//')"
else
  # Extraction failed -- fall back to scanning the whole raw input. This
  # errs toward blocking rather than letting something slip through.
  cmd="$input"
fi

# Decode only the \" escape back to ". Do NOT decode \n or \t: they stay as
# literal two-character sequences and are treated as command boundaries
# below, so e.g. printf '%s\n' "$TOKEN" isn't split into pieces that would
# hide the $TOKEN reference from the patterns. A shell backslash (\env)
# therefore arrives here as two backslashes.
cmd="$(printf '%s' "$cmd" | sed -E 's/\\"/"/g')"

# Heredoc bodies are data, not commands (PR bodies, commit messages, scripts), so
# the command-position rules scan a copy with the body lines blanked. The body is
# kept when the heredoc feeds a shell (`bash <<EOF`, `... | sh`), and rule 5 still
# scans the full command, so `python3 - <<EOF ... os.environ` is still caught.
# Lines are split on the JSON `\n` escape only; an escaped backslash (`\\`) is
# kept as-is, so `printf '%s\\n'` stays on one line.
scan="$(printf '%s' "$cmd" | awk -v q="'" '
  { s = s (NR > 1 ? "\n" : "") $0 }
  END {
    n = 0; cur = ""; i = 1; L = length(s)
    while (i <= L) {
      c = substr(s, i, 1)
      if (c == "\\" && i < L) {
        d = substr(s, i + 1, 1)
        if (d == "n") { lines[++n] = cur; cur = "" } else { cur = cur c d }
        i += 2; continue
      }
      cur = cur c; i++
    }
    lines[++n] = cur
    delim = ""
    for (k = 1; k <= n; k++) {
      line = lines[k]
      if (delim != "") {
        t = line; sub(/^[ \t]+/, "", t); sub(/[ \t]+$/, "", t)
        if (t == delim) delim = ""; else line = ""
      } else if (match(line, "<<-?[ \t]*[\"" q "]?[A-Za-z_][A-Za-z0-9_]*") \
                 && substr(line, RSTART - 1, 1) != "<" \
                 && line !~ /(^|[;&|( \t])(ba|z|da|k)?sh([ \t]|$)/) {
        delim = substr(line, RSTART, RLENGTH)
        sub("^<<-?[ \t]*[\"" q "]?", "", delim)
      }
      printf "%s%s", (k > 1 ? "\\n" : ""), line
    }
  }')"

# Command position. A command starts at the start of the string, after a
# separator, subshell or backtick, after a literal \n, after `-c`/`eval` (with an
# optional opening quote), or after `-exec`. Before the command word there can be
# assignments (X=1), keywords (do, then, if, !), wrappers and launchers with their
# options (sudo -u root, nice -n 5, timeout 5, env -i, xargs), and a path or
# backslash prefix (/usr/bin/env, \env). Anchoring on command position instead of
# any whitespace is what lets `ls env`, `python -m venv env` and `rg 'export'`
# through.
Q='["'"'"']?'
START="(^|[;&|({\`]|\\\\n|-[a-z]*c[[:space:]]+${Q}|eval[[:space:]]+${Q}|-exec(dir)?[[:space:]]+)"
P='(\\\\|[^[:space:];&|<>"'"'"']*/)?'
OPT='([[:space:]]+-[^[:space:];&|]+([[:space:]]+[^-[:space:];&|][^[:space:];&|]*)?)*'
WRAP="(${P}(sudo|command|builtin|exec|time|nice|nohup|xargs|env|eval|stdbuf|do|then|else|if|while|until|!)${OPT}[[:space:]]+|${P}timeout${OPT}[[:space:]]+[0-9.]+[smhd]?[[:space:]]+|[A-Za-z_][A-Za-z0-9_]*=[^[:space:];&|]*[[:space:]]+)"
C="${START}[[:space:]]*${WRAP}*${P}"
# End of a word: space, separator, quote, a literal \n, or end of string.
E='([[:space:];&|)>`"'"'"']|\\n|$)'
# Bare end: nothing but spaces before the terminator, so `env FOO=1 make`,
# `set -euo pipefail` and `export PATH=...` are not treated as dumps.
BARE_END='[[:space:]]*([;&|)>`"'"'"']|\\n|$)'

block() {
  printf 'block-secrets: %s\n' "$1" >&2
  exit 2
}

# matches scans the heredoc-stripped copy; matches_full scans everything.
matches() { printf '%s' "$scan" | grep -qE "$1"; }
matches_full() { printf '%s' "$cmd" | grep -qE "$1"; }

# --- Rule 1: env / printenv -------------------------------------------
# printenv blocks with or without arguments. env blocks when it only has
# options (-0, -i, -u NAME) and no command to run.
if matches "${C}printenv${E}" \
  || matches "${C}env([[:space:]]+(-[0iu]+|--null|--unset=[^[:space:]]+|-u[[:space:]]+[A-Za-z_][A-Za-z0-9_]*))*${BARE_END}"; then
  block "prints environment variables (env/printenv). Refer to the variable by name and ask the user."
fi

# --- Rule 2: export / set / declare / typeset dumps --------------------
if matches "${C}(export|set|declare|typeset|readonly)${BARE_END}" \
  || matches "${C}(export[[:space:]]+-p|declare[[:space:]]+-[a-zA-Z]*[xp]|typeset[[:space:]]+-[a-zA-Z]*[xp]|readonly[[:space:]]+-p)(${BARE_END}|[[:space:]]+[A-Za-z_][A-Za-z0-9_]*([[:space:];&|)]|\\\\n|\$))"; then
  block "dumps shell variables (export/set/declare/typeset). Refer to the variable by name and ask the user."
fi

# --- Rule 3: echo/printf of an uppercase $VAR ---------------------------
if matches "${C}(echo|printf)[^;&|]*\\\$\\{?[A-Z_][A-Z0-9_]*"; then
  block "prints environment values (echo/printf of \$VAR). Refer to the variable by name and ask the user."
fi

# --- Rule 4: reading a .env file directly -------------------------------
ENVFILE='\.env(\.[A-Za-z0-9_.-]+)?(["'"'"'[:space:];&|)]|\\n|$)'
READERS='(cat|less|more|head|tail|grep|egrep|rg|ag|source|\.|sed|awk|nl|bat|xxd|od|strings|tac|cut|sort|uniq|diff|base64)'
if matches "${C}${READERS}[[:space:]<]([^;&|]*[/[:space:]\"'=<])?${ENVFILE}" \
  || matches "<[[:space:]]*([^[:space:];&|<>]*/)?${ENVFILE}"; then
  block "reads a .env file directly. Refer to the variable by name and ask the user."
fi

# --- Rule 5: interpreter one-liner reaching into the environment -------
# Any interpreter in command position plus an environment accessor anywhere in
# the command: covers -c/-e flags in any order, and heredoc scripts.
INTERP='(python[0-9.]*|node|ruby[0-9.]*|perl[0-9.]*|deno|bun|php|awk|gawk|Rscript|lua)'
RULE5_ENV='environ|getenv|process\.env|process\[|ENV([^A-Za-z0-9_]|$)|ENVIRON|\$_(ENV|SERVER)|Deno\.env|Bun\.env|Sys\.getenv|["'"'"'/]\.env'
if matches "${C}${INTERP}${E}" && matches_full "$RULE5_ENV"; then
  block "reads environment values via an interpreter (os.environ/process.env/ENV/getenv). Refer to the variable by name and ask the user."
fi

exit 0
