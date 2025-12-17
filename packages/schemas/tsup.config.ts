import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/dev-entities/index.ts"],
  format: ["esm"],
  clean: true,
  sourcemap: true,
});
