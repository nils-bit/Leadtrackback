/**
 * POST /api/widget/test-lead
 *
 * Sends a test lead notification email to the configured NOTIFY_EMAIL so that
 * the user can confirm email delivery during onboarding. Triggered by the
 * "Send test lead" button in the onboarding wizard.
 *
 * Returns 503 with a descriptive error if RESEND_API_KEY is not configured.
 */

import { optionsResponse, jsonResponse } from "../cors";
import { notifyNewLead } from "@/lib/notify";
import { notifyCallbackSMS } from "@/lib/sms";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return jsonResponse(
      { ok: false, error: "RESEND_API_KEY not configured" },
      request,
      503,
    );
  }

  try {
    await Promise.allSettled([
      notifyNewLead("form", {
        name: "Test Lead",
        email: "test@example.com",
        phone: "070-000 00 00",
        message:
          "Detta är en test-lead från ditt LeadTrackBack-widget för att verifiera att notifieringar fungerar.",
        pageUrl: "https://leadtrackback.vercel.app/install",
      }),
      notifyCallbackSMS({
        name: "Test",
        phone: "+46700000000",
        pageUrl: "https://leadtrackback.vercel.app/install",
      }),
    ]);

    return jsonResponse({ ok: true, message: "Test lead sent" }, request);
  } catch (e) {
    return jsonResponse(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Failed to send test lead",
      },
      request,
      500,
    );
  }
}
