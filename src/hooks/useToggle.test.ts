import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useToggle } from "./useToggle";

describe("useToggle", () => {
  it("defaults to false", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it("honours the initial value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it("toggles, sets true/false and sets explicitly", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(true);

    act(() => result.current[1].setFalse());
    expect(result.current[0]).toBe(false);

    act(() => result.current[1].setTrue());
    expect(result.current[0]).toBe(true);

    act(() => result.current[1].set(false));
    expect(result.current[0]).toBe(false);
  });

  it("keeps action identities stable across renders", () => {
    const { result, rerender } = renderHook(() => useToggle());
    const first = result.current[1];
    rerender();
    expect(result.current[1]).toBe(first);
  });
});
