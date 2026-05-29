import { useCallback, useEffect, useRef, useState } from "react";

export interface UseFetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface UseFetchResult<T> extends UseFetchState<T> {
  /** Manually re-run the request. */
  refetch: () => void;
  /** Abort the in-flight request. */
  abort: () => void;
}

export interface UseFetchOptions<T> extends RequestInit {
  /** Skip the automatic fetch on mount / dependency change. */
  skip?: boolean;
  /** Transform the `Response`. Defaults to `res => res.json()`. */
  parse?: (response: Response) => Promise<T>;
  /** Extra dependencies that should trigger a refetch when changed. */
  deps?: unknown[];
}

/**
 * A small, dependency-free data-fetching hook with loading/error state,
 * request cancellation (AbortController) and manual `refetch()`.
 *
 * @example
 * const { data, loading, error, refetch } = useFetch<User[]>("/api/users");
 */
export function useFetch<T = unknown>(
  url: string,
  options: UseFetchOptions<T> = {},
): UseFetchResult<T> {
  const { skip = false, parse, deps = [], ...init } = options;

  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    loading: !skip,
  });

  const controllerRef = useRef<AbortController | null>(null);
  const parseRef = useRef(parse);
  parseRef.current = parse;
  const initRef = useRef(init);
  initRef.current = init;

  const abort = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const run = useCallback(async () => {
    abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        ...initRef.current,
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = parseRef.current
        ? await parseRef.current(response)
        : ((await response.json()) as T);
      setState({ data, error: null, loading: false });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setState({
        data: null,
        error: err instanceof Error ? err : new Error(String(err)),
        loading: false,
      });
    }
  }, [url, abort]);

  useEffect(() => {
    if (skip) return;
    void run();
    return () => abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, skip, ...deps]);

  return { ...state, refetch: run, abort };
}
