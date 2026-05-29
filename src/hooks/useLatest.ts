import { useRef } from "react";

/**
 * Returns a ref that always holds the latest value passed to the hook.
 *
 * Useful for reading the freshest value inside callbacks/effects without
 * re-subscribing or re-creating the callback on every render.
 *
 * @example
 * const latest = useLatest(count);
 * // inside an event listener registered once:
 * console.log(latest.current); // always the newest `count`
 */
export function useLatest<T>(value: T): { readonly current: T } {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
