"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SCRIPT_BASE = "https://leadtrackback.vercel.app/widget/leadwidget.js";
const DEFAULT_COLOR = "#FF6B35";
const DEFAULT_GREETING = "Hej! Hur kan vi hjälpa dig?";

type DetectResult = {
  company: string;
  color: string;
  logo: string | null;
  favicon: string;
  description: string | null;
  url: string;
};

type Position = "right" | "left";
type Lang = "sv" | "en";
type Tab = "html" | "wordpress" | "hubspot" | "squarespace";

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isValidHex(s: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s);
}

function InstallPage() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get("url") || "";

  const normalizedUrl = useMemo(() => {
    const t = rawUrl.trim();
    if (!t) return "";
    if (!/^https?:\/\//i.test(t)) return "https://" + t;
    return t;
  }, [rawUrl]);

  const displayDomain = useMemo(() => {
    try {
      return new URL(normalizedUrl).hostname;
    } catch {
      return rawUrl;
    }
  }, [normalizedUrl, rawUrl]);

  const [detecting, setDetecting] = useState(true);
  const [detectError, setDetectError] = useState<string | null>(null);

  // form state
  const [company, setCompany] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [greeting, setGreeting] = useState(DEFAULT_GREETING);
  const [position, setPosition] = useState<Position>("right");
  const [lang, setLang] = useState<Lang>("sv");
  const [logo, setLogo] = useState<string | null>(null);

  // tabs / copy / verify / test states
  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [verifyState, setVerifyState] = useState<
    "idle" | "loading" | "success" | "fail"
  >("idle");
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [testState, setTestState] = useState<
    "idle" | "loading" | "success" | "fail"
  >("idle");
  const [testMsg, setTestMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!normalizedUrl) {
      setDetecting(false);
      return;
    }
    let aborted = false;
    setDetecting(true);
    setDetectError(null);
    fetch("/api/onboard/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: normalizedUrl }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("detect failed");
        return (await res.json()) as DetectResult;
      })
      .then((data) => {
        if (aborted) return;
        if (data.company) setCompany(data.company);
        if (data.color && isValidHex(data.color)) setColor(data.color.toUpperCase());
        if (data.logo) setLogo(data.logo);
        setDetecting(false);
      })
      .catch(() => {
        if (aborted) return;
        setDetectError("Kunde inte hämta detaljer från sajten — du kan ändå anpassa manuellt.");
        // fall back to host-based company name
        try {
          const host = new URL(normalizedUrl).hostname.replace(/^www\./, "");
          const name = host.split(".")[0] || host;
          setCompany(name.charAt(0).toUpperCase() + name.slice(1));
        } catch {
          /* noop */
        }
        setDetecting(false);
      });
    return () => {
      aborted = true;
    };
  }, [normalizedUrl]);

  const embedCode = useMemo(() => {
    const attrs: string[] = [`src="${SCRIPT_BASE}"`];
    if (company) attrs.push(`data-company="${escapeAttr(company)}"`);
    if (color && color.toUpperCase() !== DEFAULT_COLOR)
      attrs.push(`data-color="${color}"`);
    else if (color) attrs.push(`data-color="${color}"`);
    if (greeting && greeting !== DEFAULT_GREETING)
      attrs.push(`data-greeting="${escapeAttr(greeting)}"`);
    if (position !== "right") attrs.push(`data-position="${position}"`);
    if (lang !== "sv") attrs.push(`data-lang="${lang}"`);
    return `<script ${attrs.join("\n  ")}></script>`;
  }, [company, color, greeting, position, lang]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = embedCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function verifyInstall() {
    if (!normalizedUrl) return;
    setVerifyState("loading");
    setVerifyMsg(null);
    try {
      const res = await fetch("/api/onboard/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.installed) {
        setVerifyState("success");
        setVerifyMsg("Widget är live!");
      } else {
        setVerifyState("fail");
        setVerifyMsg(
          data?.hint ||
            data?.error ||
            "Kunde inte hitta widget:en på sajten. Kontrollera att script-taggen är inklistrad innan </body>."
        );
      }
    } catch {
      setVerifyState("fail");
      setVerifyMsg("Kunde inte nå sajten just nu. Försök igen om en stund.");
    }
  }

  async function sendTestLead() {
    setTestState("loading");
    setTestMsg(null);
    try {
      const res = await fetch("/api/widget/test-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, url: normalizedUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTestState("success");
        setTestMsg(data?.message || "Test-lead skickad! Kolla din inkorg.");
      } else {
        setTestState("fail");
        setTestMsg(data?.error || "Kunde inte skicka test-lead.");
      }
    } catch {
      setTestState("fail");
      setTestMsg("Kunde inte skicka test-lead just nu.");
    }
  }

  const tabInstructions: Record<Tab, { title: string; steps: string[] }> = {
    html: {
      title: "Webbplats (HTML)",
      steps: ["Klistra in koden precis innan </body>-taggen i din HTML."],
    },
    wordpress: {
      title: "WordPress",
      steps: [
        "Gå till Verktyg → Theme File Editor → footer.php",
        "Klistra in koden precis innan </body>",
        "Spara",
      ],
    },
    hubspot: {
      title: "HubSpot CMS",
      steps: [
        "Gå till Settings → Website → Pages",
        "Hitta 'Site footer HTML' fältet",
        "Klistra in koden där och spara",
      ],
    },
    squarespace: {
      title: "Squarespace",
      steps: [
        "Gå till Settings → Advanced → Code Injection",
        "Klistra in koden i 'Footer'-fältet",
        "Spara",
      ],
    },
  };

  return (
    <main className="install-page">
      <header className="topbar">
        <a href="/" className="logo">
          Lead<span style={{ color: "#FF6B35" }}>TrackBack</span>
        </a>
        <a href="/" className="back-link">← Tillbaka</a>
      </header>

      <div className="layout">
        {/* LEFT: Config */}
        <div className="left-col">
          <div className="header-block">
            <h1 className="page-title">Din widget är klar</h1>
            <p className="page-sub">
              {displayDomain ? (
                <>För <strong>{displayDomain}</strong></>
              ) : (
                <>Anpassa, kopiera, installera.</>
              )}
            </p>
            {detecting && (
              <div className="detect-banner">
                <span className="spinner" /> Hämtar färger och stil från din sajt…
              </div>
            )}
            {detectError && !detecting && (
              <div className="detect-banner detect-banner--warn">
                {detectError}
              </div>
            )}
          </div>

          {/* Step 1 */}
          <section className="card">
            <div className="step-head">
              <span className="step-badge">1</span>
              <h2 className="card-title">Anpassa din widget</h2>
            </div>

            <div className="field">
              <label className="label">Företagsnamn</label>
              <input
                className="input"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ditt företag"
              />
            </div>

            <div className="field">
              <label className="label">Färg</label>
              <div className="color-row">
                <input
                  className="color-swatch"
                  type="color"
                  value={isValidHex(color) ? color : DEFAULT_COLOR}
                  onChange={(e) => setColor(e.target.value.toUpperCase())}
                />
                <input
                  className="input input--mono"
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#FF6B35"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Hälsningsmeddelande</label>
              <input
                className="input"
                type="text"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Position</label>
              <div className="radio-row">
                <label className={`radio-pill ${position === "right" ? "is-active" : ""}`}>
                  <input
                    type="radio"
                    name="position"
                    value="right"
                    checked={position === "right"}
                    onChange={() => setPosition("right")}
                  />
                  Höger
                </label>
                <label className={`radio-pill ${position === "left" ? "is-active" : ""}`}>
                  <input
                    type="radio"
                    name="position"
                    value="left"
                    checked={position === "left"}
                    onChange={() => setPosition("left")}
                  />
                  Vänster
                </label>
              </div>
            </div>

            <div className="field">
              <label className="label">Språk</label>
              <div className="radio-row">
                <label className={`radio-pill ${lang === "sv" ? "is-active" : ""}`}>
                  <input
                    type="radio"
                    name="lang"
                    value="sv"
                    checked={lang === "sv"}
                    onChange={() => setLang("sv")}
                  />
                  Svenska
                </label>
                <label className={`radio-pill ${lang === "en" ? "is-active" : ""}`}>
                  <input
                    type="radio"
                    name="lang"
                    value="en"
                    checked={lang === "en"}
                    onChange={() => setLang("en")}
                  />
                  English
                </label>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="card">
            <div className="step-head">
              <span className="step-badge">2</span>
              <h2 className="card-title">Klistra in koden</h2>
            </div>

            <div className="code-block">
              <pre>{embedCode}</pre>
            </div>

            <button className="primary-btn" onClick={copyCode}>
              {copied ? "✓ Kopierat!" : "Kopiera kod"}
            </button>

            <div className="tabs">
              {(Object.keys(tabInstructions) as Tab[]).map((t) => (
                <button
                  key={t}
                  className={`tab ${activeTab === t ? "is-active" : ""}`}
                  onClick={() => setActiveTab(t)}
                  type="button"
                >
                  {t === "html" ? "Webbplats" : tabInstructions[t].title}
                </button>
              ))}
            </div>
            <div className="tab-body">
              <ol className="steps-list">
                {tabInstructions[activeTab].steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </section>

          {/* Step 3 */}
          <section className="card">
            <div className="step-head">
              <span className="step-badge">3</span>
              <h2 className="card-title">Verifiera installation</h2>
            </div>
            <p className="card-text">
              Vi kollar om widget:en finns på din sajt.
            </p>
            <button
              className="secondary-btn"
              onClick={verifyInstall}
              disabled={verifyState === "loading" || !normalizedUrl}
            >
              {verifyState === "loading" ? "Kontrollerar…" : "Kontrollera installation"}
            </button>
            {verifyState === "success" && (
              <div className="result result--ok">
                <span className="check">✓</span>
                <span>{verifyMsg}</span>
              </div>
            )}
            {verifyState === "fail" && (
              <div className="result result--err">
                <span className="cross">✗</span>
                <span>{verifyMsg}</span>
              </div>
            )}
          </section>

          {/* Step 4 */}
          <section className="card">
            <div className="step-head">
              <span className="step-badge">4</span>
              <h2 className="card-title">Testa notifieringar</h2>
            </div>
            <p className="card-text">
              Skicka en test-lead till alla aktiva kanaler — e-post och/eller SMS — för att verifiera att notifieringar fungerar.
            </p>
            <button
              className="secondary-btn"
              onClick={sendTestLead}
              disabled={testState === "loading"}
            >
              {testState === "loading" ? "Skickar…" : "Skicka test-lead"}
            </button>
            {testState === "success" && (
              <div className="result result--ok">
                <span className="check">✓</span>
                <span>{testMsg}</span>
              </div>
            )}
            {testState === "fail" && (
              <div className="result result--err">
                <span className="cross">✗</span>
                <span>{testMsg}</span>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: Preview */}
        <div className="right-col">
          <div className="preview-wrap">
            <p className="preview-label">Förhandsvisning</p>
            <div className="browser">
              <div className="browser-bar">
                <div className="dots">
                  <span className="dot" style={{ background: "#FF5F57" }} />
                  <span className="dot" style={{ background: "#FEBC2E" }} />
                  <span className="dot" style={{ background: "#28C840" }} />
                </div>
                <div className="urlbar">
                  <span className="lock">🔒</span> {displayDomain || "din-hemsida.se"}
                </div>
              </div>
              <div className="browser-body">
                {/* fake site content */}
                <div className="site-mock">
                  <div className="mock-nav">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt="" className="mock-logo-img" />
                    ) : (
                      <div className="mock-logo">{company || "Ditt företag"}</div>
                    )}
                    <div className="mock-nav-links">
                      <span className="mock-bar mock-bar--sm" />
                      <span className="mock-bar mock-bar--sm" />
                      <span className="mock-bar mock-bar--sm" />
                    </div>
                  </div>
                  <div className="mock-hero">
                    <span className="mock-bar mock-bar--xl" />
                    <span className="mock-bar mock-bar--lg" />
                    <span className="mock-bar mock-bar--md" />
                  </div>
                  <div className="mock-grid">
                    <div className="mock-card" />
                    <div className="mock-card" />
                    <div className="mock-card" />
                  </div>
                </div>

                {/* widget panel */}
                {previewOpen && (
                  <div
                    className="widget-panel"
                    style={{
                      [position === "right" ? "right" : "left"]: "20px",
                    } as React.CSSProperties}
                  >
                    <div
                      className="widget-header"
                      style={{ background: isValidHex(color) ? color : DEFAULT_COLOR }}
                    >
                      <div className="widget-header-inner">
                        <div className="widget-title">
                          {company || "Ditt företag"}
                        </div>
                        <button
                          type="button"
                          className="widget-close"
                          onClick={() => setPreviewOpen(false)}
                          aria-label="close"
                        >
                          ×
                        </button>
                      </div>
                      <div className="widget-greeting">{greeting}</div>
                    </div>
                    <div className="widget-body">
                      <div className="widget-tabs">
                        <div className="widget-tab is-active">
                          {lang === "sv" ? "Chat" : "Chat"}
                        </div>
                        <div className="widget-tab">
                          {lang === "sv" ? "Ring upp mig" : "Call me"}
                        </div>
                        <div className="widget-tab">
                          {lang === "sv" ? "Formulär" : "Form"}
                        </div>
                      </div>
                      <div className="widget-msg">
                        <div className="widget-bubble">
                          {lang === "sv"
                            ? "Hej! Jag kan hjälpa dig att hitta rätt. Vad är du intresserad av?"
                            : "Hi! I can help you find what you need. What are you looking for?"}
                        </div>
                      </div>
                      <div className="widget-input-row">
                        <div className="widget-input-fake">
                          {lang === "sv" ? "Skriv ett meddelande…" : "Type a message…"}
                        </div>
                        <button
                          type="button"
                          className="widget-send"
                          style={{
                            background: isValidHex(color) ? color : DEFAULT_COLOR,
                          }}
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* FAB */}
                <button
                  type="button"
                  className="fab"
                  onClick={() => setPreviewOpen((o) => !o)}
                  style={{
                    background: isValidHex(color) ? color : DEFAULT_COLOR,
                    [position === "right" ? "right" : "left"]: "20px",
                  } as React.CSSProperties}
                  aria-label="toggle widget"
                >
                  {previewOpen ? "×" : "💬"}
                </button>
              </div>
            </div>
            <p className="preview-hint">
              Klicka på bubblan för att öppna och stänga widget:en
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(body) {
          background: #f8f9fa;
        }
        .install-page {
          min-height: 100vh;
          background: #f8f9fa;
          color: #0f0f1a;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }
        .topbar {
          background: #0f0f1a;
          color: #f5f5f7;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-size: 18px;
          font-weight: 700;
          color: #f5f5f7;
          text-decoration: none;
          letter-spacing: -0.01em;
        }
        .back-link {
          color: rgba(245, 245, 247, 0.7);
          text-decoration: none;
          font-size: 14px;
        }
        .back-link:hover {
          color: #f5f5f7;
        }
        .layout {
          display: grid;
          grid-template-columns: 45% 55%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
          gap: 32px;
          align-items: start;
        }
        .left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .right-col {
          position: sticky;
          top: 32px;
        }
        .header-block {
          padding: 4px 4px 0;
        }
        .page-title {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
          line-height: 1.15;
        }
        .page-sub {
          font-size: 16px;
          color: rgba(15, 15, 26, 0.6);
          margin: 0;
        }
        .detect-banner {
          margin-top: 14px;
          padding: 10px 14px;
          background: rgba(255, 107, 53, 0.08);
          border: 1px solid rgba(255, 107, 53, 0.2);
          color: #c0421a;
          border-radius: 8px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .detect-banner--warn {
          background: rgba(234, 179, 8, 0.08);
          border-color: rgba(234, 179, 8, 0.3);
          color: #8a5b00;
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 107, 53, 0.25);
          border-top-color: #ff6b35;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04),
            0 4px 16px rgba(0, 0, 0, 0.04);
          padding: 24px;
          border: 1px solid rgba(15, 15, 26, 0.05);
        }
        .step-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .step-badge {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #0f0f1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .card-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .card-text {
          font-size: 14px;
          color: rgba(15, 15, 26, 0.65);
          margin: 0 0 14px;
          line-height: 1.5;
        }
        .field {
          margin-bottom: 16px;
        }
        .field:last-child {
          margin-bottom: 0;
        }
        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: rgba(15, 15, 26, 0.75);
          margin-bottom: 6px;
        }
        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid rgba(15, 15, 26, 0.12);
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          color: #0f0f1a;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .input:focus {
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
        }
        .input--mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 13px;
        }
        .color-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .color-swatch {
          width: 42px;
          height: 38px;
          border: 1px solid rgba(15, 15, 26, 0.12);
          border-radius: 8px;
          padding: 2px;
          background: #fff;
          cursor: pointer;
        }
        .radio-row {
          display: flex;
          gap: 8px;
        }
        .radio-pill {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid rgba(15, 15, 26, 0.12);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          transition: border-color 0.15s, background 0.15s;
          background: #fff;
        }
        .radio-pill input {
          display: none;
        }
        .radio-pill.is-active {
          border-color: #ff6b35;
          background: rgba(255, 107, 53, 0.08);
          color: #c0421a;
        }
        .code-block {
          background: #0f0f1a;
          color: #b8ffd8;
          padding: 16px;
          border-radius: 8px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12.5px;
          line-height: 1.55;
          overflow-x: auto;
          margin-bottom: 14px;
        }
        .code-block pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .primary-btn {
          background: #ff6b35;
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          width: 100%;
        }
        .primary-btn:hover {
          background: #ff7e4e;
        }
        .primary-btn:active {
          transform: translateY(1px);
        }
        .secondary-btn {
          background: #0f0f1a;
          color: #fff;
          border: none;
          padding: 11px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .secondary-btn:hover {
          opacity: 0.88;
        }
        .secondary-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .tabs {
          display: flex;
          gap: 4px;
          margin-top: 18px;
          border-bottom: 1px solid rgba(15, 15, 26, 0.08);
          flex-wrap: wrap;
        }
        .tab {
          background: transparent;
          border: none;
          padding: 10px 14px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(15, 15, 26, 0.55);
          cursor: pointer;
          font-family: inherit;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.15s, border-color 0.15s;
        }
        .tab:hover {
          color: #0f0f1a;
        }
        .tab.is-active {
          color: #ff6b35;
          border-bottom-color: #ff6b35;
        }
        .tab-body {
          padding-top: 14px;
        }
        .steps-list {
          margin: 0;
          padding-left: 20px;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(15, 15, 26, 0.75);
        }
        .result {
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 14px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          line-height: 1.45;
        }
        .result--ok {
          background: rgba(34, 197, 94, 0.1);
          color: #14803c;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }
        .result--err {
          background: rgba(239, 68, 68, 0.08);
          color: #b42318;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }
        .check, .cross {
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Preview */
        .preview-wrap {
          padding: 0 4px;
        }
        .preview-label {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(15, 15, 26, 0.5);
          margin: 0 0 12px;
          font-weight: 600;
        }
        .browser {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08),
            0 1px 2px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(15, 15, 26, 0.06);
        }
        .browser-bar {
          background: #ececec;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid rgba(15, 15, 26, 0.06);
        }
        .dots {
          display: flex;
          gap: 6px;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .urlbar {
          flex: 1;
          background: #fff;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 12.5px;
          color: rgba(15, 15, 26, 0.65);
          font-family: -apple-system, sans-serif;
          text-align: center;
        }
        .lock {
          font-size: 10px;
          margin-right: 4px;
        }
        .browser-body {
          background: #fafafa;
          height: 520px;
          position: relative;
          overflow: hidden;
        }
        .site-mock {
          padding: 20px;
          filter: blur(0.5px);
          opacity: 0.85;
        }
        .mock-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 36px;
        }
        .mock-logo {
          font-weight: 700;
          font-size: 16px;
          color: rgba(15, 15, 26, 0.85);
        }
        .mock-logo-img {
          max-height: 28px;
          max-width: 100px;
          object-fit: contain;
        }
        .mock-nav-links {
          display: flex;
          gap: 12px;
        }
        .mock-bar {
          background: rgba(15, 15, 26, 0.12);
          border-radius: 4px;
          display: inline-block;
          height: 10px;
        }
        .mock-bar--sm { width: 50px; }
        .mock-bar--md { width: 280px; height: 12px; }
        .mock-bar--lg { width: 360px; height: 12px; }
        .mock-bar--xl {
          width: 460px;
          height: 26px;
          background: rgba(15, 15, 26, 0.18);
        }
        .mock-hero {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
        }
        .mock-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .mock-card {
          background: rgba(15, 15, 26, 0.08);
          border-radius: 8px;
          height: 110px;
        }

        /* Widget mock */
        .fab {
          position: absolute;
          bottom: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          transition: transform 0.15s;
        }
        .fab:hover {
          transform: scale(1.05);
        }
        .widget-panel {
          position: absolute;
          bottom: 88px;
          width: 320px;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18),
            0 2px 6px rgba(0, 0, 0, 0.05);
          z-index: 2;
          display: flex;
          flex-direction: column;
          max-height: 420px;
        }
        .widget-header {
          padding: 16px 16px 14px;
          color: #fff;
        }
        .widget-header-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .widget-title {
          font-weight: 700;
          font-size: 15px;
        }
        .widget-close {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 22px;
          cursor: pointer;
          line-height: 1;
          padding: 0 4px;
          opacity: 0.85;
        }
        .widget-close:hover {
          opacity: 1;
        }
        .widget-greeting {
          font-size: 13.5px;
          opacity: 0.95;
          line-height: 1.4;
        }
        .widget-body {
          padding: 12px;
          background: #fff;
        }
        .widget-tabs {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid rgba(15, 15, 26, 0.08);
          margin-bottom: 12px;
        }
        .widget-tab {
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(15, 15, 26, 0.5);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }
        .widget-tab.is-active {
          color: #0f0f1a;
          border-bottom-color: #0f0f1a;
        }
        .widget-msg {
          min-height: 60px;
          margin-bottom: 10px;
        }
        .widget-bubble {
          background: rgba(15, 15, 26, 0.05);
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
          color: #0f0f1a;
          line-height: 1.45;
          max-width: 90%;
        }
        .widget-input-row {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .widget-input-fake {
          flex: 1;
          background: rgba(15, 15, 26, 0.04);
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          color: rgba(15, 15, 26, 0.4);
        }
        .widget-send {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .preview-hint {
          font-size: 12px;
          color: rgba(15, 15, 26, 0.5);
          text-align: center;
          margin: 10px 0 0;
        }

        @media (max-width: 1024px) {
          .layout {
            grid-template-columns: 1fr;
            padding: 24px;
            gap: 24px;
          }
          .right-col {
            position: static;
            order: -1;
          }
          .browser-body {
            height: 420px;
          }
        }
        @media (max-width: 640px) {
          .page-title {
            font-size: 28px;
          }
          .card {
            padding: 18px;
          }
          .browser-body {
            height: 360px;
          }
          .widget-panel {
            width: 260px;
          }
        }
      `}</style>
    </main>
  );
}

export default function InstallPageWrapper() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: "#0f0f1a",
            background: "#f8f9fa",
          }}
        >
          Laddar…
        </main>
      }
    >
      <InstallPage />
    </Suspense>
  );
}
