import type { Config } from "tailwindcss";

/**
 * LPB National Pharmacist Registry design tokens.
 * `brand` = navy chrome (trust, government), `accent` = green from the official
 * LPB seal, `paper` = warm off-white used for page and panel backgrounds.
 * The visual language is deliberately institutional: flat surfaces, 1px
 * borders, 2px radii and no decorative shadows.
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
        paper: {
          50: "#fafaf8",
          100: "#f4f4f1",
          200: "#e9e9e4",
        },
      },
      fontFamily: {
        sans: ["'Public Sans Variable'", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
