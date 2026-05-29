import { useCallback, useEffect, useRef, useState } from "react";

export interface UseScrollLockResult {
  locked: boolean;
  lock: () => void;
  unlock: () => void;
  toggle: () => void;
}

/**
 * Locks/unlocks page scrolling — perfect for modals and drawers. Preserves the
 * original styles and compensates for the scrollbar width to avoid layout shift.
 *
 * @example
 * const { lock, unlock } = useScrollLock();
 * useEffect(() => (open ? lock() : unlock()), [open]);
 */
export function useScrollLock(initiallyLocked = false): UseScrollLockResult {
  const [locked, setLocked] = useState(initiallyLocked);
  const original = useRef<{ overflow: string; paddingRight: string } | null>(
    null,
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;

    if (locked) {
      if (original.current === null) {
        original.current = {
          overflow: body.style.overflow,
          paddingRight: body.style.paddingRight,
        };
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
          const currentPad =
            parseFloat(window.getComputedStyle(body).paddingRight) || 0;
          body.style.paddingRight = `${currentPad + scrollbarWidth}px`;
        }
      }
    } else if (original.current !== null) {
      body.style.overflow = original.current.overflow;
      body.style.paddingRight = original.current.paddingRight;
      original.current = null;
    }

    return () => {
      if (original.current !== null) {
        body.style.overflow = original.current.overflow;
        body.style.paddingRight = original.current.paddingRight;
        original.current = null;
      }
    };
  }, [locked]);

  const lock = useCallback(() => setLocked(true), []);
  const unlock = useCallback(() => setLocked(false), []);
  const toggle = useCallback(() => setLocked((l) => !l), []);

  return { locked, lock, unlock, toggle };
}
