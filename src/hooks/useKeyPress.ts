import { useEffect } from "react";
import { useLatest } from "./useLatest";

export interface UseKeyPressOptions {
  /** Event to listen for. Defaults to `keydown`. */
  event?: "keydown" | "keyup";
  /** Target to attach the listener to. Defaults to `window`. */
  target?: Window | Document | HTMLElement | null;
  /** Require these modifier keys to be held. */
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  /** Call `event.preventDefault()` when the combo matches. */
  preventDefault?: boolean;
}

type KeyFilter = string | string[] | ((event: KeyboardEvent) => boolean);

function matches(event: KeyboardEvent, filter: KeyFilter): boolean {
  if (typeof filter === "function") return filter(event);
  const keys = Array.isArray(filter) ? filter : [filter];
  return keys.some(
    (k) => k.toLowerCase() === event.key.toLowerCase() || k === event.code,
  );
}

/**
 * Runs `handler` when a matching key (or key combo) is pressed. `keys` may be
 * a single key, an array of keys, or a predicate over the `KeyboardEvent`.
 *
 * @example
 * useKeyPress("Escape", () => close());
 * useKeyPress("k", openPalette, { modifiers: { meta: true }, preventDefault: true });
 */
export function useKeyPress(
  keys: KeyFilter,
  handler: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {},
): void {
  const {
    event = "keydown",
    target,
    modifiers,
    preventDefault = false,
  } = options;
  const savedHandler = useLatest(handler);

  useEffect(() => {
    const node =
      target ?? (typeof window !== "undefined" ? window : null);
    if (!node) return;

    const listener = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (!matches(ke, keys)) return;
      if (modifiers) {
        if (modifiers.ctrl !== undefined && ke.ctrlKey !== modifiers.ctrl) return;
        if (modifiers.shift !== undefined && ke.shiftKey !== modifiers.shift) return;
        if (modifiers.alt !== undefined && ke.altKey !== modifiers.alt) return;
        if (modifiers.meta !== undefined && ke.metaKey !== modifiers.meta) return;
      }
      if (preventDefault) ke.preventDefault();
      savedHandler.current(ke);
    };

    node.addEventListener(event, listener);
    return () => node.removeEventListener(event, listener);
  }, [
    keys,
    event,
    target,
    preventDefault,
    savedHandler,
    modifiers?.ctrl,
    modifiers?.shift,
    modifiers?.alt,
    modifiers?.meta,
    modifiers,
  ]);
}
