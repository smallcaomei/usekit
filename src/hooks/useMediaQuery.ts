import { useEffect, useState } from "react";

/**
 * Tracks whether a CSS media query currently matches. SSR-safe: returns
 * `defaultMatches` (default `false`) until hydrated on the client.
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 * const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
 */
export function useMediaQuery(query: string, defaultMatches = false): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return defaultMatches;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mql.matches);

    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Safari < 14 fallback.
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, [query]);

  return matches;
}
