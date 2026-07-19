import "./styles.css";
import "./date-picker.css";
import "./date-input.css";

import { Temporal } from "temporal-polyfill-lite";
import { html } from "cosuous";
import { computed, signal } from "cosuous/signal";
import { iso } from "./date-picker.ts";
import { DateInput } from "./date-input.ts";

const App = (): Node => {
  const startDate = signal(iso(new Date()));
  const endDate = signal(iso(new Date()));

  const difference = computed(() =>
    Temporal.PlainDate.from(endDate())
      .since(Temporal.PlainDate.from(startDate()), { largestUnit: "day" })
      .days
  );

  return html`
    <h1>Cosuous Date-Picker</h1>
    <h4>Start Date:</h4>
    <${DateInput} value=${startDate} />
    <h4>End Date:</h4>
    <${DateInput} value=${endDate} />
    <h3>Total days: ${() => difference()}</h3>
  `;
};

document.getElementById("app")?.appendChild(App());
