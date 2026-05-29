import { useEffect } from "react";
import { useLatest } from "./useLatest";

/**
 * Declarative `setTimeout`. Pass `null` as the delay to cancel the pending
 * timeout. The callback can change without resetting the timer.
 *
 * @example
 * useTimeout(() => setVisible(false), 3000);
 */
export function useTimeout(
  callback: () => void,
  delay: number | null,
): void {
  const savedCallback = useLatest(callback);

  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay, savedCallback]);
}
