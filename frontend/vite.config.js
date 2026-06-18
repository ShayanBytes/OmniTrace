import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for the React frontend.
// The proxy forwards any request starting with /api to the FastAPI
// backend on port 8000, so frontend code can just call "/api/scan"
// without worrying about CORS or hardcoding the backend URL.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
