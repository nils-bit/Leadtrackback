import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadTrackBack — Embeddable lead capture widget",
  description: "Three-tab lead capture widget: Chat, Callback, and Form. Plug into any site.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
