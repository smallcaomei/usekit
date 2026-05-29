import { useCallback, useMemo, useState } from "react";

export interface UseToggleActions {
  /** Toggle to the opposite boolean value. */
  toggle: () => void;
  /** Force the value to `true`. */
  setTrue: () => void;
  /** Force the value to `false`. */
  setFalse: () => void;
  /** Set the value explicitly. */
  set: (value: boolean) => void;
}

/**
 * Boolean state with ergonomic helpers.
 *
 * @example
 * const [open, { toggle, setTrue, setFalse }] = useToggle(false);
 */
export function useToggle(
  initialValue = false,
): [boolean, UseToggleActions] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const set = useCallback((next: boolean) => setValue(next), []);

  const actions = useMemo(
    () => ({ toggle, setTrue, setFalse, set }),
    [toggle, setTrue, setFalse, set],
  );

  return [value, actions];
}
