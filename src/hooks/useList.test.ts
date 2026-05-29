import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useList } from "./useList";

describe("useList", () => {
  it("pushes and removes items", () => {
    const { result } = renderHook(() => useList<number>([1, 2]));
    act(() => result.current[1].push(3, 4));
    expect(result.current[0]).toEqual([1, 2, 3, 4]);
    act(() => result.current[1].removeAt(0));
    expect(result.current[0]).toEqual([2, 3, 4]);
  });

  it("inserts and updates at an index", () => {
    const { result } = renderHook(() => useList<string>(["a", "c"]));
    act(() => result.current[1].insertAt(1, "b"));
    expect(result.current[0]).toEqual(["a", "b", "c"]);
    act(() => result.current[1].updateAt(2, "C"));
    expect(result.current[0]).toEqual(["a", "b", "C"]);
  });

  it("filters, sorts, clears and resets", () => {
    const initial = [3, 1, 2];
    const { result } = renderHook(() => useList<number>(initial));

    act(() => result.current[1].sort((a, b) => a - b));
    expect(result.current[0]).toEqual([1, 2, 3]);

    act(() => result.current[1].filter((n) => n > 1));
    expect(result.current[0]).toEqual([2, 3]);

    act(() => result.current[1].clear());
    expect(result.current[0]).toEqual([]);

    act(() => result.current[1].reset());
    expect(result.current[0]).toEqual(initial);
  });
});
