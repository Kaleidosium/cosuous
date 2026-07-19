import { html, signal } from "cosuous";
import { effect, type Signal, untracked } from "cosuous/signal";
import { card } from "../../components/card.ts";
import { sampleData } from "./sample-data.ts";
import { Parser } from "./parse.ts";

import "./cells.css";

type Cells = Record<string, Signal<string>>;

interface CellsProps {
  readonly shape?: [number, number];
}

interface CellProps {
  readonly j: string;
  readonly i: number;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const range = (n: number): number[] => [...Array(n).keys()];

const getBase26 = (n: number): number[] => {
  const result: number[] = [];
  while (n > 25) {
    result.push(n % 26);
    n = Math.floor(n / 26) - 1;
  }
  result.push(n);
  return result.reverse();
};

const getNumberAsLetters = (n: number): string => getBase26(n).map((num) => LETTERS[num]).join("");

const letterRange = (n: number): string[] => range(n).map(getNumberAsLetters);

const findAdjacent = <T>(
  arr: readonly T[],
  value: T,
  direction: "before" | "after",
): T | null => {
  const index = arr.indexOf(value);
  if (index === -1) return null;
  return (direction === "before" ? arr[index - 1] : arr[index + 1]) ?? null;
};

export const cells = (props?: CellsProps): Node => {
  const shape = props?.shape ?? [100, 100];

  const initial: Cells = {};
  for (const key of Object.keys(sampleData)) {
    initial[key] = signal(sampleData[key]);
  }
  const data = signal<Cells>(initial);

  const rows = range(shape[1]);
  const columns = letterRange(shape[0]);
  const parser = new Parser(data, columns, rows);

  const focused = signal<string>();
  let tBody: Element | null = null;

  const createNewCell = (key: string): void => {
    const dataRef = untracked(() => data());
    if (!dataRef[key]) {
      dataRef[key] = signal("");
      data(dataRef);
    }
  };

  const handleFocus = (key: string): void => {
    if (focused() !== key) {
      createNewCell(key);
      focused(key);
      const target = tBody?.querySelector("#input-" + key);
      if (target instanceof HTMLInputElement) {
        target.focus();
        target.setSelectionRange(0, 9999);
      }
    }
  };

  const handleBlur = (key: string): void => {
    if (focused() === key) focused(undefined);
  };

  const handleInput = (e: Event, key: string): void => {
    untracked(() => data())[key]((e.target as HTMLInputElement).value);
  };

  const handleKeydown = (e: KeyboardEvent, column: string, row: number): void => {
    let selector: string | null = null;
    if (e.key === "ArrowUp") {
      const newRow = findAdjacent(rows, row, "before");
      selector = newRow !== null ? column + newRow : null;
    }
    if (e.key === "ArrowDown" || e.key === "Enter") {
      const newRow = findAdjacent(rows, row, "after");
      selector = newRow !== null ? column + newRow : null;
    }
    if (e.key === "ArrowLeft" && e.altKey) {
      const newColumn = findAdjacent(columns, column, "before");
      selector = newColumn !== null ? newColumn + row : null;
    }
    if (e.key === "ArrowRight" && e.altKey) {
      const newColumn = findAdjacent(columns, column, "after");
      selector = newColumn !== null ? newColumn + row : null;
    }
    if (selector) {
      e.preventDefault();
      handleFocus(selector);
    }
  };

  const clear = (): void => data({});

  const cellView = ({ j, i }: CellProps): Node => {
    const key = j + i;
    const hasFocus = signal(false);

    effect(() => {
      if (focused() === key && !untracked(() => hasFocus())) {
        hasFocus(true);
      } else if (focused() !== key && untracked(() => hasFocus())) {
        hasFocus(false);
      }
    });

    return html`${() =>
      hasFocus()
        ? html`
            <input
              id=${"input-" + key}
              autofocus
              value=${() => (key in data() ? data()[key]() : "")}
              onfocus=${() => handleFocus(key)}
              onblur=${() => handleBlur(key)}
              onkeydown=${(e: Event) => handleKeydown(e as KeyboardEvent, j, i)}
              oninput=${(e: Event) => handleInput(e, key)}
            />
          `
        : html`
            <div>${() => (key in data() ? parser.parse(data()[key]()) : "")}</div>
          `}`;
  };

  const view = html`
    <${card} title="Cells">
      <div class="wrapper">
        <table>
          <thead>
            <tr>
              <td class="row-key"></td>
              ${() => columns.map((column) => html`<td class="column-key">${column}</td>`)}
            </tr>
          </thead>
          <tbody>
            ${() =>
    rows.map((i) =>
      html`
                  <tr id=${"row-" + i}>
                    <td class="row-key">${i}</td>
                    ${() =>
        columns.map((j) =>
          html`
                          <td id=${j + i} onclick=${() => handleFocus(j + i)}>
                            <${cellView} j=${j} i=${i} />
                          </td>
                        `
        )}
                  </tr>
                `
    )}
          </tbody>
        </table>
      </div>
      <button onclick=${clear}>Clear</button>
    <//>
  `;

  tBody = view.querySelector("tbody");

  return view;
};
