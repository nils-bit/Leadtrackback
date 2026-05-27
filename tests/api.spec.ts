import { test, expect } from "@playwright/test";

test.describe("POST /api/widget/chat", () => {
  test("responds to pricing question with a reply", async ({ request }) => {
    const res = await request.post("/api/widget/chat", {
      data: { message: "vad kostar det?" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.reply).toBe("string");
    expect(body.reply.length).toBeGreaterThan(0);
  });

  test("responds to Swedish greeting", async ({ request }) => {
    const res = await request.post("/api/widget/chat", {
      data: { message: "hej" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.reply).toBe("string");
    expect(body.reply.length).toBeGreaterThan(0);
  });

  test("rejects missing message with 400", async ({ request }) => {
    const res = await request.post("/api/widget/chat", {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test("returns a default fallback for gibberish", async ({ request }) => {
    const res = await request.post("/api/widget/chat", {
      data: { message: "qwerty random gibberish xyz" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.reply).toBe("string");
    expect(body.reply.length).toBeGreaterThan(0);
  });
});

test.describe("POST /api/widget/callback", () => {
  test("accepts a valid callback request", async ({ request }) => {
    const res = await request.post("/api/widget/callback", {
      data: {
        name: "Test",
        phone: "+46701234567",
        pageUrl: "https://test.example",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("rejects missing phone with 400", async ({ request }) => {
    const res = await request.post("/api/widget/callback", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });
});

test.describe("POST /api/widget/lead", () => {
  test("accepts a valid lead", async ({ request }) => {
    const res = await request.post("/api/widget/lead", {
      data: {
        name: "Test",
        email: "test@example.com",
        message: "hi",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("rejects when no email or phone provided", async ({ request }) => {
    const res = await request.post("/api/widget/lead", {
      data: { name: "No contact" },
    });
    expect(res.status()).toBe(400);
  });
});

test.describe("POST /api/widget/test-lead", () => {
  test("returns channel status and message", async ({ request }) => {
    const res = await request.post("/api/widget/test-lead", {
      data: {},
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.channels).toBeDefined();
    expect(typeof body.channels.email).toBe("boolean");
    expect(typeof body.channels.sms).toBe("boolean");
    expect(typeof body.message).toBe("string");
  });
});

test.describe("POST /api/onboard/detect", () => {
  test("detects branding for a real domain", async ({ request }) => {
    const res = await request.post("/api/onboard/detect", {
      data: { url: "purasu.agency" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.company).toBeDefined();
    expect(body.color).toBeDefined();
    expect(body.url).toBeDefined();
  });

  test("rejects localhost with 400", async ({ request }) => {
    const res = await request.post("/api/onboard/detect", {
      data: { url: "localhost" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects missing url with 400", async ({ request }) => {
    const res = await request.post("/api/onboard/detect", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });
});

test.describe("POST /api/onboard/verify", () => {
  test("reports installed=false on marketing site", async ({ request }) => {
    const res = await request.post("/api/onboard/verify", {
      data: { url: "https://leadtrackback.vercel.app/" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.installed).toBe(false);
  });

  test("rejects missing url with 400", async ({ request }) => {
    const res = await request.post("/api/onboard/verify", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });
});
