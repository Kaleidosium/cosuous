// Vite resolves style imports as side-effecting modules; declare them so
// `deno check` accepts `import "./styles.css"`.
declare module "*.css";
