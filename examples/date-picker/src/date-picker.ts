import { html } from "cosuous";
import { computed, type Signal, signal } from "cosuous/signal";

interface DatePickerProps {
  readonly value: Signal<string>;
  readonly days?: readonly string[];
  readonly months?: readonly string[];
  /** First day of the week (0 = Sunday, 1 = Monday). */
  readonly start?: number;
}

interface DayCell {
  readonly date: number;
  readonly value: string;
  readonly class: string;
}

const pad = (n: number): string => (n < 10 ? "0" + n : String(n));

export const iso = (date: Date): string =>
  date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());

export const DatePicker = ({
  value,
  days = "Su|Mo|Tu|We|Th|Fr|Sa".split("|"),
  months = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec".split("|"),
  start = 0,
}: DatePickerProps): Node => {
  // Offset in months from the currently selected date.
  const offset = signal(0);

  const date = computed(() => {
    const d = new Date(value());
    d.setMonth(d.getMonth() + offset());
    return d;
  });

  const month = computed(() => months[date().getMonth()]);
  const year = computed(() => date().getFullYear());

  const weeks = computed((): DayCell[][] => {
    const current = date();
    const selected = value();

    const first = new Date(current.getTime());
    first.setDate(1);
    first.setDate(first.getDate() + ((start - first.getDay() - 7) % 7));

    const last = new Date(current.getTime());
    last.setDate(new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate());
    last.setDate(last.getDate() + ((start - last.getDay() + 6) % 7));

    let day = new Date(first.getTime());
    let week: DayCell[] = [];
    const result: DayCell[][] = [week];
    const curMonth = current.getMonth();
    const curYear = current.getFullYear();

    while (day.getTime() <= last.getTime()) {
      const dayValue = iso(day);
      const inFuture = day.getMonth() > curMonth
        ? day.getFullYear() >= curYear
        : day.getFullYear() > curYear;

      week.push({
        date: day.getDate(),
        value: dayValue,
        class: [
          selected === dayValue ? "date-picker-selected" : "",
          day.getMonth() === curMonth ? "" : inFuture ? "date-picker-future" : "date-picker-past",
        ].join(" "),
      });

      day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);

      if (day.getDay() === start) {
        week = [];
        result.push(week);
      }
    }

    return result;
  });

  const go = (direction: number): void => offset(offset() + direction);

  return html`
    <table class="date-picker">
      <tr>
        <td class="date-picker-btn" onClick=${() => go(-1)}>◀</td>
        <td colSpan=5>${() => `${month()} ${year()}`}</td>
        <td class="date-picker-btn" onClick=${() => go(+1)}>▶</td>
      </tr>
      <tr>
        ${days.map((day) => html`<th>${day}</th>`)}
      </tr>
      ${() =>
    weeks().map((week) =>
      html`
            <tr>
              ${week.map((day) =>
        html`
                  <td
                    class="date-picker-btn ${day.class}"
                    onClick=${() => {
          offset(0);
          value(day.value);
        }}
                  >${day.date}</td>
                `)}
            </tr>
          `)}
    </table>
  `;
};
