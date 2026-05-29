import { useEffect, useRef, type DependencyList, type EffectCallback } from "react";

/**
 * Like `useEffect`, but skips the effect on the initial mount and only runs on
 * subsequent dependency updates.
 *
 * @example
 * useUpdateEffect(() => {
 *   console.log("value changed (not on mount)");
 * }, [value]);
 */
export function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
