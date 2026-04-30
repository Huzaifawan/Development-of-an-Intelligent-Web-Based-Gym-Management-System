/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00ff87",
        secondary: "#60efff",
        dark: "#0a0a0a",
        card: "#1a1a1a",
        border: "#2a2a2a",
      },
    },
  },
  plugins: [],
};
