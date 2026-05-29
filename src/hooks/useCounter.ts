import { useCallback, useMemo, useState } from "react";

export interface UseCounterOptions {
  /** Lower bound. The value will never go below this. */
  min?: number;
  /** Upper bound. The value will never go above this. */
  max?: number;
}

export interface UseCounterActions {
  /** Increase by `delta` (default 1). */
  inc: (delta?: number) => void;
  /** Decrease by `delta` (default 1). */
  dec: (delta?: number) => void;
  /** Set to an absolute value (or via updater function). */
  set: (value: number | ((prev: number) => number)) => void;
  /** Reset back to the initial value. */
  reset: () => void;
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value;
  if (typeof max === "number") next = Math.min(next, max);
  if (typeof min === "number") next = Math.max(next, min);
  return next;
}

/**
 * Numeric counter with optional clamping and convenient actions.
 *
 * @example
 * const [count, { inc, dec, set, reset }] = useCounter(0, { min: 0, max: 10 });
 */
export function useCounter(
  initialValue = 0,
  options: UseCounterOptions = {},
): [number, UseCounterActions] {
  const { min, max } = options;
  const [count, setCount] = useState<number>(() =>
    clamp(initialValue, min, max),
  );

  const set = useCallback<UseCounterActions["set"]>(
    (value) => {
      setCount((prev) => {
        const resolved =
          typeof value === "function"
            ? (value as (p: number) => number)(prev)
            : value;
        return clamp(resolved, min, max);
      });
    },
    [min, max],
  );

  const inc = useCallback(
    (delta = 1) => set((prev) => prev + delta),
    [set],
  );
  const dec = useCallback(
    (delta = 1) => set((prev) => prev - delta),
    [set],
  );
  const reset = useCallback(
    () => setCount(clamp(initialValue, min, max)),
    [initialValue, min, max],
  );

  const actions = useMemo(
    () => ({ inc, dec, set, reset }),
    [inc, dec, set, reset],
  );

  return [count, actions];
}
