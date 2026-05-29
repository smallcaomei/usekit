import { useCallback, useState } from "react";

export interface UseCopyToClipboardResult {
  /** The most recently copied text, or `null` if nothing has been copied. */
  copied: string | null;
  /** Whether the last copy attempt succeeded. */
  success: boolean;
  /** The error from the last failed copy attempt, if any. */
  error: Error | null;
  /** Copy `text` to the clipboard. Resolves to `true` on success. */
  copy: (text: string) => Promise<boolean>;
  /** Reset `copied`/`success`/`error` back to their initial state. */
  reset: () => void;
}

/**
 * Copy text to the clipboard with graceful fallbacks (Async Clipboard API,
 * then a hidden `<textarea>` + `execCommand`).
 *
 * @example
 * const { copy, copied } = useCopyToClipboard();
 * <button onClick={() => copy("hello")}>{copied ? "Copied!" : "Copy"}</button>
 */
export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [copied, setCopied] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setCopied(null);
    setSuccess(false);
    setError(null);
  }, []);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(text);
        setSuccess(true);
        setError(null);
        return true;
      } catch {
        // Fall through to the legacy approach below.
      }
    }

    if (typeof document !== "undefined") {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (ok) {
          setCopied(text);
          setSuccess(true);
          setError(null);
          return true;
        }
        throw new Error("execCommand('copy') returned false");
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        setSuccess(false);
        return false;
      }
    }

    const e = new Error("Clipboard is not available in this environment");
    setError(e);
    setSuccess(false);
    return false;
  }, []);

  return { copied, success, error, copy, reset };
}
