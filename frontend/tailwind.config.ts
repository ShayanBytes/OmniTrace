import type { Config } from "tailwindcss";

/**
 * OmniTrace design system.
 * A dev-tool / code-intelligence identity: near-black canvas, a violet brand
 * spine, plus a distinct "excavation amber" + "signal cyan" secondary accent so
 * it never reads as a generic violet SaaS template. shadcn tokens are mapped to
 * CSS variables (defined in app/globals.css); the `excav` namespace holds the
 * raw brand colors used directly by bespoke 3D / motion components.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // ---- shadcn token surface (driven by CSS variables) ----
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ---- raw OmniTrace brand palette ----
        excav: {
          bg: "#040308", // near-black canvas
          panel: "#0d0a16", // raised glass base
          violet: "#8c45ff", // primary accent
          violetBright: "#9855ff", // hover / active
          violetDeep: "#602a9a", // deep gradient stop
          violetInk: "#371866", // darkest stop / vignettes
          lilac: "#b372cf", // gradient-text tail
          amber: "#ffb347", // "excavation" secondary accent
          amberDeep: "#c77d2e",
          cyan: "#43e7ff", // "signal" tertiary accent
          cyanDeep: "#1f8aa3",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      letterSpacing: {
        display: "-0.05em",
        heading: "-0.015em",
      },
      fontSize: {
        h1: ["clamp(2.75rem, 6vw, 5.125rem)", { lineHeight: "1.02", letterSpacing: "-0.05em" }],
        h2: ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.18", letterSpacing: "-0.004em" }],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(140,69,255,0.18), 0 18px 60px -20px rgba(140,69,255,0.55)",
        card: "0 10px 74px 10px rgba(78,0,191,0.30)",
        cta: "0 -19px 70px 0 rgba(140,69,255,0.40), 0 -20px 70px 0 rgba(140,69,255,0.25)",
        "inner-top": "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(rgba(140,69,255,0.10) 1px, transparent 1px)",
        "violet-mesh":
          "radial-gradient(120% 80% at 50% -10%, rgba(96,42,154,0.28) 0%, rgba(4,3,8,0) 60%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(30px, -24px) scale(1.08)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        marquee: { to: { transform: "translateX(-50%)" } },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        "spin-slow": "spinSlow 60s linear infinite",
        marquee: "marquee 40s linear infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
