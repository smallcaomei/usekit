import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUpdateEffect } from "./useUpdateEffect";

describe("useUpdateEffect", () => {
  it("does not run on mount", () => {
    const spy = vi.fn();
    renderHook(() => useUpdateEffect(spy, [0]));
    expect(spy).not.toHaveBeenCalled();
  });

  it("runs on subsequent dependency changes", () => {
    const spy = vi.fn();
    const { rerender } = renderHook(({ dep }) => useUpdateEffect(spy, [dep]), {
      initialProps: { dep: 0 },
    });
    rerender({ dep: 1 });
    expect(spy).toHaveBeenCalledTimes(1);
    rerender({ dep: 2 });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("does not run when deps are unchanged", () => {
    const spy = vi.fn();
    const { rerender } = renderHook(({ dep }) => useUpdateEffect(spy, [dep]), {
      initialProps: { dep: 5 },
    });
    rerender({ dep: 5 });
    expect(spy).not.toHaveBeenCalled();
  });
});
