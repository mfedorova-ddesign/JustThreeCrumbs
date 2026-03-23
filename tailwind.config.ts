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
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif"
        ]
      },
      colors: {
        brand: {
          primary: "#066835",
          bg: "#F7F6F2",
          accent: "#E6A756",
          text: "#1F2933",
          border: "#E5E7EB",
          card: "#FFFFFF"
        }
      }
    }
  },
  plugins: []
};

export default config;
