import { useEffect, useState } from "react";

export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Tracks the browser window's inner dimensions. SSR-safe: returns `0`/`0`
 * (or the provided defaults) on the server, then updates after mount.
 *
 * @example
 * const { width, height } = useWindowSize();
 */
export function useWindowSize(
  defaultSize: WindowSize = { width: 0, height: 0 },
): WindowSize {
  const [size, setSize] = useState<WindowSize>(() => {
    if (typeof window === "undefined") return defaultSize;
    return { width: window.innerWidth, height: window.innerHeight };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}
