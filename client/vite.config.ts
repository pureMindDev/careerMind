import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    // Emit to the repo root so deploy/dist checks find ./dist
    outDir: path.resolve(__dirname, "../dist"),
    emptyOutDir: true,
  },
  server: {
    port: 8080,
    host: true,
    strictPort: true,
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
});
