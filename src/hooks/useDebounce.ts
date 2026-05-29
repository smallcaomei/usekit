import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delay`
 * milliseconds have elapsed without a new change.
 *
 * @example
 * const debouncedSearch = useDebounce(search, 300);
 * useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
