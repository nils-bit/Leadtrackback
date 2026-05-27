import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders headline, URL input, and personalize button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Fånga fler kunder")).toBeVisible();
    // Any visible input that takes a URL
    await expect(page.locator("input").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Personalize widget/i })).toBeVisible();
  });

  test("submitting a URL navigates to /install", async ({ page }) => {
    await page.goto("/");
    await page.locator("input").first().fill("purasu.agency");
    await page.getByRole("button", { name: /Personalize widget/i }).click();
    await expect(page).toHaveURL(/\/install\?url=purasu\.agency/);
    await expect(page.getByText("Din widget är klar")).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("Install wizard", () => {
  test("auto-detects branding from URL", async ({ page }) => {
    await page.goto("/install?url=purasu.agency");

    // The company name input gets populated by the detect API call.
    const companyInput = page.locator("input").first();
    await expect(companyInput).toHaveValue(/.+/, { timeout: 15_000 });

    // Find color input — could be a color picker or a text input starting with "#"
    const colorInputs = page.locator('input[type="color"], input[value^="#"]');
    await expect(colorInputs.first()).toBeVisible({ timeout: 15_000 });
    const colorValue = await colorInputs.first().inputValue();
    expect(colorValue.startsWith("#")).toBe(true);

    // The script snippet should reference data-company
    await expect(page.locator("pre, code").filter({ hasText: "data-company" }).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("copy code button confirms copy", async ({ page, context }) => {
    // Allow clipboard access
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/install?url=purasu.agency");

    // Wait for code block to be present
    await expect(page.locator("pre, code").filter({ hasText: "data-company" }).first()).toBeVisible({
      timeout: 15_000,
    });

    const copyBtn = page.getByRole("button", { name: /Kopiera kod/i });
    await copyBtn.click();

    // The button should show a "Kopierat" confirmation or similar
    await expect(page.getByText(/Kopierat/i)).toBeVisible({ timeout: 5_000 });
  });

  test("platform tabs switch instructions", async ({ page }) => {
    await page.goto("/install?url=purasu.agency");

    // Wait for content to load
    await expect(page.locator("pre, code").filter({ hasText: "data-company" }).first()).toBeVisible({
      timeout: 15_000,
    });

    // HubSpot CMS tab
    await page.getByRole("button", { name: /HubSpot CMS/i }).click();
    await expect(page.getByText(/Site footer HTML/i)).toBeVisible({ timeout: 5_000 });

    // WordPress tab
    await page.getByRole("button", { name: /WordPress/i }).click();
    await expect(page.getByText(/footer\.php|Theme File Editor/i)).toBeVisible({ timeout: 5_000 });
  });

  test("test lead button shows a result state", async ({ page }) => {
    await page.goto("/install?url=purasu.agency");

    // Wait for page to be settled
    await expect(page.locator("pre, code").filter({ hasText: "data-company" }).first()).toBeVisible({
      timeout: 15_000,
    });

    const testBtn = page.getByRole("button", { name: /Skicka test-lead/i });
    await testBtn.scrollIntoViewIfNeeded();
    await testBtn.click();

    // Wait for either success (✓) or failure (✗) marker
    await expect(page.getByText(/✓|✗/)).toBeVisible({ timeout: 20_000 });
  });
});
