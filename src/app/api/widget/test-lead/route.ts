/**
 * POST /api/widget/test-lead
 *
 * Sends a test lead notification through every channel that is configured
 * (email via Resend and SMS via Twilio). Triggered by the "Send test lead"
 * button in the onboarding wizard. Reports which channels were attempted so
 * the UI can show partial-success states.
 */

import { optionsResponse, jsonResponse } from "../cors";
import { notifyNewLead } from "@/lib/notify";
import { notifyCallbackSMS } from "@/lib/sms";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  const hasEmail = !!process.env.RESEND_API_KEY;
  const hasSMS = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM &&
    process.env.NOTIFY_PHONE
  );

  if (!hasEmail && !hasSMS) {
    return jsonResponse(
      {
        ok: false,
        error:
          "No notification channels configured. Set RESEND_API_KEY for email or TWILIO_* + NOTIFY_PHONE for SMS.",
      },
      request,
      503,
    );
  }

  const tasks: Promise<unknown>[] = [];
  if (hasEmail) {
    tasks.push(
      notifyNewLead("form", {
        name: "Test Lead",
        email: "test@example.com",
        phone: "070-000 00 00",
        message:
          "Detta är en test-lead från ditt LeadTrackBack-widget för att verifiera att notifieringar fungerar.",
        pageUrl: "https://leadtrackback.vercel.app/install",
      }),
    );
  }
  if (hasSMS) {
    tasks.push(
      notifyCallbackSMS({
        name: "Test Lead",
        phone: "+46700000000",
        pageUrl: "https://leadtrackback.vercel.app/install",
      }),
    );
  }

  await Promise.allSettled(tasks);

  return jsonResponse(
    {
      ok: true,
      channels: {
        email: hasEmail,
        sms: hasSMS,
      },
      message: `Test lead sent via ${[hasEmail && "email", hasSMS && "SMS"].filter(Boolean).join(" + ")}`,
    },
    request,
  );
}
