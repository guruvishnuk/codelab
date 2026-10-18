import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#0f0b24",
        surface: {
          DEFAULT: "#181240",
          elevated: "#221a55",
          hover: "#261d5e",
        },
        ink: "#f1eeff",
        muted: "#a29cc9",
        line: "#2c2564",
        brand: {
          DEFAULT: "#8f7bff",
          dark: "#745cfc",
          soft: "rgba(143, 123, 255, 0.15)",
        },
        ok: "#4be3c3",
        bad: "#ff5c77",
        amber: {
          DEFAULT: "#ffc857",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        xs: "0 1px 3px rgba(0, 0, 0, 0.3)",
        glow: "0 0 25px -5px rgba(143, 123, 255, 0.3)",
      },
      spacing: {
        "4.5": "1.125rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
