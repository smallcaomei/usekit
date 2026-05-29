import { useEffect, type RefObject } from "react";
import { useLatest } from "./useLatest";

type PointerEvents = "mousedown" | "mouseup" | "click" | "touchstart" | "pointerdown";

/**
 * Invokes `handler` when a pointer event occurs outside the referenced
 * element(s). Pass one ref or an array of refs (e.g. a trigger + a popover).
 *
 * @example
 * const ref = useRef(null);
 * useClickOutside(ref, () => setOpen(false));
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | Array<RefObject<T | null>>,
  handler: (event: MouseEvent | TouchEvent | PointerEvent) => void,
  eventName: PointerEvents = "mousedown",
): void {
  const savedHandler = useLatest(handler);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const listener = (event: Event) => {
      const refs = Array.isArray(ref) ? ref : [ref];
      const target = event.target as Node | null;
      if (!target || !target.isConnected) return;

      const isInside = refs.some((r) => {
        const el = r.current;
        return el != null && el.contains(target);
      });

      if (!isInside) {
        savedHandler.current(
          event as MouseEvent | TouchEvent | PointerEvent,
        );
      }
    };

    document.addEventListener(eventName, listener, true);
    return () => document.removeEventListener(eventName, listener, true);
  }, [ref, eventName, savedHandler]);
}
