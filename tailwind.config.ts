import type { Config } from "tailwindcss";

/**
 * LPB National Pharmacist Registry — design tokens from the approved UI/UX kit:
 * deep navy chrome (trust, government) + LPB green accents (from the official
 * seal). `brand` = navy, `accent` = green.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4fb",
          100: "#dbe8f6",
          200: "#bcd4ec",
          300: "#8fb6dd",
          400: "#5c91c7",
          500: "#3772ac",
          600: "#265a90",
          700: "#1c466e",
          800: "#122f4e",
          900: "#0c2138",
          950: "#071627",
        },
        accent: {
          50: "#f0faf2",
          100: "#dbf3e1",
          200: "#bce6c8",
          300: "#8dd3a4",
          400: "#57b97b",
          500: "#339c5c",
          600: "#227e47",
          700: "#1c643a",
          800: "#185031",
          900: "#144229",
          950: "#072416",
        },
        gold: {
          300: "#e6ca6a",
          400: "#d9b23a",
          500: "#c9a227",
          600: "#a6851e",
        },
      },
      fontFamily: {
        sans: ["'Inter Variable'", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(7,22,39,0.05), 0 10px 28px -14px rgba(7,22,39,0.22)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .45s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
