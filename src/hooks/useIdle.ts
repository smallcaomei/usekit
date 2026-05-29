import { useEffect, useRef, useState } from "react";

const DEFAULT_EVENTS: Array<keyof WindowEventMap> = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "wheel",
  "scroll",
];

export interface UseIdleOptions {
  /** Events that count as user activity. */
  events?: Array<keyof WindowEventMap>;
  /** Start in the idle state. Defaults to `false`. */
  initialState?: boolean;
}

/**
 * Returns `true` once the user has been inactive for `timeout` milliseconds.
 * Resets on any tracked activity event or when the tab regains visibility.
 *
 * @example
 * const idle = useIdle(60_000); // idle after a minute
 */
export function useIdle(
  timeout = 60_000,
  options: UseIdleOptions = {},
): boolean {
  const { events = DEFAULT_EVENTS, initialState = false } = options;
  const [idle, setIdle] = useState(initialState);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reset = () => {
      setIdle(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setIdle(true), timeout);
    };

    const onVisibility = () => {
      if (!document.hidden) reset();
    };

    reset();

    events.forEach((event) =>
      window.addEventListener(event, reset, { passive: true }),
    );
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, reset));
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeout]);

  return idle;
}
