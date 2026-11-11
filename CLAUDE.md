# plonkstars

Next.js 15 App Router, React 19, TypeScript, Tailwind 3, Redux Toolkit, npm. The
backend lives in a separate repo (see `README.md`).

## Commands

- `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run format`
  (Prettier; CI runs `npm run format:check`).
- Format, lint, and typecheck before reporting work as done. If a check fails, say so with the
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
- **Comments only where the code is genuinely hard**, one or two sentences on _why_.
- **Concise over clever, and concise over defensive.** Delete dead branches, single-use
  wrappers, and speculative abstraction.
- **Pin dependencies to exact versions.** No `^`, `~`, or `latest`.
- **Type the boundaries**: props, API responses, route params. API and socket shapes
  mirror the backend's serializers. No `any` (an ESLint error); use `unknown` plus a
  narrowing check.
- Every `if`/`else`/loop body gets braces (enforced by ESLint).
- **Named exports only**, except the default export Next requires from `page.tsx` and
  `layout.tsx`. Components and hooks end with `export { Name };`; plain functions in
  `.ts` files use `export function`. Load a component with `next/dynamic` as
  `import("...").then((m) => m.Name)`.
- **Components are function declarations** with props typed by an `interface NameProps`
  declared just above them, never an inline object type. Hooks and other functions that
  take an options object use `interface NameOptions`.
- **Type-only imports use `import type`** (`import { a, type B }` when mixed), enforced
  by ESLint.

## Imports

Group imports as packages, then `@/` aliases, then relative paths, with a blank line
between groups and each group alphabetized. ESLint enforces the grouping but not the
alphabetizing.

CSS loads in import order, so never reorder an import that pulls in a stylesheet. That
means a `.css` file, `next/font`, or any component that imports CSS, directly or
through its own imports. Where that conflicts with the grouping, leave the order as it
is and disable `import/order` for the file with a reason, as the existing files do.

## Before writing code

- Ask before adding a dependency, changing build/CI setup, or adding a top-level
  directory.

## Never

- Read or print environment variables or `.env*` contents. Refer to variables by name.
- Commit or push unless asked.
