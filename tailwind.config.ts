import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // PunarNova Official Emerald Green & Deep Navy Eco-Tech Palette
        emerald: {
          50: "#ECFDF5", // Light Green Background
          100: "#D1FAE5", // Light Mint
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981", // Primary Emerald Green
          600: "#059669", // Darker Emerald (Hover)
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          DEFAULT: "#10B981",
        },
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#627D98",
          600: "#486581",
          700: "#1E3E61",
          800: "#132B45",
          900: "#0B1F33", // Deep Navy
          950: "#071422",
          DEFAULT: "#0B1F33",
        },
        eco: {
          emerald: "#10B981",
          emeraldDark: "#059669",
          navy: "#0B1F33",
          mint: "#D1FAE5",
          lightGreen: "#ECFDF5",
          bg: "#F8FAFC",
          white: "#FFFFFF",
          secondary: "#64748B",
          dark: "#0F172A",
          amber: "#F59E0B",
          border: "#E2E8F0",
        },
        brand: {
          emerald: "#10B981",
          "emerald-dark": "#059669",
          navy: "#0B1F33",
          mint: "#D1FAE5",
          "green-light": "#ECFDF5",
          blue: "#10B981", // Alias to prevent legacy blue regression
          "blue-hover": "#059669",
          green: "#10B981",
          "green-dark": "#059669",
          accent: "#10B981",
          amber: "#F59E0B",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(11, 31, 51, 0.05), 0 4px 6px -2px rgba(11, 31, 51, 0.02)",
        card: "0 1px 3px 0 rgba(11, 31, 51, 0.04), 0 1px 2px 0 rgba(11, 31, 51, 0.02)",
        elevated: "0 20px 35px -10px rgba(11, 31, 51, 0.08), 0 10px 15px -5px rgba(11, 31, 51, 0.04)",
        emerald: "0 8px 24px -4px rgba(16, 185, 129, 0.25)",
        xs: "0 1px 2px 0 rgba(11, 31, 51, 0.04)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
