import { useMemo, useState } from "react";

export interface UseListActions<T> {
  set: (list: T[]) => void;
  push: (...items: T[]) => void;
  removeAt: (index: number) => void;
  insertAt: (index: number, item: T) => void;
  updateAt: (index: number, item: T) => void;
  clear: () => void;
  filter: (predicate: (item: T, index: number) => boolean) => void;
  sort: (compareFn?: (a: T, b: T) => number) => void;
  reset: () => void;
}

/**
 * Manage an array in state with a full set of immutable helpers.
 *
 * @example
 * const [items, { push, removeAt, clear }] = useList<string>(["a"]);
 */
export function useList<T>(
  initial: T[] = [],
): [T[], UseListActions<T>] {
  const [list, setList] = useState<T[]>(initial);

  const actions = useMemo<UseListActions<T>>(
    () => ({
      set: (next) => setList(next),
      push: (...items) => setList((prev) => [...prev, ...items]),
      removeAt: (index) =>
        setList((prev) => prev.filter((_, i) => i !== index)),
      insertAt: (index, item) =>
        setList((prev) => {
          const next = prev.slice();
          next.splice(index, 0, item);
          return next;
        }),
      updateAt: (index, item) =>
        setList((prev) => prev.map((v, i) => (i === index ? item : v))),
      clear: () => setList([]),
      filter: (predicate) => setList((prev) => prev.filter(predicate)),
      sort: (compareFn) => setList((prev) => prev.slice().sort(compareFn)),
      reset: () => setList(initial),
    }),
    [initial],
  );

  return [list, actions];
}
