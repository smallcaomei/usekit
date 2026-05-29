import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDebouncedCallback } from "./useDebouncedCallback";

describe("useDebouncedCallback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("invokes the callback once after the delay with the latest args", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(spy, 200));

    act(() => {
      result.current(1);
      result.current(2);
      result.current(3);
    });
    expect(spy).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(3);
  });

  it("cancel() prevents the pending call", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(spy, 200));

    act(() => {
      result.current("x");
      result.current.cancel();
      vi.advanceTimersByTime(200);
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("flush() invokes immediately", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(spy, 200));

    act(() => {
      result.current("y");
      result.current.flush();
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("y");
  });
});
