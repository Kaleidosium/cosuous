import { defineConfig } from "vite";

// Self-contained: cosuous comes from the JSR CDN (esm.sh) instead of local src/.
// Vite leaves the https specifiers external, so the browser fetches them. This
// config is .mjs (not .ts) so Vite loads it directly under Deno, avoiding the
// config-bundling path that needs an unstable flag.
const cosuous = "https://esm.sh/jsr/@usagi-computer/cosuous@0.1.5";

export default defineConfig({
  resolve: {
    alias: [
      { find: /^cosuous$/, replacement: cosuous },
      { find: /^cosuous\/signal$/, replacement: `${cosuous}/signal` },
    ],
  },
});
