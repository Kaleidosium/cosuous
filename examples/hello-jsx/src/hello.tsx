/// <reference path="./jsx.d.ts" />
import { type ElementChildren, h } from "cosuous";

// cosuous builds a DocumentFragment from an array-first h() call. Expose that
// as a function component so JSX `<>...</>` (compiled to h(Fragment, null, ...))
// both type-checks and renders as a fragment.
const Fragment = (_props: unknown, ...children: ElementChildren[]): Node => h([], ...children);

const HelloMessage = ({ name }: { name: string }): Node => (
  <>
    <div>Hello {name}</div>
    <div>How are you?</div>
  </>
);

document.querySelector(".hello-example")?.append(<HelloMessage name="World" />);
