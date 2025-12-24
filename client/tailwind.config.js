/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f1a",
        surface: "#0f1629",
        card: "#121829",
        accent: "#6366f1"
      }
    }
  },
  plugins: []
};
