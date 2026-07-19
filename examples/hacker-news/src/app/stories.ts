import { html } from "cosuous";
import { signal } from "cosuous/signal";
import { getStories, type Item } from "./data.ts";
import { formatTime } from "./format.ts";
import { Spinner } from "./spinner.ts";

interface StoryProps extends Item {
  readonly index: number;
}

export const Stories = (type: string): (() => Node) => {
  return (): Node => {
    const stories = signal<Item[]>();

    getStories(type).then((data) => stories(data));

    return html`
      <div>
        ${() => {
      const list = stories();
      return list ? list.map((story, i) => Story({ ...story, index: i + 1 })) : Spinner();
    }}
      </div>
    `;
  };
};

const Story = ({ index, id, by, descendants, score, time, title, url }: StoryProps): Node =>
  html`
    <div class="story">
      <div class="story-index">${index}</div>
      <div class="story-meta">
        <a class="story-title" href=${url} target="_blank">${title}</a>
        <div class="story-by">${score} points by ${by} | ${formatTime(time)}</div>
      </div>
      <a href=${`#item/${id}`} class="story-comments">
        ${descendants}
      </a>
    </div>
  `;
