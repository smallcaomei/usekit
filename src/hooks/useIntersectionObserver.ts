import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Stop observing once the element has become visible once. */
  freezeOnceVisible?: boolean;
}

export interface UseIntersectionObserverResult<T extends Element> {
  /** Attach this to the element you want to observe. */
  ref: (node: T | null) => void;
  /** The latest `IntersectionObserverEntry`, or `null` before the first callback. */
  entry: IntersectionObserverEntry | null;
  /** Convenience flag derived from `entry.isIntersecting`. */
  isIntersecting: boolean;
}

/**
 * Observe an element's intersection with the viewport (or a root element).
 * Great for lazy-loading, infinite scroll, and reveal-on-scroll animations.
 *
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({ freezeOnceVisible: true });
 * return <img ref={ref} src={isIntersecting ? realSrc : placeholder} />;
 */
export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverResult<T> {
  const { root, rootMargin, threshold, freezeOnceVisible } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<T | null>(null);
  const frozen = useRef(false);

  useEffect(() => {
    if (
      !node ||
      typeof IntersectionObserver === "undefined" ||
      frozen.current
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([nextEntry]) => {
        if (!nextEntry) return;
        setEntry(nextEntry);
        if (freezeOnceVisible && nextEntry.isIntersecting) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, root, rootMargin, JSON.stringify(threshold), freezeOnceVisible]);

  return {
    ref: setNode,
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
  };
}
