import { html, signal, svg } from "cosuous";
import { effect, type Signal, untracked } from "cosuous/signal";
import { card } from "../components/card.ts";

import "./circle-drawer.css";

interface Circle {
  readonly x: number;
  readonly y: number;
  readonly r: number;
}

interface CircleProps {
  readonly circle: Circle;
  readonly handleRightClick: (e: Event) => void;
}

export const circleDrawer = (): Node => {
  const BASE_RADIUS = 30;

  const step = signal(0);
  const snapshots = signal<Array<Signal<Circle[]>>>([signal<Circle[]>([])]);
  const radius = signal(BASE_RADIUS);
  const resizing = signal<Circle | false>(false);
  const present = signal<Circle[]>([]);

  effect(() => present(snapshots()[step()]()));
  effect(() => {
    const box = resizing();
    if (!box) return;
    const circles = untracked(() => present());
    const i = circles.findIndex((c) => c.x === box.x && c.y === box.y);
    const next = circles.slice();
    next[i] = { ...circles[i], r: Number(radius()) };
    present(next);
  });

  const addSnapshot = (snapshot: Signal<Circle[]>): void => {
    const next = snapshots().slice(0, step() + 1);
    next.push(snapshot);
    snapshots(next);
    step(step() + 1);
  };

  const handleRightClick = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
    const circle = e.target as SVGCircleElement;
    const box: Circle = {
      x: circle.cx.baseVal.value,
      y: circle.cy.baseVal.value,
      r: circle.r.baseVal.value,
    };
    resizing(box);
    radius(box.r);
  };

  const addCircle = (e: Event): void => {
    const { layerX, layerY } = e as MouseEvent & { layerX: number; layerY: number };
    const next = present().slice();
    next.push({ x: layerX, y: layerY, r: BASE_RADIUS });
    addSnapshot(signal(next));
  };

  const undo = (): void => step(Math.max(step() - 1, 0));
  const redo = (): void => step(Math.min(step() + 1, snapshots().length - 1));

  const endResize = (): void => {
    const box = resizing();
    if (box && radius() !== box.r) {
      resizing(false);
      radius(BASE_RADIUS);
      addSnapshot(signal(present().slice()));
    }
    resizing(false);
  };

  const overlay = (): Node =>
    html`
      <div class="overlay" onclick=${endResize}></div>
      <div class="resizer">
        <p>
          Adjust radius of circle at
          (${() => {
      const box = resizing();
      return box ? box.x : "";
    }},
          ${() => {
      const box = resizing();
      return box ? box.y : "";
    }})
        </p>
        <p>${radius}</p>
        <input
          type="range"
          min=${0}
          max=${100}
          value=${radius}
          oninput=${(e: Event) => radius(Number((e.target as HTMLInputElement).value))}
        />
      </div>
    `;

  const circleSVG = ({ circle, handleRightClick }: CircleProps): Node =>
    svg`
      <circle
        cx=${circle.x}
        cy=${circle.y}
        r=${circle.r}
        fill="white"
        stroke="black"
        onclick=${(e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    }}
        oncontextmenu=${handleRightClick}
      />
    `;

  return html`
    <${card} title="Circle Drawer">
      <div class="wrapper">
        <div class="buttons">
          <button disabled=${() => !step()} onclick=${undo}>Undo</button>
          <button
            disabled=${() => step() === snapshots().length - 1}
            onclick=${redo}
          >
            Redo
          </button>
        </div>
        <div class="canvas">
          ${() =>
    svg`
            <svg onclick=${addCircle}>
              ${() =>
      present().map((cir) =>
        html`
                    <${circleSVG} circle=${cir} handleRightClick=${handleRightClick} />
                  `
      )}
            </svg>
          `}
        </div>
        ${() => resizing() && overlay}
      </div>
    <//>
  `;
};
