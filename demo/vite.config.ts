import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Resolve `usekit` to the library source so the demo always reflects the
// current code without a separate build step.
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@smallcaomei/usekit": fileURLToPath(
        new URL("../src/index.ts", import.meta.url),
      ),
    },
  },
});
