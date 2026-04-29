/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: { 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2" },
        cyber: { black: "#0a0a0a", dark: "#121212" },
      },
      fontFamily: {
        mono: ["Fira Code", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
