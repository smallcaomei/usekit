import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLocalStorage, useSessionStorage } from "./useStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("uses the initial value when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage("k", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("reads an existing stored value", () => {
    window.localStorage.setItem("k", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("k", "default"));
    expect(result.current[0]).toBe("stored");
  });

  it("persists updates to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("k", 0));
    act(() => result.current[1](42));
    expect(result.current[0]).toBe(42);
    expect(window.localStorage.getItem("k")).toBe("42");
  });

  it("supports updater functions", () => {
    const { result } = renderHook(() => useLocalStorage("count", 1));
    act(() => result.current[1]((p) => p + 9));
    expect(result.current[0]).toBe(10);
  });

  it("supports a lazy initializer", () => {
    const { result } = renderHook(() =>
      useLocalStorage("lazy", () => 7),
    );
    expect(result.current[0]).toBe(7);
  });

  it("remove() clears storage and restores the initial value", () => {
    const { result } = renderHook(() => useLocalStorage("k", "init"));
    act(() => result.current[1]("changed"));
    expect(window.localStorage.getItem("k")).not.toBeNull();
    act(() => result.current[2]());
    expect(result.current[0]).toBe("init");
    expect(window.localStorage.getItem("k")).toBeNull();
  });
});

describe("useSessionStorage", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("persists to sessionStorage", () => {
    const { result } = renderHook(() => useSessionStorage("s", "a"));
    act(() => result.current[1]("b"));
    expect(window.sessionStorage.getItem("s")).toBe(JSON.stringify("b"));
  });
});
