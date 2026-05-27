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
      <section className="hero">
        <div className="container">
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
      </section>

      {/* Trust band */}
      <section className="trust">
        <div className="container">
          <p className="trust-label">BETRODD AV LEDANDE SVENSKA FÖRETAG</p>
          <div className="logos">
            <div className="logo-item">Energy Balance</div>
            <div className="logo-item">Byggdagboken</div>
            <div className="logo-item">Balder</div>
            <div className="logo-item">Bygglet</div>
            <div className="logo-item">Convendum</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
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
      <section id="how" className="how">
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
      <section className="final-cta">
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
          background: #0f0f1a;
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
        }
        .nav {
          padding: 24px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
        .hero {
          padding: 100px 0 80px;
          text-align: center;
        }
        .hero-title {
          font-size: 72px;
          line-height: 1.05;
          margin: 0 0 24px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f5f5f7;
        }
        .hero-sub {
          font-size: 20px;
          line-height: 1.5;
          color: rgba(245, 245, 247, 0.7);
          max-width: 640px;
          margin: 0 auto 48px;
        }
        .url-form {
          display: flex;
          align-items: center;
          background: #1a1a2a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 8px;
          max-width: 560px;
          margin: 0 auto;
          gap: 8px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .url-form:focus-within {
          border-color: #ff6b35;
          box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.15);
        }
        .url-form--center {
          margin-top: 32px;
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
          justify-content: center;
          gap: 12px;
          margin-top: 28px;
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
        .trust {
          padding: 60px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
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
          font-size: 18px;
          font-weight: 600;
          color: rgba(245, 245, 247, 0.45);
          letter-spacing: -0.01em;
        }
        .features {
          padding: 80px 0;
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
      `}</style>
    </main>
  );
}
