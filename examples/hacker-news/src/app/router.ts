import { signal } from "cosuous/signal";
import { Stories } from "./stories.ts";
import { CommentPageLoader } from "./comments.ts";

interface RouteParams {
  readonly id?: string;
}

type View = (params: RouteParams) => Node | undefined;

interface Route {
  readonly pattern: RegExp;
  readonly view: View;
}

const routes: readonly Route[] = [
  {
    pattern: /^$/,
    view: (): undefined => {
      document.location.hash = "#top";
      return undefined;
    },
  },
  { pattern: /^top$/, view: Stories("top") },
  { pattern: /^new$/, view: Stories("new") },
  { pattern: /^best$/, view: Stories("best") },
  { pattern: /^show$/, view: Stories("show") },
  { pattern: /^ask$/, view: Stories("ask") },
  { pattern: /^item\/(?<id>\d+)$/, view: CommentPageLoader },
];

export const route = signal("");

export function resolve(path: string): Node | undefined {
  for (const { pattern, view } of routes) {
    const result = path.match(pattern);
    if (result) {
      return view({ ...result.groups });
    }
  }
  return undefined;
}

const updateRoute = (): void => route(document.location.hash.slice(1));

globalThis.addEventListener("hashchange", updateRoute);

updateRoute();
