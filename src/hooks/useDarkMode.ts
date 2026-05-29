import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useStorage";
import { useMediaQuery } from "./useMediaQuery";

export type ColorMode = "light" | "dark";

export interface UseDarkModeOptions {
  /** localStorage key used to persist the preference. */
  storageKey?: string;
  /** Class toggled on the root element when dark mode is on. */
  className?: string;
  /** Element to toggle the class on. Defaults to `document.documentElement`. */
  element?: HTMLElement | null;
  /** Override the initial mode; defaults to the OS `prefers-color-scheme`. */
  defaultMode?: ColorMode;
}

export interface UseDarkModeResult {
  isDark: boolean;
  mode: ColorMode;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  set: (mode: ColorMode) => void;
}

/**
 * Dark-mode state that persists to `localStorage`, follows the OS preference by
 * default, and toggles a class on the document root so CSS can react.
 *
 * @example
 * const { isDark, toggle } = useDarkMode();
 * <button onClick={toggle}>{isDark ? "🌙" : "☀️"}</button>
 */
export function useDarkMode(
  options: UseDarkModeOptions = {},
): UseDarkModeResult {
  const {
    storageKey = "usekit-color-mode",
    className = "dark",
    element,
    defaultMode,
  } = options;

  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const fallback: ColorMode = defaultMode ?? (prefersDark ? "dark" : "light");

  const [mode, setMode] = useLocalStorage<ColorMode>(storageKey, fallback);
  const isDark = mode === "dark";

  useEffect(() => {
    if (typeof document === "undefined") return;
    const target = element ?? document.documentElement;
    target.classList.toggle(className, isDark);
  }, [isDark, className, element]);

  const set = useCallback((next: ColorMode) => setMode(next), [setMode]);
  const enable = useCallback(() => setMode("dark"), [setMode]);
  const disable = useCallback(() => setMode("light"), [setMode]);
  const toggle = useCallback(
    () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    [setMode],
  );

  return { isDark, mode, toggle, enable, disable, set };
}
