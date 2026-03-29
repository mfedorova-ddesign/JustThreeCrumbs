import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.06)"
      },
      colors: {
        brand: {
          primary: "#066835",
          bg: "#F7F6F2",
          accent: "#E6A756",
          text: "#1F2933",
          border: "#E5E7EB",
          card: "#FFFFFF",
          muted: "#64748B",
          surface: "#FAFAF8"
        }
      }
    }
  },
  plugins: []
};

export default config;
