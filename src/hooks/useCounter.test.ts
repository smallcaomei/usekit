import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("increments and decrements", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current[1].inc());
    expect(result.current[0]).toBe(1);
    act(() => result.current[1].dec());
    expect(result.current[0]).toBe(0);
  });

  it("supports custom deltas", () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => result.current[1].inc(5));
    expect(result.current[0]).toBe(15);
    act(() => result.current[1].dec(3));
    expect(result.current[0]).toBe(12);
  });

  it("clamps to min and max", () => {
    const { result } = renderHook(() =>
      useCounter(5, { min: 0, max: 10 }),
    );
    act(() => result.current[1].inc(100));
    expect(result.current[0]).toBe(10);
    act(() => result.current[1].dec(100));
    expect(result.current[0]).toBe(0);
  });

  it("clamps the initial value", () => {
    const { result } = renderHook(() => useCounter(99, { max: 10 }));
    expect(result.current[0]).toBe(10);
  });

  it("set accepts an updater and reset restores the initial value", () => {
    const { result } = renderHook(() => useCounter(3));
    act(() => result.current[1].set((p) => p * 4));
    expect(result.current[0]).toBe(12);
    act(() => result.current[1].reset());
    expect(result.current[0]).toBe(3);
  });
});
