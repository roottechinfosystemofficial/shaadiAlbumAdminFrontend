/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B59F84",
        "primary-dark": "#7f6c52",
        slate: "#cbd5e1",
        "slate-dark": "#94a3b8",

        check: "#FFF9FF",
        emerald: {
          DEFAULT: "#10B981",
          dark: "#059669",
        },
        indigo: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
        },
      },
    },
  },
  plugins: [],
};
