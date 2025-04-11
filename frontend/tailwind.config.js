/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9C8769",
        "primary-dark": "#7f6c52",
        slate: "#cbd5e1",
        "slate-dark": "#94a3b8",

        // Additional theme-friendly accent colors
        emerald: {
          DEFAULT: "#10B981", // emerald-500
          dark: "#059669", // emerald-600
        },
        indigo: {
          DEFAULT: "#6366F1", // indigo-500
          dark: "#4F46E5", // indigo-600
        },
      },
    },
  },
  plugins: [],
};
