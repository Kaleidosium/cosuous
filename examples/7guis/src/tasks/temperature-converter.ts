import { html, type Signal, signal } from "cosuous";
import { card } from "../components/card.ts";

import "./temperature-converter.css";

const trunc = (n: number): number => Number(n.toFixed(2));

const remove0 = (n: string): string => {
  if (/^0\d+$/.test(n)) return n.slice(1);
  if (/^-0\d+$/.test(n)) return "-" + n.slice(2);
  return n;
};

const getC = (f: number): number => trunc((5 / 9) * (f - 32)) || -17.78; // 0 F
const getF = (c: number): number => trunc((9 / 5) * c + 32) || 32; // 0 C

const isValid = (temp: string): boolean =>
  /^-?\d*$/.test(temp) || /^-?\d+[.]?\d*$/.test(temp);

export const temperatureConverter = (): Node => {
  const c = signal("0");
  const f = signal("32");

  const update = (
    e: Event,
    from: Signal<string>,
    to: Signal<string>,
    get: (n: number) => number,
  ): void => {
    const raw = (e.target as HTMLInputElement).value;
    if (!isValid(raw)) return;
    const value = remove0(raw);
    from(value);
    to(String(get(Number(value))));
  };

  const updateFromC = (e: Event): void => update(e, c, f, getF);
  const updateFromF = (e: Event): void => update(e, f, c, getC);

  return html`
    <${card} title="Temperature Converter">
      <span>
        <input value=${c} oninput=${updateFromC} />
        Celsius
      </span>
      =
      <span>
        <input value=${f} oninput=${updateFromF} />
        Fahrenheit
      </span>
    <//>
  `;
};
