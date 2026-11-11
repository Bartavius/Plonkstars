# plonkstars

Next.js 15 App Router, React 19, TypeScript, Tailwind 3, Redux Toolkit, npm. The
backend lives in a separate repo (see `README.md`).

## Commands

- `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`.
- Lint and typecheck before reporting work as done. If a check fails, say so with the
  output rather than describing the change as complete.

## Layout under `src/`

- `app/` — routes only (`page.tsx`, `layout.tsx`, a route's own `page.css`). Code used
  by a single route lives beside it in `_components/`, `_hooks/`, or `_types/`.
- `features/<domain>/` — code shared across routes, grouped by domain (`auth`,
  `challenge`, `cosmetics`, `duels`, `game`, `maps`, `party`, `user`) and split into
  `components/`, `services/`, `types/`, `lib/`.
- `components/primitives/` — generic UI with no domain knowledge (modal, popup,
  loading, inputs, navbar).
- `lib/` — framework-free logic, one module per concern; `lib/hooks/` for shared hooks.
- `services/api.ts` — the axios client. `store/` — Redux store and slices.

Move a file up from a route's `_components/` into `features/` only once a second route
needs it.

## How code should look

- **One responsibility per file.** No `utils.ts` / `helpers.ts` grab bags.
- **File names are kebab-case** (`map-info-card.tsx`), matching the component in it.
- **Styles stay next to what they style.** A component's `.css` file sits beside it;
  prefer Tailwind utilities for new styling.
- **Comments only where the code is genuinely hard**, one or two sentences on *why*.
- **Concise over clever, and concise over defensive.** Delete dead branches, single-use
  wrappers, and speculative abstraction.
- **Pin dependencies to exact versions.** No `^`, `~`, or `latest`.
- **Type the boundaries**: props, API responses, route params. No new `any`; use
  `unknown` plus a narrowing check. The existing `any`s are lint warnings to burn down.
- Every `if`/`else`/loop body gets braces (enforced by ESLint).

## Before writing code

- Ask before adding a dependency, changing build/CI setup, or adding a top-level
  directory.

## Delegation

- Pick the lowest orchestration level that fits, judged by risk rather than file
  count (see the `orchestrator` skill). Reach for `/orchestrate <task>` only for
  risky or cross-module work; a mechanical rename doesn't need it.
- One writer per file: only implementers dispatched by `/orchestrate` on
  file-disjoint slices write; every other subagent is read-only. For web or docs
  research use `researcher`, not `general-purpose`.
- Subagents do not inherit the conversation. Every delegated task must state its
  files, its boundary, and how to verify it.
- After two failed fixes for the same problem, stop and report what was ruled out
  (see the `root-cause` skill).

## Never

- Read or print environment variables or `.env*` contents. Refer to variables by name.
- Commit or push unless asked.
