// Global JSX namespace wired to cosuous's exported JSX types so the classic
// `h` runtime JSX in this example type-checks. Pulled in via a triple-slash
// reference from the entry. Vite transpiles JSX with `jsxFactory: "h"`
// regardless of this file.
declare namespace JSX {
  type Element = import("cosuous").JSX.Element;
  type IntrinsicElements = import("cosuous").JSX.IntrinsicElements;
  type ElementChildrenAttribute = import("cosuous").JSX.ElementChildrenAttribute;
}
