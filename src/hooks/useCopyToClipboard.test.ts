import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCopyToClipboard } from "./useCopyToClipboard";

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("copies text via the async clipboard API", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    let ok = false;
    await act(async () => {
      ok = await result.current.copy("hello");
    });

    expect(ok).toBe(true);
    expect(result.current.copied).toBe("hello");
    expect(result.current.success).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
  });

  it("resets state", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => result.current.reset());
    expect(result.current.copied).toBeNull();
    expect(result.current.success).toBe(false);
  });
});
