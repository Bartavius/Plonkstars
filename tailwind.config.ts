import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--theme-blue)",
        foreground: "var(--lightest-blue)",
        // The values live as CSS variables in globals.css; each token is named after its variable.
        "lightest-blue": "var(--lightest-blue)",
        "lighter-blue": "var(--lighter-blue)",
        "theme-blue": "var(--theme-blue)",
        "dark-blue": "var(--dark-blue)",
        "darker-blue": "var(--darker-blue)",
        "darkest-blue": "var(--darkest-blue)",
        "pastel-dark-blue": "var(--pastel-dark-blue)",
        "color-accent-gold": "var(--color-accent-gold)",
        "leaderboard-yellow": "var(--leaderboard-yellow)",
        "color-green": "var(--color-green)",
        "plonk-stars-red": "var(--plonk-stars-red)",
        "plonk-stars-white": "var(--plonk-stars-white)",
      },
    },
  },
  plugins: [],
} satisfies Config;
