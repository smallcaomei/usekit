import { useCallback, useEffect, useRef, useState } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * Measures an element's content-box size and keeps it updated with a
 * `ResizeObserver`. Returns a `[ref, size]` tuple.
 *
 * @example
 * const [ref, { width, height }] = useElementSize<HTMLDivElement>();
 * return <div ref={ref}>{width} × {height}</div>;
 */
export function useElementSize<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  ElementSize,
] {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: T | null) => {
    observerRef.current?.disconnect();

    if (!node || typeof ResizeObserver === "undefined") {
      if (node) {
        setSize({ width: node.offsetWidth, height: node.offsetHeight });
      }
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const box = entry.contentBoxSize;
      if (box && box.length > 0) {
        const first = box[0]!;
        setSize({ width: first.inlineSize, height: first.blockSize });
      } else {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return [ref, size];
}
