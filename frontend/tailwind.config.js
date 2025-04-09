/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9C8769",
        "primary-dark": "#7f6c52",
        slate: "#cbd5e1", // Same as bg-slate-300
        "slate-dark": "#94a3b8", // Slightly darker for hover
      },
    },
  },
  plugins: [],
};
