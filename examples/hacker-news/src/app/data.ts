interface RawItem {
  readonly id: number;
  readonly time: number;
  readonly by?: string;
  readonly descendants?: number;
  readonly score?: number;
  readonly title?: string;
  readonly url?: string;
  readonly text?: string;
  readonly kids?: readonly number[];
}

/** A Hacker News item with its `time` parsed into a `Date`. */
export interface Item extends Omit<RawItem, "time"> {
  readonly time: Date;
}

const cache = new Map<string, Promise<unknown>>();

const get = <T>(path: string): Promise<T> => {
  const cached = cache.get(path);
  if (cached) return cached as Promise<T>;
  const pending = fetch(`https://hacker-news.firebaseio.com/v0/${path}`)
    .then((r) => r.json() as Promise<T>);
  cache.set(path, pending);
  return pending;
};

export const getItem = (id: number | string): Promise<Item> =>
  get<RawItem>(`item/${id}.json`).then((item) => ({ ...item, time: new Date(item.time * 1000) }));

export const getItems = (ids: readonly number[], limit?: number): Promise<Item[]> =>
  Promise.all(ids.slice(0, limit ?? 9999).map(getItem)).then((data) => data.filter(Boolean));

export const getStories = (type: string): Promise<Item[]> =>
  get<number[]>(`${type}stories.json`).then((ids) => getItems(ids, 20));
