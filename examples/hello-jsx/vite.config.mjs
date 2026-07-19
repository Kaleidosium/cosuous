import { defineConfig } from "vite";

// Examples stay self-contained by pulling cosuous from the JSR CDN (esm.sh)
// rather than the local src/. Vite leaves the https specifier external, so the
// browser fetches it directly. Vite 8 transpiles JSX with Oxc, so the classic
// `h` pragma is configured via `oxc.jsx`. `Fragment` covers `<>...</>` (cosuous
// builds a fragment from h([], ...)). This config is .mjs (not .ts) so Vite
// loads it directly under Deno, avoiding the config-bundling path that would
// otherwise need the `bare-node-builtins` unstable flag.
const cosuous = "https://esm.sh/jsr/@usagi-computer/cosuous@0.1.5";

export default defineConfig({
  resolve: {
    alias: [{ find: /^cosuous$/, replacement: cosuous }],
  },
  oxc: {
    jsx: { runtime: "classic", pragma: "h", pragmaFrag: "Fragment" },
  },
});
