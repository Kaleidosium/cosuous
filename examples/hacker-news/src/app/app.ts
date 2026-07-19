import { html } from "cosuous";
import { resolve, route } from "./router.ts";

const NAV = ["top", "new", "best", "show", "ask"];

export const App = (): Node =>
  html`
    <div class="layout">
      <div class="nav">
        <div class="container">
          <span class="nav-title">hn</span>
          ${() =>
    NAV.map((path) =>
      html`
            <a href=${"#" + path} class="nav-item ${route() === path ? "is-active" : ""}">
              ${path}
            </a>
          `
    )}
        </div>
      </div>
      <div class="layout-container">
        <div class="container">
          ${() => resolve(route())}
        </div>
      </div>
    </div>
  `;
