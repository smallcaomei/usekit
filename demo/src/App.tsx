import { useDarkMode, useLocalStorage, useDocumentTitle } from "usekit";
import { STRINGS, type Lang } from "./i18n";
import { DEMOS } from "./demos";
import { Reveal } from "./Reveal";

const GITHUB_URL = "https://github.com/usekit/usekit";

export function App() {
  const { isDark, toggle: toggleTheme } = useDarkMode({ defaultMode: "dark" });
  const [lang, setLang] = useLocalStorage<Lang>("usekit-demo-lang", "en");
  const t = STRINGS[lang];

  useDocumentTitle(
    lang === "en"
      ? "usekit · The missing React hooks toolkit"
      : "usekit · 你一直缺的 React Hooks 工具库",
  );

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="logo">
            <span className="logo-mark">⚡</span>
            <span>usekit</span>
          </div>
          <div className="topbar-actions">
            <button
              className="btn btn-ghost"
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              title="Switch language"
            >
              🌐 {t.langName}
            </button>
            <button
              className="btn btn-ghost icon-btn"
              onClick={toggleTheme}
              title={isDark ? t.themeLight : t.themeDark}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <a className="btn btn-primary" href={GITHUB_URL}>
              ★ GitHub
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <span className="hero-badge">
              <span className="hero-dot" />
              {t.badge}
            </span>
            <h1>
              {t.title1}
              <br />
              <span className="gradient-text">{t.title2}</span>
            </h1>
            <p>{t.subtitle}</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href={GITHUB_URL}>
                ★ {t.ctaGithub}
              </a>
              <a className="btn" href="#playground">
                {t.ctaDocs} ↓
              </a>
            </div>
            <div style={{ marginTop: 26 }}>
              <span className="install">
                <span className="prompt mono">$</span>
                <span className="mono">npm install usekit</span>
              </span>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="stats">
            <Stat num={`${DEMOS.length > 0 ? "32" : "32"}`} label={t.statHooks} />
            <Stat num="0" label={t.statDeps} />
            <Stat num="~5kB" label={t.statSize} />
            <Stat num="100%" label={t.statTyped} />
          </div>
        </div>

        <section id="playground" className="container">
          <div className="section-head">
            <h2>{t.sectionTitle}</h2>
            <p>{t.sectionSubtitle}</p>
          </div>

          <div className="grid">
            {DEMOS.map((demo, i) => (
              <Reveal key={demo.hook} delay={i * 40}>
                <article className="card">
                  <div className="card-head">
                    <span className="card-title">
                      <code>{demo.hook}</code>
                    </span>
                    <span className="tag">{demo.tag}</span>
                  </div>
                  <p className="card-desc">{demo.desc[lang]}</p>
                  <demo.Render />
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          {t.footer} ·{" "}
          <a href={GITHUB_URL}>GitHub</a>
        </div>
      </footer>
    </>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="stat">
      <div className="stat-num">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
