import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15 still ships legacy configs, so FlatCompat adapts them.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Every if/else/for/while body gets braces, including one-liners.
      curly: ["error", "all"],
      "brace-style": ["error", "1tbs", { allowSingleLine: false }],
      // Warn for now: existing code has ~250 untyped `any`s to burn down.
      // New code should use `unknown` plus a narrowing check instead.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
