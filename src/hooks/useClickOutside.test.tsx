import { describe, it, expect, vi } from "vitest";
import { useRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useClickOutside } from "./useClickOutside";

function Fixture({ onOutside }: { onOutside: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutside);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        inside
      </div>
      <div data-testid="outside">outside</div>
    </div>
  );
}

describe("useClickOutside", () => {
  it("fires when clicking outside the element", () => {
    const spy = vi.fn();
    const { getByTestId } = render(<Fixture onOutside={spy} />);
    fireEvent.mouseDown(getByTestId("outside"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not fire when clicking inside the element", () => {
    const spy = vi.fn();
    const { getByTestId } = render(<Fixture onOutside={spy} />);
    fireEvent.mouseDown(getByTestId("inside"));
    expect(spy).not.toHaveBeenCalled();
  });
});
