"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [urlBottom, setUrlBottom] = useState("");

  function go(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/install?url=${encodeURIComponent(trimmed)}`);
  }

  return (
    <main className="page">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            Lead<span style={{ color: "#FF6B35" }}>TrackBack</span>
          </div>
          <div className="nav-links">
            <a href="#features">Funktioner</a>
            <a href="#how">Så funkar det</a>
            <a href="/widget/test.html">Live demo</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero reveal">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-left">
            <h1 className="hero-title">
              Fånga fler kunder<br />
              direkt från din sajt.
            </h1>
            <p className="hero-sub">
              AI-widget som fångar besökare med chat och callback —
              personaliserad till ditt varumärke på 60 sekunder.
            </p>

            <form
              className="url-form"
              onSubmit={(e) => {
                e.preventDefault();
                go(url);
              }}
            >
              <input
                type="text"
                className="url-input"
                placeholder="din-hemsida.se"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="url-btn">
                Personalize widget →
              </button>
            </form>

            <div className="pills">
              <span className="pill">⚡ Igång på 60 sek</span>
              <span className="pill">🎨 Anpassad till din sajt</span>
              <span className="pill">✓ Gratis preview</span>
            </div>
          </div>

          {/* Mockup */}
          <div className="hero-right" aria-hidden="true">
            <div className="mockup">
              <div className="mockup-bar">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <div className="mockup-url">din-hemsida.se</div>
              </div>
              <div className="mockup-body">
                <div className="mock-block mock-block--lg" />
                <div className="mock-row">
                  <div className="mock-block mock-block--sm" />
                  <div className="mock-block mock-block--sm" />
                </div>
                <div className="mock-block mock-block--md" />
                <div className="mock-row">
                  <div className="mock-block mock-block--sm" />
                  <div className="mock-block mock-block--sm" />
                  <div className="mock-block mock-block--sm" />
                </div>

                {/* Speech bubble */}
                <div className="bubble bubble-1">Hej! Hur kan vi hjälpa dig?</div>
                <div className="bubble bubble-2">Vi ringer dig inom 30 sek!</div>
                <div className="bubble bubble-3">Tack! Vi hör av oss snart.</div>

                {/* FAB */}
                <div className="fab">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="trust reveal">
        <div className="container">
          <p className="trust-label">BETRODD AV LEDANDE SVENSKA FÖRETAG</p>
          <div className="logos">
            <div className="logo-item">
              <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18" />
              </svg>
              <span className="logo-text logo-text--bold">Energy</span>
              <span className="logo-text logo-text--thin">Balance</span>
            </div>
            <div className="logo-item">
              <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 9h18M8 4v16" />
              </svg>
              <span className="logo-text logo-text--black">Byggdagboken</span>
            </div>
            <div className="logo-item">
              <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 20V6l8-3 8 3v14" />
                <path d="M9 20v-7h6v7" />
              </svg>
              <span className="logo-text logo-text--serif">Balder</span>
            </div>
            <div className="logo-item">
              <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 20h20M5 20V8l7-4 7 4v12" />
                <path d="M10 20v-5h4v5" />
              </svg>
              <span className="logo-text logo-text--bold">Bygglet</span>
            </div>
            <div className="logo-item">
              <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-9-9" />
                <path d="M21 3v6h-6" />
              </svg>
              <span className="logo-text logo-text--thin">Convendum</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wizard mockups */}
      <section className="wizard reveal">
        <div className="container">
          <h2 className="section-title">Från domän till live på 60 sekunder</h2>
          <div className="wizard-grid">
            <div className="wizard-card">
              <div className="wizard-step">Steg 1</div>
              <h3 className="wizard-title">Skriv in din domän</h3>
              <div className="wizard-shot">
                <div className="shot-label">URL</div>
                <div className="shot-input">
                  <span className="shot-input-text">din-hemsida.se</span>
                  <span className="shot-caret" />
                </div>
                <div className="shot-btn">Hämta sajt →</div>
              </div>
            </div>

            <div className="wizard-card">
              <div className="wizard-step">Steg 2</div>
              <h3 className="wizard-title">Vi anpassar widget:en</h3>
              <div className="wizard-shot">
                <div className="shot-label">Varumärke</div>
                <div className="shot-input shot-input--filled">
                  <span className="shot-input-text">Acme AB</span>
                </div>
                <div className="shot-label">Accent</div>
                <div className="shot-swatches">
                  <span className="swatch" style={{ background: "#FF6B35" }} />
                  <span className="swatch" style={{ background: "#2563EB" }} />
                  <span className="swatch" style={{ background: "#10B981" }} />
                  <span className="swatch" style={{ background: "#7C3AED" }} />
                  <span className="swatch" style={{ background: "#0F172A" }} />
                </div>
                <div className="shot-slider">
                  <div className="shot-slider-fill" />
                  <div className="shot-slider-handle" />
                </div>
              </div>
            </div>

            <div className="wizard-card">
              <div className="wizard-step">Steg 3</div>
              <h3 className="wizard-title">Klistra in koden</h3>
              <div className="wizard-shot wizard-shot--code">
                <div className="code-bar">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                  <span className="code-name">embed.html</span>
                </div>
                <pre className="code-block">
<span className="c-tag">&lt;script</span>{"\n"}
{"  "}<span className="c-attr">src</span>=<span className="c-str">&quot;https://ltb.io/w.js&quot;</span>{"\n"}
{"  "}<span className="c-attr">data-id</span>=<span className="c-str">&quot;acme&quot;</span>{"\n"}
<span className="c-tag">&gt;&lt;/script&gt;</span>
                </pre>
                <div className="shot-copy">Kopierad ✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features reveal">
        <div className="container">
          <h2 className="section-title">Allt du behöver för att fånga leads</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">AI-chat som förstår</h3>
              <p className="feature-text">
                Svarar på vanliga frågor direkt från din sajt
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">📞</div>
              <h3 className="feature-title">Callback på 30 sek</h3>
              <p className="feature-text">
                Besökaren begär samtal, du ringer inom 30 sek
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">📋</div>
              <h3 className="feature-title">Smart formulär</h3>
              <p className="feature-text">
                Samlar leads med automatisk HubSpot-sync
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="how reveal">
        <div className="container">
          <h2 className="section-title">Så funkar det</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3 className="step-title">Skriv in din domän</h3>
              <p className="step-text">
                Vi hämtar färger, logo och stil från din sajt automatiskt.
              </p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3 className="step-title">AI lär sig din sajt</h3>
              <p className="step-text">
                Widget:en tränas på ditt innehåll och svarar i din ton.
              </p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3 className="step-title">Klistra in koden — klar!</h3>
              <p className="step-text">
                En script-tag och du är igång. Allt redo på 60 sekunder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta reveal">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title">Redo att fånga fler leads?</h2>
          <form
            className="url-form url-form--center"
            onSubmit={(e) => {
              e.preventDefault();
              go(urlBottom);
            }}
          >
            <input
              type="text"
              className="url-input"
              placeholder="din-hemsida.se"
              value={urlBottom}
              onChange={(e) => setUrlBottom(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="url-btn">
              Personalize widget →
            </button>
          </form>
        </div>
      </section>

      {/* Built with */}
      <div className="built-with">
        Byggt med Next.js, Vercel &amp; Twilio.
      </div>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            Lead<span style={{ color: "#FF6B35" }}>TrackBack</span>
          </div>
          <div className="footer-meta">© 2026 LeadTrackBack</div>
        </div>
      </footer>

      <style jsx>{`
        :global(body) {
          background: #0f0f1a;
        }
        .page {
          position: relative;
          background: #0f0f1a;
          background-image:
            radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            radial-gradient(rgba(255, 107, 53, 0.04) 1px, transparent 1px);
          background-size: 32px 32px, 64px 64px;
          background-position: 0 0, 16px 16px;
          color: #f5f5f7;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
        }
        .nav {
          padding: 24px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          z-index: 2;
        }
        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .nav-links {
          display: flex;
          gap: 28px;
          font-size: 14px;
        }
        .nav-links a {
          color: rgba(245, 245, 247, 0.7);
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-links a:hover {
          color: #f5f5f7;
        }

        /* Hero */
        .hero {
          padding: 100px 0 80px;
          position: relative;
        }
        .hero-glow {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 640px;
          height: 640px;
          background: radial-gradient(
            circle at center,
            rgba(255, 107, 53, 0.22),
            rgba(255, 107, 53, 0) 60%
          );
          filter: blur(8px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .hero-left {
          text-align: left;
        }
        .hero-title {
          font-size: 64px;
          line-height: 1.05;
          margin: 0 0 24px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f5f5f7;
        }
        .hero-sub {
          font-size: 19px;
          line-height: 1.5;
          color: rgba(245, 245, 247, 0.7);
          max-width: 560px;
          margin: 0 0 36px;
        }
        .url-form {
          display: flex;
          align-items: center;
          background: #1a1a2a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 8px;
          max-width: 560px;
          gap: 8px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .url-form:focus-within {
          border-color: #ff6b35;
          box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.15);
        }
        .url-form--center {
          margin: 32px auto 0;
        }
        .url-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 14px 16px;
          font-size: 16px;
          color: #f5f5f7;
          font-family: inherit;
          min-width: 0;
        }
        .url-input::placeholder {
          color: rgba(245, 245, 247, 0.4);
        }
        .url-btn {
          background: #ff6b35;
          color: #fff;
          border: none;
          padding: 14px 22px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .url-btn:hover {
          background: #ff7e4e;
        }
        .url-btn:active {
          transform: translateY(1px);
        }
        .pills {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .pill {
          font-size: 13px;
          color: rgba(245, 245, 247, 0.7);
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }

        /* Mockup */
        .hero-right {
          position: relative;
        }
        .mockup {
          background: #fff;
          border-radius: 16px;
          box-shadow:
            0 30px 60px -20px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.06);
          overflow: hidden;
          transform: perspective(1200px) rotateY(-4deg) rotateX(2deg);
          transition: transform 0.4s ease;
          animation: float 6s ease-in-out infinite;
        }
        .mockup-bar {
          background: #f3f3f5;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid #e6e6ea;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-red { background: #ff5f57; }
        .dot-yellow { background: #febc2e; }
        .dot-green { background: #28c840; }
        .mockup-url {
          flex: 1;
          margin-left: 10px;
          background: #fff;
          border: 1px solid #e6e6ea;
          border-radius: 6px;
          font-size: 11px;
          color: #6b6b75;
          text-align: center;
          padding: 4px 10px;
        }
        .mockup-body {
          position: relative;
          padding: 20px;
          background: #fafafc;
          min-height: 320px;
        }
        .mock-block {
          background: linear-gradient(90deg, #e6e6ec, #ededf2, #e6e6ec);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: shimmer 4s linear infinite;
        }
        .mock-block--lg {
          height: 56px;
          margin-bottom: 14px;
        }
        .mock-block--md {
          height: 28px;
          margin: 14px 0;
        }
        .mock-block--sm {
          height: 70px;
          flex: 1;
        }
        .mock-row {
          display: flex;
          gap: 10px;
        }

        /* Bubbles */
        .bubble {
          position: absolute;
          right: 78px;
          bottom: 78px;
          background: #fff;
          color: #1a1a2a;
          font-size: 12px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 14px 14px 4px 14px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(15, 15, 26, 0.05);
          max-width: 220px;
          opacity: 0;
          animation: bubble-cycle 9s ease-in-out infinite;
        }
        .bubble-1 { animation-delay: 0s; }
        .bubble-2 { animation-delay: 3s; }
        .bubble-3 { animation-delay: 6s; }

        /* FAB */
        .fab {
          position: absolute;
          right: 20px;
          bottom: 20px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #ff6b35;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(255, 107, 53, 0.5),
            0 0 0 0 rgba(255, 107, 53, 0.6);
          animation: fab-bounce 2.6s ease-in-out infinite,
            fab-pulse 2.6s ease-out infinite;
        }

        /* Trust band */
        .trust {
          padding: 60px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          position: relative;
          z-index: 1;
        }
        .trust-label {
          font-size: 12px;
          letter-spacing: 0.15em;
          color: rgba(245, 245, 247, 0.5);
          text-align: center;
          margin: 0 0 28px;
        }
        .logos {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .logo-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(245, 245, 247, 0.55);
          transition: color 0.2s, transform 0.2s;
        }
        .logo-item:hover {
          color: rgba(245, 245, 247, 0.9);
        }
        .logo-svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        .logo-text {
          font-size: 17px;
          letter-spacing: -0.01em;
        }
        .logo-text--bold { font-weight: 800; }
        .logo-text--black { font-weight: 900; letter-spacing: -0.02em; }
        .logo-text--thin { font-weight: 300; }
        .logo-text--serif {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 700;
          font-style: italic;
        }

        /* Wizard */
        .wizard {
          padding: 90px 0 70px;
          position: relative;
        }
        .wizard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .wizard-card {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 24px;
          transition: transform 0.25s, border-color 0.25s;
        }
        .wizard-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 107, 53, 0.35);
        }
        .wizard-step {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #ff6b35;
          text-transform: uppercase;
        }
        .wizard-title {
          font-size: 18px;
          font-weight: 600;
          margin: 6px 0 18px;
          color: #f5f5f7;
        }
        .wizard-shot {
          background: #fff;
          color: #1a1a2a;
          border-radius: 12px;
          padding: 18px;
          box-shadow:
            0 18px 32px -16px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.04);
          min-height: 200px;
          position: relative;
        }
        .shot-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6b6b75;
          margin-bottom: 6px;
        }
        .shot-input {
          background: #fafafc;
          border: 1.5px solid #ff6b35;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 13px;
          color: #1a1a2a;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.12);
        }
        .shot-input--filled {
          border-color: #e6e6ea;
          box-shadow: none;
        }
        .shot-input-text {
          flex: 1;
        }
        .shot-caret {
          width: 1px;
          height: 14px;
          background: #1a1a2a;
          animation: blink 1s steps(1) infinite;
        }
        .shot-btn {
          background: #ff6b35;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 14px;
          border-radius: 8px;
          text-align: center;
        }
        .shot-swatches {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .swatch {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 0, 0, 0.08);
        }
        .swatch:first-child {
          box-shadow: 0 0 0 2px #fff, 0 0 0 3px #ff6b35;
        }
        .shot-slider {
          position: relative;
          height: 6px;
          background: #e6e6ea;
          border-radius: 999px;
        }
        .shot-slider-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 65%;
          background: #ff6b35;
          border-radius: 999px;
        }
        .shot-slider-handle {
          position: absolute;
          left: 65%;
          top: 50%;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2),
            0 0 0 1.5px #ff6b35;
        }

        .wizard-shot--code {
          background: #1a1a2a;
          color: #f5f5f7;
          padding: 0;
          overflow: hidden;
        }
        .code-bar {
          background: #25253a;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .code-name {
          margin-left: 8px;
          font-size: 11px;
          color: rgba(245, 245, 247, 0.6);
        }
        .code-block {
          font-family: "SF Mono", Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          line-height: 1.6;
          padding: 16px;
          margin: 0;
          white-space: pre;
          color: #d4d4d8;
        }
        .c-tag { color: #ff8a5b; }
        .c-attr { color: #7ed4ff; }
        .c-str { color: #9ee493; }
        .shot-copy {
          position: absolute;
          right: 12px;
          bottom: 12px;
          background: rgba(40, 200, 64, 0.18);
          color: #28c840;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        /* Features */
        .features {
          padding: 80px 0;
          position: relative;
        }
        .section-title {
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-align: center;
          margin: 0 0 56px;
          line-height: 1.15;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .feature {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 32px;
          transition: transform 0.25s, border-color 0.25s;
        }
        .feature:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 107, 53, 0.3);
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }
        .feature-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px;
        }
        .feature-text {
          font-size: 15px;
          line-height: 1.55;
          color: rgba(245, 245, 247, 0.65);
          margin: 0;
        }
        .how {
          padding: 80px 0;
          background: rgba(255, 255, 255, 0.02);
          position: relative;
        }
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .step {
          text-align: left;
        }
        .step-num {
          width: 40px;
          height: 40px;
          background: #ff6b35;
          color: #fff;
          border-radius: 10px;
          font-weight: 700;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .step-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px;
        }
        .step-text {
          font-size: 15px;
          line-height: 1.55;
          color: rgba(245, 245, 247, 0.65);
          margin: 0;
        }
        .final-cta {
          padding: 80px 0;
          position: relative;
        }
        .built-with {
          text-align: center;
          font-size: 13px;
          color: rgba(245, 245, 247, 0.35);
          padding: 0 24px 32px;
        }
        .footer {
          padding: 32px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: rgba(245, 245, 247, 0.6);
        }

        /* Section reveal */
        .reveal {
          opacity: 1;
          transform: none;
          animation: reveal-fade 0.8s ease both;
        }

        /* Keyframes */
        @keyframes float {
          0%, 100% {
            transform: perspective(1200px) rotateY(-4deg) rotateX(2deg) translateY(0);
          }
          50% {
            transform: perspective(1200px) rotateY(-4deg) rotateX(2deg) translateY(-8px);
          }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fab-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fab-pulse {
          0% {
            box-shadow: 0 10px 24px rgba(255, 107, 53, 0.5),
              0 0 0 0 rgba(255, 107, 53, 0.6);
          }
          70% {
            box-shadow: 0 10px 24px rgba(255, 107, 53, 0.5),
              0 0 0 18px rgba(255, 107, 53, 0);
          }
          100% {
            box-shadow: 0 10px 24px rgba(255, 107, 53, 0.5),
              0 0 0 0 rgba(255, 107, 53, 0);
          }
        }
        @keyframes bubble-cycle {
          0% { opacity: 0; transform: translateY(6px); }
          5% { opacity: 1; transform: translateY(0); }
          28% { opacity: 1; transform: translateY(0); }
          33% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 0; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes reveal-fade {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-left {
            text-align: center;
          }
          .hero-sub {
            margin-left: auto;
            margin-right: auto;
          }
          .url-form {
            margin-left: auto;
            margin-right: auto;
          }
          .pills {
            justify-content: center;
          }
          .mockup {
            transform: none;
            animation: none;
            max-width: 460px;
            margin: 0 auto;
          }
          .wizard-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 44px;
          }
          .hero-sub {
            font-size: 17px;
          }
          .section-title {
            font-size: 32px;
          }
          .features-grid,
          .steps {
            grid-template-columns: 1fr;
          }
          .url-form {
            flex-direction: column;
            align-items: stretch;
            padding: 12px;
          }
          .url-btn {
            width: 100%;
          }
          .logos {
            justify-content: center;
          }
          .nav-links {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mockup,
          .mock-block,
          .fab,
          .bubble,
          .shot-caret,
          .reveal {
            animation: none !important;
          }
          .bubble-1 { opacity: 1; }
          .bubble-2, .bubble-3 { display: none; }
        }
      `}</style>
    </main>
  );
}
