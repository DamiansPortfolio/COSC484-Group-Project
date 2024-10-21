import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const backendPort = process.env.PORT || 5001; // Default to 5001 if PORT is not set

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward requests for API calls to the backend
      "/api": {
        target: `http://localhost:${backendPort}`, // Use the PORT from .env
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
