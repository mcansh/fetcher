#!/usr/bin/env node

import esbuild from "esbuild";

const args = process.argv.slice(2);

esbuild.buildSync({
  entryPoints: ["./src/index.js"],
  bundle: true,
  outdir: "./dist",
  format: "esm",
  sourcemap: true,
  outExtension: { ".js": ".mjs" },
  watch: args.includes("--watch"),
});

esbuild.buildSync({
  entryPoints: ["./src/index.js"],
  bundle: true,
  outdir: "./dist",
  format: "cjs",
  sourcemap: true,
  outExtension: { ".js": ".cjs" },
  watch: args.includes("--watch"),
});
