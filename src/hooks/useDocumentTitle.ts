import { useEffect, useRef } from "react";

export interface UseDocumentTitleOptions {
  /** Restore the previous title when the component unmounts. */
  restoreOnUnmount?: boolean;
}

/**
 * Sets `document.title` and keeps it in sync with the provided value.
 *
 * @example
 * useDocumentTitle(`Inbox (${unread})`);
 */
export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {},
): void {
  const { restoreOnUnmount = false } = options;
  const previous = useRef<string>(
    typeof document !== "undefined" ? document.title : "",
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = previous.current;
    return () => {
      if (restoreOnUnmount) document.title = prev;
    };
  }, [restoreOnUnmount]);
}
