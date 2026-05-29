import { useEffect } from "react";
import { useLatest } from "./useLatest";

/**
 * Declarative `setInterval`. Pass `null` as the delay to pause the interval.
 * The callback can change between renders without resetting the timer.
 *
 * @example
 * useInterval(() => setCount((c) => c + 1), running ? 1000 : null);
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
): void {
  const savedCallback = useLatest(callback);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay, savedCallback]);
}
