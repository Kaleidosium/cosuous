import { html, type Signal, signal } from "cosuous";
import { computed } from "cosuous/signal";
import { card } from "../components/card.ts";

import "./flight-booker.css";

const flightMap: Record<string, string> = {
  1: "one-way flight",
  2: "return flight",
};

const tryAsDate = (dateString: string): number => {
  const parts = dateString.split(".").reverse();
  if (parts[1].length !== 2 || parts[2].length !== 2) return 0;
  return new Date(parts.join("-")).valueOf() || 0;
};

const formatAsString = (date: Date): string =>
  date.toISOString().slice(0, 10).split("-").reverse().join(".");

export const flightBooker = (): Node => {
  const flightType = signal<number | string>(1);
  const startDate = signal(formatAsString(new Date()));
  const returnDate = signal(formatAsString(new Date()));

  const error1 = computed(() => !tryAsDate(startDate()));
  const error2 = computed(() => !tryAsDate(returnDate()));
  const error3 = computed(() => tryAsDate(returnDate()) < tryAsDate(startDate()));

  const isBookButtonDisabled = computed(() => error1() || error2() || error3());
  const isOneWay = computed(() => flightType() === 1);
  const startDateClass = computed(() => (error1() ? "error" : ""));
  const returnDateClass = computed(() => (error2() ? "error" : ""));

  const book = (): void => {
    const timeStrings: Record<string, string> = {
      1: " for " + startDate(),
      2: " from " + startDate() + " to " + returnDate(),
    };
    alert("You have booked a " + flightMap[flightType()] + timeStrings[flightType()]);
  };

  return html`
    <${card} title="Flight Booker">
      <div>
        <select
          value=${flightType}
          onchange=${(e: Event) => flightType((e.target as HTMLSelectElement).value)}
        >
          <option value="{1}">${flightMap[1]}</option>
          <option value="{2}">${flightMap[2]}</option>
        </select>
        <input
          value=${startDate}
          class=${startDateClass}
          oninput=${(e: Event) => startDate((e.target as HTMLInputElement).value)}
        />
        <input
          value=${returnDate}
          class=${returnDateClass}
          oninput=${(e: Event) => returnDate((e.target as HTMLInputElement).value)}
          disabled=${isOneWay}
        />
        <button onclick=${book} disabled=${isBookButtonDisabled}>
          Book
        </button>
      </div>
    <//>
  `;
};
