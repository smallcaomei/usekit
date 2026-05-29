import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLatest } from "./useLatest";

export interface DebouncedFn<A extends unknown[]> {
  (...args: A): void;
  /** Cancel any pending invocation. */
  cancel: () => void;
  /** Immediately invoke any pending call with the most recent arguments. */
  flush: () => void;
}

/**
 * Returns a stable, debounced version of `callback`. The debounced function
 * exposes `cancel()` and `flush()` helpers and cleans up on unmount.
 *
 * @example
 * const onResize = useDebouncedCallback(() => measure(), 200);
 */
export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay = 500,
): DebouncedFn<A> {
  const cb = useLatest(callback);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgs = useRef<A | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  return useMemo<DebouncedFn<A>>(() => {
    const debounced = ((...args: A) => {
      lastArgs.current = args;
      clear();
      timer.current = setTimeout(() => {
        timer.current = null;
        const callArgs = lastArgs.current;
        lastArgs.current = null;
        if (callArgs) cb.current(...callArgs);
      }, delay);
    }) as DebouncedFn<A>;

    debounced.cancel = () => {
      clear();
      lastArgs.current = null;
    };

    debounced.flush = () => {
      if (timer.current && lastArgs.current) {
        clear();
        const callArgs = lastArgs.current;
        lastArgs.current = null;
        cb.current(...callArgs);
      }
    };

    return debounced;
  }, [cb, clear, delay]);
}
