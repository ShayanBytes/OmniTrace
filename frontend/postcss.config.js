// PostCSS pipeline used by Vite at build time.
// Tailwind generates the utility classes; autoprefixer adds vendor
// prefixes for older browsers.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
