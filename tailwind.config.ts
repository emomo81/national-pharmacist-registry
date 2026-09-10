import type { Config } from "tailwindcss";

/**
 * LPB National Pharmacist Registry — design tokens.
 * NOTE: The brand palette below is a professional placeholder pending the
 * official LPB brand assets (logo + UI/UX kit). Swap the `brand` scale to
 * match the official identity when supplied.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effaf4",
          100: "#d8f2e3",
          200: "#b3e4cb",
          300: "#83cfac",
          400: "#50b488",
          500: "#2e986c",
          600: "#1f7b56",
          700: "#196047",
          800: "#154e3a",
          900: "#124030",
          950: "#08231a",
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
        card: "0 1px 2px rgba(8,35,26,0.05), 0 10px 28px -14px rgba(8,35,26,0.22)",
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
