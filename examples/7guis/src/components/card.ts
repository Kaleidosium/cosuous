import { type ElementChildren, html } from "cosuous";

import "./card.css";

interface CardProps {
  readonly title: string;
}

export const card = ({ title }: CardProps, ...children: ElementChildren[]): Node =>
  html`
    <section class=${"card " + title.replace(" ", "-")}>
      <h2>${title}</h2>
      ${children}
    </section>
  `;
