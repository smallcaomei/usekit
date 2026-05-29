import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks whether the pointer is hovering over a referenced element.
 *
 * Returns a `[ref, isHovered]` tuple — attach `ref` to the target element.
 *
 * @example
 * const [ref, hovered] = useHover<HTMLDivElement>();
 * return <div ref={ref}>{hovered ? "👋" : "hover me"}</div>;
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  boolean,
] {
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<T | null>(null);

  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => setHovered(false), []);

  const detach = useCallback((node: T) => {
    node.removeEventListener("mouseenter", onEnter);
    node.removeEventListener("mouseleave", onLeave);
  }, [onEnter, onLeave]);

  const attach = useCallback((node: T) => {
    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mouseleave", onLeave);
  }, [onEnter, onLeave]);

  const callbackRef = useCallback(
    (node: T | null) => {
      if (nodeRef.current) {
        detach(nodeRef.current);
        setHovered(false);
      }
      nodeRef.current = node;
      if (node) attach(node);
    },
    [attach, detach],
  );

  useEffect(() => {
    return () => {
      if (nodeRef.current) detach(nodeRef.current);
    };
  }, [detach]);

  return [callbackRef, hovered];
}
