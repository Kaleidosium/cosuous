/// <reference path="./jsx.d.ts" />
import "./styles.css";
import { h, html, signal } from "cosuous";

const counter = signal(0);

/** Write a view with the html`` tagged template. */
const taggedTemplateView = () => {
  return html`
    <div>Counter ${counter}</div>
  `;
};
document.body.append(taggedTemplateView());

/** Write a view with hyperscript function calls. */
const hyperscriptView = () => {
  return h("div", null, "Counter ", counter);
};
document.body.append(hyperscriptView());

/** Write a view with JSX. */
const jsxView = () => {
  return <div>Counter {counter}</div>;
};
document.body.append(jsxView());

setInterval(() => counter(counter() + 1), 1000);
