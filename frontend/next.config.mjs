/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM; let Next transpile it + drei cleanly.
  transpilePackages: ["three"],

  // Proxy the functional /app tool's API calls to the FastAPI backend so the
  // browser talks to the same origin (no CORS). Override the target with
  // NEXT_PUBLIC_API_BASE (e.g. a deployed backend). Defaults to localhost:8000.
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
};

export default nextConfig;
