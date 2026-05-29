import { useEffect } from "react";

/**
 * Runs a callback exactly once, after the component mounts.
 *
 * @example
 * useMount(() => console.log("mounted"));
 */
export function useMount(fn: () => void): void {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
