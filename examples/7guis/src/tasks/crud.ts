import { html, signal } from "cosuous";
import { computed, effect, type Signal } from "cosuous/signal";
import { card } from "../components/card.ts";

import "./crud.css";

type Entry = Signal<[string, string]>;

export const crud = (): Node => {
  const prefix = signal("");
  const entries = signal<Entry[]>([
    signal<[string, string]>(["Paul", "Atreides"]),
    signal<[string, string]>(["Gurney", "Halleck"]),
    signal<[string, string]>(["Duncan", "Idaho"]),
  ]);
  // Filtered [first, last, index] triples whose last name matches the prefix.
  const filteredEntries = computed<Array<[string, string, number]>>(() =>
    entries()
      .map((entry, i): [string, string, number] => [entry()[0], entry()[1], i])
      .filter((entry) => entry[1].toLowerCase().startsWith(prefix().toLowerCase()))
  );
  const name = signal("");
  const surname = signal("");
  const selected = signal(-1);
  effect(() => {
    prefix();
    selected(-1);
  });

  const createHandler = (): void => {
    entries(entries().concat(signal<[string, string]>([name(), surname()])));
  };
  const updateHandler = (): void => {
    if (selected() > -1) entries()[selected()]([name(), surname()]);
  };
  const deleteHandler = (): void => {
    if (selected() > -1) entries(entries().filter((_entry, i) => i !== selected()));
  };

  return html`
    <${card} title="CRUD">
      <div class="wrapper">
        Filter prefix:
        <input
          value=${prefix}
          oninput=${(e: Event) => prefix((e.target as HTMLInputElement).value)}
        />
        <select
          value=${selected}
          oninput=${(e: Event) => selected(Number((e.target as HTMLSelectElement).value))}
          size="4"
        >
          ${() =>
    filteredEntries().map((entry) =>
      html`
                <option value=${entry[2]}>${entry[1]}, ${entry[0]}</option>
              `
    )}
        </select>
        <div>
          Name:
          <input value=${name} oninput=${(e: Event) => name((e.target as HTMLInputElement).value)} />
          Surname:
          <input
            value=${surname}
            oninput=${(e: Event) => surname((e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="buttons">
          <button onclick=${createHandler}>Create</button>
          <button onclick=${updateHandler}>Update</button>
          <button onclick=${deleteHandler}>Delete</button>
        </div>
      </div>
    <//>
  `;
};
