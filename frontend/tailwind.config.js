/** @type {import('tailwindcss').Config} */
// Tells Tailwind which files to scan for utility classes so it can
// generate only the CSS we actually use.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Named accent colors so components stay readable.
      colors: {
        excav: {
          bg: "#07070b",
          violet: "#8b7aff",
          cyan: "#67e8f9",
          fuchsia: "#f0abfc",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,122,255,0.18), 0 18px 60px -20px rgba(120,90,255,0.55)",
      },
      keyframes: {
        // A subtle floating animation we can apply to background blobs.
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        // Slow drift so the blobs don't move in sync.
        drift: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(30px, -24px) scale(1.08)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
