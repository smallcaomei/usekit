import { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type Target = Window | Document | HTMLElement | EventTarget | null | undefined;

/**
 * Strongly-typed, declarative `addEventListener` for window, document or any
 * DOM element. The handler can change between renders without re-binding.
 *
 * @example
 * useEventListener("keydown", (e) => console.log(e.key));
 * useEventListener("click", onClick, buttonRef);
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<T> | T | null,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: React.RefObject<Target> | Target,
  options?: boolean | AddEventListenerOptions,
): void {
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const target: Target =
      element && "current" in (element as React.RefObject<Target>)
        ? (element as React.RefObject<Target>).current
        : (element as Target);

    const node = target ?? (typeof window !== "undefined" ? window : undefined);
    if (!node || !node.addEventListener) return;

    const listener: EventListener = (event) => savedHandler.current(event);
    node.addEventListener(eventName, listener, options);
    return () => node.removeEventListener(eventName, listener, options);
  }, [eventName, element, options]);
}
