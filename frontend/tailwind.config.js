/** @type {import('tailwindcss').Config} */
// Tells Tailwind which files to scan for utility classes so it can
// generate only the CSS we actually use.
//
// The theme below ports the "AI Startup" Figma design system onto OmniTrace:
//   - Inter as the single typeface (Medium 500 display headings)
//   - a focused violet brand scale (#8C45FF / #9855FF …) on near-black
//   - tight negative tracking on headings
//   - layered purple "glow" shadows
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Inter everywhere; system stack as the fallback while it loads.
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Figma brand palette — a single violet ramp instead of the old
        // violet/cyan/fuchsia trio. Semantic risk colors (rose/amber/emerald)
        // are left to Tailwind's defaults since they carry meaning.
        excav: {
          bg: "#040308", // near-black canvas (Figma #020103 region)
          panel: "#0d0a16", // raised glass base
          violet: "#8c45ff", // primary accent (Figma #8C45FF)
          violetBright: "#9855ff", // hover / active accent
          violetDeep: "#602a9a", // deep gradient stop
          violetInk: "#371866", // darkest stop for vignettes
          lilac: "#b372cf", // gradient-text tail (Figma white→#B372CF)
        },
      },
      letterSpacing: {
        // Figma headings use tight negative tracking (H1 ≈ -5%, H2 ≈ -1.5%).
        display: "-0.05em",
        heading: "-0.015em",
      },
      fontSize: {
        // Figma display sizes (px → rem), Medium 500, tight line-heights.
        h1: ["5.125rem", { lineHeight: "5.25rem", letterSpacing: "-0.05em" }],
        h2: ["3.5rem", { lineHeight: "4.0625rem", letterSpacing: "-0.015em" }],
        h3: ["2rem", { lineHeight: "2.375rem", letterSpacing: "-0.004em" }],
      },
      boxShadow: {
        // Subtle ring + lifted purple cast used on the primary panels.
        glow: "0 0 0 1px rgba(140,69,255,0.18), 0 18px 60px -20px rgba(140,69,255,0.55)",
        // Figma card glow (0 10px 74px rgba(78,0,191,0.41)).
        card: "0 10px 74px 10px rgba(78,0,191,0.30)",
        // Figma top-lit CTA glow.
        cta: "0 -19px 70px 0 rgba(140,69,255,0.40), 0 -20px 70px 0 rgba(140,69,255,0.25)",
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
        // Slow rotation for the concentric-circle hero motif.
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        "spin-slow": "spinSlow 60s linear infinite",
      },
    },
  },
  plugins: [],
};
