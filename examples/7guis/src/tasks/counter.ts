import { html, signal } from "cosuous";
import { card } from "../components/card.ts";

import "./counter.css";

export const counter = (): Node => {
  const count = signal(0);

  return html`
    <${card} title="Counter">
      ${count}
      <button onclick=${() => count(count() + 1)}>+</button>
    <//>
  `;
};
