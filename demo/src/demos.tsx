import { useRef, useState } from "react";
import {
  useCounter,
  useToggle,
  useDebounce,
  useLocalStorage,
  useCopyToClipboard,
  useWindowSize,
  useMediaQuery,
  useKeyPress,
  useHover,
  useNetworkState,
  useIdle,
  useList,
  useElementSize,
  useClickOutside,
  useInterval,
} from "usekit";
import type { Lang } from "./i18n";

export interface DemoDef {
  hook: string;
  tag: string;
  desc: Record<Lang, string>;
  Render: () => JSX.Element;
}

function CounterDemo() {
  const [count, { inc, dec, reset }] = useCounter(0, { min: -5, max: 5 });
  return (
    <div className="demo-stage">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="big-value">{count}</span>
        <span className="muted">min -5 · max 5</span>
      </div>
      <div className="row">
        <button className="btn" onClick={() => dec()}>
          − 1
        </button>
        <button className="btn" onClick={() => inc()}>
          + 1
        </button>
        <button className="btn btn-ghost" onClick={reset}>
          reset
        </button>
      </div>
    </div>
  );
}

function ToggleDemo() {
  const [on, { toggle }] = useToggle(true);
  return (
    <div className="demo-stage">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="value-pill">{String(on)}</span>
        <button
          className={on ? "btn btn-primary" : "btn"}
          onClick={toggle}
          style={{ minWidth: 96 }}
        >
          {on ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}

function DebounceDemo() {
  const [text, setText] = useState("");
  const debounced = useDebounce(text, 500);
  return (
    <div className="demo-stage">
      <input
        className="text"
        placeholder="Type fast…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="row">
        <span className="muted">debounced (500ms):</span>
        <span className="value-pill">{debounced || "—"}</span>
      </div>
    </div>
  );
}

function LocalStorageDemo() {
  const [name, setName, reset] = useLocalStorage("usekit-demo-name", "");
  return (
    <div className="demo-stage">
      <input
        className="text"
        placeholder="Type, then reload the page →"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="row">
        <span className="muted">persisted &amp; synced across tabs</span>
        <button className="btn btn-ghost" onClick={reset}>
          clear
        </button>
      </div>
    </div>
  );
}

function CopyDemo() {
  const { copy, copied } = useCopyToClipboard();
  const cmd = "npm i usekit";
  return (
    <div className="demo-stage">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <code className="value-pill">{cmd}</code>
        <button
          className={copied ? "btn btn-primary" : "btn"}
          onClick={() => copy(cmd)}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function WindowSizeDemo() {
  const { width, height } = useWindowSize();
  return (
    <div className="demo-stage">
      <div className="row">
        <span className="value-pill">w: {width}px</span>
        <span className="value-pill">h: {height}px</span>
      </div>
      <span className="muted">resize the window to watch it update</span>
    </div>
  );
}

function MediaQueryDemo() {
  const isWide = useMediaQuery("(min-width: 900px)");
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  return (
    <div className="demo-stage">
      <div className="row">
        <span className="value-pill">≥900px: {String(isWide)}</span>
        <span className="value-pill">OS dark: {String(prefersDark)}</span>
      </div>
    </div>
  );
}

function KeyPressDemo() {
  const [last, setLast] = useState("—");
  useKeyPress(
    () => true,
    (e) => setLast(e.key),
  );
  return (
    <div className="demo-stage">
      <span className="muted">Press any key on your keyboard</span>
      <div className="row">
        <span>last key:</span>
        <span className="kbd">{last}</span>
      </div>
    </div>
  );
}

function HoverDemo() {
  const [ref, hovered] = useHover<HTMLDivElement>();
  return (
    <div className="demo-stage">
      <div
        ref={ref}
        style={{
          textAlign: "center",
          padding: "16px",
          borderRadius: 10,
          fontWeight: 700,
          color: hovered ? "white" : "var(--text)",
          background: hovered
            ? "linear-gradient(135deg, var(--brand), var(--brand-2))"
            : "var(--bg-elevated)",
          border: "1px solid var(--border)",
          transition: "all 0.2s ease",
          cursor: "default",
        }}
      >
        {hovered ? "👋 hovering!" : "hover over me"}
      </div>
    </div>
  );
}

function NetworkDemo() {
  const { online, effectiveType } = useNetworkState();
  return (
    <div className="demo-stage">
      <div className="row">
        <span
          className="dot-status"
          style={{ background: online ? "var(--accent)" : "var(--danger)" }}
        />
        <span className="value-pill">{online ? "online" : "offline"}</span>
        {effectiveType && (
          <span className="value-pill">type: {effectiveType}</span>
        )}
      </div>
      <span className="muted">toggle your network to see it react</span>
    </div>
  );
}

function IdleDemo() {
  const idle = useIdle(4000);
  return (
    <div className="demo-stage">
      <div className="row">
        <span
          className="dot-status"
          style={{ background: idle ? "var(--danger)" : "var(--accent)" }}
        />
        <span className="value-pill">{idle ? "idle 😴" : "active ⚡"}</span>
      </div>
      <span className="muted">stop moving for 4s to go idle</span>
    </div>
  );
}

function ListDemo() {
  const [items, { push, removeAt, clear }] = useList<string>([
    "react",
    "hooks",
  ]);
  return (
    <div className="demo-stage">
      <div className="row">
        {items.map((item, i) => (
          <button
            key={`${item}-${i}`}
            className="value-pill"
            onClick={() => removeAt(i)}
            title="click to remove"
            style={{ cursor: "pointer", border: "1px solid var(--border)" }}
          >
            {item} ✕
          </button>
        ))}
        {items.length === 0 && <span className="muted">empty list</span>}
      </div>
      <div className="row">
        <button
          className="btn"
          onClick={() => push(`item ${items.length + 1}`)}
        >
          + add
        </button>
        <button className="btn btn-ghost" onClick={clear}>
          clear
        </button>
      </div>
    </div>
  );
}

function ElementSizeDemo() {
  const [ref, { width, height }] = useElementSize<HTMLTextAreaElement>();
  return (
    <div className="demo-stage">
      <textarea
        ref={ref}
        className="text"
        defaultValue="Drag my bottom-right corner to resize me ↘"
        style={{ resize: "both", minHeight: 44, fontFamily: "inherit" }}
      />
      <div className="row">
        <span className="value-pill">{Math.round(width)}px</span>
        <span className="muted">×</span>
        <span className="value-pill">{Math.round(height)}px</span>
      </div>
    </div>
  );
}

function ClickOutsideDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div className="demo-stage" style={{ position: "relative" }}>
      <button className="btn btn-primary" onClick={() => setOpen((o) => !o)}>
        {open ? "menu open" : "open menu"}
      </button>
      {open && (
        <div
          ref={ref}
          style={{
            marginTop: 4,
            padding: 12,
            borderRadius: 10,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}
        >
          <span className="muted">click anywhere outside to close ✨</span>
        </div>
      )}
    </div>
  );
}

function IntervalDemo() {
  const [running, setRunning] = useState(true);
  const [secs, setSecs] = useState(0);
  useInterval(() => setSecs((s) => s + 1), running ? 1000 : null);
  return (
    <div className="demo-stage">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="big-value">{secs}s</span>
        <button className="btn" onClick={() => setRunning((r) => !r)}>
          {running ? "pause" : "resume"}
        </button>
      </div>
    </div>
  );
}

export const DEMOS: DemoDef[] = [
  {
    hook: "useCounter",
    tag: "state",
    desc: {
      en: "Numeric state with inc/dec/reset and optional min/max clamping.",
      zh: "带 inc/dec/reset 与可选 min/max 钳制的数值状态。",
    },
    Render: CounterDemo,
  },
  {
    hook: "useToggle",
    tag: "state",
    desc: {
      en: "Boolean state with toggle / setTrue / setFalse helpers.",
      zh: "布尔状态，附带 toggle / setTrue / setFalse 等便捷方法。",
    },
    Render: ToggleDemo,
  },
  {
    hook: "useDebounce",
    tag: "timing",
    desc: {
      en: "Debounce any value — perfect for search-as-you-type.",
      zh: "对任意值做防抖处理，输入即搜索的最佳拍档。",
    },
    Render: DebounceDemo,
  },
  {
    hook: "useInterval",
    tag: "timing",
    desc: {
      en: "Declarative setInterval. Pass null to pause; callback stays fresh.",
      zh: "声明式 setInterval，传 null 即暂停，回调始终最新。",
    },
    Render: IntervalDemo,
  },
  {
    hook: "useLocalStorage",
    tag: "storage",
    desc: {
      en: "Persisted state with cross-tab sync. Reload to see it stick.",
      zh: "持久化状态并跨标签页同步，刷新后依然保留。",
    },
    Render: LocalStorageDemo,
  },
  {
    hook: "useCopyToClipboard",
    tag: "browser",
    desc: {
      en: "Copy text with graceful fallbacks and success state.",
      zh: "复制文本，自带优雅降级与成功状态反馈。",
    },
    Render: CopyDemo,
  },
  {
    hook: "useWindowSize",
    tag: "viewport",
    desc: {
      en: "Track the window's inner width and height. SSR-safe.",
      zh: "追踪窗口内部宽高，SSR 安全。",
    },
    Render: WindowSizeDemo,
  },
  {
    hook: "useMediaQuery",
    tag: "viewport",
    desc: {
      en: "Reactively match any CSS media query.",
      zh: "响应式匹配任意 CSS 媒体查询。",
    },
    Render: MediaQueryDemo,
  },
  {
    hook: "useElementSize",
    tag: "viewport",
    desc: {
      en: "Measure an element with ResizeObserver. Drag to resize.",
      zh: "用 ResizeObserver 测量元素尺寸，拖拽即可改变。",
    },
    Render: ElementSizeDemo,
  },
  {
    hook: "useKeyPress",
    tag: "events",
    desc: {
      en: "Respond to keys & combos (e.g. ⌘K) with modifier support.",
      zh: "响应按键与组合键（如 ⌘K），支持修饰键。",
    },
    Render: KeyPressDemo,
  },
  {
    hook: "useHover",
    tag: "events",
    desc: {
      en: "Know when the pointer is over an element via a ref.",
      zh: "通过 ref 感知指针是否悬停在元素上。",
    },
    Render: HoverDemo,
  },
  {
    hook: "useClickOutside",
    tag: "events",
    desc: {
      en: "Detect clicks outside an element — dropdowns, modals, popovers.",
      zh: "检测元素外部点击，适用于下拉菜单、弹窗、气泡。",
    },
    Render: ClickOutsideDemo,
  },
  {
    hook: "useList",
    tag: "state",
    desc: {
      en: "Immutable array helpers: push, removeAt, sort, filter & more.",
      zh: "不可变数组操作：push、removeAt、sort、filter 等。",
    },
    Render: ListDemo,
  },
  {
    hook: "useNetworkState",
    tag: "browser",
    desc: {
      en: "Online/offline status plus connection quality where supported.",
      zh: "在线/离线状态，并在支持时提供连接质量信息。",
    },
    Render: NetworkDemo,
  },
  {
    hook: "useIdle",
    tag: "events",
    desc: {
      en: "Detect user inactivity after a configurable timeout.",
      zh: "在可配置的超时后检测用户是否处于空闲状态。",
    },
    Render: IdleDemo,
  },
];
