export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
      padding: "40px",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      color: "white",
    }}>
      <h1 style={{ fontSize: "48px", margin: 0, fontWeight: 700 }}>
        Lead<span style={{ color: "#FF6B35" }}>TrackBack</span>
      </h1>
      <p style={{ fontSize: "18px", opacity: 0.85, maxWidth: "560px", textAlign: "center", lineHeight: 1.6 }}>
        An embeddable lead capture widget — chat, callback, and contact form.
        Plug into any website with one script tag.
      </p>

      <div style={{
        background: "rgba(0,0,0,0.4)",
        padding: "20px 28px",
        borderRadius: "10px",
        fontFamily: "ui-monospace, monospace",
        fontSize: "14px",
        color: "#4ade80",
        marginTop: "16px",
        maxWidth: "600px",
        overflowX: "auto",
      }}>
        <pre style={{ margin: 0 }}>{`<script src="https://leadtrackback.vercel.app/widget/leadwidget.js"
  data-company="Your Company"
  data-color="#FF6B35"></script>`}</pre>
      </div>

      <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
        <a href="/widget/test.html" style={{
          padding: "12px 28px",
          background: "#FF6B35",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: 600,
        }}>
          See live demo →
        </a>
        <a href="https://github.com/nils-bit/Leadtrackback" target="_blank" rel="noreferrer" style={{
          padding: "12px 28px",
          background: "rgba(255,255,255,0.1)",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: 600,
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          GitHub
        </a>
      </div>
    </main>
  );
}
