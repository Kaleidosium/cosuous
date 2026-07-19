import { defineConfig } from "vite";

// Self-contained: cosuous comes from the JSR CDN (esm.sh) instead of local src/.
// Vite leaves the https specifier external, so the browser fetches it. This
// config is .mjs (not .ts) so Vite loads it directly under Deno, avoiding the
// config-bundling path that would otherwise need an unstable Deno flag.
const cosuous = "https://esm.sh/jsr/@usagi-computer/cosuous@0.1.5";

export default defineConfig({
  resolve: {
    alias: [{ find: /^cosuous$/, replacement: cosuous }],
  },
});
