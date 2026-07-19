import { defineConfig } from "vite";

// Self-contained: cosuous and temporal-polyfill come from the esm.sh CDN
// instead of node_modules. Vite leaves the https specifiers external, so the
// browser fetches them. This config is .mjs (not .ts) so Vite loads it directly
// under Deno, avoiding the config-bundling path that needs an unstable flag.
const cosuous = "https://esm.sh/jsr/@usagi-computer/cosuous@0.1.5";

export default defineConfig({
  resolve: {
    alias: [
      { find: /^cosuous$/, replacement: cosuous },
      { find: /^cosuous\/signal$/, replacement: `${cosuous}/signal` },
      { find: /^temporal-polyfill-lite$/, replacement: "https://esm.sh/temporal-polyfill-lite@0.4.0" },
    ],
  },
});
