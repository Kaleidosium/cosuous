import { html } from "cosuous";
import { effect, onCleanup, type Signal, signal } from "cosuous/signal";
import { DatePicker } from "./date-picker.ts";

interface DateInputProps {
  readonly value: Signal<string>;
}

const onClickOutside = (el: Node, callback: () => void): void => {
  const onClick = (e: MouseEvent): void => {
    if (!el.contains(e.target as Node | null)) {
      callback();
    }
  };

  document.addEventListener("click", onClick, true);

  onCleanup(() => document.removeEventListener("click", onClick, true));
};

export const DateInput = ({ value }: DateInputProps): Node => {
  const isOpen = signal(false);

  const control = html`
    <span class="date-input">
      <input type="text" value=${() => value()} onClick=${() => isOpen(true)} />
      ${() =>
    isOpen()
      ? html`<div class="date-input-position"><div class="date-input-popup">${
        DatePicker({ value })
      }</div></div>`
      : null}
    </span>
  `;

  effect(() => {
    value();
    isOpen(false);
  });

  onClickOutside(control, () => isOpen() && isOpen(false));

  return control;
};
