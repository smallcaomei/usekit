import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useInterval } from "./useInterval";

describe("useInterval", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires repeatedly at the given delay", () => {
    const spy = vi.fn();
    renderHook(() => useInterval(spy, 100));
    act(() => vi.advanceTimersByTime(350));
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("pauses when delay is null", () => {
    const spy = vi.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(spy, delay),
      { initialProps: { delay: 100 as number | null } },
    );
    act(() => vi.advanceTimersByTime(100));
    expect(spy).toHaveBeenCalledTimes(1);

    rerender({ delay: null });
    act(() => vi.advanceTimersByTime(500));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("always calls the latest callback", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 100), {
      initialProps: { cb: first },
    });
    rerender({ cb: second });
    act(() => vi.advanceTimersByTime(100));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
