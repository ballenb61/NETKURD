/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0a0a0f",
          dark: "#12121a",
          card: "#1a1a24",
          border: "#2a2a3a",
        },
        neon: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
      },
      fontFamily: {
        kurdish: ["Noto Naskh Arabic", "Rabar", "Tahoma", "sans-serif"],
        mono: ["Fira Code", "Cascadia Code", "monospace"],
      },
    },
  },
  plugins: [],
};
