import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePrevious } from "./usePrevious";

describe("usePrevious", () => {
  it("returns undefined on the first render", () => {
    const { result } = renderHook(() => usePrevious(1));
    expect(result.current).toBeUndefined();
  });

  it("returns the value from the previous render", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 0 } },
    );

    rerender({ value: 1 });
    expect(result.current).toBe(0);

    rerender({ value: 2 });
    expect(result.current).toBe(1);
  });
});
