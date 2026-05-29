import { useCallback, useEffect, useState } from "react";

type StorageType = "local" | "session";

export interface UseStorageOptions<T> {
  /** Custom serializer. Defaults to `JSON.stringify`. */
  serialize?: (value: T) => string;
  /** Custom deserializer. Defaults to `JSON.parse`. */
  deserialize?: (raw: string) => T;
  /**
   * Sync state across browser tabs / windows via the `storage` event.
   * Only applies to `localStorage`. Defaults to `true`.
   */
  syncTabs?: boolean;
}

export type SetStorageState<T> = (value: T | ((prev: T) => T)) => void;

function getStorage(type: StorageType): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return type === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    // Access can throw in sandboxed iframes or when storage is disabled.
    return null;
  }
}

function createStorageHook(type: StorageType) {
  return function useStorageState<T>(
    key: string,
    initialValue: T | (() => T),
    options: UseStorageOptions<T> = {},
  ): [T, SetStorageState<T>, () => void] {
    const {
      serialize = JSON.stringify,
      deserialize = JSON.parse as (raw: string) => T,
      syncTabs = true,
    } = options;

    const readInitial = useCallback((): T => {
      const resolvedInitial =
        typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue;

      const storage = getStorage(type);
      if (!storage) return resolvedInitial;

      try {
        const raw = storage.getItem(key);
        return raw === null ? resolvedInitial : deserialize(raw);
      } catch {
        return resolvedInitial;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const [state, setState] = useState<T>(readInitial);

    const set = useCallback<SetStorageState<T>>(
      (value) => {
        setState((prev) => {
          const next =
            typeof value === "function"
              ? (value as (p: T) => T)(prev)
              : value;
          const storage = getStorage(type);
          if (storage) {
            try {
              storage.setItem(key, serialize(next));
            } catch {
              // Quota exceeded or storage unavailable — keep in-memory state.
            }
          }
          return next;
        });
      },
      [key, serialize],
    );

    const remove = useCallback(() => {
      const storage = getStorage(type);
      if (storage) {
        try {
          storage.removeItem(key);
        } catch {
          // ignore
        }
      }
      setState(readInitial);
    }, [key, readInitial]);

    // Re-read when the key changes.
    useEffect(() => {
      setState(readInitial());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    // Cross-tab synchronization (localStorage only).
    useEffect(() => {
      if (type !== "local" || !syncTabs || typeof window === "undefined") {
        return;
      }
      const handler = (event: StorageEvent) => {
        if (event.key !== key || event.storageArea !== window.localStorage) {
          return;
        }
        if (event.newValue === null) {
          setState(readInitial());
          return;
        }
        try {
          setState(deserialize(event.newValue));
        } catch {
          // ignore malformed payloads
        }
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, syncTabs]);

    return [state, set, remove];
  };
}

/**
 * Persisted state backed by `localStorage`, with optional cross-tab sync.
 *
 * Returns `[value, setValue, remove]`. SSR-safe: falls back to the initial
 * value on the server and when storage is unavailable.
 *
 * @example
 * const [theme, setTheme, resetTheme] = useLocalStorage("theme", "light");
 */
export const useLocalStorage = createStorageHook("local");

/**
 * Persisted state backed by `sessionStorage`.
 *
 * Returns `[value, setValue, remove]`. SSR-safe.
 *
 * @example
 * const [draft, setDraft] = useSessionStorage("draft", "");
 */
export const useSessionStorage = createStorageHook("session");
