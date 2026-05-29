// usekit — The missing React hooks toolkit.
// Each hook lives in its own module and is re-exported here so the package
// stays fully tree-shakeable (`"sideEffects": false`).

export { useIsomorphicLayoutEffect } from "./hooks/useIsomorphicLayoutEffect";
export { useLatest } from "./hooks/useLatest";
export { useEventListener } from "./hooks/useEventListener";

export { useToggle } from "./hooks/useToggle";
export type { UseToggleActions } from "./hooks/useToggle";

export { useCounter } from "./hooks/useCounter";
export type { UseCounterOptions, UseCounterActions } from "./hooks/useCounter";

export { usePrevious } from "./hooks/usePrevious";
export { useMount } from "./hooks/useMount";
export { useUnmount } from "./hooks/useUnmount";
export { useUpdateEffect } from "./hooks/useUpdateEffect";

export { useInterval } from "./hooks/useInterval";
export { useTimeout } from "./hooks/useTimeout";

export { useDebounce } from "./hooks/useDebounce";
export { useDebouncedCallback } from "./hooks/useDebouncedCallback";
export type { DebouncedFn } from "./hooks/useDebouncedCallback";
export { useThrottle } from "./hooks/useThrottle";

export {
  useLocalStorage,
  useSessionStorage,
} from "./hooks/useStorage";
export type {
  UseStorageOptions,
  SetStorageState,
} from "./hooks/useStorage";

export { useMediaQuery } from "./hooks/useMediaQuery";
export { useWindowSize } from "./hooks/useWindowSize";
export type { WindowSize } from "./hooks/useWindowSize";

export { useClickOutside } from "./hooks/useClickOutside";

export { useCopyToClipboard } from "./hooks/useCopyToClipboard";
export type { UseCopyToClipboardResult } from "./hooks/useCopyToClipboard";

export { useHover } from "./hooks/useHover";

export { useIntersectionObserver } from "./hooks/useIntersectionObserver";
export type {
  UseIntersectionObserverOptions,
  UseIntersectionObserverResult,
} from "./hooks/useIntersectionObserver";

export { useKeyPress } from "./hooks/useKeyPress";
export type { UseKeyPressOptions } from "./hooks/useKeyPress";

export { useDarkMode } from "./hooks/useDarkMode";
export type {
  ColorMode,
  UseDarkModeOptions,
  UseDarkModeResult,
} from "./hooks/useDarkMode";

export { useNetworkState } from "./hooks/useNetworkState";
export type { NetworkState } from "./hooks/useNetworkState";

export { useIdle } from "./hooks/useIdle";
export type { UseIdleOptions } from "./hooks/useIdle";

export { useFetch } from "./hooks/useFetch";
export type {
  UseFetchState,
  UseFetchResult,
  UseFetchOptions,
} from "./hooks/useFetch";

export { useGeolocation } from "./hooks/useGeolocation";
export type { GeolocationState } from "./hooks/useGeolocation";

export { useScrollLock } from "./hooks/useScrollLock";
export type { UseScrollLockResult } from "./hooks/useScrollLock";

export { useList } from "./hooks/useList";
export type { UseListActions } from "./hooks/useList";

export { useDocumentTitle } from "./hooks/useDocumentTitle";
export type { UseDocumentTitleOptions } from "./hooks/useDocumentTitle";

export { useElementSize } from "./hooks/useElementSize";
export type { ElementSize } from "./hooks/useElementSize";
