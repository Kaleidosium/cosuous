// Vite resolves style imports as side-effecting modules; declare them so
// `deno check` accepts `import "./app.css"` and friends.
declare module "*.css";
