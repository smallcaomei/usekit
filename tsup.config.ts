import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  splitting: false,
  outExtension({ format }) {
    return { js: format === "esm" ? ".js" : ".cjs" };
  },
  external: ["react", "react-dom"],
});
