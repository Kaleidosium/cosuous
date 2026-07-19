import { defineConfig } from "vite";

const cosuous = "https://esm.sh/jsr/@usagi-computer/cosuous@0.1.5";

export default defineConfig({
  resolve: {
    alias: [{ find: /^cosuous$/, replacement: cosuous }],
  },
  oxc: {
    jsx: { runtime: "classic", pragma: "h", pragmaFrag: "Fragment" },
  },
});
