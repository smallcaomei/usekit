<div align="center">

# ⚡ usekit

**The missing React hooks toolkit.**

32 essential, fully-typed, SSR-safe React hooks — with **zero dependencies** and a tiny footprint.

[![npm version](https://img.shields.io/npm/v/usekit.svg?style=flat-square&color=6d5efc)](https://www.npmjs.com/package/usekit)
[![bundle size](https://img.shields.io/badge/min%2Bgzip-~5kB-00c2a8?style=flat-square)](https://bundlephobia.com/package/usekit)
[![types](https://img.shields.io/badge/types-included-3178c6?style=flat-square)](#)
[![license](https://img.shields.io/badge/license-MIT-black?style=flat-square)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](./CONTRIBUTING.md)

English · [简体中文](./README.zh-CN.md)

</div>

---

## Why usekit?

- 🪶 **Zero runtime dependencies** — nothing but React (`>=16.8`).
- 🌳 **Fully tree-shakeable** — `"sideEffects": false`; import only what you use.
- 🔒 **Type-safe** — written in strict TypeScript, types ship in the box.
- 🖥️ **SSR-safe** — every hook guards against `window`/`document` being undefined.
- 🧪 **Tested** — covered by a Vitest + Testing Library suite.
- 📦 **Dual ESM + CJS** — works everywhere, from Next.js to Vite to plain Node.

## Install

```bash
npm install usekit
# or
pnpm add usekit
# or
yarn add usekit
```

## Quick start

```tsx
import { useDebounce, useLocalStorage, useToggle } from "usekit";

function SearchBox() {
  const [query, setQuery] = useLocalStorage("last-query", "");
  const debounced = useDebounce(query, 300);
  const [open, { toggle }] = useToggle(false);

  // `debounced` only changes 300ms after the user stops typing.
  return (
    <input value={query} onChange={(e) => setQuery(e.target.value)} />
  );
}
```

## The hooks

> 👉 **[Live, interactive playground →](./demo)** — every demo is powered by the real library.

### State

| Hook | Description |
| --- | --- |
| [`useToggle`](./src/hooks/useToggle.ts) | Boolean state with `toggle` / `setTrue` / `setFalse`. |
| [`useCounter`](./src/hooks/useCounter.ts) | Numeric state with `inc` / `dec` / `reset` and min/max clamping. |
| [`useList`](./src/hooks/useList.ts) | Immutable array helpers: `push`, `removeAt`, `sort`, `filter`… |
| [`usePrevious`](./src/hooks/usePrevious.ts) | The value from the previous render. |
| [`useLatest`](./src/hooks/useLatest.ts) | A ref that always holds the freshest value. |

### Storage

| Hook | Description |
| --- | --- |
| [`useLocalStorage`](./src/hooks/useStorage.ts) | Persisted state with cross-tab sync. |
| [`useSessionStorage`](./src/hooks/useStorage.ts) | Persisted state for the session. |
| [`useDarkMode`](./src/hooks/useDarkMode.ts) | Dark mode that follows the OS and persists the choice. |

### Timing

| Hook | Description |
| --- | --- |
| [`useDebounce`](./src/hooks/useDebounce.ts) | Debounce a value. |
| [`useDebouncedCallback`](./src/hooks/useDebouncedCallback.ts) | A debounced function with `cancel()` / `flush()`. |
| [`useThrottle`](./src/hooks/useThrottle.ts) | Throttle a value. |
| [`useInterval`](./src/hooks/useInterval.ts) | Declarative `setInterval` (pass `null` to pause). |
| [`useTimeout`](./src/hooks/useTimeout.ts) | Declarative `setTimeout`. |

### Lifecycle

| Hook | Description |
| --- | --- |
| [`useMount`](./src/hooks/useMount.ts) | Run a callback once on mount. |
| [`useUnmount`](./src/hooks/useUnmount.ts) | Run a callback on unmount. |
| [`useUpdateEffect`](./src/hooks/useUpdateEffect.ts) | `useEffect` that skips the first render. |
| [`useIsomorphicLayoutEffect`](./src/hooks/useIsomorphicLayoutEffect.ts) | SSR-safe `useLayoutEffect`. |

### Browser & viewport

| Hook | Description |
| --- | --- |
| [`useMediaQuery`](./src/hooks/useMediaQuery.ts) | Reactively match a CSS media query. |
| [`useWindowSize`](./src/hooks/useWindowSize.ts) | Track the window's inner dimensions. |
| [`useElementSize`](./src/hooks/useElementSize.ts) | Measure an element with `ResizeObserver`. |
| [`useIntersectionObserver`](./src/hooks/useIntersectionObserver.ts) | Observe element visibility (lazy-load, reveal-on-scroll). |
| [`useCopyToClipboard`](./src/hooks/useCopyToClipboard.ts) | Copy text with graceful fallbacks. |
| [`useNetworkState`](./src/hooks/useNetworkState.ts) | Online/offline + connection quality. |
| [`useGeolocation`](./src/hooks/useGeolocation.ts) | Track the user's geolocation. |
| [`useScrollLock`](./src/hooks/useScrollLock.ts) | Lock page scroll for modals/drawers. |
| [`useDocumentTitle`](./src/hooks/useDocumentTitle.ts) | Sync `document.title`. |

### Events

| Hook | Description |
| --- | --- |
| [`useEventListener`](./src/hooks/useEventListener.ts) | Strongly-typed declarative `addEventListener`. |
| [`useClickOutside`](./src/hooks/useClickOutside.ts) | Detect clicks outside element(s). |
| [`useHover`](./src/hooks/useHover.ts) | Track hover state via a ref. |
| [`useKeyPress`](./src/hooks/useKeyPress.ts) | Respond to keys & combos (e.g. `⌘K`). |
| [`useIdle`](./src/hooks/useIdle.ts) | Detect user inactivity. |

### Data

| Hook | Description |
| --- | --- |
| [`useFetch`](./src/hooks/useFetch.ts) | Tiny data fetching with loading/error state, abort & refetch. |

## Examples

<details>
<summary><b>Command-palette shortcut with <code>useKeyPress</code></b></summary>

```tsx
import { useKeyPress } from "usekit";

function App() {
  const [open, setOpen] = useState(false);
  useKeyPress("k", () => setOpen(true), {
    modifiers: { meta: true }, // ⌘K
    preventDefault: true,
  });
  return open ? <CommandPalette onClose={() => setOpen(false)} /> : null;
}
```

</details>

<details>
<summary><b>Close a dropdown on outside click</b></summary>

```tsx
import { useRef, useState } from "react";
import { useClickOutside } from "usekit";

function Dropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  return open ? <div ref={ref}>…menu…</div> : null;
}
```

</details>

<details>
<summary><b>Lazy-load images with <code>useIntersectionObserver</code></b></summary>

```tsx
import { useIntersectionObserver } from "usekit";

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: true,
  });
  return <img ref={ref} src={isIntersecting ? src : undefined} alt={alt} />;
}
```

</details>

## SSR & Next.js

All hooks are server-safe. Browser-only hooks (`useWindowSize`, `useMediaQuery`, …)
return a sensible default on the server and hydrate on the client, so you won't
get reference errors or hydration mismatches.

## Development

```bash
npm install          # install dependencies
npm run build        # build the library (ESM + CJS + d.ts) with tsup
npm test             # run the Vitest suite
npm run typecheck    # type-check without emitting
npm run demo         # start the interactive demo at localhost:5173
```

## Contributing

PRs are very welcome! Adding a hook is easy — see **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

## License

[MIT](./LICENSE) © usekit contributors
