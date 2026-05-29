export type Lang = "en" | "zh";

export interface Strings {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  ctaGithub: string;
  ctaDocs: string;
  statHooks: string;
  statDeps: string;
  statSize: string;
  statTyped: string;
  sectionTitle: string;
  sectionSubtitle: string;
  langName: string;
  themeLight: string;
  themeDark: string;
  footer: string;
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    badge: "Zero dependencies · Tree-shakeable · SSR-safe",
    title1: "The missing",
    title2: "React hooks toolkit",
    subtitle:
      "32 essential, fully-typed hooks for real-world React apps. Copy-paste friendly, battle-tested, and tiny. Try them all live below.",
    ctaGithub: "Star on GitHub",
    ctaDocs: "Browse hooks",
    statHooks: "Hooks",
    statDeps: "Dependencies",
    statSize: "Min+gzip core",
    statTyped: "Type-safe",
    sectionTitle: "Live playground",
    sectionSubtitle: "Every demo below is powered by the actual library. Go ahead — interact with them.",
    langName: "中文",
    themeLight: "Light",
    themeDark: "Dark",
    footer: "Built with usekit. Released under the MIT License.",
  },
  zh: {
    badge: "零依赖 · 可 Tree-shaking · SSR 安全",
    title1: "你一直缺的",
    title2: "React Hooks 工具库",
    subtitle:
      "32 个面向真实业务、类型完备的 Hooks。开箱即用、久经考验、体积极小。下方所有演示均可实时互动。",
    ctaGithub: "在 GitHub 点星",
    ctaDocs: "浏览 Hooks",
    statHooks: "个 Hooks",
    statDeps: "运行时依赖",
    statSize: "核心 min+gzip",
    statTyped: "类型安全",
    sectionTitle: "实时演练场",
    sectionSubtitle: "下面每个演示都由真实的库驱动，尽管动手试试吧。",
    langName: "EN",
    themeLight: "浅色",
    themeDark: "深色",
    footer: "由 usekit 驱动构建 · 基于 MIT 协议开源。",
  },
};

export interface DemoCopy {
  title: string;
  desc: Record<Lang, string>;
  tag: string;
}
