import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyPress } from "./useKeyPress";

function dispatchKey(init: KeyboardEventInit) {
  window.dispatchEvent(new KeyboardEvent("keydown", init));
}

describe("useKeyPress", () => {
  it("fires for a matching key", () => {
    const spy = vi.fn();
    renderHook(() => useKeyPress("Escape", spy));
    dispatchKey({ key: "Escape" });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("ignores non-matching keys", () => {
    const spy = vi.fn();
    renderHook(() => useKeyPress("Enter", spy));
    dispatchKey({ key: "a" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("supports an array of keys", () => {
    const spy = vi.fn();
    renderHook(() => useKeyPress(["a", "b"], spy));
    dispatchKey({ key: "b" });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("respects required modifiers", () => {
    const spy = vi.fn();
    renderHook(() =>
      useKeyPress("k", spy, { modifiers: { meta: true } }),
    );
    dispatchKey({ key: "k" });
    expect(spy).not.toHaveBeenCalled();
    dispatchKey({ key: "k", metaKey: true });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
