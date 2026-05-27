import { test, expect } from "@playwright/test";

test.describe("Widget script", () => {
  test("widget JS is served with javascript content-type", async ({ request }) => {
    const res = await request.get("/widget/leadwidget.js");
    expect(res.status()).toBe(200);
    const contentType = res.headers()["content-type"] || "";
    expect(contentType).toContain("javascript");
    const body = await res.text();
    expect(body).toContain("LeadWidget");
  });

  test("widget test page loads", async ({ page }) => {
    await page.goto("/widget/test.html");
    await expect(page.getByText(/Leadwidget Preview/i)).toBeVisible();
  });
});

test.describe("CORS preflight", () => {
  test("/api/widget/chat OPTIONS returns 204 with CORS header", async ({ request }) => {
    const res = await request.fetch("/api/widget/chat", { method: "OPTIONS" });
    expect(res.status()).toBe(204);
    const headers = res.headers();
    expect(headers["access-control-allow-origin"]).toBeDefined();
  });
});
