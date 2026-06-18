/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM; let Next transpile it + drei cleanly.
  transpilePackages: ["three"],
};

export default nextConfig;
