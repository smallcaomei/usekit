import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` that does not warn during server-side rendering.
 *
 * On the server (where there is no DOM) it falls back to `useEffect`, which
 * avoids the well-known "useLayoutEffect does nothing on the server" warning
 * while still using the layout effect in the browser.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
