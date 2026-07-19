import { html } from "cosuous";
import "./app.css";

import { counter } from "./tasks/counter.ts";
import { temperatureConverter } from "./tasks/temperature-converter.ts";
import { flightBooker } from "./tasks/flight-booker.ts";
import { timer } from "./tasks/timer.ts";
import { crud } from "./tasks/crud.ts";
import { circleDrawer } from "./tasks/circle-drawer.ts";
import { cells } from "./tasks/cells/cells.ts";

export const app = (): Node =>
  html`
    <main className="App">
      <${counter} />
      <${temperatureConverter} />
      <${flightBooker} />
      <${timer} />
      <${crud} />
      <${circleDrawer} />
      <${cells} />
    </main>
  `;
