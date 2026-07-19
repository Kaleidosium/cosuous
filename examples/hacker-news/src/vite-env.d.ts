// Vite resolves style imports as side-effecting modules; declare them so
// `deno check` accepts `import "./styles/index.scss"` and friends.
declare module "*.css";
declare module "*.scss";
