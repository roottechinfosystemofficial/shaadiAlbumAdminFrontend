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
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(255,255,255,0.5)' },
          '50%': { boxShadow: '0 0 12px rgba(255,255,255,0.8)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      
    },
  },
  safelist: [
    "rotate-mobile", // Prevent purge of this class
  ],
  plugins: [],
};
