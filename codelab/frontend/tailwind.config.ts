import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F8FA",
        ink: "#172033",
        muted: "#5B6676",
        line: "#D9E0E7",
        brand: { DEFAULT: "#0F766E", dark: "#0B5B55", soft: "#E3F2F0" },
        ok: "#067647",
        bad: "#B42318",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
