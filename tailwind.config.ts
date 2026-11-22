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
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#627D98",
          600: "#486581",
          700: "#334E68",
          800: "#102A43",
          900: "#0B132B",
          950: "#060B18", // Matches the cosmic dark background from the PunarNova logo
        },
        brand: {
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          "blue-soft": "#3B82F6",
          "blue-light": "#EFF6FF",
          cyan: "#0EA5E9",
          glow: "#38BDF8",
          green: "#10B981",
          "green-dark": "#059669",
          "green-light": "#ECFDF5",
          accent: "#10B981",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        elevated: "0 20px 35px -10px rgba(11, 19, 43, 0.08), 0 10px 15px -5px rgba(11, 19, 43, 0.04)",
        glow: "0 0 25px -3px rgba(14, 165, 233, 0.3)",
        brand: "0 8px 30px -4px rgba(37, 99, 235, 0.2)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
export default config;
