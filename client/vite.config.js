import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    "process.env": {},
  },
  build: {
    chunkSizeWarningLimit: 1700,
    outDir: "build",
    minify: "esbuild",
    manifest: true,
    sourcemap: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const HugeLibraries = ["@mui", "xlsx", "xlsx-js-style", "jodit-react", "exceljs"]; // modify as required based on libraries in use
          if (HugeLibraries.some((libName) => id.includes(`node_modules/${libName}`))) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
});
