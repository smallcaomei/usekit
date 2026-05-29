import { useEffect, useRef, useState } from "react";

/**
 * Returns a throttled copy of `value` that updates at most once per `interval`
 * milliseconds, always settling on the latest value.
 *
 * @example
 * const throttledScroll = useThrottle(scrollY, 200);
 */
export function useThrottle<T>(value: T, interval = 500): T {
  const [throttled, setThrottled] = useState<T>(value);
  const lastRun = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastRun.current;

    if (elapsed >= interval) {
      lastRun.current = now;
      setThrottled(value);
      return;
    }

    const id = setTimeout(() => {
      lastRun.current = Date.now();
      setThrottled(value);
    }, interval - elapsed);

    return () => clearTimeout(id);
  }, [value, interval]);

  return throttled;
}
