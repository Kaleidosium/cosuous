import { html, signal } from "cosuous";
import { computed } from "cosuous/signal";
import { card } from "../components/card.ts";

import "./timer.css";

export const timer = (): Node => {
  const MAX = 30000;

  const duration = signal(5000);
  const durationFormatted = computed(() => (duration() / 1000).toFixed(1));
  const start = signal<number>();
  const time = signal<number>();
  const progress = computed(() => ((time() ?? 0) - (start() ?? 0)) / duration());
  let interval: number | undefined;

  const createInterval = (): number => setInterval(() => time(Date.now()), 10);

  const startTimer = (): void => {
    if (interval !== undefined) clearInterval(interval);
    start(Date.now());
    time(start());
    interval = createInterval();
  };

  startTimer();

  return html`
    <${card} title="Timer">
      <div class="wrapper">
        Elapsed Time:
        <progress value=${progress} />
        <div class="duration">${durationFormatted}s</div>
        Duration:
        <input
          type="range"
          min=${0}
          max=${MAX}
          value=${duration}
          oninput=${(e: Event) => duration(Number((e.target as HTMLInputElement).value))}
        />
        <button onclick=${startTimer}>Reset Timer</button>
      </div>
    <//>
  `;
};
