import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--theme-blue)",
        foreground: "var(--lightest-blue)",
      },
    },
  },
  plugins: [],
} satisfies Config;
