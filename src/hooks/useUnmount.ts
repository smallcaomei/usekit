import { useEffect } from "react";
import { useLatest } from "./useLatest";

/**
 * Runs a callback exactly once, right before the component unmounts. The latest
 * version of the callback is always used.
 *
 * @example
 * useUnmount(() => socket.close());
 */
export function useUnmount(fn: () => void): void {
  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    [fnRef],
  );
}
