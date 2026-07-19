import { html } from "cosuous";
import { signal } from "cosuous/signal";
import { getItem, getItems, type Item } from "./data.ts";
import { formatTime } from "./format.ts";
import { reveal } from "./reveal.ts";
import { Spinner } from "./spinner.ts";

interface CommentPageParams {
  readonly id?: string;
}

export const CommentPageLoader = ({ id }: CommentPageParams): Node => {
  const story = signal<Item>();

  if (id) getItem(id).then((data) => story(data));

  return html`
    ${() => {
    const s = story();
    return s ? CommentPage(s) : Spinner();
  }}
  `;
};

const CommentPage = ({ title, url, score, by, time, kids }: Item): Node =>
  html`
    <div class="comments">
      <a class="story-title" href=${url} target="_blank">${title}</a>
      <div class="story-by">${score} points by ${by} (${formatTime(time)})</div>
      ${CommentList(kids)}
    </div>
  `;

const CommentList = (ids: readonly number[] | undefined): Node => {
  const comments = signal<Item[]>();

  if (ids) getItems(ids).then((data) => comments(data));

  return html`
    ${() => {
    const list = comments();
    return list
      ? html`<div class="comments-list">${list.map(CommentItem)}</div>`
      : null;
  }}
  `;
};

const CommentItem = ({ text, time, by, kids }: Item): Node =>
  reveal(html`
    <div class="comments-item">
      <div class="comments-by">${by}</div>
      <div class="comments-time">${formatTime(time)}</div>
      <div class="comments-text" innerHTML=${text} />
      ${kids && kids.length ? CommentList(kids) : null}
    </div>
  `);
