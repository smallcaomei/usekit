import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

type Listener = (event: MediaQueryListEvent) => void;

describe("useMediaQuery", () => {
  let listeners: Listener[];
  let currentMatches: boolean;

  beforeEach(() => {
    listeners = [];
    currentMatches = false;
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: currentMatches,
        media: query,
        addEventListener: (_: string, cb: Listener) => listeners.push(cb),
        removeEventListener: (_: string, cb: Listener) => {
          listeners = listeners.filter((l) => l !== cb);
        },
        addListener: (cb: Listener) => listeners.push(cb),
        removeListener: (cb: Listener) => {
          listeners = listeners.filter((l) => l !== cb);
        },
      })),
    );
  });

  it("reflects the initial match state", () => {
    currentMatches = true;
    const { result } = renderHook(() =>
      useMediaQuery("(min-width: 768px)"),
    );
    expect(result.current).toBe(true);
  });

  it("registers a change listener", () => {
    renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(listeners.length).toBeGreaterThan(0);
  });
});
