import { useEffect, useRef } from "react";

/**
 * Returns the value from the previous render. On the first render it returns
 * `undefined`.
 *
 * @example
 * const prevCount = usePrevious(count);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
